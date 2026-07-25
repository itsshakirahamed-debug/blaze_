"""
analyze.py
----------
FastAPI route for contract analysis.

Supports three analysis modes selected by the user on the Upload page:

  fast     — ML classifier + ML risk scorer + Smart Gemini Skip.
             Skips Gemini for confidently low-risk clauses (~40% fewer API calls).
             Skips AI Intelligence layer entirely (Executive Summary etc.).
             Estimated time: 5–10 seconds.

  balanced — ML classifier + ML risk scorer + full parallel Gemini for all clauses.
             Includes AI Intelligence layer (Executive Summary, Recommendation,
             Negotiation Suggestions) fired in parallel after TrustGuard.
             Estimated time: 15–25 seconds. (DEFAULT)

  deep     — ML classifier + ML risk scorer + full Gemini with richer prompts.
             Includes full AI Intelligence layer. No clause skipping.
             Estimated time: 30–60 seconds.
"""

import os
import asyncio
from fastapi import APIRouter, UploadFile, File, Form, Body
from fastapi.responses import FileResponse

from app.services.pdf_reader import extract_pdf_text
from app.services.docx_reader import extract_docx_text
from app.services.preprocess import clean_text
from app.services.clause_splitter import split_into_clauses
from app.services.classifier import classify_clause
from app.services.risk_predictor import predict_risk
from app.services.ai_explainer import explain_clause_async
from app.services.gemini_skip_classifier import should_skip_gemini, get_template_explanation
from app.services.trustguard.trust_engine import calculate_trust_and_scam_metrics
from app.services.report_generator import generate_pdf_report
from app.services.gemini_service import (
    generate_executive_summary,
    generate_final_recommendation,
    generate_negotiation_suggestions,
    group_similar_clauses,
)

router = APIRouter()

UPLOAD_FOLDER = "uploads"
REPORT_FOLDER = "reports"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(REPORT_FOLDER, exist_ok=True)

VALID_MODES = {"fast", "balanced", "deep"}


# ─── Per-mode Gemini explanation dispatcher ───────────────────────────────────

async def _get_explanation(clause: str, clause_type: str, risk: str, mode: str) -> str:
    """
    Dispatch clause explanation based on selected mode.

    fast     → check skip classifier first; use template for low-risk
    balanced → always call Gemini (parallelised by caller)
    deep     → always call Gemini with a richer prompt
    """
    if mode == "fast":
        skip, _ = should_skip_gemini(clause)
        if skip and risk == "Low":
            return get_template_explanation(clause_type)
        return await explain_clause_async(clause, clause_type, risk)

    if mode == "deep":
        return await _deep_explain(clause, clause_type, risk)

    # balanced (default)
    return await explain_clause_async(clause, clause_type, risk)


async def _deep_explain(clause: str, clause_type: str, risk: str) -> str:
    """Richer Gemini prompt used in Deep Analysis mode."""
    from google import genai
    from google.genai.errors import ServerError
    from dotenv import load_dotenv
    load_dotenv()

    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    snippet = clause[:800] if len(clause) > 800 else clause

    prompt = (
        f"You are a senior contract lawyer reviewing a {clause_type} clause rated {risk} risk.\n\n"
        f'Clause:\n"{snippet}"\n\n'
        f"Provide a thorough analysis (max 150 words) covering:\n"
        f"1. Key risk: What specifically makes this clause risky?\n"
        f"2. Who benefits: Does this clause favour one party?\n"
        f"3. Negotiation tip: One specific, actionable improvement.\n"
        f"Write in plain English — no legal jargon."
    )

    try:
        response = await asyncio.to_thread(
            client.models.generate_content,
            model="gemini-2.0-flash-lite",
            contents=prompt,
        )
        return response.text.strip()
    except ServerError:
        return "AI analysis temporarily unavailable. Re-upload the document to retry."
    except Exception as e:
        err = str(e)
        if any(k in err.lower() for k in ("429", "quota", "resource_exhausted", "rate")):
            return "AI quota limit reached. Analysis will resume shortly."
        return "AI analysis unavailable for this clause."


# ─── Main Route ───────────────────────────────────────────────────────────────

@router.post("/analyze")
async def analyze_contract(
    file: UploadFile = File(...),
    mode: str = Form(default="balanced"),
):
    """
    Main contract analysis endpoint.

    Accepts an optional `mode` form field:  fast | balanced | deep
    Falls back to 'balanced' if the value is missing or unrecognised.
    """
    if mode not in VALID_MODES:
        mode = "balanced"

    # ── 1. Save uploaded file ─────────────────────────────────────────────────
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # ── 2. Extract & clean text ───────────────────────────────────────────────
    ext = file.filename.lower()
    if ext.endswith(".pdf"):
        text = extract_pdf_text(file_path)
    elif ext.endswith(".docx"):
        text = extract_docx_text(file_path)
    else:
        return {"error": "Only PDF and DOCX files are supported."}

    text = clean_text(text)

    # ── 3. Classify + Score (CPU, instant) ───────────────────────────────────
    clauses = split_into_clauses(text)

    classified = []
    total_score = 0

    for index, clause in enumerate(clauses, start=1):
        clause_type = classify_clause(clause)       # ML: TF-IDF + LR
        risk = predict_risk(clause_type, clause)    # ML: TF-IDF + Ridge
        total_score += risk["score"]
        classified.append({
            "index":       index,
            "clause":      clause,
            "clause_type": clause_type,
            "risk":        risk,
        })

    # ── 4. Parallel AI explanations (mode-aware) ──────────────────────────────
    explanations = await asyncio.gather(*[
        _get_explanation(item["clause"], item["clause_type"], item["risk"]["risk"], mode)
        for item in classified
    ])

    analysis = [
        {
            "clause_number":  item["index"],
            "clause_type":    item["clause_type"],
            "risk_level":     item["risk"]["risk"],
            "risk_score":     item["risk"]["score"],
            "clause_text":    item["clause"],
            "ai_explanation": explanation,
        }
        for item, explanation in zip(classified, explanations)
    ]

    # ── 5. Overall risk ───────────────────────────────────────────────────────
    overall_score = (total_score / len(analysis)) if analysis else 0
    overall_risk = (
        "High"   if overall_score >= 80 else
        "Medium" if overall_score >= 50 else
        "Low"
    )

    # ── 6. TrustGuard (always runs, mode-independent) ─────────────────────────
    trustguard_data = await asyncio.to_thread(
        calculate_trust_and_scam_metrics, file_path, text, clauses
    )

    # ── 7. Signing Recommendation (always active, rule/ML-based — no API calls) ──
    high_risk_count = sum(1 for c in analysis if c.get("risk_level") == "High")

    recommendation_data = generate_final_recommendation(
        trust_score=trustguard_data["trust_score"],
        overall_score=overall_score,
        scam_probability=trustguard_data["scam_probability"],
        fraud_flags=trustguard_data["fraud_flags"],
        company_verified=trustguard_data["company_verified"],
        metadata_health=trustguard_data["metadata_health"],
        signature_status=trustguard_data["signature_status"],
        high_risk_count=high_risk_count,
        missing_clauses_count=len(trustguard_data["missing_clauses"]),
    )

    # ── 8. AI Summary & Negotiation (called in balanced/deep modes) ───────────
    executive_summary = None
    negotiation_suggestions = []

    if mode in ("balanced", "deep"):
        executive_summary, negotiation_suggestions = await asyncio.gather(
            asyncio.to_thread(
                generate_executive_summary,
                document_text=text,
                overall_risk=overall_risk,
                trust_score=trustguard_data["trust_score"],
                scam_probability=trustguard_data["scam_probability"],
                missing_clauses=trustguard_data["missing_clauses"],
                fraud_flags=trustguard_data["fraud_flags"],
                contradictions=trustguard_data["contradictions"],
            ),
            asyncio.to_thread(
                generate_negotiation_suggestions,
                high_risk_clauses=analysis,
            ),
        )

    # ── 9. Group similar clauses for category summary card display ─────────────
    grouped_analysis = group_similar_clauses(analysis)

    # ── 10. Return full response ───────────────────────────────────────────────
    return {
        "filename":          file.filename,
        "characters":        len(text),
        "number_of_clauses": len(analysis),
        "overall_risk":      overall_risk,
        "overall_score":     round(overall_score, 2),
        "analysis_mode":     mode,                   # ← returned so UI can display it

        # TrustGuard (all preserved — backward compatible)
        "trust_score":          trustguard_data["trust_score"],
        "scam_probability":     trustguard_data["scam_probability"],
        "authenticity_status":  trustguard_data["authenticity_status"],
        "duplicate_similarity": trustguard_data["duplicate_similarity"],
        "metadata_health":      trustguard_data["metadata_health"],
        "signature_status":     trustguard_data["signature_status"],
        "company_verified":     trustguard_data["company_verified"],
        "layout_status":        trustguard_data["layout_status"],
        "missing_clauses":      trustguard_data["missing_clauses"],
        "contradictions":       trustguard_data["contradictions"],
        "fraud_flags":          trustguard_data["fraud_flags"],
        "trustguard_details": {
            "breakdown":       trustguard_data["breakdown"],
            "trust_breakdown": trustguard_data["trust_breakdown"],
            "company_info":    trustguard_data["company_info"],
            "metadata_info":   trustguard_data["metadata_info"],
            "template_info":   trustguard_data["template_info"],
        },

        # AI Intelligence
        "executive_summary":           executive_summary,
        "recommendation":              recommendation_data.get("recommendation"),
        "recommendation_reason":       recommendation_data.get("recommendation_reason"),
        "recommendation_explanation":  recommendation_data.get("recommendation_explanation"),
        "negotiation_suggestions":     negotiation_suggestions,

        "analysis":         analysis,
        "grouped_analysis": grouped_analysis,
    }


@router.post("/download-report")
async def download_report(payload: dict = Body(...)):
    """Generates and returns an exportable PDF audit report."""
    filename  = payload.get("filename", "contract.pdf")
    safe_name = os.path.splitext(filename)[0] + "_TrustGuard_Report.pdf"
    report_path = os.path.join(REPORT_FOLDER, safe_name)
    await asyncio.to_thread(generate_pdf_report, payload, report_path)
    return FileResponse(path=report_path, filename=safe_name, media_type="application/pdf")
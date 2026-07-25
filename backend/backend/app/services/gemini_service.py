"""
gemini_service.py
-----------------
Central Gemini AI service for BlazeAI Contract Intelligence Platform.

Provides:
  - generate_executive_summary()   → Plain-English contract overview
  - generate_recommendation()      → Actionable signing verdict + reason
  - generate_negotiation_suggestions() → Per-clause safer-wording suggestions
"""

import os
from dotenv import load_dotenv
from google import genai
from google.genai.errors import ServerError
from typing import List, Dict, Any

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "gemini-2.0-flash-lite"


def _safe_generate(prompt: str, fallback: Any) -> str:
    """Wrapper that safely calls Gemini and returns a fallback on any error."""
    try:
        response = client.models.generate_content(model=MODEL, contents=prompt)
        return response.text.strip()
    except ServerError:
        return fallback if isinstance(fallback, str) else str(fallback)
    except Exception as e:
        return f"Analysis unavailable: {str(e)}"


# ---------------------------------------------------------------------------
# 1. AI Executive Summary
# ---------------------------------------------------------------------------

def generate_executive_summary(
    document_text: str,
    overall_risk: str,
    trust_score: int,
    scam_probability: int,
    missing_clauses: List[str],
    fraud_flags: List[str],
    contradictions: List[str],
) -> str:
    """
    Generates a concise plain-English executive summary of the contract.
    Returns a 3-4 sentence paragraph suitable for non-legal readers.
    """
    missing_str = ", ".join(missing_clauses) if missing_clauses else "None"
    flags_str = ", ".join(fraud_flags) if fraud_flags else "None"
    contradictions_str = ", ".join(contradictions[:3]) if contradictions else "None"

    prompt = f"""
You are a senior legal analyst. Summarize the following contract analysis for a non-lawyer in plain English.

Analysis Data:
- Overall Legal Risk: {overall_risk}
- Trust Score: {trust_score}/100
- Scam Probability: {scam_probability}%
- Missing Clauses: {missing_str}
- Fraud Flags: {flags_str}
- Internal Contradictions: {contradictions_str}

Contract Excerpt (first 1500 chars):
{document_text[:1500]}

Write a 3-sentence executive summary:
1. State the contract type and overall risk level.
2. Mention the key concerns (missing clauses, fraud flags, contradictions) in simple language.
3. Give a one-sentence actionable recommendation.

Keep it under 100 words. No bullet points. Plain paragraph only.
"""
    return _safe_generate(
        prompt,
        fallback=f"This contract carries a {overall_risk.lower()} legal risk level with a trust score of {trust_score}/100. "
                 f"Key concerns include: {missing_str} clauses missing and {flags_str} flags detected. "
                 f"Review with a qualified legal professional before proceeding."
    )


# ---------------------------------------------------------------------------
# 2. AI Recommendation Engine
# ---------------------------------------------------------------------------

RECOMMENDATION_LEVELS = {
    "safe":      "🟢 Safe to Sign",
    "review":    "🟡 Review with Legal Team",
    "negotiate": "🟠 Negotiate Before Signing",
    "danger":    "🔴 Do Not Sign",
}


def generate_final_recommendation(
    trust_score: int,
    overall_score: float,
    scam_probability: int,
    fraud_flags: List[str],
    company_verified: bool,
    metadata_health: int,
    signature_status: str,
    high_risk_count: int,
) -> Dict[str, str]:
    """
    Centralized recommendation engine that computes the final contract signing verdict
    based on a combined weighted assessment of authenticity and legal risks.
    """
    # 1. Define Trust & Risk States
    is_high_trust = trust_score >= 70
    
    is_low_risk = overall_score < 40
    is_med_risk = 40 <= overall_score < 70
    is_high_risk = overall_score >= 70
    
    # 2. Select Case Verdict (rules matching case 1 to 5)
    if is_high_trust:
        if is_low_risk:
            verdict = "✅ Safe to Sign"
            message = "This contract appears authentic and contains minimal legal risks. It is generally safe to proceed, though reviewing important clauses is still recommended."
        elif is_med_risk:
            verdict = "⚠️ Safe to Sign, but Review Carefully"
            message = "The document is authentic, but several clauses contain moderate legal risks. Review the highlighted clauses before signing."
        else: # is_high_risk
            verdict = "⚠️ Authentic Document, but Legally Risky"
            message = "The document appears genuine, however multiple high-risk clauses were detected. Legal review is recommended before signing."
    else: # is_low_trust
        if is_high_risk:
            verdict = "❌ Do Not Sign"
            message = "This document shows both authenticity concerns and significant legal risks. Signing is not recommended until further verification."
        else: # low or med risk
            verdict = "⚠️ Verify Authenticity First"
            message = "The legal content appears acceptable, but the authenticity of the document could not be fully verified."

    # 3. Risk Score Explanation Reason
    fraud_label = ", ".join(fraud_flags) if fraud_flags else "None"
    comp_label = "Yes" if company_verified else "No"
    
    # Clean the emoji out for the explanation text
    clean_verdict = verdict.replace("✅ ", "").replace("⚠️ ", "").replace("❌ ", "")
    
    reason = (
        f"Authenticity Score: {trust_score}/100 | "
        f"Legal Risk Score: {round(overall_score)}/100 | "
        f"High Risk Clauses: {high_risk_count} | "
        f"Fraud Detection: {fraud_label} | "
        f"Company Verified: {comp_label} | "
        f"Final Recommendation: {clean_verdict}."
    )
    
    return {
        "recommendation": verdict,
        "recommendation_reason": message,
        "recommendation_explanation": reason
    }


# ---------------------------------------------------------------------------
# 3. Negotiation Suggestions Engine
# ---------------------------------------------------------------------------

def generate_negotiation_suggestions(
    high_risk_clauses: List[Dict[str, Any]],
) -> List[Dict[str, str]]:
    """
    For each High-risk clause, generates:
      - original_text: the clause as-is
      - suggested_text: a safer rewritten version
      - explanation: why the original is risky and what the suggestion achieves

    Only processes up to 5 high-risk clauses to manage API quota.
    """
    suggestions = []
    # Limit to top 5 high-risk clauses to manage Gemini quota
    clauses_to_process = [c for c in high_risk_clauses if c.get("risk_level") == "High"][:5]

    for clause in clauses_to_process:
        clause_text = clause.get("clause_text", "")
        clause_type = clause.get("clause_type", "Unknown")

        if not clause_text or len(clause_text.strip()) < 20:
            continue

        prompt = f"""
You are a legal contract negotiation expert.

Contract Clause Type: {clause_type}
Original Clause:
\"\"\"{clause_text[:600]}\"\"\"

This clause has been flagged as HIGH RISK.

Provide:
1. A safer alternative version of this clause (max 2 sentences).
2. A brief 1-sentence explanation of why the original is risky and what your version improves.

Respond in this exact format:
SUGGESTED: <your safer clause text here>
EXPLANATION: <your 1-sentence explanation here>
"""

        raw = _safe_generate(
            prompt,
            fallback=f"SUGGESTED: Review this clause with legal counsel before signing.\nEXPLANATION: This clause may create unfair obligations."
        )

        suggested = "Consult legal counsel for a safer version of this clause."
        explanation = "This clause contains terms that may be unfavorable or risky."

        try:
            for line in raw.strip().splitlines():
                if line.upper().startswith("SUGGESTED:"):
                    suggested = line.split(":", 1)[1].strip()
                elif line.upper().startswith("EXPLANATION:"):
                    explanation = line.split(":", 1)[1].strip()
        except Exception:
            pass

        suggestions.append({
            "clause_type": clause_type,
            "original_text": clause_text[:400],
            "suggested_text": suggested,
            "explanation": explanation,
        })

    return suggestions


def group_similar_clauses(analysis_items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Groups unique clauses by category (clause_type), calculates aggregate risk
    (highest risk of members), and creates a category-level summary description.
    """
    grouped = {}
    for item in analysis_items:
        c_type = item.get("clause_type", "Other")
        if c_type not in grouped:
            grouped[c_type] = []
        grouped[c_type].append(item)

    grouped_list = []
    for c_type, items in grouped.items():
        if not items:
            continue

        count = len(items)
        highest_score = max(item.get("risk_score", 0) for item in items)
        
        highest_risk = "Low"
        if any(item.get("risk_level") == "High" for item in items):
            highest_risk = "High"
        elif any(item.get("risk_level") == "Medium" for item in items):
            highest_risk = "Medium"

        if count == 1:
            agg_expl = items[0].get("ai_explanation", "Explanation unavailable.")
        else:
            agg_expl = f"Multiple {c_type.lower()}-related clauses were detected in this agreement ({count} clauses). Key concerns involve potential one-sided obligations, compliance guidelines, or liability allocations that require careful review."

        grouped_list.append({
            "clause_type": c_type,
            "detected_count": count,
            "risk_level": highest_risk,
            "risk_score": highest_score,
            "ai_explanation": agg_expl,
            "clauses": items
        })

    grouped_list.sort(key=lambda x: x["risk_score"], reverse=True)
    return grouped_list

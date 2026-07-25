from typing import Dict, Any, List

from app.services.trustguard.metadata_analyzer import analyze_metadata
from app.services.trustguard.duplicate_detector import detect_duplicates
from app.services.trustguard.consistency_checker import check_internal_consistency
from app.services.trustguard.company_verifier import verify_company_info
from app.services.trustguard.fraud_pattern_detector import detect_fraud_patterns
from app.services.trustguard.missing_clause_detector import check_missing_clauses
from app.services.trustguard.signature_verifier import verify_digital_signature
from app.services.trustguard.ocr_tamper_detector import detect_ocr_tampering
from app.services.trustguard.layout_analyzer import analyze_layout_manipulation
from app.services.trustguard.template_analyzer import analyze_template_similarity

def calculate_trust_and_scam_metrics(file_path: str, document_text: str, clauses: List[str]) -> Dict[str, Any]:
    """
    Runs the 10-layer TrustGuard verification pipeline and computes authentic Trust Score and Scam Probability.
    """
    # 1. Metadata Analysis (10%)
    meta_res = analyze_metadata(file_path)
    meta_score = meta_res["metadata_health"]
    
    # 2. Duplicate Detection (15%)
    dup_res = detect_duplicates(file_path, document_text)
    dup_score = max(0, 100 - (dup_res["duplicate_similarity"] * 0.5 if dup_res["duplicate_similarity"] > 40 else 0))
    
    # 3. Signature Verification (15%)
    sig_res = verify_digital_signature(file_path)
    sig_status = sig_res["signature_status"]
    if sig_status == "Valid":
        sig_score = 100
    elif sig_status == "Not Present":
        sig_score = 50
    elif sig_status == "Not Applicable":
        sig_score = 80
    else:
        sig_score = 0  # Invalid / Suspicious
    
    # 4. OCR Verification (10%)
    ocr_res = detect_ocr_tampering(file_path, document_text)
    ocr_score = 20 if ocr_res["tampering_detected"] else 100
    
    # 5. Company Verification (15%)
    comp_res = verify_company_info(document_text)
    comp_score = 100 if comp_res["company_verified"] else 20
    
    # 6. Missing Clauses (10%)
    clause_res = check_missing_clauses(document_text)
    missing_score = clause_res["clause_coverage_score"]
    
    # 7. Consistency Check (10%)
    cons_res = check_internal_consistency(document_text, clauses)
    cons_score = cons_res["consistency_score"]
    
    # 8. Fraud Pattern Detection (10%)
    fraud_res = detect_fraud_patterns(document_text)
    fraud_score = max(0, 100 - fraud_res["fraud_pattern_score"])
    
    # 9. Template Similarity (5%)
    temp_res = analyze_template_similarity(document_text)
    temp_score = temp_res["template_similarity"]
    
    # 10. Layout Analysis (10%)
    layout_res = analyze_layout_manipulation(file_path)
    layout_score = layout_res.get("layout_health_score", layout_res.get("score", 100))
    
    # Base Weighted Trust Score
    raw_trust = (
        (meta_score * 0.10) +
        (dup_score * 0.15) +
        (sig_score * 0.15) +
        (ocr_score * 0.10) +
        (comp_score * 0.15) +
        (missing_score * 0.10) +
        (cons_score * 0.10) +
        (fraud_score * 0.10) +
        (temp_score * 0.05) +
        (layout_score * 0.10)
    )

    # Apply severe risk deductions to Trust Score
    if fraud_res["has_high_fraud_risk"]:
        raw_trust -= 25.0
    if not comp_res["company_verified"]:
        raw_trust -= 15.0
    if cons_res["has_contradictions"]:
        raw_trust -= 15.0
    if missing_score < 50:
        raw_trust -= 15.0
        
    trust_score = round(max(5.0, min(100.0, raw_trust)), 1)
    
    # Calculate Scam Probability dynamically from genuine risk indicators
    base_scam = (100 - trust_score) * 0.85
    if fraud_res["has_high_fraud_risk"]:
        base_scam += 25
    if not comp_res["company_verified"]:
        base_scam += 15
    if missing_score < 60:
        base_scam += 15
    if sig_status == "Invalid":
        base_scam += 30
    if cons_res["has_contradictions"]:
        base_scam += 15
        
    scam_probability = round(min(99.0, max(1.0, base_scam)), 1)
    
    # Determine Authenticity Status
    if trust_score >= 80 and scam_probability < 30:
        authenticity_status = "Trusted"
    elif trust_score >= 50 and scam_probability < 65:
        authenticity_status = "Suspicious"
    else:
        authenticity_status = "Potentially Fraudulent"
        
    # Aggregate Fraud Flags
    all_fraud_flags = []
    if sig_status == "Invalid":
        all_fraud_flags.append("Invalid Signature")
    if meta_res["status"] == "Suspicious":
        all_fraud_flags.append("Metadata Modified / Suspicious Software")
    if not comp_res["company_verified"]:
        all_fraud_flags.append("Company Verification Failed")
    if ocr_res["tampering_detected"]:
        all_fraud_flags.append("Possible OCR Tampering")
    if layout_res["layout_status"] == "Manipulated":
        all_fraud_flags.append("Layout Manipulation Detected")
    if cons_res["has_contradictions"]:
        all_fraud_flags.extend(cons_res["contradictions"])
    all_fraud_flags.extend(fraud_res["fraud_flags"])

    # Build explainable trust breakdown list
    def _status(score: float, good_threshold: int = 70, warn_threshold: int = 40) -> str:
        if score >= good_threshold:
            return "Healthy"
        elif score >= warn_threshold:
            return "Warning"
        return "Poor"

    trust_breakdown = [
        {"factor": "Metadata",            "score": int(meta_score),    "status": _status(meta_score)},
        {"factor": "Duplicate Detection", "score": int(dup_score),     "status": "Clean" if dup_res["duplicate_similarity"] < 50 else "Duplicate Found"},
        {"factor": "Digital Signature",   "score": int(sig_score),     "status": "Signed" if sig_score == 100 else ("Not Signed" if sig_score == 50 else "Invalid Signature")},
        {"factor": "OCR Integrity",       "score": int(ocr_score),     "status": "Clean" if ocr_score == 100 else "Tampered"},
        {"factor": "Company Verified",    "score": int(comp_score),    "status": "Verified" if comp_res["company_verified"] else "Unverified"},
        {"factor": "Clause Coverage",     "score": int(missing_score), "status": _status(missing_score)},
        {"factor": "Consistency",         "score": int(cons_score),    "status": _status(cons_score)},
        {"factor": "Fraud Patterns",      "score": int(fraud_score),   "status": "Clean" if fraud_score >= 70 else "Flagged"},
        {"factor": "Layout Integrity",    "score": int(layout_score),  "status": _status(layout_score)},
    ]

    return {
        "trust_score": int(trust_score),
        "scam_probability": int(scam_probability),
        "authenticity_status": authenticity_status,
        "duplicate_similarity": int(dup_res["duplicate_similarity"]),
        "metadata_health": int(meta_score),
        "signature_status": sig_status,
        "company_verified": comp_res["company_verified"],
        "layout_status": layout_res["layout_status"],
        "missing_clauses": clause_res["missing_clauses"],
        "contradictions": cons_res["contradictions"],
        "fraud_flags": list(dict.fromkeys(all_fraud_flags)),

        "breakdown": {
            "metadata_score": int(meta_score),
            "duplicate_score": int(dup_score),
            "signature_score": int(sig_score),
            "ocr_score": int(ocr_score),
            "company_score": int(comp_score),
            "missing_clauses_score": int(missing_score),
            "consistency_score": int(cons_score),
            "fraud_pattern_score": int(fraud_score),
            "template_score": int(temp_score),
            "layout_score": int(layout_score)
        },

        "trust_breakdown": trust_breakdown,
        "company_info": comp_res,
        "metadata_info": meta_res["info"],
        "template_info": temp_res
    }

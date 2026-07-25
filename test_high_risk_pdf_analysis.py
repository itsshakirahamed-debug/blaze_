import os
import sys

sys.path.insert(0, r"d:\blaze_2\backend\backend\.venv\Lib\site-packages")
sys.path.insert(0, r"d:\blaze_2\backend\backend")

from app.services.pdf_reader import extract_pdf_text
from app.services.clause_splitter import split_into_clauses
from app.services.classifier import classify_clause
from app.services.risk_predictor import predict_risk
from app.services.trustguard.trust_engine import calculate_trust_and_scam_metrics
from app.services.gemini_service import generate_final_recommendation

pdf_path = r"d:\blaze_2\High_Risk_Predatory_Contract_Sample.pdf"

text = extract_pdf_text(pdf_path)
clauses = split_into_clauses(text)

classified = []
total_score = 0
for index, clause in enumerate(clauses, start=1):
    c_type = classify_clause(clause)
    risk = predict_risk(c_type, clause)
    total_score += risk["score"]
    classified.append({
        "index": index,
        "clause": clause,
        "clause_type": c_type,
        "risk": risk
    })

overall_score = (total_score / len(classified)) if classified else 0
overall_risk = "High" if overall_score >= 70 else ("Medium" if overall_score >= 50 else "Low")

trustguard_data = calculate_trust_and_scam_metrics(pdf_path, text, clauses)

high_risk_count = sum(1 for c in classified if c["risk"]["risk"] == "High")

rec = generate_final_recommendation(
    trust_score=trustguard_data["trust_score"],
    overall_score=overall_score,
    scam_probability=trustguard_data["scam_probability"],
    fraud_flags=trustguard_data["fraud_flags"],
    company_verified=trustguard_data["company_verified"],
    metadata_health=trustguard_data["metadata_health"],
    signature_status=trustguard_data["signature_status"],
    high_risk_count=high_risk_count,
    missing_clauses_count=len(trustguard_data["missing_clauses"])
)

print("="*60)
print("AUDIT RESULTS FOR High_Risk_Predatory_Contract_Sample.pdf:")
print("="*60)
print(f"Trust Score:         {trustguard_data['trust_score']} / 100")
print(f"Scam Probability:    {trustguard_data['scam_probability']}%")
print(f"Overall Legal Risk:  {overall_risk} ({round(overall_score, 1)}/100)")
print(f"Authenticity Status: {trustguard_data['authenticity_status']}")
print(f"Company Verified:    {trustguard_data['company_verified']}")
print(f"Recommendation:      {rec['recommendation']}")
print(f"Recommendation Msg:  {rec['recommendation_reason']}")
print(f"Missing Clauses:     {trustguard_data['missing_clauses']}")
print(f"Contradictions:      {trustguard_data['contradictions']}")
print(f"Fraud Flags:         {trustguard_data['fraud_flags']}")
print("="*60)

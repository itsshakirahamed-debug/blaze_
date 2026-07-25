from app.services.classifier import classify_clause
from app.services.risk_predictor import predict_risk

examples = [
    "Payment shall be made within 30 days.",
    "Either party may terminate this agreement.",
    "All confidential information shall remain secret.",
    "The company shall not be liable for damages."
]

for clause in examples:

    clause_type = classify_clause(clause)

    risk = predict_risk(clause_type)

    print("=" * 60)
    print("Clause:", clause)
    print("Type:", clause_type)
    print("Risk:", risk["risk"])
    print("Score:", risk["score"])
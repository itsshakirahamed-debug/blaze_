from app.services.classifier import classify_clause

examples = [
    "Payment shall be made within 30 days.",
    "Either party may terminate this agreement.",
    "All confidential information shall remain secret.",
    "The company shall not be liable for damages."
]

for clause in examples:
    print(f"Clause: {clause}")
    print(f"Type: {classify_clause(clause)}")
    print("-" * 50)
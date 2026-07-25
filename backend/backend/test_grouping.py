import sys
sys.path.insert(0, 'd:\\blaze_2\\backend\\backend')
from app.services.gemini_service import group_similar_clauses
from app.services.clause_splitter import split_into_clauses

# --- Test 1: Deduplication Splitting ---
print("=== Split & Deduplicate Test ===")
sample_text = """
1. Payment Terms: Payment obligations are due on net 30 invoices.
2. Payment Terms: Payment obligations are due on net 30 invoices.
3. Termination: Either party may terminate with 30 days notice.
4. Termination: Either party can terminate with 30 days notice.
5. Liability: Liability limit is $10,000.
"""

unique = split_into_clauses(sample_text)
print("Unique count:", len(unique))
for c in unique:
    print(" -", repr(c))

# --- Test 2: Centralized Grouping ---
print("\n=== Centralized Grouping Test ===")
mock_analysis = [
    {"clause_type": "Payment", "risk_level": "Medium", "risk_score": 50, "clause_text": "Payment 1", "ai_explanation": "Expl 1"},
    {"clause_type": "Payment", "risk_level": "High", "risk_score": 85, "clause_text": "Payment 2", "ai_explanation": "Expl 2"},
    {"clause_type": "Termination", "risk_level": "Low", "risk_score": 20, "clause_text": "Term 1", "ai_explanation": "Expl 3"},
]

grouped = group_similar_clauses(mock_analysis)
for g in grouped:
    print(f"Category: {g['clause_type']} ({g['detected_count']} items) - Risk: {g['risk_level']} (Score: {g['risk_score']})")
    print(f"  Summary Explanation: {g['ai_explanation']}")
    print("  Child Clauses:")
    for child in g['clauses']:
        print(f"    - [{child['risk_level']}]: {child['clause_text']}")

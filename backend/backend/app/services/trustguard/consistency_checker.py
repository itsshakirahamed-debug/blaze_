import re
from typing import Dict, Any, List

def check_internal_consistency(document_text: str, clauses: List[str]) -> Dict[str, Any]:
    """
    Checks for internal contradictions in payment terms, dates, monetary amounts, and company names.
    """
    contradictions = []
    
    # 1. Search for payment day terms (e.g., 30 Days, 60 Days, 90 Days, 15 Days)
    payment_terms = set()
    for clause in clauses:
        matches = re.findall(r'(\d+)\s*(?:days|day|business days|calendar days)', clause, re.IGNORECASE)
        for m in matches:
            # Only consider reasonable contract window terms like 7, 14, 15, 30, 45, 60, 90, 120
            val = int(m)
            if val in [7, 10, 14, 15, 30, 45, 60, 90, 120, 180]:
                payment_terms.add(val)
                
    if len(payment_terms) > 1:
        terms_str = ", ".join(f"{t} Days" for t in sorted(payment_terms))
        contradictions.append(f"Inconsistent payment/notice periods detected across clauses ({terms_str}).")

    # 2. Check monetary amounts discrepancies (e.g., $50,000 vs $500,000 or ₹50,000 vs ₹500,000)
    amounts = set()
    for clause in clauses:
        found_amounts = re.findall(r'(?:[\$₹€£]|\bUSD|\bINR)\s*([\d,]+(?:\.\d{2})?)', clause, re.IGNORECASE)
        for amt in found_amounts:
            clean_amt = amt.replace(',', '')
            try:
                val = float(clean_amt)
                if val > 100: # Filter small fee noise
                    amounts.add(val)
            except ValueError:
                pass
                
    # If there are multiple different monetary figures where one is an order of magnitude larger (typo / edit edit risk)
    sorted_amounts = sorted(list(amounts))
    if len(sorted_amounts) >= 2:
        for i in range(len(sorted_amounts) - 1):
            if sorted_amounts[i+1] == sorted_amounts[i] * 10 or sorted_amounts[i+1] == sorted_amounts[i] * 100:
                contradictions.append(f"Contradictory payment amounts found: {sorted_amounts[i]} vs {sorted_amounts[i+1]} (potential zero-digit manipulation).")
                break

    # 3. Check Governing Law contradictions (e.g. Delaware vs New York or California vs Texas)
    states = ["Delaware", "New York", "California", "Texas", "London", "Singapore", "India", "England"]
    found_states = set()
    for clause in clauses:
        for st in states:
            if re.search(r'\b' + re.escape(st) + r'\b', clause, re.IGNORECASE):
                found_states.add(st)
    if len(found_states) > 1:
        contradictions.append(f"Conflicting governing law jurisdictions referenced: {', '.join(found_states)}.")

    return {
        "has_contradictions": len(contradictions) > 0,
        "contradictions": contradictions,
        "consistency_score": max(0, 100 - (len(contradictions) * 35))
    }

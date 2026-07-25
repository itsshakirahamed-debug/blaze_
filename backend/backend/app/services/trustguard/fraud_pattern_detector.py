import re
from typing import Dict, Any, List

FRAUD_PATTERNS = [
    {
        "name": "Unlimited Liability",
        "pattern": r'\b(unlimited liability|liable for all damages|without any limitation of liability|full financial responsibility for any loss)\b',
        "risk": 30,
        "flag": "Unlimited Liability Clause Detected"
    },
    {
        "name": "Unilateral Immediate Termination",
        "pattern": r'\b(terminate immediately|terminate without notice|terminate without cause|cancel at any time without penalty)\b',
        "risk": 25,
        "flag": "Unilateral Immediate Termination Right"
    },
    {
        "name": "Forced Unilateral Arbitration",
        "pattern": r'\b(waive all rights to jury trial|binding arbitration at sole discretion of|arbitration in foreign jurisdiction|waive right to court)\b',
        "risk": 20,
        "flag": "Forced Unilateral Arbitration & Court Waiver"
    },
    {
        "name": "Non-Refundable Advance Payment Demand",
        "pattern": r'\b(100% advance payment|non-refundable upfront fee|payment prior to delivery with no recourse|immediate wire transfer|wire transfer required|no refund)\b',
        "risk": 35,
        "flag": "Advance Payment Request / Non-Refundable Demand"
    },
    {
        "name": "Hidden Auto Renewal without Cancellation Window",
        "pattern": r'\b(automatically renews perpetually|cannot be cancelled|no termination right|automatic renewal without notice|auto-renew)\b',
        "risk": 20,
        "flag": "Perpetual Auto Renewal without Cancellation"
    },
    {
        "name": "Irrevocable Unilateral Transfer",
        "pattern": r'\b(irrevocably assigns all present and future|unconditional surrender of IP|surrender all claim to|forfeits all rights)\b',
        "risk": 25,
        "flag": "Irrevocable Unilateral Asset Transfer"
    },
    {
        "name": "Excessive Penalties or Interest",
        "pattern": r'\b(penalty of \d+%\s*per day|interest rate exceeding \d+%|liquidated damages|forfeiture of all fees|forfeit all compensation)\b',
        "risk": 25,
        "flag": "Excessive Liquidated Penalties or Fee Forfeiture"
    },
    {
        "name": "Sole Discretion Unilateral Modification",
        "pattern": r'\b(at its sole discretion|reserve the right to modify at any time|change terms without notice)\b',
        "risk": 20,
        "flag": "Unilateral Contract Modification Terms"
    }
]

def detect_fraud_patterns(document_text: str) -> Dict[str, Any]:
    """
    Evaluates document text against high-risk fraudulent and predatory contractual patterns.
    """
    fraud_flags = []
    total_fraud_risk = 0
    
    for item in FRAUD_PATTERNS:
        if re.search(item["pattern"], document_text, re.IGNORECASE):
            fraud_flags.append(item["flag"])
            total_fraud_risk += item["risk"]
            
    fraud_score = min(100, total_fraud_risk)
    
    return {
        "fraud_pattern_score": fraud_score,
        "fraud_flags": fraud_flags,
        "has_high_fraud_risk": fraud_score >= 35
    }

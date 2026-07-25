import re
from typing import Dict, Any, List

TEMPLATES = {
    "Non-Disclosure Agreement (NDA)": [
        "confidential information", "non-disclosure", "receiving party", "disclosing party", "term", "return of materials"
    ],
    "Employment Agreement": [
        "employee", "employer", "salary", "duties", "benefits", "termination", "non-compete", "probation"
    ],
    "Rental / Lease Agreement": [
        "tenant", "landlord", "rent", "security deposit", "premises", "lease term", "maintenance"
    ],
    "Vendor Agreement": [
        "vendor", "client", "deliverables", "payment terms", "service level", "warranty", "scope of work"
    ],
    "Purchase Agreement": [
        "buyer", "seller", "purchase price", "closing date", "title", "inspection", "conveyance"
    ],
    "Service Agreement": [
        "service provider", "client", "services", "fees", "independent contractor", "indemnification"
    ]
}

def analyze_template_similarity(document_text: str) -> Dict[str, Any]:
    """
    Compares document against standard legal templates to determine contract type, similarity, and unexpected clauses.
    """
    text_lower = document_text.lower()
    
    best_template = "General Legal Contract"
    highest_score = 0.0
    
    for t_name, keywords in TEMPLATES.items():
        matched = sum(1 for kw in keywords if kw in text_lower)
        score = (matched / len(keywords)) * 100.0
        if score > highest_score:
            highest_score = score
            best_template = t_name
            
    similarity = max(65.0, round(highest_score if highest_score > 0 else 75.0, 1))
    
    # Identify unexpected/abnormal clauses for contract type
    unexpected_clauses = []
    if "Employment" in best_template and "unlimited liability" in text_lower:
        unexpected_clauses.append("Unlimited Personal Employee Liability")
    if "NDA" in best_template and "purchase price" in text_lower:
        unexpected_clauses.append("Purchase Price Settlement Clause in NDA")
    if "Rental" in best_template and "intellectual property" in text_lower:
        unexpected_clauses.append("IP Ownership Transfer in Residential Lease")
        
    return {
        "template_type": best_template,
        "template_similarity": similarity,
        "unexpected_clauses_count": len(unexpected_clauses),
        "unexpected_clauses": unexpected_clauses
    }

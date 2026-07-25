import re
from typing import Dict, Any, List

MANDATORY_CLAUSES = [
    {"name": "Payment", "keywords": [r'\bpayment\b', r'\bcompensation\b', r'\bfees\b', r'\bremuneration\b']},
    {"name": "Termination", "keywords": [r'\btermination\b', r'\bcancelation\b', r'\bterm and termination\b']},
    {"name": "Liability", "keywords": [r'\bliability\b', r'\blimitation of liability\b', r'\bindemnity\b']},
    {"name": "Confidentiality", "keywords": [r'\bconfidentiality\b', r'\bnon-disclosure\b', r'\bsecret\b']},
    {"name": "Governing Law", "keywords": [r'\bgoverning law\b', r'\bjurisdiction\b', r'\bapplicable law\b']},
    {"name": "Dispute Resolution", "keywords": [r'\bdispute resolution\b', r'\barbitration\b', r'\bmediation\b']},
    {"name": "Force Majeure", "keywords": [r'\bforce majeure\b', r'\bact of god\b', r'\bunforeseen circumstances\b']},
    {"name": "Intellectual Property", "keywords": [r'\bintellectual property\b', r'\bownership\b', r'\bip rights\b', r'\bcopyright\b']}
]

def check_missing_clauses(document_text: str) -> Dict[str, Any]:
    """
    Checks if standard mandatory legal clauses are present or missing from the document.
    """
    present_clauses = []
    missing_clauses = []
    
    text_lower = document_text.lower()
    
    for clause in MANDATORY_CLAUSES:
        found = False
        for kw in clause["keywords"]:
            if re.search(kw, text_lower):
                found = True
                break
        if found:
            present_clauses.append(clause["name"])
        else:
            missing_clauses.append(clause["name"])
            
    coverage_score = round((len(present_clauses) / len(MANDATORY_CLAUSES)) * 100, 1)
    
    return {
        "missing_clauses": missing_clauses,
        "present_clauses": present_clauses,
        "clause_coverage_score": coverage_score
    }

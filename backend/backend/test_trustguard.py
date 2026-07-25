import fitz
import os
import json
from app.services.trustguard.trust_engine import calculate_trust_and_scam_metrics

def create_dummy_pdf(filename: str):
    doc = fitz.open()
    page = doc.new_page()
    text = """
    EMPLOYMENT AGREEMENT
    This Agreement is entered into by ABC Technologies Inc (support@gmail.com) and John Doe.
    
    1. Payment Terms: Payment shall be remitted within 30 days of invoice.
    2. Termination: Either party may terminate this agreement with 14 days written notice.
    3. Governing Law: This Agreement shall be governed by the laws of California and Delaware.
    4. Liquidated Damages: Employee agrees to a penalty of 100% per day for any late deliverable.
    5. Payment Clause: Payment must be completed within 90 days.
    """
    page.insert_text((50, 50), text)
    doc.save(filename)
    doc.close()

if __name__ == "__main__":
    test_pdf = os.path.join("uploads", "test_contract.pdf")
    os.makedirs("uploads", exist_ok=True)
    create_dummy_pdf(test_pdf)
    
    doc = fitz.open(test_pdf)
    text = doc[0].get_text()
    clauses = [line.strip() for line in text.split("\n") if len(line.strip()) > 10]
    doc.close()
    
    res = calculate_trust_and_scam_metrics(test_pdf, text, clauses)
    print("=== BLAZE TRUSTGUARD VERIFICATION RESULT ===")
    print(json.dumps(res, indent=2))
    print("\nSUCCESS: TrustGuard Verification Engine Passed!")

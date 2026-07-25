import sys
sys.path.insert(0, "d:\\blaze_2\\backend\\backend")
sys.path.insert(0, "d:\\blaze_2\\backend\\backend\\.venv\\Lib\\site-packages")

print("=== MODEL 1: ML Risk Scorer ===")
from app.services.risk_predictor import predict_risk

tests = [
    ("You may terminate with 30 days written notice.", "Termination", "Low", 0),
    ("Company may terminate immediately without notice or compensation.", "Termination", "High", 70),
    ("Liability is limited to fees paid in prior month.", "Liability", "Medium", 40),
    ("Party accepts unlimited liability for all direct and indirect losses.", "Liability", "High", 80),
    ("Payment shall be made within 30 days of invoice receipt.", "Payment", "Low", 0),
    ("100% advance payment is required and is non-refundable.", "Payment", "High", 70),
    ("Both parties retain pre-existing intellectual property rights.", "Intellectual Property", "Low", 0),
    ("All IP including pre-existing work irrevocably transfers to company.", "Intellectual Property", "High", 70),
]

for clause, ctype, expected_risk, min_score in tests:
    result = predict_risk(ctype, clause)
    risk_ok = result["risk"] == expected_risk
    score_ok = result["score"] >= min_score
    status = "PASS" if (risk_ok and score_ok) else "WARN got=" + result["risk"] + "=" + str(result["score"])
    print("  [" + status + "] " + expected_risk + " exp: " + clause[:50])

print()
print("=== MODEL 3: Smart Gemini Skip ===")
from app.services.gemini_skip_classifier import should_skip_gemini, get_template_explanation

skip_tests = [
    ("Either party may terminate with 30 days written notice.", True),
    ("Both parties retain all rights to pre-existing intellectual property.", True),
    ("Payment shall be made within 30 days of invoice receipt.", True),
    ("Company may terminate immediately without notice or compensation.", False),
    ("The contractor is liable for all losses regardless of cause.", False),
    ("Wire transfer of full amount required within 24 hours.", False),
    ("100% advance payment is non-refundable under any circumstances.", False),
]

skip_pass = 0
for clause, expected in skip_tests:
    skip, _ = should_skip_gemini(clause)
    ok = skip == expected
    if ok:
        skip_pass += 1
    print("  [" + ("PASS" if ok else "FAIL") + "] skip=" + str(skip) + ": " + clause[:55])

print("  Result: " + str(skip_pass) + "/" + str(len(skip_tests)) + " correct")

print()
print("=== Template check ===")
for ct in ["Payment", "Termination", "Confidentiality", "Liability", "Force Majeure"]:
    t = get_template_explanation(ct)
    print("  " + ct + ": " + t[:60] + "...")

print()
print("ALL TESTS COMPLETE")

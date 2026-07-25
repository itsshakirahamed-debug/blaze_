import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, 'd:\\blaze_2\\backend\\backend')
from app.services.gemini_service import generate_final_recommendation

print('=== Recommendation Engine Cases ===')
cases = [
    # (trust_score, overall_score, scam_prob, fraud_flags, company_verified, metadata_health, signature_status, high_risk_count, expected_verdict)
    (85, 20.0, 10, [], True, 90, 'Valid', 0, '✅ Safe to Sign'),
    (85, 55.0, 15, [], True, 90, 'Valid', 1, '⚠️ Safe to Sign, but Review Carefully'),
    (85, 80.0, 20, [], True, 90, 'Valid', 3, '⚠️ Authentic Document, but Legally Risky'),
    (40, 20.0, 45, [], True, 80, 'Not Present', 0, '⚠️ Verify Authenticity First'),
    (40, 85.0, 75, ['Fraud flag'], False, 50, 'Invalid', 4, '❌ Do Not Sign'),
]

for idx, (t, r, s, f, c, m, sig, h_count, expected) in enumerate(cases, 1):
    res = generate_final_recommendation(t, r, s, f, c, m, sig, h_count)
    ok = res['recommendation'] == expected
    status = 'PASS' if ok else 'FAIL'
    print(f"Case {idx}: [{status}] expected: {expected}, got: {res['recommendation']}")
    print(f"  Reason: {res['recommendation_reason']}")
    print(f"  Explanation: {res['recommendation_explanation']}")
    print()

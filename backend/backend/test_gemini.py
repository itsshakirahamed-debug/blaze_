from app.services.ai_explainer import explain_clause

result = explain_clause(
    "Either party may terminate this agreement immediately without notice.",
    "Termination",
    "High"
)

print(result)
"""
ai_explainer.py
---------------
Async Gemini-powered clause explanation service.

Uses asyncio + httpx via google-genai's async client so all clause
explanations can be fired in parallel from analyze.py using asyncio.gather().

Each clause gets its own focused prompt — short, targeted, fast.
"""

import os
import asyncio
from dotenv import load_dotenv
from google import genai
from google.genai.errors import ServerError
from app.services.gemini_skip_classifier import should_skip_gemini, get_template_explanation

load_dotenv()

# Single shared client instance (thread-safe, re-used across all calls)
_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "gemini-2.0-flash-lite"


def explain_clause(clause: str, clause_type: str, risk: str) -> str:
    """
    Synchronous wrapper kept for backward compatibility.
    Internally runs the async version in a new event loop if needed.
    """
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            # If already inside an async context, create a new thread loop
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor() as pool:
                future = pool.submit(asyncio.run, _explain_async(clause, clause_type, risk))
                return future.result()
        else:
            return loop.run_until_complete(_explain_async(clause, clause_type, risk))
    except Exception as e:
        return f"Error: {str(e)}"


async def explain_clause_async(clause: str, clause_type: str, risk: str) -> str:
    """
    Async version — call this directly from async routes via asyncio.gather()
    for maximum parallelism across all clauses.
    """
    return await _explain_async(clause, clause_type, risk)


async def _explain_async(clause: str, clause_type: str, risk: str) -> str:
    """Core async Gemini call with skip-classifier gate and tight focused prompt."""

    # ── Smart Skip Check ─────────────────────────────────────────────────────
    # If the clause is confidently low-risk, skip Gemini entirely and return
    # a high-quality template explanation. ~30-40% of clauses qualify.
    skip, _ = should_skip_gemini(clause)
    if skip and risk == "Low":
        return get_template_explanation(clause_type)

    # ── Gemini Call (only for medium/high risk or uncertain low-risk) ─────────
    clause_snippet = clause[:600] if len(clause) > 600 else clause

    prompt = (
        f"You are a legal assistant. Analyze this {clause_type} clause (Risk: {risk}):\n\n"
        f'"{clause_snippet}"\n\n'
        f"In plain English (max 80 words):\n"
        f"1. Why is this risky?\n"
        f"2. One specific improvement suggestion."
    )

    try:
        response = await asyncio.to_thread(
            _client.models.generate_content,
            model=MODEL,
            contents=prompt,
        )
        return response.text.strip()

    except ServerError:
        return "AI analysis temporarily unavailable. Re-upload the document to retry."

    except Exception as e:
        err = str(e)
        if any(k in err.lower() for k in ("429", "quota", "resource_exhausted", "rate")):
            return "AI quota limit reached. Analysis will resume shortly."
        return "AI analysis unavailable for this clause."
"""
report_generator.py
--------------------
Generates a professional PDF audit report using ReportLab.

Key principles:
  - ZERO new Gemini API calls. All text comes exclusively from analysis_data
    that was already computed during the /analyze endpoint call.
  - All AI-generated text fields are sanitised through _clean_explanation()
    before being placed in the PDF. Raw API errors (429, RESOURCE_EXHAUSTED,
    etc.) are replaced with a user-friendly fallback message.
  - New fields supported: executive_summary, recommendation,
    recommendation_reason, analysis_mode, trust_breakdown.
  - Existing report structure and formatting fully preserved.
"""

import os
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table,
    TableStyle, HRFlowable, KeepTogether,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle


# ─── API error signals — never show these to the user ────────────────────────
_ERROR_SIGNALS = (
    "resource_exhausted", "429", "quota exceeded", "rate limit",
    "api_key", "internal server error", "servererror", "gemini server",
    "error:", "exception", "traceback",
    "ai quota limit", "quota limit reached", "temporarily unavailable",
    "re-upload the document", "analysis will resume",
)

_FALLBACK_EXPLANATION = "Explanation unavailable for this clause."
_FALLBACK_SUMMARY = "Summary not available for this analysis."


def _clean_explanation(text: str, fallback: str = _FALLBACK_EXPLANATION) -> str:
    """
    Sanitise an AI-generated text field before writing it to the PDF.

    - Returns the original text if it looks valid.
    - Returns `fallback` if the text is empty, None, or contains API error signals.
    - Strips leading/trailing whitespace.
    """
    if not text or not str(text).strip():
        return fallback

    cleaned = str(text).strip()

    lower = cleaned.lower()
    for signal in _ERROR_SIGNALS:
        if signal in lower:
            return fallback

    return cleaned


def _truncate(text: str, max_chars: int = 200) -> str:
    """Truncate text and add ellipsis if over limit."""
    text = _clean_explanation(text)
    if len(text) <= max_chars:
        return text
    return text[:max_chars].rstrip() + "…"


def _risk_color(risk_level: str) -> colors.Color:
    level = str(risk_level).strip().lower()
    if level == "high":
        return colors.HexColor("#fef2f2")   # light red
    if level == "medium":
        return colors.HexColor("#fffbeb")   # light amber
    return colors.HexColor("#f0fdf4")       # light green


def _risk_text_color(risk_level: str) -> colors.Color:
    level = str(risk_level).strip().lower()
    if level == "high":
        return colors.HexColor("#b91c1c")
    if level == "medium":
        return colors.HexColor("#b45309")
    return colors.HexColor("#15803d")


def _mode_label(mode: str) -> str:
    return {
        "fast":     "Fast Mode",
        "balanced": "Balanced",
        "deep":     "Deep Analysis",
    }.get(str(mode).lower(), "Balanced")


# ─── Main Report Generator ────────────────────────────────────────────────────

def generate_pdf_report(analysis_data: dict, output_path: str) -> str:
    """
    Generates a professional PDF Trust & Risk Report using ReportLab.

    All content is sourced exclusively from analysis_data.
    No new Gemini API calls are made.
    """
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=36, leftMargin=36,
        topMargin=36,   bottomMargin=36,
    )

    styles = getSampleStyleSheet()

    # ── Custom styles ─────────────────────────────────────────────────────────
    title_style = ParagraphStyle(
        "DocTitle", parent=styles["Heading1"],
        fontName="Helvetica-Bold", fontSize=22, leading=26,
        textColor=colors.HexColor("#0f172a"),
    )
    subtitle_style = ParagraphStyle(
        "DocSubTitle", parent=styles["Normal"],
        fontName="Helvetica", fontSize=10, leading=14,
        textColor=colors.HexColor("#64748b"),
    )
    h2_style = ParagraphStyle(
        "Heading2Custom", parent=styles["Heading2"],
        fontName="Helvetica-Bold", fontSize=13, leading=17,
        textColor=colors.HexColor("#0369a1"),
        spaceBefore=14, spaceAfter=6,
    )
    h3_style = ParagraphStyle(
        "Heading3Custom", parent=styles["Normal"],
        fontName="Helvetica-Bold", fontSize=10, leading=14,
        textColor=colors.HexColor("#1e3a5f"),
        spaceBefore=8, spaceAfter=4,
    )
    body_style = ParagraphStyle(
        "BodyCustom", parent=styles["Normal"],
        fontName="Helvetica", fontSize=9, leading=13,
        textColor=colors.HexColor("#334155"),
    )
    bold_body = ParagraphStyle(
        "BoldBodyCustom", parent=body_style,
        fontName="Helvetica-Bold",
    )
    small_style = ParagraphStyle(
        "SmallCustom", parent=styles["Normal"],
        fontName="Helvetica", fontSize=8, leading=11,
        textColor=colors.HexColor("#475569"),
    )
    muted_style = ParagraphStyle(
        "MutedCustom", parent=styles["Normal"],
        fontName="Helvetica-Oblique", fontSize=8, leading=11,
        textColor=colors.HexColor("#94a3b8"),
    )

    story = []

    # ── 1. Report Header ──────────────────────────────────────────────────────
    mode_label = _mode_label(analysis_data.get("analysis_mode") or analysis_data.get("_mode", "balanced"))
    story.append(Paragraph("Blaze TrustGuard — Audit Report", title_style))
    story.append(Paragraph(
        f"Document Scam, Authenticity &amp; Legal Risk Analysis &nbsp;|&nbsp; "
        f"Mode: {mode_label} &nbsp;|&nbsp; "
        f"Generated: {datetime.now().strftime('%B %d, %Y  %H:%M')}",
        subtitle_style,
    ))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0284c7"), spaceAfter=15))

    # ── 2. Executive Summary Metrics Table ────────────────────────────────────
    filename           = analysis_data.get("filename", "Contract Document")
    trust_score        = analysis_data.get("trust_score", 80)
    scam_prob          = analysis_data.get("scam_probability", 15)
    authenticity_status = analysis_data.get("authenticity_status", "Trusted")
    overall_risk       = analysis_data.get("overall_risk", "Low")
    overall_score      = analysis_data.get("overall_score", 30)
    num_clauses        = analysis_data.get("number_of_clauses", 0)

    summary_data = [
        [
            Paragraph("<b>Target Document:</b>", body_style), Paragraph(str(filename), bold_body),
            Paragraph("<b>Trust Score:</b>", body_style),     Paragraph(f"{trust_score} / 100", bold_body),
        ],
        [
            Paragraph("<b>Authenticity Status:</b>", body_style), Paragraph(str(authenticity_status), bold_body),
            Paragraph("<b>Scam Probability:</b>", body_style),    Paragraph(f"{scam_prob}%", bold_body),
        ],
        [
            Paragraph("<b>Legal Risk Level:</b>", body_style),  Paragraph(str(overall_risk), bold_body),
            Paragraph("<b>Legal Risk Score:</b>", body_style),  Paragraph(f"{overall_score} / 100", bold_body),
        ],
        [
            Paragraph("<b>Total Clauses:</b>", body_style), Paragraph(str(num_clauses), bold_body),
            Paragraph("<b>Analysis Mode:</b>", body_style), Paragraph(mode_label, bold_body),
        ],
    ]

    summary_table = Table(summary_data, colWidths=[120, 150, 110, 140])
    summary_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
        ("BOX",        (0, 0), (-1, -1), 1,   colors.HexColor("#e2e8f0")),
        ("INNERGRID",  (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ("TOPPADDING",    (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 15))

    # ── 3. AI Executive Summary (reused from analysis — no new API call) ──────
    executive_summary = _clean_explanation(
        analysis_data.get("executive_summary", ""),
        fallback=_FALLBACK_SUMMARY,
    )
    recommendation       = _clean_explanation(analysis_data.get("recommendation", ""), fallback="")
    recommendation_reason = _clean_explanation(analysis_data.get("recommendation_reason", ""), fallback="")
    recommendation_explanation = _clean_explanation(analysis_data.get("recommendation_explanation", ""), fallback="")

    if executive_summary and executive_summary != _FALLBACK_SUMMARY:
        story.append(Paragraph("AI Executive Summary", h2_style))
        story.append(Paragraph(executive_summary, body_style))
        story.append(Spacer(1, 6))

    if recommendation:
        story.append(Paragraph("Signing Recommendation", h3_style))
        story.append(Paragraph(f"<b>Verdict:</b> {recommendation}", body_style))
        if recommendation_reason:
            story.append(Paragraph(recommendation_reason, body_style))
        if recommendation_explanation:
            story.append(Spacer(1, 4))
            story.append(Paragraph("<b>Why this recommendation?</b>", bold_body))
            story.append(Paragraph(recommendation_explanation, body_style))
        story.append(Spacer(1, 10))

    # ── 4. Document Authenticity & Integrity Verification ────────────────────
    story.append(Paragraph("Document Authenticity &amp; Integrity Verification", h2_style))

    dup_sim       = analysis_data.get("duplicate_similarity", 0)
    sig_stat      = analysis_data.get("signature_status", "Not Present")
    meta_health   = analysis_data.get("metadata_health", 100)
    layout_stat   = analysis_data.get("layout_status", "Normal")
    comp_verified = "Verified" if analysis_data.get("company_verified", True) else "Impersonation Warning"

    auth_checks_data = [
        [
            Paragraph("<b>Verification Check</b>", bold_body),
            Paragraph("<b>Result / Value</b>", bold_body),
            Paragraph("<b>Status Assessment</b>", bold_body),
        ],
        [Paragraph("Duplicate Similarity", body_style),  Paragraph(f"{dup_sim}%", body_style),    Paragraph("High Similarity" if dup_sim > 80 else "Unique Document", body_style)],
        [Paragraph("Digital Signature",    body_style),  Paragraph(str(sig_stat), body_style),    Paragraph("Sealed Content" if sig_stat in ["Valid", "Not Applicable"] else "Signature Unverified", body_style)],
        [Paragraph("Metadata Health",      body_style),  Paragraph(f"{meta_health}%", body_style), Paragraph("Intact" if meta_health >= 80 else "Suspicious Editing Tools", body_style)],
        [Paragraph("Layout Formatting",    body_style),  Paragraph(str(layout_stat), body_style), Paragraph("Standard" if layout_stat == "Normal" else "Typography / Font Splicing", body_style)],
        [Paragraph("Company Verification", body_style),  Paragraph(str(comp_verified), body_style), Paragraph("Verified Domain" if analysis_data.get("company_verified", True) else "Domain Mismatch Flagged", body_style)],
    ]

    auth_table = Table(auth_checks_data, colWidths=[160, 160, 200])
    auth_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e0f2fe")),
        ("TEXTCOLOR",  (0, 0), (-1, 0), colors.HexColor("#0369a1")),
        ("GRID",       (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ("TOPPADDING",    (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(auth_table)
    story.append(Spacer(1, 15))

    # ── 5. Trust Breakdown Table (new — uses trust_breakdown list) ────────────
    trust_breakdown = (
        analysis_data.get("trustguard_details", {}).get("trust_breakdown") or
        analysis_data.get("trust_breakdown", [])
    )
    if trust_breakdown:
        story.append(Paragraph("Trust Factor Breakdown", h2_style))
        tb_data = [
            [Paragraph("<b>Factor</b>", bold_body), Paragraph("<b>Score</b>", bold_body), Paragraph("<b>Status</b>", bold_body)]
        ]
        for item in trust_breakdown:
            score = item.get("score", 0)
            factor = str(item.get("factor", ""))
            status = str(item.get("status", ""))
            row_bg = colors.HexColor("#f0fdf4") if score >= 70 else (colors.HexColor("#fffbeb") if score >= 40 else colors.HexColor("#fef2f2"))
            tb_data.append([
                Paragraph(factor, body_style),
                Paragraph(str(score), body_style),
                Paragraph(status, body_style),
            ])

        tb_table = Table(tb_data, colWidths=[200, 80, 240])
        tb_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f1f5f9")),
            ("GRID",       (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
            ("TOPPADDING",    (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ]))
        story.append(tb_table)
        story.append(Spacer(1, 15))

    # ── 6. Fraud Flags, Contradictions, Missing Clauses ──────────────────────
    fraud_flags    = analysis_data.get("fraud_flags", [])
    contradictions = analysis_data.get("contradictions", [])
    missing_clauses = analysis_data.get("missing_clauses", [])

    if fraud_flags or contradictions or missing_clauses:
        story.append(Paragraph("Risk &amp; Anomaly Findings", h2_style))

        if fraud_flags:
            story.append(Paragraph("<b>Detected Fraud Flags:</b> " + ", ".join(fraud_flags), body_style))
            story.append(Spacer(1, 4))
        if contradictions:
            story.append(Paragraph("<b>Document Contradictions:</b> " + " | ".join(contradictions), body_style))
            story.append(Spacer(1, 4))
        if missing_clauses:
            story.append(Paragraph("<b>Missing Mandatory Clauses:</b> " + ", ".join(missing_clauses), body_style))
            story.append(Spacer(1, 4))

        story.append(Spacer(1, 10))

    # ── 7. Legal Clause Risk Breakdown ────────────────────────────────────────
    analysis = analysis_data.get("analysis", [])
    if analysis:
        story.append(Paragraph("Legal Clause Risk Breakdown", h2_style))

        # Summary counters
        high_count   = sum(1 for c in analysis if c.get("risk_level") == "High")
        medium_count = sum(1 for c in analysis if c.get("risk_level") == "Medium")
        low_count    = sum(1 for c in analysis if c.get("risk_level") == "Low")

        counter_data = [[
            Paragraph(f"<b>High Risk:</b> {high_count}", bold_body),
            Paragraph(f"<b>Medium Risk:</b> {medium_count}", bold_body),
            Paragraph(f"<b>Low Risk:</b> {low_count}", bold_body),
        ]]
        counter_table = Table(counter_data, colWidths=[173, 173, 174])
        counter_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (0, 0), colors.HexColor("#fef2f2")),
            ("BACKGROUND", (1, 0), (1, 0), colors.HexColor("#fffbeb")),
            ("BACKGROUND", (2, 0), (2, 0), colors.HexColor("#f0fdf4")),
            ("BOX",  (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
            ("TOPPADDING",    (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ]))
        story.append(counter_table)
        story.append(Spacer(1, 8))

        # Clause table using grouped categories to eliminate duplicate sections
        grouped_analysis = analysis_data.get("grouped_analysis", [])
        if not grouped_analysis:
            from app.services.gemini_service import group_similar_clauses
            grouped_analysis = group_similar_clauses(analysis)

        clause_table_data = [[
            Paragraph("<b>#</b>",                   bold_body),
            Paragraph("<b>Clause Type</b>",         bold_body),
            Paragraph("<b>Risk</b>",                bold_body),
            Paragraph("<b>Score</b>",               bold_body),
            Paragraph("<b>AI Explanation Summary</b>", bold_body),
        ]]

        for idx, item in enumerate(grouped_analysis[:15], start=1):
            c_num   = str(idx)
            c_type  = str(item.get("clause_type", "General"))
            count   = item.get("detected_count", 1)
            if count > 1:
                c_type += f" ({count} items)"

            r_level = str(item.get("risk_level", "Low"))
            r_score = str(item.get("risk_score", ""))

            # Sanitise explanation — never expose raw API errors
            raw_expl = item.get("ai_explanation", "")
            expl = _truncate(_clean_explanation(raw_expl), max_chars=160)

            row = [
                Paragraph(c_num,   body_style),
                Paragraph(c_type,  body_style),
                Paragraph(r_level, body_style),
                Paragraph(r_score, body_style),
                Paragraph(expl,    small_style),
            ]
            clause_table_data.append(row)

        clause_table = Table(clause_table_data, colWidths=[22, 100, 55, 38, 305])
        clause_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f1f5f9")),
            ("GRID",       (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
            ("TOPPADDING",    (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ("VALIGN",     (0, 0), (-1, -1), "TOP"),
        ]))

        # Row background colours per risk level
        for row_idx, item in enumerate(grouped_analysis[:15], start=1):
            r_level = str(item.get("risk_level", "Low"))
            bg = _risk_color(r_level)
            clause_table.setStyle(TableStyle([
                ("BACKGROUND", (2, row_idx), (2, row_idx), bg),
            ]))

        story.append(clause_table)

        if len(grouped_analysis) > 15:
            story.append(Spacer(1, 4))
            story.append(Paragraph(
                f"Showing 15 of {len(grouped_analysis)} categories. Download the full JSON analysis for complete data.",
                muted_style,
            ))

    # ── 8. Negotiation Suggestions (reused — no new API call) ─────────────────
    negotiation = analysis_data.get("negotiation_suggestions", [])
    if negotiation:
        story.append(Spacer(1, 10))
        story.append(Paragraph("AI Negotiation Suggestions", h2_style))
        story.append(Paragraph(
            "The following safer clause alternatives were generated during analysis.",
            body_style,
        ))
        story.append(Spacer(1, 6))

        for i, sug in enumerate(negotiation[:5], start=1):
            clause_type   = str(sug.get("clause_type", f"Clause {i}"))
            original_text = _truncate(str(sug.get("original_text", "")), 200)
            suggested     = _truncate(_clean_explanation(str(sug.get("suggested_text", "")), "No suggestion available."), 200)
            explanation   = _truncate(_clean_explanation(str(sug.get("explanation", "")), ""), 180)

            block = [
                Paragraph(f"<b>{i}. {clause_type}</b>", bold_body),
                Paragraph(f"<b>Original:</b> {original_text}", small_style),
                Paragraph(f"<b>Suggested:</b> {suggested}",  small_style),
            ]
            if explanation:
                block.append(Paragraph(f"<b>Why:</b> {explanation}", small_style))
            block.append(Spacer(1, 6))

            story.extend(block)

    # ── 9. Footer ─────────────────────────────────────────────────────────────
    story.append(Spacer(1, 20))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#e2e8f0"), spaceAfter=8))
    story.append(Paragraph(
        f"Generated by Blaze TrustGuard AI Platform — {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} | "
        f"All AI explanations were produced during the original analysis session. No additional API calls were made during report generation.",
        muted_style,
    ))

    doc.build(story)
    return output_path

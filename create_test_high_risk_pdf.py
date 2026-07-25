import os
import sys

sys.path.insert(0, r"d:\blaze_2\backend\backend\.venv\Lib\site-packages")

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_pdf():
    pdf_filename = "High_Risk_Predatory_Contract_Sample.pdf"
    target_path = os.path.join(r"d:\blaze_2", pdf_filename)
    upload_path = os.path.join(r"d:\blaze_2\backend\backend\uploads", pdf_filename)

    doc = SimpleDocTemplate(
        target_path,
        pagesize=letter,
        rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'ContractTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=colors.HexColor('#0f172a'),
        alignment=1, # Center
        spaceAfter=15
    )

    subtitle_style = ParagraphStyle(
        'ContractSub',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#dc2626'),
        alignment=1,
        spaceAfter=20
    )

    heading_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#1e293b'),
        spaceBefore=12,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor('#334155'),
        spaceAfter=10
    )

    meta_style = ParagraphStyle(
        'MetaText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#64748b'),
        spaceAfter=8
    )

    story = []

    # Document Header
    story.append(Paragraph("UNILATERAL SERVICE & CONSULTING AGREEMENT", title_style))
    story.append(Paragraph("HIGH-RISK SAMPLE CONTRACT FOR AUDIT TESTING", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#e2e8f0'), spaceAfter=15))

    # Preamble / Party Details (Unverified Company details)
    story.append(Paragraph("<b>Contracting Parties:</b>", heading_style))
    story.append(Paragraph("Contact Email: <b>fake_contractor_support@gmail.com</b> (Public Unofficial Email)", meta_style))
    story.append(Paragraph("Official Website: <b>http://fake-unregistered-entity.xyz</b>", meta_style))
    story.append(Paragraph("Corporate Tax / Registration ID: <b>Unspecified / Unknown</b>", meta_style))

    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>AGREEMENT TERMS & CONDITIONS</b>", heading_style))

    # Clause 1: Advance Non-Refundable Payment & Wire Transfer
    story.append(Paragraph("<b>1. Advance Non-Refundable Payment & Wire Demand</b>", heading_style))
    story.append(Paragraph(
        "100% advance payment is required via immediate wire transfer within 24 hours of signing. "
        "All payments received are completely non-refundable under any circumstances with no recourse for non-delivery or cancellation.",
        body_style
    ))

    # Clause 2: Unlimited Liability & Total Damage Waiver
    story.append(Paragraph("<b>2. Limitation of Liability & Damage Waiver</b>", heading_style))
    story.append(Paragraph(
        "The company accepts no liability for any damages, direct or indirect, of any kind whatsoever. "
        "The contractor accepts unlimited liability for all company losses, costs, and damages regardless of cause.",
        body_style
    ))

    # Clause 3: Unilateral Immediate Termination & Wage Forfeiture
    story.append(Paragraph("<b>3. Termination & Wage Forfeiture</b>", heading_style))
    story.append(Paragraph(
        "Company may terminate employment or services immediately without notice and without cause. "
        "Termination without cause results in immediate forfeiture of all earned but unpaid compensation, commissions, and bonuses.",
        body_style
    ))

    # Clause 4: Retroactive Modification of Terms
    story.append(Paragraph("<b>4. Unilateral Contract Modification</b>", heading_style))
    story.append(Paragraph(
        "The company reserves the right to modify any clause, rate, or payment structure of this agreement retroactively at its sole discretion without notice.",
        body_style
    ))

    # Clause 5: Irrevocable Asset Surrender & 10-Year Non-Compete
    story.append(Paragraph("<b>5. Non-Compete & IP Surrender</b>", heading_style))
    story.append(Paragraph(
        "The contractor irrevocably assigns and surrenders all present and future intellectual property and personal work, "
        "and agrees not to compete in any capacity for 10 years worldwide.",
        body_style
    ))

    # Clause 6: Unilateral Arbitration & Court Waiver
    story.append(Paragraph("<b>6. Arbitration & Legal Remedies</b>", heading_style))
    story.append(Paragraph(
        "Any dispute shall be resolved by binding arbitration at the company's sole discretion in a foreign jurisdiction. "
        "The contractor waives all rights to jury trial, court recourse, or class action participation.",
        body_style
    ))

    # Clause 7 & 8: Contradictory Payment Windows
    story.append(Paragraph("<b>7. Payment Settlement Terms</b>", heading_style))
    story.append(Paragraph("Payment shall be settled within 15 Days of invoice submission.", body_style))

    story.append(Paragraph("<b>8. Invoice Processing Notice</b>", heading_style))
    story.append(Paragraph("Payment shall be settled within 90 Days of invoice submission.", body_style))

    # Clause 9 & 10: Contradictory Contract Values
    story.append(Paragraph("<b>9. Consideration Amount</b>", heading_style))
    story.append(Paragraph("Total consideration under this agreement shall be $50,000 USD.", body_style))

    story.append(Paragraph("<b>10. Maximum Financial Value</b>", heading_style))
    story.append(Paragraph("Total consideration under this agreement shall be $500,000 USD.", body_style))

    story.append(Spacer(1, 15))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#cbd5e1'), spaceAfter=15))

    # Signature Block (Unsigned / Empty Signature Line)
    story.append(Paragraph("<b>SIGNATURE BLOCK</b>", heading_style))
    story.append(Paragraph("Client Signature: ___________________________ Date: _____________", meta_style))
    story.append(Paragraph("Provider Signature: __________________________ Date: _____________", meta_style))

    # Build PDF
    doc.build(story)

    # Copy to uploads directory as well
    os.makedirs(os.path.dirname(upload_path), exist_ok=True)
    with open(target_path, 'rb') as src, open(upload_path, 'wb') as dst:
        dst.write(src.read())

    print(f"High-Risk Test PDF generated successfully at: {target_path}")
    print(f"Copied to uploads folder at: {upload_path}")

if __name__ == "__main__":
    generate_pdf()

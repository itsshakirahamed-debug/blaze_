import fitz
from typing import Dict, Any, List

def analyze_layout_manipulation(file_path: str) -> Dict[str, Any]:
    """
    Analyzes document formatting consistency, hidden white text, tiny fonts, page dimension anomalies, and font mixing.
    """
    if not file_path.lower().endswith(".pdf"):
        return {
            "layout_status": "Normal",
            "score": 100,
            "issues": []
        }
        
    issues = []
    score = 100
    
    try:
        doc = fitz.open(file_path)
        
        font_names = set()
        page_sizes = set()
        has_tiny_font = False
        has_invisible_text = False
        
        for page_idx, page in enumerate(doc):
            rect = page.rect
            page_sizes.add((round(rect.width, 1), round(rect.height, 1)))
            
            # Text block inspection
            blocks = page.get_text("dict").get("blocks", [])
            for b in blocks:
                if b.get("type") == 0: # Text block
                    for line in b.get("lines", []):
                        for span in line.get("spans", []):
                            font = span.get("font", "")
                            font_names.add(font)
                            size = span.get("size", 12)
                            color = span.get("color", 0)
                            
                            # Tiny font (< 2.5pt) hidden text check
                            if size < 2.5:
                                has_tiny_font = True
                                
                            # White text on white background check (color 16777215 is 0xFFFFFF)
                            if color == 16777215:
                                has_invisible_text = True

        if len(page_sizes) > 1:
            score -= 20
            issues.append("Document contains pages with inconsistent dimensions.")
            
        if len(font_names) > 8:
            score -= 25
            issues.append(f"Excessive font variations detected ({len(font_names)} distinct fonts), indicative of page splicing.")
            
        if has_tiny_font:
            score -= 30
            issues.append("Hidden micro-text (font size < 2.5pt) detected.")
            
        if has_invisible_text:
            score -= 35
            issues.append("Hidden white text detected on document background.")
            
        doc.close()
    except Exception as e:
        pass
        
    score = max(0, min(100, score))
    layout_status = "Manipulated" if score < 75 or len(issues) > 0 else "Normal"
    
    return {
        "layout_status": layout_status,
        "layout_health_score": score,
        "issues": issues,
        "reason": issues[0] if issues else "Document layout and typography formatting are consistent."
    }

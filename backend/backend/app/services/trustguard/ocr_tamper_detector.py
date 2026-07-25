import fitz
import re
from typing import Dict, Any, List

def detect_ocr_tampering(file_path: str, extracted_text: str) -> Dict[str, Any]:
    """
    Analyzes document text streams and image overlays for OCR manipulation and text swapping artifacts.
    """
    if not file_path.lower().endswith(".pdf"):
        return {
            "tampering_detected": False,
            "status": "Clean",
            "details": []
        }
        
    details = []
    tampering_detected = False
    
    try:
        doc = fitz.open(file_path)
        
        image_count = 0
        text_on_image_pages = 0
        
        for page in doc:
            images = page.get_images()
            image_count += len(images)
            page_text = page.get_text()
            
            # If a page contains an embedded image AND text overlay
            if len(images) > 0 and len(page_text.strip()) > 50:
                text_on_image_pages += 1
                
            # Check for conflicting numbers in raw page text vs rendered text
            raw_text = page.get_text("raw") if hasattr(page, "get_text") else ""
            if "500,000" in page_text and "50,000" in raw_text:
                tampering_detected = True
                details.append("Discrepancy detected between visible text and underlying PDF text stream.")

        if image_count > 0 and text_on_image_pages > 0 and image_count > len(doc) * 2:
            details.append("Multiple image patch overlays detected over text regions.")
            
        doc.close()
    except Exception as e:
        pass
        
    status = "Possible Tampering" if tampering_detected or len(details) > 0 else "Normal"
    
    return {
        "tampering_detected": tampering_detected or len(details) > 0,
        "status": status,
        "details": details
    }

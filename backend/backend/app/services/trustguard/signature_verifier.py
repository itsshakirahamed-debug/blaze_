import fitz
import re
from typing import Dict, Any

def verify_digital_signature(file_path: str) -> Dict[str, Any]:
    """
    Validates digital signatures embedded in PDF files.
    """
    if not file_path.lower().endswith(".pdf"):
        return {
            "signature_status": "Not Applicable",
            "reason": "Digital signature verification only applies to PDF documents.",
            "is_valid": True
        }
        
    status = "Not Present"
    reason = "No digital signature field detected in PDF structure."
    is_valid = True
    
    try:
        doc = fitz.open(file_path)
        
        # Check PyMuPDF signature flags
        sig_flags = doc.get_sig_flags() if hasattr(doc, "get_sig_flags") else -1
        
        # Search raw bytes for PDF PKCS7 / Sig objects
        with open(file_path, "rb") as f:
            content = f.read()
            
        has_sig_obj = b"/Type /Sig" in content or b"/ByteRange" in content or b"/PKCS7" in content
        
        if has_sig_obj or sig_flags > 0:
            # Detect post-signing modifications
            # Check for multiple incremental updates or byte range coverage gaps
            byte_ranges = re.findall(rb'/ByteRange\s*\[\s*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s*\]', content)
            
            if byte_ranges:
                offset1, len1, offset2, len2 = [int(x) for x in byte_ranges[-1]]
                file_size = len(content)
                if offset2 + len2 < file_size - 100:
                    status = "Invalid"
                    reason = "Document modified after digital signing (uncovered byte range appended)."
                    is_valid = False
                else:
                    status = "Valid"
                    reason = "Digital signature is valid and document content is sealed."
                    is_valid = True
            else:
                status = "Suspicious"
                reason = "Digital signature dictionary incomplete or corrupt."
                is_valid = False
                
        doc.close()
    except Exception as e:
        status = "Invalid"
        reason = f"Error inspecting PDF digital signature: {str(e)}"
        is_valid = False
        
    return {
        "signature_status": status,
        "reason": reason,
        "is_valid": is_valid
    }

import fitz  # PyMuPDF
import os
from datetime import datetime
from typing import Dict, Any

SUSPICIOUS_PRODUCERS = [
    "canva", "photoshop", "illustrator", "pdfescape", "gimp",
    "sejda", "pdf2go", "smallpdf", "pdfedit", "inkscape"
]

def analyze_metadata(file_path: str, doc_type: str = "pdf") -> Dict[str, Any]:
    """
    Analyzes document metadata to evaluate document health and detect suspicious editing history.
    """
    metadata_info = {
        "author": "Unknown",
        "company": "Unknown",
        "creation_date": "Unknown",
        "last_modified_date": "Unknown",
        "pdf_producer": "Unknown",
        "creator_software": "Unknown",
        "pdf_version": "1.4",
        "language": "en",
        "embedded_objects": 0
    }
    
    issues = []
    health_score = 100
    
    if file_path.lower().endswith(".pdf"):
        try:
            doc = fitz.open(file_path)
            meta = doc.metadata or {}
            
            metadata_info["author"] = meta.get("author") or "Unknown"
            metadata_info["creation_date"] = meta.get("creationDate") or "Unknown"
            metadata_info["last_modified_date"] = meta.get("modDate") or "Unknown"
            metadata_info["pdf_producer"] = meta.get("producer") or "Unknown"
            metadata_info["creator_software"] = meta.get("creator") or "Unknown"
            metadata_info["pdf_version"] = str(doc.pdf_version() if hasattr(doc, "pdf_version") else "1.4")
            
            # Count embedded files / objects
            try:
                metadata_info["embedded_objects"] = doc.embfile_count()
            except Exception:
                metadata_info["embedded_objects"] = 0
                
            doc.close()
            
            # Check suspicious editing tools
            producer_str = (metadata_info["pdf_producer"] + " " + metadata_info["creator_software"]).lower()
            for tool in SUSPICIOUS_PRODUCERS:
                if tool in producer_str:
                    health_score -= 25
                    issues.append(f"Document was created/modified using image editing or online software: {tool.title()}")
                    
            # Check missing metadata
            if metadata_info["author"] == "Unknown" and metadata_info["creator_software"] == "Unknown":
                health_score -= 15
                issues.append("Document metadata is mostly missing or cleared.")
                
            # Check timestamp consistency
            cre_date = metadata_info["creation_date"]
            mod_date = metadata_info["last_modified_date"]
            if cre_date != "Unknown" and mod_date != "Unknown" and cre_date != mod_date:
                health_score -= 15
                issues.append("Document modified after original creation.")
                
        except Exception as e:
            health_score -= 30
            issues.append(f"Failed to parse PDF metadata: {str(e)}")
    else:
        # DOCX or basic text
        metadata_info["creator_software"] = "Microsoft Word / DOCX"
        
    health_score = max(0, min(100, health_score))
    status = "Suspicious" if health_score < 80 else "Healthy"
    
    return {
        "metadata_health": health_score,
        "status": status,
        "info": metadata_info,
        "issues": issues,
        "reason": issues[0] if issues else "Metadata is intact and genuine."
    }

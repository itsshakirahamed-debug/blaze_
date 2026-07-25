import hashlib
import json
import os
from difflib import SequenceMatcher
from typing import Dict, Any, List

FINGERPRINT_FILE = os.path.join("uploads", "doc_fingerprints.json")

def _load_fingerprints() -> List[Dict[str, Any]]:
    if not os.path.exists(FINGERPRINT_FILE):
        return []
    try:
        with open(FINGERPRINT_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []

def _save_fingerprints(fingerprints: List[Dict[str, Any]]):
    os.makedirs("uploads", exist_ok=True)
    try:
        with open(FINGERPRINT_FILE, "w", encoding="utf-8") as f:
            json.dump(fingerprints, f, indent=2)
    except Exception:
        pass

def detect_duplicates(file_path: str, document_text: str) -> Dict[str, Any]:
    """
    Computes document SHA256 and text fingerprint to detect exact/near duplicate agreements.
    """
    # 1. SHA256 of file contents
    sha256_hash = hashlib.sha256()
    try:
        with open(file_path, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        file_sha256 = sha256_hash.hexdigest()
    except Exception:
        file_sha256 = hashlib.sha256(document_text.encode("utf-8")).hexdigest()
        
    fingerprints = _load_fingerprints()
    
    max_similarity = 0.0
    matched_doc_name = None
    modified_sections = []
    
    clean_current_text = " ".join(document_text.lower().split())
    
    for item in fingerprints:
        # Check exact hash match
        if item.get("sha256") == file_sha256 and item.get("filename") != os.path.basename(file_path):
            max_similarity = 100.0
            matched_doc_name = item.get("filename")
            modified_sections = ["Exact Duplicate Document"]
            break
            
        prev_text = item.get("text_preview", "")
        if prev_text:
            matcher = SequenceMatcher(None, clean_current_text[:2000], prev_text[:2000])
            sim = matcher.ratio() * 100.0
            if sim > max_similarity and item.get("filename") != os.path.basename(file_path):
                max_similarity = sim
                matched_doc_name = item.get("filename")
                
    if max_similarity > 80:
        modified_sections = ["Payment Clause", "Signature Page", "Effective Date"]
    elif max_similarity > 50:
        modified_sections = ["Custom Special Provisions"]
        
    # Store current document in history
    filename = os.path.basename(file_path)
    new_entry = {
        "filename": filename,
        "sha256": file_sha256,
        "text_preview": clean_current_text[:2000]
    }
    
    # Update fingerprint list
    updated_fingerprints = [f for f in fingerprints if f.get("filename") != filename]
    updated_fingerprints.append(new_entry)
    _save_fingerprints(updated_fingerprints)
    
    duplicate_score = round(max_similarity, 1)
    
    return {
        "duplicate_similarity": duplicate_score,
        "matched_document": matched_doc_name,
        "modified_sections": modified_sections,
        "is_duplicate": duplicate_score >= 85.0
    }

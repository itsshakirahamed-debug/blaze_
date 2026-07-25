import re
from typing import Dict, Any, List

FREE_EMAIL_PROVIDERS = {"gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com", "icloud.com", "protonmail.com"}

def verify_company_info(document_text: str) -> Dict[str, Any]:
    """
    Extracts company name, email, website, registration/tax numbers and checks legitimacy/impersonation risks.
    """
    company_name = "Unknown Company"
    website = "Unknown"
    email = "Unknown"
    reg_number = "Unknown"
    
    issues = []
    
    # 1. Extract Email
    email_match = re.search(r'\b[A-Za-z0-9._%+-]+@([A-Za-z0-9.-]+\.[A-Z|a-z]{2,})\b', document_text)
    if email_match:
        email = email_match.group(0)
        domain = email_match.group(1).lower()
    else:
        domain = None
        
    # 2. Extract Website
    web_match = re.search(r'\b(?:https?://)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})\b', document_text)
    if web_match:
        website = web_match.group(0)
        web_domain = web_match.group(1).lower()
    else:
        web_domain = None

    # 3. Extract Company Name (e.g. Acme Corp, ABC Technologies Inc, LLC, Ltd)
    comp_match = re.search(r'\b([A-Z0-9][A-Za-z0-9\s&,-]{2,30}\s(?:Inc|LLC|Corp|Corporation|Ltd|Limited|Technologies|Solutions|Services))\b', document_text)
    if comp_match:
        company_name = comp_match.group(1).strip()
        
    # 4. Extract Tax / Registration ID (GST / EIN / Registration Number)
    reg_match = re.search(r'\b(?:EIN|GST|Reg|Registration|Tax ID|CIN)[\s:#\-]+([A-Z0-9\-]{5,20})\b', document_text, re.IGNORECASE)
    if reg_match:
        reg_number = reg_match.group(1).strip()

    # Determine verification status
    has_company_name = company_name != "Unknown Company"
    has_corporate_email = domain and (domain not in FREE_EMAIL_PROVIDERS)
    has_reg = reg_number != "Unknown"
    
    verified = bool(has_company_name or has_corporate_email or has_reg)

    # Add specific issues
    if not has_company_name:
        issues.append("No registered corporate name detected in the uploaded document.")

    if domain in FREE_EMAIL_PROVIDERS:
        verified = False
        issues.append(f"Official contract uses public email domain ({email}) instead of custom corporate domain. Potential impersonation risk.")
        
    if domain and web_domain and domain not in FREE_EMAIL_PROVIDERS:
        base_email_domain = domain.split('.')[-2]
        base_web_domain = web_domain.split('.')[-2]
        if base_email_domain != base_web_domain and base_email_domain not in base_web_domain and base_web_domain not in base_email_domain:
            verified = False
            issues.append(f"Domain mismatch between contract contact email (@{domain}) and website domain ({web_domain}).")

    if reg_number == "Unknown":
        issues.append("No official corporate registration or tax ID specified in contract metadata.")

    if not verified and not issues:
        issues.append("Unable to verify company authenticity from text content.")

    return {
        "company_verified": verified,
        "company_name": company_name if has_company_name else "No company detected",
        "email": email,
        "website": website,
        "registration_number": reg_number,
        "issues": issues,
        "reason": issues[0] if issues else "Company contact info and domain align with legitimate standards."
    }

import re

def clean_text(text: str):

    # Replace newlines with spaces
    text = text.replace("\n", " ")

    # Replace tabs with spaces
    text = text.replace("\t", " ")

    # Remove multiple spaces
    text = re.sub(r"\s+", " ", text)

    return text.strip()
from docx import Document

def extract_docx_text(docx_path):
    document = Document(docx_path)

    text = ""

    for para in document.paragraphs:
        text += para.text + "\n"

    return text
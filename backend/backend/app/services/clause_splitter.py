import re

def split_into_clauses(text: str):
    """
    Splits text into clauses and removes duplicates or segments with >=90% word similarity.
    """
    raw_clauses = re.split(r'\b\d+\.\s', text)
    raw_clauses = [c.strip() for c in raw_clauses if len(c.strip()) > 15]

    unique_clauses = []
    for c in raw_clauses:
        is_duplicate = False
        # Calculate Jaccard similarity of words against already collected clauses
        words_c = set(c.lower().split())
        for uc in unique_clauses:
            words_uc = set(uc.lower().split())
            if words_c and words_uc:
                sim = len(words_c.intersection(words_uc)) / len(words_c.union(words_uc))
                if sim >= 0.90:
                    is_duplicate = True
                    break
        if not is_duplicate:
            unique_clauses.append(c)

    return unique_clauses
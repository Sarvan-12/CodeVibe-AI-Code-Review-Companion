import random

def predict_bugs(code_content: str) -> list:
    """
    Mock ML bug prediction.
    In a real scenario, this would load a model (e.g., CodeBERT) and run inference.
    """
    # Mock logic: if "eval" is in code, flag it.
    bugs = []
    if "eval(" in code_content:
        bugs.append({
            "type": "Security Risk",
            "message": "Usage of eval() detected. This is a security risk.",
            "line": code_content.find("eval(") // len(code_content.split('\n')) + 1 # Rough line estimation
        })
    
    # Random mock bug for demo
    if len(code_content) > 100 and random.random() > 0.7:
        bugs.append({
            "type": "Potential Bug",
            "message": "Complex logic detected, consider refactoring.",
            "line": 1
        })
        
    return bugs

def calculate_complexity(code_content: str) -> dict:
    """
    Calculate code complexity (Cyclomatic complexity placeholder).
    """
    return {
        "cyclomatic_complexity": len(code_content.split('if ')) + len(code_content.split('for '))
    }

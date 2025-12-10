"""
Language analyzer infrastructure for multi-language code analysis.
Provides unified interface for analyzing code in different programming languages.
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, List
from enum import Enum


class Language(str, Enum):
    """Supported programming languages"""
    PYTHON = "python"
    JAVASCRIPT = "javascript"
    TYPESCRIPT = "typescript"
    JAVA = "java"
    CPP = "cpp"


class AnalysisResult:
    """Standardized analysis result across all languages"""
    def __init__(self):
        self.issues: List[Dict[str, Any]] = []
        self.complexity_metrics: Dict[str, Any] = {}
        self.language: str = ""
        self.error: str = ""
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "issues": self.issues,
            "complexity_metrics": self.complexity_metrics,
            "language": self.language,
            "error": self.error if self.error else None
        }


class BaseAnalyzer(ABC):
    """Base class for language-specific analyzers"""
    
    @abstractmethod
    def analyze(self, code_content: str) -> AnalysisResult:
        """Analyze code and return standardized results"""
        pass
    
    @abstractmethod
    def calculate_complexity(self, code_content: str) -> Dict[str, Any]:
        """Calculate language-specific complexity metrics"""
        pass


def detect_language(code_content: str, hint: str = None) -> Language:
    """
    Detect programming language from code content.
    Uses hint if provided, otherwise attempts detection.
    """
    if hint:
        try:
            return Language(hint.lower())
        except ValueError:
            pass
    
    # Simple heuristic-based detection
    code_lower = code_content.lower()
    
    # Check for language-specific keywords/patterns
    if "def " in code_content or "import " in code_content or "class " in code_content and ":" in code_content:
        return Language.PYTHON
    elif "function " in code_content or "const " in code_content or "let " in code_content or "var " in code_content:
        if "interface " in code_content or ": " in code_content and "=>" in code_content:
            return Language.TYPESCRIPT
        return Language.JAVASCRIPT
    elif "public class " in code_content or "private " in code_content or "void main" in code_content:
        return Language.JAVA
    elif "#include" in code_content or "std::" in code_content or "cout" in code_content:
        return Language.CPP
    
    # Default to Python if uncertain
    return Language.PYTHON


def get_analyzer(language: Language) -> BaseAnalyzer:
    """Factory function to get appropriate analyzer for language"""
    from .python_analyzer import PythonAnalyzer
    from .javascript_analyzer import JavaScriptAnalyzer
    
    analyzers = {
        Language.PYTHON: PythonAnalyzer,
        Language.JAVASCRIPT: JavaScriptAnalyzer,
        Language.TYPESCRIPT: JavaScriptAnalyzer,  # TypeScript uses same analyzer
    }
    
    analyzer_class = analyzers.get(language)
    if not analyzer_class:
        raise ValueError(f"Unsupported language: {language}")
    
    return analyzer_class()

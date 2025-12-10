"""
Style Learner Service for CodeVibe
Learns user coding preferences through statistical analysis
No ML models required - uses pattern frequency and heuristics
"""

import re
from typing import List, Dict, Optional
from dataclasses import dataclass
from collections import Counter
import ast


@dataclass
class StylePatterns:
    """Represents extracted style patterns from code"""
    naming_convention: str  # 'snake_case', 'camelCase', 'PascalCase'
    indentation: Dict[str, any]  # {'type': 'spaces', 'size': 4}
    quote_style: str  # 'single', 'double'
    line_length: int  # Average line length
    comment_style: str  # 'above', 'inline', 'docstring'
    import_style: str  # 'grouped', 'alphabetical', 'mixed'


@dataclass
class StyleRecommendation:
    """Represents a style recommendation"""
    line_number: int
    recommendation_type: str
    current_style: str
    preferred_style: str
    description: str
    confidence: float


class StyleLearner:
    """
    Learn user coding style preferences through statistical analysis
    Tracks patterns across multiple code submissions
    """
    
    def __init__(self):
        pass
    
    def extract_patterns(self, code: str, language: str = "python") -> StylePatterns:
        """
        Extract style patterns from code
        Returns StylePatterns object
        """
        if language == "python":
            return self._extract_python_patterns(code)
        elif language in ["javascript", "typescript"]:
            return self._extract_javascript_patterns(code)
        else:
            return self._extract_generic_patterns(code)
    
    def _extract_python_patterns(self, code: str) -> StylePatterns:
        """Extract Python-specific style patterns"""
        lines = code.split('\n')
        
        # Naming convention
        naming = self._detect_naming_convention(code)
        
        # Indentation
        indentation = self._detect_indentation(lines)
        
        # Quote style
        quote_style = self._detect_quote_style(code)
        
        # Line length
        line_length = self._calculate_avg_line_length(lines)
        
        # Comment style
        comment_style = self._detect_comment_style(lines)
        
        # Import style
        import_style = self._detect_import_style(code)
        
        return StylePatterns(
            naming_convention=naming,
            indentation=indentation,
            quote_style=quote_style,
            line_length=line_length,
            comment_style=comment_style,
            import_style=import_style
        )
    
    def _extract_javascript_patterns(self, code: str) -> StylePatterns:
        """Extract JavaScript/TypeScript style patterns"""
        lines = code.split('\n')
        
        # Similar to Python but with JS-specific patterns
        naming = self._detect_naming_convention(code, language="javascript")
        indentation = self._detect_indentation(lines)
        quote_style = self._detect_quote_style(code)
        line_length = self._calculate_avg_line_length(lines)
        comment_style = self._detect_comment_style(lines, language="javascript")
        import_style = "es6"  # Simplified for now
        
        return StylePatterns(
            naming_convention=naming,
            indentation=indentation,
            quote_style=quote_style,
            line_length=line_length,
            comment_style=comment_style,
            import_style=import_style
        )
    
    def _extract_generic_patterns(self, code: str) -> StylePatterns:
        """Extract generic patterns for any language"""
        lines = code.split('\n')
        
        return StylePatterns(
            naming_convention="unknown",
            indentation=self._detect_indentation(lines),
            quote_style=self._detect_quote_style(code),
            line_length=self._calculate_avg_line_length(lines),
            comment_style="unknown",
            import_style="unknown"
        )
    
    def _detect_naming_convention(self, code: str, language: str = "python") -> str:
        """Detect naming convention (snake_case, camelCase, PascalCase)"""
        # Extract identifiers
        if language == "python":
            # Look for function and variable names
            snake_case = len(re.findall(r'\b[a-z]+_[a-z_]+\b', code))
            camel_case = len(re.findall(r'\b[a-z]+[A-Z][a-zA-Z]*\b', code))
            pascal_case = len(re.findall(r'\b[A-Z][a-z]+[A-Z][a-zA-Z]*\b', code))
        else:
            # JavaScript typically uses camelCase
            snake_case = len(re.findall(r'\b[a-z]+_[a-z_]+\b', code))
            camel_case = len(re.findall(r'\b[a-z]+[A-Z][a-zA-Z]*\b', code))
            pascal_case = len(re.findall(r'\b[A-Z][a-z]+[A-Z][a-zA-Z]*\b', code))
        
        # Return most common
        counts = {'snake_case': snake_case, 'camelCase': camel_case, 'PascalCase': pascal_case}
        return max(counts, key=counts.get) if max(counts.values()) > 0 else "mixed"
    
    def _detect_indentation(self, lines: List[str]) -> Dict[str, any]:
        """Detect indentation style (tabs vs spaces, size)"""
        indents = []
        
        for line in lines:
            if line and line[0] in [' ', '\t']:
                # Count leading whitespace
                indent = len(line) - len(line.lstrip())
                if line[0] == '\t':
                    indents.append(('tabs', 1))
                else:
                    indents.append(('spaces', indent))
        
        if not indents:
            return {'type': 'spaces', 'size': 4}  # Default
        
        # Determine type
        indent_types = Counter([t for t, _ in indents])
        indent_type = 'tabs' if indent_types.get('tabs', 0) > indent_types.get('spaces', 0) else 'spaces'
        
        # Determine size (for spaces)
        if indent_type == 'spaces':
            sizes = [s for t, s in indents if t == 'spaces' and s > 0]
            if sizes:
                # Find GCD of all indent sizes (likely the base indent)
                from math import gcd
                from functools import reduce
                indent_size = reduce(gcd, sizes)
            else:
                indent_size = 4
        else:
            indent_size = 1
        
        return {'type': indent_type, 'size': indent_size}
    
    def _detect_quote_style(self, code: str) -> str:
        """Detect quote style preference (single vs double quotes)"""
        single_quotes = len(re.findall(r"'[^']*'", code))
        double_quotes = len(re.findall(r'"[^"]*"', code))
        
        if single_quotes > double_quotes:
            return 'single'
        elif double_quotes > single_quotes:
            return 'double'
        else:
            return 'mixed'
    
    def _calculate_avg_line_length(self, lines: List[str]) -> int:
        """Calculate average line length"""
        non_empty_lines = [line for line in lines if line.strip()]
        if not non_empty_lines:
            return 0
        return sum(len(line) for line in non_empty_lines) // len(non_empty_lines)
    
    def _detect_comment_style(self, lines: List[str], language: str = "python") -> str:
        """Detect comment placement style"""
        above_count = 0
        inline_count = 0
        docstring_count = 0
        
        for i, line in enumerate(lines):
            if language == "python":
                if '"""' in line or "'''" in line:
                    docstring_count += 1
                elif '#' in line:
                    # Check if comment is inline or on its own line
                    code_before_comment = line.split('#')[0].strip()
                    if code_before_comment:
                        inline_count += 1
                    else:
                        above_count += 1
            else:
                # JavaScript
                if '//' in line:
                    code_before_comment = line.split('//')[0].strip()
                    if code_before_comment:
                        inline_count += 1
                    else:
                        above_count += 1
                elif '/*' in line:
                    docstring_count += 1
        
        # Determine most common style
        counts = {'above': above_count, 'inline': inline_count, 'docstring': docstring_count}
        return max(counts, key=counts.get) if max(counts.values()) > 0 else "mixed"
    
    def _detect_import_style(self, code: str) -> str:
        """Detect import organization style"""
        try:
            tree = ast.parse(code)
            imports = []
            
            for node in ast.walk(tree):
                if isinstance(node, (ast.Import, ast.ImportFrom)):
                    imports.append(node.lineno)
            
            if not imports:
                return "none"
            
            # Check if imports are grouped together
            if len(imports) > 1:
                gaps = [imports[i+1] - imports[i] for i in range(len(imports)-1)]
                avg_gap = sum(gaps) / len(gaps)
                
                if avg_gap <= 2:
                    return "grouped"
                else:
                    return "scattered"
            
            return "single"
            
        except SyntaxError:
            return "unknown"
    
    def get_recommendations(
        self,
        code: str,
        user_patterns: Dict[str, StylePatterns],
        language: str = "python"
    ) -> List[StyleRecommendation]:
        """
        Compare code against user's learned style and generate recommendations
        user_patterns: Dict mapping pattern_type to StylePatterns
        """
        recommendations = []
        
        # Extract patterns from current code
        current_patterns = self.extract_patterns(code, language)
        
        # Get user's preferred patterns (most frequent)
        if not user_patterns:
            return recommendations  # No learned patterns yet
        
        # Compare and generate recommendations
        lines = code.split('\n')
        
        # Check naming convention
        if 'naming' in user_patterns:
            preferred_naming = user_patterns['naming'].naming_convention
            if current_patterns.naming_convention != preferred_naming:
                recommendations.append(StyleRecommendation(
                    line_number=1,
                    recommendation_type="naming_convention",
                    current_style=current_patterns.naming_convention,
                    preferred_style=preferred_naming,
                    description=f"Consider using {preferred_naming} to match your usual style",
                    confidence=0.7
                ))
        
        # Check indentation
        if 'indentation' in user_patterns:
            preferred_indent = user_patterns['indentation'].indentation
            if current_patterns.indentation != preferred_indent:
                recommendations.append(StyleRecommendation(
                    line_number=1,
                    recommendation_type="indentation",
                    current_style=f"{current_patterns.indentation['type']} ({current_patterns.indentation['size']})",
                    preferred_style=f"{preferred_indent['type']} ({preferred_indent['size']})",
                    description=f"Your usual indentation is {preferred_indent['size']} {preferred_indent['type']}",
                    confidence=0.9
                ))
        
        # Check quote style
        if 'quotes' in user_patterns:
            preferred_quotes = user_patterns['quotes'].quote_style
            if current_patterns.quote_style != preferred_quotes:
                recommendations.append(StyleRecommendation(
                    line_number=1,
                    recommendation_type="quote_style",
                    current_style=current_patterns.quote_style,
                    preferred_style=preferred_quotes,
                    description=f"You typically use {preferred_quotes} quotes",
                    confidence=0.6
                ))
        
        return recommendations
    
    def update_user_profile(
        self,
        user_id: int,
        patterns: StylePatterns,
        db_session
    ):
        """
        Update user's style profile in database
        Increments frequency of observed patterns
        """
        from models import StylePattern
        
        # Update or create pattern entries
        pattern_data = {
            'naming': patterns.naming_convention,
            'indentation': patterns.indentation,
            'quotes': patterns.quote_style,
            'line_length': patterns.line_length,
            'comments': patterns.comment_style,
            'imports': patterns.import_style
        }
        
        for pattern_type, pattern_value in pattern_data.items():
            # Check if pattern exists
            existing = db_session.query(StylePattern).filter(
                StylePattern.user_id == user_id,
                StylePattern.pattern_type == pattern_type
            ).first()
            
            if existing:
                # Update frequency
                existing.frequency += 1
                existing.confidence = min(1.0, existing.frequency / 10.0)  # Cap at 1.0
            else:
                # Create new pattern
                new_pattern = StylePattern(
                    user_id=user_id,
                    pattern_type=pattern_type,
                    pattern_value=pattern_value if isinstance(pattern_value, dict) else {'value': pattern_value},
                    frequency=1,
                    confidence=0.1
                )
                db_session.add(new_pattern)
        
        db_session.commit()


# Global instance
_style_learner = None


def get_style_learner() -> StyleLearner:
    """Get or create StyleLearner instance"""
    global _style_learner
    if _style_learner is None:
        _style_learner = StyleLearner()
    return _style_learner

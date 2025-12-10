"""
Auto-Fixer Service for CodeVibe
Generates automated code fixes using AST parsing and pattern matching
Optimized for lightweight operation without heavy ML models
"""

import re
import ast
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass
from enum import Enum


class FixType(Enum):
    """Types of fixes that can be generated"""
    SIMPLE = "simple"  # Unused imports, whitespace, etc.
    REFACTOR = "refactor"  # Extract method, rename, etc.
    PERFORMANCE = "performance"  # List comprehensions, etc.
    SECURITY = "security"  # SQL injection, XSS, etc.
    STYLE = "style"  # PEP8, naming conventions, etc.


@dataclass
class FixSuggestion:
    """Represents a suggested code fix"""
    fix_id: str
    fix_type: FixType
    title: str
    description: str
    line_start: int
    line_end: int
    before_code: str
    after_code: str
    diff: str
    confidence: float  # 0.0 to 1.0
    auto_applicable: bool  # Can be applied automatically


class AutoFixer:
    """
    Generates and applies automated code fixes
    Uses AST parsing for Python and regex for other languages
    """
    
    def __init__(self):
        self.fix_counter = 0
    
    def analyze_code(self, code: str, language: str = "python") -> List[FixSuggestion]:
        """
        Analyze code and generate fix suggestions
        """
        fixes = []
        
        if language == "python":
            fixes.extend(self._analyze_python(code))
        elif language in ["javascript", "typescript"]:
            fixes.extend(self._analyze_javascript(code))
        
        return fixes
    
    def _analyze_python(self, code: str) -> List[FixSuggestion]:
        """Analyze Python code for fixable issues"""
        fixes = []
        lines = code.split('\n')
        
        # Fix 1: Remove unused imports
        fixes.extend(self._fix_unused_imports(code, lines))
        
        # Fix 2: Remove trailing whitespace
        fixes.extend(self._fix_trailing_whitespace(lines))
        
        # Fix 3: Add missing docstrings
        fixes.extend(self._fix_missing_docstrings(code, lines))
        
        # Fix 4: Fix comparison with None
        fixes.extend(self._fix_none_comparison(lines))
        
        # Fix 5: Replace bare except
        fixes.extend(self._fix_bare_except(lines))
        
        # Fix 6: Use list comprehensions
        fixes.extend(self._suggest_list_comprehension(lines))
        
        return fixes
    
    def _fix_unused_imports(self, code: str, lines: List[str]) -> List[FixSuggestion]:
        """Detect and remove unused imports"""
        fixes = []
        
        try:
            tree = ast.parse(code)
            imports = []
            
            # Collect all imports
            for node in ast.walk(tree):
                if isinstance(node, ast.Import):
                    for alias in node.names:
                        imports.append((alias.name, node.lineno))
                elif isinstance(node, ast.ImportFrom):
                    for alias in node.names:
                        imports.append((alias.name, node.lineno))
            
            # Check if each import is used
            for import_name, line_no in imports:
                # Simple heuristic: check if name appears elsewhere in code
                usage_count = sum(1 for line in lines if import_name in line)
                if usage_count == 1:  # Only appears in import statement
                    self.fix_counter += 1
                    before = lines[line_no - 1]
                    after = ""  # Remove the line
                    
                    fixes.append(FixSuggestion(
                        fix_id=f"fix_{self.fix_counter}",
                        fix_type=FixType.SIMPLE,
                        title=f"Remove unused import '{import_name}'",
                        description=f"Import '{import_name}' is not used in the code",
                        line_start=line_no,
                        line_end=line_no,
                        before_code=before,
                        after_code=after,
                        diff=self._generate_diff(before, after, line_no),
                        confidence=0.9,
                        auto_applicable=True
                    ))
        except SyntaxError:
            pass  # Can't parse, skip this fix
        
        return fixes
    
    def _fix_trailing_whitespace(self, lines: List[str]) -> List[FixSuggestion]:
        """Remove trailing whitespace"""
        fixes = []
        
        for i, line in enumerate(lines, 1):
            if line != line.rstrip():
                self.fix_counter += 1
                before = line
                after = line.rstrip()
                
                fixes.append(FixSuggestion(
                    fix_id=f"fix_{self.fix_counter}",
                    fix_type=FixType.STYLE,
                    title=f"Remove trailing whitespace on line {i}",
                    description="Trailing whitespace should be removed",
                    line_start=i,
                    line_end=i,
                    before_code=before,
                    after_code=after,
                    diff=self._generate_diff(before, after, i),
                    confidence=1.0,
                    auto_applicable=True
                ))
        
        return fixes
    
    def _fix_missing_docstrings(self, code: str, lines: List[str]) -> List[FixSuggestion]:
        """Add missing docstrings to functions and classes"""
        fixes = []
        
        try:
            tree = ast.parse(code)
            
            for node in ast.walk(tree):
                if isinstance(node, (ast.FunctionDef, ast.ClassDef)):
                    # Check if docstring exists
                    has_docstring = (
                        node.body and
                        isinstance(node.body[0], ast.Expr) and
                        isinstance(node.body[0].value, ast.Str)
                    )
                    
                    if not has_docstring:
                        self.fix_counter += 1
                        line_no = node.lineno
                        indent = len(lines[line_no - 1]) - len(lines[line_no - 1].lstrip())
                        
                        # Generate docstring
                        if isinstance(node, ast.FunctionDef):
                            docstring = f'{" " * (indent + 4)}"""TODO: Add function description"""'
                        else:
                            docstring = f'{" " * (indent + 4)}"""TODO: Add class description"""'
                        
                        before = lines[line_no - 1]
                        after = before + '\n' + docstring
                        
                        fixes.append(FixSuggestion(
                            fix_id=f"fix_{self.fix_counter}",
                            fix_type=FixType.STYLE,
                            title=f"Add docstring to {node.name}",
                            description=f"{'Function' if isinstance(node, ast.FunctionDef) else 'Class'} '{node.name}' is missing a docstring",
                            line_start=line_no,
                            line_end=line_no,
                            before_code=before,
                            after_code=after,
                            diff=self._generate_diff(before, after, line_no),
                            confidence=0.8,
                            auto_applicable=False  # User should write proper docstring
                        ))
        except SyntaxError:
            pass
        
        return fixes
    
    def _fix_none_comparison(self, lines: List[str]) -> List[FixSuggestion]:
        """Fix comparison with None (use 'is' instead of '==')"""
        fixes = []
        pattern = re.compile(r'==\s*None|None\s*==')
        
        for i, line in enumerate(lines, 1):
            if pattern.search(line):
                self.fix_counter += 1
                before = line
                after = pattern.sub(lambda m: 'is None', line)
                
                fixes.append(FixSuggestion(
                    fix_id=f"fix_{self.fix_counter}",
                    fix_type=FixType.STYLE,
                    title=f"Use 'is None' instead of '== None' on line {i}",
                    description="Use 'is' for None comparison instead of '=='",
                    line_start=i,
                    line_end=i,
                    before_code=before,
                    after_code=after,
                    diff=self._generate_diff(before, after, i),
                    confidence=1.0,
                    auto_applicable=True
                ))
        
        return fixes
    
    def _fix_bare_except(self, lines: List[str]) -> List[FixSuggestion]:
        """Fix bare except clauses"""
        fixes = []
        pattern = re.compile(r'except\s*:')
        
        for i, line in enumerate(lines, 1):
            if pattern.search(line):
                self.fix_counter += 1
                before = line
                after = pattern.sub('except Exception:', line)
                
                fixes.append(FixSuggestion(
                    fix_id=f"fix_{self.fix_counter}",
                    fix_type=FixType.REFACTOR,
                    title=f"Replace bare except on line {i}",
                    description="Bare except catches all exceptions including system exits",
                    line_start=i,
                    line_end=i,
                    before_code=before,
                    after_code=after,
                    diff=self._generate_diff(before, after, i),
                    confidence=0.9,
                    auto_applicable=True
                ))
        
        return fixes
    
    def _suggest_list_comprehension(self, lines: List[str]) -> List[FixSuggestion]:
        """Suggest converting simple loops to list comprehensions"""
        fixes = []
        
        # Simple pattern: for loop with append
        for i in range(len(lines) - 2):
            if 'for ' in lines[i] and ' in ' in lines[i]:
                if '.append(' in lines[i + 1]:
                    self.fix_counter += 1
                    
                    # Extract loop variable and iterable
                    match = re.search(r'for\s+(\w+)\s+in\s+(.+):', lines[i])
                    if match:
                        var = match.group(1)
                        iterable = match.group(2)
                        
                        # Extract what's being appended
                        append_match = re.search(r'\.append\((.+)\)', lines[i + 1])
                        if append_match:
                            expr = append_match.group(1)
                            
                            before = lines[i] + '\n' + lines[i + 1]
                            after = f"    result = [{expr} for {var} in {iterable}]"
                            
                            fixes.append(FixSuggestion(
                                fix_id=f"fix_{self.fix_counter}",
                                fix_type=FixType.PERFORMANCE,
                                title=f"Use list comprehension on line {i + 1}",
                                description="List comprehension is more Pythonic and faster",
                                line_start=i + 1,
                                line_end=i + 2,
                                before_code=before,
                                after_code=after,
                                diff=self._generate_diff(before, after, i + 1),
                                confidence=0.7,
                                auto_applicable=False  # Needs manual review
                            ))
        
        return fixes
    
    def _analyze_javascript(self, code: str) -> List[FixSuggestion]:
        """Analyze JavaScript/TypeScript code"""
        fixes = []
        lines = code.split('\n')
        
        # Fix 1: Use strict equality
        fixes.extend(self._fix_loose_equality(lines))
        
        # Fix 2: Use const/let instead of var
        fixes.extend(self._fix_var_usage(lines))
        
        return fixes
    
    def _fix_loose_equality(self, lines: List[str]) -> List[FixSuggestion]:
        """Replace == with ==="""
        fixes = []
        pattern = re.compile(r'==(?!=)')
        
        for i, line in enumerate(lines, 1):
            if pattern.search(line):
                self.fix_counter += 1
                before = line
                after = pattern.sub('===', line)
                
                fixes.append(FixSuggestion(
                    fix_id=f"fix_{self.fix_counter}",
                    fix_type=FixType.STYLE,
                    title=f"Use strict equality (===) on line {i}",
                    description="Use === instead of == for strict equality",
                    line_start=i,
                    line_end=i,
                    before_code=before,
                    after_code=after,
                    diff=self._generate_diff(before, after, i),
                    confidence=1.0,
                    auto_applicable=True
                ))
        
        return fixes
    
    def _fix_var_usage(self, lines: List[str]) -> List[FixSuggestion]:
        """Replace var with const/let"""
        fixes = []
        pattern = re.compile(r'\bvar\b')
        
        for i, line in enumerate(lines, 1):
            if pattern.search(line):
                self.fix_counter += 1
                before = line
                # Default to const, user can change to let if needed
                after = pattern.sub('const', line)
                
                fixes.append(FixSuggestion(
                    fix_id=f"fix_{self.fix_counter}",
                    fix_type=FixType.STYLE,
                    title=f"Replace 'var' with 'const' on line {i}",
                    description="Use const or let instead of var for block scoping",
                    line_start=i,
                    line_end=i,
                    before_code=before,
                    after_code=after,
                    diff=self._generate_diff(before, after, i),
                    confidence=0.8,
                    auto_applicable=False  # User should decide const vs let
                ))
        
        return fixes
    
    def _generate_diff(self, before: str, after: str, line_no: int) -> str:
        """Generate unified diff format"""
        if not after:  # Line removal
            return f"- {before}"
        elif before == after:
            return f"  {before}"
        else:
            return f"- {before}\n+ {after}"
    
    def apply_fix(self, code: str, fix: FixSuggestion) -> str:
        """
        Apply a fix to the code
        Returns the modified code
        """
        lines = code.split('\n')
        
        if fix.line_start == fix.line_end:
            # Single line fix
            if not fix.after_code:
                # Remove line
                lines.pop(fix.line_start - 1)
            else:
                # Replace line
                lines[fix.line_start - 1] = fix.after_code
        else:
            # Multi-line fix
            # Remove old lines
            for _ in range(fix.line_end - fix.line_start + 1):
                lines.pop(fix.line_start - 1)
            # Insert new lines
            new_lines = fix.after_code.split('\n')
            for i, new_line in enumerate(new_lines):
                lines.insert(fix.line_start - 1 + i, new_line)
        
        return '\n'.join(lines)
    
    def validate_fix(self, code: str, language: str = "python") -> Tuple[bool, Optional[str]]:
        """
        Validate that the fixed code is syntactically correct
        Returns (is_valid, error_message)
        """
        if language == "python":
            try:
                ast.parse(code)
                return True, None
            except SyntaxError as e:
                return False, str(e)
        
        # For other languages, assume valid (would need language-specific parsers)
        return True, None


# Global instance
_auto_fixer = None


def get_auto_fixer() -> AutoFixer:
    """Get or create AutoFixer instance"""
    global _auto_fixer
    if _auto_fixer is None:
        _auto_fixer = AutoFixer()
    return _auto_fixer

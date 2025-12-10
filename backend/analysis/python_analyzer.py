"""
Python code analyzer using Pylint.
"""
import tempfile
import os
import subprocess
import json
from typing import Dict, Any
from .language_analyzer import BaseAnalyzer, AnalysisResult, Language


class PythonAnalyzer(BaseAnalyzer):
    """Analyzer for Python code using Pylint"""
    
    def analyze(self, code_content: str) -> AnalysisResult:
        """Run Pylint analysis on Python code"""
        result = AnalysisResult()
        result.language = Language.PYTHON
        
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as temp_file:
            temp_file.write(code_content)
            temp_file_path = temp_file.name

        try:
            # Run pylint with JSON output
            process_result = subprocess.run(
                ['pylint', temp_file_path, '--output-format=json'],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            output = process_result.stdout
            if output:
                try:
                    issues = json.loads(output)
                    result.issues = self._format_issues(issues)
                except json.JSONDecodeError:
                    result.error = "Failed to parse pylint output"
            
            result.complexity_metrics = self.calculate_complexity(code_content)
            
        except subprocess.TimeoutExpired:
            result.error = "Analysis timed out"
        except FileNotFoundError:
            result.error = "Pylint not installed. Install with: pip install pylint"
        except Exception as e:
            result.error = str(e)
        finally:
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
        
        return result
    
    def calculate_complexity(self, code_content: str) -> Dict[str, Any]:
        """Calculate Python-specific complexity metrics"""
        lines = code_content.split('\n')
        
        # Count various complexity indicators
        num_functions = code_content.count('def ')
        num_classes = code_content.count('class ')
        num_imports = code_content.count('import ')
        num_conditionals = code_content.count('if ') + code_content.count('elif ')
        num_loops = code_content.count('for ') + code_content.count('while ')
        
        # Cyclomatic complexity approximation
        cyclomatic = 1 + num_conditionals + num_loops
        
        return {
            "total_lines": len(lines),
            "code_lines": len([l for l in lines if l.strip() and not l.strip().startswith('#')]),
            "num_functions": num_functions,
            "num_classes": num_classes,
            "num_imports": num_imports,
            "cyclomatic_complexity": cyclomatic,
            "num_conditionals": num_conditionals,
            "num_loops": num_loops
        }
    
    def _format_issues(self, pylint_issues: list) -> list:
        """Format Pylint issues to standardized format"""
        formatted = []
        for issue in pylint_issues:
            formatted.append({
                "type": issue.get("type", "unknown"),
                "symbol": issue.get("symbol", ""),
                "message": issue.get("message", ""),
                "line": issue.get("line", 0),
                "column": issue.get("column", 0),
                "severity": self._map_severity(issue.get("type", ""))
            })
        return formatted
    
    def _map_severity(self, issue_type: str) -> str:
        """Map Pylint issue types to severity levels"""
        severity_map = {
            "error": "error",
            "warning": "warning",
            "refactor": "info",
            "convention": "info",
            "fatal": "error"
        }
        return severity_map.get(issue_type.lower(), "info")

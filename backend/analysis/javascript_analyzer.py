"""
JavaScript/TypeScript code analyzer using ESLint.
"""
import tempfile
import os
import subprocess
import json
from typing import Dict, Any
from .language_analyzer import BaseAnalyzer, AnalysisResult, Language


class JavaScriptAnalyzer(BaseAnalyzer):
    """Analyzer for JavaScript and TypeScript code using ESLint"""
    
    def __init__(self):
        self.is_typescript = False
    
    def analyze(self, code_content: str) -> AnalysisResult:
        """Run ESLint analysis on JavaScript/TypeScript code"""
        result = AnalysisResult()
        
        # Detect if TypeScript based on syntax
        self.is_typescript = self._is_typescript(code_content)
        result.language = Language.TYPESCRIPT if self.is_typescript else Language.JAVASCRIPT
        
        # Determine file extension
        extension = '.ts' if self.is_typescript else '.js'
        
        with tempfile.NamedTemporaryFile(mode='w', suffix=extension, delete=False) as temp_file:
            temp_file.write(code_content)
            temp_file_path = temp_file.name

        try:
            # Run ESLint with JSON output
            process_result = subprocess.run(
                ['npx', 'eslint', temp_file_path, '--format=json'],
                capture_output=True,
                text=True,
                timeout=30,
                cwd=os.path.dirname(os.path.abspath(__file__))
            )
            
            output = process_result.stdout
            if output:
                try:
                    eslint_results = json.loads(output)
                    if eslint_results and len(eslint_results) > 0:
                        result.issues = self._format_issues(eslint_results[0].get('messages', []))
                except json.JSONDecodeError:
                    result.error = "Failed to parse ESLint output"
            
            result.complexity_metrics = self.calculate_complexity(code_content)
            
        except subprocess.TimeoutExpired:
            result.error = "Analysis timed out"
        except FileNotFoundError:
            result.error = "ESLint not found. Install with: npm install -g eslint"
        except Exception as e:
            result.error = str(e)
        finally:
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
        
        return result
    
    def calculate_complexity(self, code_content: str) -> Dict[str, Any]:
        """Calculate JavaScript/TypeScript complexity metrics"""
        lines = code_content.split('\n')
        
        # Count various complexity indicators
        num_functions = (
            code_content.count('function ') + 
            code_content.count('=>') +
            code_content.count('async ')
        )
        num_classes = code_content.count('class ')
        num_imports = code_content.count('import ') + code_content.count('require(')
        num_conditionals = (
            code_content.count('if ') + 
            code_content.count('else if') +
            code_content.count('switch') +
            code_content.count('case ')
        )
        num_loops = (
            code_content.count('for ') + 
            code_content.count('while ') +
            code_content.count('.map(') +
            code_content.count('.forEach(') +
            code_content.count('.filter(')
        )
        
        # Cyclomatic complexity approximation
        cyclomatic = 1 + num_conditionals + num_loops
        
        # TypeScript-specific metrics
        num_interfaces = code_content.count('interface ') if self.is_typescript else 0
        num_types = code_content.count('type ') if self.is_typescript else 0
        
        metrics = {
            "total_lines": len(lines),
            "code_lines": len([l for l in lines if l.strip() and not l.strip().startswith('//')]),
            "num_functions": num_functions,
            "num_classes": num_classes,
            "num_imports": num_imports,
            "cyclomatic_complexity": cyclomatic,
            "num_conditionals": num_conditionals,
            "num_loops": num_loops
        }
        
        if self.is_typescript:
            metrics["num_interfaces"] = num_interfaces
            metrics["num_types"] = num_types
        
        return metrics
    
    def _is_typescript(self, code_content: str) -> bool:
        """Detect if code is TypeScript based on syntax"""
        typescript_indicators = [
            'interface ',
            'type ',
            ': string',
            ': number',
            ': boolean',
            '<T>',
            'as ',
            'enum '
        ]
        return any(indicator in code_content for indicator in typescript_indicators)
    
    def _format_issues(self, eslint_messages: list) -> list:
        """Format ESLint messages to standardized format"""
        formatted = []
        for msg in eslint_messages:
            formatted.append({
                "type": msg.get("ruleId", "unknown"),
                "symbol": msg.get("ruleId", ""),
                "message": msg.get("message", ""),
                "line": msg.get("line", 0),
                "column": msg.get("column", 0),
                "severity": self._map_severity(msg.get("severity", 1))
            })
        return formatted
    
    def _map_severity(self, severity: int) -> str:
        """Map ESLint severity levels to standardized levels"""
        severity_map = {
            0: "info",
            1: "warning",
            2: "error"
        }
        return severity_map.get(severity, "info")

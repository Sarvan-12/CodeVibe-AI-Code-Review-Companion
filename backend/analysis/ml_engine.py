"""
ML Engine for CodeVibe - Lightweight Implementation
Optimized for 6GB available RAM with lazy loading and CPU-only inference
"""

import os
import gc
import time
import logging
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime, timedelta
import numpy as np

# Lazy imports to save memory at startup
_transformers = None
_torch = None
_model = None
_tokenizer = None
_last_used = None

logger = logging.getLogger(__name__)

# Configuration
MODEL_NAME = "huggingface/CodeBERTa-small-v1"  # Lightweight ~100MB
CACHE_DIR = os.getenv("ML_CACHE_DIR", ".cache/ml_models")
MAX_CODE_LENGTH = int(os.getenv("ML_MAX_CODE_LENGTH", "512"))
MODEL_TIMEOUT = 300  # Unload model after 5 minutes of inactivity
ML_ENABLED = os.getenv("ML_ENABLED", "true").lower() == "true"


@dataclass
class BugPrediction:
    """Represents a predicted bug in code"""
    line_number: int
    severity: str  # 'high', 'medium', 'low'
    bug_type: str
    description: str
    confidence: float
    suggestion: Optional[str] = None


@dataclass
class CodeSmell:
    """Represents a code smell detection"""
    line_number: int
    smell_type: str
    description: str
    severity: str
    refactoring_suggestion: Optional[str] = None


@dataclass
class SecurityIssue:
    """Represents a security vulnerability"""
    line_number: int
    vulnerability_type: str
    description: str
    severity: str  # 'critical', 'high', 'medium', 'low'
    cwe_id: Optional[str] = None
    fix_suggestion: Optional[str] = None


class MLEngine:
    """
    Lightweight ML engine using CodeBERTa-small for code analysis
    Features:
    - Lazy model loading (only loads when needed)
    - Automatic memory cleanup
    - CPU-only inference
    - Pattern-based detection with ML embeddings
    """
    
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.last_used = None
        self.is_loaded = False
        
        # Bug patterns (common bug signatures)
        self.bug_patterns = self._load_bug_patterns()
        
        # Code smell patterns
        self.smell_patterns = self._load_smell_patterns()
        
        # Security vulnerability patterns
        self.security_patterns = self._load_security_patterns()
    
    def _lazy_import(self):
        """Lazy import heavy dependencies"""
        global _transformers, _torch
        if _transformers is None:
            logger.info("Lazy loading transformers library...")
            import transformers
            _transformers = transformers
        if _torch is None:
            logger.info("Lazy loading torch library...")
            import torch
            _torch = torch
    
    def _load_model(self):
        """Load the ML model (lazy loading)"""
        if self.is_loaded:
            self.last_used = datetime.now()
            return
        
        if not ML_ENABLED:
            logger.warning("ML is disabled. Set ML_ENABLED=true to enable.")
            return
        
        try:
            logger.info(f"Loading ML model: {MODEL_NAME}")
            start_time = time.time()
            
            # Lazy import
            self._lazy_import()
            
            # Load model and tokenizer
            from transformers import AutoTokenizer, AutoModel
            
            self.tokenizer = AutoTokenizer.from_pretrained(
                MODEL_NAME,
                cache_dir=CACHE_DIR
            )
            
            self.model = AutoModel.from_pretrained(
                MODEL_NAME,
                cache_dir=CACHE_DIR
            )
            
            # Set to eval mode and CPU
            self.model.eval()
            if _torch.cuda.is_available():
                logger.info("GPU available but using CPU for memory efficiency")
            
            self.is_loaded = True
            self.last_used = datetime.now()
            
            load_time = time.time() - start_time
            logger.info(f"Model loaded successfully in {load_time:.2f}s")
            
        except Exception as e:
            logger.error(f"Failed to load ML model: {e}")
            self.is_loaded = False
            raise
    
    def _unload_model(self):
        """Unload model to free memory"""
        if self.is_loaded:
            logger.info("Unloading ML model to free memory...")
            self.model = None
            self.tokenizer = None
            self.is_loaded = False
            gc.collect()  # Force garbage collection
            logger.info("Model unloaded successfully")
    
    def _check_timeout(self):
        """Check if model should be unloaded due to inactivity"""
        if self.is_loaded and self.last_used:
            inactive_time = (datetime.now() - self.last_used).total_seconds()
            if inactive_time > MODEL_TIMEOUT:
                logger.info(f"Model inactive for {inactive_time:.0f}s, unloading...")
                self._unload_model()
    
    def get_code_embedding(self, code: str) -> Optional[np.ndarray]:
        """
        Generate semantic embedding for code
        Returns: numpy array of shape (768,) or None if ML disabled
        """
        if not ML_ENABLED:
            return None
        
        try:
            self._load_model()
            
            # Tokenize code
            inputs = self.tokenizer(
                code,
                return_tensors="pt",
                max_length=MAX_CODE_LENGTH,
                truncation=True,
                padding=True
            )
            
            # Generate embedding
            with _torch.no_grad():
                outputs = self.model(**inputs)
                # Use [CLS] token embedding
                embedding = outputs.last_hidden_state[:, 0, :].numpy()
            
            self.last_used = datetime.now()
            return embedding[0]
            
        except Exception as e:
            logger.error(f"Failed to generate embedding: {e}")
            return None
    
    def predict_bugs(self, code: str, language: str = "python") -> List[BugPrediction]:
        """
        Predict potential bugs in code using pattern matching + embeddings
        """
        bugs = []
        lines = code.split('\n')
        
        # Pattern-based detection (fast, no ML needed)
        for i, line in enumerate(lines, 1):
            for pattern in self.bug_patterns.get(language, []):
                if pattern['regex'].search(line):
                    bugs.append(BugPrediction(
                        line_number=i,
                        severity=pattern['severity'],
                        bug_type=pattern['type'],
                        description=pattern['description'],
                        confidence=0.8,  # High confidence for pattern matches
                        suggestion=pattern.get('suggestion')
                    ))
        
        # TODO: Add ML-based detection for complex bugs
        # This would use embeddings to find similar bug patterns
        
        return bugs
    
    def detect_code_smells(self, code: str, language: str = "python") -> List[CodeSmell]:
        """
        Detect code smells using heuristics and pattern matching
        """
        smells = []
        lines = code.split('\n')
        
        # Check for long functions
        if len(lines) > 50:
            smells.append(CodeSmell(
                line_number=1,
                smell_type="long_function",
                description="Function is too long (>50 lines). Consider breaking it down.",
                severity="medium",
                refactoring_suggestion="Extract smaller functions for better readability"
            ))
        
        # Check for deep nesting
        for i, line in enumerate(lines, 1):
            indent_level = len(line) - len(line.lstrip())
            if indent_level > 16:  # More than 4 levels of indentation
                smells.append(CodeSmell(
                    line_number=i,
                    smell_type="deep_nesting",
                    description="Deep nesting detected. Reduces readability.",
                    severity="medium",
                    refactoring_suggestion="Consider early returns or extracting methods"
                ))
        
        # TODO: Add more sophisticated smell detection
        
        return smells
    
    def scan_security_vulnerabilities(self, code: str, language: str = "python") -> List[SecurityIssue]:
        """
        Scan for common security vulnerabilities
        """
        vulnerabilities = []
        lines = code.split('\n')
        
        for i, line in enumerate(lines, 1):
            for pattern in self.security_patterns.get(language, []):
                if pattern['regex'].search(line):
                    vulnerabilities.append(SecurityIssue(
                        line_number=i,
                        vulnerability_type=pattern['type'],
                        description=pattern['description'],
                        severity=pattern['severity'],
                        cwe_id=pattern.get('cwe_id'),
                        fix_suggestion=pattern.get('fix')
                    ))
        
        return vulnerabilities
    
    def _load_bug_patterns(self) -> Dict:
        """Load common bug patterns for different languages"""
        import re
        
        return {
            'python': [
                {
                    'regex': re.compile(r'==\s*None'),
                    'type': 'comparison_error',
                    'severity': 'medium',
                    'description': 'Use "is None" instead of "== None"',
                    'suggestion': 'Replace "== None" with "is None"'
                },
                {
                    'regex': re.compile(r'except\s*:'),
                    'type': 'bare_except',
                    'severity': 'high',
                    'description': 'Bare except clause catches all exceptions',
                    'suggestion': 'Specify exception types to catch'
                },
            ],
            'javascript': [
                {
                    'regex': re.compile(r'==(?!=)'),
                    'type': 'loose_equality',
                    'severity': 'medium',
                    'description': 'Use strict equality (===) instead of loose equality (==)',
                    'suggestion': 'Replace "==" with "==="'
                },
            ]
        }
    
    def _load_smell_patterns(self) -> Dict:
        """Load code smell detection patterns"""
        # Will be expanded with more patterns
        return {}
    
    def _load_security_patterns(self) -> Dict:
        """Load security vulnerability patterns"""
        import re
        
        return {
            'python': [
                {
                    'regex': re.compile(r'eval\s*\('),
                    'type': 'code_injection',
                    'severity': 'critical',
                    'description': 'Use of eval() can lead to code injection',
                    'cwe_id': 'CWE-95',
                    'fix': 'Avoid eval(). Use ast.literal_eval() for safe evaluation'
                },
                {
                    'regex': re.compile(r'pickle\.loads?\s*\('),
                    'type': 'insecure_deserialization',
                    'severity': 'high',
                    'description': 'Pickle deserialization can execute arbitrary code',
                    'cwe_id': 'CWE-502',
                    'fix': 'Use JSON or other safe serialization formats'
                },
            ],
            'javascript': [
                {
                    'regex': re.compile(r'innerHTML\s*='),
                    'type': 'xss_vulnerability',
                    'severity': 'high',
                    'description': 'Direct innerHTML assignment can lead to XSS',
                    'cwe_id': 'CWE-79',
                    'fix': 'Use textContent or sanitize input before assignment'
                },
            ]
        }
    
    def cleanup(self):
        """Cleanup resources"""
        self._check_timeout()


# Global instance (lazy loaded)
_ml_engine = None


def get_ml_engine() -> MLEngine:
    """Get or create ML engine instance"""
    global _ml_engine
    if _ml_engine is None:
        _ml_engine = MLEngine()
    return _ml_engine

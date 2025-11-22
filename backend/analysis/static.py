import tempfile
import os
import subprocess
import json

def run_pylint_analysis(code_content: str) -> dict:
    """
    Runs Pylint on the provided code content and returns the results.
    """
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as temp_file:
        temp_file.write(code_content)
        temp_file_path = temp_file.name

    try:
        # Run pylint with JSON output
        # We ignore the exit code because pylint returns non-zero for issues
        result = subprocess.run(
            ['pylint', temp_file_path, '--output-format=json'],
            capture_output=True,
            text=True
        )
        
        output = result.stdout
        if not output:
            return {"issues": [], "score": 10.0} # Default if no output (or error)

        try:
            issues = json.loads(output)
            # Calculate a simple score based on number of issues (simplified)
            # Pylint usually gives a score in the text output, but JSON output is just the messages.
            # We can parse the text output separately or just calculate our own.
            # For now, let's just return the issues.
            return {"issues": issues}
        except json.JSONDecodeError:
            return {"error": "Failed to parse pylint output", "raw_output": output}

    except Exception as e:
        return {"error": str(e)}
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

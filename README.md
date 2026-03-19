# CodeVibe – AI Code Review Companion

CodeVibe is a full-stack web application that analyzes code snippets or connected
repositories to surface bugs, code smells, refactor ideas, and a quality score.
The system combines static analysis with ML-assisted insights and tracks user
history to highlight improvements over time.

## Features

- Paste code or connect repositories for analysis
- Quality score (0–100) based on linting, complexity, and ML signals
- Bug prediction and code smell detection
- Refactor suggestions and optional auto-fix support
- History, analytics, and style preference learning
- Multi-language support (Python + JavaScript to start)

## Tech Stack

**Frontend**
- Next.js (React + TypeScript)
- Tailwind CSS
- Monaco Editor
- Recharts

**Backend**
- FastAPI
- SQLAlchemy (SQLite by default, PostgreSQL supported)
- JWT authentication
- Pydantic settings
- ML tooling: transformers, scikit-learn, tree-sitter

## Repository Structure

```
backend/   # FastAPI app, analysis pipeline, database models
frontend/  # Next.js UI
.env.example
```

## Prerequisites

- Node.js (LTS recommended)
- Python 3.x
- npm

## Environment Setup

Copy the sample environment file and adjust values as needed:

```bash
cp .env.example .env
```

Key settings are listed in `.env.example`, including `DATABASE_URL`,
`SECRET_KEY`, and CORS origins.

## Run Locally

### Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Linting & Build

**Frontend**
```bash
cd frontend
npm run lint
npm run build
```

**Backend**
```bash
cd backend
pylint .
```

## Tests

No automated test suite is configured yet.

## Notes

- SQLite is the default database. Switch to PostgreSQL by updating
  `DATABASE_URL` in `.env`.
- ESLint must be installed globally if you want JS linting from the backend
  analysis pipeline (`npm install -g eslint`).

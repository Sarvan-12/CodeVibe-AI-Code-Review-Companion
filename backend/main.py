from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import users, analysis

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CodeVibe API", description="AI Code Review Companion API", version="0.1.0")

# CORS Configuration
origins = [
    "http://localhost:3000", # Frontend
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(analysis.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to CodeVibe API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

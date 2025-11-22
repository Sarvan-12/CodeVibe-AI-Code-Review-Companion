from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Default to SQLite for local development to avoid auth issues
# SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost/codevibe")
SQLALCHEMY_DATABASE_URL = "sqlite:///./codevibe.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

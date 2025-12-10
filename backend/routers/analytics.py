from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import List, Dict, Any
import models, database, auth

router = APIRouter(
    prefix="/analytics",
    tags=["analytics"],
    responses={404: {"description": "Not found"}},
)

@router.get("/trends")
def get_trends(
    days: int = 30,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """
    Get code quality trends over time.
    Returns daily average scores for the specified period.
    """
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Query results grouped by date
    results = (
        db.query(
            func.date(models.AnalysisResult.created_at).label('date'),
            func.avg(models.AnalysisResult.score).label('avg_score'),
            func.count(models.AnalysisResult.id).label('count')
        )
        .join(models.Snippet)
        .filter(
            models.Snippet.user_id == current_user.id,
            models.AnalysisResult.created_at >= start_date
        )
        .group_by(func.date(models.AnalysisResult.created_at))
        .order_by(func.date(models.AnalysisResult.created_at))
        .all()
    )
    
    return [
        {
            "date": str(r.date),
            "average_score": round(float(r.avg_score), 2),
            "analysis_count": r.count
        }
        for r in results
    ]

@router.get("/summary")
def get_summary(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """
    Get overall statistics summary for the user.
    """
    # Total analyses
    total_analyses = (
        db.query(func.count(models.AnalysisResult.id))
        .join(models.Snippet)
        .filter(models.Snippet.user_id == current_user.id)
        .scalar()
    )
    
    # Average score
    avg_score = (
        db.query(func.avg(models.AnalysisResult.score))
        .join(models.Snippet)
        .filter(models.Snippet.user_id == current_user.id)
        .scalar()
    ) or 0
    
    # Best score
    best_score = (
        db.query(func.max(models.AnalysisResult.score))
        .join(models.Snippet)
        .filter(models.Snippet.user_id == current_user.id)
        .scalar()
    ) or 0
    
    # Total issues found
    all_results = (
        db.query(models.AnalysisResult)
        .join(models.Snippet)
        .filter(models.Snippet.user_id == current_user.id)
        .all()
    )
    
    total_issues = sum(
        len(r.refactor_suggestions) + len(r.bugs_detected) 
        for r in all_results
    )
    
    return {
        "total_analyses": total_analyses or 0,
        "average_score": round(float(avg_score), 2),
        "best_score": round(float(best_score), 2),
        "total_issues_found": total_issues,
        "improvement": round(float(avg_score) - 50, 2) if avg_score else 0  # Baseline of 50
    }

@router.get("/languages")
def get_language_breakdown(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """
    Get breakdown of analyses by programming language.
    """
    results = (
        db.query(
            models.Snippet.language,
            func.count(models.Snippet.id).label('count'),
            func.avg(models.AnalysisResult.score).label('avg_score')
        )
        .join(models.AnalysisResult)
        .filter(models.Snippet.user_id == current_user.id)
        .group_by(models.Snippet.language)
        .all()
    )
    
    return [
        {
            "language": r.language,
            "count": r.count,
            "average_score": round(float(r.avg_score), 2) if r.avg_score else 0
        }
        for r in results
    ]

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import joblib
import os

from database import SessionLocal, Message

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
model_path = "model.joblib"
if os.path.exists(model_path):
    model = joblib.load(model_path)
else:
    model = None

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class AnalyzeRequest(BaseModel):
    text: str

class AnalyzeResponse(BaseModel):
    category: str
    confidence: float
    severity: float


def calculate_severity(category: str, confidence: float) -> float:
    category_multiplier = {
        "Safe": 0.10,
        "Spam": 0.55,
        "Toxic": 0.85,
        "Profanity": 1.00,
        "Error": 0.0,
    }.get(category, 0.5)
    return round(min(100.0, confidence * category_multiplier), 2)


@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze_message(req: AnalyzeRequest, db: Session = Depends(get_db)):
    if model is None:
        return {"category": "Error", "confidence": 0.0, "severity": 0.0}
    
    # Prediction
    prediction = model.predict([req.text])[0]
    probabilities = model.predict_proba([req.text])[0]
    confidence = float(max(probabilities) * 100)
    severity = calculate_severity(prediction, confidence)
    
    # Save to db
    msg = Message(text=req.text, category=prediction, confidence=confidence)
    db.add(msg)
    db.commit()
    db.refresh(msg)
    
    return AnalyzeResponse(category=prediction, confidence=confidence, severity=severity)

@app.get("/api/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total = db.query(Message).count()
    toxic = db.query(Message).filter(Message.category == "Toxic").count()
    safe = db.query(Message).filter(Message.category == "Safe").count()
    spam = db.query(Message).filter(Message.category == "Spam").count()
    profanity = db.query(Message).filter(Message.category == "Profanity").count()
    
    return {
        "total": total,
        "toxic": toxic,
        "safe": safe,
        "spam": spam,
        "profanity": profanity
    }

@app.get("/api/history")
def get_history(db: Session = Depends(get_db), limit: int = 20):
    msgs = db.query(Message).order_by(Message.timestamp.desc()).limit(limit).all()
    return msgs

@app.delete("/api/history/{message_id}")
def delete_history_item(message_id: int, db: Session = Depends(get_db)):
    msg = db.query(Message).filter(Message.id == message_id).first()
    if msg is None:
        raise HTTPException(status_code=404, detail="Message not found")

    db.delete(msg)
    db.commit()
    return {"ok": True}


@app.delete("/api/history")
def delete_all_history(db: Session = Depends(get_db)):
    deleted_rows = db.query(Message).delete()
    db.commit()
    return {"ok": True, "deleted": deleted_rows}

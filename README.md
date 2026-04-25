# Real-Time Content Moderation System

A full-stack machine learning based web application that analyzes user-generated text and classifies it into harmful or safe categories in real time.

## 🚀 Features

* Classifies text into:

  * ✅ Safe
  * ⚠️ Toxic
  * 🚫 Profanity
  * 📩 Spam
* Confidence score for predictions
* Severity level detection
* Moderation history tracking
* Dashboard analytics
* Bulk history delete option
* Dockerized multi-service deployment

## 🛠 Tech Stack

### Frontend

* React.js
* Vite
* CSS

### Backend

* FastAPI
* Python
* SQLite

### Machine Learning

* Scikit-learn
* TF-IDF Vectorizer
* Logistic Regression

### DevOps

* Docker
* Docker Compose
* Git & GitHub

## 📂 Project Structure

```text
content-moderation/
│── backend/
│── frontend/
│── Dockerfile
│── docker-compose.yml
│── train_model.py
│── .gitignore
│── .dockerignore
```

## ⚙️ How It Works

1. User enters text in frontend UI.
2. Frontend sends request to FastAPI backend.
3. Backend loads trained ML model (`model.joblib`).
4. Model predicts category with confidence score.
5. Result stored in SQLite database.
6. Dashboard displays moderation history and analytics.

## 🧠 Model Details

Used **TF-IDF + Logistic Regression** for fast and efficient text classification.

### Why this model?

* Lightweight and fast
* Good baseline accuracy
* Easy to deploy
* CPU friendly
* Suitable for real-time APIs

## 📊 Dataset

* Jigsaw Toxic Comment Dataset
* Synthetic spam samples added for spam class
* Balanced safe/unsafe samples for better learning

## 🐳 Run with Docker

```bash
docker compose up --build
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:8000
```

## 💻 Run Locally

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📌 Future Improvements

* Improve toxic class accuracy
* Add transformer models (BERT)
* Real spam dataset integration
* User authentication
* Admin moderation panel
* Cloud deployment

## 🎯 Learning Outcomes

* End-to-end ML deployment
* REST API development
* React + FastAPI integration
* Docker containerization
* Real-world moderation workflow design

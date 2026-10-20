---
title: "MLOps & Model Deployment: FastAPI, Docker & CI/CD Pipelines"
subject: "17-MLOps-and-Deployment"
difficulty: "Advanced"
tags: ["mlops", "fastapi", "docker", "deployment", "model-serving", "monitoring", "cicd"]
prerequisites: ["06-Supervised-Learning"]
description: "Bridge the gap between model prototyping and production engineering: serialization (joblib, ONNX), high-performance REST APIs with FastAPI, Docker containerization, and data drift monitoring."
---

# MLOps & Production Model Deployment

A model running only in a Jupyter notebook provides zero business value. Production Machine Learning (MLOps) requires reliable inference latency, input schema validation, automated integration tests, containerization, and drift detection.

---

## 1. Model Serialization: Joblib & ONNX

```python
import joblib

# Saving trained scikit-learn pipeline
joblib.dump(pipeline, "model_artifacts/churn_model_v1.pkl", compress=3)

# Loading model into inference service
loaded_model = joblib.load("model_artifacts/churn_model_v1.pkl")
```

### ONNX (Open Neural Network Exchange)
For high-throughput, cross-language inference, export models to ONNX to run using hardware-accelerated runtimes (DirectML, TensorRT, ONNX Runtime).

---

## 2. Serving Models with FastAPI & Pydantic

FastAPI provides asynchronous request handling, OpenAPI documentation out-of-the-box, and strict type validation via Pydantic.

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import joblib
import numpy as np

app = FastAPI(title="ML Prediction Service", version="1.0.0")
model = joblib.load("model_artifacts/churn_model_v1.pkl")

class CustomerFeatures(BaseModel):
    age: int = Field(..., ge=18, le=100, description="Customer age in years")
    tenure: int = Field(..., ge=0, description="Months subscribed")
    monthly_charges: float = Field(..., ge=0.0, description="Monthly invoice")

class PredictionResponse(BaseModel):
    churn_probability: float
    prediction: int

@app.post("/predict", response_model=PredictionResponse)
def predict_churn(customer: CustomerFeatures):
    try:
        features = np.array([[customer.age, customer.tenure, customer.monthly_charges]])
        prob = float(model.predict_proba(features)[0][1])
        pred = int(prob >= 0.5)
        return PredictionResponse(churn_probability=round(prob, 4), prediction=pred)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "healthy"}
```

---

## 3. Production Dockerfile

```dockerfile
# Multi-stage lightweight Python runtime
FROM python:3.11-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

---

## 4. Production Drift Monitoring

- **Data Drift (Covariate Shift)**: $P(\mathbf{X})$ changes over time while $P(y \mid \mathbf{x})$ remains constant (e.g. population demographics shift).
  - Detected using Kolmogorov-Smirnov (KS) test for numerical features or Population Stability Index (PSI).
- **Concept Drift**: $P(y \mid \mathbf{x})$ changes while $P(\mathbf{X})$ remains unchanged (e.g. consumer purchasing patterns mutate following an economic shock).

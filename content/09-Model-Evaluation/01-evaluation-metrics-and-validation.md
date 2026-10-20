---
title: "Model Evaluation, Validation & The Bias-Variance Tradeoff"
subject: "09-Model-Evaluation"
difficulty: "Intermediate"
tags: ["model-evaluation", "confusion-matrix", "roc-auc", "f1-score", "cross-validation", "bias-variance"]
prerequisites: ["06-Supervised-Learning"]
description: "Rigorous performance evaluation: Confusion Matrix derivations, Precision, Recall, F1 and F-beta scores, ROC-AUC curves, K-Fold Cross-Validation, and Bias-Variance decomposition."
---

# Model Evaluation, Validation & Metrics

Never evaluate machine learning models with bare accuracy on imbalanced datasets! If 99% of transactions are legitimate and 1% are fraudulent, a trivial model predicting "Legitimate" achieves 99% accuracy while catching zero fraud.

---

## 1. The Confusion Matrix

For a binary classification task with Positive ($P$) and Negative ($N$) ground truth:

| | Predicted Negative ($\hat{y}=0$) | Predicted Positive ($\hat{y}=1$) |
| :--- | :--- | :--- |
| **Actual Negative ($y=0$)** | **True Negative (TN)** | **False Positive (FP)** *(Type I Error)* |
| **Actual Positive ($y=1$)** | **False Negative (FN)** *(Type II Error)* | **True Positive (TP)** |

---

## 2. Classification Metrics

### Accuracy
$$\text{Accuracy} = \frac{\text{TP} + \text{TN}}{\text{TP} + \text{TN} + \text{FP} + \text{FN}}$$

### Precision (Positive Predictive Value)
Out of all instances predicted positive, how many were actually positive?
$$\text{Precision} = \frac{\text{TP}}{\text{TP} + \text{FP}}$$
*Crucial when False Positives are expensive (e.g. Spam filters, Youtube copyright strikes).*

### Recall (Sensitivity / True Positive Rate - TPR)
Out of all actual positive instances, how many did the model catch?
$$\text{Recall} = \frac{\text{TP}}{\text{TP} + \text{FN}}$$
*Crucial when False Negatives are dangerous (e.g. Cancer detection, Fraud detection).*

### $F_1$ Score (Harmonic Mean)
$$F_1 = 2 \cdot \frac{\text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}} = \frac{2\text{TP}}{2\text{TP} + \text{FP} + \text{FN}}$$
The harmonic mean punishes extreme imbalances between Precision and Recall.

### $F_\beta$ Score
$$F_\beta = (1 + \beta^2) \frac{\text{Precision} \cdot \text{Recall}}{\beta^2 \cdot \text{Precision} + \text{Recall}}$$
- $\beta = 2$ ($F_2$ score): Weights Recall twice as heavily as Precision (medical diagnosis).
- $\beta = 0.5$ ($F_{0.5}$ score): Weights Precision twice as heavily as Recall (marketing outreach).

---

## 3. ROC Curve and AUC Score

- **True Positive Rate (TPR / Recall)**: $\frac{\text{TP}}{\text{TP} + \text{FN}}$
- **False Positive Rate (FPR)**: $\frac{\text{FP}}{\text{FP} + \text{TN}} = 1 - \text{Specificity}$

The **Receiver Operating Characteristic (ROC)** curve plots TPR vs FPR across all possible decision thresholds $\tau \in [0, 1]$.
- **AUC (Area Under ROC Curve)**: Probability that the classifier ranks a randomly chosen positive sample higher than a randomly chosen negative sample.
  - $\text{AUC} = 0.5$: Random guessing.
  - $\text{AUC} = 1.0$: Perfect classification.

---

## 4. The Bias-Variance Decomposition

The expected generalization error of a model on unseen data decomposes into three components:

$$\mathbb{E}[(y - \hat{f}(\mathbf{x}))^2] = \text{Bias}^2[\hat{f}(\mathbf{x})] + \text{Var}[\hat{f}(\mathbf{x})] + \sigma^2$$

Where $\sigma^2$ is the **irreducible error** (noise in the data).

```text
High Bias (Underfitting):
- Model is too simple to capture patterns.
- High training error, high validation error.
- Remedy: Add features, increase model complexity, reduce regularization.

High Variance (Overfitting):
- Model memorizes training noise.
- Low training error, high validation error.
- Remedy: Add training data, prune/regularize, use ensemble methods (Random Forest).
```

---

## 5. Stratified K-Fold Cross Validation

```python
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.ensemble import RandomForestClassifier

X = ... # features
y = ... # imbalanced labels

# StratifiedKFold maintains the same percentage of samples of each class in each fold
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
model = RandomForestClassifier(random_state=42)

f1_scores = cross_val_score(model, X, y, cv=skf, scoring='f1_macro')
print(f"5-Fold Macro F1: {f1_scores.mean():.3f} +/- {f1_scores.std():.3f}")
```

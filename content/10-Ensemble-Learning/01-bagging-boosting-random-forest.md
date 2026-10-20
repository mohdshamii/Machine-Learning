---
title: "Ensemble Learning: Bagging, Boosting, Random Forest & XGBoost"
subject: "10-Ensemble-Learning"
difficulty: "Advanced"
tags: ["ensemble", "bagging", "boosting", "random-forest", "xgboost", "gradient-boosting"]
prerequisites: ["06-Supervised-Learning", "09-Model-Evaluation"]
description: "Combine weak learners into state-of-the-art predictive ensembles: Bootstrap Aggregation, Random Forests, AdaBoost, Gradient Boosting, and XGBoost tree optimization."
---

# Ensemble Learning: Bagging, Boosting & Gradient Boosted Trees

Ensemble learning combines predictions from multiple individual models (base learners) to produce a single aggregated prediction that generalizes significantly better than any single constituent model.

---

## 1. Bagging (Bootstrap Aggregating)

Bagging reduces **variance** of high-variance, low-bias estimators (such as deep, unpruned Decision Trees).

### The Mechanism
1. Given dataset $\mathcal{D}$ of size $m$, draw $B$ bootstrap samples $\mathcal{D}_1, \dots, \mathcal{D}_B$ of size $m$ **with replacement**.
   *(Note: roughly $1 - \frac{1}{e} \approx 63.2\%$ of samples appear in each bootstrap sample; the remaining $36.8\%$ form the **Out-Of-Bag (OOB)** evaluation set).*
2. Train a separate base learner $f_b(\mathbf{x})$ on each bootstrap sample $\mathcal{D}_b$.
3. Aggregate predictions:
   - Regression: $\hat{f}_{\text{bag}}(\mathbf{x}) = \frac{1}{B} \sum_{b=1}^B f_b(\mathbf{x})$
   - Classification: Majority voting (mode).

### Random Forest: De-correlating Trees
Standard bagging on trees still produces correlated trees if a few strong predictors dominate splits. **Random Forests** introduce **feature subsampling**:
At every split, consider only a random subset of $k = \sqrt{d}$ (for classification) or $k = d/3$ (for regression) candidate features. This de-correlates individual trees, dramatically lowering ensemble variance.

---

## 2. Boosting: Sequential Error Correction

Boosting reduces **bias** by training base learners sequentially, where each learner attempts to correct the errors made by its predecessors.

```text
[Data] -> [Model 1] -> [Calculate Residuals/Reweight] -> [Model 2] -> ... -> [Final Weighted Sum]
```

### 1. AdaBoost (Adaptive Boosting)
- Base learner: Decision Stumps (1-split trees).
- Re-weights misclassified samples with higher weights before training the next stump.
- Model weight: $\alpha_t = \frac{1}{2} \ln\left(\frac{1 - \epsilon_t}{\epsilon_t}\right)$.

### 2. Gradient Boosting (GBM)
Instead of re-weighting data points, Gradient Boosting fits subsequent trees directly to the **pseudo-residuals** (negative gradient of the loss function):

$$r_{im} = -\left[ \frac{\partial L(y_i, f(\mathbf{x}_i))}{\partial f(\mathbf{x}_i)} \right]_{f = f_{m-1}}$$

For Mean Squared Error loss $L(y, f) = \frac{1}{2}(y - f)^2$, the negative gradient is simply the residual:
$$-\frac{\partial L}{\partial f} = y - f(\mathbf{x})$$

### 3. XGBoost (Extreme Gradient Boosting)
XGBoost optimizes an objective with second-order Taylor expansion:

$$\mathcal{L}^{(t)} \approx \sum_{i=1}^m \left[ g_i f_t(\mathbf{x}_i) + \frac{1}{2} h_i f_t^2(\mathbf{x}_i) \right] + \Omega(f_t)$$

Where:
- $g_i = \partial_{\hat{y}^{(t-1)}} L(y_i, \hat{y}^{(t-1)})$ (first-order gradient)
- $h_i = \partial^2_{\hat{y}^{(t-1)}} L(y_i, \hat{y}^{(t-1)})$ (second-order Hessian)
- $\Omega(f) = \gamma T + \frac{1}{2} \lambda \sum_{j=1}^T w_j^2$ (complexity penalty on leaves $T$ and leaf weights $w$).

---

## 3. Python Implementation Example

```python
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
import xgboost as xgb

# Random Forest
rf = RandomForestClassifier(n_estimators=100, max_depth=10, oob_score=True, random_state=42)
rf.fit(X_train, y_train)
print(f"OOB Accuracy: {rf.oob_score_:.3f}")

# XGBoost
xgb_model = xgb.XGBClassifier(
    n_estimators=200,
    learning_rate=0.05,
    max_depth=6,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42
)
xgb_model.fit(X_train, y_train)
```

---

## 4. Bagging vs. Boosting Summary

| Feature | Bagging (e.g. Random Forest) | Boosting (e.g. XGBoost, LightGBM) |
| :--- | :--- | :--- |
| **Goal** | Reduce Variance (Prevent Overfitting) | Reduce Bias (Prevent Underfitting) |
| **Base Learners** | Deep, unpruned trees (low bias, high variance) | Shallow trees / stumps (high bias, low variance) |
| **Training** | Parallel / Independent | Sequential / Dependent |
| **Overfitting Risk** | Extremely low with more trees | High if trained for too many rounds without shrinkage |
| **Tuning Sensitivity**| Low (works well with default parameters) | High (requires tuning learning rate, depth, subsample) |

---
title: "Feature Engineering & Scaling: Normalization, Standardization & Selection"
subject: "08-Feature-Engineering"
difficulty: "Beginner"
tags: ["feature-engineering", "scaling", "standardization", "normalization", "robust-scaler"]
prerequisites: ["04-Data-Preprocessing"]
description: "Master feature transformation and scaling techniques: StandardScaler, MinMaxScaler, RobustScaler, power transforms, and mutual information feature selection."
---

# Feature Engineering & Scaling

Algorithms that rely on distance metrics (KNN, K-Means, SVM) or gradient descent optimization (Linear/Logistic Regression, Neural Networks) are severely affected by feature magnitudes. A feature ranging from $10,000$ to $100,000$ will dominate a feature ranging from $0$ to $1$, warping Euclidean distances and creating elongated error surfaces.

---

## 1. Feature Scaling Comparison

### 1. Standardization (Z-Score Scaling)
Centers the distribution at mean $0$ with standard deviation $1$:

$$z = \frac{x - \mu}{\sigma}$$

- **When to use**: Optimal for algorithms assuming Gaussian distributions, gradient descent, SVMs, and PCA.
- **Drawback**: Preserves outlier leverage since outliers still have high Z-scores ($|z| > 3$).

### 2. Min-Max Normalization
Bonds features into a fixed bounded interval $[0, 1]$ (or $[a, b]$):

$$x' = \frac{x - x_{\min}}{x_{\max} - x_{\min}}$$

- **When to use**: Neural networks (image pixel intensities $[0, 255] \to [0, 1]$), algorithms requiring non-negative inputs (e.g. Multinomial Naive Bayes).
- **Drawback**: Extremely sensitive to extreme outliers; if an outlier is present, the remaining $99\%$ of values are compressed into a narrow fraction $[0, 0.05]$.

### 3. Robust Scaling
Uses median and Interquartile Range (IQR) to scale data:

$$x' = \frac{x - Q_2}{Q_3 - Q_1}$$

- **When to use**: High-outlier datasets where outliers represent genuine signals rather than measurement errors.

---

## 2. Python Code Demonstration

```python
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler

# Sample dataset
data = np.array([
    [10.0, 150000.0],
    [12.0, 180000.0],
    [9.0,  120000.0],
    [11.0, 160000.0],
    [50.0, 5000000.0] # Extreme outlier
])

std_scaler = StandardScaler()
minmax_scaler = MinMaxScaler()
robust_scaler = RobustScaler()

print("Original Data:\n", data)
print("\nStandardized (Z-Score):\n", std_scaler.fit_transform(data).round(2))
print("\nMin-Max Scaled [0, 1]:\n", minmax_scaler.fit_transform(data).round(2))
print("\nRobust Scaled (Median & IQR):\n", robust_scaler.fit_transform(data).round(2))
```

---

## 3. Mathematical Comparison Table

| Scaling Method | Formula | Center | Scale | Robust to Outliers? |
| :--- | :--- | :--- | :--- | :--- |
| **StandardScaler** | $\frac{x - \mu}{\sigma}$ | $\mu$ (Mean) | $\sigma$ (Std Dev) | ❌ No |
| **MinMaxScaler** | $\frac{x - x_{\min}}{x_{\max} - x_{\min}}$ | $x_{\min}$ | Range $(x_{\max} - x_{\min})$ | ❌ No |
| **RobustScaler** | $\frac{x - \text{Median}}{\text{IQR}}$ | Median ($Q_2$) | IQR ($Q_3 - Q_1$) | ✅ Yes |
| **MaxAbsScaler** | $\frac{x}{\max(|x|)}$ | $0$ | Max Absolute | ❌ No |

---

## 4. Tree-Based Models Exception
> [!NOTE]
> **Decision Trees, Random Forests, and Gradient Boosted Trees (XGBoost, LightGBM) are scale-invariant!**
> They split nodes based on ordering (rank) rather than numerical distance. Scaling features neither helps nor hurts tree-based algorithms.

---

## 5. Original Repository Lab Reference
Examine our original hands-on scaling notebook and dataset:
- **Notebook**: `feature scaling/feature scaling.ipynb`
- **Dataset**: `feature scaling/SampleFile.csv`

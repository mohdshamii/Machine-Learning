---
title: "Data Preprocessing: Cleaning, Imputation & Encoding Pipeline"
subject: "04-Data-Preprocessing"
difficulty: "Beginner"
tags: ["data-cleaning", "imputation", "categorical-encoding", "outliers", "pipelines"]
prerequisites: ["03-Data-Analysis"]
description: "A comprehensive production-grade data preprocessing pipeline: strategies for handling missing values, encoding categorical variables, detecting outliers, and building scikit-learn ColumnTransformers."
---

# Data Preprocessing: Cleaning, Imputation & Encoding

Real-world datasets are messy, incomplete, and noisy. Model performance is capped by data quality: *"Garbage In, Garbage Out"*. This guide establishes a systematic, reproducible workflow for preprocessing raw tabular features before machine learning.

---

## 1. Handling Missing Data (Imputation Strategies)

Missing data mechanisms fall into three categories:
1. **MCAR (Missing Completely at Random)**: Missingness is unrelated to any observed or unobserved data. Simple deletion or mean/median imputation produces unbiased estimates.
2. **MAR (Missing at Random)**: Missingness is systematic with respect to observed data (e.g., younger individuals less likely to report income).
3. **MNAR (Missing Not at Random)**: Missingness depends on the unobserved value itself (e.g., high earners withholding income).

```python
import pandas as pd
import numpy as np
from sklearn.impute import SimpleImputer, KNNImputer

# Numerical Imputation: Median is robust to outliers
num_imputer = SimpleImputer(strategy='median')

# Categorical Imputation: Most frequent or explicit 'Unknown' token
cat_imputer = SimpleImputer(strategy='constant', fill_value='Missing')

# Advanced Multi-Variate Imputation using K-Nearest Neighbors
knn_imputer = KNNImputer(n_neighbors=5, weights='distance')
```

---

## 2. Categorical Variable Encoding

| Technique | Description | Ideal Use Case | Pitfalls |
| :--- | :--- | :--- | :--- |
| **One-Hot Encoding** | Creates a binary column for each unique category | Nominal features with low cardinality ($< 15$ categories) | High cardinality creates massive sparse matrices (curse of dimensionality) |
| **Ordinal Encoding** | Maps ordered categories to integer ranks ($0, 1, 2, \dots$) | Natural hierarchy (e.g. Low, Medium, High; Junior, Mid, Senior) | Imposes artificial mathematical distances |
| **Target Encoding** | Replaces category with mean of target variable | High cardinality nominal features (e.g. ZIP code, city) | Severe risk of **data leakage**; requires out-of-fold smoothing |
| **Frequency Encoding** | Replaces category with frequency count | Captures category popularity without high dimensionality | Different categories with equal frequency collide |

```python
from sklearn.preprocessing import OneHotEncoder

# Avoid multicollinearity (Dummy Variable Trap) by dropping first column
ohe = OneHotEncoder(drop='first', sparse_output=False, handle_unknown='ignore')
```

---

## 3. Outlier Detection & Treatment

An outlier is an observation that lies an abnormal distance from other values.

### Interquartile Range (IQR) Method
$$Q_1 = \text{25th percentile}, \quad Q_3 = \text{75th percentile}$$
$$\text{IQR} = Q_3 - Q_1$$
$$\text{Lower Bound} = Q_1 - 1.5 \times \text{IQR}$$
$$\text{Upper Bound} = Q_3 + 1.5 \times \text{IQR}$$

```python
def remove_outliers_iqr(df, column):
    q1 = df[column].quantile(0.25)
    q3 = df[column].quantile(0.75)
    iqr = q3 - q1
    lower = q1 - 1.5 * iqr
    upper = q3 + 1.5 * iqr
    return df[(df[column] >= lower) & (df[column] <= upper)]
```

### Winsorization (Capping)
Instead of discarding rows, cap values at the 1st and 99th percentiles to preserve sample size while muting extreme leverage.

---

## 4. End-to-End Scikit-Learn `ColumnTransformer`

Never apply transformations across the entire dataset before train/test splitting! Doing so causes **Data Leakage**. Always fit transformers **only on the training split**.

```python
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer

numeric_features = ['Age', 'Fare', 'SibSp']
categorical_features = ['Sex', 'Embarked', 'Pclass']

# Numeric sub-pipeline
numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

# Categorical sub-pipeline
categorical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='constant', fill_value='Missing')),
    ('encoder', OneHotEncoder(handle_unknown='ignore', drop='first'))
])

# Combine into master preprocessor
preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', categorical_transformer, categorical_features)
    ]
)
```

---

## 5. Lab Reference
Explore the hands-on Titanic data cleaning lab implemented in our original notebook:
- **Notebook**: `data cleaning/data_clean.ipynb`
- **Dataset**: `Titanic-Dataset.csv`

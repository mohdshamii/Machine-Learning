---
title: "Pandas Data Wrangling & Manipulation for ML"
subject: "03-Data-Analysis"
difficulty: "Beginner"
tags: ["pandas", "data-wrangling", "group-by", "aggregation", "memory-optimization"]
prerequisites: ["00-Python-for-ML"]
description: "High-performance data manipulation with Pandas: vectorized operations, split-apply-combine GroupBy patterns, indexing techniques, and memory profiling."
---

# Pandas Data Wrangling & Manipulation for ML

Pandas is the primary tool for structured tabular data analysis. Real-world machine learning workflows spend over 70% of engineering time preparing, reshaping, filtering, and joining data in Pandas.

---

## 1. Vectorized Filtering & Indexing

Never iterate over DataFrame rows using `for i in range(len(df))` or `df.iterrows()`; use vectorized conditions and `.loc[]`.

```python
import pandas as pd
import numpy as np

# Load dataset
df = pd.read_csv("data cleaning/Titanic-Dataset.csv")

# Fast boolean indexing
filtered_df = df.loc[(df["Age"] > 30) & (df["Pclass"] == 1), ["Name", "Age", "Fare", "Survived"]]

# Query syntax for clean readable code
high_fare = df.query("Fare > 100 and Sex == 'female'")
```

---

## 2. Split-Apply-Combine with `.groupby()`

The `groupby` operation splits data into subsets, applies an aggregation function, and combines results.

```python
# Grouping multiple aggregations
agg_summary = df.groupby(["Pclass", "Sex"]).agg(
    mean_age=("Age", "mean"),
    median_fare=("Fare", "median"),
    survival_rate=("Survived", "mean"),
    passenger_count=("PassengerId", "count")
).reset_index()

print(agg_summary)
```

---

## 3. Reshaping: Pivoting & Melting

- **`pivot_table()`**: Summarizes and flattens cross-tabulated data.
- **`melt()`**: Unpivots DataFrame from wide format to long format (tidy data).

---

## 4. Memory Optimization Strategies
When handling datasets that approach RAM limits:
1. Downcast integer columns (`int64` $\to$ `int32` or `int8`).
2. Downcast float columns (`float64` $\to$ `float32`).
3. Convert low-cardinality text/object columns to `category` dtype.

```python
def optimize_dtypes(df):
    for col in df.columns:
        if df[col].dtype == 'object' and df[col].nunique() / len(df) < 0.2:
            df[col] = df[col].astype('category')
        elif df[col].dtype == 'float64':
            df[col] = pd.to_numeric(df[col], downcast='float')
        elif df[col].dtype == 'int64':
            df[col] = pd.to_numeric(df[col], downcast='integer')
    return df
```

---
title: "Exploratory Data Analysis (EDA): The Complete Framework"
subject: "05-Exploratory-Data-Analysis"
difficulty: "Beginner"
tags: ["eda", "data-visualization", "correlation", "distribution", "pairplot", "heatmaps"]
prerequisites: ["03-Data-Analysis"]
description: "A battle-tested 5-step framework for Exploratory Data Analysis: shape checks, univariate distribution profiling, bivariate relationships, correlation heatmaps, and target leakage detection."
---

# Exploratory Data Analysis (EDA) Framework

Exploratory Data Analysis (EDA) is the detective work of machine learning. It reveals anomalies, informs feature engineering, and prevents catastrophic data leaks before any model is trained.

---

## The 5-Step EDA Blueprint

### Step 1: Structural Assessment
- Dimensions, feature data types, memory consumption.
- Missing value counts and percentages.
- Cardinality of categorical variables.

### Step 2: Univariate Analysis
- **Numerical Features**: Histograms, KDE plots, Boxplots. Check for skewness, kurtosis, and zero-inflation.
  - If skewness $> 1.0$, consider $\log(1 + x)$ or Box-Cox transformation.
- **Categorical Features**: Frequency bar plots. Check for heavy class imbalances or rare categories ($< 1\%$ frequency).

### Step 3: Bivariate & Multivariate Analysis
- **Feature vs. Target**:
  - Continuous feature vs Continuous target: Scatter plots, Spearman rank correlation.
  - Continuous feature vs Binary target: Overlaid KDE curves, violin plots.
  - Categorical feature vs Target: Cross-tabulations, normalized stacked bar charts.
- **Feature vs. Feature Interaction**: Pairplots and scatter matrices to detect multi-collinearity.

### Step 4: Correlation & Collinearity Analysis
Pearson correlation matrix:
$$r = \frac{\sum (x - \bar{x})(y - \bar{y})}{\sqrt{\sum(x - \bar{x})^2 \sum(y - \bar{y})^2}}$$
- Check Variance Inflation Factor (VIF): Features with $\text{VIF} > 5$ or $10$ indicate severe multicollinearity that destabilizes linear model coefficients.

### Step 5: Data Leakage & Sanity Audits
- Check if any feature correlates almost perfectly ($r > 0.98$) with the target due to downstream operational logging.
- Verify that timestamp fields occur strictly prior to the target outcome event.

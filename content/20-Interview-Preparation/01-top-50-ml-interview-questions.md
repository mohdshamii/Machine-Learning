---
title: "Top Machine Learning Interview Questions & Flashcards"
subject: "20-Interview-Preparation"
difficulty: "Advanced"
tags: ["interview", "questions", "flashcards", "faang", "cheat-sheet", "system-design"]
prerequisites: ["06-Supervised-Learning", "09-Model-Evaluation", "11-Deep-Learning"]
description: "High-frequency machine learning interview questions asked at top tech companies, covering algorithmic trade-offs, mathematical derivations, and practical debugging scenarios."
---

# Top Machine Learning Interview Questions

A curated master checklist of high-probability technical interview questions with mathematical derivations, code snippets, and counter-intuitive edge cases.

---

## 1. Core Algorithms & Mathematics

### Q1: Why does Lasso ($L_1$) create sparse weights, while Ridge ($L_2$) does not?
<details>
<summary>Click to reveal answer</summary>

**Mathematical & Geometric Explanation:**
The constrained optimization formulations are:
- Lasso: $\min J(\theta) \quad \text{s.t.} \quad \sum |\theta_i| \le C$ (Diamond-shaped constraint region in 2D with sharp corners on the coordinate axes).
- Ridge: $\min J(\theta) \quad \text{s.t.} \quad \sum \theta_i^2 \le C$ (Circular/spherical constraint region).

Elliptical contours of the unconstrained MSE loss expand outward from the OLS solution. For Lasso, the expanding loss contours are statistically far more likely to intersect the constraint boundary at one of the sharp diamond vertices (where $\theta_j = 0$). For Ridge, intersections occur anywhere along the smooth spherical surface, shrinking coefficients toward zero without making them exactly zero.
</details>

---

### Q2: What is the Vanishing Gradient problem, and what are 4 distinct ways to solve it?
<details>
<summary>Click to reveal answer</summary>

**Problem:** By the chain rule, gradients backpropagating through $L$ layers multiply partial derivatives $\prod_{l=1}^L \frac{\partial \mathbf{a}^{(l)}}{\partial \mathbf{z}^{(l)}}$. If activations are Sigmoid (max derivative 0.25) or Tanh, gradients diminish exponentially toward early layers, freezing weight updates.

**4 Solutions:**
1. **Non-saturating activation functions**: Use ReLU, LeakyReLU, or GELU whose derivative is 1 for positive activations.
2. **Residual Skip Connections (ResNets)**: Allows gradient flow to bypass layers via identity connections $\frac{\partial \mathcal{L}}{\partial \mathbf{x}} = \frac{\partial \mathcal{L}}{\partial \mathbf{y}}(1 + \dots)$.
3. **Careful Weight Initialization**: He/Kaiming initialization ($\text{Var}(W) = \frac{2}{n_{\text{in}}}$) for ReLU, Xavier/Glorot for Sigmoid/Tanh.
4. **Normalization Layers**: Batch Normalization, Layer Normalization, or RMSNorm.
</details>

---

### Q3: How do you choose between Precision and Recall for a real-world system?
<details>
<summary>Click to reveal answer</summary>

- Prioritize **Recall** ($\frac{\text{TP}}{\text{TP} + \text{FN}}$) when **False Negatives are unacceptably hazardous**:
  - Medical disease diagnosis (failing to diagnose a patient who is sick can be fatal).
  - Fraud detection (failing to catch a multi-million-dollar money laundering transaction).
  - Airport security bag scanning.
- Prioritize **Precision** ($\frac{\text{TP}}{\text{TP} + \text{FP}}$) when **False Positives damage user trust or incur heavy costs**:
  - Email spam filtering (marking an urgent boss email as spam causes chaos).
  - Recommender systems & video auto-play (showing irrelevant recommendations drives churn).
  - Autonomous emergency brake triggers (braking abruptly on a clear highway causes crashes).
</details>

---

### Q4: Why does XGBoost perform better than standard Gradient Boosting?
<details>
<summary>Click to reveal answer</summary>

1. **Second-Order Taylor Approximation**: Uses both first derivative (gradient $g$) and second derivative (Hessian $h$) for optimal split finding.
2. **Built-in Regularization**: Objective includes $\Omega(f) = \gamma T + \frac{1}{2}\lambda \sum w^2$, penalizing tree complexity and leaf weights directly.
3. **Approximate Split Algorithm (Quantile Sketching)**: Evaluates candidate splits on percentiles rather than every unique feature value.
4. **Sparsity-Aware Split Finding**: Learns optimal default split directions for missing values.
5. **Parallel & Cache-Conscious Architecture**: Block structures in memory maximize CPU cache hits and multithreading.
</details>

---

### Q5: How do you handle severe class imbalance (1:1000)?
<details>
<summary>Click to reveal answer</summary>

1. **Resampling**:
   - Oversampling minority class using SMOTE (Synthetic Minority Over-sampling Technique).
   - Under-sampling majority class using Tomek Links or cluster centroids.
2. **Cost-Sensitive Learning / Class Weights**:
   - Scale loss by inverse class frequencies (e.g. `class_weight='balanced'` in scikit-learn, focal loss in neural nets).
3. **Threshold Calibration**:
   - Don't use the default 0.5 decision threshold; calibrate threshold using PR-AUC (Precision-Recall curve).
4. **Algorithm Choice**:
   - Use tree ensembles (XGBoost with `scale_pos_weight`) or anomaly detection (Isolation Forests, One-Class SVM).
</details>

---

## 2. Additional Reference Notes
Review the complete handwritten lecture notes in our repository:
- `Machine Learning CheatSheet .pdf`
- `Machine Learning Handwritten Notes.pdf`
- `Machine Learning Part_1.pdf`
- `Machine Learning.pdf`

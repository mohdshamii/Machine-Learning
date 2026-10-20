---
title: "GATE Data Science & AI (DA): Complete High-Yield Revision Sheet"
subject: "19-GATE-DA-Revision"
difficulty: "Advanced"
tags: ["gate-da", "revision", "formulas", "linear-algebra", "probability", "algorithms", "exam-prep"]
prerequisites: ["01-Mathematics", "02-Statistics-and-Probability", "06-Supervised-Learning"]
description: "High-yield revision formula sheet for the GATE Data Science & AI syllabus: Linear Algebra, Calculus, Probability & Statistics, Machine Learning, and AI Search."
---

# GATE Data Science & AI (DA) Revision Sheet

A consolidated, high-yield revision reference covering the core mathematical and algorithmic concepts tested in the GATE DA curriculum.

---

## 1. Linear Algebra Formulas

### Determinant Properties
- $\det(\mathbf{A}\mathbf{B}) = \det(\mathbf{A})\det(\mathbf{B})$
- $\det(k\mathbf{A}_{n \times n}) = k^n \det(\mathbf{A})$
- $\det(\mathbf{A}^T) = \det(\mathbf{A})$
- $\det(\mathbf{A}^{-1}) = \frac{1}{\det(\mathbf{A})}$
- $\det(\mathbf{A}) = \prod_{i=1}^n \lambda_i$ (Product of eigenvalues)
- $\text{Trace}(\mathbf{A}) = \sum_{i=1}^n A_{ii} = \sum_{i=1}^n \lambda_i$ (Sum of eigenvalues)

### Orthogonal Matrices
$$\mathbf{Q}^T \mathbf{Q} = \mathbf{Q} \mathbf{Q}^T = \mathbf{I} \implies \mathbf{Q}^{-1} = \mathbf{Q}^T, \quad \det(\mathbf{Q}) = \pm 1$$
Orthogonal transformations preserve vector lengths ($\|\mathbf{Q}\mathbf{x}\|_2 = \|\mathbf{x}\|_2$) and angles.

---

## 2. Probability & Distributions

### Expectation & Variance Rules
- $\mathbb{E}[aX + bY] = a\mathbb{E}[X] + b\mathbb{E}[Y]$ (Always linear, even if dependent)
- $\text{Var}(aX + b) = a^2 \text{Var}(X)$
- $\text{Var}(X + Y) = \text{Var}(X) + \text{Var}(Y) + 2\text{Cov}(X, Y)$ (If independent, $\text{Cov}(X, Y) = 0$)
- $\text{Cov}(X, Y) = \mathbb{E}[XY] - \mathbb{E}[X]\mathbb{E}[Y]$

### Key Probability Distributions
| Distribution | Mean $\mathbb{E}[X]$ | Variance $\text{Var}(X)$ | Characteristic |
| :--- | :--- | :--- | :--- |
| **Bernoulli($p$)** | $p$ | $p(1-p)$ | Single trial, binary |
| **Binomial($n, p$)** | $np$ | $np(1-p)$ | $n$ independent trials |
| **Poisson($\lambda$)** | $\lambda$ | $\lambda$ | Mean equals variance |
| **Uniform($a, b$)** | $\frac{a+b}{2}$ | $\frac{(b-a)^2}{12}$ | Constant density |
| **Exponential($\lambda$)** | $\frac{1}{\lambda}$ | $\frac{1}{\lambda^2}$ | Memoryless property: $P(X > s+t \mid X > s) = P(X > t)$ |

---

## 3. Machine Learning Algorithms

### Support Vector Machines (SVM)
Primal optimization problem with soft margin:
$$\min_{\mathbf{w}, b, \mathbf{\xi}} \frac{1}{2} \|\mathbf{w}\|^2 + C \sum_{i=1}^m \xi_i \quad \text{s.t.} \quad y^{(i)}(\mathbf{w}^T \mathbf{x}^{(i)} + b) \ge 1 - \xi_i, \quad \xi_i \ge 0$$
- Margin width: $\frac{2}{\|\mathbf{w}\|}$
- Kernel trick: $K(\mathbf{x}, \mathbf{z}) = \phi(\mathbf{x})^T \phi(\mathbf{z})$
- Radial Basis Function (RBF) Kernel: $K(\mathbf{x}, \mathbf{z}) = \exp(-\gamma \|\mathbf{x} - \mathbf{z}\|^2)$

### Decision Tree Splitting Metrics
- **Entropy**: $H(S) = -\sum_{i=1}^C p_i \log_2(p_i)$
- **Information Gain**: $\text{IG}(S, A) = H(S) - \sum_{v \in \text{Values}(A)} \frac{|S_v|}{|S|} H(S_v)$
- **Gini Impurity**: $G(S) = 1 - \sum_{i=1}^C p_i^2$

---

## 4. Artificial Intelligence & Search Strategies

| Search Algorithm | Complete? | Optimal? | Time Complexity | Space Complexity |
| :--- | :--- | :--- | :--- | :--- |
| **Breadth-First Search (BFS)** | Yes | Yes (if step costs equal) | $\mathcal{O}(b^d)$ | $\mathcal{O}(b^d)$ |
| **Depth-First Search (DFS)** | No (in infinite spaces) | No | $\mathcal{O}(b^m)$ | $\mathcal{O}(bm)$ |
| **Uniform-Cost Search (Dijkstra)** | Yes (if step cost $\ge \epsilon > 0$) | Yes | $\mathcal{O}(b^{1 + \lfloor C^* / \epsilon \rfloor})$ | $\mathcal{O}(b^{1 + \lfloor C^* / \epsilon \rfloor})$ |
| **A\* Search** | Yes | Yes (if $h(n)$ is admissible) | $\mathcal{O}(b^d)$ | $\mathcal{O}(b^d)$ |

> [!TIP]
> **Admissibility**: A heuristic $h(n)$ is admissible if it never overestimates the true cost to reach the goal ($0 \le h(n) \le h^*(n)$).
> **Consistency (Monotonicity)**: $h(n) \le c(n, a, n') + h(n')$. Consistency implies admissibility.

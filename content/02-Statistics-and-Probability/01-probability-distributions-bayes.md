---
title: "Statistics, Probability & Bayes' Theorem for ML"
subject: "02-Statistics-and-Probability"
difficulty: "Intermediate"
tags: ["statistics", "probability", "bayes-theorem", "distributions", "hypothesis-testing"]
prerequisites: ["01-Mathematics"]
description: "Statistical rigor in Machine Learning: Probability axioms, Bayes' rule, random variables, key parametric distributions, Central Limit Theorem, and hypothesis testing."
---

# Statistics, Probability & Bayes' Theorem for ML

Machine Learning models make probabilistic inferences under uncertainty. Understanding distributions and Bayes' theorem enables you to reason about model confidence, generative models, maximum likelihood estimation (MLE), and classification.

---

## 1. Bayes' Theorem: The Foundation of Statistical Learning

Bayes' Theorem updates the probability of a hypothesis $H$ given observed evidence $E$:

$$P(H \mid E) = \frac{P(E \mid H) \cdot P(H)}{P(E)}$$

### Terminology
- **Prior $P(H)$**: Initial belief before seeing data.
- **Likelihood $P(E \mid H)$**: Probability of observing data $E$ assuming hypothesis $H$ is true.
- **Evidence / Marginal $P(E)$**: Total probability of the evidence across all hypotheses: $\sum_k P(E \mid H_k) P(H_k)$.
- **Posterior $P(H \mid E)$**: Updated belief after observing evidence $E$.

### Naive Bayes Classifier Formulation
Given a feature vector $\mathbf{x} = [x_1, x_2, \dots, x_d]^T$ and class label $y \in \{C_1, \dots, C_K\}$:

$$P(y = C_k \mid \mathbf{x}) \propto P(y = C_k) \prod_{j=1}^d P(x_j \mid y = C_k)$$

The "Naive" assumption is that all features are **conditionally independent** given the class label.

---

## 2. Essential Probability Distributions

### 1. Gaussian (Normal) Distribution $\mathcal{N}(\mu, \sigma^2)$
Probability Density Function (PDF):
$$f(x) = \frac{1}{\sigma \sqrt{2\pi}} \exp\left( -\frac{(x - \mu)^2}{2\sigma^2} \right)$$
- **68-95-99.7 Rule**: 68.2% within $1\sigma$, 95.4% within $2\sigma$, 99.7% within $3\sigma$.
- Inherent in linear regression residual errors under MLE.

### 2. Bernoulli Distribution
Models binary outcomes (e.g., coin toss, binary classification $y \in \{0, 1\}$):
$$P(Y = y) = p^y (1 - p)^{1-y}$$

### 3. Binomial Distribution $\mathcal{B}(n, p)$
Probability of observing $k$ successes in $n$ independent Bernoulli trials:
$$P(K = k) = \binom{n}{k} p^k (1 - p)^{n-k}$$

### 4. Poisson Distribution $\text{Pois}(\lambda)$
Models the count of rare events occurring in a fixed interval of time or space:
$$P(X = k) = \frac{\lambda^k e^{-\lambda}}{k!}$$

---

## 3. The Central Limit Theorem (CLT)

> [!IMPORTANT]
> The CLT states that the sum (or average) of a sufficiently large number of independent and identically distributed (i.i.d.) random variables will be **approximately normally distributed**, regardless of the underlying distribution of the original population!

```python
import numpy as np
import matplotlib.pyplot as plt

# Simulate CLT from an exponential (heavily skewed) distribution
sample_means = []
population = np.random.exponential(scale=2.0, size=100_000)

for _ in range(5000):
    sample = np.random.choice(population, size=30, replace=False)
    sample_means.append(np.mean(sample))

print(f"Population Mean: {np.mean(population):.2f} (Theoretical: 2.00)")
print(f"Sample Means Mean: {np.mean(sample_means):.2f}")
print(f"Sample Means Std:  {np.std(sample_means):.2f} (Theoretical sigma/sqrt(n): {2.0/np.sqrt(30):.2f})")
```

---

## 4. Maximum Likelihood Estimation (MLE) vs MAP

### MLE (Frequentist Approach)
Find parameters $\theta$ that maximize the probability of observed training data $\mathcal{D}$:
$$\theta_{\text{MLE}} = \arg\max_\theta \sum_{i=1}^m \log P(x_i \mid \theta)$$

### MAP (Maximum A Posteriori - Bayesian Approach)
Incorporates a prior distribution $P(\theta)$ over parameters:
$$\theta_{\text{MAP}} = \arg\max_\theta \left( \sum_{i=1}^m \log P(x_i \mid \theta) + \log P(\theta) \right)$$
- When prior $P(\theta) \sim \mathcal{N}(0, \sigma^2)$, MAP equals **$L_2$ Ridge Regularization**.
- When prior $P(\theta) \sim \text{Laplace}(0, b)$, MAP equals **$L_1$ Lasso Regularization**.

---

## 5. Statistical Hypothesis Testing

1. **Formulate Hypotheses**: $H_0$ (Null Hypothesis, no effect) vs $H_1$ (Alternative Hypothesis).
2. **Select Significance Level ($\alpha$)**: Usually $\alpha = 0.05$ or $0.01$.
3. **Compute Test Statistic**: e.g. Z-score, Student's t-statistic, $\chi^2$ statistic.
4. **Determine p-value**: Probability of observing data at least as extreme as observed, assuming $H_0$ is true.
   - If $p \le \alpha \implies$ Reject $H_0$ (Statistically significant).
   - If $p > \alpha \implies$ Fail to reject $H_0$.

> [!CAUTION]
> **Type I Error ($\alpha$)**: False Positive (rejecting true $H_0$).
> **Type II Error ($\beta$)**: False Negative (failing to reject false $H_0$). Power $= 1 - \beta$.

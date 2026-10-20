---
title: "Linear Algebra & Calculus for Machine Learning"
subject: "01-Mathematics"
difficulty: "Intermediate"
tags: ["mathematics", "linear-algebra", "calculus", "eigenvectors", "gradients"]
prerequisites: ["00-Python-for-ML"]
description: "Core mathematical foundations of machine learning: vector spaces, matrix factorizations, eigenvalues, partial derivatives, and multivariate gradient calculus."
---

# Linear Algebra & Calculus for Machine Learning

Machine Learning algorithms represent data as points in high-dimensional vector spaces and optimize objective functions using multivariate calculus. Understanding the underlying mathematics eliminates guesswork when selecting architectures and diagnosing training anomalies.

---

## 1. Vector Norms & Distance Metrics

A vector norm measures the magnitude of a vector $\mathbf{x} = [x_1, x_2, \dots, x_n]^T \in \mathbb{R}^n$.

### $L_1$ Norm (Manhattan Distance)
$$\|\mathbf{x}\|_1 = \sum_{i=1}^n |x_i|$$
- Encourages **sparsity** in weights (Lasso Regularization).
- Sensitive to coordinate axis rotation.

### $L_2$ Norm (Euclidean Distance)
$$\|\mathbf{x}\|_2 = \sqrt{\sum_{i=1}^n x_i^2} = \sqrt{\mathbf{x}^T \mathbf{x}}$$
- Smooth, strictly convex, rotationally invariant (Ridge Regularization).
- Strongly penalizes large outlier values due to squaring.

### $L_\infty$ Norm (Max Norm)
$$\|\mathbf{x}\|_\infty = \max_i |x_i|$$

```python
import numpy as np

x = np.array([3, -4, 0])
print("L1 norm:", np.linalg.norm(x, ord=1)) # 7.0
print("L2 norm:", np.linalg.norm(x, ord=2)) # 5.0
print("L-inf norm:", np.linalg.norm(x, ord=np.inf)) # 4.0
```

---

## 2. Matrix Rank, Invertibility, and Determinants

A square matrix $\mathbf{A} \in \mathbb{R}^{n \times n}$ is invertible (non-singular) if and only if:
1. $\det(\mathbf{A}) \neq 0$
2. Rank$(\mathbf{A}) = n$ (Full rank, columns are linearly independent)
3. Zero is **not** an eigenvalue of $\mathbf{A}$.

### Geometric Meaning of the Determinant
The determinant $|\det(\mathbf{A})|$ measures the scaling factor of volume under the linear transformation represented by $\mathbf{A}$. If $\det(\mathbf{A}) = 0$, space is compressed into a lower-dimensional subspace, destroying information and preventing inversion.

---

## 3. Eigenvalues and Eigenvectors

For a square matrix $\mathbf{A}$, a non-zero vector $\mathbf{v}$ is an **eigenvector** with corresponding scalar **eigenvalue** $\lambda$ if:

$$\mathbf{A}\mathbf{v} = \lambda \mathbf{v}$$

### Significance in ML:
- **Principal Component Analysis (PCA)**: Finds the eigenvectors of the covariance matrix $\mathbf{\Sigma} = \frac{1}{m} \mathbf{X}^T \mathbf{X}$. The eigenvectors with the largest eigenvalues define the directions of maximal variance.
- **Spectral Clustering**: Uses eigenvectors of the Graph Laplacian matrix to find clusters in non-convex manifolds.

```python
# PCA concept via Eigenvalues
cov_matrix = np.array([[2.5, 0.8], [0.8, 1.2]])
eigenvalues, eigenvectors = np.linalg.eig(cov_matrix)

# Sort eigenvectors by decreasing eigenvalue
sort_idx = np.argsort(eigenvalues)[::-1]
sorted_vals = eigenvalues[sort_idx]
sorted_vecs = eigenvectors[:, sort_idx]

print("Dominant direction (PC1):", sorted_vecs[:, 0])
print("Variance explained by PC1:", sorted_vals[0] / sorted_vals.sum())
```

---

## 4. Singular Value Decomposition (SVD)

Any real matrix $\mathbf{X} \in \mathbb{R}^{m \times n}$ can be factored into:

$$\mathbf{X} = \mathbf{U} \mathbf{\Sigma} \mathbf{V}^T$$

Where:
- $\mathbf{U} \in \mathbb{R}^{m \times m}$ is orthogonal (left singular vectors, eigenvectors of $\mathbf{X}\mathbf{X}^T$)
- $\mathbf{\Sigma} \in \mathbb{R}^{m \times n}$ is diagonal containing singular values $\sigma_1 \ge \sigma_2 \ge \dots \ge 0$
- $\mathbf{V} \in \mathbb{R}^{n \times n}$ is orthogonal (right singular vectors, eigenvectors of $\mathbf{X}^T\mathbf{X}$)

Applications: Latent Semantic Analysis (NLP), recommender systems (collaborative filtering matrix factorization), and image compression.

---

## 5. Multivariate Calculus & The Gradient

For a scalar objective function $f(\mathbf{x}): \mathbb{R}^n \to \mathbb{R}$, the **gradient** vector $\nabla f(\mathbf{x})$ points in the direction of steepest ascent:

$$\nabla f(\mathbf{x}) = \begin{bmatrix} \frac{\partial f}{\partial x_1} \\ \frac{\partial f}{\partial x_2} \\ \vdots \\ \frac{\partial f}{\partial x_n} \end{bmatrix}$$

### The Hessian Matrix (Curvature)
The Hessian $\mathbf{H} \in \mathbb{R}^{n \times n}$ contains all second-order partial derivatives:
$$H_{ij} = \frac{\partial^2 f}{\partial x_i \partial x_j}$$
- If $\mathbf{H}$ is **positive definite** ($\mathbf{v}^T \mathbf{H} \mathbf{v} > 0 \;\forall \mathbf{v} \neq 0$), the stationary point is a local minimum.
- Condition number of $\mathbf{H}$ dictates how fast gradient descent converges (ill-conditioned Hessians lead to oscillating zig-zag trajectories).

---

## 6. Key Formula Cheat Sheet

| Mathematical Concept | Formula | ML Application |
| :--- | :--- | :--- |
| **Cosine Similarity** | $\cos(\theta) = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\|_2 \|\mathbf{v}\|_2}$ | Vector search, embeddings, NLP |
| **Covariance Matrix** | $\mathbf{\Sigma} = \frac{1}{m} (\mathbf{X} - \mathbf{\mu})^T (\mathbf{X} - \mathbf{\mu})$ | PCA, Mahalanobis distance |
| **Gradient Update** | $\mathbf{\theta}_{t+1} = \mathbf{\theta}_t - \alpha \nabla_{\mathbf{\theta}} J(\mathbf{\theta})$ | Gradient descent optimization |
| **Frobenius Norm** | $\|\mathbf{A}\|_F = \sqrt{\sum_{i,j} A_{ij}^2} = \sqrt{\text{Tr}(\mathbf{A}^T\mathbf{A})}$ | Matrix regularization |

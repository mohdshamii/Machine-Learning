---
title: "Supervised Learning: Linear & Logistic Regression from Scratch"
subject: "06-Supervised-Learning"
difficulty: "Intermediate"
tags: ["supervised", "linear-regression", "logistic-regression", "gradient-descent", "from-scratch"]
prerequisites: ["01-Mathematics", "04-Data-Preprocessing"]
description: "Derive and implement Linear and Logistic Regression from first principles: Ordinary Least Squares, cross-entropy loss, gradient descent mathematics, and regularization."
---

# Supervised Learning: Linear & Logistic Regression

Supervised learning maps an input feature vector $\mathbf{x} \in \mathbb{R}^d$ to a target output $y$. When $y \in \mathbb{R}$, the problem is **Regression**; when $y$ is discrete, the problem is **Classification**.

---

## 1. Linear Regression Formulation

Linear regression models the relationship between features $\mathbf{X}$ and continuous target $y$ as a linear combination:

$$\hat{y} = h_\theta(\mathbf{x}) = \theta_0 + \theta_1 x_1 + \theta_2 x_2 + \dots + \theta_d x_d = \mathbf{x}^T \mathbf{\theta}$$

### The Cost Function (Mean Squared Error - MSE)
$$J(\mathbf{\theta}) = \frac{1}{2m} \sum_{i=1}^m \left( h_\theta(\mathbf{x}^{(i)}) - y^{(i)} \right)^2 = \frac{1}{2m} \|\mathbf{X}\mathbf{\theta} - \mathbf{y}\|_2^2$$

### Analytical Solution: The Normal Equation
Setting $\nabla_{\mathbf{\theta}} J(\mathbf{\theta}) = 0$ yields:

$$\mathbf{\theta}^* = (\mathbf{X}^T \mathbf{X})^{-1} \mathbf{X}^T \mathbf{y}$$

- Complexity is $\mathcal{O}(d^3)$ due to matrix inversion.
- For large feature sets ($d > 10,000$), iterative gradient descent is preferred over the Normal Equation.

### Iterative Solution: Batch Gradient Descent
$$\theta_j := \theta_j - \alpha \frac{\partial J}{\partial \theta_j} = \theta_j - \frac{\alpha}{m} \sum_{i=1}^m \left( h_\theta(\mathbf{x}^{(i)}) - y^{(i)} \right) x_j^{(i)}$$

In vectorized form:
$$\mathbf{\theta} := \mathbf{\theta} - \frac{\alpha}{m} \mathbf{X}^T (\mathbf{X}\mathbf{\theta} - \mathbf{y})$$

---

## 2. Python Implementation from Scratch

```python
import numpy as np

class LinearRegressionScratch:
    def __init__(self, lr=0.01, n_iterations=1000):
        self.lr = lr
        self.n_iterations = n_iterations
        self.weights = None
        self.bias = None
        self.loss_history = []

    def fit(self, X, y):
        n_samples, n_features = X.shape
        self.weights = np.zeros(n_features)
        self.bias = 0.0

        for _ in range(self.n_iterations):
            # 1. Forward prediction
            y_pred = np.dot(X, self.weights) + self.bias
            
            # 2. Compute MSE Loss
            loss = (1 / (2 * n_samples)) * np.sum((y_pred - y) ** 2)
            self.loss_history.append(loss)

            # 3. Compute Gradients
            dw = (1 / n_samples) * np.dot(X.T, (y_pred - y))
            db = (1 / n_samples) * np.sum(y_pred - y)

            # 4. Parameter Update
            self.weights -= self.lr * dw
            self.bias -= self.lr * db

    def predict(self, X):
        return np.dot(X, self.weights) + self.bias
```

---

## 3. Logistic Regression Formulation

Logistic Regression models the probability that an observation belongs to class $y=1$ using the **Sigmoid (logistic) function** $\sigma(z)$:

$$\sigma(z) = \frac{1}{1 + e^{-z}}$$

$$\hat{y} = P(y = 1 \mid \mathbf{x}) = \sigma(\mathbf{x}^T \mathbf{\theta}) = \frac{1}{1 + e^{-\mathbf{x}^T \mathbf{\theta}}}$$

### Binary Cross-Entropy (Log-Loss)
$$J(\mathbf{\theta}) = -\frac{1}{m} \sum_{i=1}^m \left[ y^{(i)} \log(\hat{y}^{(i)}) + (1 - y^{(i)}) \log(1 - \hat{y}^{(i)}) \right]$$

Remarkably, the gradient update rule for Logistic Regression has the exact same mathematical form as Linear Regression:
$$\mathbf{\theta} := \mathbf{\theta} - \frac{\alpha}{m} \mathbf{X}^T (\sigma(\mathbf{X}\mathbf{\theta}) - \mathbf{y})$$

---

## 4. Regularization: Ridge ($L_2$) vs. Lasso ($L_1$)

To prevent overfitting, we add a penalty term to the cost function:

$$\text{Ridge } (L_2): \quad J_{\text{Ridge}}(\mathbf{\theta}) = J(\mathbf{\theta}) + \frac{\lambda}{2m} \|\mathbf{\theta}\|_2^2 = J(\mathbf{\theta}) + \frac{\lambda}{2m} \sum_{j=1}^d \theta_j^2$$

$$\text{Lasso } (L_1): \quad J_{\text{Lasso}}(\mathbf{\theta}) = J(\mathbf{\theta}) + \frac{\lambda}{m} \|\mathbf{\theta}\|_1 = J(\mathbf{\theta}) + \frac{\lambda}{m} \sum_{j=1}^d |\theta_j|$$

- **Ridge**: Shrinks coefficients towards zero, handles multicollinearity, but keeps all features.
- **Lasso**: Drives non-informative coefficients strictly to zero, performing automatic **feature selection**.

---

## 5. Original Repository Lab Reference
See our interactive gradient descent notebook and animation:
- **Notebook**: `supervised ml/housepriceusingLR.ipynb`
- **Visual Animation**: `supervised ml/linear_regression_A.gif`
- **Handwritten Notes**: `Logistic Regression Notes 📝 .pdf`

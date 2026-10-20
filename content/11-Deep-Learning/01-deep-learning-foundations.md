---
title: "Deep Learning Foundations: Perceptrons, MLPs & Loss Functions"
subject: "11-Deep-Learning"
difficulty: "Intermediate"
tags: ["deep-learning", "perceptron", "mlp", "activation-functions", "cross-entropy", "relu"]
prerequisites: ["01-Mathematics", "06-Supervised-Learning"]
description: "From Rosenblatt's Perceptron to Multi-Layer Perceptrons: non-linear activation functions (ReLU, GELU, Sigmoid), Universal Approximation Theorem, and loss landscapes."
---

# Deep Learning Foundations: Perceptrons & Multi-Layer Perceptrons

Deep learning constructs hierarchical representations of data by composing multiple non-linear processing layers. Each layer transforms the representation at one level into a representation at a higher, slightly more abstract level.

---

## 1. The Artificial Neuron (Perceptron)

A single artificial neuron computes a weighted sum of inputs plus a bias, passing the scalar through an activation function $\phi$:

$$z = \sum_{j=1}^d w_j x_j + b = \mathbf{w}^T \mathbf{x} + b$$
$$a = \phi(z)$$

### The XOR Problem & Need for Multi-Layer Networks
A single perceptron can only separate linearly separable classes (Rosenblatt, 1958). In 1969, Minsky and Papert demonstrated that a single perceptron cannot learn the XOR function. Multi-Layer Perceptrons (MLPs) overcome this by mapping inputs into hidden non-linear feature spaces where classes become linearly separable.

---

## 2. Universal Approximation Theorem

> [!IMPORTANT]
> The **Universal Approximation Theorem** (Cybenko, 1989; Hornik, 1991) proves that a standard feedforward neural network with a single hidden layer containing a finite number of neurons can approximate any continuous function on compact subsets of $\mathbb{R}^n$ to arbitrary precision, provided the activation function is non-linear.

---

## 3. Activation Functions Comparison

Without non-linear activation functions, a 100-layer neural network collapses into a single linear transformation:
$$\mathbf{W}_3(\mathbf{W}_2(\mathbf{W}_1 \mathbf{x})) = (\mathbf{W}_3 \mathbf{W}_2 \mathbf{W}_1) \mathbf{x} = \mathbf{W}_{\text{eff}} \mathbf{x}$$

### 1. Sigmoid
$$\sigma(z) = \frac{1}{1 + e^{-z}}, \quad \sigma'(z) = \sigma(z)(1 - \sigma(z))$$
- Output range: $(0, 1)$.
- **Vanishing Gradient**: Derivative maximum is $0.25$. Deep networks suffer from vanishing gradients as errors multiply through layers. Not zero-centered.

### 2. Hyperbolic Tangent ($\tanh$)
$$\tanh(z) = \frac{e^z - e^{-z}}{e^z + e^{-z}}, \quad \tanh'(z) = 1 - \tanh^2(z)$$
- Output range: $(-1, 1)$. Zero-centered, but still suffers from vanishing gradients when $|z| \gg 0$.

### 3. Rectified Linear Unit (ReLU)
$$\text{ReLU}(z) = \max(0, z), \quad \text{ReLU}'(z) = \begin{cases} 1 & \text{if } z > 0 \\ 0 & \text{if } z \le 0 \end{cases}$$
- **Advantages**: Computationally trivial, gradient is $1$ for positive activations (eliminating vanishing gradients), induces sparse representations.
- **Dying ReLU problem**: If a neuron outputs negative values across all training samples, its gradient is permanently $0$ and it never recovers.

### 4. Leaky ReLU & GELU
- **Leaky ReLU**: $\max(\alpha z, z)$ where $\alpha \approx 0.01$ prevents dead neurons.
- **GELU (Gaussian Error Linear Unit)**: $\text{GELU}(x) = x \cdot \Phi(x) \approx 0.5x(1 + \tanh(\sqrt{2/\pi}(x + 0.044715x^3)))$. Standard in modern LLMs (BERT, GPT, Transformers).

---

## 4. Multi-Class Classification & Softmax

For multi-class classification with $K$ mutually exclusive categories:

$$P(y = k \mid \mathbf{z}) = \frac{e^{z_k}}{\sum_{j=1}^K e^{z_j}}$$

### Categorical Cross-Entropy Loss
$$\mathcal{L}(\mathbf{y}, \mathbf{\hat{y}}) = -\sum_{k=1}^K y_k \log(\hat{y}_k)$$
Where $\mathbf{y}$ is the one-hot encoded ground truth vector.

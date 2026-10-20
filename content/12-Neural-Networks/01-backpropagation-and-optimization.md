---
title: "Neural Networks: Backpropagation & Modern Optimizers"
subject: "12-Neural-Networks"
difficulty: "Advanced"
tags: ["neural-networks", "backpropagation", "adam", "adamw", "sgd", "batch-norm", "dropout"]
prerequisites: ["01-Mathematics", "11-Deep-Learning"]
description: "Rigorous derivation of backpropagation using the multivariate chain rule, gradient flow dynamics, modern optimizers (SGD, Momentum, AdamW), and regularization."
---

# Backpropagation & Modern Optimizers

Backpropagation is the efficient computation of partial derivatives $\frac{\partial \mathcal{L}}{\partial \mathbf{W}^{(l)}}$ and $\frac{\partial \mathcal{L}}{\partial \mathbf{b}^{(l)}}$ for every layer in a computational graph using the multivariate chain rule.

---

## 1. Backpropagation Derivation

Consider layer $l$ in a feedforward network:
$$\mathbf{z}^{(l)} = \mathbf{W}^{(l)} \mathbf{a}^{(l-1)} + \mathbf{b}^{(l)}$$
$$\mathbf{a}^{(l)} = \phi(\mathbf{z}^{(l)})$$

Define the error vector $\mathbf{\delta}^{(l)}$ as the sensitivity of loss $\mathcal{L}$ with respect to the pre-activation input $\mathbf{z}^{(l)}$:
$$\mathbf{\delta}^{(l)} \equiv \frac{\partial \mathcal{L}}{\partial \mathbf{z}^{(l)}}$$

### Four Fundamental Equations of Backpropagation:
1. **Output Layer Error $\mathbf{\delta}^{(L)}$**:
   $$\mathbf{\delta}^{(L)} = \nabla_{\mathbf{a}} \mathcal{L} \odot \phi'(\mathbf{z}^{(L)})$$
   *(For Softmax with Cross-Entropy: $\mathbf{\delta}^{(L)} = \mathbf{\hat{y}} - \mathbf{y}$)*

2. **Error in terms of next layer error $\mathbf{\delta}^{(l+1)}$**:
   $$\mathbf{\delta}^{(l)} = \left( (\mathbf{W}^{(l+1)})^T \mathbf{\delta}^{(l+1)} \right) \odot \phi'(\mathbf{z}^{(l)})$$

3. **Rate of change with respect to bias**:
   $$\frac{\partial \mathcal{L}}{\partial \mathbf{b}^{(l)}} = \mathbf{\delta}^{(l)}$$

4. **Rate of change with respect to weight matrix**:
   $$\frac{\partial \mathcal{L}}{\partial \mathbf{W}^{(l)}} = \mathbf{\delta}^{(l)} (\mathbf{a}^{(l-1)})^T$$

---

## 2. Modern Gradient Descent Optimizers

### 1. Stochastic Gradient Descent with Momentum
Maintains an exponential moving average of past gradients to dampen oscillations:
$$\mathbf{v}_t = \beta \mathbf{v}_{t-1} + (1 - \beta) \mathbf{g}_t$$
$$\mathbf{\theta}_t = \mathbf{\theta}_{t-1} - \alpha \mathbf{v}_t$$

### 2. RMSprop (Root Mean Square Propagation)
Scales learning rate inversely by the root of running average of squared gradients:
$$\mathbf{s}_t = \beta \mathbf{s}_{t-1} + (1 - \beta) \mathbf{g}_t^2$$
$$\mathbf{\theta}_t = \mathbf{\theta}_{t-1} - \frac{\alpha}{\sqrt{\mathbf{s}_t} + \epsilon} \odot \mathbf{g}_t$$

### 3. Adam (Adaptive Moment Estimation)
Combines first moment (momentum) and second moment (RMSprop) with bias corrections:
$$\hat{\mathbf{m}}_t = \frac{\mathbf{m}_t}{1 - \beta_1^t}, \quad \hat{\mathbf{v}}_t = \frac{\mathbf{v}_t}{1 - \beta_2^t}$$
$$\mathbf{\theta}_t = \mathbf{\theta}_{t-1} - \frac{\alpha}{\sqrt{\hat{\mathbf{v}}_t} + \epsilon} \hat{\mathbf{m}}_t$$
Typical hyperparameters: $\beta_1 = 0.9$, $\beta_2 = 0.999$, $\epsilon = 10^{-8}$.

### 4. AdamW (Decoupled Weight Decay)
Standard Adam applies $L_2$ regularization by adding $\lambda \mathbf{\theta}$ to the gradient $\mathbf{g}_t$. Because this term is divided by $\sqrt{\mathbf{v}_t}$, weights with large gradients receive less decay. Loshchilov & Hutter (2019) decoupled weight decay directly into parameter updates:
$$\mathbf{\theta}_t = \mathbf{\theta}_{t-1} - \alpha \lambda \mathbf{\theta}_{t-1} - \frac{\alpha}{\sqrt{\hat{\mathbf{v}}_t} + \epsilon} \hat{\mathbf{m}}_t$$
AdamW is the default optimizer for Transformers and state-of-the-art LLMs.

---

## 3. Essential Neural Network Regularization

- **Dropout (Srivastava et al., 2014)**: During training, randomly zero out each neuron with probability $p$. Inverted dropout scales remaining activations by $\frac{1}{1 - p}$ during training, eliminating scaling requirements at inference time.
- **Batch Normalization (Ioffe & Szegedy, 2015)**: Normalizes mini-batch activations to zero mean and unit variance, stabilizing internal covariate shift and smoothing the loss landscape:
  $$\hat{x}_i = \frac{x_i - \mu_B}{\sqrt{\sigma_B^2 + \epsilon}}, \quad y_i = \gamma \hat{x}_i + \beta$$
- **Layer Normalization (Ba et al., 2016)**: Computes normalization across hidden dimensions of an individual token/sample rather than across the mini-batch (crucial for RNNs and Transformers).

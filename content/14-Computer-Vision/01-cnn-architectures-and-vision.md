---
title: "Computer Vision: Convolutional Neural Networks & ResNet"
subject: "14-Computer-Vision"
difficulty: "Advanced"
tags: ["computer-vision", "cnn", "convolutions", "resnet", "pooling", "transfer-learning"]
prerequisites: ["11-Deep-Learning"]
description: "Master Computer Vision architectures: 2D convolutions, receptive fields, spatial dimensions, pooling operations, ResNet residual skip connections, and transfer learning."
---

# Computer Vision: CNN Architectures & Convolutions

Fully connected networks fail on high-resolution image data because parameter counts explode (a $1000 \times 1000$ RGB image with a 1000-neuron layer requires $3 \times 10^9$ weights) and fail to capture spatial translation invariance. Convolutional Neural Networks (CNNs) solve this using **local connectivity** and **weight sharing**.

---

## 1. The 2D Convolution Operation

Given an input feature map $\mathbf{X}$ and a kernel (filter) $\mathbf{K} \in \mathbb{R}^{k_h \times k_w}$:

$$S(i, j) = (\mathbf{X} * \mathbf{K})(i, j) = \sum_{m} \sum_{n} X(i + m, j + n) K(m, n)$$

### Output Spatial Dimensions Formula
Given input height $W$, filter size $F$, padding $P$, and stride $S$:

$$W_{\text{out}} = \left\lfloor \frac{W - F + 2P}{S} \right\rfloor + 1$$

- **Stride ($S$)**: Step size of the kernel slide across the image.
- **Padding ($P$)**: Zero-padding borders to preserve spatial dimensions ("same" padding: $P = \frac{F-1}{2}$ for odd $F$ with $S=1$).

---

## 2. Pooling & Receptive Field

- **Max Pooling**: Downsamples spatial dimensions by taking the maximum value in each $2 \times 2$ window (stride 2), reducing computational footprint and imparting translation invariance.
- **Global Average Pooling (GAP)**: Averages each feature map across all spatial dimensions ($H \times W \to 1$), drastically reducing parameters before dense classification heads.

---

## 3. ResNet & The Residual Learning Principle (He et al., 2015)

Prior to ResNet, stacking deeper layers caused accuracy degradation (vanishing/exploding gradients and optimization degradation). ResNet introduced **residual skip connections**:

$$\mathbf{y} = \mathcal{F}(\mathbf{x}, \{W_i\}) + \mathbf{x}$$

Instead of forcing layers to fit an underlying mapping $\mathcal{H}(\mathbf{x})$, the layers fit a residual mapping $\mathcal{F}(\mathbf{x}) = \mathcal{H}(\mathbf{x}) - \mathbf{x}$.
- If an identity mapping is optimal, the optimizer simply drives weights $\mathcal{F} \to 0$.
- Gradients flow directly back through the identity skip connection without attenuation during backpropagation.

---

## 4. Transfer Learning in Computer Vision

Instead of training a vision model from scratch on small datasets, fine-tune a model pre-trained on ImageNet ($1.4\text{M}$ images, $1000$ classes):

```python
import torchvision.models as models
import torch.nn as nn

# Load pre-trained ResNet-50
model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)

# Freeze convolutional feature extraction backbone
for param in model.parameters():
    param.requires_grad = False

# Replace classification head with custom number of classes
num_ftrs = model.fc.in_features
model.fc = nn.Linear(num_ftrs, 10) # 10 custom classes
```

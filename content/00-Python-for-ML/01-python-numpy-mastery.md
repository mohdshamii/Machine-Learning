---
title: "Python & NumPy Mastery for Machine Learning"
subject: "00-Python-for-ML"
difficulty: "Beginner"
tags: ["python", "numpy", "vectorization", "linear-algebra", "arrays"]
prerequisites: ["Basic Python syntax"]
description: "Master multi-dimensional array operations, vectorization techniques, memory layout, broadcasting rules, and high-performance linear algebra with NumPy."
---

# Python & NumPy Mastery for Machine Learning

NumPy is the foundational bedrock of all modern scientific computing and machine learning in Python. High-level frameworks like PyTorch, TensorFlow, and Scikit-Learn rely on NumPy's memory model and vectorized array operations under the hood.

---

## 1. Why NumPy? Vectorization vs. Python Loops

Traditional Python lists store pointers to heap-allocated objects, introducing dynamic type-checking and cache-locality overhead. NumPy arrays (`ndarray`) store elements in **contiguous memory blocks** with fixed C data types.

```python
import numpy as np
import time

# Benchmark: Python lists vs NumPy arrays
size = 1_000_000
list_a = list(range(size))
list_b = list(range(size))

arr_a = np.arange(size)
arr_b = np.arange(size)

# Python Loop
start = time.perf_counter()
list_result = [a + b for a, b in zip(list_a, list_b)]
py_time = time.perf_counter() - start

# NumPy Vectorized Addition
start = time.perf_counter()
arr_result = arr_a + arr_b
np_time = time.perf_counter() - start

print(f"Python list addition: {py_time*1000:.2f} ms")
print(f"NumPy vectorized:     {np_time*1000:.2f} ms")
print(f"Speedup factor:       {py_time / np_time:.1f}x faster!")
```

### Key Takeaway
Vectorized operations push loops down into optimized SIMD (Single Instruction, Multiple Data) C and Fortran routines (BLAS / LAPACK), giving speedups typically between **20x to 100x**.

---

## 2. Array Creation & Essential Attributes

```python
# 1D vector, 2D matrix, 3D tensor
v = np.array([1.0, 2.0, 3.0])
M = np.array([[1, 2, 3], [4, 5, 6]], dtype=np.float32)
T = np.zeros((3, 4, 5)) # Tensor of zeros

print(f"Shape: {M.shape}")       # (2, 3)
print(f"Dimensions: {M.ndim}")   # 2
print(f"Data type: {M.dtype}")   # float32
print(f"Item size: {M.itemsize} bytes") # 4 bytes
print(f"Memory size: {M.nbytes} bytes") # 24 bytes
```

### Standard Generators
- `np.zeros(shape)`, `np.ones(shape)`, `np.full(shape, fill_value)`
- `np.eye(N)`: Identity matrix of size $N \times N$
- `np.arange(start, stop, step)`: Equivalent to `range()` returning array
- `np.linspace(start, stop, num)`: Linearly spaced intervals (ideal for plotting)
- `np.random.seed(42)` & `np.random.randn(rows, cols)`: Standard normal distribution $\mathcal{N}(0, 1)$

---

## 3. The Rules of Array Broadcasting

Broadcasting allows arithmetic operations between arrays of different shapes without copying data.

### The Two Broadcasting Rules:
Two dimensions are compatible when:
1. They are **equal**, OR
2. One of them is **1**.

If dimensions differ in length, prepend `1`s to the smaller shape on the left.

### Visual Example
```python
A = np.ones((4, 3))    # Shape: (4, 3)
B = np.array([10, 20, 30]) # Shape: (3,) -> broadcasted to (1, 3) -> (4, 3)

C = A + B # Valid! Output shape is (4, 3)
print("Result shape:", C.shape)
```

$$\begin{bmatrix} 1 & 1 & 1 \\ 1 & 1 & 1 \\ 1 & 1 & 1 \\ 1 & 1 & 1 \end{bmatrix} + \begin{bmatrix} 10 & 20 & 30 \end{bmatrix} = \begin{bmatrix} 11 & 21 & 31 \\ 11 & 21 & 31 \\ 11 & 21 & 31 \\ 11 & 21 & 31 \end{bmatrix}$$

---

## 4. Matrix Multiplication & Linear Algebra

In Machine Learning, forward propagation is fundamentally matrix multiplication:
$$\hat{\mathbf{y}} = \mathbf{X}\mathbf{W} + \mathbf{b}$$

```python
X = np.random.randn(100, 10) # 100 samples, 10 features
W = np.random.randn(10, 2)   # 10 input features, 2 output classes
b = np.zeros((1, 2))         # Bias vector

# Matrix multiplication: use @ operator or np.matmul()
y_hat = X @ W + b

print("Predictions shape:", y_hat.shape) # (100, 2)
```

### Essential Linear Algebra Operations
- Dot product: `np.dot(a, b)`
- Matrix Inverse: `np.linalg.inv(A)`
- Determinant: `np.linalg.det(A)`
- Eigenvalues & Eigenvectors: `eigenvalues, eigenvectors = np.linalg.eig(A)`
- Singular Value Decomposition (SVD): `U, S, Vt = np.linalg.svd(A)`

---

## 5. Quick Revision & Common Pitfalls

> [!CAUTION]
> **View vs Copy**: Slicing an array creates a **view**, not a copy! Modifying a slice changes the original array. Use `arr.copy()` when you need an independent copy.

> [!WARNING]
> **Element-wise vs Matrix Multiplication**: `A * B` performs element-wise Hadamard product. Use `A @ B` for true matrix multiplication.

---

## 6. Flashcards & Self-Check

### Q1: What is the output of `np.array([1, 2, 3]) * np.array([[1], [2]])`?
<details>
<summary>Click to reveal answer</summary>
Array of shape `(2, 3)`:
`[[1, 2, 3], [2, 4, 6]]`
Broadcasting stretches `(3,)` to `(1, 3)` and `(2, 1)` to `(2, 3)`.
</details>

### Q2: What is the difference between `np.ravel()` and `np.flatten()`?
<details>
<summary>Click to reveal answer</summary>
`ravel()` returns a contiguous flattened **view** of the array when possible (memory efficient), whereas `flatten()` always allocates a new copy.
</details>

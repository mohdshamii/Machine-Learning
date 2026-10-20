---
title: "Unsupervised Learning: K-Means & Hierarchical Clustering"
subject: "07-Unsupervised-Learning"
difficulty: "Intermediate"
tags: ["unsupervised", "clustering", "kmeans", "hierarchical", "dendrogram", "elbow-method"]
prerequisites: ["01-Mathematics"]
description: "Deep dive into Unsupervised Learning: K-Means Lloyd's algorithm, WCSS, Silhouette coefficients, Agglomerative vs Divisive Hierarchical Clustering, and linkage metrics."
---

# Unsupervised Learning: K-Means & Hierarchical Clustering

Unsupervised learning discovers intrinsic structures, hidden clusters, and representations in data without predefined labels $y$.

---

## 1. K-Means Clustering Algorithm

K-Means partitions $m$ data points into $k$ distinct, non-overlapping clusters.

### Mathematical Objective
Minimize the Within-Cluster Sum of Squares (WCSS / Inertia):

$$J(c, \mu) = \sum_{i=1}^m \|\mathbf{x}^{(i)} - \mathbf{\mu}_{c^{(i)}}\|_2^2$$

Where:
- $c^{(i)} \in \{1, \dots, k\}$ is the cluster assignment for sample $i$.
- $\mathbf{\mu}_j$ is the centroid of cluster $j$.

### Lloyd's Iterative Algorithm
1. **Initialize** $k$ centroids $\mathbf{\mu}_1, \dots, \mathbf{\mu}_k$ randomly (or with K-Means++).
2. **Assignment Step**: Assign each observation to its closest centroid:
   $$c^{(i)} := \arg\min_j \|\mathbf{x}^{(i)} - \mathbf{\mu}_j\|_2^2$$
3. **Update Step**: Recompute centroids as the mean of all assigned points:
   $$\mathbf{\mu}_j := \frac{1}{|C_j|} \sum_{i \in C_j} \mathbf{x}^{(i)}$$
4. Repeat steps 2-3 until centroids stop moving (convergence).

---

## 2. Choosing Optimal $k$: Elbow Method vs. Silhouette Analysis

### The Elbow Method
Plot WCSS vs $k$. The curve decreases monotonically; look for the "elbow" point where the rate of decrease abruptly flattens.

### Silhouette Score
Measures how similar an object is to its own cluster compared to other clusters:

$$s(i) = \frac{b(i) - a(i)}{\max(a(i), b(i))}, \quad s(i) \in [-1, +1]$$

- $a(i)$: Mean intra-cluster distance between sample $i$ and all other points in the same cluster.
- $b(i)$: Mean nearest-cluster distance between sample $i$ and points in the nearest neighboring cluster.
- $s \approx +1$: Sample is well clustered.
- $s \approx 0$: Sample is on the boundary between two clusters.
- $s < 0$: Sample might belong in the neighboring cluster.

---

## 3. Hierarchical Clustering

Hierarchical clustering builds nested tree representations (dendrograms) without requiring a pre-specified $k$.

### Agglomerative (Bottom-Up)
1. Start with $m$ clusters (every data point in its own cluster).
2. Compute pairwise distance matrix between all clusters.
3. Merge the two closest clusters.
4. Repeat until a single cluster encompasses all points.

### Linkage Criteria for Cluster Distance
- **Single Linkage**: Minimum distance between any point in cluster $A$ and any point in cluster $B$:
  $$D(A, B) = \min_{\mathbf{x} \in A, \mathbf{y} \in B} \|\mathbf{x} - \mathbf{y}\|$$
  *(Prone to chaining phenomenon / elongated clusters)*
- **Complete Linkage**: Maximum distance between points:
  $$D(A, B) = \max_{\mathbf{x} \in A, \mathbf{y} \in B} \|\mathbf{x} - \mathbf{y}\|$$
  *(Produces compact, spherical clusters)*
- **Average Linkage**: Average distance across all pairs:
  $$D(A, B) = \frac{1}{|A||B|} \sum_{\mathbf{x} \in A} \sum_{\mathbf{y} \in B} \|\mathbf{x} - \mathbf{y}\|$$
- **Ward's Linkage**: Minimizes the variance increase when merging clusters.

---

## 4. Code Example with Scikit-Learn

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans, AgglomerativeClustering
from sklearn.metrics import silhouette_score
from scipy.cluster.hierarchy import dendrogram, linkage

# Sample generation
X = np.random.randn(300, 2)

# K-Means with K-Means++ initialization
kmeans = KMeans(n_clusters=3, init='k-means++', random_state=42)
cluster_labels = kmeans.fit_predict(X)

sil_score = silhouette_score(X, cluster_labels)
print(f"K-Means Silhouette Score: {sil_score:.3f}")

# Agglomerative Clustering
agg = AgglomerativeClustering(n_clusters=3, linkage='ward')
agg_labels = agg.fit_predict(X)
```

---

## 5. Original Repository Lab References
Explore our full hands-on clustering notebooks:
- **Notebook 1**: `Unsupervised/K-Mean Clustering.ipynb`
- **Notebook 2**: `Unsupervised/Hierarchial_Clustering.ipynb`
- **Reference Notes**: `K Means Clustering .pdf`

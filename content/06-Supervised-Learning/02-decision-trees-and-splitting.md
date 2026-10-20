---
title: "Decision Trees & Splitting Criteria: Gini vs Entropy"
subject: "06-Supervised-Learning"
difficulty: "Beginner"
tags: ["decision-trees", "cart", "id3", "gini-impurity", "information-gain", "pruning"]
prerequisites: ["06-Supervised-Learning"]
description: "How Decision Trees partition feature spaces: CART algorithm, Gini Impurity, Shannon Entropy, Information Gain, and cost-complexity pruning."
---

# Decision Trees & Splitting Criteria

Decision Trees recursively partition feature space into axis-aligned rectangular regions, assigning the majority class (classification) or mean value (regression) to leaf nodes.

---

## 1. Splitting Criteria for Classification

### Gini Impurity (CART Default)
Measures the probability of a randomly chosen element being incorrectly labeled if it were randomly labeled according to the class distribution in the node:

$$G(S) = 1 - \sum_{k=1}^K p_k^2$$

- For a pure node ($p_1 = 1, p_{k \ne 1} = 0$), $G = 1 - 1 = 0$.
- For an evenly balanced binary node ($p_1 = 0.5, p_2 = 0.5$), $G = 1 - (0.25 + 0.25) = 0.5$.

### Shannon Entropy & Information Gain (ID3 / C4.5)
Entropy measures the average level of uncertainty or surprise in node $S$:

$$H(S) = -\sum_{k=1}^K p_k \log_2(p_k)$$

The **Information Gain** from a candidate split on feature $A$ is:

$$\text{IG}(S, A) = H(S) - \sum_{v \in \text{Values}(A)} \frac{|S_v|}{|S|} H(S_v)$$

---

## 2. Cost-Complexity Pruning (Post-Pruning)

Unconstrained decision trees grow until every leaf is pure, resulting in massive overfitting ($100\%$ training accuracy, terrible test accuracy). Cost-complexity pruning minimizes:

$$R_\alpha(T) = R(T) + \alpha |T|$$

Where:
- $R(T)$ is the tree's empirical misclassification rate.
- $|T|$ is the number of terminal leaf nodes.
- $\alpha \ge 0$ is the complexity tuning parameter.

```python
from sklearn.tree import DecisionTreeClassifier

# Cost-complexity pruning path
clf = DecisionTreeClassifier(random_state=42)
path = clf.cost_complexity_pruning_path(X_train, y_train)
ccp_alphas = path.ccp_alphas

# Train optimal tree with chosen alpha
pruned_tree = DecisionTreeClassifier(random_state=42, ccp_alpha=0.015)
pruned_tree.fit(X_train, y_train)
```

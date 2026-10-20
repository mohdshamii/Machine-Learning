---
title: "Natural Language Processing: From Tokenization to Transformers"
subject: "13-NLP"
difficulty: "Advanced"
tags: ["nlp", "tokenization", "tf-idf", "word2vec", "transformers", "attention-mechanism", "bert", "gpt"]
prerequisites: ["11-Deep-Learning", "12-Neural-Networks"]
description: "The complete natural language processing journey: Byte-Pair Encoding (BPE), distributional semantics with Word2Vec, Scaled Dot-Product Attention, and Transformer architectures."
---

# Natural Language Processing: Foundations to Transformers

Natural Language Processing (NLP) converts human linguistic tokens into rich continuous vector spaces and models sequence dependencies.

---

## 1. Classical NLP: Tokenization & TF-IDF

### Term Frequency - Inverse Document Frequency (TF-IDF)
Measures the importance of a term $t$ in document $d$ relative to corpus $D$:

$$\text{TF}(t, d) = \frac{\text{count}(t, d)}{\sum_{t' \in d} \text{count}(t', d)}$$

$$\text{IDF}(t, D) = \log\left( \frac{1 + |D|}{1 + |\{d \in D : t \in d\}|} \right) + 1$$

$$\text{TF-IDF}(t, d, D) = \text{TF}(t, d) \times \text{IDF}(t, D)$$

Words appearing in nearly every document (e.g. "the", "is") receive an IDF near zero, while domain-specific keywords receive high weights.

---

## 2. Distributed Representations: Word2Vec

The distributional hypothesis states: *"You shall know a word by the company it keeps"* (Firth, 1957).

### Word2Vec Architectures (Mikolov et al., 2013)
- **CBOW (Continuous Bag of Words)**: Predicts the target word given surrounding context words. Fast to train, slightly better for frequent words.
- **Skip-Gram**: Predicts surrounding context words given the target word. Better for small datasets and rare words.

Vector arithmetic captures semantic analogies:
$$\text{vector}("King") - \text{vector}("Man") + \text{vector}("Woman") \approx \text{vector}("Queen")$$

---

## 3. The Transformer & Attention Mechanism (Vaswani et al., 2017)

Recurrent Neural Networks (RNNs/LSTMs) process tokens sequentially ($\mathcal{O}(n)$ time dependency), preventing parallelization across sequence length $n$ and suffering from catastrophic forgetting across long contexts. The **Transformer** replaces recurrence entirely with **Self-Attention**.

### Scaled Dot-Product Attention
Given Query $\mathbf{Q} \in \mathbb{R}^{n \times d_k}$, Key $\mathbf{K} \in \mathbb{R}^{m \times d_k}$, and Value $\mathbf{V} \in \mathbb{R}^{m \times d_v}$:

$$\text{Attention}(\mathbf{Q}, \mathbf{K}, \mathbf{V}) = \text{softmax}\left( \frac{\mathbf{Q}\mathbf{K}^T}{\sqrt{d_k}} \right) \mathbf{V}$$

- The dot product $\mathbf{Q}\mathbf{K}^T$ computes pairwise token similarity scores.
- Scaling factor $\frac{1}{\sqrt{d_k}}$ prevents dot products from growing excessively large in high dimensions, which would push softmax into regions with vanishing gradients.
- Softmax turns raw scores into probability distribution weights summing to 1.

### Multi-Head Attention
Instead of a single attention function, project Queries, Keys, and Values $h$ times with different learned parameter matrices:

$$\text{MultiHead}(\mathbf{Q}, \mathbf{K}, \mathbf{V}) = \text{Concat}(\text{head}_1, \dots, \text{head}_h) \mathbf{W}^O$$
$$\text{head}_i = \text{Attention}(\mathbf{Q}\mathbf{W}_i^Q, \mathbf{K}\mathbf{W}_i^K, \mathbf{V}\mathbf{W}_i^V)$$

---

## 4. Architectural Taxonomy

```text
Transformers
├── Encoder-Only (e.g., BERT, RoBERTa)
│   └── Bidirectional attention: ideal for classification, NER, extractive QA.
├── Decoder-Only (e.g., GPT-3/4, LLaMA, Mistral)
│   └── Causal (masked) attention: ideal for autoregressive text generation, chat, reasoning.
└── Encoder-Decoder (e.g., T5, BART)
    └── Cross-attention: ideal for translation, summarization.
```

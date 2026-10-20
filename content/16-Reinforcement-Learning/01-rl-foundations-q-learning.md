---
title: "Reinforcement Learning: MDPs, Bellman Equations & Q-Learning"
subject: "16-Reinforcement-Learning"
difficulty: "Advanced"
tags: ["reinforcement-learning", "mdp", "bellman-equation", "q-learning", "exploration-exploitation"]
prerequisites: ["01-Mathematics", "02-Statistics-and-Probability"]
description: "Foundational Reinforcement Learning: Markov Decision Processes (MDP), value functions, Bellman equations, and tabular Q-Learning."
---

# Reinforcement Learning: Foundations to Q-Learning

Reinforcement Learning (RL) studies how an autonomous agent learns to make sequential decisions by interacting with an environment to maximize cumulative scalar rewards.

---

## 1. The Markov Decision Process (MDP)

An MDP is defined by the 5-tuple $(\mathcal{S}, \mathcal{A}, \mathcal{P}, \mathcal{R}, \gamma)$:
- $\mathcal{S}$: Set of states.
- $\mathcal{A}$: Set of actions.
- $\mathcal{P}(s' \mid s, a)$: Transition probability function $P(S_{t+1} = s' \mid S_t = s, A_t = a)$.
- $\mathcal{R}(s, a, s')$: Reward function received when transitioning from $s$ to $s'$ via $a$.
- $\gamma \in [0, 1)$: Discount factor balancing immediate vs future rewards.

### The Markov Property
*"The future is independent of the past, given the present":*
$$P(S_{t+1} \mid S_t, A_t, S_{t-1}, A_{t-1}, \dots) = P(S_{t+1} \mid S_t, A_t)$$

---

## 2. The Bellman Optimality Equations

The action-value function $Q^*(s, a)$ represents the expected cumulative discounted return starting from state $s$, taking action $a$, and following the optimal policy thereafter:

$$Q^*(s, a) = \mathbb{E}\left[ R_{t+1} + \gamma \max_{a'} Q^*(S_{t+1}, a') \;\middle|\; S_t = s, A_t = a \right]$$

---

## 3. Tabular Q-Learning Algorithm

Q-Learning is a **model-free**, **off-policy** Temporal Difference (TD) control algorithm.

### Update Rule
$$Q(s, a) \leftarrow Q(s, a) + \alpha \left[ r + \gamma \max_{a'} Q(s', a') - Q(s, a) \right]$$

Where:
- $\alpha \in (0, 1]$ is the learning rate.
- $r + \gamma \max_{a'} Q(s', a')$ is the **TD Target**.
- $[r + \gamma \max_{a'} Q(s', a') - Q(s, a)]$ is the **TD Error**.

```python
import numpy as np

# Q-Table initialization
n_states = 10
n_actions = 4
Q = np.zeros((n_states, n_actions))

alpha = 0.1   # learning rate
gamma = 0.95  # discount factor
epsilon = 0.2 # exploration rate

def choose_action(state):
    # Epsilon-greedy exploration
    if np.random.uniform(0, 1) < epsilon:
        return np.random.choice(n_actions) # explore
    return np.argmax(Q[state, :])           # exploit

def update_q(state, action, reward, next_state):
    best_next_action = np.argmax(Q[next_state, :])
    td_target = reward + gamma * Q[next_state, best_next_action]
    td_error = td_target - Q[state, action]
    Q[state, action] += alpha * td_error
```

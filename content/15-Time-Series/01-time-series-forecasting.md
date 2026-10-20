---
title: "Time Series Analysis & Forecasting: ARIMA to Prophet"
subject: "15-Time-Series"
difficulty: "Intermediate"
tags: ["time-series", "forecasting", "arima", "seasonality", "stationarity", "acf-pacf"]
prerequisites: ["02-Statistics-and-Probability"]
description: "Statistical time series forecasting: stationarity testing (ADF), differencing, autocorrelation (ACF/PACF), ARIMA/SARIMA models, and Facebook Prophet."
---

# Time Series Analysis & Forecasting

Time series data violates the independent and identically distributed (i.i.d.) assumption of standard machine learning. Observations exhibit temporal autocorrelation where past states predict future states.

---

## 1. Stationarity & The Augmented Dickey-Fuller (ADF) Test

A time series $\{Y_t\}$ is **strictly stationary** if its joint distribution does not change over time. It is **weakly (covariance) stationary** if:
1. Mean $\mathbb{E}[Y_t] = \mu$ is constant over time.
2. Variance $\text{Var}(Y_t) = \sigma^2$ is constant over time.
3. Autocovariance $\text{Cov}(Y_t, Y_{t+k})$ depends only on the lag $k$, not on time $t$.

### Augmented Dickey-Fuller (ADF) Test
- $H_0$: The series possesses a unit root (non-stationary).
- $H_1$: The series has no unit root (stationary).
- If p-value $< 0.05 \implies$ Reject $H_0$, series is stationary!

```python
from statsmodels.tsa.stattools import adfuller

def check_stationarity(series):
    result = adfuller(series.dropna())
    print(f"ADF Statistic: {result[0]:.4f}")
    print(f"p-value: {result[1]:.4f}")
    if result[1] <= 0.05:
        print("=> Series is Stationary")
    else:
        print("=> Series is Non-Stationary (Needs differencing)")
```

---

## 2. Autoregressive Integrated Moving Average (ARIMA)

$\text{ARIMA}(p, d, q)$ consists of three components:
- **$p$ (Autoregression - AR)**: Number of lagged observations used:
  $$Y_t = c + \phi_1 Y_{t-1} + \dots + \phi_p Y_{t-p} + \epsilon_t$$
- **$d$ (Integrated - I)**: Number of differences needed to make the series stationary ($Y'_t = Y_t - Y_{t-1}$).
- **$q$ (Moving Average - MA)**: Number of lagged forecast error terms:
  $$Y_t = \mu + \epsilon_t + \theta_1 \epsilon_{t-1} + \dots + \theta_q \epsilon_{t-q}$$

### Identifying Orders with ACF and PACF
- **Autocorrelation Function (ACF)**: Total correlation between $Y_t$ and $Y_{t-k}$. Cuts off at lag $q$ for MA($q$) processes.
- **Partial Autocorrelation Function (PACF)**: Direct correlation between $Y_t$ and $Y_{t-k}$ removing intermediate effects. Cuts off at lag $p$ for AR($p$) processes.

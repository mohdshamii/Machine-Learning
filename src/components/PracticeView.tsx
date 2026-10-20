// src/components/PracticeView.tsx
import React, { useState } from 'react';
import { QuickRevisionCard, MCQQuestion } from '../types';
import { Sparkles, RotateCw, CheckCircle2, XCircle, ArrowRight, ArrowLeft, Brain, HelpCircle, Layers } from 'lucide-react';
import katex from 'katex';

const FLASHCARDS: QuickRevisionCard[] = [
  {
    id: 'f1',
    title: 'Normal Equation vs Gradient Descent',
    subject: 'Supervised Learning',
    formula: '\\theta^* = (X^T X)^{-1} X^T y',
    summary: 'The Normal Equation calculates optimal weights analytically in one step without iterations or learning rate tuning. Gradient Descent iteratively approaches the minimum.',
    pitfall: 'Normal Equation is O(d³) due to matrix inversion. When features d > 10,000, gradient descent is vastly more computationally efficient.',
    codeSnippet: 'theta = np.linalg.inv(X.T @ X) @ X.T @ y'
  },
  {
    id: 'f2',
    title: 'L1 (Lasso) vs L2 (Ridge) Regularization',
    subject: 'Feature Engineering',
    formula: 'J_{L1} = J + \\lambda \\sum |\\theta_j|, \\quad J_{L2} = J + \\lambda \\sum \\theta_j^2',
    summary: 'L1 drives coefficients to exact zero (sparse feature selection). L2 shrinks coefficients toward zero but retains all features.',
    pitfall: 'L1 has non-differentiable sharp corners at zero requiring sub-gradient optimization. L2 is smooth and rotationally invariant.',
    codeSnippet: 'from sklearn.linear_model import Lasso, Ridge'
  },
  {
    id: 'f3',
    title: 'Scaled Dot-Product Attention',
    subject: 'NLP & Transformers',
    formula: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V',
    summary: 'Computes affinity weights between all query-key token pairs and outputs weighted combinations of value vectors.',
    pitfall: 'Without the 1/sqrt(d_k) scaling factor, high-dimensional dot products grow excessively large, causing softmax gradients to vanish.',
    codeSnippet: 'weights = torch.softmax((Q @ K.transpose(-2, -1)) / math.sqrt(d_k), dim=-1)'
  },
  {
    id: 'f4',
    title: 'K-Means Lloyd\'s Algorithm & WCSS',
    subject: 'Unsupervised Learning',
    formula: 'J = \\sum_{i=1}^m ||x^{(i)} - \\mu_{c^{(i)}}||^2',
    summary: 'Alternates between assigning points to the nearest centroid and recomputing centroids as cluster means.',
    pitfall: 'Standard K-Means is sensitive to initial centroid placement and non-convex shapes. Always use K-Means++ initialization.',
    codeSnippet: 'kmeans = KMeans(n_clusters=3, init="k-means++")'
  },
  {
    id: 'f5',
    title: 'Bellman Optimality Equation',
    subject: 'Reinforcement Learning',
    formula: 'Q^*(s, a) = \\mathbb{E}[R + \\gamma \\max_{a\'} Q^*(s\', a\')]',
    summary: 'Expresses the optimal value of a state-action pair as the expected immediate reward plus the discounted maximum future value.',
    pitfall: 'Setting discount factor gamma >= 1 in continuing tasks causes expected returns to diverge to infinity.',
    codeSnippet: 'td_target = reward + gamma * np.max(Q[next_state])'
  }
];

const MCQ_BANK: MCQQuestion[] = [
  {
    id: 'q1',
    question: 'Why does applying StandardScaler across the ENTIRE dataset before train/test splitting cause Data Leakage?',
    options: [
      'It increases computational complexity unnecessarily.',
      'The mean and standard deviation of the test set leak into the training features.',
      'It causes negative values that break neural network activations.',
      'It changes the intrinsic rank of the decision trees.'
    ],
    correctIndex: 1,
    explanation: 'StandardScaler computes mean and standard deviation. Computing these statistics over the full dataset allows test distribution information to influence training weights, producing overly optimistic validation scores.',
    topic: 'Data Preprocessing'
  },
  {
    id: 'q2',
    question: 'In Random Forests, why are features randomly subsampled at each individual split?',
    options: [
      'To speed up training by evaluating fewer candidates.',
      'To de-correlate individual decision trees and reduce ensemble variance.',
      'To prevent decision trees from having unequal depths.',
      'To eliminate the need for bootstrap sampling.'
    ],
    correctIndex: 1,
    explanation: 'If a few features are dominant predictors, standard bagged trees will all split on the same top feature, making them highly correlated. Subsampling features forces trees to explore alternative signals, de-correlating the ensemble and reducing variance.',
    topic: 'Ensemble Learning'
  },
  {
    id: 'q3',
    question: 'For a dataset with 99.5% legitimate transactions and 0.5% fraud, which metric should be prioritized?',
    options: [
      'Raw Classification Accuracy',
      'Precision-Recall AUC (PR-AUC) and Recall',
      'Mean Squared Error (MSE)',
      'Adjusted R-Squared'
    ],
    correctIndex: 1,
    explanation: 'A baseline model predicting "Legitimate" for all transactions scores 99.5% accuracy while detecting 0 fraud. PR-AUC and Recall (Sensitivity) assess the model\'s ability to identify the rare positive cases.',
    topic: 'Model Evaluation'
  },
  {
    id: 'q4',
    question: 'Which of the following activation functions suffers most severely from the vanishing gradient problem in deep networks?',
    options: [
      'GELU',
      'LeakyReLU',
      'Sigmoid',
      'ReLU'
    ],
    correctIndex: 2,
    explanation: 'The maximum derivative of the Sigmoid function is 0.25 (at z=0). As error signals multiply through layers during backpropagation, gradients shrink exponentially by at least (0.25)^L.',
    topic: 'Neural Networks'
  }
];

export const PracticeView: React.FC<{ onNavigateToLesson?: (id: string) => void }> = () => {
  const [activeTab, setActiveTab] = useState<'flashcards' | 'mcq' | 'pitfalls'>('flashcards');

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // MCQ state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  const card = FLASHCARDS[currentCardIndex];

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % FLASHCARDS.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + FLASHCARDS.length) % FLASHCARDS.length);
  };

  const renderFormulaHtml = (latex: string) => {
    try {
      return katex.renderToString(latex, { displayMode: true, throwOnError: false });
    } catch {
      return latex;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
          <Sparkles size={13} />
          Interactive Learning & Revision
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Quick Revision, Flashcards & Practice
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Test your comprehension of core machine learning concepts, review key formulas, and audit common production pitfalls.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto justify-start sm:justify-center -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'flashcards'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Brain size={15} />
            <span>Flashcards ({FLASHCARDS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('mcq')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'mcq'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <HelpCircle size={15} />
            <span>Practice MCQs ({MCQ_BANK.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pitfalls')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'pitfalls'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers size={15} />
            <span>Top 5 Pitfalls</span>
          </button>
        </div>
      </div>

      {/* 1. Flashcard Deck */}
      {activeTab === 'flashcards' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Card {currentCardIndex + 1} of {FLASHCARDS.length}</span>
            <span>Subject: {card.subject}</span>
          </div>

          {/* Flashcard Box */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer min-h-[320px] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400 font-mono">
                  {isFlipped ? 'Answer & Derivation' : 'Concept / Question'}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <RotateCw size={12} /> Click card to flip
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {card.title}
              </h2>

              {card.formula && (
                <div
                  className="katex-block"
                  dangerouslySetInnerHTML={{ __html: renderFormulaHtml(card.formula) }}
                />
              )}

              {isFlipped ? (
                <div className="space-y-3 pt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <p>{card.summary}</p>
                  <div className="p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200">
                    <strong className="font-semibold">⚠️ Watch Out:</strong> {card.pitfall}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Can you formulate the equation, understand the assumptions, and identify the primary limitations? Flip the card to test your recall.
                </p>
              )}
            </div>

            <div className="pt-4 text-center text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800">
              {isFlipped ? 'Click to return to question' : 'Click to reveal answer'}
            </div>
          </div>

          {/* Flashcard Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePrevCard}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs transition-colors"
            >
              <ArrowLeft size={14} /> Previous
            </button>
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Flip Card
            </button>
            <button
              onClick={handleNextCard}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs transition-colors"
            >
              Next <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* 2. Interactive MCQs */}
      {activeTab === 'mcq' && (
        <div className="space-y-6">
          {MCQ_BANK.map((item, qIdx) => {
            const hasSelected = selectedAnswers[item.id] !== undefined;
            const selectedOpt = selectedAnswers[item.id];
            const isCorrect = selectedOpt === item.correctIndex;

            return (
              <div
                key={item.id}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>Question {qIdx + 1}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">{item.topic}</span>
                </div>

                <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-snug">
                  {item.question}
                </h3>

                <div className="space-y-2">
                  {item.options.map((opt, optIdx) => {
                    let btnStyle = 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300';
                    if (hasSelected) {
                      if (optIdx === item.correctIndex) {
                        btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium';
                      } else if (optIdx === selectedOpt) {
                        btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={hasSelected}
                        onClick={() => {
                          setSelectedAnswers((prev) => ({ ...prev, [item.id]: optIdx }));
                          setShowExplanation((prev) => ({ ...prev, [item.id]: true }));
                        }}
                        className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between transition-colors ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {hasSelected && optIdx === item.correctIndex && (
                          <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                        )}
                        {hasSelected && optIdx === selectedOpt && optIdx !== item.correctIndex && (
                          <XCircle size={16} className="text-rose-500 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {showExplanation[item.id] && (
                  <div className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed border ${
                    isCorrect
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    <strong className="font-semibold block mb-1">
                      {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
                    </strong>
                    {item.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Top Pitfalls Checklist */}
      {activeTab === 'pitfalls' && (
        <div className="space-y-4">
          {[
            {
              title: '1. Data Leakage via Global Preprocessing',
              desc: 'Fitting scalers, imputers, or target encoders on the entire dataset before splitting. Always fit transformers strictly on the train split only.'
            },
            {
              title: '2. Accuracy Paradox on Skewed Datasets',
              desc: 'Reporting 99% accuracy on a 99:1 imbalanced dataset where the model simply guesses the majority class. Use PR-AUC, F1, or Precision/Recall.'
            },
            {
              title: '3. Scaling Features for Tree Ensembles',
              desc: 'Decision Trees, Random Forests, and XGBoost split on feature rank/ordering, not distance. Scaling features on trees consumes compute without altering splits.'
            },
            {
              title: '4. Ignoring Multicollinearity in Linear Models',
              desc: 'Correlated features inflate coefficient variances and make feature importances unstable. Check Variance Inflation Factor (VIF) or use Ridge regularization.'
            },
            {
              title: '5. Over-Optimizing on the Test Set',
              desc: 'Iteratively adjusting hyperparameters until test set score peaks. Use a 3-way split (Train / Validation / Test) or Nested Cross-Validation.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-1"
            >
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                {item.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// All Metrics page content lives in this file. See "Add a metric" in README.md.

export interface Metric {
  /** Used for the #link on the Metrics page. */
  id: string;
  name: string;
  formula: string;
  meaning: string;
  range: string;
  useWhen: string;
  watchOut: string;
  /** Slug of a concept with full notes on this metric. A typo here fails the build. */
  concept?: string;
}

export interface MetricGroup {
  title: string;
  metrics: Metric[];
}

/** "Which metric should I use?" Each pick points to a metric id below. */
export const QUICK_PICKS = [
  { situation: "Classes are balanced and every error costs the same", pick: "accuracy" },
  { situation: "Missing a positive is costly (disease, fraud)", pick: "recall" },
  { situation: "A false alarm is costly (spam filter)", pick: "precision" },
  { situation: "Imbalanced data, and you need one number", pick: "f1" },
  { situation: "Compare how well models rank, before picking a threshold", pick: "roc-auc" },
  { situation: "Imbalanced data, and the positive class matters most", pick: "pr-auc" },
  { situation: "The predicted probabilities themselves matter", pick: "log-loss" },
  { situation: "Regression error that is easy to explain", pick: "mae" },
  { situation: "Regression where big errors are especially bad", pick: "rmse" },
  { situation: "How much better the model is than predicting the average", pick: "r2" },
];

export const METRIC_GROUPS: MetricGroup[] = [
  {
    title: "Classification",
    metrics: [
      {
        id: "accuracy",
        name: "Accuracy",
        formula: "(TP + TN) / (TP + TN + FP + FN)",
        meaning: "The share of all predictions that are correct.",
        range: "0 to 1. Higher is better.",
        useWhen: "Classes are roughly balanced and both kinds of error cost about the same.",
        watchOut:
          "Misleading on imbalanced data. With 1% fraud, always predicting \"not fraud\" scores 99%.",
        concept: "confusion-matrix",
      },
      {
        id: "precision",
        name: "Precision",
        formula: "TP / (TP + FP)",
        meaning: "Of everything predicted positive, the share that is actually positive.",
        range: "0 to 1. Higher is better.",
        useWhen: "False positives are costly, such as a spam filter hiding a real email.",
        watchOut: "It ignores missed positives. A model that flags only one sure case can get precision 1.0.",
        concept: "precision-vs-recall",
      },
      {
        id: "recall",
        name: "Recall (Sensitivity)",
        formula: "TP / (TP + FN)",
        meaning: "Of all actual positives, the share the model found. Also called the true positive rate.",
        range: "0 to 1. Higher is better.",
        useWhen: "Missing a positive is costly, such as disease screening or fraud detection.",
        watchOut: "Predicting everything as positive gives recall 1.0, so always read it with precision.",
        concept: "precision-vs-recall",
      },
      {
        id: "specificity",
        name: "Specificity",
        formula: "TN / (TN + FP)",
        meaning: "Of all actual negatives, the share correctly cleared. Also called the true negative rate.",
        range: "0 to 1. Higher is better.",
        useWhen: "Correctly clearing negatives matters, as in medical tests reported with sensitivity and specificity.",
        watchOut: "1 − specificity is the false positive rate, which is the x-axis of the ROC curve.",
        concept: "confusion-matrix",
      },
      {
        id: "f1",
        name: "F1 Score",
        formula: "2 × Precision × Recall / (Precision + Recall)",
        meaning: "The harmonic mean of precision and recall. It is high only when both are high.",
        range: "0 to 1. Higher is better.",
        useWhen: "The data is imbalanced and you need one number that balances precision and recall.",
        watchOut: "It weights precision and recall equally. If one matters more, use F-beta or that metric directly.",
        concept: "f1-score",
      },
      {
        id: "roc-auc",
        name: "ROC-AUC",
        formula: "Area under the curve of true positive rate vs false positive rate, across all thresholds",
        meaning: "The chance that a random positive gets a higher score than a random negative.",
        range: "0.5 is random guessing, 1 is perfect. Higher is better.",
        useWhen: "Comparing how well models rank cases, before choosing a threshold.",
        watchOut: "It can look too good on heavily imbalanced data. Check PR-AUC as well.",
        concept: "roc-auc",
      },
      {
        id: "pr-auc",
        name: "PR-AUC",
        formula: "Area under the curve of precision vs recall, across all thresholds",
        meaning: "How well the model finds positives without raising false alarms, over every threshold.",
        range: "0 to 1. Random guessing scores the share of positives in the data. Higher is better.",
        useWhen: "The data is imbalanced and the positive class is what you care about.",
        watchOut: "The random baseline changes with the class ratio, so only compare scores on the same data.",
        concept: "imbalanced-data",
      },
      {
        id: "log-loss",
        name: "Log Loss (Cross-Entropy)",
        formula: "−average of [ y × log(p) + (1 − y) × log(1 − p) ]",
        meaning: "How good the predicted probabilities are. Confident wrong predictions are punished heavily.",
        range: "0 and up. 0 is perfect. Lower is better.",
        useWhen: "The probabilities themselves matter, such as risk scores.",
        watchOut: "A single confident wrong prediction can push the score up a lot.",
        concept: "loss-functions",
      },
    ],
  },
  {
    title: "Regression",
    metrics: [
      {
        id: "mae",
        name: "MAE (Mean Absolute Error)",
        formula: "average of | actual − predicted |",
        meaning: "The typical size of an error, in the same units as the target.",
        range: "0 and up. 0 is perfect. Lower is better.",
        useWhen: "You want an error that is easy to explain, and outliers should not dominate it.",
        watchOut: "Every error counts in proportion to its size, so a few big misses do not stand out.",
        concept: "regression-metrics",
      },
      {
        id: "mse",
        name: "MSE (Mean Squared Error)",
        formula: "average of ( actual − predicted )²",
        meaning: "The average squared error. Squaring makes big errors count much more.",
        range: "0 and up. 0 is perfect. Lower is better.",
        useWhen: "As a training loss for regression.",
        watchOut: "The units are squared, such as rupees squared, so it is hard to explain to people.",
        concept: "regression-metrics",
      },
      {
        id: "rmse",
        name: "RMSE (Root Mean Squared Error)",
        formula: "√MSE",
        meaning: "MSE brought back to the target's units. It still punishes big errors more than MAE.",
        range: "0 and up. 0 is perfect. Lower is better.",
        useWhen: "Big errors are especially bad and you want a number in the target's units.",
        watchOut: "RMSE is always at least MAE. A big gap between them means a few large errors.",
        concept: "regression-metrics",
      },
      {
        id: "r2",
        name: "R² (R-squared)",
        formula: "1 − (sum of squared errors / sum of squared differences from the mean)",
        meaning: "The share of the target's variation the model explains, compared with always predicting the average.",
        range: "1 is perfect, 0 is no better than the average. It can be negative on test data.",
        useWhen: "You want a quick sense of fit compared with a simple baseline.",
        watchOut: "In linear regression, adding any feature never lowers training R², even a useless one.",
        concept: "regression-metrics",
      },
      {
        id: "adjusted-r2",
        name: "Adjusted R²",
        formula: "1 − (1 − R²) × (n − 1) / (n − k − 1)",
        meaning: "R² with a penalty for each extra feature, where n is the number of rows and k the number of features. It only rises if a feature helps enough.",
        range: "At most 1. Higher is better.",
        useWhen: "Comparing linear models that use different numbers of features.",
        watchOut: "It is still measured on training data. Check performance on test data too.",
      },
      {
        id: "mape",
        name: "MAPE (Mean Absolute Percentage Error)",
        formula: "average of | actual − predicted | / | actual | × 100%",
        meaning: "The average error as a percentage of the actual value.",
        range: "0% and up. 0% is perfect. Lower is better.",
        useWhen: "Explaining errors to business teams, such as \"off by 8% on average\".",
        watchOut:
          "It breaks when actual values are zero or near zero. Under-predictions can never cost more than 100%, while over-predictions have no limit.",
      },
    ],
  },
];

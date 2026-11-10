// All Metrics page content lives in this file. See "Add a metric" in README.md.
// Every worked example below was checked against scikit-learn.

export interface Metric {
  /** Used for the #link on the Metrics page. */
  id: string;
  name: string;
  formula: string;
  meaning: string;
  /** The formula explained step by step in plain words. */
  howTo: string;
  /** The formula applied to the group's example data. */
  example: { calc: string; note: string };
  range: string;
  useWhen: string;
  watchOut: string;
  /** One line of Python using scikit-learn. */
  code: string;
  codeNote?: string;
  /** Slug of a concept with full notes on this metric. A typo here fails the build. */
  concept?: string;
}

export interface MetricGroup {
  title: string;
  /** The shared data the worked examples use. */
  exampleIntro: string;
  exampleTable: { head: string[]; rows: string[][] };
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
    exampleIntro:
      "The examples use the disease test from Confusion Matrix: 100 people, of whom 10 are sick. ROC-AUC, PR-AUC and Log Loss need predicted scores, so they use small examples of their own.",
    exampleTable: {
      head: ["", "Predicted sick", "Predicted healthy"],
      rows: [
        ["Actually sick", "TP = 8", "FN = 2"],
        ["Actually healthy", "FP = 5", "TN = 85"],
      ],
    },
    metrics: [
      {
        id: "accuracy",
        name: "Accuracy",
        formula: "(TP + TN) / (TP + TN + FP + FN)",
        meaning: "The share of all predictions that are correct.",
        howTo: "Add up the correct predictions (TP + TN), then divide by the total number of predictions.",
        example: {
          calc: "(8 + 85) / 100 = 0.93",
          note: "93% looks great, yet 2 of the 10 sick people were missed.",
        },
        range: "0 to 1. Higher is better.",
        useWhen: "Classes are roughly balanced and both kinds of error cost about the same.",
        watchOut:
          "Misleading on imbalanced data. With 1% fraud, always predicting \"not fraud\" scores 99%.",
        code: "accuracy_score(y_true, y_pred)",
        concept: "confusion-matrix",
      },
      {
        id: "precision",
        name: "Precision",
        formula: "TP / (TP + FP)",
        meaning: "Of everything predicted positive, the share that is actually positive.",
        howTo: "Take the true positives and divide by everything the model called positive (TP + FP).",
        example: {
          calc: "8 / (8 + 5) = 8 / 13 ≈ 0.62",
          note: "Of the 13 people flagged as sick, about 62% really are.",
        },
        range: "0 to 1. Higher is better.",
        useWhen: "False positives are costly, such as a spam filter hiding a real email.",
        watchOut: "It ignores missed positives. A model that flags only one sure case can get precision 1.0.",
        code: "precision_score(y_true, y_pred)",
        concept: "precision-vs-recall",
      },
      {
        id: "recall",
        name: "Recall (Sensitivity)",
        formula: "TP / (TP + FN)",
        meaning: "Of all actual positives, the share the model found. Also called the true positive rate.",
        howTo: "Take the true positives and divide by everyone who is actually positive (TP + FN).",
        example: {
          calc: "8 / (8 + 2) = 8 / 10 = 0.80",
          note: "The test finds 80% of the sick people.",
        },
        range: "0 to 1. Higher is better.",
        useWhen: "Missing a positive is costly, such as disease screening or fraud detection.",
        watchOut: "Predicting everything as positive gives recall 1.0, so always read it with precision.",
        code: "recall_score(y_true, y_pred)",
        concept: "precision-vs-recall",
      },
      {
        id: "specificity",
        name: "Specificity",
        formula: "TN / (TN + FP)",
        meaning: "Of all actual negatives, the share correctly cleared. Also called the true negative rate.",
        howTo: "Take the true negatives and divide by everyone who is actually negative (TN + FP).",
        example: {
          calc: "85 / (85 + 5) = 85 / 90 ≈ 0.94",
          note: "94% of healthy people are correctly cleared.",
        },
        range: "0 to 1. Higher is better.",
        useWhen: "Correctly clearing negatives matters, as in medical tests reported with sensitivity and specificity.",
        watchOut: "1 − specificity is the false positive rate, which is the x-axis of the ROC curve.",
        code: "recall_score(y_true, y_pred, pos_label=0)",
        codeNote: "There is no specificity function. This is recall of the negative class, which is the same thing.",
        concept: "confusion-matrix",
      },
      {
        id: "f1",
        name: "F1 Score",
        formula: "2 × Precision × Recall / (Precision + Recall)",
        meaning: "The harmonic mean of precision and recall. It is high only when both are high.",
        howTo:
          "Multiply precision by recall, double it, then divide by their sum. The same thing straight from counts: 2TP / (2TP + FP + FN).",
        example: {
          calc: "2 × 0.62 × 0.80 / (0.62 + 0.80) ≈ 0.70",
          note: "Check with counts: 16 / (16 + 5 + 2) = 16 / 23 ≈ 0.70.",
        },
        range: "0 to 1. Higher is better.",
        useWhen: "The data is imbalanced and you need one number that balances precision and recall.",
        watchOut: "It weights precision and recall equally. If one matters more, use F-beta or that metric directly.",
        code: "f1_score(y_true, y_pred)",
        concept: "f1-score",
      },
      {
        id: "roc-auc",
        name: "ROC-AUC",
        formula: "correctly ranked pairs / all (positive, negative) pairs",
        meaning:
          "The area under the curve of true positive rate vs false positive rate. It equals the chance that a random positive gets a higher score than a random negative.",
        howTo:
          "Pair every positive with every negative. Count the pairs where the positive got the higher score (a tie counts as half), then divide by the number of pairs.",
        example: {
          calc: "Positives: 0.9, 0.7, 0.4. Negatives: 0.6, 0.2.\n5 of 6 pairs correct → 5 / 6 ≈ 0.83",
          note: "The only wrong pair is the positive at 0.4 against the negative at 0.6.",
        },
        range: "0.5 is random guessing, 1 is perfect. Higher is better.",
        useWhen: "Comparing how well models rank cases, before choosing a threshold.",
        watchOut: "It can look too good on heavily imbalanced data. Check PR-AUC as well.",
        code: "roc_auc_score(y_true, y_score)",
        codeNote: "y_score is the predicted probability, not the 0/1 prediction.",
        concept: "roc-auc",
      },
      {
        id: "pr-auc",
        name: "PR-AUC (Average Precision)",
        formula: "average of the precision at each positive, sorted by score",
        meaning: "The area under the curve of precision vs recall, across all thresholds.",
        howTo:
          "Sort the cases by score, highest first. Each time you reach a positive, note the precision so far. Average those precisions. This is average precision, the usual way to compute PR-AUC.",
        example: {
          calc: "Sorted: 0.9 P, 0.7 P, 0.6 N, 0.4 P, 0.2 N\n(1/1 + 2/2 + 3/4) / 3 ≈ 0.92",
          note: "Random guessing would score 3/5 = 0.6, the share of positives.",
        },
        range: "0 to 1. Random guessing scores the share of positives in the data. Higher is better.",
        useWhen: "The data is imbalanced and the positive class is what you care about.",
        watchOut: "The random baseline changes with the class ratio, so only compare scores on the same data.",
        code: "average_precision_score(y_true, y_score)",
        concept: "imbalanced-data",
      },
      {
        id: "log-loss",
        name: "Log Loss (Cross-Entropy)",
        formula: "−average of [ y × ln(p) + (1 − y) × ln(1 − p) ]",
        meaning: "How good the predicted probabilities are. Confident wrong predictions are punished heavily.",
        howTo:
          "For each case, take the probability the model gave to the correct answer: p if the actual is 1, or 1 − p if it is 0. Take −ln of it, then average over all cases.",
        example: {
          calc: "Actual 1, p = 0.9 → −ln(0.9) ≈ 0.11\nActual 0, p = 0.2 → −ln(0.8) ≈ 0.22\nAverage ≈ 0.16",
          note: "One confident miss, actual 1 with p = 0.01, costs −ln(0.01) ≈ 4.6 on its own.",
        },
        range: "0 and up. 0 is perfect. Lower is better.",
        useWhen: "The probabilities themselves matter, such as risk scores.",
        watchOut: "A single confident wrong prediction can push the score up a lot.",
        code: "log_loss(y_true, y_prob)",
        codeNote: "y_prob is the predicted probability of class 1.",
        concept: "loss-functions",
      },
    ],
  },
  {
    title: "Regression",
    exampleIntro:
      "The examples use three house prices, in ₹\u00a0lakh. Error = actual − predicted.",
    exampleTable: {
      head: ["", "House 1", "House 2", "House 3"],
      rows: [
        ["Actual", "40", "50", "60"],
        ["Predicted", "42", "48", "68"],
        ["Error", "−2", "+2", "−8"],
      ],
    },
    metrics: [
      {
        id: "mae",
        name: "MAE (Mean Absolute Error)",
        formula: "average of | actual − predicted |",
        meaning: "The typical size of an error, in the same units as the target.",
        howTo: "Find each error, drop its sign, then take the average.",
        example: {
          calc: "(2 + 2 + 8) / 3 = 4",
          note: "On average, the prediction is off by ₹4 lakh.",
        },
        range: "0 and up. 0 is perfect. Lower is better.",
        useWhen: "You want an error that is easy to explain, and outliers should not dominate it.",
        watchOut: "Every error counts in proportion to its size, so a few big misses do not stand out.",
        code: "mean_absolute_error(y_true, y_pred)",
        concept: "regression-metrics",
      },
      {
        id: "mse",
        name: "MSE (Mean Squared Error)",
        formula: "average of ( actual − predicted )²",
        meaning: "The average squared error. Squaring makes big errors count much more.",
        howTo: "Square each error, then take the average.",
        example: {
          calc: "(2² + 2² + 8²) / 3 = (4 + 4 + 64) / 3 = 24",
          note: "The one ₹8 lakh miss makes up 64 of the 72 total.",
        },
        range: "0 and up. 0 is perfect. Lower is better.",
        useWhen: "As a training loss for regression.",
        watchOut: "The units are squared, such as lakh squared, so it is hard to explain to people.",
        code: "mean_squared_error(y_true, y_pred)",
        concept: "regression-metrics",
      },
      {
        id: "rmse",
        name: "RMSE (Root Mean Squared Error)",
        formula: "√MSE",
        meaning: "MSE brought back to the target's units. It still punishes big errors more than MAE.",
        howTo: "Calculate MSE, then take its square root.",
        example: {
          calc: "√24 ≈ 4.9",
          note: "Higher than the MAE of 4, because the big ₹8 lakh miss counts more.",
        },
        range: "0 and up. 0 is perfect. Lower is better.",
        useWhen: "Big errors are especially bad and you want a number in the target's units.",
        watchOut: "RMSE is always at least MAE. A big gap between them means a few large errors.",
        code: "root_mean_squared_error(y_true, y_pred)",
        codeNote: "Needs scikit-learn 1.4 or newer.",
        concept: "regression-metrics",
      },
      {
        id: "r2",
        name: "R² (R-squared)",
        formula: "1 − SSE / SST",
        meaning: "The share of the target's variation the model explains, compared with always predicting the average.",
        howTo:
          "SSE is the sum of the squared errors. SST is the sum of the squared distances of each actual value from the average. Divide SSE by SST and subtract from 1.",
        example: {
          calc: "Average = 50\nSSE = 4 + 4 + 64 = 72\nSST = 100 + 0 + 100 = 200\nR² = 1 − 72 / 200 = 0.64",
          note: "The model explains 64% of the variation in price.",
        },
        range: "1 is perfect, 0 is no better than the average. It can be negative on test data.",
        useWhen: "You want a quick sense of fit compared with a simple baseline.",
        watchOut: "In linear regression, adding any feature never lowers training R², even a useless one.",
        code: "r2_score(y_true, y_pred)",
        concept: "regression-metrics",
      },
      {
        id: "adjusted-r2",
        name: "Adjusted R²",
        formula: "1 − (1 − R²) × (n − 1) / (n − k − 1)",
        meaning: "R² with a penalty for each extra feature. It only rises if a feature helps enough.",
        howTo:
          "n is the number of rows and k the number of features. Take the unexplained part (1 − R²), scale it up by (n − 1) / (n − k − 1), and subtract from 1.",
        example: {
          calc: "R² = 0.64, n = 100, k = 5\n1 − 0.36 × 99 / 94 ≈ 0.62",
          note: "Slightly lower than R², the cost of using 5 features.",
        },
        range: "At most 1. Higher is better.",
        useWhen: "Comparing linear models that use different numbers of features.",
        watchOut: "It is still measured on training data. Check performance on test data too.",
        code: "1 - (1 - r2) * (n - 1) / (n - k - 1)",
        codeNote: "There is no built-in function, so calculate it from r2_score.",
      },
      {
        id: "mape",
        name: "MAPE (Mean Absolute Percentage Error)",
        formula: "average of | actual − predicted | / | actual | × 100%",
        meaning: "The average error as a percentage of the actual value.",
        howTo: "Divide each absolute error by its actual value, take the average, then multiply by 100.",
        example: {
          calc: "(2/40 + 2/50 + 8/60) / 3 × 100\n= (5% + 4% + 13.3%) / 3 ≈ 7.4%",
          note: "Predictions are off by about 7.4% on average.",
        },
        range: "0% and up. 0% is perfect. Lower is better.",
        useWhen: "Explaining errors to business teams, such as \"off by 7% on average\".",
        watchOut:
          "It breaks when actual values are zero or near zero. Under-predictions can never cost more than 100%, while over-predictions have no limit.",
        code: "mean_absolute_percentage_error(y_true, y_pred) * 100",
        codeNote: "scikit-learn returns a fraction, so multiply by 100 for a percentage.",
      },
    ],
  },
];

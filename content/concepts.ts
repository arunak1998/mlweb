// All site content lives in this file. See "Add a new concept" in README.md.
// The order of the CONCEPTS array sets the order in the tree and the Prev/Next buttons.

export const CATEGORIES = [
  "Foundations",
  "Evaluation",
  "Data",
  "Optimization",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type DiagramId =
  | "bias-variance"
  | "k-fold"
  | "gradient-descent"
  | "split"
  | "fit"
  | "confusion-matrix"
  | "roc"
  | "learning-rate";

export interface Concept {
  slug: string;
  name: string;
  category: Category;
  /** Slug of the concept this one branches from in the tree. Must be in the same category. */
  parent?: string;
  /** One line: the answer to "What is X?" in an interview. */
  definition: string;
  /** 3–4 short sentences, no unexplained jargon. */
  explanation: string;
  example: string;
  /** A likely follow-up question with a 2–3 sentence answer. */
  question: { q: string; a: string };
  mistake: string;
  /** Shown under the definition. */
  keyPoint: string;
  /** Slugs of related concepts. A typo here fails the build. */
  related: string[];
  diagram?: DiagramId;
}

export const CONCEPTS: Concept[] = [
  // ─── Foundations ───────────────────────────────────────────
  {
    slug: "supervised-vs-unsupervised",
    name: "Supervised vs Unsupervised Learning",
    category: "Foundations",
    definition:
      "Supervised learning learns from labelled data, meaning inputs with known answers, while unsupervised learning finds patterns in data without labels.",
    explanation:
      "In supervised learning, every training example comes with the correct answer, called a label. The model learns to predict that label for new data. In unsupervised learning there are no labels, so the model looks for structure on its own, such as groups of similar items. Classification and regression are supervised, while clustering is unsupervised.",
    example:
      "Predicting spam from emails already marked \"spam\" or \"not spam\" is supervised. Grouping customers by shopping behaviour, with no groups defined in advance, is unsupervised.",
    question: {
      q: "Is customer segmentation supervised or unsupervised?",
      a: "Usually unsupervised, because there are no predefined segment labels, so we use clustering such as K-Means to discover groups. If the segments are already labelled and we predict the segment of a new customer, it becomes supervised classification.",
    },
    mistake:
      "Thinking unsupervised means no human work. You still choose the features and the algorithm, and you must judge whether the groups make sense.",
    keyPoint: "Labels present = supervised. No labels = unsupervised.",
    related: ["train-validation-test-split", "overfitting-vs-underfitting", "loss-functions"],
  },
  {
    slug: "train-validation-test-split",
    name: "Train/Validation/Test Split",
    category: "Foundations",
    parent: "supervised-vs-unsupervised",
    definition:
      "Dividing data into three parts: train to fit the model, validation to tune it, and test to check final performance on unseen data.",
    explanation:
      "The training set is what the model learns from. The validation set helps us compare models and choose hyperparameters. The test set is kept aside and used only at the very end. This gives an honest estimate of how the model will do on new data.",
    example:
      "Think of exam preparation: textbook exercises are the training set, mock tests are the validation set, and the final exam is the test set. A common starting split is 70/15/15.",
    question: {
      q: "Why do we need a validation set if we already have a test set?",
      a: "If we tune the model using the test set, we indirectly fit to it, and its score becomes too optimistic. The validation set takes all the tuning decisions, so the test set stays unseen for one honest final check.",
    },
    mistake:
      "Checking the test score again and again while tuning. Once the test set guides your choices, it is no longer unseen data.",
    keyPoint: "Train to learn, validation to tune, test once at the end for an honest score.",
    related: ["cross-validation", "data-leakage", "overfitting-vs-underfitting"],
    diagram: "split",
  },
  {
    slug: "overfitting-vs-underfitting",
    name: "Overfitting vs Underfitting",
    category: "Foundations",
    parent: "train-validation-test-split",
    definition:
      "Overfitting is when a model learns the training data too closely, including its noise, and fails on new data, while underfitting is when a model is too simple to learn the pattern at all.",
    explanation:
      "An overfit model has a high training score and a much lower test score. An underfit model has a low score on both. Noise means random quirks in the data that will not repeat. A good model sits between the two and does well on data it has not seen.",
    example:
      "A student who memorizes past papers word for word fails when the questions change: that is overfitting. A student who barely studied scores poorly on every paper: that is underfitting.",
    question: {
      q: "How do you fix overfitting?",
      a: "Get more data, use a simpler model, or add regularization. For trees you can limit the depth, and for neural networks you can use dropout or early stopping. Then confirm the improvement on validation data.",
    },
    mistake:
      "Judging a model by its training score alone. A big gap between the training and validation scores is the warning sign.",
    keyPoint: "Overfitting: great on train, poor on test. Underfitting: poor on both.",
    related: ["bias-vs-variance", "regularization", "cross-validation"],
    diagram: "fit",
  },
  {
    slug: "bias-vs-variance",
    name: "Bias vs Variance",
    category: "Foundations",
    parent: "overfitting-vs-underfitting",
    definition:
      "Bias is the error from a model that is too simple, and variance is the error from a model that is too sensitive to its training data.",
    explanation:
      "High bias means underfitting: the model gets a poor score even on training data. High variance means overfitting: the model is great on train but poor on test. The goal is low bias and low variance. We get there by balancing model complexity.",
    example:
      "Train score 60%, test score 58%: both are poor, so this is high bias. Train score 99%, test score 70%: great on train, poor on test, so this is high variance.",
    question: {
      q: "How do you tell from the scores whether a model has high bias or high variance?",
      a: "Compare the training and test scores. If both are low, it is high bias, so try a more complex model or better features. If the training score is high and the test score is much lower, it is high variance, so try more data, regularization or a simpler model.",
    },
    mistake:
      "Saying more data fixes everything. More data mainly helps high variance. It will not fix high bias, because a model that is too simple stays too simple.",
    keyPoint:
      "High bias = underfitting, poor even on train. High variance = overfitting, great on train, poor on test. Balance model complexity.",
    related: ["overfitting-vs-underfitting", "regularization", "cross-validation"],
    diagram: "bias-variance",
  },
  {
    slug: "parameters-vs-hyperparameters",
    name: "Parameters vs Hyperparameters",
    category: "Foundations",
    parent: "train-validation-test-split",
    definition:
      "Parameters are learned by the model from data, and hyperparameters are set by us before training.",
    explanation:
      "Parameters, such as the weights in a model, are learned from the data during training. Hyperparameters, such as the learning rate or tree depth, are set by us before training starts. Hyperparameters control how the learning happens. We pick them by trying different values and comparing validation scores.",
    example:
      "In a neural network, the weights are parameters because training finds them. The learning rate is a hyperparameter because you choose it. In a decision tree, the maximum depth is a hyperparameter.",
    question: {
      q: "How do you choose hyperparameters?",
      a: "Try different values using grid search or random search, and compare them with a validation set or cross-validation. Pick the best value, then check the final model once on the test set.",
    },
    mistake:
      "Saying the learning rate is learned during training. The model does not learn it from data. We set it before training starts.",
    keyPoint:
      "Parameters (weights) are learned from data. Hyperparameters (learning rate, tree depth) are set by us before training.",
    related: ["learning-rate", "cross-validation", "train-validation-test-split"],
  },

  // ─── Evaluation ────────────────────────────────────────────
  {
    slug: "cross-validation",
    name: "Cross-Validation",
    category: "Evaluation",
    definition:
      "A method to check how a model performs on unseen data, by testing it on K different parts of the data.",
    explanation:
      "Split the data into K parts. Each round uses one part for testing and the rest for training. After K rounds, you have K scores. The average of the K scores is the model's real performance.",
    example:
      "It is like judging a student by the average of all exams, not one exam. With 5 folds and scores of 80, 84, 78, 82 and 81, the model's performance is the average: 81.",
    question: {
      q: "Why use cross-validation instead of a single train-test split?",
      a: "A single split can be lucky or unlucky, depending on which rows land in the test set. Cross-validation tests on every part of the data, so the score is more reliable. The cost is that you train the model K times.",
    },
    mistake:
      "Scaling or preprocessing the full data before cross-validation. That leaks test information into training. Fit the preprocessing inside each round, on the training parts only.",
    keyPoint:
      "Split into K parts. Each round, one part tests and the rest train. The average of the K scores is the model's real performance.",
    related: ["train-validation-test-split", "data-leakage", "bias-vs-variance"],
    diagram: "k-fold",
  },
  {
    slug: "confusion-matrix",
    name: "Confusion Matrix",
    category: "Evaluation",
    definition:
      "A table that compares a classifier's predictions with the actual labels, showing true positives, false positives, true negatives and false negatives.",
    explanation:
      "Positive means the class we care about, such as \"has the disease\". A true positive is a positive correctly predicted, and a true negative is a negative correctly predicted. A false positive is a false alarm, and a false negative is a miss. Metrics like precision and recall are calculated from these four counts.",
    example:
      "A disease test on 100 people: 8 sick people correctly flagged (TP), 2 sick people missed (FN), 5 healthy people wrongly flagged (FP), and 85 healthy people correctly cleared (TN).",
    question: {
      q: "Which is worse, a false positive or a false negative?",
      a: "It depends on the cost of each error. In cancer screening a false negative is worse, because a sick patient goes untreated. In spam filtering a false positive is worse, because a real email gets lost.",
    },
    mistake:
      "Mixing up false positive and false negative. The second word is what the model predicted, and the first word says whether that was right. So a false positive means it predicted positive and was wrong.",
    keyPoint: "TP and TN are correct. FP is a false alarm. FN is a miss.",
    related: ["precision-vs-recall", "f1-score", "imbalanced-data"],
    diagram: "confusion-matrix",
  },
  {
    slug: "precision-vs-recall",
    name: "Precision vs Recall",
    category: "Evaluation",
    parent: "confusion-matrix",
    definition:
      "Precision is the share of predicted positives that are actually positive, and recall is the share of actual positives the model found.",
    explanation:
      "Precision = TP / (TP + FP), and it asks: when the model says yes, how often is it right? Recall = TP / (TP + FN), and it asks: of all the real positives, how many did it catch? They usually trade off against each other. You move between them by changing the decision threshold, the score above which the model says yes.",
    example:
      "A disease test gives 8 true positives, 5 false positives and 2 false negatives. Precision = 8/13, about 62%. Recall = 8/10, which is 80%.",
    question: {
      q: "When do you prefer recall over precision?",
      a: "Prefer recall when missing a positive is costly, as in disease screening or fraud detection. Prefer precision when a false alarm is costly, as in a spam filter that might hide real emails.",
    },
    mistake:
      "Expecting a threshold change to improve both. Raising the threshold usually increases precision and lowers recall, and lowering it does the opposite.",
    keyPoint: "Precision: of predicted yes, how many are right. Recall: of actual yes, how many were found.",
    related: ["confusion-matrix", "f1-score", "roc-auc"],
  },
  {
    slug: "f1-score",
    name: "F1 Score",
    category: "Evaluation",
    parent: "precision-vs-recall",
    definition:
      "The harmonic mean of precision and recall, giving one score that is high only when both are high.",
    explanation:
      "The formula is F1 = 2 × Precision × Recall / (Precision + Recall). A harmonic mean is pulled towards the smaller value. So a model cannot get a good F1 by being strong on only one side. It is useful when you need a single number and the classes are imbalanced.",
    example:
      "A model with precision 1.0 and recall 0.1 has a simple average of 0.55, which looks acceptable. Its F1 is about 0.18, which shows the real problem.",
    question: {
      q: "Why use a harmonic mean instead of a simple average?",
      a: "The harmonic mean punishes a low value, while a simple average can hide it. With precision 1.0 and recall 0.1, the average is 0.55 but F1 is only about 0.18.",
    },
    mistake:
      "Using F1 when one error type clearly costs more. F1 weights precision and recall equally, so in that case look at the metric that matters, or use F-beta.",
    keyPoint: "F1 = 2PR / (P + R). High only when precision and recall are both high.",
    related: ["precision-vs-recall", "confusion-matrix", "imbalanced-data"],
  },
  {
    slug: "roc-auc",
    name: "ROC-AUC",
    category: "Evaluation",
    parent: "confusion-matrix",
    definition:
      "A score of how well a classifier ranks positives above negatives across all thresholds, where 1.0 is perfect and 0.5 is no better than random guessing.",
    explanation:
      "The ROC curve plots the true positive rate (recall) against the false positive rate at every threshold. AUC is the area under that curve. It equals the chance that a random positive gets a higher score than a random negative. Because it covers all thresholds, you do not need to pick one first.",
    example:
      "A loan default model has an AUC of 0.85. If you pick one defaulter and one non-defaulter at random, the model gives the defaulter the higher risk score 85% of the time.",
    question: {
      q: "Is ROC-AUC a good metric for highly imbalanced data?",
      a: "It can look too optimistic, because when negatives far outnumber positives, the false positive rate stays small even with many false alarms. PR-AUC, the area under the precision-recall curve, focuses on the positive class and is usually more informative there.",
    },
    mistake:
      "Saying an AUC of 0.9 means 90% accuracy. AUC measures ranking across thresholds, not accuracy at one threshold.",
    keyPoint: "Ranking quality across all thresholds. 1.0 is perfect, 0.5 is random.",
    related: ["precision-vs-recall", "f1-score", "imbalanced-data"],
    diagram: "roc",
  },
  {
    slug: "regression-metrics",
    name: "Regression Metrics (MAE, MSE, RMSE, R²)",
    category: "Evaluation",
    definition:
      "Measures of a regression model's predictions: MAE, MSE and RMSE measure the size of the errors, and R² measures how much of the variation the model explains.",
    explanation:
      "MAE is the average of the absolute errors. MSE is the average of the squared errors, so large errors count much more. RMSE is the square root of MSE, which brings it back to the target's units. R² compares the model with always predicting the average: 1 is perfect and 0 is no better than the average.",
    example:
      "House price errors of ₹2 lakh, ₹2 lakh and ₹8 lakh give an MAE of 4 lakh and an RMSE of about 4.9 lakh. RMSE is higher because the one big error dominates.",
    question: {
      q: "When would you choose MAE over RMSE?",
      a: "Choose MAE when outliers should not dominate the score and you want an error that is easy to explain. Choose RMSE when large errors are especially bad, because squaring penalises them more.",
    },
    mistake:
      "Saying R² is always between 0 and 1. On test data it can be negative, which means the model is worse than simply predicting the average.",
    keyPoint: "MAE: average error. RMSE: punishes big errors. R²: variation explained, 1 is perfect.",
    related: ["loss-functions", "cross-validation", "overfitting-vs-underfitting"],
  },

  // ─── Data ──────────────────────────────────────────────────
  {
    slug: "data-leakage",
    name: "Data Leakage",
    category: "Data",
    definition:
      "When information that won't be available at prediction time is available during training.",
    explanation:
      "The output's hint is already in the input, so the model memorizes instead of learning patterns. You see 99% accuracy in training, but the model fails at prediction time. Leakage can come from a feature or from the way you prepare the data.",
    example:
      "Feature derived from the target: using \"recovery amount\" to predict loan default, when that value only exists after a default happens. Fitting a scaler on the full data before the train-test split: the test data's mean and spread leak into training.",
    question: {
      q: "How do you prevent data leakage?",
      a: "Split the data first, then fit steps like scalers on the training data only and apply them to the test data. For each feature, ask: will I have this value at prediction time? Treat a suspiciously high score as a warning sign.",
    },
    mistake:
      "Thinking leakage only means a bad column. Preprocessing can leak too, such as fitting a scaler on the full data before the split.",
    keyPoint:
      "99% accuracy in training, fails at prediction time. Watch for features derived from the target, and fit scalers only after the split.",
    related: ["feature-scaling", "train-validation-test-split", "cross-validation"],
  },
  {
    slug: "feature-scaling",
    name: "Feature Scaling",
    category: "Data",
    definition:
      "Bringing numeric features to a similar range, so that no feature dominates just because its numbers are larger.",
    explanation:
      "Standardization subtracts the mean and divides by the standard deviation, giving a mean of 0 and a standard deviation of 1. Min-max scaling squeezes values into the range 0 to 1. Distance-based models and models trained with gradient descent benefit from scaling. Tree-based models do not need it.",
    example:
      "Age runs from 18 to 60, while salary runs from ₹20,000 to ₹2,00,000. In a model that compares people by distance, the gap between two people would be decided almost entirely by salary, until you scale both.",
    question: {
      q: "Which models need feature scaling and which do not?",
      a: "KNN, K-Means, SVM, PCA and models trained with gradient descent, such as linear and logistic regression, benefit from it. Decision trees, random forests and boosted trees do not need it, because their splits depend on the order of values, not their scale.",
    },
    mistake:
      "Fitting the scaler on the full data before the split. That is data leakage. Fit it on the training data and only apply it to the test data.",
    keyPoint: "Same range for all features. Needed for KNN, SVM, K-Means and PCA. Not needed for trees.",
    related: ["data-leakage", "gradient-descent", "handling-missing-values"],
  },
  {
    slug: "handling-missing-values",
    name: "Handling Missing Values",
    category: "Data",
    definition:
      "Deciding what to do with empty values, usually by removing the rows or columns, or by filling them in, which is called imputation.",
    explanation:
      "Deletion is simple, but you lose data. Imputation fills gaps with a value such as the mean, the median or the most frequent category. The median is safer than the mean when there are outliers. You can also add a \"was missing\" column, because the fact that a value is missing can itself be useful information.",
    example:
      "A salary column has gaps and a few very high earners. The mean is pulled up by those earners, so filling with the median gives a more typical value.",
    question: {
      q: "Do you fill missing values with the mean or the median?",
      a: "Use the mean for roughly symmetric data, and the median for skewed data or data with outliers, because extreme values do not pull it. For categorical columns, use the most frequent value or a separate \"missing\" category.",
    },
    mistake:
      "Dropping every row with a missing value without checking how much data you lose, or why the values are missing.",
    keyPoint: "Drop or impute. Median for skewed data, most frequent value for categories.",
    related: ["data-leakage", "categorical-encoding", "feature-scaling"],
  },
  {
    slug: "categorical-encoding",
    name: "Categorical Encoding",
    category: "Data",
    definition:
      "Converting categories such as city or colour into numbers, because most models work only with numeric inputs.",
    explanation:
      "One-hot encoding creates one 0/1 column per category, so it adds no false order. Ordinal encoding gives each category an integer, which suits categories with a real order. Target encoding replaces each category with the average target value for that category. It should be calculated on training data only, otherwise it leaks.",
    example:
      "City (Chennai, Madurai, Coimbatore) has no order, so use one-hot and get three columns. Size (Small, Medium, Large) has a real order, so use 1, 2, 3.",
    question: {
      q: "Why not just number cities as 1, 2 and 3?",
      a: "That creates a false order and false distances, as if Coimbatore were three times Chennai. Linear and distance-based models can be misled by this. One-hot encoding avoids the problem.",
    },
    mistake:
      "One-hot encoding a column with thousands of values, such as pin codes, which creates a huge number of columns. Group rare categories, or use target or frequency encoding instead.",
    keyPoint: "No order: one-hot. Real order: ordinal. Many categories: target or frequency encoding.",
    related: ["handling-missing-values", "data-leakage", "feature-scaling"],
  },
  {
    slug: "imbalanced-data",
    name: "Imbalanced Data",
    category: "Data",
    definition:
      "When one class is far more common than the other, such as 99% normal transactions and 1% fraud.",
    explanation:
      "A model can get high accuracy just by always predicting the common class, so accuracy becomes misleading. Use precision, recall, F1 or PR-AUC instead. To improve the model, you can use class weights, adjust the decision threshold, or resample the data. Resampling means adding minority examples (for example with SMOTE) or removing majority examples.",
    example:
      "Out of 1,000 transactions, 10 are fraud. A model that always says \"not fraud\" gets 99% accuracy and catches zero fraud.",
    question: {
      q: "Should you oversample before or after the train-test split?",
      a: "After the split, and on the training data only. Oversampling first puts copies of the same points in both train and test, which inflates the score. The test set should keep the real class ratio.",
    },
    mistake:
      "Reporting accuracy as the main metric. On imbalanced data, a useless model can still score very high.",
    keyPoint: "Accuracy misleads. Use precision, recall, F1, plus class weights or resampling.",
    related: ["precision-vs-recall", "f1-score", "roc-auc"],
  },

  // ─── Optimization ──────────────────────────────────────────
  {
    slug: "loss-functions",
    name: "Loss Functions",
    category: "Optimization",
    definition:
      "A function that measures how wrong a model's predictions are, and training tries to make this number as small as possible.",
    explanation:
      "The loss turns the model's mistakes into a single number. Gradient descent then uses it to decide how to update the weights. Regression commonly uses MSE, and classification commonly uses cross-entropy, also called log loss. The right choice depends on the problem.",
    example:
      "The actual value is 100. Predicting 90 gives a squared error of 100, while predicting 99 gives a squared error of 1. Better predictions give a lower loss.",
    question: {
      q: "Why use cross-entropy instead of MSE for logistic regression?",
      a: "Cross-entropy heavily penalises confident wrong predictions, and for logistic regression its loss curve is convex, meaning it has a single valley. MSE with a sigmoid is not convex, and it gives weak gradients when predictions are very wrong.",
    },
    mistake:
      "Mixing up loss and metric. The loss is what training minimizes, while a metric such as accuracy or F1 is what we report. They are often different.",
    keyPoint: "Loss measures how wrong the model is. Regression: MSE. Classification: cross-entropy.",
    related: ["gradient-descent", "regression-metrics", "regularization"],
  },
  {
    slug: "gradient-descent",
    name: "Gradient Descent",
    category: "Optimization",
    parent: "loss-functions",
    definition:
      "A method to reduce the model's error (loss) step by step by updating the weights.",
    explanation:
      "The slope (gradient) tells us which direction increases the error. So we step in the opposite direction, scaled by the learning rate. We repeat this until the error is minimum. It can get stuck in a local minimum, which is a low point that is not the lowest one.",
    example:
      "Imagine walking down a hill in thick fog. You feel the slope under your feet and take a step downhill, again and again. As a formula: new weight = old weight − learning rate × gradient.",
    question: {
      q: "What is the difference between batch, stochastic and mini-batch gradient descent?",
      a: "Batch uses all the data for each update, so it is stable but slow. Stochastic uses one example per update, so it is fast but noisy. Mini-batch uses a small group of examples, which is the usual balance.",
    },
    mistake:
      "Saying it always finds the best answer. It can get stuck in a local minimum. Only when the loss curve has a single valley, as in linear regression with MSE, is the minimum guaranteed to be the global one.",
    keyPoint:
      "Slope shows where error increases, so step the opposite way, scaled by the learning rate. Repeat. Can get stuck in a local minimum.",
    related: ["learning-rate", "loss-functions", "parameters-vs-hyperparameters"],
    diagram: "gradient-descent",
  },
  {
    slug: "learning-rate",
    name: "Learning Rate",
    category: "Optimization",
    parent: "gradient-descent",
    definition:
      "A hyperparameter that controls how big a step gradient descent takes when it updates the weights.",
    explanation:
      "If it is too small, training is very slow. If it is too large, the model overshoots the minimum, and the loss can jump around or even grow. A good value makes the loss fall steadily. People often try values like 0.1, 0.01 and 0.001, and many setups reduce it during training.",
    example:
      "Walking down into a valley: tiny steps take forever, while giant leaps jump right across to the other side.",
    question: {
      q: "How can you tell from the loss curve that the learning rate is wrong?",
      a: "If the loss rises or keeps bouncing, the learning rate is probably too high. If the loss falls very slowly, it is probably too low. A smooth and steady fall suggests a good value.",
    },
    mistake:
      "Assuming a lower learning rate is always better. Too low a value makes training painfully slow, and it may stop improving before reaching a good solution.",
    keyPoint: "Step size of gradient descent. Too small is slow, too large overshoots.",
    related: ["gradient-descent", "parameters-vs-hyperparameters", "loss-functions"],
    diagram: "learning-rate",
  },
  {
    slug: "regularization",
    name: "Regularization (L1 vs L2)",
    category: "Optimization",
    parent: "loss-functions",
    definition:
      "Adding a penalty for large weights to the loss to reduce overfitting, where L1 penalises absolute values and L2 penalises squared values.",
    explanation:
      "The penalty keeps the weights small, which makes the model simpler. L1, used in Lasso, can push some weights to exactly zero, so it also selects features. L2, used in Ridge, shrinks all weights but rarely makes them zero. The penalty's strength is a hyperparameter, often called lambda or alpha.",
    example:
      "You have 100 features and only a few are useful. L1 tends to set many of the useless weights to zero. L2 keeps all 100 features but with smaller weights.",
    question: {
      q: "Why does L1 give zero weights while L2 does not?",
      a: "L1's pull on a weight stays constant however small the weight gets, so it can reach exactly zero. L2's pull is proportional to the weight, so it weakens as the weight shrinks. Weights get small under L2 but rarely reach zero.",
    },
    mistake:
      "Thinking a stronger penalty is always better. Too strong a penalty makes the model too simple, and it starts to underfit.",
    keyPoint: "Penalty on large weights to reduce overfitting. L1 can zero out weights. L2 shrinks them.",
    related: ["overfitting-vs-underfitting", "bias-vs-variance", "loss-functions"],
  },
];

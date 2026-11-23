// All Data Prep page content lives in this file. See "Add a preprocessing technique" in README.md.
// Every before/after example below was checked with pandas and scikit-learn.

export interface MiniTable {
  head?: string[];
  rows: string[][];
  /** Row indexes to highlight: red in "before", green in "after". */
  marked?: number[];
}

export interface Technique {
  /** Used for the #link on the page. */
  id: string;
  name: string;
  /** A few words for the overview list. */
  short: string;
  what: string;
  before: MiniTable;
  after: MiniTable;
  /** The rule applied to turn "before" into "after". */
  change: string;
  methods: string[];
  watchOut: string;
  code: string;
  codeNote?: string;
  /** Slug of a concept with full notes. A typo here fails the build. */
  concept?: string;
}

export const GOLDEN_RULE =
  "Split the data first. Then fit every step (imputer, scaler, encoder, selector) on the training data only, and apply it to the test data. Fitting on all the data leaks test information into training.";

export const TECHNIQUES: Technique[] = [
  {
    id: "missing-values",
    name: "Handle Missing Values",
    short: "Fill or drop empty values",
    what: "Fill gaps with a sensible value, or drop the rows or columns that have them.",
    before: { head: ["Age"], rows: [["25"], ["—"], ["40"], ["35"]], marked: [1] },
    after: { head: ["Age"], rows: [["25"], ["35"], ["40"], ["35"]], marked: [1] },
    change: "Fill with the median, 35",
    methods: ["Drop rows or columns", "Mean or median", "Most frequent value", "Forward fill", "KNN imputer", "\"Was missing\" flag"],
    watchOut: "Use the median when there are outliers. Calculate the fill value from the training data only.",
    code: 'df["age"] = df["age"].fillna(df["age"].median())',
    concept: "handling-missing-values",
  },
  {
    id: "duplicates",
    name: "Drop Duplicate Rows",
    short: "Remove repeated rows",
    what: "Remove rows that appear more than once, so they do not count twice.",
    before: { head: ["Name", "Age"], rows: [["Ravi", "25"], ["Priya", "30"], ["Ravi", "25"]], marked: [2] },
    after: { head: ["Name", "Age"], rows: [["Ravi", "25"], ["Priya", "30"]] },
    change: "The repeated row is removed",
    methods: ["Exact duplicates", "Duplicates on key columns"],
    watchOut: "Do it before the train-test split, or the same row can land in both train and test.",
    code: "df = df.drop_duplicates()",
    codeNote: 'Use subset=["id"] to compare only some columns.',
    concept: "data-leakage",
  },
  {
    id: "outliers",
    name: "Remove Outliers",
    short: "Handle extreme values",
    what: "Find values far from the rest and remove or cap them.",
    before: { head: ["Value"], rows: [["12"], ["15"], ["16"], ["18"], ["95"]], marked: [4] },
    after: { head: ["Value"], rows: [["12"], ["15"], ["16"], ["18"]] },
    change: "IQR rule: keep 10.75 to 20.75, so 95 goes",
    methods: ["IQR rule (1.5 × IQR)", "Z-score above 3", "Capping", "Domain rules"],
    watchOut: "First check if the outlier is an error or a real rare case. In fraud detection, the outliers are often what you want to find.",
    code: 'q1, q3 = df["x"].quantile([0.25, 0.75])\niqr = q3 - q1\ndf = df[df["x"].between(q1 - 1.5 * iqr, q3 + 1.5 * iqr)]',
    codeNote: "The example uses 12, 14, 15, 15, 16, 18, 95: Q1 = 14.5, Q3 = 17, IQR = 2.5.",
  },
  {
    id: "transform",
    name: "Transform Features",
    short: "Fix skewed values",
    what: "Apply a math function, such as a log, to make a skewed feature more even.",
    before: { head: ["Income"], rows: [["20,000"], ["30,000"], ["50,000"], ["10,00,000"]] },
    after: { head: ["log10"], rows: [["4.3"], ["4.5"], ["4.7"], ["6.0"]] },
    change: "Log shrinks the huge value",
    methods: ["Log", "Square root", "Box-Cox or Yeo-Johnson", "Binning"],
    watchOut: "Log fails on zero and negative values. Use np.log1p when there are zeros.",
    code: 'df["income_log"] = np.log10(df["income"])',
  },
  {
    id: "encoding",
    name: "Feature Encoding",
    short: "Turn categories into numbers",
    what: "Convert text categories into numbers, because models need numeric input.",
    before: { head: ["City"], rows: [["Chennai"], ["Madurai"], ["Chennai"]] },
    after: { head: ["Chennai", "Madurai"], rows: [["1", "0"], ["0", "1"], ["1", "0"]] },
    change: "One-hot: one 0/1 column per city",
    methods: ["One-hot", "Ordinal", "Target", "Frequency"],
    watchOut: "Use one-hot when there is no order, and ordinal for a real order such as Small < Medium < Large.",
    code: 'df = pd.get_dummies(df, columns=["city"])',
    concept: "categorical-encoding",
  },
  {
    id: "scaling",
    name: "Feature Scaling",
    short: "Mean 0, standard deviation 1",
    what: "Standardize each feature so it has a mean of 0 and a standard deviation of 1.",
    before: { head: ["Age"], rows: [["20"], ["30"], ["40"]] },
    after: { head: ["Scaled"], rows: [["−1.22"], ["0"], ["1.22"]] },
    change: "(value − mean) / std",
    methods: ["StandardScaler", "RobustScaler (for outliers)"],
    watchOut: "Needed for KNN, SVM, PCA and gradient descent. Tree models do not need it.",
    code: "scaler = StandardScaler().fit(X_train)\nX_train = scaler.transform(X_train)\nX_test = scaler.transform(X_test)",
    concept: "feature-scaling",
  },
  {
    id: "normalization",
    name: "Data Normalization",
    short: "Squeeze into 0 to 1",
    what: "Rescale each feature into the range 0 to 1, often called min-max scaling.",
    before: { head: ["Salary"], rows: [["20,000"], ["50,000"], ["80,000"]] },
    after: { head: ["0 to 1"], rows: [["0"], ["0.5"], ["1"]] },
    change: "(value − min) / (max − min)",
    methods: ["MinMaxScaler", "Normalizer (each row to length 1)"],
    watchOut: "Very sensitive to outliers: one huge value squeezes everything else close to 0.",
    code: "scaler = MinMaxScaler().fit(X_train)",
    codeNote: "Then call scaler.transform() on both train and test, as with feature scaling.",
    concept: "feature-scaling",
  },
  {
    id: "imbalance",
    name: "Handling Class Imbalance",
    short: "Balance rare classes",
    what: "Help the model learn a rare class, so it does not just predict the common one.",
    before: { head: ["Class", "Rows"], rows: [["Normal", "990"], ["Fraud", "10"]], marked: [1] },
    after: { head: ["Class", "Rows"], rows: [["Normal", "990"], ["Fraud", "990"]], marked: [1] },
    change: "SMOTE adds synthetic fraud rows",
    methods: ["Class weights", "Oversampling (SMOTE)", "Undersampling", "Threshold tuning"],
    watchOut: "Resample the training data only, after the split. Judge with precision, recall or F1, not accuracy.",
    code: "X_res, y_res = SMOTE().fit_resample(X_train, y_train)",
    codeNote: "SMOTE comes from the imbalanced-learn library.",
    concept: "imbalanced-data",
  },
  {
    id: "selection",
    name: "Feature Selection",
    short: "Keep only useful columns",
    what: "Keep the columns that help the prediction and drop the rest.",
    before: { head: ["Columns"], rows: [["age"], ["income"], ["user_id"], ["city"], ["phone_no"]], marked: [2, 4] },
    after: { head: ["Columns"], rows: [["age"], ["income"], ["city"]] },
    change: "ID-like columns that cannot help are dropped",
    methods: ["Correlation", "Chi-square", "Mutual information", "RFE", "L1 (Lasso)", "Tree importance"],
    watchOut: "Select using the training data only. Selecting on all the data leaks test information.",
    code: "selector = SelectKBest(f_classif, k=10).fit(X_train, y_train)",
  },
  {
    id: "dimensionality",
    name: "Dimensionality Reduction",
    short: "Fewer, combined columns",
    what: "Combine many columns into a few new ones that keep most of the information.",
    before: { head: ["Columns"], rows: [["x1"], ["x2"], ["…"], ["x100"]] },
    after: { head: ["Columns"], rows: [["PC1"], ["…"], ["PC10"]] },
    change: "PCA: 100 columns become 10 new ones",
    methods: ["PCA", "LDA", "t-SNE or UMAP (for plots)"],
    watchOut: "Selection keeps original columns, while reduction creates new ones that are harder to explain. Scale before PCA.",
    code: "pca = PCA(n_components=0.95).fit(X_train)",
    codeNote: "0.95 keeps as many components as needed to keep 95% of the variance.",
  },
];

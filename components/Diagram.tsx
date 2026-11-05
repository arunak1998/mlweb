import type { DiagramId } from "@/content/concepts";

const LABEL = { fill: "var(--soft)", fontSize: 14, fontFamily: "inherit" };

// ── Bias-variance target ─────────────────────────────────────

const TARGETS = [
  {
    x: 90,
    y: 62,
    title: "Low bias, low variance",
    hits: [[0, 0], [7, -5], [-7, 4], [4, 8], [-5, -7]],
  },
  {
    x: 270,
    y: 62,
    title: "Low bias, high variance",
    hits: [[-24, -14], [20, -24], [27, 12], [-16, 26], [-3, 2]],
  },
  {
    x: 90,
    y: 212,
    title: "High bias, low variance",
    hits: [[23, -23], [28, -19], [19, -18], [25, -28], [30, -25]],
  },
  {
    x: 270,
    y: 212,
    title: "High bias, high variance",
    hits: [[36, -12], [12, -36], [34, -36], [10, -8], [24, -20]],
  },
];

function BiasVarianceDiagram() {
  return (
    <svg viewBox="0 0 360 290" role="img" aria-label="Four targets. Low bias, low variance: hits tightly grouped on the centre. Low bias, high variance: hits scattered around the centre. High bias, low variance: hits tightly grouped away from the centre. High bias, high variance: hits scattered away from the centre.">
      {TARGETS.map((target) => (
        <g key={target.title}>
          <circle cx={target.x} cy={target.y} r="48" fill="none" stroke="var(--border)" strokeWidth="2" />
          <circle cx={target.x} cy={target.y} r="30" fill="none" stroke="var(--border)" strokeWidth="2" />
          <circle cx={target.x} cy={target.y} r="12" fill="var(--surface-2)" stroke="var(--muted)" strokeWidth="2" />
          {target.hits.map(([dx, dy]) => (
            <circle key={`${dx},${dy}`} cx={target.x + dx} cy={target.y + dy} r="4" fill="var(--accent)" />
          ))}
          <text x={target.x} y={target.y + 69} textAnchor="middle" {...LABEL}>
            {target.title}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ── K-fold split ─────────────────────────────────────────────

const FOLDS = [0, 1, 2, 3, 4];
const CELL_WIDTH = 50;
const ROW_HEIGHT = 34;

function KFoldDiagram() {
  return (
    <svg viewBox="0 0 360 250" role="img" aria-label="5-fold cross-validation. Five rounds, each using a different one of five parts for testing and the other four for training. The five scores are then averaged.">
      {FOLDS.map((round) => {
        const y = 8 + round * ROW_HEIGHT;
        return (
          <g key={round}>
            <text x="0" y={y + 18} {...LABEL}>
              Round {round + 1}
            </text>
            {FOLDS.map((part) => (
              <rect
                key={part}
                x={66 + part * (CELL_WIDTH + 4)}
                y={y}
                width={CELL_WIDTH}
                height={ROW_HEIGHT - 8}
                rx="5"
                fill={part === round ? "var(--accent)" : "var(--surface-2)"}
                stroke={part === round ? "var(--accent)" : "var(--muted)"}
                strokeOpacity={part === round ? 1 : 0.5}
              />
            ))}
          </g>
        );
      })}
      <rect x="66" y="194" width="14" height="14" rx="3" fill="var(--accent)" />
      <text x="86" y="206" {...LABEL}>
        Test
      </text>
      <rect x="136" y="194" width="14" height="14" rx="3" fill="var(--surface-2)" stroke="var(--muted)" strokeOpacity="0.5" />
      <text x="156" y="206" {...LABEL}>
        Train
      </text>
      <text x="66" y="238" {...LABEL} fill="var(--text)" fontWeight="600">
        Final score = average of 5 scores
      </text>
    </svg>
  );
}

// ── Gradient descent curve ───────────────────────────────────

const PLOT = { left: 34, right: 348, top: 28, bottom: 192 };

// A curve with two valleys: a shallow local minimum and a deeper global minimum.
function loss(w: number) {
  return (w - 0.2) ** 2 * (w - 0.75) ** 2 - 0.006 * w;
}

function toX(w: number) {
  return PLOT.left + w * (PLOT.right - PLOT.left);
}

function toY(w: number) {
  // The low end sits below the deepest valley, which leaves room for the labels under it.
  const low = -0.0115;
  const high = 0.034;
  return PLOT.bottom - ((loss(w) - low) / (high - low)) * (PLOT.bottom - PLOT.top);
}

const CURVE = Array.from({ length: 81 }, (_, i) => {
  const w = i / 80;
  return `${toX(w).toFixed(1)},${toY(w).toFixed(1)}`;
}).join(" ");

// Steps shrink as the slope flattens near the minimum.
const STEPS = [0.985, 0.92, 0.865, 0.82, 0.78];

function GradientDescentDiagram() {
  return (
    <svg viewBox="0 0 360 235" role="img" aria-label="A loss curve with two valleys. Steps start high on the right and move downhill into the deepest valley, the global minimum. A shallower valley on the left is a local minimum, where gradient descent can get stuck.">
      <defs>
        <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="4" markerHeight="4" orient="auto">
          <path d="M0 0 8 4 0 8z" fill="var(--green)" />
        </marker>
      </defs>
      <path d={`M${PLOT.left} 12V${PLOT.bottom + 14}H${PLOT.right}`} fill="none" stroke="var(--border)" strokeWidth="2" />
      <polyline points={CURVE} fill="none" stroke="var(--muted)" strokeWidth="2.5" />

      {STEPS.slice(0, -1).map((w, i) => (
        <line
          key={w}
          x1={toX(w)}
          y1={toY(w)}
          x2={toX(STEPS[i + 1])}
          y2={toY(STEPS[i + 1])}
          stroke="var(--green)"
          strokeWidth="2"
          markerEnd="url(#arrow)"
        />
      ))}
      <circle cx={toX(STEPS[0])} cy={toY(STEPS[0])} r="5" fill="var(--accent)" />
      <text x={toX(STEPS[0]) - 10} y={toY(STEPS[0]) + 3} textAnchor="end" {...LABEL}>
        Start
      </text>

      <circle cx={toX(0.21)} cy={toY(0.21)} r="4" fill="var(--amber)" />
      <text x={toX(0.21)} y={toY(0.21) + 22} textAnchor="middle" {...LABEL} fill="var(--amber)">
        Local minimum
      </text>
      <circle cx={toX(0.755)} cy={toY(0.755)} r="4" fill="var(--green)" />
      <text x={toX(0.72)} y={toY(0.755) + 22} textAnchor="middle" {...LABEL} fill="var(--green)">
        Global minimum
      </text>

      <text x={(PLOT.left + PLOT.right) / 2} y="226" textAnchor="middle" {...LABEL}>
        Weight
      </text>
      <text x="14" y={(PLOT.top + PLOT.bottom) / 2} textAnchor="middle" transform={`rotate(-90 14 ${(PLOT.top + PLOT.bottom) / 2})`} {...LABEL}>
        Loss (error)
      </text>
    </svg>
  );
}

// ── Train/validation/test split ──────────────────────────────

const SPLIT_PARTS = [
  { name: "Train", share: 70, job: "Model learns", x: 0, width: 238, fill: "var(--accent)" },
  { name: "Validation", share: 15, job: "Tune", x: 242, width: 57, fill: "var(--teal)" },
  { name: "Test", share: 15, job: "Final", x: 303, width: 57, fill: "var(--amber)" },
];

function SplitDiagram() {
  return (
    <svg viewBox="0 0 360 112" role="img" aria-label="A bar split into train 70 percent where the model learns, validation 15 percent for tuning, and test 15 percent for the final check.">
      {SPLIT_PARTS.map((part) => (
        <g key={part.name}>
          <text x={part.x + part.width / 2} y="16" textAnchor="middle" {...LABEL} fontSize={part.name === "Validation" ? 12 : 14}>
            {part.name}
          </text>
          <rect x={part.x} y="26" width={part.width} height="46" rx="6" fill={part.fill} />
          <text x={part.x + part.width / 2} y="54" textAnchor="middle" {...LABEL} fill="var(--bg)" fontWeight="700">
            {part.share}%
          </text>
          <text x={part.x + part.width / 2} y="94" textAnchor="middle" {...LABEL}>
            {part.job}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ── Underfit, good fit, overfit ──────────────────────────────

const FIT_POINTS = [[8, 62], [20, 40], [32, 36], [44, 20], [56, 27], [68, 21], [80, 38], [92, 44]];

const FIT_PANELS = [
  { x: 0, title: "Underfit", curve: "M4 42 96 30", color: "var(--red)" },
  { x: 125, title: "Good fit", curve: "M6 64Q55 -18 96 50", color: "var(--green)" },
  { x: 250, title: "Overfit", curve: `M${FIT_POINTS.map(([x, y]) => `${x + 3} ${y}`).join(" ")}`, color: "var(--red)" },
];

function FitDiagram() {
  return (
    <svg viewBox="0 0 360 112" role="img" aria-label="Three plots of the same points. Underfit: a straight line that misses the pattern. Good fit: a smooth curve that follows the pattern. Overfit: a jagged line that passes through every point, including the noise.">
      {FIT_PANELS.map((panel) => (
        <g key={panel.title} transform={`translate(${panel.x} 0)`}>
          <rect width="110" height="80" rx="6" fill="var(--surface-2)" />
          <path d={panel.curve} fill="none" stroke={panel.color} strokeWidth="2" strokeLinejoin="round" />
          {FIT_POINTS.map(([x, y]) => (
            <circle key={x} cx={x + 3} cy={y} r="3" fill="var(--accent)" />
          ))}
          <text x="55" y="102" textAnchor="middle" {...LABEL}>
            {panel.title}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ── Confusion matrix ─────────────────────────────────────────

const MATRIX_CELLS = [
  { x: 90, y: 40, code: "TP", count: 8, note: "correct", color: "var(--green)" },
  { x: 225, y: 40, code: "FN", count: 2, note: "missed", color: "var(--red)" },
  { x: 90, y: 118, code: "FP", count: 5, note: "false alarm", color: "var(--red)" },
  { x: 225, y: 118, code: "TN", count: 85, note: "correct", color: "var(--green)" },
];

function ConfusionMatrixDiagram() {
  return (
    <svg viewBox="0 0 360 196" role="img" aria-label="A two by two table for the disease test example. True positives 8, false negatives 2, false positives 5, true negatives 85.">
      <text x="157" y="28" textAnchor="middle" {...LABEL}>
        Predicted +
      </text>
      <text x="292" y="28" textAnchor="middle" {...LABEL}>
        Predicted −
      </text>
      <text x="0" y="83" {...LABEL}>
        Actual +
      </text>
      <text x="0" y="161" {...LABEL}>
        Actual −
      </text>
      {MATRIX_CELLS.map((cell) => (
        <g key={cell.code}>
          <rect x={cell.x} y={cell.y} width="130" height="73" rx="6" fill={cell.color} fillOpacity="0.14" stroke={cell.color} />
          <text x={cell.x + 65} y={cell.y + 32} textAnchor="middle" {...LABEL} fill="var(--text)" fontSize={20} fontWeight="700">
            {cell.code} = {cell.count}
          </text>
          <text x={cell.x + 65} y={cell.y + 55} textAnchor="middle" {...LABEL}>
            {cell.note}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ── ROC curve ────────────────────────────────────────────────

function RocDiagram() {
  return (
    <svg viewBox="0 0 360 240" role="img" aria-label="An ROC curve. False positive rate on the horizontal axis, true positive rate on the vertical axis. The curve bows towards the top left corner, above a diagonal line that marks random guessing. The shaded area under the curve is the AUC.">
      <path d="M70 200C80 80 150 30 270 20V200Z" fill="var(--accent)" fillOpacity="0.16" />
      <path d="M70 20V200H270" fill="none" stroke="var(--border)" strokeWidth="2" />
      <path d="M70 200 270 20" fill="none" stroke="var(--muted)" strokeWidth="2" strokeDasharray="5 5" />
      <path d="M70 200C80 80 150 30 270 20" fill="none" stroke="var(--accent)" strokeWidth="3" />
      <text x="135" y="162" {...LABEL}>
        Dashed = random (0.5)
      </text>
      <text x="135" y="188" {...LABEL} fill="var(--text)" fontWeight="600">
        AUC = shaded area
      </text>
      <text x="170" y="226" textAnchor="middle" {...LABEL}>
        False positive rate
      </text>
      <text x="44" y="110" textAnchor="middle" transform="rotate(-90 44 110)" {...LABEL}>
        True positive rate
      </text>
    </svg>
  );
}

// ── Learning rate ────────────────────────────────────────────

const RATE_PANELS = [
  { x: 0, title: "Too small", steps: [-0.9, -0.8, -0.72, -0.65, -0.59], color: "var(--amber)" },
  { x: 125, title: "Good", steps: [-0.9, -0.45, -0.2, -0.05, 0], color: "var(--green)" },
  { x: 250, title: "Too large", steps: [-0.4, 0.55, -0.7, 0.85, -1], color: "var(--red)" },
];

function bowlPoint(w: number) {
  return { x: 55 + 48 * w, y: 76 - 66 * w * w };
}

const BOWL = Array.from({ length: 41 }, (_, i) => {
  const { x, y } = bowlPoint(-1 + i / 20);
  return `${x.toFixed(1)},${y.toFixed(1)}`;
}).join(" ");

function LearningRateDiagram() {
  return (
    <svg viewBox="0 0 360 112" role="img" aria-label="Three loss curves. Too small: many tiny steps that are still far from the minimum. Good: steps that reach the minimum. Too large: steps that jump across the valley and climb higher each time.">
      {RATE_PANELS.map((panel) => (
        <g key={panel.title} transform={`translate(${panel.x} 0)`}>
          <polyline points={BOWL} fill="none" stroke="var(--muted)" strokeWidth="2" />
          <polyline
            points={panel.steps.map((w) => `${bowlPoint(w).x},${bowlPoint(w).y}`).join(" ")}
            fill="none"
            stroke={panel.color}
            strokeWidth="1.5"
          />
          {panel.steps.map((w) => (
            <circle key={w} cx={bowlPoint(w).x} cy={bowlPoint(w).y} r="3" fill={panel.color} />
          ))}
          <text x="55" y="102" textAnchor="middle" {...LABEL}>
            {panel.title}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ── Registry ─────────────────────────────────────────────────

const DIAGRAMS: Record<DiagramId, () => React.JSX.Element> = {
  "bias-variance": BiasVarianceDiagram,
  "k-fold": KFoldDiagram,
  "gradient-descent": GradientDescentDiagram,
  split: SplitDiagram,
  fit: FitDiagram,
  "confusion-matrix": ConfusionMatrixDiagram,
  roc: RocDiagram,
  "learning-rate": LearningRateDiagram,
};

export function Diagram({ id }: { id: DiagramId }) {
  const Svg = DIAGRAMS[id];
  return (
    <figure className="rounded-xl border border-line bg-surface p-4">
      <div className="mx-auto max-w-md">
        <Svg />
      </div>
    </figure>
  );
}

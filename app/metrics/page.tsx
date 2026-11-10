import type { Metadata } from "next";
import Link from "next/link";
import { OG_IMAGE, SITE_TITLE } from "@/config/site";
import { METRIC_GROUPS, QUICK_PICKS, type Metric, type MetricGroup } from "@/content/metrics";
import { getConcept } from "@/lib/concepts";

const title = `Metrics | ${SITE_TITLE}`;
const description =
  "Every classification and regression metric on one page: formula, how to calculate it, a worked example and the Python code.";

export const metadata: Metadata = {
  title: "Metrics",
  description,
  alternates: { canonical: "/metrics" },
  openGraph: { title, description, type: "website", url: "/metrics", images: [OG_IMAGE] },
  twitter: { title, description, images: [OG_IMAGE] },
};

const allMetrics = METRIC_GROUPS.flatMap((group) => group.metrics);

function findMetric(id: string) {
  const metric = allMetrics.find((m) => m.id === id);
  if (!metric) throw new Error(`Unknown metric id in QUICK_PICKS: "${id}"`);
  return metric;
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <p className="mt-2 text-soft">
      <span className="font-semibold text-ink">{label}:</span> {children}
    </p>
  );
}

function ExampleData({ group }: { group: MetricGroup }) {
  const { head, rows } = group.exampleTable;
  return (
    <div className="mt-3 rounded-xl border border-line bg-surface p-4">
      <p className="text-[15px] text-soft">{group.exampleIntro}</p>
      <table className="mt-3 w-full text-left text-[15px]">
        <thead>
          <tr>
            {head.map((cell, index) => (
              <th key={index} scope="col" className="pb-1.5 font-semibold text-muted">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, ...cells]) => (
            <tr key={label} className="border-t border-line">
              <th scope="row" className="py-1.5 pr-2 font-semibold">
                {label}
              </th>
              {cells.map((cell, index) => (
                <td key={index} className="py-1.5 font-mono">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MetricEntry({ metric }: { metric: Metric }) {
  const concept = metric.concept ? getConcept(metric.concept) : undefined;
  return (
    <section id={metric.id} className="scroll-mt-4 border-b border-line py-6">
      <h3 className="text-lg font-bold tracking-tight">{metric.name}</h3>
      <p className="mt-2 rounded-lg bg-surface px-3 py-2 font-mono text-[15px] break-words text-ink">{metric.formula}</p>
      <p className="mt-2.5 font-medium">{metric.meaning}</p>
      <Detail label="How to calculate">{metric.howTo}</Detail>

      <div className="mt-3 rounded-lg border-l-[3px] border-accent bg-surface px-3 py-2.5">
        <p className="text-sm font-semibold text-accent">Example</p>
        <p className="mt-1 font-mono text-[15px] whitespace-pre-line text-ink wrap-anywhere">{metric.example.calc}</p>
        <p className="mt-1.5 text-[15px] text-soft">{metric.example.note}</p>
      </div>

      <Detail label="Range">{metric.range}</Detail>
      <Detail label="Use when">{metric.useWhen}</Detail>
      <Detail label="Watch out">{metric.watchOut}</Detail>

      <p className="mt-3 text-sm font-semibold text-ink">In Python</p>
      <code className="mt-1 block rounded-lg bg-surface-2 px-3 py-2 font-mono text-[13px] text-ink wrap-anywhere">
        {metric.code}
      </code>
      {metric.codeNote && <p className="mt-1 text-sm text-muted">{metric.codeNote}</p>}

      {concept && (
        <Link href={`/concepts/${concept.slug}`} className="mt-1 inline-flex min-h-11 items-center text-[15px] font-medium text-accent hover:underline">
          Full notes: {concept.name} →
        </Link>
      )}
    </section>
  );
}

export default function MetricsPage() {
  return (
    <div className="pt-8 text-[17px] leading-relaxed sm:pt-12">
      <h1 className="text-[2rem] leading-tight font-extrabold tracking-tight sm:text-5xl">Metrics</h1>
      <p className="mt-2 text-lg text-soft">
        Every classification and regression metric: the formula, how to calculate it, a worked example and the Python code.
      </p>

      <section className="mt-8">
        <h2 className="text-xl font-bold tracking-tight">Which metric should I use?</h2>
        <ul className="mt-2">
          {QUICK_PICKS.map(({ situation, pick }) => (
            <li key={situation} className="border-b border-line">
              <a href={`#${pick}`} className="flex min-h-12 items-center justify-between gap-4 py-2 hover:text-accent">
                <span className="text-[15px] leading-snug text-soft">{situation}</span>
                <span className="shrink-0 text-[15px] font-semibold text-accent">{findMetric(pick).name.split(" (")[0]}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted">
          Python lines use scikit-learn: <code className="font-mono">from sklearn.metrics import …</code>
        </p>
      </section>

      {METRIC_GROUPS.map((group) => (
        <section key={group.title} className="mt-10">
          <h2 className="text-xl font-bold tracking-tight text-accent">{group.title}</h2>
          <ExampleData group={group} />
          {group.metrics.map((metric) => (
            <MetricEntry key={metric.id} metric={metric} />
          ))}
        </section>
      ))}
    </div>
  );
}

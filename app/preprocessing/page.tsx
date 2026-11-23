import type { Metadata } from "next";
import Link from "next/link";
import { OG_IMAGE, SITE_TITLE } from "@/config/site";
import { GOLDEN_RULE, TECHNIQUES, type MiniTable, type Technique } from "@/content/preprocessing";
import { getConcept } from "@/lib/concepts";

const title = `Data Preprocessing | ${SITE_TITLE}`;
const description = "10 data preprocessing techniques, each with a before-and-after example, common methods and the Python code.";

export const metadata: Metadata = {
  title: "Data Preprocessing",
  description,
  alternates: { canonical: "/preprocessing" },
  openGraph: { title, description, type: "website", url: "/preprocessing", images: [OG_IMAGE] },
  twitter: { title, description, images: [OG_IMAGE] },
};

function Table({ table, label, tone }: { table: MiniTable; label: string; tone: "red" | "green" }) {
  const markClass = tone === "red" ? "bg-red/15 text-red" : "bg-green/15 text-green";
  return (
    <div className="min-w-0">
      <p className="mb-1 text-xs font-semibold text-muted">{label}</p>
      <table className="w-full rounded-lg bg-surface-2 font-mono text-[14px]">
        {table.head && (
          <thead>
            <tr>
              {table.head.map((cell) => (
                <th key={cell} scope="col" className="px-2 pt-1.5 pb-1 text-left font-sans text-xs font-semibold text-muted">
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {table.rows.map((row, index) => (
            <tr key={index} className={table.marked?.includes(index) ? markClass : ""}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-2 py-0.5">
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

function BeforeAfter({ technique }: { technique: Technique }) {
  return (
    <figure className="mt-3 rounded-xl border border-line bg-surface p-3">
      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2">
        <Table table={technique.before} label="Before" tone="red" />
        <span aria-hidden="true" className="self-center pt-4 text-xl text-accent">
          →
        </span>
        <Table table={technique.after} label="After" tone="green" />
      </div>
      <figcaption className="mt-2.5 text-[15px] font-medium text-ink">{technique.change}</figcaption>
    </figure>
  );
}

function TechniqueEntry({ technique, number }: { technique: Technique; number: number }) {
  const concept = technique.concept ? getConcept(technique.concept) : undefined;
  return (
    <section id={technique.id} className="scroll-mt-4 border-b border-line py-6">
      <h3 className="flex items-baseline gap-2.5 text-lg font-bold tracking-tight">
        <span className="font-mono text-base text-accent">{String(number).padStart(2, "0")}</span>
        {technique.name}
      </h3>
      <p className="mt-1.5 font-medium">{technique.what}</p>

      <BeforeAfter technique={technique} />

      <p className="mt-3 text-sm font-semibold text-ink">Common methods</p>
      <ul className="mt-1.5 flex flex-wrap gap-1.5">
        {technique.methods.map((method) => (
          <li key={method} className="rounded-full border border-line px-2.5 py-0.5 text-sm text-soft">
            {method}
          </li>
        ))}
      </ul>

      <p className="mt-3 text-soft">
        <span className="font-semibold text-ink">Watch out:</span> {technique.watchOut}
      </p>

      <p className="mt-3 text-sm font-semibold text-ink">In Python</p>
      <code className="mt-1 block rounded-lg bg-surface-2 px-3 py-2 font-mono text-[13px] whitespace-pre-wrap text-ink wrap-anywhere">
        {technique.code}
      </code>
      {technique.codeNote && <p className="mt-1 text-sm text-muted">{technique.codeNote}</p>}

      {concept && (
        <Link href={`/concepts/${concept.slug}`} className="mt-1 inline-flex min-h-11 items-center text-[15px] font-medium text-accent hover:underline">
          Full notes: {concept.name} →
        </Link>
      )}
    </section>
  );
}

export default function PreprocessingPage() {
  const leakage = getConcept("data-leakage");
  return (
    <div className="pt-8 text-[17px] leading-relaxed sm:pt-12">
      <h1 className="text-[2rem] leading-tight font-extrabold tracking-tight sm:text-5xl">Data Preprocessing</h1>
      <p className="mt-2 text-lg text-soft">{TECHNIQUES.length} techniques to clean and prepare data before training.</p>

      <section className="mt-6 rounded-xl border-l-[3px] border-accent bg-surface p-4">
        <h2 className="font-bold">The one rule</h2>
        <p className="mt-1 text-soft">{GOLDEN_RULE}</p>
        <Link href={`/concepts/${leakage.slug}`} className="mt-1 inline-flex min-h-11 items-center text-[15px] font-medium text-accent hover:underline">
          Full notes: {leakage.name} →
        </Link>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold tracking-tight">All {TECHNIQUES.length} at a glance</h2>
        <ol className="mt-2">
          {TECHNIQUES.map((technique, index) => (
            <li key={technique.id} className="border-b border-line">
              <a href={`#${technique.id}`} className="flex min-h-12 items-center gap-3 py-1.5 hover:text-accent">
                <span className="w-6 shrink-0 font-mono text-sm text-accent">{String(index + 1).padStart(2, "0")}</span>
                <span className="min-w-0">
                  <span className="block leading-snug font-semibold">{technique.name}</span>
                  <span className="block text-sm leading-snug text-muted">{technique.short}</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="sr-only">Techniques</h2>
        {TECHNIQUES.map((technique, index) => (
          <TechniqueEntry key={technique.id} technique={technique} number={index + 1} />
        ))}
      </section>
    </div>
  );
}

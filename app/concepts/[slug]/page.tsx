import type { Metadata } from "next";
import Link from "next/link";
import { Diagram } from "@/components/Diagram";
import { OG_IMAGE, SITE_TITLE } from "@/config/site";
import { CONCEPTS, type Concept } from "@/content/concepts";
import { getAncestors, getChildren, getConcept, getNeighbours } from "@/lib/concepts";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return CONCEPTS.map((concept) => ({ slug: concept.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { name, definition } = getConcept(slug);
  const title = `${name} | ${SITE_TITLE}`;
  return {
    title: name,
    description: definition,
    alternates: { canonical: `/concepts/${slug}` },
    openGraph: {
      title,
      description: definition,
      type: "article",
      url: `/concepts/${slug}`,
      images: [OG_IMAGE],
    },
    twitter: {
      title,
      description: definition,
      images: [OG_IMAGE],
    },
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-1.5 text-lg font-bold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function ConceptLinks({ concepts }: { concepts: Concept[] }) {
  return (
    <ul>
      {concepts.map((concept) => (
        <li key={concept.slug} className="border-b border-line">
          <Link href={`/concepts/${concept.slug}`} className="flex min-h-12 items-center font-medium text-accent hover:underline">
            {concept.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function NeighbourLink({ concept, direction }: { concept?: Concept; direction: "Previous" | "Next" }) {
  if (!concept) return <span />;
  const isNext = direction === "Next";
  return (
    <Link
      href={`/concepts/${concept.slug}`}
      className={`flex min-h-16 flex-col justify-center rounded-xl border border-line p-3 hover:border-accent ${isNext ? "text-right" : ""}`}
    >
      <span className="text-xs text-muted">{isNext ? "Next →" : "← Previous"}</span>
      <span className="mt-0.5 text-[15px] leading-snug font-semibold">{concept.name}</span>
    </Link>
  );
}

export default async function ConceptPage({ params }: Props) {
  const { slug } = await params;
  const concept = getConcept(slug);
  const { prev, next } = getNeighbours(slug);
  const ancestors = getAncestors(slug);
  const children = getChildren(slug);
  const childSlugs = children.map((child) => child.slug);
  const related = concept.related.filter((item) => !childSlugs.includes(item)).map(getConcept);

  return (
    <article className="pt-4 text-[17px] leading-relaxed sm:pt-6">
      <nav aria-label="Position in the concept tree" className="text-sm leading-relaxed text-muted">
        <Link href="/" className="inline-block py-1 hover:text-ink">
          All
        </Link>
        {" › "}
        <Link href={`/#${concept.category.toLowerCase()}`} className="inline-block py-1 hover:text-ink">
          {concept.category}
        </Link>
        {ancestors.map((ancestor) => (
          <span key={ancestor.slug}>
            {" › "}
            <Link href={`/concepts/${ancestor.slug}`} className="inline-block py-1 hover:text-ink">
              {ancestor.name}
            </Link>
          </span>
        ))}
      </nav>

      <h1 className="mt-2 text-[2rem] leading-tight font-extrabold tracking-tight sm:text-4xl">{concept.name}</h1>
      <p className="mt-1.5 text-sm text-muted">{concept.category} · ~1 min read</p>

      <div className="mt-6 grid gap-7">
        <section className="border-l-[3px] border-accent pl-4">
          <h2 className="mb-1.5 text-lg font-bold tracking-tight">What is it?</h2>
          <p className="font-medium">{concept.definition}</p>
          <p className="mt-2 text-soft">
            <span className="font-semibold text-ink">Key point:</span> {concept.keyPoint}
          </p>
        </section>

        <Section title="Simple explanation">
          <p className="text-soft">{concept.explanation}</p>
        </Section>

        {concept.diagram && <Diagram id={concept.diagram} />}

        <Section title="Example">
          <p className="text-soft">{concept.example}</p>
        </Section>

        <Section title="Interview question">
          <p className="font-semibold">{concept.question.q}</p>
          <p className="mt-1.5 text-soft">{concept.question.a}</p>
        </Section>

        <Section title="Common mistake">
          <p className="text-soft">{concept.mistake}</p>
        </Section>

        {children.length > 0 && (
          <Section title="Builds into">
            <ConceptLinks concepts={children} />
          </Section>
        )}

        {related.length > 0 && (
          <Section title="Related concepts">
            <ConceptLinks concepts={related} />
          </Section>
        )}
      </div>

      <nav aria-label="Previous and next concept" className="mt-9 grid grid-cols-2 gap-3">
        <NeighbourLink concept={prev} direction="Previous" />
        <NeighbourLink concept={next} direction="Next" />
      </nav>
    </article>
  );
}

import { ConceptSearch } from "@/components/ConceptSearch";
import { ConceptTree } from "@/components/ConceptTree";
import { SITE_SUBTITLE, SITE_TITLE } from "@/config/site";
import { CONCEPTS } from "@/content/concepts";

export default function HomePage() {
  return (
    <div className="pt-8 sm:pt-12">
      <h1 className="text-[2rem] leading-tight font-extrabold tracking-tight sm:text-5xl">{SITE_TITLE}</h1>
      <p className="mt-2 text-lg text-soft">{SITE_SUBTITLE}</p>

      <ConceptSearch concepts={CONCEPTS.map(({ slug, name }) => ({ slug, name }))}>
        <section className="mt-8">
          <h2 className="text-xl font-bold tracking-tight">All {CONCEPTS.length} concepts</h2>
          <p className="mt-1 mb-2 text-sm text-muted">Each concept branches from the one it builds on.</p>
          <ConceptTree />
        </section>
      </ConceptSearch>
    </div>
  );
}

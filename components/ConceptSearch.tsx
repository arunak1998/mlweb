"use client";

import Link from "next/link";
import { useState } from "react";

interface Props {
  concepts: { slug: string; name: string }[];
  /** Shown when the search box is empty. */
  children: React.ReactNode;
}

export function ConceptSearch({ concepts, children }: Props) {
  const [query, setQuery] = useState("");
  const search = query.trim().toLowerCase();
  const results = concepts.filter((concept) => concept.name.toLowerCase().includes(search));

  return (
    <>
      <label htmlFor="search" className="sr-only">
        Search concepts by name
      </label>
      <input
        id="search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search concepts, e.g. F1 Score"
        autoComplete="off"
        className="mt-6 min-h-12 w-full rounded-xl border border-line bg-surface px-4 text-base placeholder:text-muted focus:border-accent focus:outline-none"
      />

      {search ? (
        <section className="mt-6" aria-live="polite">
          <p className="text-sm text-muted">
            {results.length} {results.length === 1 ? "result" : "results"}
          </p>
          <ul className="mt-1">
            {results.map((concept) => (
              <li key={concept.slug} className="border-b border-line">
                <Link href={`/concepts/${concept.slug}`} className="flex min-h-12 items-center font-medium hover:text-accent">
                  {concept.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        children
      )}
    </>
  );
}

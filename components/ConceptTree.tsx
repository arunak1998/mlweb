import Link from "next/link";
import type { Concept } from "@/content/concepts";
import { getCategoriesInUse, getChildren, getRoots } from "@/lib/concepts";

function Branch({ concept }: { concept: Concept }) {
  const children = getChildren(concept.slug);
  return (
    <li>
      <Link href={`/concepts/${concept.slug}`} className="flex min-h-12 items-center leading-snug font-medium hover:text-accent">
        {concept.name}
      </Link>
      {children.length > 0 && (
        <ul>
          {children.map((child) => (
            <Branch key={child.slug} concept={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function ConceptTree() {
  return (
    <ul className="tree">
      {getCategoriesInUse().map((category) => (
        <li key={category} id={category.toLowerCase()}>
          <h3 className="flex min-h-12 items-center font-bold text-accent">{category}</h3>
          <ul>
            {getRoots(category).map((concept) => (
              <Branch key={concept.slug} concept={concept} />
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

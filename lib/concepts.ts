import { CATEGORIES, CONCEPTS, type Category, type Concept } from "@/content/concepts";

export function getConcept(slug: string) {
  const concept = CONCEPTS.find((c) => c.slug === slug);
  if (!concept) throw new Error(`Unknown concept slug: "${slug}"`);
  return concept;
}

export function getNeighbours(slug: string) {
  const index = CONCEPTS.findIndex((c) => c.slug === slug);
  return { prev: CONCEPTS[index - 1], next: CONCEPTS[index + 1] };
}

export function getCategoriesInUse() {
  return CATEGORIES.filter((category) => CONCEPTS.some((c) => c.category === category));
}

/** Concepts that branch directly from a category. */
export function getRoots(category: Category) {
  return CONCEPTS.filter((c) => c.category === category && !c.parent);
}

export function getChildren(slug: string) {
  return CONCEPTS.filter((c) => c.parent === slug);
}

/** The path from the top of the category down to this concept's parent. */
export function getAncestors(slug: string): Concept[] {
  const concept = getConcept(slug);
  if (!concept.parent) return [];
  const parent = getConcept(concept.parent);
  if (parent.category !== concept.category) {
    throw new Error(`"${slug}" and its parent "${parent.slug}" must be in the same category`);
  }
  return [...getAncestors(parent.slug), parent];
}

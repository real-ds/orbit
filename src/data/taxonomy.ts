import type { Category, DevelopmentType, Tag } from "@/types";

/**
 * Canonical taxonomy for the tracker.
 *
 * This module is the single source of truth for categories, development types
 * and the tag registry. It intentionally holds no article data so it stays
 * light enough to import from server components, route handlers and client
 * components alike.
 *
 * Slug handling lives here rather than in `lib/utils` because a slug must
 * always resolve back to the exact label it came from. Reconstructing a label
 * from a slug with string surgery (`slug.replace(/-/g, " ")`) loses casing and
 * punctuation, which silently produces empty category and tag pages.
 */

/** Normalise any label into a URL-safe slug. */
export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildSlugIndex<T extends string>(values: readonly T[]) {
  const byValue = new Map<T, string>();
  const bySlug = new Map<string, T>();

  for (const value of values) {
    const slug = slugify(value);
    byValue.set(value, slug);
    // First label wins, so a later duplicate can never shadow an earlier one.
    if (!bySlug.has(slug)) bySlug.set(slug, value);
  }

  return { byValue, bySlug };
}

export const CATEGORIES = [
  "AI Models",
  "Agentic AI",
  "Generative AI",
  "Machine Learning",
  "Deep Learning",
  "AI Research",
  "AI Infrastructure",
  "AI Frameworks & Tools",
  "AI Industry",
  "AI Applications",
  "AI Safety & Policy",
  "Other",
] as const satisfies readonly Category[];

export const DEVELOPMENT_TYPES = [
  "MODEL_RELEASE",
  "MODEL_UPDATE",
  "RESEARCH_PAPER",
  "FRAMEWORK_RELEASE",
  "BENCHMARK",
  "PRODUCT_LAUNCH",
  "FUNDING",
  "ACQUISITION",
  "PARTNERSHIP",
  "REGULATION",
  "OTHER",
] as const satisfies readonly DevelopmentType[];

/**
 * Canonical tag registry. The worker proposes tags and application logic
 * normalises them against this list so naming stays consistent.
 */
export const TAGS: readonly Tag[] = [
  { id: "tag-1", name: "GPT-4", type: "model", count: 45 },
  { id: "tag-2", name: "Claude", type: "model", count: 38 },
  { id: "tag-3", name: "Gemini", type: "model", count: 32 },
  { id: "tag-4", name: "LLaMA", type: "model", count: 28 },
  { id: "tag-5", name: "Mistral", type: "model", count: 22 },
  { id: "tag-6", name: "Transformer", type: "technology", count: 67 },
  { id: "tag-7", name: "RAG", type: "technology", count: 41 },
  { id: "tag-8", name: "Fine-tuning", type: "technology", count: 35 },
  { id: "tag-9", name: "Quantization", type: "technology", count: 29 },
  { id: "tag-10", name: "Agents", type: "concept", count: 56 },
  { id: "tag-11", name: "Tool Use", type: "technology", count: 33 },
  { id: "tag-12", name: "Memory", type: "concept", count: 27 },
  { id: "tag-13", name: "PyTorch", type: "framework", count: 48 },
  { id: "tag-14", name: "TensorFlow", type: "framework", count: 31 },
  { id: "tag-15", name: "JAX", type: "framework", count: 19 },
  { id: "tag-16", name: "vLLM", type: "framework", count: 24 },
  { id: "tag-17", name: "OpenAI", type: "organization", count: 52 },
  { id: "tag-18", name: "Google DeepMind", type: "organization", count: 44 },
  { id: "tag-19", name: "Anthropic", type: "organization", count: 39 },
  { id: "tag-20", name: "Meta AI", type: "organization", count: 35 },
  { id: "tag-21", name: "NVIDIA", type: "organization", count: 41 },
  { id: "tag-22", name: "Hugging Face", type: "organization", count: 28 },
  { id: "tag-23", name: "Multimodal", type: "technology", count: 37 },
  { id: "tag-24", name: "Code Generation", type: "concept", count: 26 },
  { id: "tag-25", name: "Reasoning", type: "concept", count: 31 },
  { id: "tag-26", name: "Alignment", type: "concept", count: 23 },
  { id: "tag-27", name: "Benchmarks", type: "development_type", count: 21 },
  { id: "tag-28", name: "Open Source", type: "concept", count: 43 },
  { id: "tag-29", name: "Enterprise AI", type: "concept", count: 18 },
  { id: "tag-30", name: "Edge AI", type: "technology", count: 15 },
] as const;

const categoryIndex = buildSlugIndex(CATEGORIES);
const developmentTypeIndex = buildSlugIndex(DEVELOPMENT_TYPES);
const tagIndex = buildSlugIndex(TAGS.map((tag) => tag.name));

export function categorySlug(category: Category): string {
  return categoryIndex.byValue.get(category) ?? slugify(category);
}

export function categoryFromSlug(slug: string): Category | undefined {
  return categoryIndex.bySlug.get(slug.toLowerCase());
}

export function categoryHref(category: Category | "All"): string {
  if (category === "All") return "/";
  return `/category/${categorySlug(category)}`;
}

export function developmentTypeSlug(type: DevelopmentType): string {
  return developmentTypeIndex.byValue.get(type) ?? slugify(type);
}

export function developmentTypeFromSlug(slug: string): DevelopmentType | undefined {
  return developmentTypeIndex.bySlug.get(slug.toLowerCase());
}

export function tagSlug(name: string): string {
  return tagIndex.byValue.get(name) ?? slugify(name);
}

/**
 * Resolve a tag slug back to its canonical tag name. Registry tags win;
 * unknown slugs are still accepted so freshly collected articles remain
 * reachable before they are folded into the registry.
 */
export function tagFromSlug(slug: string): string | undefined {
  const normalised = slug.toLowerCase();
  const known = tagIndex.bySlug.get(normalised);
  if (known) return known;

  // Fall back to a case-insensitive match against the registry so legacy
  // links such as /tag/gpt-4 keep resolving.
  return TAGS.find((tag) => tag.name.toLowerCase() === normalised)?.name;
}

export function tagHref(name: string): string {
  return `/tag/${tagSlug(name)}`;
}

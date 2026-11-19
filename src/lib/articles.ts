import type { Article, ArticleFacets, FacetCount } from "@/types";
import { CATEGORIES, DEVELOPMENT_TYPES } from "@/data/taxonomy";

export type SortKey = "newest" | "oldest" | "relevance";

export interface ArticleQuery {
  search?: string;
  categories?: string[];
  developmentTypes?: string[];
  organizations?: string[];
  technologies?: string[];
  tags?: string[];
  sort?: SortKey;
  page?: number;
  limit?: number;
}

function normalise(value: string): string {
  return value.trim().toLowerCase();
}

/** Every field a free-text search is allowed to match against. */
function searchCorpus(article: Article): string {
  return [
    article.headline,
    article.summary,
    article.category,
    article.subcategory ?? "",
    article.developmentType,
    article.source.name,
    ...article.organizations,
    ...article.technologies,
    ...article.tags.map((tag) => tag.name),
  ]
    .join(" ")
    .toLowerCase();
}

/**
 * Relevance score. A headline match outranks a tag match, which outranks a
 * body-only match. Scored against the already-lowercased corpus so the
 * comparison stays case-insensitive without repeated allocations.
 */
export function relevanceScore(article: Article, search: string): number {
  if (!search) return 0;

  const needle = normalise(search);
  if (!needle) return 0;

  let score = 0;
  if (article.headline.toLowerCase().includes(needle)) score += 2;
  if (article.tags.some((tag) => tag.name.toLowerCase().includes(needle))) score += 1;
  if (article.organizations.some((org) => org.toLowerCase().includes(needle))) score += 1;
  return score;
}

export function filterArticles(articles: Article[], query: ArticleQuery = {}): Article[] {
  const search = normalise(query.search ?? "");
  const categories = query.categories?.filter(Boolean) ?? [];
  const developmentTypes = query.developmentTypes?.filter(Boolean) ?? [];
  const organizations = query.organizations?.filter(Boolean) ?? [];
  const technologies = query.technologies?.filter(Boolean) ?? [];
  const tags = query.tags?.filter(Boolean) ?? [];

  return articles.filter((article) => {
    if (categories.length > 0 && !categories.includes(article.category)) return false;
    if (developmentTypes.length > 0 && !developmentTypes.includes(article.developmentType)) return false;
    if (organizations.length > 0 && !article.organizations.some((org) => organizations.includes(org))) return false;
    if (technologies.length > 0 && !article.technologies.some((tech) => technologies.includes(tech))) return false;
    if (tags.length > 0 && !article.tags.some((tag) => tags.includes(tag.name))) return false;
    if (search && !searchCorpus(article).includes(search)) return false;
    return true;
  });
}

export function sortArticles(articles: Article[], sort: SortKey = "newest", search = ""): Article[] {
  const sorted = [...articles];

  switch (sort) {
    case "oldest":
      sorted.sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
      break;
    case "relevance":
      sorted.sort(
        (a, b) =>
          relevanceScore(b, search) - relevanceScore(a, search) ||
          b.publishedAt.localeCompare(a.publishedAt),
      );
      break;
    case "newest":
    default:
      sorted.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
      break;
  }

  return sorted;
}

export function paginate<T>(items: T[], page = 1, limit = 9): T[] {
  const totalPages = Math.max(1, Math.ceil(items.length / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * limit;
  return items.slice(start, start + limit);
}

/** Count how often each value appears across a flat list of values. */
function countValues(values: string[]): FacetCount[] {
  const counts = new Map<string, number>();

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function buildFacets(articles: Article[]): ArticleFacets {
  const categoryOrder = new Map<string, number>(
    CATEGORIES.map((category, index) => [category, index]),
  );
  const developmentTypeOrder = new Map<string, number>(
    DEVELOPMENT_TYPES.map((type, index) => [type, index]),
  );

  return {
    categories: countValues(articles.map((article) => article.category)).sort(
      (a, b) =>
        (categoryOrder.get(a.name) ?? 99) - (categoryOrder.get(b.name) ?? 99),
    ),
    developmentTypes: countValues(articles.map((article) => article.developmentType)).sort(
      (a, b) =>
        (developmentTypeOrder.get(a.name) ?? 99) - (developmentTypeOrder.get(b.name) ?? 99),
    ),
    organizations: countValues(articles.flatMap((article) => article.organizations)),
    technologies: countValues(articles.flatMap((article) => article.technologies)),
  };
}

export function distinctOrganizations(articles: Article[]): string[] {
  return [...new Set(articles.flatMap((article) => article.organizations))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function distinctTechnologies(articles: Article[]): string[] {
  return [...new Set(articles.flatMap((article) => article.technologies))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function distinctTagNames(articles: Article[]): string[] {
  return [...new Set(articles.flatMap((article) => article.tags.map((tag) => tag.name)))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function countByCategory(articles: Article[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const article of articles) {
    counts.set(article.category, (counts.get(article.category) ?? 0) + 1);
  }
  return counts;
}

export function countByTag(articles: Article[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const article of articles) {
    for (const tag of article.tags) {
      counts.set(tag.name, (counts.get(tag.name) ?? 0) + 1);
    }
  }
  return counts;
}

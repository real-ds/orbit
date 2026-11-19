import { NextRequest, NextResponse } from "next/server";
import { getArticlesPaginated } from "@/data/dummy";
import type { SortKey } from "@/lib/articles";

const SORT_KEYS: SortKey[] = ["newest", "oldest", "relevance"];

function parseList(value: string | null): string[] {
  return value?.split(",").map((entry) => entry.trim()).filter(Boolean) ?? [];
}

function parseNumber(value: string | null, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const page = parseNumber(searchParams.get("page"), 1);
  const limit = Math.min(parseNumber(searchParams.get("limit"), 20), 100);
  const search = searchParams.get("search") ?? "";

  const requestedSort = searchParams.get("sort") as SortKey | null;
  const sort: SortKey = requestedSort && SORT_KEYS.includes(requestedSort) ? requestedSort : "newest";

  const categories = parseList(searchParams.get("categories"));
  const developmentTypes = parseList(searchParams.get("developmentTypes"));
  const organizations = parseList(searchParams.get("organizations"));
  const technologies = parseList(searchParams.get("technologies"));
  const tags = parseList(searchParams.get("tags"));

  const result = getArticlesPaginated(page, limit, {
    search,
    categories: categories.length > 0 ? categories : undefined,
    developmentTypes: developmentTypes.length > 0 ? developmentTypes : undefined,
    organizations: organizations.length > 0 ? organizations : undefined,
    technologies: technologies.length > 0 ? technologies : undefined,
    tags: tags.length > 0 ? tags : undefined,
    sort,
  });

  return NextResponse.json({ ...result, sort });
}

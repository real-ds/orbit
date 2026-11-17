import { NextRequest, NextResponse } from "next/server";
import { getArticlesPaginated, dummyArticles } from "@/data/dummy";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const search = searchParams.get("search") || "";
  const categories = searchParams.get("categories")?.split(",").filter(Boolean) || [];
  const developmentTypes = searchParams.get("developmentTypes")?.split(",").filter(Boolean) || [];
  const organizations = searchParams.get("organizations")?.split(",").filter(Boolean) || [];
  const technologies = searchParams.get("technologies")?.split(",").filter(Boolean) || [];
  const sort = (searchParams.get("sort") as "newest" | "oldest" | "relevance") || "newest";

  const result = getArticlesPaginated(page, limit, {
    search,
    categories: categories.length > 0 ? categories : undefined,
    developmentTypes: developmentTypes.length > 0 ? developmentTypes : undefined,
    organizations: organizations.length > 0 ? organizations : undefined,
    technologies: technologies.length > 0 ? technologies : undefined,
  });

  return NextResponse.json({
    ...result,
    sort,
  });
}
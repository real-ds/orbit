import { NextResponse } from "next/server";
import { buildFacets } from "@/lib/articles";
import { dummyArticles } from "@/data/dummy";

export async function GET() {
  const facets = buildFacets(dummyArticles);

  return NextResponse.json({
    categories: facets.categories,
  });
}

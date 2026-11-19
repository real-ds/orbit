import { NextResponse } from "next/server";
import { buildFacets } from "@/lib/articles";
import { collectionRuns, dummyArticles, sources, tags } from "@/data/dummy";

export async function GET() {
  const facets = buildFacets(dummyArticles);
  const latestRun = collectionRuns[0];

  return NextResponse.json({
    totalArticles: dummyArticles.length,
    totalSources: sources.length,
    totalTags: tags.length,
    categories: facets.categories,
    developmentTypes: facets.developmentTypes,
    topOrganizations: facets.organizations.slice(0, 20),
    topTechnologies: facets.technologies.slice(0, 20),
    latestRun: latestRun
      ? {
          id: latestRun.id,
          startedAt: latestRun.startedAt,
          completedAt: latestRun.completedAt,
          status: latestRun.status,
          articlesDiscovered: latestRun.articlesDiscovered,
          articlesInserted: latestRun.articlesInserted,
          articlesDuplicated: latestRun.articlesDuplicated,
          articlesRejected: latestRun.articlesRejected,
          sourcesProcessed: latestRun.sourcesProcessed,
          sourcesFailed: latestRun.sourcesFailed,
        }
      : null,
    recentRuns: collectionRuns.slice(0, 10).map((run) => ({
      id: run.id,
      startedAt: run.startedAt,
      completedAt: run.completedAt,
      status: run.status,
      articlesInserted: run.articlesInserted,
      sourcesProcessed: run.sourcesProcessed,
    })),
  });
}

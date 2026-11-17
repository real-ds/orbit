import { NextResponse } from "next/server";
import { dummyArticles, collectionRuns, categories, developmentTypes, tags, sources } from "@/data/dummy";
import { getCategoryCounts } from "@/data/dummy";

export async function GET() {
  const categoryCounts = getCategoryCounts();
  const devTypeCounts = developmentTypes.map((dt) => ({
    name: dt,
    count: dummyArticles.filter((a) => a.developmentType === dt).length,
  })).filter((d) => d.count > 0);

  const orgCounts = Array.from(new Set(dummyArticles.flatMap((a) => a.organizations)))
    .map((org) => ({
      name: org,
      count: dummyArticles.filter((a) => a.organizations.includes(org)).length,
    }))
    .filter((o) => o.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  const techCounts = Array.from(new Set(dummyArticles.flatMap((a) => a.technologies)))
    .map((tech) => ({
      name: tech,
      count: dummyArticles.filter((a) => a.technologies.includes(tech)).length,
    }))
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  const latestRun = collectionRuns[0];

  return NextResponse.json({
    totalArticles: dummyArticles.length,
    totalSources: sources.length,
    totalTags: tags.length,
    categories: categoryCounts,
    developmentTypes: devTypeCounts,
    topOrganizations: orgCounts,
    topTechnologies: techCounts,
    latestRun: latestRun ? {
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
    } : null,
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
import { NextResponse } from "next/server";
import { countByTag } from "@/lib/articles";
import { dummyArticles } from "@/data/dummy";
import { TAGS } from "@/data/taxonomy";

export async function GET() {
  const registry = new Map(TAGS.map((tag) => [tag.name, tag]));
  const counts = countByTag(dummyArticles);

  const tags = [...new Set([...registry.keys(), ...counts.keys()])]
    .map((name) => {
      const registryTag = registry.get(name);

      return {
        id: registryTag?.id ?? `tag-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        name,
        type: registryTag?.type ?? "concept",
        count: counts.get(name) ?? 0,
      };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  return NextResponse.json({ tags });
}

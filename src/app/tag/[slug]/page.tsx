import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeedView } from "@/components/feed/FeedView";
import { dummyArticles } from "@/data/dummy";
import { TAGS, tagFromSlug, tagSlug } from "@/data/taxonomy";

/** Registry tags plus any tag that only exists on a collected article. */
const ALL_TAG_NAMES = [
  ...new Set([...TAGS.map((tag) => tag.name), ...dummyArticles.flatMap((a) => a.tags.map((t) => t.name))]),
];

export function generateStaticParams() {
  return ALL_TAG_NAMES.map((name) => ({ slug: tagSlug(name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = tagFromSlug(slug);

  if (!tag) return { title: "Tag not found" };

  return {
    title: tag,
    description: `Latest articles tagged ${tag} from Orbit.`,
  };
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tag = tagFromSlug(slug);

  // An unknown slug is a 404, not an empty feed.
  if (!tag) notFound();

  return (
    <>
      <FeedView key={tag} articles={dummyArticles} activeTag={tag} />
    </>
  );
}

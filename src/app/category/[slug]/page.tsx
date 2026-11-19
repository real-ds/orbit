import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeedView } from "@/components/feed/FeedView";
import { dummyArticles } from "@/data/dummy";
import { CATEGORIES, categoryFromSlug, categorySlug } from "@/data/taxonomy";

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ slug: categorySlug(category) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryFromSlug(slug);

  if (!category) return { title: "Category not found" };

  return {
    title: category,
    description: `Latest articles about ${category} from Orbit.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categoryFromSlug(slug);

  // An unknown slug is a 404, not an empty feed.
  if (!category) notFound();

  return (
    <>
      <FeedView key={category} articles={dummyArticles} activeCategory={category} />
    </>
  );
}

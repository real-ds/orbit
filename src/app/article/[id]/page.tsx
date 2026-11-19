import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleDetail } from "@/components/article/ArticleDetail";
import { dummyArticles, getArticleByUrlHash, getRelatedArticles } from "@/data/dummy";

export function generateStaticParams() {
  return dummyArticles.map((article) => ({ id: article.urlHash }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = getArticleByUrlHash(id);

  if (!article) return { title: "Article not found" };

  return {
    title: article.headline,
    description: article.summary,
    openGraph: {
      title: article.headline,
      description: article.summary,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.source.name],
      url: article.canonicalUrl,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = getArticleByUrlHash(id);

  if (!article) notFound();

  const related = getRelatedArticles(article, 3);

  return <ArticleDetail article={article} related={related} />;
}

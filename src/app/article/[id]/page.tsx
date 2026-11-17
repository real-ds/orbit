"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Article } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getArticleByUrlHash, getRelatedArticles } from "@/data/dummy";
import { formatRelativeTime, formatDateTime, formatDevelopmentType, getCategoryHref } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function ArticleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = getArticleByUrlHash(id);
    if (found) {
      setArticle(found);
      setRelated(getRelatedArticles(found, 4));
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-1/4 bg-bg-raised rounded" />
          <div className="aspect-video w-full bg-bg-raised rounded-2xl" />
          <div className="h-6 w-3/4 bg-bg-raised rounded" />
          <div className="h-4 w-full bg-bg-raised rounded" />
          <div className="h-4 w-5/6 bg-bg-raised rounded" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-6 w-full bg-bg-raised rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-accent hover:text-accent-hover mb-8">
          Back to Dashboard
        </Link>
        <div className="mx-auto w-24 h-24 rounded-full bg-bg-raised flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h1 className="font-display text-3xl text-text-primary mb-3">Article not found</h1>
        <p className="text-text-secondary mb-6">The article you're looking for doesn't exist or has been removed.</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-xl hover:bg-accent-hover transition-colors">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const categoryHref = getCategoryHref(article.category);
  const devTypeLabel = article.developmentType.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

  const handleSaveToggle = () => {
    setSaved(!saved);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.headline,
          text: article.summary,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <article className="min-h-screen bg-bg">
      <header className="border-b border-border bg-bg/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="text-text-secondary hover:text-accent transition-colors"
              aria-label="Back to Dashboard"
            >
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleSaveToggle} aria-label={saved ? "Remove from saved" : "Save article"}>
                {saved ? "Saved" : "Save"}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare} aria-label="Share article">
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="pt-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 text-[11px] uppercase tracking-[0.15em] text-text-secondary">
            <Link href="/" className="hover:text-accent transition-colors">Dashboard</Link>
            <span>/</span>
            <Link href={categoryHref} className="hover:text-accent transition-colors">{article.category}</Link>
            <span>/</span>
            <span className="text-text-muted truncate max-w-[200px]">Article</span>
          </nav>

          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Link
              href={categoryHref}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-text-secondary border-border rounded-lg hover:text-text-primary hover:bg-bg-raised transition-colors"
            >
              {article.category}
            </Link>
            <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-medium text-text-muted border-border rounded-lg">
              {devTypeLabel}
            </span>
            {article.subcategory && (
              <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-medium text-text-muted border-border rounded-lg">
                {article.subcategory}
              </span>
            )}
            {article.editorsPick && (
              <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-medium bg-yellow-500/20 text-yellow-400 border-yellow-500/30 rounded-lg">
                Editor's Pick
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-[-0.02em] text-text-primary mb-4">
            {article.headline}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-text-secondary text-sm mb-6">
            <time dateTime={article.publishedAt}>{formatDateTime(article.publishedAt)}</time>
            <span>{article.source.name}</span>
            <span>{article.readMinutes || Math.ceil(article.summary.split(" ").length / 200)} min read</span>
          </div>

          {article.media && (
            <figure className="relative aspect-video w-full rounded-2xl overflow-hidden mb-8 bg-bg-raised">
              <Image
                src={article.media.url}
                alt={article.media.altText}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-bg/90 to-transparent">
                <p className="text-[10px] uppercase tracking-[0.1em] text-text-muted">
                  {article.media.credit ? `Image: ${article.media.credit}` : "AI-generated illustration"}
                </p>
              </figcaption>
            </figure>
          )}

          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-text-primary text-lg leading-relaxed mb-6">{article.summary}</p>

            {article.keyTakeaways.length > 0 && (
              <section className="mb-8">
                <h2 className="font-display text-xl text-text-primary mb-4">Key Takeaways</h2>
                <ul className="space-y-3">
                  {article.keyTakeaways.map((takeaway, i) => (
                    <li key={i} className="text-text-primary leading-relaxed pl-6 relative">
                      <span className="absolute left-0 text-accent">→</span>
                      {takeaway}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="mb-8">
              <h2 className="font-display text-xl text-text-primary mb-4">Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-text-secondary text-sm mb-2">Category</p>
                  <Link
                    href={categoryHref}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-text-secondary border-border rounded-lg hover:text-text-primary hover:bg-bg-raised transition-colors"
                  >
                    {article.category}
                  </Link>
                  {article.subcategory && (
                    <div className="mt-2">
                      <p className="text-text-secondary text-sm mb-1">Subcategory</p>
                      <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-medium text-text-muted border-border rounded-lg">
                        {article.subcategory}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-text-secondary text-sm mb-2">Development Type</p>
                  <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-medium text-text-muted border-border rounded-lg">
                    {formatDevelopmentType(article.developmentType)}
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-text-secondary text-sm mb-3">Technologies & Models</p>
                  <div className="flex flex-wrap gap-2">
                    {article.technologies.map((tech) => (
                      <span key={tech} className="inline-flex items-center px-2.5 py-1 text-[11px] font-medium text-text-secondary border-border rounded-lg">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-text-secondary text-sm mb-3">Organizations</p>
                  <div className="flex flex-wrap gap-2">
                    {article.organizations.map((org) => (
                      <span key={org} className="inline-flex items-center px-2.5 py-1 text-[11px] font-medium text-text-secondary border-border rounded-lg">
                        {org}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-text-secondary text-sm mb-3">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span key={tag.id} className="inline-flex items-center px-2.5 py-1 text-[11px] font-medium text-text-secondary border-border rounded-lg">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-xl text-text-primary mb-4">Source & Attribution</h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 bg-bg-elevated border border-border rounded-xl">
                <div>
                  <p className="font-display text-text-primary">{article.source.name}</p>
                  <p className="text-text-secondary text-sm mt-1">{article.source.url}</p>
                </div>
                <Link
                  href={article.canonicalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-xl hover:bg-accent-hover transition-colors"
                >
                  Read Original Article
                </Link>
              </div>
            </section>
          </div>

          {related.length > 0 && (
            <section className="border-t border-border pt-8">
              <h2 className="font-display text-xl text-text-primary mb-6">Related Articles</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {related.map((relatedArticle) => (
                  <article key={relatedArticle.id} className="group">
                    <Card variant="outlined" padding="md" hover className="h-full" onClick={() => router.push(`/article/${relatedArticle.urlHash}`)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); router.push(`/article/${relatedArticle.urlHash}`); } }} tabIndex={0} role="button" aria-label={`Read article: ${relatedArticle.headline}`}>
                      {relatedArticle.media && (
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-4 -mx-5 -mt-5 mb-0 bg-bg-raised">
                          <Image
                            src={relatedArticle.media.url}
                            alt={relatedArticle.media.altText}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <a
                          href={getCategoryHref(relatedArticle.category)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-text-secondary border-border rounded-lg hover:text-text-primary hover:bg-bg-raised transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {relatedArticle.category}
                        </a>
                        <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-medium text-text-muted border-border rounded-lg">
                          {relatedArticle.developmentType.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                        </span>
                      </div>
                      <h3 className="font-display text-lg leading-snug text-text-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                        {relatedArticle.headline}
                      </h3>
                      <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">
                        {relatedArticle.summary.slice(0, 120)}...
                      </p>
                    </Card>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="border-t border-border bg-bg/80 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-text-secondary text-sm text-center">
            AI Intelligence Tracker &copy; {new Date().getFullYear()} &mdash; Automated AI news aggregation
          </p>
        </div>
      </footer>
    </article>
  );
}
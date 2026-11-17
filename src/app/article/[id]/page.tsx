"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Clock, Building2, Tag, Zap, Bookmark, Share2, ChevronRight } from "lucide-react";
import { Article } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getArticleByUrlHash, getRelatedArticles } from "@/data/dummy";
import { formatRelativeTime, formatDateTime, getCategoryColor, getDevelopmentTypeColor, formatDevelopmentType, getTagTypeColor } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function ArticleDetailPage() {
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
          <div className="h-8 w-1/4 bg-charcoal-800 rounded" />
          <div className="aspect-video w-full bg-charcoal-800 rounded-2xl" />
          <div className="h-6 w-3/4 bg-charcoal-800 rounded" />
          <div className="h-4 w-full bg-charcoal-800 rounded" />
          <div className="h-4 w-5/6 bg-charcoal-800 rounded" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-6 w-full bg-charcoal-800 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-royal-400 hover:text-royal-300 mb-8">
          <ArrowLeft className="h-5 w-5" />
          Back to Dashboard
        </Link>
        <div className="mx-auto w-24 h-24 rounded-full bg-charcoal-800 flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-cream-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h1 className="font-display text-3xl text-cream-10 mb-3">Article not found</h1>
        <p className="text-cream-40 mb-6">The article you're looking for doesn't exist or has been removed.</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-royal-600 text-white px-6 py-3 rounded-xl hover:bg-royal-500 transition-colors">
          <ArrowLeft className="h-5 w-5" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const categoryColor = getCategoryColor(article.category);
  const devTypeColor = getDevelopmentTypeColor(article.developmentType);

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
    <article className="min-h-screen bg-charcoal-900">
      <header className="border-b border-cream-0/10 bg-charcoal-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-cream-40 hover:text-royal-400 transition-colors"
              aria-label="Back to Dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium text-sm hidden sm:block">Dashboard</span>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleSaveToggle} aria-label={saved ? "Remove from saved" : "Save article"}>
                <Bookmark className={cn("h-5 w-5", saved && "fill-royal-500 text-royal-500")} />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare} aria-label="Share article">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="pt-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 font-mono text-[10px] uppercase tracking-[0.15em] text-cream-40">
            <Link href="/" className="hover:text-royal-400 transition-colors">Dashboard</Link>
            <span>/</span>
            <Link href={`/?category=${article.category.toLowerCase()}`} className="hover:text-royal-400 transition-colors">{article.category}</Link>
            <span>/</span>
            <span className="text-cream-20 truncate max-w-[200px]">Article</span>
          </nav>

          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Badge variant="category" className={categoryColor}>
              {article.category}
            </Badge>
            <Badge variant="development" className={devTypeColor}>
              {formatDevelopmentType(article.developmentType)}
            </Badge>
            {article.subcategory && (
              <Badge variant="tag" className="bg-charcoal-700 text-cream-40 border-cream-0/10">
                {article.subcategory}
              </Badge>
            )}
            {article.editorsPick && (
              <Badge variant="tag" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                Editor's Pick
              </Badge>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-[-0.02em] text-cream-10 mb-4">
            {article.headline}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-cream-40 text-sm mb-6">
            <time dateTime={article.publishedAt} className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {formatDateTime(article.publishedAt)}
            </time>
            <span className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              {article.source.name}
            </span>
            <span className="flex items-center gap-1.5">
              <Tag className="h-4 w-4" />
              {article.readMinutes || Math.ceil(article.summary.split(" ").length / 200)} min read
            </span>
          </div>

          {article.media && (
            <figure className="relative aspect-video w-full rounded-2xl overflow-hidden mb-8 bg-charcoal-800">
              <Image
                src={article.media.url}
                alt={article.media.altText}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-charcoal-900/90 to-transparent">
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-cream-40">
                  {article.media.credit ? `Image: ${article.media.credit}` : "AI-generated illustration"}
                </p>
              </figcaption>
            </figure>
          )}

          <div className="prose prose-invert max-w-none mb-8">
            <div className="bg-charcoal-800/50 border border-cream-0/10 rounded-xl p-6 mb-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-royal-400 mb-3">Summary</p>
              <p className="text-cream-10 text-lg leading-relaxed">{article.summary}</p>
            </div>

            {article.keyTakeaways.length > 0 && (
              <section className="mb-8">
                <h2 className="font-display text-xl text-cream-10 mb-4 flex items-center gap-2">
                  <Zap className="h-6 w-6 text-royal-400" />
                  Key Takeaways
                </h2>
                <ul className="space-y-3">
                  {article.keyTakeaways.map((takeaway, i) => (
                    <li key={i} className="flex items-start gap-3 p-4 bg-charcoal-800/50 border border-cream-0/10 rounded-xl">
                      <Zap className="h-5 w-5 text-royal-400 flex-shrink-0 mt-0.5" />
                      <p className="text-cream-10 leading-relaxed">{takeaway}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="mb-8">
              <h2 className="font-display text-xl text-cream-10 mb-4">Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-charcoal-800/50 border border-cream-0/10 rounded-xl p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-cream-40 mb-2">Category</p>
                  <Badge variant="category" className={categoryColor} size="md">
                    {article.category}
                  </Badge>
                  {article.subcategory && (
                    <div className="mt-2">
                      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-cream-40 mb-1">Subcategory</p>
                      <Badge variant="tag" className="bg-charcoal-700 text-cream-40 border-cream-0/10">
                        {article.subcategory}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="bg-charcoal-800/50 border border-cream-0/10 rounded-xl p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-cream-40 mb-2">Development Type</p>
                  <Badge variant="development" className={devTypeColor} size="md">
                    {formatDevelopmentType(article.developmentType)}
                  </Badge>
                </div>

                <div className="bg-charcoal-800/50 border border-cream-0/10 rounded-xl p-5 sm:col-span-2">
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-cream-40 mb-3">Technologies & Models</p>
                  <div className="flex flex-wrap gap-2">
                    {article.technologies.map((tech) => (
                      <Badge key={tech} variant="tag" className={getTagTypeColor("technology")} size="sm">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-charcoal-800/50 border border-cream-0/10 rounded-xl p-5 sm:col-span-2">
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-cream-40 mb-3">Organizations</p>
                  <div className="flex flex-wrap gap-2">
                    {article.organizations.map((org) => (
                      <Badge key={org} variant="tag" className={getTagTypeColor("organization")} size="sm">
                        {org}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-charcoal-800/50 border border-cream-0/10 rounded-xl p-5 sm:col-span-2">
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-cream-40 mb-3">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Badge key={tag.id} variant="tag" className={getTagTypeColor(tag.type)} size="sm">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-xl text-cream-10 mb-4">Source & Attribution</h2>
              <Card variant="outlined" className="bg-charcoal-800/50">
                <CardContent className="pt-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="font-display text-cream-10">{article.source.name}</p>
                      <p className="text-cream-40 text-sm mt-1">{article.source.url}</p>
                    </div>
                    <Link
                      href={article.canonicalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-royal-600 text-white px-5 py-2.5 rounded-xl hover:bg-royal-500 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Read Original Article
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

          {related.length > 0 && (
            <section className="border-t border-cream-0/10 pt-8">
              <h2 className="font-display text-xl text-cream-10 mb-6">Related Articles</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {related.map((relatedArticle) => (
                  <Link key={relatedArticle.id} href={`/article/${relatedArticle.urlHash}`} className="block">
                    <Card variant="outlined" padding="md" hover className="h-full">
                      {relatedArticle.media && (
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-4 -mx-5 -mt-5 mb-0 bg-charcoal-700">
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
                        <Badge variant="category" className={getCategoryColor(relatedArticle.category)} size="sm">
                          {relatedArticle.category}
                        </Badge>
                        <Badge variant="development" className={getDevelopmentTypeColor(relatedArticle.developmentType)} size="sm">
                          {formatDevelopmentType(relatedArticle.developmentType)}
                        </Badge>
                      </div>
                      <h3 className="font-display text-lg leading-snug text-cream-10 mb-2 line-clamp-2 group-hover:text-royal-400 transition-colors">
                        {relatedArticle.headline}
                      </h3>
                      <p className="text-cream-40 text-sm leading-relaxed line-clamp-2">
                        {relatedArticle.summary.slice(0, 120)}...
                      </p>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="border-t border-cream-0/10 bg-charcoal-900/80 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-cream-40 text-sm text-center">
            AI Intelligence Tracker &copy; {new Date().getFullYear()} &mdash; Automated AI news aggregation
          </p>
        </div>
      </footer>
    </article>
  );
}

import { cn } from "@/lib/utils";
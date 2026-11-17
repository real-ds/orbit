"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Article } from "@/types";
import { Button } from "@/components/ui/button";
import { formatRelativeTime, truncate, getCategoryHref } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  onSaveToggle?: (articleId: string, saved: boolean) => void;
  initiallySaved?: boolean;
}

export function ArticleCard({ article, onSaveToggle, initiallySaved = false }: ArticleCardProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(initiallySaved);
  const [imageError, setImageError] = useState(false);

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newSaved = !saved;
    setSaved(newSaved);
    onSaveToggle?.(article.id, newSaved);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleCardClick = () => {
    router.push(`/article/${article.urlHash}`);
  };

  const categoryHref = getCategoryHref(article.category);
  const devTypeLabel = article.developmentType.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <article
      className="group"
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Read article: ${article.headline}`}
    >
      <div className="h-full flex flex-col overflow-hidden bg-bg-elevated/50 transition-all duration-300 hover:bg-bg-elevated hover:shadow-sm rounded-xl">
        {article.media && !imageError ? (
          <div className="article-image-gradient relative">
            <Image
              src={article.media.url}
              alt={article.media.altText}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              onError={handleImageError}
            />
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              <Link
                href={categoryHref}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-black/60 backdrop-blur-sm text-text-primary border-border rounded-lg hover:bg-black/80 transition-colors"
                onClick={(e) => e.stopPropagation()}
                aria-label={`Browse ${article.category}`}
              >
                {article.category}
              </Link>
              <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-medium bg-black/60 backdrop-blur-sm text-text-secondary border-border rounded-lg">
                {devTypeLabel}
              </span>
            </div>
          </div>
        ) : (
          <div className="relative aspect-video w-full bg-bg-raised flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-text-muted">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 002-2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col p-5">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Link
              href={categoryHref}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-text-secondary border-border rounded-lg hover:text-text-primary hover:bg-bg-raised transition-colors"
              onClick={(e) => e.stopPropagation()}
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
          </div>

          <h3 className="font-display text-xl leading-snug text-text-primary mb-3 line-clamp-2 group-hover:text-accent transition-colors">
            {article.headline}
          </h3>

          <p className="text-text-secondary text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
            {truncate(article.summary, 220)}
          </p>

          {article.tags.length > 0 && (
            <ul className="flex flex-wrap gap-1.5 mb-4" role="list" aria-label="Tags">
              {article.tags.slice(0, 4).map((tag) => (
                <li key={tag.id}>
                  <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium text-text-muted border-border rounded-lg">
                    {tag.name}
                  </span>
                </li>
              ))}
              {article.tags.length > 4 && (
                <li>
                  <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium text-text-muted border-border rounded-lg">
                    +{article.tags.length - 4}
                  </span>
                </li>
              )}
            </ul>
          )}

          <div className="mt-auto pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-[12px] text-text-muted">
                <time dateTime={article.publishedAt} className="text-[12px] text-text-muted">
                  {formatRelativeTime(article.publishedAt)}
                </time>
                <span className="text-text-muted">{article.source.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const newSaved = !saved;
                    setSaved(newSaved);
                    onSaveToggle?.(article.id, newSaved);
                  }}
                  aria-label={saved ? "Remove from saved" : "Save article"}
                  className={cn(saved ? "text-accent" : "text-text-muted hover:text-text-primary")}
                >
                  {saved ? "Saved" : "Save"}
                </Button>
                <a
                  href={article.canonicalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted hover:text-text-primary hover:underline text-sm transition-colors"
                  aria-label="Read original article"
                  onClick={(e) => e.stopPropagation()}
                >
                  Read article
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

import Link from "next/link";
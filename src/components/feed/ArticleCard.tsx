"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Bookmark } from "lucide-react";
import type { Article } from "@/types";
import { Artwork } from "@/components/ui/Artwork";
import { useSavedArticles, useToggleSaved } from "@/lib/saved-store";
import { formatArticleDate, seedFromId } from "@/lib/utils";
import { tagHref } from "@/data/taxonomy";

export interface ArticleCardProps {
  article: Article;
  /** Renders the artwork at hero proportions. */
  variant?: "card" | "hero";
  /** Hides the inline save control (used on the saved page itself). */
  hideActions?: boolean;
}

export function ArticleCard({ article, variant = "card", hideActions = false }: ArticleCardProps) {
  const [imageError, setImageError] = useState(false);
  const { ids } = useSavedArticles();
  const toggleSaved = useToggleSaved();

  const isSaved = ids.includes(article.id);
  const seed = seedFromId(article.id);

  return (
    <article className="card">
      <div className="card__media">
        {article.media && !imageError ? (
          <Image
            src={article.media.url}
            alt={article.media.altText}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="card__image"
            onError={() => setImageError(true)}
          />
        ) : (
          <Artwork seed={seed} variant={variant} className="card__artwork" />
        )}
      </div>

      <div className="card__body">
        <p className="meta">
          <span>{article.source.name}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
        </p>

        <h3 className="card__title">
          <Link className="card__link" href={`/article/${article.urlHash}`}>
            {article.headline}
          </Link>
        </h3>

        <p className="card__summary">{article.summary}</p>

        <div className="card__foot">
          {article.tags.length > 0 && (
            <div className="card__tags" aria-label="Tags">
              {article.tags.slice(0, 3).map((tag) => (
                <Link key={tag.id} className="card__tag" href={tagHref(tag.name)}>
                  {tag.name}
                </Link>
              ))}
            </div>
          )}

          {!hideActions && (
            <div className="card__actions">
              <button
                className={`icon-btn bookmark-btn ${isSaved ? "saved" : ""}`}
                onClick={() => toggleSaved(article.id)}
                aria-pressed={isSaved}
                aria-label={isSaved ? `Remove "${article.headline}" from saved` : `Save "${article.headline}" for later`}
                title={isSaved ? "Saved" : "Save for later"}
              >
                <Bookmark
                  size={18}
                  aria-hidden="true"
                  fill={isSaved ? "currentColor" : "none"}
                />
              </button>
              <a
                className="icon-btn source-btn"
                href={article.canonicalUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View article: ${article.headline}`}
                title="View article"
              >
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

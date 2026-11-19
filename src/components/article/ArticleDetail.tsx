"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Bookmark } from "lucide-react";
import type { Article } from "@/types";
import { Artwork } from "@/components/ui/Artwork";
import { Button } from "@/components/ui/button";
import { useSavedArticles, useToggleSaved } from "@/lib/saved-store";
import { formatArticleDate, formatDevelopmentType, seedFromId } from "@/lib/utils";
import { categoryHref, tagHref } from "@/data/taxonomy";

export interface ArticleDetailProps {
  article: Article;
  related: Article[];
}

export function ArticleDetail({ article, related }: ArticleDetailProps) {
  const [imageError, setImageError] = useState(false);
  const { ids } = useSavedArticles();
  const toggleSaved = useToggleSaved();

  const isSaved = ids.includes(article.id);
  const seed = seedFromId(article.id);

  return (
    <article className="detail">
      <Link className="back" href="/">
        ← Back to latest
      </Link>

      <h1 className="detail__title">{article.headline}</h1>

      <p className="detail__byline">
        <span>{article.source.name}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
        {article.subcategory && (
          <>
            <span aria-hidden="true">·</span>
            <span>{article.subcategory}</span>
          </>
        )}
      </p>

      <div className="detail__hero">
        {article.media && !imageError ? (
          <Image
            src={article.media.url}
            alt={article.media.altText}
            fill
            priority
            sizes="(max-width: 820px) 100vw, 1100px"
            className="detail__image"
            onError={() => setImageError(true)}
          />
        ) : (
          <Artwork seed={seed} variant="hero" className="detail__artwork" />
        )}
      </div>

      <div className="detail__cols">
        <div className="detail__main">
          <p className="detail__lead">{article.summary}</p>

          {article.keyTakeaways.length > 0 && (
            <>
              <h2 className="detail__heading">Key takeaways</h2>
              <ul className="detail__takeaways">
                {article.keyTakeaways.map((takeaway) => (
                  <li key={takeaway}>{takeaway}</li>
                ))}
              </ul>
            </>
          )}

          <div className="detail__actions">
            <a className="btn" href={article.canonicalUrl} target="_blank" rel="noopener noreferrer">
              Read original article
              <ArrowUpRight className="btn__icon" aria-hidden="true" />
            </a>
            <Button
              variant="ghost"
              onClick={() => toggleSaved(article.id)}
              aria-pressed={isSaved}
              className={isSaved ? "is-saved" : undefined}
            >
              <Bookmark
                className="btn__icon"
                aria-hidden="true"
                fill={isSaved ? "currentColor" : "none"}
              />
              {isSaved ? "Saved" : "Save for later"}
            </Button>
          </div>
        </div>

        <aside className="detail__aside">
          <dl className="detail__meta">
            <dt>Category</dt>
            <dd>
              <Link href={categoryHref(article.category)}>{article.category}</Link>
            </dd>

            <dt>Development type</dt>
            <dd>{formatDevelopmentType(article.developmentType)}</dd>

            {article.organizations.length > 0 && (
              <>
                <dt>Organizations</dt>
                <dd>{article.organizations.join(", ")}</dd>
              </>
            )}

            {article.technologies.length > 0 && (
              <>
                <dt>Technologies</dt>
                <dd>{article.technologies.join(", ")}</dd>
              </>
            )}

            <dt>Publisher</dt>
            <dd>{article.source.name}</dd>
          </dl>

          {article.tags.length > 0 && (
            <>
              <h2 className="detail__heading">Tags</h2>
              <div className="chips">
                {article.tags.map((tag) => (
                  <Link key={tag.id} className="chip" href={tagHref(tag.name)}>
                    {tag.name}
                  </Link>
                ))}
              </div>
            </>
          )}
        </aside>
      </div>

      {related.length > 0 && (
        <section className="detail__related">
          <h2 className="detail__heading detail__heading--section">Related</h2>
          <ul className="grid" role="list">
            {related.map((item) => (
              <li key={item.id}>
                <article className="card">
                  <div className="card__media">
                    {item.media ? (
                      <Image
                        src={item.media.url}
                        alt={item.media.altText}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="card__image"
                      />
                    ) : (
                      <Artwork seed={seedFromId(item.id)} className="card__artwork" />
                    )}
                  </div>
                  <div className="card__body">
                    <p className="meta">
                      <span>{item.source.name}</span>
                      <span aria-hidden="true">·</span>
                      <time dateTime={item.publishedAt}>{formatArticleDate(item.publishedAt)}</time>
                    </p>
                    <h3 className="card__title">
                      <Link className="card__link" href={`/article/${item.urlHash}`}>
                        {item.headline}
                      </Link>
                    </h3>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

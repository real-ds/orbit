import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found">
      <p className="page-head__eyebrow">404 · Not found</p>
      <h1 className="not-found__title">This page does not exist</h1>
      <p className="not-found__lede">
        The article, category or tag you were looking for is not in the archive. It may have been
        renamed, or the link may be incomplete.
      </p>

      <div className="not-found__actions">
        <Link className="btn" href="/">
          Back to latest
        </Link>
        <Link className="btn btn--ghost" href="/explore">
          Explore articles
        </Link>
        <Link className="btn btn--ghost" href="/search">
          Search
        </Link>
      </div>
    </div>
  );
}

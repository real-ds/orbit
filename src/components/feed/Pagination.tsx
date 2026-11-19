"use client";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return <div className="pager" />;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="pager" aria-label="Pagination">
      <button
        type="button"
        className="pg"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        Prev
      </button>

      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          className="pg"
          onClick={() => onChange(pageNumber)}
          aria-current={pageNumber === page ? "true" : undefined}
          aria-label={`Page ${pageNumber}`}
        >
          {pageNumber}
        </button>
      ))}

      <button
        type="button"
        className="pg"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
}

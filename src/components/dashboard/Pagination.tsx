"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const [inputValue, setInputValue] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    if (currentPage > 4) {
      pages.push("ellipsis");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 3) {
      pages.push("ellipsis");
    }

    pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const page = parseInt(inputValue, 10);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        onPageChange(page);
      }
      setInputValue("");
    }
  };

  const handleInputBlur = () => {
    setInputValue("");
  };

  return (
    <nav className="pagination flex items-center justify-center gap-2 flex-wrap" aria-label="Pagination" role="navigation">
      {/* First page button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        aria-label="First page"
        className="px-2"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Button>

      {/* Previous page button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="px-2"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path d="M15 18l-6-6 6-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Button>

      {/* Page numbers */}
      <ul className="flex items-center gap-1" role="list" aria-label="Page numbers">
        {pageNumbers.map((page, index) =>
          page === "ellipsis" ? (
            <li key={`ellipsis-${index}`} className="px-2 text-text-muted" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={page}>
              <Button
                variant={currentPage === page ? "primary" : "ghost"}
                size="sm"
                onClick={() => onPageChange(page)}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
                className="min-w-[40px] h-9 px-3"
              >
                {page}
              </Button>
            </li>
          ))}
      </ul>

      {/* Next page button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="px-2"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path d="M9 6l6 6-6 6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Button>

      {/* Last page button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        aria-label="Last page"
        className="px-2"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Button>

      {/* Page input - desktop */}
      <div className="hidden md:flex items-center gap-2 ml-2 border-l border-border pl-4">
        <input
          type="number"
          min="1"
          max={totalPages}
          value={inputValue || currentPage}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onBlur={handleInputBlur}
          onFocus={() => setInputValue("")}
          className="w-16 h-9 text-center bg-bg-raised border border-border rounded-lg text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          aria-label="Go to page"
          placeholder={currentPage.toString()}
        />
        <span className="text-text-muted text-sm">of {totalPages}</span>
      </div>

      {/* Mobile page input */}
      <div className="md:hidden flex items-center gap-2 mt-4 w-full justify-center">
        <label htmlFor="page-mobile" className="text-text-muted text-sm">
          of {totalPages}
        </label>
        <input
          id="page-mobile"
          type="number"
          min="1"
          max={totalPages}
          value={inputValue || currentPage}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onBlur={handleInputBlur}
          onFocus={() => setInputValue("")}
          className="w-20 h-9 text-center bg-bg-raised border border-border rounded-lg text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          aria-label="Go to page"
          placeholder={currentPage.toString()}
        />
      </div>
    </nav>
  );
}
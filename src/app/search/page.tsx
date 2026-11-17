import { Suspense } from "react";
import SearchPageClient from "./search-client";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-charcoal-900 flex items-center justify-center">
      <div className="text-center py-16">
        <div className="mx-auto w-12 h-12 rounded-full bg-charcoal-800 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-cream-30 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <p className="text-cream-40">Loading search...</p>
      </div>
    </div>}>
    <SearchPageClient />
  </Suspense>
  );
}
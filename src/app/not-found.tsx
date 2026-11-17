"use client";

import Link from "next/link";
import { ArrowLeft, Zap, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-charcoal-900 flex items-center justify-center px-4">
      <div className="mx-auto w-full max-w-md text-center py-20">
        <div className="mx-auto w-24 h-24 rounded-2xl bg-gradient-to-br from-royal-500 to-purple-600 flex items-center justify-center mb-6">
          <Zap className="h-12 w-12 text-white" />
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-royal-400 mb-3">
          404 &middot; Not Found
        </p>
        <h1 className="font-display text-3xl sm:text-4xl leading-tight text-cream-10 mb-4">
          Page not found
        </h1>
        <p className="text-cream-40 text-base leading-relaxed mb-8">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-royal-600 text-white px-6 py-3 rounded-xl hover:bg-royal-500 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 border border-cream-0/20 text-cream-10 px-6 py-3 rounded-xl hover:bg-charcoal-800 transition-colors"
          >
            <Search className="h-5 w-5" />
            Search Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useSearchParams } from "next/navigation";
import { FeedView } from "@/components/feed/FeedView";
import { dummyArticles } from "@/data/dummy";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  return (
    <>
      <FeedView key={query} articles={dummyArticles} initialQuery={query} />
    </>
  );
}

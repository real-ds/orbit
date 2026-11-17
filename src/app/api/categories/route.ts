import { NextResponse } from "next/server";
import { categories, dummyArticles, getCategoryCounts } from "@/data/dummy";

export async function GET() {
  const counts = getCategoryCounts();

  return NextResponse.json({
    categories: categories.map((cat) => ({
      name: cat,
      count: counts.find((c) => c.category === cat)?.count || 0,
    })).filter((c) => c.count > 0),
  });
}
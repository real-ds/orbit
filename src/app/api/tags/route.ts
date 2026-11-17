import { NextResponse } from "next/server";
import { tags } from "@/data/dummy";

export async function GET() {
  return NextResponse.json({
    tags: tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      type: tag.type,
      count: tag.count || 0,
    })).sort((a, b) => b.count - a.count),
  });
}
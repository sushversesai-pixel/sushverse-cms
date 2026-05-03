import { NextResponse } from "next/server";
import { getRecentDramas } from "@/lib/mydramalist";

export async function GET() {
  try {
    const dramas = await getRecentDramas();
    // Return just the titles to keep payload small
    const titles = dramas.map(d => d.title).sort();
    return NextResponse.json({ titles });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json({ titles: [] }, { status: 500 });
  }
}

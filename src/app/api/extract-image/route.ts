import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "Missing URL" }, { status: 400 });

    // If it's a Pinterest page, fetch the actual image URL from meta tags
    if (url.includes("pinterest.") || url.includes("pin.it")) {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });
      const html = await res.text();
      const $ = cheerio.load(html);
      
      // Pinterest puts the high-res image in og:image
      const imageUrl = $("meta[property='og:image']").attr("content");
      
      if (imageUrl) {
        return NextResponse.json({ imageUrl });
      }
    }
    
    // If we couldn't extract or it's not a supported site, just return the original
    return NextResponse.json({ imageUrl: url });
  } catch (error) {
    console.error("Image extraction error:", error);
    return NextResponse.json({ error: "Failed to extract image" }, { status: 500 });
  }
}

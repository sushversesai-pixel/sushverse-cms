import * as cheerio from "cheerio";
import { fetchCollectionRest } from "./firebase-rest";

export interface DramaItem {
  id: string;
  title: string;
  status: string; // Completed, Dropped, Currently Watching
  coverUrl: string | null;
  link: string;
  review?: string;
  rating?: number | string;
}

export async function getRecentDramas(): Promise<DramaItem[]> {
  try {
    const targetUrl = "https://mydramalist.com/dramalist/sushversesai";
    const apiKey = "68a82a9e268eb61573941d778c05e391";
    // Prepend ScraperAPI proxy to bypass Cloudflare
    const fetchUrl = `http://api.scraperapi.com/?api_key=${apiKey}&url=${encodeURIComponent(targetUrl)}`;
    
    const res = await fetch(fetchUrl, {
      next: { revalidate: 3600 },
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch MDL via ScraperAPI: ${res.status}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);
    const dramas: DramaItem[] = [];

    // Fetch overrides from Firebase REST API to avoid gRPC error
    const overrides = await fetchCollectionRest("kdrama_overrides", "updatedAt", "desc");
    const overrideMap = new Map();
    overrides.forEach((o: any) => {
      overrideMap.set(o.title.trim().toLowerCase(), o);
    });

    // Assuming standard MDL public list structure:
    $("table.table tbody tr").each((i, el) => {
      const titleEl = $(el).find("a.title");
      const title = titleEl.text().trim();
      if (!title) return;

      let link = titleEl.attr("href") || "";
      if (link && !link.startsWith("http")) {
        link = `https://mydramalist.com${link}`;
      }

      // Check for overrides
      const overrideData = overrideMap.get(title.toLowerCase());
      
      // Use override coverUrl if it exists, otherwise use what ScraperAPI found (usually null for MDL)
      let coverUrl = overrideData?.coverUrl || $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || null;

      // Try to determine status based on the table it's in or class
      const statusText = $(el).find(".status").text().trim() || "Completed";

      // Try to find the score (MDL uses 10-point scale)
      const scoreText = $(el).find(".score").text().trim();
      let scrapedRating: number | undefined;
      if (scoreText && !isNaN(parseFloat(scoreText))) {
        // Convert MDL's 10-point scale to a 5-star integer scale for visual stars
        scrapedRating = Math.round(parseFloat(scoreText) / 2);
      }

      // Try to extract notes/reviews if the user enabled the Notes column
      let scrapedReview: string | undefined;
      const noteEl = $(el).find('.note, .list-note, td[class*="note"], .remarks');
      if (noteEl.length > 0) {
        scrapedReview = noteEl.text().trim();
      }

      dramas.push({
        id: title,
        title,
        status: statusText,
        coverUrl,
        link,
        review: overrideData?.review || scrapedReview || null,
        rating: overrideData?.rating || scrapedRating
      } as any);
    });

    return dramas;
  } catch (error) {
    console.warn("Notice: Could not fetch MyDramaList data via ScraperAPI.");
    return [];
  }
}

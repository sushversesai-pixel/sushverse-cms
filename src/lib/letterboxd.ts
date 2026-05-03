import Parser from "rss-parser";

const parser = new Parser({
  customFields: {
    item: ["letterboxd:filmTitle", "letterboxd:filmYear", "letterboxd:memberRating", "letterboxd:watchedDate", "description"],
  },
});

export interface MovieItem {
  id: string;
  title: string;
  year: string;
  rating: string;
  watchedDate: string;
  review: string;
  link: string;
  posterUrl: string | null;
}

export async function getRecentMovies(username: string = "starletbean"): Promise<MovieItem[]> {
  try {
    const feed = await parser.parseURL(`https://letterboxd.com/${username}/rss/`);
    
    return feed.items.map((rawItem) => {
      const item = rawItem as any;
      // Extract poster image from description (HTML)
      const imgSrcMatch = item.description?.match(/src="([^"]+)"/);
      const posterUrl = imgSrcMatch ? imgSrcMatch[1] : null;

      // Extract review text (remove the poster img tag and the rating text)
      let review = "";
      if (item.description) {
        // Simple regex to strip HTML tags for a clean excerpt
        let textOnly = item.description.replace(/<[^>]*>?/gm, "").trim();
        
        // Remove Letterboxd's auto-generated "Watched on..." or "Rewatched on..." text
        textOnly = textOnly.replace(/^(Re)?watched on.*?\d{4}\.?\s*/is, "").trim();
        
        // Sometimes it leaves behind just star ratings in the text like "★★★★", 
        // we can remove those too since we already have the rating variable.
        textOnly = textOnly.replace(/^[★½\s]+$/, "").trim();

        if (textOnly.length > 2) {
          review = textOnly;
        }
      }

      return {
        id: item.guid || item.link || Math.random().toString(),
        title: item["letterboxd:filmTitle"] || item.title || "Unknown Film",
        year: item["letterboxd:filmYear"] || "",
        rating: item["letterboxd:memberRating"] || "",
        watchedDate: item["letterboxd:watchedDate"] || item.pubDate || "",
        review,
        link: item.link || "",
        posterUrl,
      };
    });
  } catch (error) {
    console.warn("Notice: Could not fetch Letterboxd RSS data. Returning empty list.");
    return [];
  }
}

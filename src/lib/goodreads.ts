import Parser from "rss-parser";

const parser = new Parser({
  customFields: {
    item: ["book_large_image_url", "book_medium_image_url", "author_name", "user_rating", "user_review", "user_date_added"],
  },
});

export interface BookItem {
  id: string;
  title: string;
  author: string;
  rating: number;
  review: string;
  coverUrl: string | null;
  link: string;
}

export async function getRecentBooks(userId: string = "134004880-sai"): Promise<BookItem[]> {
  try {
    // Goodreads RSS for the "read" shelf. We request up to 100 books (the typical maximum for RSS feeds).
    const feed = await parser.parseURL(`https://www.goodreads.com/review/list_rss/${userId}?shelf=read&per_page=100`);
    
    return feed.items.map((rawItem) => {
      const item = rawItem as any;
      // Sometimes Goodreads injects HTML into user_review
      let cleanReview = item.user_review || "";
      if (cleanReview) {
        cleanReview = cleanReview.replace(/<[^>]*>?/gm, "").trim();
      }

      // If no explicit image field is found, fallback to extracting it from the description
      let coverUrl = item.book_large_image_url || item.book_medium_image_url || null;
      if (!coverUrl && item.description) {
        const imgSrcMatch = item.description.match(/src="([^"]+)"/);
        if (imgSrcMatch) {
          coverUrl = imgSrcMatch[1];
        }
      }

      return {
        id: item.guid || item.link || Math.random().toString(),
        title: item.title || "Unknown Book",
        author: item.author_name || "",
        rating: item.user_rating ? parseInt(item.user_rating) : 0,
        review: cleanReview,
        link: item.link || "",
        coverUrl,
      };
    });
  } catch (error) {
    console.warn("Notice: Could not fetch Goodreads RSS data. Returning empty list.");
    return [];
  }
}

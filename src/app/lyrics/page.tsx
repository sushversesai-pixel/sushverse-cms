import { fetchCollectionRest, fetchDocumentRest } from "@/lib/firebase-rest";
import { LyricCard, type LyricItem } from "@/components/LyricCard";

export const revalidate = 60; // Revalidate every minute

async function getLyrics(): Promise<LyricItem[]> {
  try {
    const docs = await fetchCollectionRest("lyrics", "createdAt", "desc");
    return docs as LyricItem[];
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    return [];
  }
}

export default async function LyricsPage() {
  const [lyrics, headerData] = await Promise.all([
    getLyrics(),
    fetchDocumentRest("page_settings", "lyrics")
  ]);

  const pageTitle = headerData?.title || "Lyrics";
  const pageSubtitle = headerData?.subtitle || "Snippets of songs that I can't get out of my head.";

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
      <header className="mb-12 text-right">
        <h1 className="text-4xl font-extrabold mb-4">{pageTitle}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          {pageSubtitle}
        </p>
      </header>

      {lyrics.length === 0 ? (
        <div className="py-20 text-center text-gray-500">
          No lyrics have been added yet.
        </div>
      ) : (
        <div className="columns-1 md:columns-2 gap-6 space-y-6">
          {lyrics.map((lyric) => (
            <div key={lyric.id} className="break-inside-avoid">
              <LyricCard lyric={lyric} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

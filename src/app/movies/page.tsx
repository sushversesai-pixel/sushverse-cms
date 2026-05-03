import { getRecentMovies } from "@/lib/letterboxd";
import { fetchDocumentRest } from "@/lib/firebase-rest";
import { FlipCard } from "@/components/FlipCard";

export const revalidate = 60;

export default async function MoviesPage() {
  const [movies, headerData] = await Promise.all([
    getRecentMovies("starletbean"),
    fetchDocumentRest("page_settings", "movies")
  ]);

  const pageTitle = headerData?.title || "Movies";
  const pageSubtitle = headerData?.subtitle || "Recent watches synced from Letterboxd.";

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
      <header className="mb-12 text-right">
        <h1 className="text-4xl font-extrabold mb-4">{pageTitle}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          {pageSubtitle}
        </p>
      </header>

      {movies.length === 0 ? (
        <div className="py-12 text-center text-gray-500 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-gray-200 dark:border-gray-800">
          <p>No recent movies found or failed to load.</p>
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 md:gap-6">
          {movies.map((movie) => (
            <div key={movie.id} className="break-inside-avoid mb-6">
              <FlipCard
                title={movie.title}
                subtitle={movie.year ? `(${movie.year})` : ""}
                coverUrl={movie.posterUrl}
                rating={movie.rating}
                review={movie.review}
                link={movie.link}
                date={movie.watchedDate}
                emptyMessage="Watched it and that's all, not a review."
                colorTheme="blue"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

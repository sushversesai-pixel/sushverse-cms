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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {movies.map((movie) => (
          <FlipCard
            key={movie.id}
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
        ))}
        {movies.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            No recent movies found or failed to load.
          </div>
        )}
      </div>
    </div>
  );
}

import { MovieGallery } from "@/components/MovieGallery";

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
        <MovieGallery movies={movies as any} />
      )}
    </div>
  );
}

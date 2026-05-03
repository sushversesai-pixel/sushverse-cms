import { getRecentBooks } from "@/lib/goodreads";
import { fetchDocumentRest } from "@/lib/firebase-rest";
import { FlipCard } from "@/components/FlipCard";

export const revalidate = 3600; // Revalidate every hour

export default async function BooksPage() {
  const [books, headerData] = await Promise.all([
    getRecentBooks("134004880-sai"),
    fetchDocumentRest("page_settings", "books")
  ]);

  const pageTitle = headerData?.title || "Library";
  const pageSubtitle = headerData?.subtitle || "My reading list, synced from Goodreads. Click a book to see my rating and review.";

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
      <header className="mb-12 text-right">
        <h1 className="text-4xl font-extrabold mb-4">{pageTitle}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          {pageSubtitle}
        </p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {books.map((book) => (
          <FlipCard
            key={book.id}
            title={book.title}
            subtitle={book.author}
            coverUrl={book.coverUrl}
            rating={book.rating}
            review={book.review}
            link={book.link}
            colorTheme="emerald"
          />
        ))}
        {books.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            No recent books found or failed to load.
          </div>
        )}
      </div>
    </div>
  );
}

import { getRecentBooks } from "@/lib/goodreads";
import { fetchDocumentRest } from "@/lib/firebase-rest";
import { FlipCard } from "@/components/FlipCard";

export const revalidate = 60;

export default async function BooksPage() {
  const userId = "134004880-sai";
  
  const [readBooks, currentlyReading, toRead, headerData] = await Promise.all([
    getRecentBooks(userId, "read"),
    getRecentBooks(userId, "currently-reading"),
    getRecentBooks(userId, "to-read"),
    fetchDocumentRest("page_settings", "books")
  ]);

  const pageTitle = headerData?.title || "Library";
  const pageSubtitle = headerData?.subtitle || "My reading list, synced from Goodreads. Click a book to see my rating and review.";

  const allBooks = [...currentlyReading, ...readBooks, ...toRead];

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
      <header className="mb-12 text-right">
        <h1 className="text-4xl font-extrabold mb-4">{pageTitle}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          {pageSubtitle}
        </p>
      </header>

      {allBooks.length === 0 && (
        <div className="py-12 text-center text-gray-500 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-gray-200 dark:border-gray-800">
          <p>No books found in your library.</p>
        </div>
      )}

      {currentlyReading.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="w-3 h-3 rounded-full bg-blue-500 mr-3 animate-pulse"></span>
            Currently Reading
            <span className="ml-3 text-sm font-normal text-gray-400">({currentlyReading.length})</span>
          </h2>
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 md:gap-6">
            {currentlyReading.map((book) => (
              <div key={book.id} className="break-inside-avoid mb-6">
                <FlipCard
                  title={book.title}
                  subtitle={book.author}
                  status="Reading"
                  coverUrl={book.coverUrl}
                  link={book.link}
                  colorTheme="emerald"
                  rating={book.rating}
                  review={book.review}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {readBooks.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="w-3 h-3 rounded-full bg-emerald-500 mr-3"></span>
            Finished
            <span className="ml-3 text-sm font-normal text-gray-400">({readBooks.length})</span>
          </h2>
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 md:gap-6">
            {readBooks.map((book) => (
              <div key={book.id} className="break-inside-avoid mb-6">
                <FlipCard
                  title={book.title}
                  subtitle={book.author}
                  coverUrl={book.coverUrl}
                  link={book.link}
                  colorTheme="emerald"
                  rating={book.rating}
                  review={book.review}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {toRead.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="w-3 h-3 rounded-full bg-amber-500 mr-3"></span>
            Want to Read
            <span className="ml-3 text-sm font-normal text-gray-400">({toRead.length})</span>
          </h2>
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 md:gap-6">
            {toRead.map((book) => (
              <div key={book.id} className="break-inside-avoid mb-6">
                <FlipCard
                  title={book.title}
                  subtitle={book.author}
                  status="Wishlist"
                  coverUrl={book.coverUrl}
                  link={book.link}
                  colorTheme="emerald"
                  rating={book.rating}
                  review={book.review}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}


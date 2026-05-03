import { getRecentDramas } from "@/lib/mydramalist";
import { fetchDocumentRest } from "@/lib/firebase-rest";
import { FlipCard } from "@/components/FlipCard";

export const revalidate = 3600;

export default async function KDramasPage() {
  const [dramas, headerData] = await Promise.all([
    getRecentDramas(),
    fetchDocumentRest("page_settings", "k-dramas")
  ]);

  const pageTitle = headerData?.title || "K-Dramas";
  const pageSubtitle = headerData?.subtitle || "Tracked shows from MyDramaList.";

  const completedDramas = dramas.filter(d => !d.status.toLowerCase().includes("drop"));
  const droppedDramas = dramas.filter(d => d.status.toLowerCase().includes("drop"));

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
      <header className="mb-12 text-right">
        <h1 className="text-4xl font-extrabold mb-4">{pageTitle}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          {pageSubtitle}
        </p>
      </header>

      {dramas.length === 0 && (
        <div className="py-12 text-center text-gray-500 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-gray-200 dark:border-gray-800">
          <p>No recent K-Dramas found.</p>
          <p className="text-sm mt-2">Make sure your MyDramaList profile is public and has items.</p>
        </div>
      )}

      {completedDramas.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="w-3 h-3 rounded-full bg-emerald-500 mr-3"></span>
            Watched & Watching
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {completedDramas.map((drama) => (
              <FlipCard
                key={drama.id}
                title={drama.title}
                status={drama.status.toLowerCase() === "completed" ? undefined : drama.status}
                coverUrl={drama.coverUrl}
                link={drama.link}
                colorTheme="rose"
                rating={drama.rating}
                review={(drama as any).review || null} // Optional review from manual overrides
              />
            ))}
          </div>
        </section>
      )}

      {droppedDramas.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="w-3 h-3 rounded-full bg-rose-500 mr-3"></span>
            Dropped
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 opacity-70">
            {droppedDramas.map((drama) => (
              <FlipCard
                key={drama.id}
                title={drama.title}
                status={drama.status}
                coverUrl={drama.coverUrl}
                link={drama.link}
                colorTheme="rose"
                rating={drama.rating}
                review={(drama as any).review || null}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}



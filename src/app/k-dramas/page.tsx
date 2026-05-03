import { getRecentDramas } from "@/lib/mydramalist";
import { fetchDocumentRest } from "@/lib/firebase-rest";
import { FlipCard } from "@/components/FlipCard";

export const revalidate = 60;

export default async function KDramasPage() {
  const [dramas, headerData] = await Promise.all([
    getRecentDramas(),
    fetchDocumentRest("page_settings", "k-dramas")
  ]);

  const pageTitle = headerData?.title || "K-Dramas";
  const pageSubtitle = headerData?.subtitle || "Tracked shows from MyDramaList.";

  const currentlyWatching = dramas.filter(d => d.status.toLowerCase().includes("currently watching"));
  const completed = dramas.filter(d => d.status.toLowerCase() === "completed");
  const planToWatch = dramas.filter(d => d.status.toLowerCase().includes("plan to watch"));
  const dropped = dramas.filter(d => d.status.toLowerCase().includes("drop"));
  // Anything that doesn't match goes into completed as a fallback
  const onHold = dramas.filter(d => d.status.toLowerCase().includes("on hold"));

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

      {currentlyWatching.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="w-3 h-3 rounded-full bg-blue-500 mr-3 animate-pulse"></span>
            Currently Watching
            <span className="ml-3 text-sm font-normal text-gray-400">({currentlyWatching.length})</span>
          </h2>
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 md:gap-6">
            {currentlyWatching.map((drama) => (
              <div key={drama.id} className="break-inside-avoid mb-6">
                <FlipCard
                  title={drama.title}
                  subtitle={drama.year ? `(${drama.year})` : ""}
                  status="Watching"
                  coverUrl={drama.coverUrl}
                  link={drama.link}
                  colorTheme="rose"
                  rating={drama.rating}
                  review={(drama as any).review || null}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {completed.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="w-3 h-3 rounded-full bg-emerald-500 mr-3"></span>
            Completed
            <span className="ml-3 text-sm font-normal text-gray-400">({completed.length})</span>
          </h2>
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 md:gap-6">
            {completed.map((drama) => (
              <div key={drama.id} className="break-inside-avoid mb-6">
                <FlipCard
                  key={drama.id}
                  title={drama.title}
                  subtitle={drama.year ? `(${drama.year})` : ""}
                  coverUrl={drama.coverUrl}
                  link={drama.link}
                  colorTheme="rose"
                  rating={drama.rating}
                  review={(drama as any).review || null}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {planToWatch.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="w-3 h-3 rounded-full bg-amber-500 mr-3"></span>
            Plan to Watch
            <span className="ml-3 text-sm font-normal text-gray-400">({planToWatch.length})</span>
          </h2>
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 md:gap-6">
            {planToWatch.map((drama) => (
              <div key={drama.id} className="break-inside-avoid mb-6">
                <FlipCard
                  title={drama.title}
                  subtitle={drama.year ? `(${drama.year})` : ""}
                  status="Plan to Watch"
                  coverUrl={drama.coverUrl}
                  link={drama.link}
                  colorTheme="rose"
                  rating={drama.rating}
                  review={(drama as any).review || null}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {onHold.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="w-3 h-3 rounded-full bg-orange-400 mr-3"></span>
            On Hold
            <span className="ml-3 text-sm font-normal text-gray-400">({onHold.length})</span>
          </h2>
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 md:gap-6 opacity-80">
            {onHold.map((drama) => (
              <div key={drama.id} className="break-inside-avoid mb-6">
                <FlipCard
                  title={drama.title}
                  subtitle={drama.year ? `(${drama.year})` : ""}
                  status="On Hold"
                  coverUrl={drama.coverUrl}
                  link={drama.link}
                  colorTheme="rose"
                  rating={drama.rating}
                  review={(drama as any).review || null}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {dropped.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="w-3 h-3 rounded-full bg-rose-500 mr-3"></span>
            Dropped
            <span className="ml-3 text-sm font-normal text-gray-400">({dropped.length})</span>
          </h2>
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 md:gap-6">
            {dropped.map((drama) => (
              <div key={drama.id} className="break-inside-avoid mb-6">
                <FlipCard
                  title={drama.title}
                  subtitle={drama.year ? `(${drama.year})` : ""}
                  status={drama.status}
                  coverUrl={drama.coverUrl}
                  link={drama.link}
                  colorTheme="rose"
                  rating={drama.rating}
                  review={(drama as any).review || null}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}



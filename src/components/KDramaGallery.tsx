"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { FlipCard } from "./FlipCard";

interface Drama {
  id: string;
  title: string;
  year?: string;
  status: string;
  coverUrl: string;
  link: string;
  rating?: number;
  review?: string;
}

export function KDramaGallery({ dramas }: { dramas: Drama[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDramas = dramas.filter((drama) =>
    drama.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    drama.year?.toString().includes(searchQuery)
  );

  const currentlyWatching = filteredDramas.filter(d => d.status.toLowerCase().includes("currently watching"));
  const completed = filteredDramas.filter(d => d.status.toLowerCase() === "completed");
  const planToWatch = filteredDramas.filter(d => d.status.toLowerCase().includes("plan to watch"));
  const dropped = filteredDramas.filter(d => d.status.toLowerCase().includes("drop"));
  const onHold = filteredDramas.filter(d => d.status.toLowerCase().includes("on hold"));

  const hasResults = filteredDramas.length > 0;

  return (
    <div className="space-y-12">
      {/* Search Bar */}
      <div className="relative max-w-md ml-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search dramas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-11 pr-10 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {!hasResults && searchQuery ? (
        <div className="py-20 text-center text-gray-500 bg-gray-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
          <p className="text-lg font-medium">No dramas found matching "{searchQuery}"</p>
          <p className="text-sm mt-1 text-gray-400">Try a different title or year.</p>
        </div>
      ) : (
        <>
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
                      review={drama.review || null}
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
                      title={drama.title}
                      subtitle={drama.year ? `(${drama.year})` : ""}
                      coverUrl={drama.coverUrl}
                      link={drama.link}
                      colorTheme="rose"
                      rating={drama.rating}
                      review={drama.review || null}
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
                      review={drama.review || null}
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
                      review={drama.review || null}
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
                      review={drama.review || null}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

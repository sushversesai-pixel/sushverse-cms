"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { FlipCard } from "./FlipCard";

interface Movie {
  id: string;
  title: string;
  year?: string;
  posterUrl: string;
  rating?: number;
  review?: string;
  link: string;
  watchedDate?: string;
}

export function MovieGallery({ movies }: { movies: Movie[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.year?.toString().includes(searchQuery)
  );

  return (
    <div className="space-y-12">
      {/* Search Bar */}
      <div className="relative max-w-md ml-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-11 pr-10 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
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

      {filteredMovies.length === 0 ? (
        <div className="py-20 text-center text-gray-500 bg-gray-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
          <p className="text-lg font-medium">No movies found matching "{searchQuery}"</p>
          <p className="text-sm mt-1 text-gray-400">Try a different title or year.</p>
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 md:gap-6">
          {filteredMovies.map((movie) => (
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

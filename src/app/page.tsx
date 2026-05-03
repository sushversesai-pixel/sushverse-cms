import { fetchDocumentRest } from "@/lib/firebase-rest";
import Link from "next/link";
import { ArrowRight, Film, Tv, Book, Star } from "lucide-react";
import Image from "next/image";

import { getRecentMovies } from "@/lib/letterboxd";
import { getRecentDramas } from "@/lib/mydramalist";
import { getRecentBooks } from "@/lib/goodreads";


export const revalidate = 3600;

async function getSiteSettings() {
  try {
    const data = await fetchDocumentRest("page_settings", "global_config");
    if (data) {
      return {
        siteName: data.siteName || "Sushverse",
        introText: data.introText || "A digital reflection of my media taste, thoughts, and creativity."
      };
    }
  } catch (error) {
    console.error("Error fetching settings:", error);
  }
  return {
    siteName: "Sushverse",
    introText: "A digital reflection of my media taste, thoughts, and creativity.",
  };
}

export default async function Home() {
  const settings = await getSiteSettings();
  
  // Fetch recent items in parallel
  const [movies, dramas, books] = await Promise.all([
    getRecentMovies(),
    getRecentDramas(),
    getRecentBooks()
  ]);

  const latestMovie = movies.length > 0 ? movies[0] : null;
  const latestDrama = dramas.length > 0 ? dramas[0] : null;
  const latestBook = books.length > 0 ? books[0] : null;

  return (
    <div className="flex-1 flex flex-col items-center max-w-6xl mx-auto w-full px-4 py-16 relative">
      <section className="w-full max-w-3xl text-right space-y-6 mt-8 mb-20 ml-auto z-10 relative">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-500 pb-2">
          {settings.siteName}
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-medium">
          {settings.introText}
        </p>
      </section>

      <div className="w-full mb-12 flex items-center justify-between">
        <h2 className="text-3xl font-bold">Recent Updates</h2>
      </div>

      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Latest Movie Card */}
        <Link href="/movies" className="group flex flex-col relative rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-black/80 backdrop-blur text-blue-600 dark:text-blue-400 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <Film size={14} /> MOVIES
          </div>
          <div className="aspect-video w-full bg-gray-100 dark:bg-zinc-800 relative overflow-hidden">
             {latestMovie?.posterUrl && (
               <Image src={latestMovie.posterUrl} alt="Movie" fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" unoptimized />
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
             <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-bold text-xl line-clamp-1">{latestMovie?.title || "No movies yet"}</h3>
                {latestMovie?.rating && (
                  <div className="flex items-center text-sm text-yellow-400 mt-1">
                    <Star size={14} className="fill-current mr-1" /> {latestMovie.rating}
                  </div>
                )}
             </div>
          </div>
          <div className="p-5 flex items-center justify-between bg-white dark:bg-zinc-900">
             <span className="text-sm font-medium text-gray-500">View Full Diary</span>
             <ArrowRight size={18} className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        {/* Latest KDrama Card */}
        <Link href="/k-dramas" className="group flex flex-col relative rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-black/80 backdrop-blur text-rose-600 dark:text-rose-400 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <Tv size={14} /> K-DRAMAS
          </div>
          <div className="aspect-video w-full bg-gray-100 dark:bg-zinc-800 relative overflow-hidden">
             {latestDrama?.coverUrl && (
               <Image src={latestDrama.coverUrl} alt="Drama" fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" unoptimized />
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
             <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-bold text-xl line-clamp-1">{latestDrama?.title || "No shows yet"}</h3>
                <div className="text-sm text-gray-300 mt-1">{latestDrama?.status || ""}</div>
             </div>
          </div>
          <div className="p-5 flex items-center justify-between bg-white dark:bg-zinc-900">
             <span className="text-sm font-medium text-gray-500">View Watchlist</span>
             <ArrowRight size={18} className="text-gray-400 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        {/* Latest Book Card */}
        <Link href="/books" className="group flex flex-col relative rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-black/80 backdrop-blur text-emerald-600 dark:text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <Book size={14} /> BOOKS
          </div>
          <div className="aspect-video w-full bg-gray-100 dark:bg-zinc-800 relative overflow-hidden">
             {latestBook?.coverUrl && (
               <Image src={latestBook.coverUrl} alt="Book" fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" unoptimized />
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
             <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-bold text-xl line-clamp-1">{latestBook?.title || "No books yet"}</h3>
                <div className="text-sm text-gray-300 mt-1 line-clamp-1">{latestBook?.author || ""}</div>
             </div>
          </div>
          <div className="p-5 flex items-center justify-between bg-white dark:bg-zinc-900">
             <span className="text-sm font-medium text-gray-500">View Library</span>
             <ArrowRight size={18} className="text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

      </section>

    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export interface FlipCardProps {
  title: string;
  subtitle?: string;
  coverUrl?: string | null;
  rating?: number | string | null;
  review?: string | null;
  link?: string;
  status?: string;
  date?: string;
  emptyMessage?: string;
  alwaysShowOverlay?: boolean;
  colorTheme?: "blue" | "rose" | "emerald" | "gray";
}

export function FlipCard({ 
  title, 
  subtitle, 
  coverUrl, 
  rating, 
  review, 
  link, 
  status, 
  date,
  emptyMessage = "No review provided.",
  alwaysShowOverlay = false,
  colorTheme = "gray" 
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Define accent colors based on theme
  const accentColors = {
    blue: "text-blue-500",
    rose: "text-rose-500",
    emerald: "text-emerald-500",
    gray: "text-gray-500",
  };
  
  const accentColor = accentColors[colorTheme];

  return (
    <div
      className="relative aspect-[2/3] w-full cursor-pointer perspective-1000 group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative transform-style-3d transition-all duration-500 rounded-xl shadow-md group-hover:shadow-xl group-hover:-translate-y-1 z-10"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front of Card */}
        <div className="absolute inset-0 backface-hidden bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden flex flex-col items-center justify-center text-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 15vw"
              unoptimized
            />
          ) : (
            <div className="p-4">
              <span className={`font-bold text-lg leading-snug ${accentColor} opacity-80`}>{title}</span>
            </div>
          )}
          
          {/* Hover Overlay on Front (Always visible if alwaysShowOverlay is true) */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-300 rounded-xl pointer-events-none ${alwaysShowOverlay ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
          
          <div className={`absolute bottom-3 left-3 right-3 text-white text-left flex flex-col gap-1 transition-opacity duration-300 pointer-events-none ${alwaysShowOverlay ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            <p className="font-bold text-sm line-clamp-2">{title}</p>
            {subtitle && <p className="text-xs text-gray-300 line-clamp-1">{subtitle}</p>}
            
            <div className="flex items-center justify-between mt-1">
              {rating ? (
                <div className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-sm">
                  <Star size={10} className="fill-current text-yellow-400" />
                  <span className="text-xs font-semibold">{rating}</span>
                </div>
              ) : <div />}
              
              {status && (
                <span className={`text-[10px] font-bold uppercase tracking-wider bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-sm ${accentColor}`}>
                  {status}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex flex-col items-center text-center overflow-hidden">
          
          {/* Header area - always visible at top */}
          <div className="shrink-0 w-full flex flex-col items-center">
            <h3 className="font-bold text-base mb-1 line-clamp-2 text-black dark:text-white">{title}</h3>
            {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{subtitle}</p>}
            
            {rating ? (() => {
              const numRating = typeof rating === 'number' ? rating : parseFloat(String(rating));
              const isNumeric = !isNaN(numRating);
              
              return (
                <div className="flex flex-col items-center mb-3">
                  {isNumeric ? (
                    <>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={`${
                              star <= Math.floor(numRating)
                                ? "fill-current text-yellow-500"
                                : star - 0.5 <= numRating
                                  ? "fill-current text-yellow-500/50"
                                  : "text-gray-200 dark:text-gray-800"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 mt-1">{numRating}/5</span>
                    </>
                  ) : (
                    <span className="text-sm font-medium text-yellow-600 dark:text-yellow-500">{rating}</span>
                  )}
                </div>
              );
            })() : <div className="mb-2" />}
          </div>

          {/* Review / Body Area */}
          <div className="w-full relative px-1 flex flex-col flex-1 min-h-0 overflow-y-auto custom-scrollbar">
            <div className="my-auto">
              {review ? (
                <p className="text-[13px] italic text-gray-800 dark:text-gray-200 leading-relaxed">
                  "{review}"
                </p>
              ) : status ? (
                <p className="text-[13px] italic text-gray-500 dark:text-gray-400">
                  Status: {status}
                </p>
              ) : (
                <p className="text-[13px] italic text-gray-400 dark:text-gray-500">
                  {emptyMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

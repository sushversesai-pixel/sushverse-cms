"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Music } from "lucide-react";

export interface LyricItem {
  id: string;
  song: string;
  artist: string;
  excerpt: string;
  fullLyrics: string;
  audioLink: string;
  createdAt: number;
}

export function LyricCard({ lyric }: { lyric: LyricItem }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else if (lyric.audioLink && !lyric.audioLink.endsWith(".mp3") && !lyric.audioLink.endsWith(".wav")) {
      // If it's a spotify/youtube link, open in new tab
      window.open(lyric.audioLink, "_blank");
    }
  };

  const isDirectAudio = lyric.audioLink?.endsWith(".mp3") || lyric.audioLink?.endsWith(".wav");

  return (
    <motion.div
      layout
      onClick={() => setIsExpanded(!isExpanded)}
      className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
    >
      <motion.div layout className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">{lyric.song}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{lyric.artist}</p>
        </div>
        
        {lyric.audioLink && (
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors"
          >
            {isDirectAudio ? (
              isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />
            ) : (
              <Music size={18} />
            )}
          </button>
        )}
      </motion.div>

      {isDirectAudio && (
        <audio
          ref={audioRef}
          src={lyric.audioLink}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}

      <motion.div layout className="text-gray-700 dark:text-gray-300 italic text-lg border-l-2 border-indigo-200 dark:border-indigo-800 pl-4 py-2">
        {lyric.excerpt.split('\n').map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </motion.div>

      <AnimatePresence>
        {isExpanded && lyric.fullLyrics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400"
          >
            {lyric.fullLyrics.split('\n').map((line, i) => (
              <p key={i} className="min-h-[1rem]">{line}</p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

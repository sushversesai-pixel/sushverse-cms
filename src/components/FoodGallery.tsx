"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FoodItem {
  id: string;
  title: string;
  imageUrl: string;
  caption: string;
  createdAt: number;
}

export function FoodGallery({ items }: { items: FoodItem[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="break-inside-avoid mb-6 relative group rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer"
            onClick={() => setSelectedImage(item.imageUrl)}
          >
            <div className="relative w-full overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-auto block"
                loading="lazy"
              />
              
              {/* Text-only Hover Overlay (No dark shade) */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none">
                <h3 className="text-white font-bold text-sm leading-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{item.title}</h3>
                {item.caption && (
                  <p className="text-white text-[10px] mt-1 line-clamp-3 italic drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">"{item.caption}"</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-12 cursor-zoom-out"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-full max-h-full"
            >
              <img 
                src={selectedImage} 
                alt="Selected food" 
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

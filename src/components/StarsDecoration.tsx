import { motion } from "framer-motion";

export function StarsDecoration({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-end gap-1 ${className}`}>
      {/* Hand-drawn Star 1 */}
      <svg viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16">
        <path d="M 25 5 L 31 18 L 45 20 L 34 30 L 37 44 L 25 37 L 13 44 L 16 30 L 5 20 L 19 18 Z" />
      </svg>
      
      {/* Hand-drawn Star 2 */}
      <svg viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 opacity-60">
        <path d="M 25 10 L 29 20 L 40 22 L 31 29 L 33 40 L 25 34 L 17 40 L 19 29 L 10 22 L 21 20 Z" />
      </svg>

      {/* Sparkle */}
      <svg viewBox="0 0 50 50" fill="currentColor" stroke="none" className="w-6 h-6 opacity-40">
        <path d="M 25 5 L 28 22 L 45 25 L 28 28 L 25 45 L 22 28 L 5 25 L 22 22 Z" />
      </svg>

      {/* Tiny dot */}
      <circle cx="5" cy="5" r="2.5" fill="currentColor" stroke="none" className="w-2 h-2 opacity-30" />
    </div>
  );
}

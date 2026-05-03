"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Movies", path: "/movies" },
  { name: "K-Dramas", path: "/k-dramas" },
  { name: "Scenes", path: "/scenes" },
  { name: "Food", path: "/food" },
  { name: "Books", path: "/books" },
  { name: "Notes", path: "/notes" },
  { name: "Lyrics", path: "/lyrics" },
];

export function Navbar({ siteName = "Sushverse", navOverrides = {} }: { siteName?: string, navOverrides?: Record<string, string> }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-black/70 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {mounted ? (
              theme === "dark" ? <Sun size={20} /> : <Moon size={20} />
            ) : (
              <div className="w-5 h-5" />
            )}
          </button>
          <Link
            href="/admin"
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Admin
          </Link>
        </div>
        
        <div className="hidden md:flex gap-1 items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors hover:text-gray-900 dark:hover:text-white ${
                  isActive ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {navOverrides[item.path === '/' ? 'home' : item.path.replace('/', '').replace('-', '')] || item.name}
              </Link>
            );
          })}
        </div>

        <Link href="/" className="font-bold text-xl tracking-tight">
          {siteName}
        </Link>
      </div>
    </nav>
  );
}

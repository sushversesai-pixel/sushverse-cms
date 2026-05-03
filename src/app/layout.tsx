import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { HoneypotLogo } from "@/components/HoneypotLogo";
import { CatLogo } from "@/components/CatLogo";
import { fetchDocumentRest } from "@/lib/firebase-rest";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Sushverse - Personal CMS",
  description: "A centralized digital hub for media and thoughts.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await fetchDocumentRest("page_settings", "global_config");
  const siteName = settings?.siteName || "Sushverse";
  const navOverrides = settings?.navLinks || {};
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body suppressHydrationWarning className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-50 transition-colors duration-300 antialiased font-sans flex flex-col relative overflow-x-hidden">
        
        {/* Floating background Logos */}
        <div className="fixed top-20 left-4 md:left-12 pointer-events-none z-0 opacity-10 dark:opacity-20 flex items-end">
          <HoneypotLogo className="w-24 h-24 md:w-32 md:h-32 text-gray-900 dark:text-white" />
          <CatLogo className="w-20 h-20 md:w-28 md:h-28 text-gray-900 dark:text-white -ml-6 md:-ml-8" />
        </div>

        <Providers>
          <Navbar siteName={siteName} navOverrides={navOverrides} />
          <main className="flex-1 flex flex-col relative z-10">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

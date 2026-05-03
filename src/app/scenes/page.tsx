import { fetchCollectionRest, fetchDocumentRest } from "@/lib/firebase-rest";
import Image from "next/image";

export const revalidate = 60; // Revalidate every minute

interface SceneItem {
  id: string;
  dramaTitle: string;
  imageUrl: string;
  caption: string;
  createdAt: number;
}

async function getScenes(): Promise<SceneItem[]> {
  try {
    const docs = await fetchCollectionRest("scenes", "createdAt", "desc");
    return docs as SceneItem[];
  } catch (error) {
    console.error("Error fetching scenes:", error);
    return [];
  }
}

export default async function ScenesPage() {
  const [scenes, headerData] = await Promise.all([
    getScenes(),
    fetchDocumentRest("page_settings", "scenes")
  ]);

  const pageTitle = headerData?.title || "K-Drama Scenes";
  const pageSubtitle = headerData?.subtitle || "A gallery of my absolute favorite moments and cinematography.";

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
      <header className="mb-12 text-right">
        <h1 className="text-4xl font-extrabold mb-4">{pageTitle}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          {pageSubtitle}
        </p>
      </header>

      {scenes.length === 0 ? (
        <div className="py-20 text-center text-gray-500 bg-gray-50 dark:bg-zinc-900/50 rounded-3xl border border-gray-100 dark:border-gray-800">
          No scenes have been added to the gallery yet.
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">
          {scenes.map((scene) => (
            <div key={scene.id} className="break-inside-avoid mb-6 relative group rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
              <div className="relative w-full overflow-hidden">
                <img
                  src={scene.imageUrl}
                  alt={scene.dramaTitle}
                  className="w-full h-auto block transition-transform duration-1000 ease-out group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Modern Pinterest-style Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl">
                    <h3 className="text-white font-bold text-base tracking-wide">{scene.dramaTitle}</h3>
                    {scene.caption && (
                      <p className="text-white/80 text-xs mt-1.5 line-clamp-4 italic leading-relaxed">
                        {scene.caption}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

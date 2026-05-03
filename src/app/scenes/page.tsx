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
        <div className="py-20 text-center text-gray-500">
          No scenes have been added to the gallery yet.
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">
          {scenes.map((scene) => (
            <div key={scene.id} className="break-inside-avoid mb-6 relative group rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all">
              <div className="relative w-full overflow-hidden">
                <img
                  src={scene.imageUrl}
                  alt={scene.dramaTitle}
                  className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <h3 className="text-white font-bold text-sm tracking-wide drop-shadow-md">{scene.dramaTitle}</h3>
                {scene.caption && (
                  <p className="text-gray-200 text-xs mt-1 line-clamp-3 drop-shadow-md italic">"{scene.caption}"</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

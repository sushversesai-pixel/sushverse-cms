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
        <div className="py-20 text-center text-gray-500 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
          No scenes have been added to the gallery yet.
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">
          {scenes.map((scene) => (
            <div key={scene.id} className="break-inside-avoid mb-8 group">
              <div className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 shadow-sm transition-shadow hover:shadow-md">
                <img
                  src={scene.imageUrl}
                  alt={scene.dramaTitle}
                  className="w-full h-auto block"
                  loading="lazy"
                />
              </div>
              <div className="mt-3 px-1">
                <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">{scene.dramaTitle}</h3>
                {scene.caption && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {scene.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

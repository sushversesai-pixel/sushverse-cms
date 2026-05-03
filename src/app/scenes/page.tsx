import { fetchCollectionRest, fetchDocumentRest } from "@/lib/firebase-rest";
import { SceneGallery } from "@/components/SceneGallery";

export const revalidate = 60; // Revalidate every minute

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
        <SceneGallery scenes={scenes as any} />
      )}
    </div>
  );
}

async function getScenes() {
  try {
    const docs = await fetchCollectionRest("scenes", "createdAt", "desc");
    return docs;
  } catch (error) {
    console.error("Error fetching scenes:", error);
    return [];
  }
}

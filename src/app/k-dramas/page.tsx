import { getRecentDramas } from "@/lib/mydramalist";
import { fetchDocumentRest } from "@/lib/firebase-rest";
import { KDramaGallery } from "@/components/KDramaGallery";

export const revalidate = 60;

export default async function KDramasPage() {
  const [dramas, headerData] = await Promise.all([
    getRecentDramas(),
    fetchDocumentRest("page_settings", "k-dramas")
  ]);

  const pageTitle = headerData?.title || "K-Dramas";
  const pageSubtitle = headerData?.subtitle || "Tracked shows from MyDramaList.";

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
      <header className="mb-12 text-right">
        <h1 className="text-4xl font-extrabold mb-4">{pageTitle}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          {pageSubtitle}
        </p>
      </header>

      {dramas.length === 0 ? (
        <div className="py-12 text-center text-gray-500 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-gray-200 dark:border-gray-800">
          <p>No recent K-Dramas found.</p>
          <p className="text-sm mt-2">Make sure your MyDramaList profile is public and has items.</p>
        </div>
      ) : (
        <KDramaGallery dramas={dramas as any} />
      )}
    </div>
  );
}



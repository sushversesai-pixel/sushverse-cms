import { fetchCollectionRest, fetchDocumentRest } from "@/lib/firebase-rest";
import { FoodGallery } from "@/components/FoodGallery";

export const revalidate = 60; // Revalidate every minute

export default async function FoodPage() {
  const [foodItems, headerData] = await Promise.all([
    getFoodItems(),
    fetchDocumentRest("page_settings", "food")
  ]);

  const pageTitle = headerData?.title || "Food Gallery";
  const pageSubtitle = headerData?.subtitle || "A collection of delicious meals and culinary adventures.";

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
      <header className="mb-12 text-right">
        <h1 className="text-4xl font-extrabold mb-4">{pageTitle}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          {pageSubtitle}
        </p>
      </header>

      {foodItems.length === 0 ? (
        <div className="py-20 text-center text-gray-500 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
          No food images have been added to the gallery yet.
        </div>
      ) : (
        <FoodGallery items={foodItems as any} />
      )}
    </div>
  );
}

async function getFoodItems() {
  try {
    const docs = await fetchCollectionRest("food", "createdAt", "desc");
    return docs;
  } catch (error) {
    console.error("Error fetching food images:", error);
    return [];
  }
}

import { fetchCollectionRest, fetchDocumentRest } from "@/lib/firebase-rest";
import { Clock, Tag } from "lucide-react";

export const revalidate = 60; // Revalidate every minute

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
}

async function getNotes(): Promise<Note[]> {
  try {
    const docs = await fetchCollectionRest("notes", "createdAt", "desc");
    return docs as Note[];
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
}

export default async function NotesPage() {
  const [notes, headerData] = await Promise.all([
    getNotes(),
    fetchDocumentRest("page_settings", "notes")
  ]);

  const pageTitle = headerData?.title || "Notes";
  const pageSubtitle = headerData?.subtitle || "Thoughts, snippets, and learnings.";

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
      <header className="mb-12 text-right">
        <h1 className="text-4xl font-extrabold mb-4">{pageTitle}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          {pageSubtitle}
        </p>
      </header>

      <div className="space-y-8">
        {notes.map((note) => (
          <article key={note.id} className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 shadow-sm transition-all hover:shadow-md">
            <h2 className="text-2xl font-bold mb-3">{note.title}</h2>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {note.tags?.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-zinc-800 text-xs font-medium text-gray-600 dark:text-gray-300">
                  #{tag}
                </span>
              ))}
              <span className="text-xs text-gray-400 flex items-center ml-auto">
                {new Date(note.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>

            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
              {/* Simple multi-line text rendering */}
              {note.content.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-4 last:mb-0">{paragraph}</p>
              ))}
            </div>
          </article>
        ))}

        {notes.length === 0 && (
          <div className="py-20 text-center text-gray-500">
            No notes have been published yet.
          </div>
        )}
      </div>
    </div>
  );
}

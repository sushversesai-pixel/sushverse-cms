"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { app, db } from "@/lib/firebase";
import { signOut, getAuth } from "firebase/auth";
import { collection, addDoc, doc, setDoc, getDoc, getDocs, query, orderBy, deleteDoc } from "firebase/firestore";
import { Settings, FileText, Music, LogOut, Tv, Image as ImageIcon, Type, Trash2, Utensils } from "lucide-react";

export default function AdminDashboard() {
  const { user, loading, authError } = useAuth();
  const [activeTab, setActiveTab] = useState("settings");

  const handleSignOut = () => {
    try {
      const auth = getAuth(app);
      signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (authError) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Authentication Error</h2>
          <p className="text-gray-600 dark:text-gray-400">Please check your Firebase configuration.</p>
          <p className="text-sm text-gray-500 mt-2">{authError}</p>
        </div>
      </div>
    );
  }

  if (loading || !user) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="mb-6 px-4 py-2 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-bold text-lg">Admin Panel</h2>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          
          <nav className="space-y-1">
            <TabButton active={activeTab === "settings"} onClick={() => setActiveTab("settings")} icon={<Settings size={18} />} label="Site Settings" />
            <TabButton active={activeTab === "headers"} onClick={() => setActiveTab("headers")} icon={<Type size={18} />} label="Page Headers" />
            <TabButton active={activeTab === "notes"} onClick={() => setActiveTab("notes")} icon={<FileText size={18} />} label="Manage Notes" />
            <TabButton active={activeTab === "lyrics"} onClick={() => setActiveTab("lyrics")} icon={<Music size={18} />} label="Manage Lyrics" />
            <TabButton active={activeTab === "kdramas"} onClick={() => setActiveTab("kdramas")} icon={<Tv size={18} />} label="K-Drama Overrides" />
            <TabButton active={activeTab === "scenes"} onClick={() => setActiveTab("scenes")} icon={<ImageIcon size={18} />} label="Drama Scenes" />
            <TabButton active={activeTab === "food"} onClick={() => setActiveTab("food")} icon={<Utensils size={18} />} label="Food Gallery" />
          </nav>
          
          <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white dark:bg-zinc-900 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800 min-h-[500px]">
        {activeTab === "settings" && <SettingsPanel />}
        {activeTab === "headers" && <PageHeadersPanel />}
        {activeTab === "notes" && <NotesPanel />}
        {activeTab === "lyrics" && <LyricsPanel />}
        {activeTab === "kdramas" && <KDramasPanel />}
        {activeTab === "scenes" && <ScenesPanel />}
        {activeTab === "food" && <FoodPanel />}
      </main>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
        active 
          ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" 
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800"
      }`}
    >
      {icon} {label}
    </button>
  );
}

// Minimal Panels for CRUD Operations
function SettingsPanel() {
  const [siteName, setSiteName] = useState("");
  const [introText, setIntroText] = useState("");
  const [navLinks, setNavLinks] = useState({
    home: "Home",
    movies: "Movies",
    kdramas: "K-Dramas",
    scenes: "Scenes",
    food: "Food",
    books: "Books",
    notes: "Notes",
    lyrics: "Lyrics",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const docSnap = await getDoc(doc(db, "page_settings", "global_config"));
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.siteName) setSiteName(data.siteName);
          if (data.introText) setIntroText(data.introText);
          if (data.navLinks) setNavLinks((prev) => ({ ...prev, ...data.navLinks }));
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "page_settings", "global_config"), { siteName, introText, navLinks, updatedAt: Date.now() }, { merge: true });
      alert("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save settings. Check permissions.");
    }
  };

  if (loading) return <div className="text-gray-500">Loading settings...</div>;

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">Site Settings</h3>
      <form onSubmit={saveSettings} className="space-y-6 max-w-xl">
        <div className="space-y-4">
          <h4 className="font-semibold text-lg border-b border-gray-200 dark:border-gray-800 pb-2">Global Info</h4>
          <div>
            <label className="block text-sm font-medium mb-1">Site Name (Logo text)</label>
            <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Sushverse" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Intro Text (Home page)</label>
            <textarea value={introText} onChange={(e) => setIntroText(e.target.value)} rows={3} className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="A digital reflection..." />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-lg border-b border-gray-200 dark:border-gray-800 pb-2">Navigation Links</h4>
          <p className="text-sm text-gray-500">Rename the links appearing in the top navigation bar.</p>
          
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(navLinks).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1 capitalize">{key === 'kdramas' ? 'K-Dramas' : key}</label>
                <input 
                  type="text" 
                  value={value as string} 
                  onChange={(e) => setNavLinks(prev => ({...prev, [key]: e.target.value}))} 
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors">Save Settings</button>
      </form>
    </div>
  );
}

function NotesPanel() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [items, setItems] = useState<any[]>([]);

  const fetchItems = async () => {
    const snapshot = await getDocs(query(collection(db, "notes"), orderBy("createdAt", "desc")));
    setItems(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchItems(); }, []);

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tagArray = tags.split(",").map(t => t.trim()).filter(Boolean);
      await addDoc(collection(db, "notes"), {
        title,
        content,
        tags: tagArray,
        createdAt: Date.now()
      });
      setTitle(""); setContent(""); setTags("");
      fetchItems();
      alert("Note published!");
    } catch (err) {
      console.error(err);
      alert("Failed to publish note.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await deleteDoc(doc(db, "notes", id));
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("Failed to delete note.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h3 className="text-2xl font-bold mb-6">Create New Note</h3>
        <form onSubmit={addNote} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea required value={content} onChange={(e) => setContent(e.target.value)} rows={8} className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="tech, life, thoughts" />
          </div>
          <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors">Publish Note</button>
        </form>
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-6">Existing Notes</h3>
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-gray-700 rounded-xl">
              <span className="font-medium truncate mr-4">{item.title}</span>
              <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-md transition-colors"><Trash2 size={16} /></button>
            </div>
          ))}
          {items.length === 0 && <p className="text-gray-500">No notes found.</p>}
        </div>
      </div>
    </div>
  );
}

function LyricsPanel() {
  const [song, setSong] = useState("");
  const [artist, setArtist] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [fullLyrics, setFullLyrics] = useState("");
  const [audioLink, setAudioLink] = useState("");
  const [items, setItems] = useState<any[]>([]);

  const fetchItems = async () => {
    const snapshot = await getDocs(query(collection(db, "lyrics"), orderBy("createdAt", "desc")));
    setItems(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchItems(); }, []);

  const addLyric = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "lyrics"), {
        song,
        artist,
        excerpt,
        fullLyrics,
        audioLink,
        createdAt: Date.now()
      });
      setSong(""); setArtist(""); setExcerpt(""); setFullLyrics(""); setAudioLink("");
      fetchItems();
      alert("Lyrics added!");
    } catch (err) {
      console.error(err);
      alert("Failed to add lyrics.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete these lyrics?")) return;
    try {
      await deleteDoc(doc(db, "lyrics", id));
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("Failed to delete lyrics.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h3 className="text-2xl font-bold mb-6">Add Lyrics</h3>
        <form onSubmit={addLyric} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Song Title</label>
              <input type="text" required value={song} onChange={(e) => setSong(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Artist</label>
              <input type="text" required value={artist} onChange={(e) => setArtist(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Excerpt (Shown on front)</label>
            <textarea required value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Just a few lines..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Full Lyrics (Shown on expand)</label>
            <textarea value={fullLyrics} onChange={(e) => setFullLyrics(e.target.value)} rows={5} className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Audio Link (MP3/WAV for inline play, or Spotify link)</label>
            <input type="text" value={audioLink} onChange={(e) => setAudioLink(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="https://..." />
          </div>
          <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors">Add Lyrics</button>
        </form>
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-6">Existing Lyrics</h3>
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-gray-700 rounded-xl">
              <span className="font-medium truncate mr-4">{item.song} - {item.artist}</span>
              <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-md transition-colors"><Trash2 size={16} /></button>
            </div>
          ))}
          {items.length === 0 && <p className="text-gray-500">No lyrics found.</p>}
        </div>
      </div>
    </div>
  );
}

function KDramasPanel() {
  const [title, setTitle] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState("");
  const [availableTitles, setAvailableTitles] = useState<string[]>([]);
  const [loadingTitles, setLoadingTitles] = useState(true);
  const [items, setItems] = useState<any[]>([]);

  const fetchItems = async () => {
    const snapshot = await getDocs(query(collection(db, "kdrama_overrides"), orderBy("updatedAt", "desc")));
    setItems(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    async function fetchTitles() {
      try {
        const res = await fetch("/api/kdramas");
        const data = await res.json();
        if (data.titles) {
          setAvailableTitles(data.titles);
        }
      } catch (err) {
        console.error("Failed to fetch drama titles", err);
      } finally {
        setLoadingTitles(false);
      }
    }
    fetchTitles();
    fetchItems();
  }, []);

  const saveOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert("Please select a title");
    
    let finalCoverUrl = coverUrl;
    if (coverUrl.includes("pinterest.") || coverUrl.includes("pin.it")) {
      try {
        const res = await fetch("/api/extract-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: coverUrl })
        });
        const data = await res.json();
        if (data.imageUrl) finalCoverUrl = data.imageUrl;
      } catch (err) {
        console.error("Failed to extract image url", err);
      }
    }
    
    try {
      await setDoc(doc(db, "kdrama_overrides", title.trim()), {
        title: title.trim(),
        coverUrl: finalCoverUrl,
        review,
        rating: rating ? parseFloat(rating) : null,
        updatedAt: Date.now()
      });
      setTitle(""); setCoverUrl(""); setReview(""); setRating("");
      fetchItems();
      alert("Override saved! The card will now use this cover and review.");
    } catch (err) {
      console.error(err);
      alert("Failed to save override.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this override? The drama will revert to text-only.")) return;
    try {
      await deleteDoc(doc(db, "kdrama_overrides", id));
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("Failed to delete override.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h3 className="text-2xl font-bold mb-2">K-Drama Overrides</h3>
        <p className="text-gray-500 text-sm mb-6">Manually assign poster images (including Pinterest links) and personal reviews to dramas.</p>
        
        <form onSubmit={saveOverride} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select Drama Title</label>
            {loadingTitles ? (
              <div className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 text-gray-500">Loading your list from MyDramaList...</div>
            ) : (
              <select 
                required 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="" disabled>-- Select a Drama --</option>
                {availableTitles.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cover Image URL (Pinterest links work!)</label>
            <input type="text" required value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Personal Review (Shown on card flip)</label>
            <textarea required value={review} onChange={(e) => setReview(e.target.value)} rows={5} className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="What did you think of it?" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Star Rating (1-5, Optional)</label>
            <input type="number" min="1" max="5" step="0.5" value={rating} onChange={(e) => setRating(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 4.5" />
          </div>
          <button type="submit" disabled={!title || loadingTitles} className="px-6 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors">Save Override</button>
        </form>
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-6">Existing Overrides</h3>
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-gray-700 rounded-xl">
              <span className="font-medium truncate mr-4">{item.title}</span>
              <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-md transition-colors"><Trash2 size={16} /></button>
            </div>
          ))}
          {items.length === 0 && <p className="text-gray-500">No overrides found.</p>}
        </div>
      </div>
    </div>
  );
}

function ScenesPanel() {
  const [dramaTitle, setDramaTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [items, setItems] = useState<any[]>([]);

  const fetchItems = async () => {
    const snapshot = await getDocs(query(collection(db, "scenes"), orderBy("createdAt", "desc")));
    setItems(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchItems(); }, []);

  const addScene = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalImageUrl = imageUrl;
    if (imageUrl.includes("pinterest.") || imageUrl.includes("pin.it")) {
      try {
        const res = await fetch("/api/extract-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: imageUrl })
        });
        const data = await res.json();
        if (data.imageUrl) finalImageUrl = data.imageUrl;
      } catch (err) {
        console.error("Failed to extract image url", err);
      }
    }
    
    try {
      await addDoc(collection(db, "scenes"), {
        dramaTitle,
        imageUrl: finalImageUrl,
        caption,
        createdAt: Date.now()
      });
      setDramaTitle(""); setImageUrl(""); setCaption("");
      fetchItems();
      alert("Scene added to gallery!");
    } catch (err) {
      console.error(err);
      alert("Failed to add scene.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this scene?")) return;
    try {
      await deleteDoc(doc(db, "scenes", id));
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("Failed to delete scene.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h3 className="text-2xl font-bold mb-2">Favorite Scenes</h3>
        <p className="text-gray-500 text-sm mb-6">Upload or link images from your favorite K-Drama scenes.</p>
        
        <form onSubmit={addScene} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Drama Title</label>
            <input type="text" required value={dramaTitle} onChange={(e) => setDramaTitle(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Crash Landing on You" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image URL (Pinterest links recommended!)</label>
            <input type="text" required value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Caption / Quote (Optional)</label>
            <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={3} className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="A short description or quote..." />
          </div>
          <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors">Add Scene</button>
        </form>
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-6">Existing Scenes</h3>
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-gray-700 rounded-xl">
              <span className="font-medium truncate mr-4">{item.dramaTitle}</span>
              <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-md transition-colors"><Trash2 size={16} /></button>
            </div>
          ))}
          {items.length === 0 && <p className="text-gray-500">No scenes found.</p>}
        </div>
      </div>
    </div>
  );
}

function FoodPanel() {
  const [foodTitle, setFoodTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [items, setItems] = useState<any[]>([]);

  const fetchItems = async () => {
    const snapshot = await getDocs(query(collection(db, "food"), orderBy("createdAt", "desc")));
    setItems(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchItems(); }, []);

  const addFood = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalImageUrl = imageUrl;
    if (imageUrl.includes("pinterest.") || imageUrl.includes("pin.it")) {
      try {
        const res = await fetch("/api/extract-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: imageUrl })
        });
        const data = await res.json();
        if (data.imageUrl) finalImageUrl = data.imageUrl;
      } catch (err) {
        console.error("Failed to extract image url", err);
      }
    }
    
    try {
      await addDoc(collection(db, "food"), {
        title: foodTitle,
        imageUrl: finalImageUrl,
        caption,
        createdAt: Date.now()
      });
      setFoodTitle(""); setImageUrl(""); setCaption("");
      fetchItems();
      alert("Food image added to gallery!");
    } catch (err) {
      console.error(err);
      alert("Failed to add food image.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this food image?")) return;
    try {
      await deleteDoc(doc(db, "food", id));
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("Failed to delete food image.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h3 className="text-2xl font-bold mb-2">Food Gallery</h3>
        <p className="text-gray-500 text-sm mb-6">Upload or link images of delicious food.</p>
        
        <form onSubmit={addFood} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title / Dish Name</label>
            <input type="text" required value={foodTitle} onChange={(e) => setFoodTitle(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Spicy Ramen" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image URL (Pinterest links recommended!)</label>
            <input type="text" required value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Caption / Review (Optional)</label>
            <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={3} className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="A short description..." />
          </div>
          <button type="submit" className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors">Add Food Image</button>
        </form>
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-6">Existing Food Images</h3>
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-gray-700 rounded-xl">
              <span className="font-medium truncate mr-4">{item.title}</span>
              <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-md transition-colors"><Trash2 size={16} /></button>
            </div>
          ))}
          {items.length === 0 && <p className="text-gray-500">No food images found.</p>}
        </div>
      </div>
    </div>
  );
}

function PageHeadersPanel() {
  const [pageId, setPageId] = useState("movies");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
    async function fetchHeader() {
      try {
        const docRef = doc(db, "page_settings", pageId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
          setSubtitle(data.subtitle || "");
        } else {
          setTitle("");
          setSubtitle("");
        }
      } catch (err) {
        console.error("Failed to fetch header", err);
      }
    }
    fetchHeader();
  }, [pageId]);

  const saveHeader = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "page_settings", pageId), { title, subtitle, updatedAt: Date.now() }, { merge: true });
      alert("Page header saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save header.");
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">Page Headers</h3>
      <form onSubmit={saveHeader} className="space-y-4 max-w-xl">
        <div>
          <label className="block text-sm font-medium mb-1">Select Page</label>
          <select value={pageId} onChange={(e) => setPageId(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="movies">Movies</option>
            <option value="k-dramas">K-Dramas</option>
            <option value="books">Books</option>
            <option value="notes">Notes</option>
            <option value="lyrics">Lyrics</option>
            <option value="scenes">Scenes</option>
            <option value="food">Food</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. K-Dramas" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Subtitle</label>
          <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="A short description..." />
        </div>
        <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors">Save Header</button>
      </form>
    </div>
  );
}

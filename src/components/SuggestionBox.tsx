"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SuggestionBox() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      // Using Web3Forms - Simple, reliable, and minimalist
      // The user will need to replace 'YOUR_ACCESS_KEY_HERE' with their own key from web3forms.com
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "07bff371-df1d-44af-a456-578ae90d2cec", 
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `New Suggestion from ${formData.name || "Sushverse User"}`,
          from_name: "Sushverse CMS",
        }),
      });

      const result = await response.json();
      if (result.success) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("error");
    }
  };

  return (
    <section className="w-full max-w-2xl mx-auto my-20 px-4">
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 text-right">
          <h2 className="text-3xl font-bold mb-2 tracking-tight">Whisper to the Algorithm</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
            Think I missed a 10/10 drama? Or just have a feature request? Drop it here.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-3 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="Your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-5 py-3 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Message</label>
              <textarea
                id="message"
                required
                rows={4}
                placeholder="What's on your mind?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-5 py-3 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-2 text-emerald-500 font-medium text-sm"
                  >
                    <CheckCircle2 size={18} />
                    Suggestion sent! Thank you.
                  </motion.div>
                ) : status === "error" ? (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-2 text-rose-500 font-medium text-sm"
                  >
                    <AlertCircle size={18} />
                    Oops! Something went wrong.
                  </motion.div>
                ) : (
                  <div className="text-xs text-gray-400">
                    {/* Removed text */}
                  </div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className={`
                  flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all
                  ${status === "loading" 
                    ? "bg-gray-100 dark:bg-zinc-800 text-gray-400 cursor-not-allowed" 
                    : "bg-black dark:bg-white text-white dark:text-black hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/5"}
                `}
              >
                {status === "loading" ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Send <Send size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

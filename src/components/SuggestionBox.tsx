"use client";

import { useState, useRef } from "react";
import { Send } from "lucide-react";

type AnimationStatus = "idle" | "fold1" | "fold2" | "fly" | "done";

export function SuggestionBox() {
  const [suggestion, setSuggestion] = useState("");
  const [status, setStatus] = useState<AnimationStatus>("idle");
  const [isWriting, setIsWriting] = useState(false);
  const writingTimeout = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSuggestion(e.target.value);
    setIsWriting(true);
    
    if (writingTimeout.current) clearTimeout(writingTimeout.current);
    writingTimeout.current = setTimeout(() => setIsWriting(false), 200);
  };

  // Calculate quill position based on text content
  const getQuillPosition = () => {
    const charsPerLine = 32;
    const lineHeight = 28;
    const lines = suggestion.split('\n');
    
    let totalLines = 0;
    for (let i = 0; i < lines.length - 1; i++) {
      totalLines += Math.max(1, Math.ceil(lines[i].length / charsPerLine));
    }
    const lastLine = lines[lines.length - 1] || "";
    const charsOnLastLine = lastLine.length % charsPerLine;
    totalLines += Math.floor(lastLine.length / charsPerLine);
    
    const x = 56 + (charsOnLastLine * 8);
    const y = 28 + (totalLines * lineHeight);
    
    return { x: Math.min(x, 340), y: Math.min(y, 160) };
  };

  const quillPos = getQuillPosition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim() || status !== "idle") return;

    setStatus("fold1");
    
    setTimeout(() => {
      setStatus("fold2");
      setTimeout(() => {
        setStatus("fly");
        setTimeout(() => {
          setStatus("done");
          const subject = encodeURIComponent("Sushverse Suggestion");
          const body = encodeURIComponent(suggestion);
          window.open(`mailto:sushversesai@gmail.com?subject=${subject}&body=${body}`);
          
          setTimeout(() => {
            setSuggestion("");
            setStatus("idle");
          }, 2000);
        }, 1000);
      }, 800);
    }, 800);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <style>{`
        @keyframes quill-write {
          0%, 100% { transform: rotate(-35deg) translateY(0); }
          50% { transform: rotate(-32deg) translateY(-2px); }
        }
        @keyframes fold-horizontal {
          0% { clip-path: inset(0 0 0 0); }
          100% { clip-path: inset(0 0 50% 0); }
        }
        @keyframes fold-vertical {
          0% { clip-path: inset(0 0 50% 0); transform: scaleY(0.5) translateY(25%); }
          100% { clip-path: inset(0 50% 50% 0); transform: scaleY(0.5) scaleX(0.5) translateY(25%) translateX(25%); }
        }
        @keyframes fly-to-box {
          0% { 
            transform: scaleY(0.5) scaleX(0.5) translateY(25%) translateX(25%);
            opacity: 1;
          }
          100% { 
            transform: scaleY(0.3) scaleX(0.3) translateY(-100%) translateX(350%);
            opacity: 0;
          }
        }
        .paper-lines {
          background-image: 
            linear-gradient(transparent 27px, #e5e5e5 27px, #e5e5e5 28px);
          background-size: 100% 28px;
        }
        .dark .paper-lines {
          background-image: 
            linear-gradient(transparent 27px, #404040 27px, #404040 28px);
        }
      `}</style>

      <div className="flex items-start gap-12 p-6">
        {/* Paper Area */}
        <div className="flex-1 relative">
          <form onSubmit={handleSubmit}>
            {/* The Paper */}
            <div 
              className={`
                relative bg-amber-50 dark:bg-neutral-800 rounded shadow-xl 
                border border-neutral-200 dark:border-neutral-700
                transition-all duration-700 ease-in-out origin-top
                ${status === "fold1" ? "animate-[fold-horizontal_0.8s_ease-in-out_forwards]" : ""}
                ${status === "fold2" ? "animate-[fold-vertical_0.8s_ease-in-out_forwards]" : ""}
                ${status === "fly" ? "animate-[fly-to-box_1s_ease-in-out_forwards]" : ""}
                ${status === "done" ? "opacity-0 scale-0" : ""}
              `}
            >
              {/* Red margin line */}
              <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-red-300 dark:bg-red-900/50" />
              
              {/* Paper texture overlay */}
              <div className="absolute inset-0 opacity-30 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNjY2MiPjwvcmVjdD4KPC9zdmc+')]" />

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={suggestion}
                onChange={handleInput}
                disabled={status !== "idle"}
                placeholder="Dear Sushverse, I suggest..."
                className="w-full h-52 pl-16 pr-6 pt-6 pb-4 bg-transparent paper-lines resize-none focus:outline-none text-neutral-800 dark:text-neutral-100 leading-7 relative z-10 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                style={{
                  fontFamily: "var(--font-caveat), 'Caveat', cursive",
                  fontSize: "1.25rem",
                }}
                required
              />

              {/* Large Visible Quill */}
              {status === "idle" && (
                <div 
                  className="absolute pointer-events-none z-20 transition-all duration-150"
                  style={{
                    left: `${quillPos.x}px`,
                    top: `${quillPos.y}px`,
                    animation: isWriting ? "quill-write 0.15s ease-in-out infinite" : "none",
                    transform: "rotate(-35deg)",
                  }}
                >
                  <svg width="80" height="80" viewBox="0 0 100 100" className="drop-shadow-lg">
                    {/* Feather shaft */}
                    <path 
                      d="M 85 5 Q 60 25, 20 90" 
                      stroke="#2c2c2c" 
                      strokeWidth="2" 
                      fill="none"
                    />
                    {/* Left feather barbs */}
                    <path 
                      d="M 85 5 
                         Q 75 10, 70 20
                         Q 65 30, 55 45
                         Q 45 60, 35 75
                         Q 30 82, 25 88
                         L 20 90
                         Q 30 80, 40 65
                         Q 50 50, 60 35
                         Q 70 20, 85 5"
                      fill="#f5f5f5"
                      stroke="#d4d4d4"
                      strokeWidth="0.5"
                    />
                    {/* Right feather barbs */}
                    <path 
                      d="M 85 5
                         Q 80 15, 75 25
                         Q 65 45, 50 70
                         Q 40 82, 30 90
                         L 20 90
                         Q 35 78, 50 60
                         Q 65 40, 75 22
                         Q 82 10, 85 5"
                      fill="#e5e5e5"
                      stroke="#d4d4d4"
                      strokeWidth="0.5"
                    />
                    {/* Feather texture lines */}
                    <path d="M 80 12 Q 65 35, 45 65" stroke="#bbb" strokeWidth="0.5" fill="none" />
                    <path d="M 75 20 Q 60 42, 40 72" stroke="#bbb" strokeWidth="0.5" fill="none" />
                    <path d="M 70 28 Q 55 50, 35 78" stroke="#bbb" strokeWidth="0.5" fill="none" />
                    {/* Metal nib holder */}
                    <path 
                      d="M 22 86 L 18 94 L 22 94 L 20 90 Z" 
                      fill="#666"
                      stroke="#444"
                      strokeWidth="0.5"
                    />
                    {/* Nib tip */}
                    <path 
                      d="M 18 94 L 15 100 L 22 94 Z" 
                      fill="#333"
                    />
                    {/* Ink on nib */}
                    <circle cx="16" cy="98" r="2" fill="#1a1a1a" opacity="0.8" />
                  </svg>
                </div>
              )}

              {/* Ink trail effect when writing */}
              {isWriting && status === "idle" && (
                <div 
                  className="absolute w-1 h-1 rounded-full bg-neutral-800 dark:bg-neutral-200 opacity-50 z-10"
                  style={{
                    left: `${quillPos.x + 16}px`,
                    top: `${quillPos.y + 68}px`,
                  }}
                />
              )}
            </div>

            {/* Submit Button */}
            {status === "idle" && (
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={!suggestion.trim()}
                  className="flex items-center gap-2 px-5 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Send Letter <Send size={16} />
                </button>
              </div>
            )}
          </form>

          {/* Status text */}
          {status !== "idle" && status !== "done" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-lg font-medium text-neutral-600 dark:text-neutral-400 animate-pulse bg-white/80 dark:bg-neutral-900/80 px-4 py-2 rounded-lg">
                {status === "fold1" && "Folding letter..."}
                {status === "fold2" && "Folding once more..."}
                {status === "fly" && "Sending..."}
              </p>
            </div>
          )}
        </div>

        {/* Minimalist Black & White Letterbox */}
        <div className="w-32 flex-shrink-0 flex items-start pt-4">
          <div className="relative w-full">
            <svg viewBox="0 0 100 180" className="w-full h-auto">
              {/* Post */}
              <rect 
                x="40" y="80" 
                width="20" height="100" 
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-neutral-800 dark:text-neutral-200"
              />
              {/* Wood grain lines */}
              <line x1="45" y1="85" x2="45" y2="175" stroke="currentColor" strokeWidth="0.5" opacity="0.3" className="text-neutral-800 dark:text-neutral-200" />
              <line x1="55" y1="85" x2="55" y2="175" stroke="currentColor" strokeWidth="0.5" opacity="0.3" className="text-neutral-800 dark:text-neutral-200" />
              
              {/* Box body */}
              <rect 
                x="10" y="20" 
                width="80" height="55" 
                rx="4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-neutral-800 dark:text-neutral-200"
              />
              
              {/* Rounded top */}
              <path 
                d="M 10 30 Q 10 10, 50 10 Q 90 10, 90 30" 
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-neutral-800 dark:text-neutral-200"
              />
              
              {/* Letter slot */}
              <rect 
                x="25" y="45" 
                width="50" height="6" 
                rx="1"
                fill="currentColor"
                className="text-neutral-800 dark:text-neutral-200"
              />
              
              {/* Decorative line below slot */}
              <line x1="30" y1="58" x2="70" y2="58" stroke="currentColor" strokeWidth="1" className="text-neutral-800 dark:text-neutral-200" />
              
              {/* Flag pole */}
              <line 
                x1="90" y1="60" 
                x2="90" y2="25" 
                stroke="currentColor" 
                strokeWidth="2"
                className="text-neutral-800 dark:text-neutral-200"
              />
              
              {/* Flag */}
              <rect 
                x="90" y="25" 
                width="12" height="10"
                fill={status === "done" ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.5"
                className={`text-neutral-800 dark:text-neutral-200 transition-all duration-500 origin-[90px_30px] ${status === "done" ? "rotate-0" : "-rotate-90"}`}
              />
              
              {/* Ground line */}
              <line x1="5" y1="178" x2="95" y2="178" stroke="currentColor" strokeWidth="1.5" className="text-neutral-800 dark:text-neutral-200" />
            </svg>
            
            {/* Door flap that opens */}
            <div 
              className="absolute border-2 border-neutral-800 dark:border-neutral-200 bg-white dark:bg-neutral-900 rounded-t-full transition-transform duration-500"
              style={{
                left: "10%",
                top: "5.5%",
                width: "80%",
                height: "25%",
                transformOrigin: "bottom center",
                transform: (status === "fold2" || status === "fly") ? "perspective(100px) rotateX(-110deg)" : "perspective(100px) rotateX(0deg)",
              }}
            />

            {/* Success indicator */}
            {status === "done" && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  Sent!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

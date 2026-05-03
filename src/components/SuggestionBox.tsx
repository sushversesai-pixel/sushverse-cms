"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

type AnimationStatus = "idle" | "fold1" | "fold2" | "fly" | "done";

export function SuggestionBox() {
  const [suggestion, setSuggestion] = useState("");
  const [status, setStatus] = useState<AnimationStatus>("idle");
  const [isWriting, setIsWriting] = useState(false);
  const [inkSplatter, setInkSplatter] = useState<{ x: number; y: number; id: number }[]>([]);
  const writingTimeout = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const splatterIdRef = useRef(0);

  // Handle typing with quill animation
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const isAddingChar = newValue.length > suggestion.length;
    
    setSuggestion(newValue);
    setIsWriting(true);
    
    // Add ink splatter effect occasionally when typing
    if (isAddingChar && Math.random() > 0.85) {
      const textarea = textareaRef.current;
      if (textarea) {
        splatterIdRef.current += 1;
        setInkSplatter(prev => [...prev.slice(-5), { 
          x: Math.random() * 80 + 10, 
          y: Math.random() * 60 + 20, 
          id: splatterIdRef.current 
        }]);
      }
    }
    
    if (writingTimeout.current) clearTimeout(writingTimeout.current);
    writingTimeout.current = setTimeout(() => setIsWriting(false), 150);
  };

  // Calculate quill position based on text
  const getQuillPosition = () => {
    const charsPerLine = 36;
    const lineHeight = 28;
    const lines = suggestion.split('\n');
    
    let totalLines = 0;
    for (let i = 0; i < lines.length - 1; i++) {
      totalLines += Math.ceil((lines[i].length || 1) / charsPerLine);
    }
    const lastLine = lines[lines.length - 1] || "";
    const charsOnLastLine = lastLine.length % charsPerLine;
    totalLines += Math.floor(lastLine.length / charsPerLine);
    
    const x = 48 + (charsOnLastLine * 7.5);
    const y = 24 + (totalLines * lineHeight);
    
    return { x: Math.min(x, 320), y: Math.min(y, 140) };
  };

  const quillPos = getQuillPosition();
  const quillWiggle = isWriting ? (suggestion.length % 2 === 0 ? -18 : -8) : -12;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim() || status !== "idle") return;

    // Animation sequence: fold1 -> fold2 -> fly -> done
    setStatus("fold1");
    
    setTimeout(() => {
      setStatus("fold2");
      
      setTimeout(() => {
        setStatus("fly");
        
        setTimeout(() => {
          setStatus("done");
          
          // Open mailto
          const subject = encodeURIComponent("Sushverse Suggestion");
          const body = encodeURIComponent(suggestion);
          window.open(`mailto:sushversesai@gmail.com?subject=${subject}&body=${body}`);
          
          // Reset after delay
          setTimeout(() => {
            setSuggestion("");
            setInkSplatter([]);
            setStatus("idle");
          }, 2500);
        }, 1200);
      }, 700);
    }, 700);
  };

  // Get paper transform based on status
  const getPaperStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      transformStyle: "preserve-3d",
      transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
    };

    switch (status) {
      case "fold1":
        // First fold - fold in half horizontally (top to bottom)
        return {
          ...base,
          transform: "perspective(800px) rotateX(90deg) scaleY(0.5)",
          transformOrigin: "center bottom",
        };
      case "fold2":
        // Second fold - fold in half vertically (left to right)
        return {
          ...base,
          transform: "perspective(800px) rotateX(90deg) rotateY(90deg) scale(0.25)",
          transformOrigin: "center center",
        };
      case "fly":
        // Fly to the letterbox
        return {
          ...base,
          transform: "perspective(800px) rotateX(90deg) rotateY(90deg) scale(0.15) translateX(400px) translateY(-100px)",
          transition: "transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
        };
      case "done":
        return {
          ...base,
          transform: "perspective(800px) scale(0)",
          opacity: 0,
          transition: "all 0.3s ease-out",
        };
      default:
        return {
          ...base,
          transform: "perspective(800px) rotateX(0deg) scale(1)",
        };
    }
  };

  return (
    <>
      <style>{`
        @keyframes ink-drop {
          0% { transform: scale(0); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 0.5; }
          100% { transform: scale(1); opacity: 0.3; }
        }
        @keyframes quill-scratch {
          0%, 100% { transform: translate(-10px, -50px) rotate(var(--quill-angle)); }
          25% { transform: translate(-8px, -48px) rotate(calc(var(--quill-angle) - 3deg)); }
          75% { transform: translate(-12px, -52px) rotate(calc(var(--quill-angle) + 3deg)); }
        }
        .ink-splatter {
          animation: ink-drop 0.4s ease-out forwards;
        }
        .quill-writing {
          animation: quill-scratch 0.15s ease-in-out infinite;
        }
        .paper-texture {
          background-image: 
            linear-gradient(90deg, transparent 48px, rgba(180, 100, 100, 0.3) 48px, rgba(180, 100, 100, 0.3) 50px, transparent 50px),
            linear-gradient(transparent 27px, rgba(180, 180, 200, 0.4) 27px, rgba(180, 180, 200, 0.4) 28px);
          background-size: 100% 28px;
        }
        .parchment-bg {
          background: linear-gradient(135deg, #faf6ed 0%, #f5efe0 50%, #ebe5d5 100%);
        }
        .dark .parchment-bg {
          background: linear-gradient(135deg, #2a2720 0%, #252218 50%, #201d15 100%);
        }
      `}</style>

      <div className="w-full max-w-4xl mx-auto relative flex items-stretch justify-between gap-8 p-8">
        
        {/* Paper & Form Area */}
        <div className="flex-1 relative">
          <div style={getPaperStyle()}>
            <form onSubmit={handleSubmit} className="relative">
              {/* Parchment Paper */}
              <div className="relative parchment-bg rounded-sm shadow-lg border border-amber-200/50 dark:border-amber-900/30 overflow-hidden">
                
                {/* Paper edge effect */}
                <div className="absolute inset-0 shadow-inner pointer-events-none" />
                
                {/* Red margin line */}
                <div className="absolute left-12 top-0 bottom-0 w-[2px] bg-red-400/40" />
                
                {/* Ink splatters */}
                {inkSplatter.map((splat) => (
                  <div
                    key={splat.id}
                    className="ink-splatter absolute w-1.5 h-1.5 rounded-full bg-gray-800/40 dark:bg-gray-300/40"
                    style={{ left: `${splat.x}%`, top: `${splat.y}%` }}
                  />
                ))}

                {/* Textarea with lined paper effect */}
                <textarea
                  ref={textareaRef}
                  value={suggestion}
                  onChange={handleInput}
                  disabled={status !== "idle"}
                  placeholder="Dear Sushverse, I suggest..."
                  className="w-full h-44 pl-14 pr-6 pt-6 pb-4 bg-transparent paper-texture resize-none focus:outline-none text-gray-800 dark:text-gray-200 leading-7 relative z-10 placeholder:text-gray-400/60 dark:placeholder:text-gray-500/60"
                  style={{
                    fontFamily: "var(--font-caveat), 'Caveat', cursive, system-ui",
                    fontSize: "1.1rem",
                    letterSpacing: "0.02em",
                  }}
                  required
                />

                {/* Animated Quill Pen */}
                <div 
                  className={`absolute pointer-events-none z-20 transition-opacity duration-300 ${status !== "idle" ? "opacity-0" : "opacity-100"} ${isWriting ? "quill-writing" : ""}`}
                  style={{
                    left: `${quillPos.x}px`,
                    top: `${quillPos.y}px`,
                    transform: `translate(-10px, -50px) rotate(${quillWiggle}deg)`,
                    transition: isWriting ? "none" : "left 0.15s ease-out, top 0.15s ease-out",
                    ["--quill-angle" as string]: `${quillWiggle}deg`,
                  }}
                >
                  <QuillPen className="w-14 h-14 drop-shadow-md" />
                </div>

                {/* Ink well indicator when writing */}
                {isWriting && (
                  <div 
                    className="absolute w-1 h-1 rounded-full bg-gray-800 dark:bg-gray-200 opacity-60"
                    style={{
                      left: `${quillPos.x + 2}px`,
                      top: `${quillPos.y - 2}px`,
                    }}
                  />
                )}
              </div>

              {/* Submit Button */}
              <div className={`mt-4 flex justify-end transition-opacity duration-300 ${status !== "idle" ? "opacity-0" : "opacity-100"}`}>
                <button
                  type="submit"
                  disabled={!suggestion.trim() || status !== "idle"}
                  className="flex items-center gap-2 px-6 py-2.5 bg-amber-800 dark:bg-amber-700 text-white font-semibold rounded-full hover:bg-amber-900 dark:hover:bg-amber-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                >
                  Send Letter <Send size={16} />
                </button>
              </div>
            </form>
          </div>

          {/* "Sending..." indicator */}
          {status !== "idle" && status !== "done" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-amber-800 dark:text-amber-400 font-medium animate-pulse">
                {status === "fold1" && "Folding letter..."}
                {status === "fold2" && "Folding again..."}
                {status === "fly" && "Sending to mailbox..."}
              </p>
            </div>
          )}
        </div>

        {/* Letterbox */}
        <div className="w-48 flex-shrink-0 flex items-end justify-center">
          <Letterbox 
            isOpen={status === "fold1" || status === "fold2" || status === "fly"} 
            hasLetter={status === "done"} 
          />
        </div>
      </div>
    </>
  );
}

// Elegant Quill Pen SVG
function QuillPen({ className = "" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 64 64" 
      className={className}
      fill="none"
    >
      {/* Feather body */}
      <path 
        d="M 12 58 Q 20 45 28 30 Q 36 18 52 6" 
        stroke="#4a3728" 
        strokeWidth="1.5" 
        fill="none"
      />
      {/* Feather vanes - left side */}
      <path 
        d="M 52 6 Q 40 12 32 22 Q 26 30 22 42 Q 20 38 24 28 Q 28 18 40 10 Q 46 6 52 6" 
        fill="#f5f0e8"
        stroke="#4a3728"
        strokeWidth="0.5"
      />
      {/* Feather vanes - right side */}
      <path 
        d="M 52 6 Q 48 14 42 24 Q 36 34 30 42 Q 32 36 38 26 Q 44 16 52 6" 
        fill="#e8e0d0"
        stroke="#4a3728"
        strokeWidth="0.5"
      />
      {/* Quill tip/nib */}
      <path 
        d="M 12 58 L 14 52 L 18 54 Z" 
        fill="#4a3728"
      />
      {/* Ink at tip */}
      <circle cx="12" cy="58" r="1.5" fill="#1a1a1a" />
      {/* Feather texture lines */}
      <path d="M 46 10 Q 38 20 32 32" stroke="#c9b89c" strokeWidth="0.5" fill="none" />
      <path d="M 42 16 Q 36 24 30 36" stroke="#c9b89c" strokeWidth="0.5" fill="none" />
      <path d="M 38 22 Q 32 30 26 42" stroke="#c9b89c" strokeWidth="0.5" fill="none" />
    </svg>
  );
}

// Classic Letterbox
function Letterbox({ isOpen, hasLetter }: { isOpen: boolean; hasLetter: boolean }) {
  return (
    <div className="relative w-full h-64">
      <svg viewBox="0 0 120 200" className="w-full h-full" fill="none">
        {/* Post */}
        <rect 
          x="50" y="100" width="20" height="95" 
          fill="#8B4513" 
          stroke="#5D3A1A" 
          strokeWidth="2"
        />
        
        {/* Post grain lines */}
        <line x1="55" y1="105" x2="55" y2="190" stroke="#5D3A1A" strokeWidth="0.5" opacity="0.5" />
        <line x1="65" y1="105" x2="65" y2="190" stroke="#5D3A1A" strokeWidth="0.5" opacity="0.5" />
        
        {/* Grass */}
        <path 
          d="M 20 195 Q 30 180 35 195 Q 45 175 50 195 Q 60 170 70 195 Q 80 175 85 195 Q 95 180 100 195" 
          stroke="#4a7c59" 
          strokeWidth="2" 
          fill="none"
        />
        <line x1="15" y1="195" x2="105" y2="195" stroke="#3d6b4a" strokeWidth="3" />
        
        {/* Mailbox body */}
        <path 
          d="M 20 100 L 20 60 Q 20 30 60 30 Q 100 30 100 60 L 100 100 Z" 
          fill="#2563eb" 
          stroke="#1e40af" 
          strokeWidth="2"
        />
        
        {/* Mailbox front panel */}
        <rect x="30" y="70" width="60" height="25" fill="#1e40af" rx="2" />
        
        {/* Letter slot */}
        <rect x="35" y="78" width="50" height="8" fill="#0f172a" rx="1" />
        
        {/* Decorative elements */}
        <circle cx="60" cy="55" r="8" fill="#1e40af" stroke="#1e3a8a" strokeWidth="1" />
        <text x="60" y="59" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">S</text>
        
        {/* Flag */}
        <g 
          className="transition-transform duration-500 origin-[105px_70px]"
          style={{ transform: hasLetter ? "rotate(0deg)" : "rotate(-90deg)" }}
        >
          <rect x="100" y="50" width="4" height="30" fill="#8B4513" />
          <rect 
            x="104" y="50" width="14" height="12" 
            fill={hasLetter ? "#ef4444" : "#9ca3af"}
            className="transition-colors duration-500"
          />
        </g>
      </svg>

      {/* Animated door/flap */}
      <div 
        className="absolute bg-blue-600 border-2 border-blue-800 rounded-t-full transition-transform duration-500"
        style={{
          left: "16.5%",
          top: "15%",
          width: "67%",
          height: "35%",
          transformOrigin: "bottom center",
          transform: isOpen ? "perspective(200px) rotateX(-120deg)" : "perspective(200px) rotateX(0deg)",
        }}
      >
        {/* Door handle */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-4 h-2 bg-blue-800 rounded-sm" />
      </div>

      {/* Success message */}
      {hasLetter && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="text-sm font-medium text-green-600 dark:text-green-400 animate-pulse">
            Letter received!
          </span>
        </div>
      )}
    </div>
  );
}

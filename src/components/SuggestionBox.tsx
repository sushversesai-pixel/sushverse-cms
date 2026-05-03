"use client";

import { useState, useRef } from "react";
import { Send } from "lucide-react";

export function SuggestionBox() {
  const [suggestion, setSuggestion] = useState("");
  const [status, setStatus] = useState<"idle" | "folding1" | "folding2" | "mailing" | "done">("idle");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSuggestion(e.target.value);
    setIsTyping(true);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => setIsTyping(false), 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim() || status !== "idle") return;

    // Sequence:
    // 1. First Fold (Vertical half)
    setStatus("folding1");
    
    // 2. Second Fold (Horizontal half)
    setTimeout(() => {
      setStatus("folding2");
      
      // 3. Mailing (Bee flight)
      setTimeout(() => {
        setStatus("mailing");
        
        // 4. Done (Mailbox closes, trigger mail)
        setTimeout(() => {
          setStatus("done");
          
          const subject = encodeURIComponent("Sushverse Suggestion");
          const body = encodeURIComponent(suggestion);
          window.open(`mailto:sushversesai@gmail.com?subject=${subject}&body=${body}`);
          
          // Reset
          setTimeout(() => {
            setSuggestion("");
            setStatus("idle");
          }, 3000);
        }, 1500); // Wait 1.5s for the bee flight animation
      }, 600); // Wait 0.6s for fold 2
    }, 600); // Wait 0.6s for fold 1
  };

  const maxCharsPerLine = 38;
  const charWidth = 8.5; 
  
  let totalYLines = 0;
  const lines = suggestion.split('\n');
  for (let i = 0; i < lines.length - 1; i++) {
    totalYLines += Math.floor(lines[i].length / maxCharsPerLine) + 1;
  }
  const lastLine = lines[lines.length - 1] || "";
  totalYLines += Math.floor(lastLine.length / maxCharsPerLine);
  const charsOnCurrentLine = lastLine.length % maxCharsPerLine;
  
  const xOffset = charsOnCurrentLine * charWidth;
  const yOffset = totalYLines * 32;

  const wiggle = isTyping ? (suggestion.length % 2 === 0 ? "-15deg" : "-5deg") : "-10deg";

  // Calculate folding transform styles
  const getFolderStyle = () => {
    if (status === "folding1") {
      return { transform: "perspective(1000px) rotateX(60deg) scaleY(0.6) translateY(20%)", transition: "transform 0.6s ease-in-out", opacity: 1 };
    }
    if (status === "folding2" || status === "mailing") {
      return { transform: "perspective(1000px) rotateX(60deg) rotateY(60deg) scale(0.3) translate(20%, 20%)", transition: "transform 0.6s ease-in-out", opacity: 1 };
    }
    if (status === "done") {
      return { transform: "perspective(1000px) rotateX(60deg) rotateY(60deg) scale(0)", transition: "none", opacity: 0 };
    }
    return { transform: "perspective(1000px) rotateX(0deg) scale(1)", transition: "transform 0.6s ease-in-out", opacity: 1 };
  };

  return (
    <>
      <style>{`
        @keyframes bee-flight {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          20% { transform: translate(100px, -80px) rotate(45deg); }
          40% { transform: translate(60px, 20px) rotate(-60deg); }   /* Loop back! */
          60% { transform: translate(250px, -60px) rotate(20deg); }
          80% { transform: translate(350px, 0px) rotate(45deg) scale(0.5); opacity: 1; }
          100% { transform: translate(400px, 60px) rotate(90deg) scale(0); opacity: 0; }
        }
        .animate-bee {
          animation: bee-flight 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
      <div className="w-full max-w-4xl mx-auto h-80 relative flex items-center justify-between bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
        
        {/* Flight Container for Bee Animation */}
        <div className={`w-full max-w-md relative z-30 ${status === "mailing" ? "animate-bee" : ""}`}>
          
          {/* Paper Folder Container */}
          <div style={{ transformOrigin: "center", ...getFolderStyle() }}>
            <form onSubmit={handleSubmit} className="relative">
              {/* Lined Paper */}
              <div className="relative bg-[#fdfbf7] dark:bg-zinc-800 rounded-lg shadow-md border border-[#e5e0d8] dark:border-zinc-700 overflow-hidden">
                <div className="absolute left-8 top-0 bottom-0 w-px bg-red-400/50 z-0"></div>
                
                <textarea
                  value={suggestion}
                  onChange={handleInput}
                  disabled={status !== "idle"}
                  placeholder="Dear Sushverse, I suggest..."
                  className="w-full h-48 pl-12 pr-6 pt-8 pb-4 bg-transparent resize-none focus:outline-none text-gray-800 dark:text-gray-200 font-medium leading-8 relative z-10"
                  style={{
                    backgroundImage: "linear-gradient(transparent, transparent 31px, #cbd5e1 31px, #cbd5e1 32px)",
                    backgroundSize: "100% 32px",
                    lineHeight: "32px"
                  }}
                  required
                />

                {/* Custom SVG Quill Pen tracking the text */}
                <div 
                  className={`absolute text-zinc-800 dark:text-zinc-200 z-20 drop-shadow-md pointer-events-none ${status !== 'idle' ? 'opacity-0' : 'opacity-100'}`}
                  style={{
                    left: `calc(3rem + ${xOffset}px)`,
                    top: `calc(2rem + ${Math.min(yOffset, 160)}px)`,
                    transform: `translate(-10px, -58px) rotate(${wiggle})`,
                    transition: "left 0.1s ease-out, top 0.2s ease-out, transform 0.05s linear, opacity 0.3s"
                  }}
                >
                  <CustomQuill className="w-16 h-16" />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={!suggestion.trim() || status !== "idle"}
                  className={`flex items-center gap-2 px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${status !== "idle" ? "opacity-0" : "opacity-100"}`}
                >
                  Send <Send size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Mailbox Area */}
        <div className="relative w-64 h-72 flex-shrink-0 z-20 flex items-end justify-center">
          <Mailbox isDoorOpen={status === "folding1" || status === "folding2" || status === "mailing"} hasMail={status === "done"} />
        </div>

      </div>
    </>
  );
}

// Custom Quill SVG perfectly mimicking the feather shape
function CustomQuill({ className = "" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M 15 90 C 30 70 50 30 70 10" strokeWidth="3" />
      <path d="M 15 90 C 25 80 38 75 42 65 L 35 62 C 50 45 60 30 70 10" />
      <path d="M 46 50 L 40 50 C 55 35 65 20 70 10" />
      <path d="M 15 90 C 15 80 20 70 28 60 L 22 58 C 35 40 50 20 70 10" />
      <path d="M 32 46 L 28 42 C 45 25 60 15 70 10" />
      <path d="M 28 72 L 34 68" strokeWidth="1" />
      <path d="M 38 56 L 46 52" strokeWidth="1" />
      <path d="M 48 40 L 56 36" strokeWidth="1" />
      <path d="M 34 60 L 26 58" strokeWidth="1" />
      <path d="M 45 44 L 38 40" strokeWidth="1" />
    </svg>
  );
}

// Mailbox SVG neatly drawn mathematically (No Bird, No Heart, Standard Flag)
function Mailbox({ isDoorOpen, hasMail }: { isDoorOpen: boolean, hasMail: boolean }) {
  return (
    <div className="relative w-full h-full text-gray-800 dark:text-gray-200">
      
      {/* Base & Post Background SVG */}
      <svg viewBox="0 0 200 300" className="w-full h-full absolute top-0 left-0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        
        {/* Neat Grass Base */}
        <path d="M 40 280 Q 55 240 60 280 Q 75 230 80 280 Q 95 220 100 280 Q 105 220 120 280 Q 125 230 140 280 Q 145 240 160 280" />
        <line x1="30" y1="280" x2="170" y2="280" strokeWidth="4" />
        <path d="M 35 285 Q 100 290 165 285" strokeDasharray="2 4" strokeWidth="2" />

        {/* Post */}
        <rect x="85" y="140" width="30" height="140" fill="currentColor" fillOpacity="0.05" />
        <path d="M 85 140 v 140" />
        <path d="M 115 140 v 140" />
        
        {/* Standard Mail Flag */}
        <g 
          className="transition-transform duration-500 ease-in-out origin-[130px_100px]"
          style={{ transform: hasMail ? 'rotate(0deg)' : 'rotate(90deg)' }}
        >
          <line x1="130" y1="100" x2="130" y2="40" strokeWidth="4" />
          <circle cx="130" cy="100" r="3" fill="currentColor" />
          <rect x="130" y="40" width="30" height="20" fill={hasMail ? "#ef4444" : "currentColor"} fillOpacity={hasMail ? 1 : 0.1} stroke={hasMail ? "#ef4444" : "currentColor"} className="transition-colors duration-500" />
        </g>

        {/* Inside Cavity Background */}
        <path d="M 40 140 L 160 140 L 160 80 A 30 30 0 0 0 130 50 L 70 50 A 30 30 0 0 0 40 80 Z" fill="currentColor" fillOpacity="0.08" />
      </svg>

      {/* 3D Animated Door overlaying the hole perfectly */}
      <div 
        className="absolute border-[3px] border-gray-800 dark:border-gray-200 bg-white dark:bg-zinc-800 transition-all duration-700 ease-in-out"
        style={{
          left: '20%',
          top: '16.66%',
          width: '30%',
          height: '30%',
          borderTopLeftRadius: '30px',
          borderTopRightRadius: '30px',
          transformOrigin: 'bottom',
          transform: isDoorOpen ? 'rotateX(110deg)' : 'rotateX(0deg)',
          transformStyle: 'preserve-3d',
          zIndex: 40
        }}
      >
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-5 border-[3px] border-gray-800 dark:border-gray-200 rounded-sm"></div>
      </div>
      
      {/* Front Outline to hide seams */}
      <svg viewBox="0 0 200 300" className="w-full h-full absolute top-0 left-0 pointer-events-none z-50" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 40 140 L 100 140 L 100 80 A 30 30 0 0 0 40 80 Z" />
        <path d="M 70 50 L 130 50 A 30 30 0 0 1 160 80 L 160 140" />
      </svg>

    </div>
  );
}

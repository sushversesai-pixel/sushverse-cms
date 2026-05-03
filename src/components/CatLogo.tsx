export function CatLogo({ className = "" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 120 100" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      {/* Back Arch */}
      <path d="M 48 40 C 60 20 90 20 110 55" />
      
      {/* Head Top */}
      <path d="M 28 45 C 35 40 42 40 48 40" />
      
      {/* Left Ear */}
      <path d="M 25 50 L 23 35 L 35 42" strokeLinejoin="miter" />
      
      {/* Right Ear */}
      <path d="M 45 40 L 55 35 L 52 45" strokeLinejoin="miter" />
      
      {/* Front Left Paw (stretched out to left) */}
      <path d="M 25 60 C 15 60 8 62 10 57 C 12 55 20 56 25 56" />
      
      {/* Face/Head Bottom */}
      <path d="M 25 64 C 30 65 45 65 50 64" />
      
      {/* Face side */}
      <path d="M 25 50 C 22 55 23 60 25 64" />
      
      {/* Front Right Paw */}
      <path d="M 50 64 C 60 64 75 66 72 61 C 68 58 60 60 50 60" />
      
      {/* Belly */}
      <path d="M 72 61 C 80 61 90 60 95 62" />
      
      {/* Back Right Paw */}
      <path d="M 95 62 C 105 62 115 62 110 55" />
      
      {/* Eyes */}
      <circle cx="32" cy="50" r="3" fill="currentColor" stroke="none" />
      <circle cx="45" cy="50" r="3" fill="currentColor" stroke="none" />
      
      {/* Nose */}
      <path d="M 37 58 L 40 58 L 38.5 61 Z" fill="currentColor" stroke="none" />
      <path d="M 38.5 61 L 38.5 64" />
      
      {/* Whiskers */}
      <path d="M 26 55 L 18 54" strokeWidth="1.5" />
      <path d="M 26 58 L 18 59" strokeWidth="1.5" />
      
      {/* Paw toes detail */}
      <path d="M 12 57 v 2" strokeWidth="1.5" />
      <path d="M 15 57 v 2" strokeWidth="1.5" />
      <path d="M 70 63 v 2" strokeWidth="1.5" />
      <path d="M 67 63 v 2" strokeWidth="1.5" />
      <path d="M 108 59 v 2" strokeWidth="1.5" />
      
      {/* Text "NOT TODAY" */}
      <text 
        x="60" 
        y="85" 
        textAnchor="middle" 
        fontSize="16" 
        fontWeight="bold" 
        stroke="none" 
        fill="currentColor" 
        style={{ fontFamily: "'Comic Sans MS', 'Marker Felt', sans-serif", letterSpacing: "2px" }}
      >
        NOT TODAY
      </text>
    </svg>
  );
}

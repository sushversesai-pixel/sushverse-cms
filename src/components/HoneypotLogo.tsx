export function HoneypotLogo({ className = "" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      {/* Heart */}
      <path d="M 38 36 C 38 31, 44 31, 46 36 C 48 31, 54 31, 54 36 C 54 42, 46 46, 46 46 C 46 46, 38 42, 38 36 Z" strokeWidth="2" />
      
      {/* Dashed trail */}
      <path d="M 50 40 C 56 33, 60 23, 66 26 C 70 28, 66 33, 73 33 C 76 33, 80 30, 83 30" strokeDasharray="3 4" strokeWidth="1.5" />
      
      {/* Dipper */}
      <path d="M 60 48 L 70 38" strokeWidth="3" />
      <circle cx="73" cy="35" r="3.5" strokeWidth="2" />
      
      {/* Pot Rim */}
      <ellipse cx="48" cy="50" rx="26" ry="6" />
      <path d="M 22 53 C 22 56, 74 56, 74 53" />
      
      {/* Pot Body */}
      <path d="M 22 50 C 18 78, 28 88, 48 88 C 68 88, 78 78, 74 50" />
      
      {/* Honey drips */}
      <path d="M 22 56 Q 25 72 28 72 Q 31 72 32 60 Q 35 64 39 64 Q 43 64 45 58 Q 47 75 52 75 Q 57 75 58 62 Q 62 70 66 70 Q 70 70 74 56" />
    </svg>
  );
}

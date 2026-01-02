interface ConvertixLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const ConvertixLogo = ({ size = "md", showText = true }: ConvertixLogoProps) => {
  const sizeClasses = {
    sm: { wrapper: "w-7 h-7", text: "text-base", subtext: "text-[8px]" },
    md: { wrapper: "w-9 h-9", text: "text-xl", subtext: "text-[10px]" },
    lg: { wrapper: "w-12 h-12", text: "text-2xl", subtext: "text-xs" },
  };

  const s = sizeClasses[size];

  return (
    <div className="flex items-center gap-2">
      {/* 3D Layered C Logo Icon */}
      <div className={`${s.wrapper} relative`}>
        <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>
          <defs>
            {/* Main gradient - teal to green */}
            <linearGradient id="layer1Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(170, 60%, 45%)" />
            </linearGradient>
            {/* Middle layer - lighter teal */}
            <linearGradient id="layer2Gradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(180, 50%, 55%)" />
              <stop offset="100%" stopColor="hsl(160, 55%, 50%)" />
            </linearGradient>
            {/* Back layer - soft green */}
            <linearGradient id="layer3Gradient" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(150, 45%, 55%)" />
              <stop offset="100%" stopColor="hsl(165, 50%, 60%)" />
            </linearGradient>
            {/* Sparkle gradient */}
            <linearGradient id="sparkleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(190, 70%, 70%)" />
              <stop offset="100%" stopColor="hsl(180, 60%, 60%)" />
            </linearGradient>
          </defs>
          
          {/* Back layer (largest) */}
          <path
            d="M75 25 L75 30 Q75 18 63 14 Q45 8 30 20 Q18 30 18 50 Q18 70 30 80 Q45 92 63 86 Q75 82 75 70 L75 75 Q78 90 60 95 Q35 102 15 85 Q0 70 0 50 Q0 30 15 15 Q35 -2 60 5 Q78 10 75 25"
            fill="url(#layer3Gradient)"
            transform="translate(8, 6)"
          />
          
          {/* Middle layer */}
          <path
            d="M70 28 L70 33 Q70 22 60 18 Q45 12 32 22 Q22 32 22 50 Q22 68 32 78 Q45 88 60 82 Q70 78 70 67 L70 72 Q72 85 58 90 Q38 96 22 82 Q10 70 10 50 Q10 30 22 18 Q38 4 58 10 Q72 15 70 28"
            fill="url(#layer2Gradient)"
            transform="translate(4, 3)"
          />
          
          {/* Front layer (smallest, most prominent) */}
          <path
            d="M65 30 L65 38 Q65 28 56 24 Q44 18 34 26 Q26 34 26 50 Q26 66 34 74 Q44 82 56 76 Q65 72 65 62 L65 70 Q66 80 55 84 Q40 88 28 78 Q18 68 18 50 Q18 32 28 22 Q40 12 55 16 Q66 20 65 30"
            fill="url(#layer1Gradient)"
          />
          
          {/* Sparkle star */}
          <g transform="translate(78, 12)">
            <path
              d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z"
              fill="url(#sparkleGradient)"
              className="animate-pulse"
            />
          </g>
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${s.text} font-bold tracking-tight text-foreground`}>
            Convertix
          </span>
          <span className={`${s.subtext} text-muted-foreground tracking-widest uppercase font-medium`}>
            by CropXon
          </span>
        </div>
      )}
    </div>
  );
};

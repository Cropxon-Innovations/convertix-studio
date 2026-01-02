import { RefreshCw } from "lucide-react";

interface ConvertixLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const ConvertixLogo = ({ size = "md", showText = true }: ConvertixLogoProps) => {
  const sizeClasses = {
    sm: { wrapper: "w-7 h-7", icon: "h-3.5 w-3.5", text: "text-base", subtext: "text-[8px]" },
    md: { wrapper: "w-9 h-9", icon: "h-4 w-4", text: "text-xl", subtext: "text-[10px]" },
    lg: { wrapper: "w-12 h-12", icon: "h-5 w-5", text: "text-2xl", subtext: "text-xs" },
  };

  const s = sizeClasses[size];

  return (
    <div className="flex items-center gap-2">
      {/* Icon */}
      <div className={`${s.wrapper} rounded-xl bg-gradient-to-br from-primary via-primary to-primary/70 flex items-center justify-center relative overflow-hidden group`}>
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Rotating arrows icon */}
        <RefreshCw className={`${s.icon} text-primary-foreground group-hover:rotate-180 transition-transform duration-500`} />
        
        {/* Corner accent */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-foreground/20 rounded-full blur-sm" />
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
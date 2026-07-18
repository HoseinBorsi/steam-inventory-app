import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

const variantStyles = {
  default: "bg-cyan-600 text-white hover:bg-cyan-700",
  ghost: "hover:bg-slate-800 text-gray-300 hover:text-white",
  outline: "border border-slate-700 text-gray-300 hover:bg-slate-800",
  steam: "bg-[#1b2838] hover:bg-[#1b2838]/80 border border-[#66c0f4]/30 text-white",
} as const;

const sizeStyles = {
  sm: "px-2.5 py-1 text-xs rounded-lg",
  default: "px-6 py-3 text-sm rounded-xl",
  lg: "px-8 py-4 text-base rounded-xl",
} as const;

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
}

const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:pointer-events-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
export { Button };

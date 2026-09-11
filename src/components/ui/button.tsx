import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "soft";
  size?: "lg" | "md" | "sm" | "icon";
};

export function Button({
  className,
  variant = "primary",
  size = "lg",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold tracking-[-0.01em] transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-45",
        size === "lg" && "min-h-14 w-full px-5 text-[16px]",
        size === "md" && "min-h-12 px-4 text-[15px]",
        size === "sm" && "min-h-10 px-3 text-sm",
        size === "icon" && "h-11 w-11 min-w-11 rounded-full",
        variant === "primary" && "bg-brand text-white hover:bg-brand-dark",
        variant === "secondary" && "bg-ink text-white hover:bg-ink-soft",
        variant === "outline" &&
          "border border-line bg-white text-ink hover:bg-canvas",
        variant === "ghost" && "text-ink hover:bg-canvas",
        variant === "danger" && "bg-danger text-white hover:bg-[#a82f26]",
        variant === "soft" && "bg-brand-soft text-brand-dark hover:bg-[#d7f0e5]",
        className,
      )}
      {...props}
    />
  );
}

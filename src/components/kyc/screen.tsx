"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { ChevronLeftIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export function Screen({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("flex min-h-full flex-1 flex-col bg-canvas text-ink", className)}
    >
      {children}
    </div>
  );
}

export function ScreenHeader({
  title,
  backHref,
  onBack,
  right,
  light = false,
}: {
  title?: string;
  backHref?: string;
  onBack?: () => void;
  right?: ReactNode;
  light?: boolean;
}) {
  const backClass = cn(
    "inline-flex h-11 w-11 items-center justify-center rounded-full",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
    light ? "text-white hover:bg-white/10" : "text-ink hover:bg-white",
  );

  return (
    <div className="flex items-center justify-between gap-3 px-4 pb-2 pt-1">
      {onBack ? (
        <button type="button" aria-label="Go back" onClick={onBack} className={backClass}>
          <ChevronLeftIcon />
        </button>
      ) : backHref ? (
        <Link href={backHref} aria-label="Go back" className={backClass}>
          <ChevronLeftIcon />
        </Link>
      ) : (
        <span className="h-11 w-11" />
      )}
      {title ? (
        <h1
          className={cn(
            "text-[15px] font-semibold tracking-tight",
            light ? "text-white" : "text-ink",
          )}
        >
          {title}
        </h1>
      ) : (
        <span />
      )}
      <div className="flex h-11 w-11 items-center justify-center">{right}</div>
    </div>
  );
}

export function StepProgress({
  step,
  total = 4,
  light = false,
}: {
  step: number;
  total?: number;
  light?: boolean;
}) {
  return (
    <div
      className="flex gap-1.5 px-5 pb-3"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={step}
      aria-label={`Step ${step} of ${total}`}
    >
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={cn(
            "h-1 flex-1 rounded-full",
            index < step
              ? light
                ? "bg-white"
                : "bg-brand"
              : light
                ? "bg-white/20"
                : "bg-line",
          )}
        />
      ))}
    </div>
  );
}

export function TrustNote({ light = false }: { light?: boolean }) {
  return (
    <p
      className={cn(
        "px-1 text-center text-[12px] leading-5",
        light ? "text-white/80" : "text-muted",
      )}
    >
      Encrypted in transit and at rest. Used only to verify your identity.
    </p>
  );
}

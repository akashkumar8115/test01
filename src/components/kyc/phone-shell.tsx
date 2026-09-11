"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { HarborMark } from "@/components/ui/icons";
import { FLOW_STEPS } from "@/lib/kyc";
import { cn } from "@/lib/cn";

function StatusBar({ light = false }: { light?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-6 pt-3 text-[12px] font-semibold",
        light ? "text-white" : "text-ink",
      )}
    >
      <span>9:41</span>
      <div className="flex items-center gap-1.5" aria-hidden="true">
        <span
          className={cn(
            "inline-block h-2 w-4 rounded-[2px]",
            light ? "bg-white" : "bg-ink",
          )}
        />
        <span
          className={cn(
            "inline-block h-2.5 w-3 rounded-[1px] border",
            light ? "border-white" : "border-ink",
          )}
        />
        <span
          className={cn(
            "inline-block h-3 w-[18px] rounded-[3px] border p-px",
            light ? "border-white" : "border-ink",
          )}
        >
          <span
            className={cn(
              "block h-full w-[70%] rounded-[1px]",
              light ? "bg-white" : "bg-ink",
            )}
          />
        </span>
      </div>
    </div>
  );
}

export function PhoneShell({
  children,
  dark = false,
}: {
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative isolate mx-auto flex h-dvh w-full flex-col overflow-hidden bg-canvas text-ink md:h-[min(760px,calc(100dvh-4rem))] md:w-[390px] md:rounded-[40px] md:border md:border-white/10 md:shadow-[0_30px_80px_rgb(0_0_0_/_0.45)]",
        dark && "bg-ink text-white",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute left-1/2 top-2 z-20 hidden h-[26px] w-[118px] -translate-x-1/2 rounded-full bg-black md:block",
          dark && "bg-black",
        )}
        aria-hidden="true"
      />
      <StatusBar light={dark} />
      <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

export function StudioFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const current = FLOW_STEPS.find((step) => step.href === pathname) ?? {
    label: "Wallet",
    note: "Limited wallet access until the user completes identity verification.",
  };

  return (
    <div className="min-h-dvh bg-studio text-white">
      <div className="mx-auto grid min-h-dvh max-w-[1400px] grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_280px]">
        <aside className="hidden flex-col border-white/10 p-6 lg:flex lg:border-r">
          <div className="mb-8 flex items-center gap-3 text-white">
            <HarborMark className="text-brand" />
            <div>
              <p className="text-sm font-semibold tracking-tight">Harbor</p>
              <p className="text-xs text-white/80">KYC prototype</p>
            </div>
          </div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
            Happy path
          </p>
          <nav aria-label="Verification flow" className="space-y-1">
            {FLOW_STEPS.map((step, index) => {
              const active = step.href === pathname;
              return (
                <Link
                  key={step.id}
                  href={step.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/80 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold",
                      active ? "bg-brand text-white" : "bg-white/10",
                    )}
                  >
                    {index + 1}
                  </span>
                  {step.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-5 text-white/70">
            Capture before the frame turns green to see the blurry photo error
            state.
          </div>
        </aside>

        <main className="flex items-center justify-center p-0 text-ink lg:p-8">
          {children}
        </main>

        <aside className="hidden flex-col justify-between border-l border-white/10 p-6 lg:flex">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
              Current screen
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight">
              {current?.label}
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/80">
              {current?.note}
            </p>
          </div>
          <div className="space-y-3 text-sm text-white/80">
            <p>
              Tap targets are at least 44px. Copy stays at 16px+ on key
              actions. Scan feedback uses a live region.
            </p>
            <p className="text-white/70">Harbor Financial · Identity flow</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

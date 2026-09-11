"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useKyc } from "@/components/kyc/kyc-provider";
import { PhoneShell } from "@/components/kyc/phone-shell";
import {
  Screen,
  ScreenHeader,
  StepProgress,
  TrustNote,
} from "@/components/kyc/screen";
import { Button } from "@/components/ui/button";
import {
  CheckIcon,
  IdCardIcon,
  PassportIcon,
} from "@/components/ui/icons";
import { DOCUMENT_OPTIONS, type DocumentType } from "@/lib/kyc";
import { cn } from "@/lib/cn";

function DocumentGlyph({ id }: { id: DocumentType }) {
  if (id === "passport") return <PassportIcon />;
  return <IdCardIcon />;
}

export function ChooseId() {
  const router = useRouter();
  const { documentType, setDocumentType } = useKyc();
  const [selected, setSelected] = useState<DocumentType | null>(documentType);

  return (
    <PhoneShell>
      <Screen>
        <ScreenHeader title="Choose an ID" backHref="/verify" />
        <StepProgress step={2} />
        <div className="flex flex-1 flex-col px-5 pb-6">
          <h2 className="text-[28px] font-semibold leading-tight tracking-tight">
            Which document do you want to use?
          </h2>
          <p className="mt-2 text-[16px] leading-6 text-slate">
            Use an original, unexpired document. Photos of screenshots won’t be
            accepted.
          </p>

          <div className="mt-5 space-y-3" role="listbox" aria-label="Document type">
            {DOCUMENT_OPTIONS.map((option) => {
              const active = selected === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => setSelected(option.id)}
                  className={cn(
                    "flex min-h-[84px] w-full items-center gap-3 rounded-3xl border bg-white p-4 text-left transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                    active
                      ? "border-brand bg-brand-soft"
                      : "border-transparent hover:border-line",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                      active
                        ? "bg-brand text-white"
                        : "bg-canvas text-ink-soft",
                    )}
                  >
                    <DocumentGlyph id={option.id} />
                  </span>
                  <span className="flex-1">
                    <span className="block font-semibold tracking-tight">
                      {option.title}
                    </span>
                    <span className="mt-0.5 block text-sm text-slate">
                      {option.description}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full border",
                      active
                        ? "border-brand bg-brand text-white"
                        : "border-line",
                    )}
                    aria-hidden="true"
                  >
                    {active ? <CheckIcon className="h-3.5 w-3.5" /> : null}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-auto space-y-3 pt-6">
            <TrustNote />
            <Button
              disabled={!selected}
              onClick={() => {
                if (!selected) return;
                setDocumentType(selected);
                router.push("/verify/scan");
              }}
            >
              Continue
            </Button>
          </div>
        </div>
      </Screen>
    </PhoneShell>
  );
}

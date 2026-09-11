"use client";

import { useRouter } from "next/navigation";

import { useKyc } from "@/components/kyc/kyc-provider";
import { PhoneShell } from "@/components/kyc/phone-shell";
import { Screen, StepProgress, TrustNote } from "@/components/kyc/screen";
import { Button } from "@/components/ui/button";
import { CheckIcon, ClockIcon } from "@/components/ui/icons";

export function Submitted() {
  const router = useRouter();
  const { referenceId, details } = useKyc();

  return (
    <PhoneShell>
      <Screen>
        <div className="pt-2">
          <StepProgress step={4} />
        </div>
        <div className="flex flex-1 flex-col px-5 pb-6">
          <div className="mt-6 flex justify-center">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-brand-soft text-brand">
              <span className="pulse-ring absolute inset-0 rounded-full border border-brand/30" />
              <span className="check-pop flex h-16 w-16 items-center justify-center rounded-full bg-brand text-white">
                <CheckIcon className="h-8 w-8" />
              </span>
            </div>
          </div>

          <h1 className="mt-6 text-center text-[28px] font-semibold leading-tight tracking-tight text-ink">
            Submission received
          </h1>
          <p className="mt-2 text-center text-[16px] leading-6 text-muted">
            Thanks, {details.fullName.split(" ")[0]}. We’re reviewing your
            documents now. This usually takes about 5 minutes.
          </p>

          <div className="mt-6 rounded-3xl bg-white p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Reference</span>
              <span className="font-semibold text-ink">{referenceId ?? "HRB-PENDING"}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-muted">Status</span>
              <span className="inline-flex min-h-8 items-center rounded-full bg-gold-soft px-3 text-sm font-semibold text-gold">
                In review
              </span>
            </div>
          </div>

          <ol className="mt-4 space-y-3 rounded-3xl bg-white p-4">
            <li className="flex gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white">
                <CheckIcon className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-ink">Documents submitted</p>
                <p className="text-sm text-muted">Encrypted and received</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-soft text-gold">
                <ClockIcon className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-ink">Automated review</p>
                <p className="text-sm text-muted">Matching ID and selfie</p>
              </div>
            </li>
            <li className="flex gap-3 text-muted">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-canvas">
                3
              </span>
              <div>
                <p className="font-semibold text-ink">Wallet unlocked</p>
                <p className="text-sm text-muted">We’ll notify you when it’s done</p>
              </div>
            </li>
          </ol>

          <div className="mt-auto space-y-3 pt-6">
            <TrustNote />
            <Button onClick={() => router.push("/")}>Back to wallet</Button>
          </div>
        </div>
      </Screen>
    </PhoneShell>
  );
}

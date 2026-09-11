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
  BoltIcon,
  CameraIcon,
  ClockIcon,
  ShieldIcon,
} from "@/components/ui/icons";

const reasons = [
  {
    icon: ShieldIcon,
    title: "Required to protect your account",
    body: "Financial rules ask us to confirm it’s really you before unlocking transfers and cards.",
  },
  {
    icon: BoltIcon,
    title: "Takes about 2 minutes",
    body: "Scan a valid ID, then take a quick selfie. We’ll walk you through each step.",
  },
  {
    icon: ClockIcon,
    title: "Review is usually fast",
    body: "Most checks finish in a few minutes. You can keep browsing while we review.",
  },
];

export function VerifyIntro() {
  const router = useRouter();
  const { setCameraPermission } = useKyc();
  const [stage, setStage] = useState<"why" | "permission">("why");
  const [busy, setBusy] = useState(false);
  const [denied, setDenied] = useState(false);

  async function requestCamera() {
    setBusy(true);
    try {
      if (typeof navigator !== "undefined" && navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        stream.getTracks().forEach((track) => track.stop());
        setCameraPermission("granted");
      } else {
        setCameraPermission("denied");
      }
      router.push("/verify/id");
    } catch {
      setCameraPermission("denied");
      setDenied(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <PhoneShell>
      <Screen>
        <ScreenHeader
          title="Identity check"
          backHref={stage === "why" ? "/" : undefined}
          onBack={stage === "permission" ? () => setStage("why") : undefined}
        />
        <StepProgress step={1} />

        {stage === "why" ? (
          <div className="flex flex-1 flex-col px-5 pb-6">
            <div className="mb-5 flex justify-center">
              <div className="relative flex h-28 w-28 items-center justify-center rounded-[32px] bg-brand-soft text-brand">
                <span className="pulse-ring absolute inset-0 rounded-[32px] border border-brand/30" />
                <ShieldIcon className="h-12 w-12" />
              </div>
            </div>
            <h2 className="text-center text-[28px] font-semibold leading-tight tracking-tight text-ink">
              Verify your identity
            </h2>
            <p className="mt-2 text-center text-[16px] leading-6 text-muted">
              Unlock full access to Harbor. Your photos are encrypted and used
              only for this check.
            </p>

            <ul className="mt-6 space-y-3">
              {reasons.map((reason) => (
                <li
                  key={reason.title}
                  className="flex gap-3 rounded-2xl bg-white p-3.5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                    <reason.icon />
                  </span>
                  <div>
                    <p className="font-semibold tracking-tight text-ink">
                      {reason.title}
                    </p>
                    <p className="mt-0.5 text-sm leading-5 text-muted">
                      {reason.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-auto space-y-3 pt-6">
              <TrustNote />
              <Button onClick={() => setStage("permission")}>Continue</Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col px-5 pb-6">
            <div className="mb-5 flex justify-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-[32px] bg-info-soft text-info">
                <CameraIcon className="h-12 w-12" />
              </div>
            </div>
            <h2 className="text-center text-[28px] font-semibold leading-tight tracking-tight text-ink">
              Allow camera access
            </h2>
            <p className="mt-2 text-center text-[16px] leading-6 text-muted">
              Harbor uses your camera to scan your ID and take a liveness
              selfie. Nothing is posted or used for ads.
            </p>

            <div className="mt-6 space-y-3 rounded-3xl bg-white p-4">
              <p className="text-sm font-semibold text-ink">You’ll need</p>
              <ul className="space-y-2 text-sm leading-5 text-muted">
                <li>A passport, driver’s license, or national ID</li>
                <li>A well-lit space and a steady hand</li>
                <li>Your face, without sunglasses or a mask</li>
              </ul>
            </div>

            {denied ? (
              <div
                role="alert"
                className="mt-4 rounded-2xl bg-danger-soft p-3.5 text-sm leading-5 text-danger"
              >
                Camera access is blocked. You can still continue with a guided
                demo scanner, or enable camera in your browser settings.
              </div>
            ) : null}

            <div className="mt-auto space-y-3 pt-6">
              <TrustNote />
              <Button onClick={() => void requestCamera()} disabled={busy}>
                {busy ? "Requesting camera…" : "Allow camera access"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCameraPermission("denied");
                  router.push("/verify/id");
                }}
              >
                Continue without camera
              </Button>
            </div>
          </div>
        )}
      </Screen>
    </PhoneShell>
  );
}

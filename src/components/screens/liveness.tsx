"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useKyc } from "@/components/kyc/kyc-provider";
import { PhoneShell } from "@/components/kyc/phone-shell";
import { ScreenHeader, StepProgress } from "@/components/kyc/screen";
import { Button } from "@/components/ui/button";
import {
  captureVideoFrame,
  placeholderSelfieImage,
  useCamera,
} from "@/hooks/use-camera";
import { cn } from "@/lib/cn";

const challenges = [
  "Center your face in the oval",
  "Blink slowly",
  "Turn your head slightly right",
] as const;

export function Liveness() {
  const router = useRouter();
  const { cameraPermission, setSelfieUrl, setLivenessPassed } = useKyc();
  const { videoRef, ready } = useCamera(
    "user",
    cameraPermission === "granted",
  );
  const [step, setStep] = useState(0);
  const [faceFound, setFaceFound] = useState(false);
  const [tooFar, setTooFar] = useState(true);

  useEffect(() => {
    const found = window.setTimeout(() => {
      setFaceFound(true);
      setTooFar(false);
    }, 900);
    return () => window.clearTimeout(found);
  }, []);

  useEffect(() => {
    if (!faceFound) return;
    if (step >= challenges.length - 1) return;
    const timer = window.setTimeout(() => setStep((value) => value + 1), 1800);
    return () => window.clearTimeout(timer);
  }, [faceFound, step]);

  const complete = faceFound && step === challenges.length - 1;
  const status = tooFar
    ? "Move a little closer"
    : !faceFound
      ? "Looking for your face"
      : (challenges[step] ?? "Hold still");

  function finish() {
    const dataUrl =
      ready && videoRef.current
        ? captureVideoFrame(videoRef.current)
        : placeholderSelfieImage();
    setSelfieUrl(dataUrl);
    setLivenessPassed(true);
    router.push("/verify/review");
  }

  return (
    <PhoneShell dark>
      <div className="flex min-h-full flex-1 flex-col bg-[#0a0f1c] text-white">
        <ScreenHeader title="Liveness check" backHref="/verify/preview" light />
        <StepProgress step={3} light />

        <div className="px-5 text-center">
          <h2 className="text-[22px] font-semibold tracking-tight">
            Confirm it’s you
          </h2>
          <p className="mt-1 text-sm text-white/65" aria-live="polite">
            {status}
          </p>
        </div>

        <div className="relative mx-auto mt-6 flex h-[340px] w-[260px] items-center justify-center">
          <div className="face-guide absolute inset-0 rounded-[50%] border-2 border-brand/80" />
          <div className="absolute inset-3 overflow-hidden rounded-[50%] bg-black">
            <video
              ref={videoRef}
              className={cn(
                "h-full w-full scale-x-[-1] object-cover",
                ready ? "opacity-100" : "opacity-70",
              )}
              muted
              playsInline
              autoPlay
            />
            {!ready ? (
              <div className="absolute inset-0 bg-[radial-gradient(circle,#3d4a63,transparent_60%)]" />
            ) : null}
          </div>
        </div>

        <ol className="mx-5 mt-6 space-y-2">
          {challenges.map((item, index) => {
            const done = index < step || (complete && index <= step);
            const current = index === step && !tooFar;
            return (
              <li
                key={item}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm",
                  current ? "bg-white/10 text-white" : "text-white/55",
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold",
                    done ? "bg-brand text-white" : "bg-white/10",
                  )}
                >
                  {index + 1}
                </span>
                {item}
              </li>
            );
          })}
        </ol>

        <div className="mt-auto space-y-3 px-5 py-6">
          <p className="text-center text-[12px] text-white/50">
            Keep your face uncovered. We’ll take a still only after the
            sequence.
          </p>
          <Button onClick={finish} disabled={!complete}>
            {complete ? "Continue" : "Complete the motions"}
          </Button>
        </div>
      </div>
    </PhoneShell>
  );
}

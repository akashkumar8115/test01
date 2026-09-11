"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useKyc } from "@/components/kyc/kyc-provider";
import { PhoneShell } from "@/components/kyc/phone-shell";
import { ScreenHeader, StepProgress } from "@/components/kyc/screen";
import { Button } from "@/components/ui/button";
import { CameraIcon, SunIcon } from "@/components/ui/icons";
import {
  captureVideoFrame,
  placeholderIdImage,
  useCamera,
} from "@/hooks/use-camera";
import { documentLabel, needsBack } from "@/lib/kyc";
import { cn } from "@/lib/cn";

type AlignState = "searching" | "glare" | "aligned";

export function ScanId() {
  const router = useRouter();
  const { documentType, cameraPermission, captures, addCapture } = useKyc();
  const hasBack = needsBack(documentType);
  const frontDone = captures.some(
    (item) => item.side === "front" && item.quality === "good",
  );
  const side = hasBack && frontDone ? "back" : "front";
  const [align, setAlign] = useState<AlignState>("searching");
  const [flashOn, setFlashOn] = useState(false);
  const [rearCamera, setRearCamera] = useState(true);
  const { videoRef, ready } = useCamera(
    rearCamera ? "environment" : "user",
    cameraPermission === "granted",
  );

  useEffect(() => {
    setAlign("searching");
    const glare = window.setTimeout(() => setAlign("glare"), 1400);
    const ok = window.setTimeout(() => setAlign("aligned"), 2800);
    return () => {
      window.clearTimeout(glare);
      window.clearTimeout(ok);
    };
  }, [side]);

  const feedback = {
    searching: "Place your ID inside the frame",
    glare: "Glare detected — tilt slightly",
    aligned: "Looking good. Hold steady.",
  }[align];

  function capture(forceQuality?: "good" | "blurry") {
    const quality = forceQuality ?? (align === "aligned" ? "good" : "blurry");
    const dataUrl =
      ready && videoRef.current
        ? captureVideoFrame(videoRef.current)
        : placeholderIdImage(documentLabel(documentType), side);
    addCapture({ dataUrl, quality, side });
    router.push("/verify/preview");
  }

  return (
    <PhoneShell dark>
      <div className="flex min-h-full flex-1 flex-col bg-[#0a0f1c] text-white">
        <ScreenHeader title="Scan your ID" backHref="/verify/id" light />
        <StepProgress step={2} light />

        <div className="px-5">
          <p className="text-center text-[18px] font-semibold tracking-tight">
            {side === "front" ? "Front of " : "Back of "}
            {documentLabel(documentType).toLowerCase()}
          </p>
          <p
            className="mt-1 text-center text-sm text-white"
            aria-live="polite"
          >
            {feedback}
          </p>
        </div>

        <div className="relative mx-5 mt-4 flex-1">
          <div className="relative aspect-[1.58] overflow-hidden rounded-[28px] bg-black">
            <video
              ref={videoRef}
              className={cn(
                "absolute inset-0 h-full w-full object-cover",
                ready ? "opacity-100" : "opacity-0",
              )}
              muted
              playsInline
              autoPlay
            />
            {!ready ? (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1c2740,transparent_55%),linear-gradient(#10182b,#070b14)]">
                <div className="absolute inset-8 rounded-2xl border border-white/15 bg-white/5" />
                <div className="scan-line absolute left-10 right-10 h-0.5 bg-brand shadow-[0_0_18px_#0f6e56]" />
              </div>
            ) : null}

            {flashOn ? (
              <div className="pointer-events-none absolute inset-0 bg-white/25" />
            ) : null}

            <div
              className={cn(
                "pointer-events-none absolute inset-5 rounded-2xl border-2",
                align === "aligned"
                  ? "border-brand"
                  : align === "glare"
                    ? "border-amber-300"
                    : "border-white/70",
              )}
            >
              <span className="absolute left-0 top-0 h-6 w-6 rounded-tl-2xl border-t-4 border-l-4 border-current" />
              <span className="absolute right-0 top-0 h-6 w-6 rounded-tr-2xl border-t-4 border-r-4 border-current" />
              <span className="absolute bottom-0 left-0 h-6 w-6 rounded-bl-2xl border-b-4 border-l-4 border-current" />
              <span className="absolute bottom-0 right-0 h-6 w-6 rounded-br-2xl border-b-4 border-r-4 border-current" />
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 px-5 text-center text-[12px] font-medium text-white">
          <p>Fill the frame</p>
          <p>Avoid glare</p>
          <p>Hold steady</p>
        </div>

        <div className="mt-auto flex items-center justify-between px-8 py-6">
          <button
            type="button"
            aria-pressed={flashOn}
            aria-label={flashOn ? "Turn flash off" : "Turn flash on"}
            onClick={() => setFlashOn((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white"
          >
            <SunIcon />
          </button>
          <button
            type="button"
            aria-label="Capture ID photo"
            onClick={() => capture()}
            className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 border-white bg-white/20 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <span className="h-14 w-14 rounded-full bg-white" />
          </button>
          <button
            type="button"
            aria-label={rearCamera ? "Switch to front camera" : "Switch to rear camera"}
            onClick={() => setRearCamera((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white"
          >
            <CameraIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 pb-5">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10"
            onClick={() => capture("blurry")}
          >
            Capture anyway
          </Button>
        </div>
      </div>
    </PhoneShell>
  );
}

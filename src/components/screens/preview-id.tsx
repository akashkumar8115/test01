"use client";

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
import { CaptureImage } from "@/components/ui/capture-image";
import { AlertIcon, CheckIcon } from "@/components/ui/icons";
import { documentLabel, needsBack } from "@/lib/kyc";

export function PreviewId() {
  const router = useRouter();
  const { documentType, captures, clearCaptures } = useKyc();
  const latest = captures.at(-1);
  const blurry = latest?.quality === "blurry";
  const hasBack = needsBack(documentType);
  const frontGood = captures.some(
    (item) => item.side === "front" && item.quality === "good",
  );
  const backGood = captures.some(
    (item) => item.side === "back" && item.quality === "good",
  );
  const needsNextSide = hasBack && frontGood && !backGood && !blurry;

  function continueFlow() {
    if (needsNextSide) {
      router.push("/verify/scan");
      return;
    }
    router.push("/verify/selfie");
  }

  return (
    <PhoneShell>
      <Screen>
        <ScreenHeader title="Check your photo" backHref="/verify/scan" />
        <StepProgress step={2} />
        <div className="flex flex-1 flex-col px-5 pb-6">
          {blurry ? (
            <div
              role="alert"
              className="mb-4 rounded-2xl bg-danger-soft p-3.5 text-danger"
            >
              <div className="flex items-center gap-2 font-semibold">
                <AlertIcon />
                Photo is too blurry
              </div>
              <p className="mt-1 text-sm leading-5">
                We couldn’t read the details. Hold your phone steady, move out
                of direct light, and fill the frame.
              </p>
            </div>
          ) : (
            <div className="mb-4 rounded-2xl bg-brand-soft p-3.5 text-brand-dark">
              <div className="flex items-center gap-2 font-semibold">
                <CheckIcon />
                {needsNextSide ? "Front looks clear" : "Photo looks clear"}
              </div>
              <p className="mt-1 text-sm leading-5">
                {needsNextSide
                  ? "Next we’ll scan the back of your ID."
                  : "All four corners are visible and the text is readable."}
              </p>
            </div>
          )}

          <div className="overflow-hidden rounded-[28px] bg-ink">
            {latest ? (
              <CaptureImage
                src={latest.dataUrl}
                alt={`${documentLabel(documentType)} ${latest.side}`}
                className={
                  blurry
                    ? "h-48 w-full object-cover blur-[2px] saturate-50"
                    : "h-48 w-full object-cover"
                }
              />
            ) : (
              <div className="flex h-48 items-center justify-center text-sm text-white/70">
                No photo yet. Go back and scan your ID.
              </div>
            )}
          </div>

          {blurry ? (
            <ul className="mt-4 space-y-2 text-sm leading-5 text-slate">
              <li>Clean the camera lens</li>
              <li>Avoid shadows and reflections</li>
              <li>Place the ID fully inside the frame</li>
            </ul>
          ) : (
            <p className="mt-4 text-sm leading-5 text-slate">
              Using {documentLabel(documentType).toLowerCase()}
              {latest ? ` · ${latest.side}` : ""}. Make sure names and dates
              match the physical document.
            </p>
          )}

          <div className="mt-auto space-y-3 pt-6">
            <TrustNote />
            {blurry ? (
              <Button
                variant="danger"
                onClick={() => {
                  router.push("/verify/scan");
                }}
              >
                Retake photo
              </Button>
            ) : (
              <Button onClick={continueFlow} disabled={!latest}>
                {needsNextSide ? "Scan the back" : "Use this photo"}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                clearCaptures();
                router.push("/verify/scan");
              }}
            >
              Start this scan over
            </Button>
          </div>
        </div>
      </Screen>
    </PhoneShell>
  );
}

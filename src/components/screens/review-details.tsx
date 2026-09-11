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
import { CaptureImage } from "@/components/ui/capture-image";
import { documentLabel, formatDate } from "@/lib/kyc";
import { api } from "@/trpc/react";

export function ReviewDetails() {
  const router = useRouter();
  const {
    documentType,
    captures,
    selfieUrl,
    details,
    updateDetails,
    markSubmitted,
  } = useKyc();
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submit = api.kyc.submit.useMutation({
    onSuccess: (result) => {
      markSubmitted(result.referenceId);
      router.push("/verify/submitted");
    },
    onError: () => {
      setError("We couldn’t submit just now. Check your connection and retry.");
    },
  });

  const type = documentType ?? "license";
  const front = captures.find((item) => item.side === "front");
  const canSubmit =
    consent && details.fullName.trim().length > 1 && !submit.isPending;

  return (
    <PhoneShell>
      <Screen>
        <ScreenHeader title="Review details" backHref="/verify/selfie" />
        <StepProgress step={4} />
        <div className="flex flex-1 flex-col px-5 pb-6">
          <h2 className="text-[26px] font-semibold leading-tight tracking-tight text-ink">
            Confirm this is correct
          </h2>
          <p className="mt-2 text-[16px] leading-6 text-muted">
            We read these details from your {documentLabel(type).toLowerCase()}.
            Edit anything that doesn’t match.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="overflow-hidden rounded-2xl bg-ink">
              {front ? (
                <CaptureImage
                  src={front.dataUrl}
                  alt="Captured ID"
                  className="h-24 w-full object-cover"
                />
              ) : (
                <div className="flex h-24 items-center justify-center text-xs text-white/70">
                  ID photo
                </div>
              )}
            </div>
            <div className="overflow-hidden rounded-2xl bg-ink">
              {selfieUrl ? (
                <CaptureImage
                  src={selfieUrl}
                  alt="Liveness selfie"
                  className="h-24 w-full object-cover"
                />
              ) : (
                <div className="flex h-24 items-center justify-center text-xs text-white/70">
                  Selfie
                </div>
              )}
            </div>
          </div>

          <form
            className="mt-4 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (!canSubmit) return;
              submit.mutate({
                documentType: type,
                ...details,
              });
            }}
          >
            <Field
              label="Full name"
              value={details.fullName}
              onChange={(value) => updateDetails({ fullName: value })}
            />
            <Field
              label="Date of birth"
              type="date"
              value={details.dateOfBirth}
              onChange={(value) => updateDetails({ dateOfBirth: value })}
            />
            <Field
              label="Document number"
              value={details.documentNumber}
              onChange={(value) => updateDetails({ documentNumber: value })}
            />
            <Field
              label="Nationality"
              value={details.nationality}
              onChange={(value) => updateDetails({ nationality: value })}
            />
            <p className="text-sm text-muted">
              Expires {formatDate(details.expiry)} ·{" "}
              {documentLabel(type)}
            </p>

            <label className="flex items-start gap-3 rounded-2xl bg-white p-3.5 text-sm leading-5 text-ink">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 accent-brand"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
              />
              <span>
                I confirm this information is accurate and I agree to Harbor
                using it only to verify my identity.
              </span>
            </label>

            {error ? (
              <p role="alert" className="text-sm text-danger">
                {error}
              </p>
            ) : null}

            <div className="space-y-3 pt-2">
              <TrustNote />
              <Button type="submit" disabled={!canSubmit}>
                {submit.isPending ? "Submitting…" : "Submit verification"}
              </Button>
            </div>
          </form>
        </div>
      </Screen>
    </PhoneShell>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-1.5 block text-[13px] font-medium text-muted">
        {label}
      </span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 w-full rounded-2xl border border-line bg-white px-4 text-[16px] text-ink outline-none focus-visible:ring-2 focus-visible:ring-brand"
      />
    </label>
  );
}

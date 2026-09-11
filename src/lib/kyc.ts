export type DocumentType = "license" | "passport" | "national_id";
export type CaptureQuality = "good" | "blurry";
export type CameraPermission = "unknown" | "granted" | "denied";
export type KycStatus = "idle" | "pending" | "verified";
export type IdSide = "front" | "back";

export type CaptureResult = {
  dataUrl: string;
  quality: CaptureQuality;
  side: IdSide;
};

export type KycDetails = {
  fullName: string;
  dateOfBirth: string;
  documentNumber: string;
  nationality: string;
  expiry: string;
};

export const DOCUMENT_OPTIONS: Array<{
  id: DocumentType;
  title: string;
  description: string;
  detail: string;
}> = [
  {
    id: "license",
    title: "Driver’s license",
    description: "Most common · front and back",
    detail: "Government-issued photo license",
  },
  {
    id: "passport",
    title: "Passport",
    description: "Photo page only",
    detail: "Valid international passport",
  },
  {
    id: "national_id",
    title: "National ID",
    description: "Government-issued card",
    detail: "Resident or citizen identity card",
  },
];

export const DEFAULT_DETAILS: Record<DocumentType, KycDetails> = {
  license: {
    fullName: "Alex Rivera",
    dateOfBirth: "1994-03-12",
    documentNumber: "D123-4589-2201",
    nationality: "United States",
    expiry: "2028-08-18",
  },
  passport: {
    fullName: "Alex Rivera",
    dateOfBirth: "1994-03-12",
    documentNumber: "P5482931",
    nationality: "United States",
    expiry: "2031-01-09",
  },
  national_id: {
    fullName: "Alex Rivera",
    dateOfBirth: "1994-03-12",
    documentNumber: "ID-8820-4419",
    nationality: "United States",
    expiry: "2029-11-02",
  },
};

export const FLOW_STEPS = [
  {
    id: "home",
    href: "/",
    label: "Wallet",
    group: "Start",
    note: "Limited wallet access until the user completes identity verification.",
  },
  {
    id: "intro",
    href: "/verify",
    label: "Intro & camera",
    group: "Verify",
    note: "Explain why KYC is required, then request camera access with a clear privacy promise.",
  },
  {
    id: "id",
    href: "/verify/id",
    label: "Choose ID",
    group: "Verify",
    note: "Let the user pick a trusted document type before opening the scanner.",
  },
  {
    id: "scan",
    href: "/verify/scan",
    label: "Scan ID",
    group: "Verify",
    note: "Guided capture with live feedback. Capturing before alignment creates the blurry error.",
  },
  {
    id: "preview",
    href: "/verify/preview",
    label: "Photo check",
    group: "Verify",
    note: "Confirm a sharp photo or recover from a blurry capture with a retake path.",
  },
  {
    id: "selfie",
    href: "/verify/selfie",
    label: "Liveness",
    group: "Verify",
    note: "A short biometric sequence proves a real person is present.",
  },
  {
    id: "review",
    href: "/verify/review",
    label: "Confirm details",
    group: "Verify",
    note: "User reviews extracted data, edits mistakes, and consents before submit.",
  },
  {
    id: "submitted",
    href: "/verify/submitted",
    label: "Submitted",
    group: "Done",
    note: "Calm pending state with a reference number and next-step expectations.",
  },
] as const;

export function documentLabel(type: DocumentType | null) {
  return DOCUMENT_OPTIONS.find((item) => item.id === type)?.title ?? "ID";
}

export function needsBack(type: DocumentType | null) {
  return type === "license" || type === "national_id";
}

export function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_DETAILS,
  type CameraPermission,
  type CaptureResult,
  type DocumentType,
  type IdSide,
  type KycDetails,
  type KycStatus,
} from "@/lib/kyc";

type KycContextValue = {
  cameraPermission: CameraPermission;
  documentType: DocumentType | null;
  captures: CaptureResult[];
  selfieUrl: string | null;
  livenessPassed: boolean;
  details: KycDetails;
  status: KycStatus;
  referenceId: string | null;
  setCameraPermission: (value: CameraPermission) => void;
  setDocumentType: (value: DocumentType) => void;
  addCapture: (value: CaptureResult) => void;
  replaceCapture: (side: IdSide, value: CaptureResult) => void;
  clearCaptures: () => void;
  setSelfieUrl: (value: string | null) => void;
  setLivenessPassed: (value: boolean) => void;
  updateDetails: (value: Partial<KycDetails>) => void;
  markSubmitted: (referenceId: string) => void;
  reset: () => void;
};

const KycContext = createContext<KycContextValue | null>(null);

const initialDetails: KycDetails = DEFAULT_DETAILS.license;

export function KycProvider({ children }: { children: ReactNode }) {
  const [cameraPermission, setCameraPermission] =
    useState<CameraPermission>("unknown");
  const [documentType, setDocumentTypeState] = useState<DocumentType | null>(
    null,
  );
  const [captures, setCaptures] = useState<CaptureResult[]>([]);
  const [selfieUrl, setSelfieUrl] = useState<string | null>(null);
  const [livenessPassed, setLivenessPassed] = useState(false);
  const [details, setDetails] = useState<KycDetails>(initialDetails);
  const [status, setStatus] = useState<KycStatus>("idle");
  const [referenceId, setReferenceId] = useState<string | null>(null);

  const setDocumentType = useCallback((value: DocumentType) => {
    setDocumentTypeState(value);
    setDetails(DEFAULT_DETAILS[value]);
    setCaptures([]);
  }, []);

  const addCapture = useCallback((value: CaptureResult) => {
    setCaptures((current) => {
      const withoutSide = current.filter((item) => item.side !== value.side);
      return [...withoutSide, value];
    });
  }, []);

  const replaceCapture = useCallback((side: IdSide, value: CaptureResult) => {
    setCaptures((current) =>
      current.map((item) => (item.side === side ? value : item)),
    );
  }, []);

  const clearCaptures = useCallback(() => setCaptures([]), []);

  const updateDetails = useCallback((value: Partial<KycDetails>) => {
    setDetails((current) => ({ ...current, ...value }));
  }, []);

  const markSubmitted = useCallback((id: string) => {
    setReferenceId(id);
    setStatus("pending");
  }, []);

  const reset = useCallback(() => {
    setCameraPermission("unknown");
    setDocumentTypeState(null);
    setCaptures([]);
    setSelfieUrl(null);
    setLivenessPassed(false);
    setDetails(initialDetails);
    setStatus("idle");
    setReferenceId(null);
  }, []);

  const value = useMemo(
    () => ({
      cameraPermission,
      documentType,
      captures,
      selfieUrl,
      livenessPassed,
      details,
      status,
      referenceId,
      setCameraPermission,
      setDocumentType,
      addCapture,
      replaceCapture,
      clearCaptures,
      setSelfieUrl,
      setLivenessPassed,
      updateDetails,
      markSubmitted,
      reset,
    }),
    [
      cameraPermission,
      documentType,
      captures,
      selfieUrl,
      livenessPassed,
      details,
      status,
      referenceId,
      setDocumentType,
      addCapture,
      replaceCapture,
      clearCaptures,
      updateDetails,
      markSubmitted,
      reset,
    ],
  );

  return <KycContext.Provider value={value}>{children}</KycContext.Provider>;
}

export function useKyc() {
  const context = useContext(KycContext);
  if (!context) {
    throw new Error("useKyc must be used within KycProvider");
  }
  return context;
}

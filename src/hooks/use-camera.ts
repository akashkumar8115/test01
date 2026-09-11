"use client";

import { useEffect, useRef, useState } from "react";

type FacingMode = "user" | "environment";

export function useCamera(facing: FacingMode, enabled: boolean) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let stream: MediaStream | null = null;
    let cancelled = false;

    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: facing,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          await video.play();
          setReady(true);
          setError(null);
        }
      } catch {
        setReady(false);
        setError("unavailable");
      }
    }

    void start();

    return () => {
      cancelled = true;
      setReady(false);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [enabled, facing]);

  return { videoRef, ready, error };
}

export function captureVideoFrame(video: HTMLVideoElement) {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth || 720;
  canvas.height = video.videoHeight || 1280;
  const context = canvas.getContext("2d");
  context?.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.86);
}

export function placeholderIdImage(label: string, side: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="400">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#123524"/>
          <stop offset="1" stop-color="#0f6e56"/>
        </linearGradient>
      </defs>
      <rect width="640" height="400" rx="28" fill="url(#g)"/>
      <rect x="24" y="24" width="592" height="352" rx="20" fill="none" stroke="#d7efe5" stroke-width="2"/>
      <circle cx="118" cy="168" r="48" fill="#e6f6ef"/>
      <rect x="188" y="128" width="220" height="16" rx="8" fill="#e6f6ef"/>
      <rect x="188" y="158" width="160" height="12" rx="6" fill="#b7d8ca"/>
      <rect x="48" y="250" width="280" height="10" rx="5" fill="#b7d8ca"/>
      <rect x="48" y="274" width="200" height="10" rx="5" fill="#b7d8ca"/>
      <text x="48" y="70" fill="#e6f6ef" font-family="Arial" font-size="22" font-weight="700">${label}</text>
      <text x="48" y="98" fill="#c8eadc" font-family="Arial" font-size="14">${side}</text>
      <text x="430" y="340" fill="#e6f6ef" font-family="Arial" font-size="16">HARBOR</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function placeholderSelfieImage() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="480" height="640">
      <defs>
        <linearGradient id="bg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="#1c2740"/>
          <stop offset="1" stop-color="#0e1629"/>
        </linearGradient>
      </defs>
      <rect width="480" height="640" fill="url(#bg)"/>
      <ellipse cx="240" cy="270" rx="110" ry="140" fill="#d7b39a"/>
      <ellipse cx="240" cy="520" rx="160" ry="150" fill="#243049"/>
      <circle cx="200" cy="250" r="10" fill="#0e1629"/>
      <circle cx="280" cy="250" r="10" fill="#0e1629"/>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

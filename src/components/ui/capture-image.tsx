/* Captured camera frames are data URLs, so next/image is not appropriate. */
/* eslint-disable @next/next/no-img-element */

import { cn } from "@/lib/cn";

export function CaptureImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return <img src={src} alt={alt} className={cn("block", className)} />;
}

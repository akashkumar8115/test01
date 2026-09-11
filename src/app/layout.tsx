import "@/styles/globals.css";

import { type Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { KycProvider } from "@/components/kyc/kyc-provider";
import { StudioFrame } from "@/components/kyc/phone-shell";
import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "Harbor Wallet · Identity verification",
  description:
    "Verify your identity to unlock full access to the Harbor digital wallet.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0F6E56",
};

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="font-sans antialiased">
        <TRPCReactProvider>
          <KycProvider>
            <StudioFrame>{children}</StudioFrame>
          </KycProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}

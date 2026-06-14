import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PatchNote | AI Release Notes That Write Themselves",
  description: "Connect your Linear or GitHub workspace. PatchNote pulls completed tickets and uses AI to generate polished, audience aware changelogs instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${fraunces.variable} ${geist.variable} ${geistMono.variable} h-full`}
      >
        <body className="min-h-full flex flex-col bg-background text-text-primary font-sans antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

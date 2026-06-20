import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { PendoInitializer } from "@/components/pendo-initializer";
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
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(apiKey){(function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=o._q||[];v=['initialize','identify','updateOptions','pageLoad','track','trackAgent'];for(w=0,x=v.length;w<x;++w)(function(m){o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo.io/agent/static/'+apiKey+'/pendo.js';z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);})(window,document,'script','pendo');})('77b26930-6ff7-43cb-924a-92a596853718');`,
            }}
          />
        </head>
        <body className="min-h-full flex flex-col bg-background text-text-primary font-sans antialiased">
          <PendoInitializer />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

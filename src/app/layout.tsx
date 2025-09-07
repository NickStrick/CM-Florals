// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { SiteProvider } from "@/context/SiteContext";
import type { SiteConfig } from "@/types/site";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// import { mockSiteConfig } from "@/mocks/siteConfig"; 
import { mockSiteConfig } from "@/mocks/caroleConfig"; 

export const metadata: Metadata = {
   title: "CM Florals — Floral Design by Carole Murray",
    description:
      "CM Florals creates joyful floral design for weddings, holidays, celebrations and everyday gifting across Chicago. Founded by Carole Murray.",
};

async function getSiteConfig(): Promise<SiteConfig> {
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK === "1";

  if (useMock) {
    return mockSiteConfig;
  }

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const res = await fetch(`${base}/api/site`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load site config");
  return res.json();
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getSiteConfig();
  const showThemeSwitcher = process.env.NEXT_PUBLIC_THEME_SWITCHER === "1";

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-app   `}>
        <SiteProvider initial={config}>
          <main className="overflow-hidden">{children}</main>
          {showThemeSwitcher && <ThemeSwitcher />}
        </SiteProvider>
      </body>
    </html>
  );
}

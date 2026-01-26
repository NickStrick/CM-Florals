// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { SiteProvider } from "@/context/SiteContext";
import type { SiteConfig } from "@/types/site";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

// ✅ Admin UI (client) — keyboard toggle + bar
import AdminGate from "@/components/admin/AdminGate";
import AdminBar from "@/components/admin/AdminBar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// import { mockSiteConfig } from "@/mocks/siteConfig";
import { mockSiteConfig } from "@/mocks/markConfig";

export const metadata: Metadata = {
  title: mockSiteConfig.meta?.title || "Stricker Digital Websites",
  description: mockSiteConfig.meta?.description || "Stricker Digital Websites",
};


async function getSiteConfig(): Promise<SiteConfig> {
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK === "1";
  if (useMock) return mockSiteConfig;

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const site = process.env.NEXT_PUBLIC_SITE_ID ?? "carole";
  const prefer = (process.env.NEXT_PUBLIC_CONFIG_VARIANT ?? "published") as "draft" | "published";
  const fallback = prefer === "draft" ? "published" : "draft";

  async function fetchJSON(url: string) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn(`[config] ${url} -> ${res.status}`, text?.slice(0, 200));
      return null;
    }
    return (await res.json()) as SiteConfig;
  }

  // try preferred variant for this site id
  const primary = await fetchJSON(`${base}/api/config?variant=${prefer}&site=${encodeURIComponent(site)}`);
  if (primary) return primary;

  // then the other variant
  const secondary = await fetchJSON(`${base}/api/config?variant=${fallback}&site=${encodeURIComponent(site)}`);
  if (secondary) return secondary;

  console.warn("[config] Falling back to mockSiteConfig");
  return mockSiteConfig;
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-app`}>
        <SiteProvider initial={config}>
          <main className="overflow-hidden">{children}</main>
          {showThemeSwitcher && <ThemeSwitcher />}

          {/* ✅ Admin overlay (toggle with Ctrl/Cmd + Alt + A OR Ctrl/Cmd + Shift + A)
              Also supports ?admin=1 and persists via localStorage */}
          <AdminGate>
            <AdminBar />
          </AdminGate>
        </SiteProvider>
      </body>
    </html>
  );
}

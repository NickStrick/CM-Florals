// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { SiteProvider } from "@/context/SiteContext";
import { CartProvider } from "@/context/CartContext";
import type { SiteConfig } from "@/types/site";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import GlobalHashLinkHandler from "@/components/GlobalHashLinkHandler";
import PaymentsOverlay from "@/components/payments/PaymentsOverlay";

// ✅ Admin UI (client) — keyboard toggle + bar
import AdminGate from "@/components/admin/AdminGate";
import AdminBar from "@/components/admin/AdminBar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cmfloralsandgifts.com";

// import { mockSiteConfig } from "@/mocks/siteConfig";
import { mockSiteConfig } from "@/mocks/caroleConfig";
import SeoLocalBusinessSchema from "@/components/SeoLocalBusinessSchema";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "CM Florals & Gifts | Chicago Florist",
    template: "%s | CM Florals & Gifts",
  },
  description:
    "CM Florals & Gifts in Chicago, IL. Custom arrangements, weddings, events, and thoughtful gifts.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // helps prevent snippet weirdness, not required but solid
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "CM Florals & Gifts",
    title: "CM Florals & Gifts | Chicago Florist",
    description:
      "Custom arrangements, weddings, events, and thoughtful gifts in Chicago, IL.",
    locale: "en_US",
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "CM Florals & Gifts" }],

  },
  twitter: {
    card: "summary_large_image",
    title: "CM Florals & Gifts | Chicago Florist",
    description:
      "Custom arrangements, weddings, events, and thoughtful gifts in Chicago, IL.",
    images: ["/og.jpg"],
  },
};


async function getSiteConfig(): Promise<SiteConfig> {
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK === "1" || process.env.NEXT_PUBLIC_USE_MOCK === "2";
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
        <meta name="google-site-verification" content="LK3rJ_0mXFfWNK5RGCmh1doBT7wb2ElyJnEmmtvlefQ" />
        <SeoLocalBusinessSchema />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-app`}>
        <SiteProvider initial={config}>
          <CartProvider>
            <GlobalHashLinkHandler />
            <PaymentsOverlay />
            <main className="overflow-hidden"><div id="top"></div>{children}</main>
          {showThemeSwitcher && <ThemeSwitcher />}

          {/* ✅ Admin overlay (toggle with Ctrl/Cmd + Alt + A OR Ctrl/Cmd + Shift + A)
              Also supports ?admin=1 and persists via localStorage */}
            <AdminGate>
              <AdminBar />
            </AdminGate>
          </CartProvider>
        </SiteProvider>
      </body>
    </html>
  );
}

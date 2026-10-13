import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { PreviewBanner, SiteFooter, SiteHeader, SkipLink } from "@/components/site-chrome";
import { isPreview } from "@/lib/preview";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

// Fonts are downloaded at build time and served from this site — no requests to Google at runtime.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

const description =
  "Ibrahima Mamby Bah — cloud infrastructure, Linux, DevOps and software projects, documented as engineering case studies.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Ibrahima Mamby Bah · MambyTech", template: "%s · MambyTech" },
  description,
  applicationName: "MambyTech",
  authors: [{ name: "Ibrahima Mamby Bah" }],
  creator: "Ibrahima Mamby Bah",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "MambyTech",
    locale: "en_US",
    title: "Ibrahima Mamby Bah · MambyTech",
    description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: "Ibrahima Mamby Bah · MambyTech", description },
  // Preview builds contain draft content and must never be indexed.
  robots: isPreview ? { index: false, follow: false } : { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f7f4ee",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <SkipLink />
        <PreviewBanner />
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}

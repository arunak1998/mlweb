import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { OG_IMAGE, SITE_SUBTITLE, SITE_TITLE, SITE_URL } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s | ${SITE_TITLE}` },
  description: SITE_SUBTITLE,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_SUBTITLE,
    siteName: SITE_TITLE,
    type: "website",
    url: "/",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_SUBTITLE,
    images: [OG_IMAGE],
  },
};

export const viewport: Viewport = {
  themeColor: "#07080f",
};

// Runs before first paint, so a saved light theme never flashes dark.
const themeScript = `try{if(localStorage.getItem("theme")==="light")document.documentElement.dataset.theme="light"}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <Header />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 sm:px-6">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}

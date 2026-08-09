import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { Providers } from "./Providers";
import InstallAppButton from "@/components/ui/InstallAppButton";
import StickySocialSidebar from "@/components/ui/StickySocialSidebar";
import Script from "next/script";
import AdskeeperNotification from "@/components/ui/AdskeeperNotification";
import AdskeeperWidget from "@/components/ui/AdskeeperWidget";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://movies.xflix.ink"),
  title: {
    default: "XFlix - Movies Review, Ratings, K-Dramas & Recommendations",
    template: "%s | XFlix",
  },
  description: "Discover honest movie reviews, user ratings, top Asian dramas, synopsis breakdowns, cast filmographies, and recommendations on XFlix Movies Review.",
  keywords: ["XFlix", "movies.xflix.ink", "movie reviews", "movies review", "film ratings", "K-Dramas", "Asian Dramas", "drama list", "top rated movies", "movie recommendations"],
  authors: [{ name: "XFlix" }],
  creator: "XFlix",
  publisher: "XFlix",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "XFlix - Movies Review, Ratings, K-Dramas & Recommendations",
    description: "Discover honest movie reviews, user ratings, top Asian dramas, synopsis breakdowns, cast filmographies, and recommendations on XFlix Movies Review.",
    url: "https://movies.xflix.ink",
    siteName: "XFlix",
    images: [
      {
        url: "https://movies.xflix.ink/opengraph-image",
        width: 1200,
        height: 630,
        alt: "XFlix Movies Review & Ratings Platform",
      },
      {
        url: "https://movies.xflix.ink/icon-512.png",
        width: 512,
        height: 512,
        alt: "XFlix Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "XFlix - Movies Review, Ratings, K-Dramas & Recommendations",
    description: "Discover honest movie reviews, user ratings, top Asian dramas, synopsis breakdowns, cast filmographies, and recommendations on XFlix Movies Review.",
    images: ["https://movies.xflix.ink/opengraph-image", "https://movies.xflix.ink/icon-512.png"],
  },
  appleWebApp: {
    capable: true,
    title: "XFlix",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0f0f23",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta property="og:site_name" content="XFlix" />
        <meta property="og:title" content="XFlix - Movies Review, Ratings, K-Dramas & Recommendations" />
        <meta property="og:description" content="Discover honest movie reviews, user ratings, top Asian dramas, synopsis breakdowns, cast filmographies, and recommendations on XFlix Movies Review." />
        <meta property="og:image" content="https://movies.xflix.ink/opengraph-image" />
        <meta property="og:image:secure_url" content="https://movies.xflix.ink/icon-512.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://movies.xflix.ink" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="XFlix - Movies Review, Ratings, K-Dramas & Recommendations" />
        <meta name="twitter:description" content="Discover honest movie reviews, user ratings, top Asian dramas, synopsis breakdowns, cast filmographies, and recommendations on XFlix Movies Review." />
        <meta name="twitter:image" content="https://movies.xflix.ink/opengraph-image" />
        <script src="https://jsc.adskeeper.com/site/1106781.js" async />
        <script src="https://jsc.adskeeper.com/site/2066162.js" async />
      </head>
      <body className={`${inter.className} bg-[#0f0f23] text-white antialiased`} suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <InstallAppButton />
          <StickySocialSidebar />
          <AdskeeperNotification />
          <div className="max-w-7xl mx-auto px-4 w-full my-6">
            <AdskeeperWidget widgetId="2066162" />
          </div>
          <Footer />
          <MobileBottomNav />
        </Providers>
      </body>
    </html>
  );
}

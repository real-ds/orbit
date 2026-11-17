import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AI Intelligence Tracker — Automated AI & Tech News Aggregation",
    template: "%s · AI Intelligence Tracker",
  },
  description:
    "Automated AI and technology news aggregation platform. Discover, search, and explore recent developments in artificial intelligence, machine learning, agentic AI, research papers, model releases, and industry announcements.",
  applicationName: "AI Intelligence Tracker",
  keywords: [
    "AI news",
    "artificial intelligence",
    "machine learning",
    "agentic AI",
    "LLM",
    "AI research",
    "model releases",
    "AI industry",
    "technology news",
    "AI aggregation",
  ],
  authors: [{ name: "AI Intelligence Tracker" }],
  openGraph: {
    title: "AI Intelligence Tracker — Automated AI & Tech News Aggregation",
    description:
      "Stay informed about the latest AI developments. Automated collection, AI-powered summarization, and structured metadata for easy discovery.",
    siteName: "AI Intelligence Tracker",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Intelligence Tracker — Automated AI & Tech News Aggregation",
    description:
      "Stay informed about the latest AI developments. Automated collection, AI-powered summarization, and structured metadata for easy discovery.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0D0C",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning className="font-sans antialiased bg-bg text-text-primary min-h-screen">
        <Navbar />
        <main style={{ paddingTop: "72px" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
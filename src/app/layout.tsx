import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SiteFooter } from "@/components/layout/SiteFooter";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
  weight: "400",
  style: "italic",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://orbit.vercel.app"),
  title: {
    default: "Orbit",
    template: "%s · Orbit",
  },
  description:
    "Track the latest AI research, model releases, frameworks and industry news. Summarised every 48 hours, always linked to the original source.",
  applicationName: "Orbit",
  openGraph: {
    title: "Orbit",
    description:
      "The latest AI research, model releases and industry news — summarised every 48 hours.",
    type: "website",
    siteName: "Orbit",
  },
  twitter: {
    card: "summary_large_image",
    title: "Orbit",
    description:
      "The latest AI research, model releases and industry news — summarised every 48 hours.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * Applies the stored theme before first paint so the page never flashes the
 * wrong colour scheme on load.
 */
const themeScript = `(function(){try{var s=localStorage.getItem('orbit:theme');var t=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t;}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body suppressHydrationWarning>
        <a className="skip-link" href="#app">
          Skip to content
        </a>
        <Navbar />
        <main className="wrap" id="app">
          {children}
        </main>
        <SiteFooter />
        <ThemeToggle />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { getCustomLogoSrc } from "@/lib/logo";
import "./globals.css";
import { cn } from "@/lib/utils";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Shaka Fishing Charter & Tours | Lahaina, Maui",
  description:
    "Blue-water sportfishing charters out of Lahaina Harbor, Maui. Half-day, full-day, and full-day-plus-cookout trips chasing marlin, mahi-mahi, ono, and ahi. Book your charter today.",
  metadataBase: new URL("https://shakafishingcharter.com"),
  openGraph: {
    title: "Shaka Fishing Charter & Tours | Lahaina, Maui",
    description:
      "Blue-water sportfishing charters out of Lahaina Harbor, Maui. Half-day, full-day, and full-day-plus-cookout trips chasing marlin, mahi-mahi, ono, and ahi.",
    siteName: "Shaka Fishing Charter & Tours",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const logoSrc = getCustomLogoSrc();

  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        fraunces.variable,
        inter.variable,
        jetbrainsMono.variable
      )}
    >
      <body className="min-h-full flex flex-col bg-foam text-ink">
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[100] focus-visible:rounded focus-visible:bg-gold focus-visible:px-4 focus-visible:py-2 focus-visible:text-ink focus-visible:font-medium"
        >
          Skip to main content
        </a>
        <Navbar logoSrc={logoSrc} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

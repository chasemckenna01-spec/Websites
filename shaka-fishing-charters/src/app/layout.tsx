import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { business } from "@/lib/site-data";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${business.name} | Maui, Hawaii`,
  description:
    "Private sportfishing charters out of Maui, Hawaii with Captain Chase McKenna and Fishing Guide Casimiri Bushnell. Half-day, full-day, and full dining experience charters.",
  keywords: [
    "Maui fishing charter",
    "Lahaina fishing charter",
    "Maui sportfishing",
    "Hawaii deep sea fishing",
  ],
  openGraph: {
    title: `${business.name} | Maui, Hawaii`,
    description:
      "Private sportfishing charters out of Maui, Hawaii. Half-day, full-day, and full dining experience charters.",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

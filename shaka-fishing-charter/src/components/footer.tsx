import Link from "next/link";
import { Phone, Mail, MapPin, AtSign } from "lucide-react";
import BrandMark from "./brand-mark";
import GpsStamp from "./gps-stamp";
import { navLinks, siteConfig } from "@/lib/site-data";

export default function Footer() {
  return (
    <footer className="bg-ink text-foam">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <BrandMark tone="light" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-mist">
              Private sportfishing charters departing {siteConfig.harbor}, Maui.
              Marlin, mahi-mahi, ono, and ahi — your day, your boat, your catch.
            </p>
            <div className="mt-6">
              <GpsStamp />
            </div>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-lagoon">
              Explore
            </h3>
            <ul className="mt-4 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foam/90 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-lagoon">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-foam/90">
              <li>
                <a
                  href={`tel:${siteConfig.phoneHref}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-gold"
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-gold"
                >
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{siteConfig.address}</span>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 transition-colors hover:text-gold"
                >
                  <AtSign className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {siteConfig.instagram}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-mist sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>Departing {siteConfig.harbor} · Maui, Hawai&apos;i</p>
        </div>
      </div>
    </footer>
  );
}

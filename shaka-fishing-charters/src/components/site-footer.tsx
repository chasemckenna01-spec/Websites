import Link from "next/link";
import Image from "next/image";
import { AtSign, Mail, MapPin, Phone } from "lucide-react";
import { business } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-primary text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-semibold">
            <Image
              src="/brand/logo-white.png"
              alt=""
              width={487}
              height={461}
              className="h-8 w-auto"
            />
            <span>{business.name}</span>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
            Private sportfishing charters departing {business.location.marina},{" "}
            {business.location.island}. Captained by {business.captain.name}, guided by{" "}
            {business.guide.name}.
          </p>
          <a
            href={`https://instagram.com/${business.contact.instagram.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-[44px] cursor-pointer items-center gap-2 text-sm font-medium text-white/80 transition-colors duration-150 hover:text-secondary"
          >
            <AtSign className="h-4 w-4" aria-hidden="true" />
            {business.contact.instagram}
          </a>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
            Explore
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              { href: "/trips", label: "Trips & Pricing" },
              { href: "/about", label: "About the Crew" },
              { href: "/gallery", label: "Gallery" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-[44px] cursor-pointer items-center text-white/80 transition-colors duration-150 hover:text-secondary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
            Get in Touch
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
              <span>
                {business.location.marina}
                <br />
                {business.location.island}
              </span>
            </li>
            <li>
              <a
                href={`tel:${business.contact.phone.replace(/[^\d+]/g, "")}`}
                className="flex min-h-[44px] cursor-pointer items-center gap-2 transition-colors duration-150 hover:text-secondary"
              >
                <Phone className="h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                {business.contact.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${business.contact.email}`}
                className="flex min-h-[44px] cursor-pointer items-center gap-2 transition-colors duration-150 hover:text-secondary"
              >
                <Mail className="h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                {business.contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-6 text-center text-xs text-white/50 sm:px-8">
        © {new Date().getFullYear()} {business.name}. All rights reserved.
      </div>
    </footer>
  );
}

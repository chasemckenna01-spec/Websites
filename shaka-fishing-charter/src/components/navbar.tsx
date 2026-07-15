"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import BrandMarkView from "./brand-mark-view";
import { navLinks, siteConfig } from "@/lib/site-data";
import { cn } from "@/lib/cn";

export default function Navbar({ logoSrc }: { logoSrc: string | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solid
          ? "bg-foam/95 backdrop-blur-sm shadow-[0_1px_0_0_var(--color-line)]"
          : "bg-transparent"
      )}
    >
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8"
        aria-label="Primary"
      >
        <Link href="/" className="shrink-0" aria-label="Shaka Fishing Charter & Tours, home">
          <BrandMarkView logoSrc={logoSrc} tone={solid ? "dark" : "light"} />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "font-mono text-xs uppercase tracking-[0.2em] transition-colors",
                    solid ? "text-marlin hover:text-lagoon" : "text-foam/90 hover:text-gold",
                    active && (solid ? "text-lagoon" : "text-gold")
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-5 md:flex">
          <a
            href={`tel:${siteConfig.phoneHref}`}
            className={cn(
              "inline-flex items-center gap-2 font-mono text-xs tracking-wide transition-colors",
              solid ? "text-marlin hover:text-lagoon" : "text-foam/90 hover:text-gold"
            )}
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            {siteConfig.phone}
          </a>
          <Link
            href="/contact"
            className="cursor-pointer rounded-full bg-gold px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-[0.15em] text-ink transition-all duration-200 hover:bg-gold-bright hover:-translate-y-0.5"
          >
            Book Now
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "cursor-pointer p-2 md:hidden",
            solid ? "text-marlin" : "text-foam"
          )}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={cn(
          "grid overflow-hidden bg-foam transition-[grid-template-rows] duration-300 ease-out md:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="min-h-0">
          <ul className="flex flex-col gap-1 px-5 pb-6 pt-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-lg px-3 py-3 font-display text-2xl text-ink hover:bg-foam-dim"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 border-t border-line px-5 py-5">
            <a
              href={`tel:${siteConfig.phoneHref}`}
              className="inline-flex items-center gap-2 font-mono text-sm text-marlin"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {siteConfig.phone}
            </a>
            <Link
              href="/contact"
              className="cursor-pointer rounded-full bg-gold px-5 py-3 text-center font-mono text-xs font-medium uppercase tracking-[0.15em] text-ink"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowDown } from "lucide-react";
import MarlinLine from "./marlin-line";
import GpsStamp from "./gps-stamp";
import CtaButton from "./cta-button";

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const marlinRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const copyTargets = gsap.utils.toArray<HTMLElement>("[data-hero-copy]");

      if (prefersReduced) {
        gsap.set(copyTargets, { opacity: 1, y: 0 });
        return;
      }

      const paths =
        marlinRef.current?.querySelectorAll<SVGPathElement>("[data-marlin-part]") ??
        [];

      paths.forEach((path) => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
      });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.to(paths, {
        strokeDashoffset: 0,
        duration: 1.3,
        ease: "power2.inOut",
        stagger: 0.1,
      })
        .from(
          copyTargets,
          { opacity: 0, y: 20, duration: 0.6, stagger: 0.1 },
          "-=0.9"
        )
        .to(
          marlinRef.current,
          { y: -10, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 },
          "-=0.2"
        );
    },
    { scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-gradient-to-b from-ink via-marlin-deep to-marlin pt-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(60%_50%_at_80%_20%,rgba(217,164,65,0.18),transparent_60%),radial-gradient(50%_40%_at_10%_85%,rgba(47,168,159,0.2),transparent_60%)]"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-start justify-center gap-8 px-5 py-24 sm:px-8 lg:flex-row lg:items-center lg:gap-12">
        <div className="max-w-xl lg:pr-8">
          <p
            data-hero-copy
            className="font-mono text-xs uppercase tracking-[0.3em] text-gold"
          >
            Lahaina Harbor · Maui, Hawai&apos;i
          </p>
          <h1
            data-hero-copy
            className="text-balance mt-5 font-display text-5xl leading-[1.05] text-foam sm:text-6xl lg:text-7xl"
          >
            Chase blue water off Lahaina.
          </h1>
          <p
            data-hero-copy
            className="mt-6 max-w-md text-balance text-lg leading-relaxed text-foam/80"
          >
            Private sportfishing charters for marlin, mahi-mahi, ono, and ahi —
            your boat, your crew, your day on the water. No experience needed,
            just a reason to go.
          </p>
          <div data-hero-copy className="mt-10 flex flex-wrap items-center gap-4">
            <CtaButton href="/charters" variant="primary">
              Book Your Charter
            </CtaButton>
            <CtaButton href="/gallery" variant="outline-light">
              See the Boat
            </CtaButton>
          </div>
          <div data-hero-copy className="mt-10">
            <GpsStamp className="text-foam/60" />
          </div>
        </div>

        <div className="relative w-full max-w-xl lg:max-w-2xl">
          <MarlinLine
            ref={marlinRef}
            strokeWidth={2.5}
            className="h-auto w-full text-gold/90 drop-shadow-[0_0_40px_rgba(217,164,65,0.15)]"
          />
        </div>
      </div>

      <div className="relative flex justify-center pb-8">
        <span
          data-hero-copy
          className="inline-flex flex-col items-center gap-2 text-foam/50"
        >
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em]">
            Scroll
          </span>
          <ArrowDown className="h-4 w-4 motion-safe:animate-bounce" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}

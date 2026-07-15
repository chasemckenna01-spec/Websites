"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
  y?: number;
  delay?: number;
};

export default function Reveal({
  children,
  className,
  stagger = false,
  y = 24,
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) return;

      const targets = stagger ? Array.from(ref.current.children) : ref.current;

      gsap.from(targets, {
        opacity: 0,
        y,
        duration: 0.6,
        delay,
        ease: "power2.out",
        stagger: stagger ? 0.08 : 0,
        scrollTrigger: {
          trigger: ref.current,
          // "top bottom-=40" (not "top 85%"): a percentage-of-viewport
          // start can be mathematically unreachable for elements near the
          // end of the page, when there isn't enough scrollable distance
          // left below them to satisfy it — leaving that content stuck at
          // opacity 0 forever. Triggering as the element enters the
          // viewport is always reachable, at the top of the page or the
          // very bottom.
          start: "top bottom-=40",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

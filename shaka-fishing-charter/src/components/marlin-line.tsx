import { forwardRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Original single-line contour mark of a leaping marlin, in the spirit of
 * vintage tournament-board and Hawaiian tattoo-flash line art. Each path
 * carries a data-marlin-part attribute so the hero can stagger-draw them
 * with GSAP (stroke-dasharray reveal) on load.
 */
const MarlinLine = forwardRef<
  SVGSVGElement,
  { className?: string; strokeWidth?: number }
>(function MarlinLine({ className, strokeWidth = 3 }, ref) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 600 340"
      fill="none"
      className={cn("overflow-visible", className)}
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          data-marlin-part="back"
          d="M40,300 C100,250 140,210 190,185 C250,150 300,130 340,118 C380,106 410,98 430,90 C480,72 540,55 580,40"
        />
        <path
          data-marlin-part="belly"
          d="M70,270 C140,290 200,280 250,255 C300,230 340,195 380,160 C395,148 405,138 415,128"
        />
        <path data-marlin-part="dorsal" d="M240,155 C255,110 280,75 300,60 C305,90 295,125 275,150" />
        <path data-marlin-part="pectoral" d="M320,195 C330,215 340,230 335,250" />
        <path data-marlin-part="tail-upper" d="M70,270 C50,255 30,240 10,220" />
        <path data-marlin-part="tail-lower" d="M70,270 C55,300 30,320 5,335" />
      </g>
    </svg>
  );
});

export default MarlinLine;

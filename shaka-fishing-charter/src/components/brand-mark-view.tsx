import Image from "next/image";
import MarlinLine from "./marlin-line";
import { cn } from "@/lib/cn";

/**
 * Pure presentational brand lockup — safe to use in client components.
 * Server-side logo detection lives in lib/logo.ts + brand-mark.tsx.
 */
export default function BrandMarkView({
  logoSrc,
  className,
  markClassName,
  wordmarkClassName,
  tone = "dark",
}: {
  logoSrc?: string | null;
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
  tone?: "dark" | "light";
}) {
  if (logoSrc) {
    return (
      <span className={cn("inline-flex items-center", className)}>
        <Image
          src={logoSrc}
          alt="Shaka Fishing Charter & Tours"
          width={160}
          height={64}
          className={cn("h-10 w-auto", markClassName)}
          priority
        />
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <MarlinLine
        strokeWidth={5}
        className={cn(
          "h-8 w-8",
          tone === "dark" ? "text-marlin" : "text-foam",
          markClassName
        )}
      />
      <span
        className={cn(
          "font-display text-lg leading-none tracking-tight",
          tone === "dark" ? "text-ink" : "text-foam",
          wordmarkClassName
        )}
      >
        Shaka
        <span className="block font-mono text-[0.55rem] font-medium uppercase tracking-[0.25em] text-lagoon">
          Fishing Charter
        </span>
      </span>
    </span>
  );
}

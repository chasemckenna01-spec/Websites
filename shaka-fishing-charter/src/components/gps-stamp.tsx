import { Anchor } from "lucide-react";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/site-data";

export default function GpsStamp({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-lagoon",
        className
      )}
    >
      <Anchor className="h-3 w-3" aria-hidden="true" />
      <span className="tabular-nums">{siteConfig.coordinates}</span>
      <span className="text-mist">·</span>
      <span>{siteConfig.harbor}</span>
    </div>
  );
}

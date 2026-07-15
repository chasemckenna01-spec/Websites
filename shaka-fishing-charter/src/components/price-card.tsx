import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import type { CharterTier } from "@/lib/site-data";

export default function PriceCard({
  tier,
  featured = false,
}: {
  tier: CharterTier;
  featured?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-2xl border p-8",
        featured
          ? "border-gold/40 bg-marlin text-foam shadow-[0_20px_60px_-20px_rgba(10,27,44,0.5)]"
          : "border-line bg-white text-ink"
      )}
    >
      {tier.tag ? (
        <span
          className={cn(
            "mb-4 inline-flex w-fit items-center rounded-full px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.2em]",
            featured ? "bg-gold text-ink" : "bg-lagoon/10 text-lagoon"
          )}
        >
          {tier.tag}
        </span>
      ) : null}

      <h3 className="font-display text-2xl">{tier.name}</h3>
      <p
        className={cn(
          "mt-1 font-mono text-xs uppercase tracking-[0.2em]",
          featured ? "text-foam/60" : "text-ink/50"
        )}
      >
        {tier.duration}
      </p>

      <p className="mt-6 font-mono text-4xl font-medium tabular-nums">
        ${tier.price.toLocaleString()}
      </p>
      <p className={cn("mt-1 text-xs", featured ? "text-foam/60" : "text-ink/50")}>
        per charter · up to 6 anglers
      </p>

      <p
        className={cn(
          "mt-6 text-sm leading-relaxed",
          featured ? "text-foam/85" : "text-ink/70"
        )}
      >
        {tier.summary}
      </p>

      <ul className="mt-6 flex-1 space-y-3">
        {tier.includes.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm">
            <Check
              className={cn(
                "mt-0.5 h-4 w-4 shrink-0",
                featured ? "text-gold" : "text-lagoon"
              )}
              aria-hidden="true"
            />
            <span className={featured ? "text-foam/90" : "text-ink/80"}>{item}</span>
          </li>
        ))}
      </ul>

      <Link
        href={`/contact?charter=${tier.id}`}
        className={cn(
          "mt-8 cursor-pointer inline-flex items-center justify-center rounded-full px-6 py-3.5 font-mono text-xs font-medium uppercase tracking-[0.15em] transition-all duration-200 hover:-translate-y-0.5",
          featured
            ? "bg-gold text-ink hover:bg-gold-bright"
            : "bg-marlin text-foam hover:bg-marlin-deep"
        )}
      >
        Book the {tier.name}
      </Link>
    </div>
  );
}

import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import PageHeader from "@/components/page-header";
import SectionHeading from "@/components/section-heading";
import PriceCard from "@/components/price-card";
import Reveal from "@/components/reveal";
import { charterTiers, faqs } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Charters & Pricing | Shaka Fishing Charter & Tours",
  description:
    "Three ways to fish Lahaina's blue water: the 4-Hour Charter ($1,500), 8-Hour Charter ($2,800), and the Full-Day Experience with a boat-side cookout ($4,500).",
};

const comparisonRows: {
  label: string;
  values: [string | boolean, string | boolean, string | boolean];
}[] = [
  { label: "Duration", values: ["4 hours", "8 hours", "8 hours"] },
  { label: "Anglers included", values: ["Up to 6", "Up to 6", "Up to 6"] },
  { label: "Rods, reels & tackle", values: [true, true, true] },
  { label: "Ice, water & soft drinks", values: [true, true, true] },
  { label: "Extended range to deeper grounds", values: [false, true, true] },
  { label: "Fresh catch cooked onboard", values: [false, false, true] },
  { label: "Anchorage swim & relax time", values: [false, false, true] },
];

function ComparisonCell({ value }: { value: string | boolean }) {
  if (typeof value === "string") {
    return <span className="font-mono text-sm text-ink/80">{value}</span>;
  }
  return value ? (
    <Check className="mx-auto h-5 w-5 text-lagoon" aria-hidden="true" />
  ) : (
    <Minus className="mx-auto h-5 w-5 text-ink/20" aria-hidden="true" />
  );
}

export default function ChartersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Charters & Pricing"
        title="Three ways to fish Lahaina's blue water."
        description="Every trip is a private charter — just your group aboard. Pick the length that fits your day, then let us handle the rest."
      />

      <section className="bg-foam px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal
            stagger
            className="grid grid-cols-1 gap-6 lg:grid-cols-3"
          >
            {charterTiers.map((tier) => (
              <PriceCard
                key={tier.id}
                tier={tier}
                featured={tier.id === "full-experience"}
              />
            ))}
          </Reveal>
        </div>
      </section>

      {/* Comparison table */}
      <section className="bg-foam-dim px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            align="center"
            eyebrow="Side by Side"
            title="Compare the charters."
          />
          <Reveal className="mt-12 overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line">
                  <th className="p-5 font-mono text-xs uppercase tracking-[0.15em] text-ink/50">
                    Included
                  </th>
                  {charterTiers.map((tier) => (
                    <th
                      key={tier.id}
                      className="p-5 text-center font-display text-lg text-ink"
                    >
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.label}
                    className={i % 2 === 0 ? "bg-foam/60" : undefined}
                  >
                    <th
                      scope="row"
                      className="p-5 text-sm font-medium text-ink/80"
                    >
                      {row.label}
                    </th>
                    {row.values.map((value, idx) => (
                      <td key={idx} className="p-5 text-center">
                        <ComparisonCell value={value} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-foam px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            align="center"
            eyebrow="Before You Book"
            title="Frequently asked questions."
          />
          <Reveal stagger className="mt-12 space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-line bg-white px-6 py-5 open:shadow-sm"
              >
                <summary className="cursor-pointer list-none font-display text-lg text-ink marker:content-none">
                  <span className="flex items-center justify-between gap-4">
                    {faq.question}
                    <span
                      aria-hidden="true"
                      className="shrink-0 font-mono text-lg text-lagoon transition-transform duration-200 group-open:rotate-45"
                    >
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  {faq.answer}
                </p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}

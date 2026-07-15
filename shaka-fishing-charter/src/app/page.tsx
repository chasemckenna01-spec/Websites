import { ChefHat, Clock, Quote, Ship, Star, Users } from "lucide-react";
import Hero from "@/components/hero";
import Reveal from "@/components/reveal";
import SectionHeading from "@/components/section-heading";
import PriceCard from "@/components/price-card";
import CtaButton from "@/components/cta-button";
import WaveDivider from "@/components/wave-divider";
import { charterTiers, targetSpecies } from "@/lib/site-data";

export default function Home() {
  return (
    <>
      <Hero />

      {/* Target species */}
      <section className="bg-foam px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="What You'll Chase"
            title="Four fish worth flying for."
            description="The waters between Lahaina and Lāna'i hold some of the best blue-water fishing in the Pacific. Here's what's on the line."
          />
          <Reveal
            stagger
            className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {targetSpecies.map((fish) => (
              <div
                key={fish.name}
                className="rounded-2xl border border-line bg-white p-6 transition-shadow duration-200 hover:shadow-lg"
              >
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-lagoon">
                  {fish.hawaiianOrCommon}
                </p>
                <h3 className="mt-2 font-display text-xl text-ink">{fish.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  {fish.blurb}
                </p>
                <p className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-ink/40">
                  {fish.season}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Charter tiers teaser */}
      <section className="bg-foam-dim px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Three Ways Aboard"
            title="Pick your day on the water."
            description="Every charter is private — just your group, your captain, and open ocean. Choose the length that fits your trip."
          />
          <Reveal
            stagger
            className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3"
          >
            {charterTiers.map((tier) => (
              <PriceCard key={tier.id} tier={tier} featured={tier.id === "full-experience"} />
            ))}
          </Reveal>
          <div className="mt-10 text-center">
            <CtaButton href="/charters" variant="outline-dark">
              Compare All Charters
            </CtaButton>
          </div>
        </div>
      </section>

      {/* Full-Day Experience spotlight */}
      <section className="relative overflow-hidden bg-gradient-to-b from-marlin-deep to-ink px-5 py-24 text-foam sm:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(50%_40%_at_20%_20%,rgba(217,164,65,0.18),transparent_60%)]"
        />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="The Signature Trip"
              title="Catch it. Cook it. Eat it — right on the boat."
              tone="light"
              description="The Full-Day Experience is the whole day, not just the fishing. After eight hours working the grounds, we idle into a quiet anchorage, fire up the grill, and turn your catch into lunch while you swim and unwind."
            />
            <div className="mt-8">
              <CtaButton href="/contact?charter=full-experience" variant="primary">
                Book the Full-Day Experience
              </CtaButton>
            </div>
          </Reveal>
          <Reveal
            stagger
            className="grid grid-cols-2 gap-4 font-mono text-xs uppercase tracking-[0.15em] text-foam/70"
          >
            <div className="rounded-xl border border-foam/15 bg-foam/5 p-5">
              <Clock className="h-5 w-5 text-gold" aria-hidden="true" />
              <p className="mt-3">8 Hours + Cookout</p>
            </div>
            <div className="rounded-xl border border-foam/15 bg-foam/5 p-5">
              <ChefHat className="h-5 w-5 text-gold" aria-hidden="true" />
              <p className="mt-3">Fresh Catch, Cooked Onboard</p>
            </div>
            <div className="rounded-xl border border-foam/15 bg-foam/5 p-5">
              <Users className="h-5 w-5 text-gold" aria-hidden="true" />
              <p className="mt-3">Up to 6 Anglers</p>
            </div>
            <div className="rounded-xl border border-foam/15 bg-foam/5 p-5">
              <Ship className="h-5 w-5 text-gold" aria-hidden="true" />
              <p className="mt-3">Private Charter, Slip 12</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Captain teaser */}
      <section className="bg-foam px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-lagoon">
              Your Crew
            </p>
            <h2 className="text-balance mt-3 font-display text-3xl leading-tight text-ink sm:text-4xl">
              Local knowledge, Lahaina waters.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-ink/70 sm:text-lg">
              We run out of Lahaina Harbor and fish these waters year-round —
              the drop-offs, the FADs, the current lines that hold fish. Every
              charter is captained and crewed by people who know exactly
              where to point the bow.
            </p>
            <div className="mt-8">
              <CtaButton href="/about" variant="outline-dark">
                Meet the Crew
              </CtaButton>
            </div>
          </Reveal>
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-marlin via-marlin-deep to-ink">
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center font-mono text-xs uppercase tracking-[0.2em] text-foam/40"
            >
              Captain &amp; boat photo coming soon
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonials (placeholder slots) */}
      <section className="bg-foam-dim px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            align="center"
            eyebrow="Aboard Shaka"
            title="What guests will say."
            description="Reviews from your first charters will land here — this is a placeholder layout, ready for real quotes."
          />
          <Reveal
            stagger
            className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3"
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-dashed border-line bg-white/60 p-7"
              >
                <div className="flex items-center gap-1 text-gold">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <Quote className="mt-4 h-5 w-5 text-ink/20" aria-hidden="true" />
                <p className="mt-2 text-sm italic leading-relaxed text-ink/50">
                  Guest review placeholder — swap in a real quote once your
                  first charters are booked.
                </p>
                <p className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-ink/40">
                  Guest Name — Placeholder
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-ink px-5 py-24 text-center text-foam sm:px-8">
        <WaveDivider
          flip
          fill="var(--color-foam-dim)"
          className="absolute -top-1 left-0 h-16 sm:h-24"
        />
        <div className="relative mx-auto max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">
            Slip 12, Lahaina Harbor
          </p>
          <h2 className="text-balance mt-4 font-display text-4xl leading-tight sm:text-5xl">
            Your day on the water is one call away.
          </h2>
          <p className="mt-5 text-lg text-foam/75">
            Half-day, full-day, or the whole experience — we&apos;ll help you
            pick the right trip.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <CtaButton href="/contact" variant="primary">
              Book Your Charter
            </CtaButton>
            <CtaButton href="/charters" variant="outline-light">
              View Pricing
            </CtaButton>
          </div>
        </div>
      </section>
    </>
  );
}

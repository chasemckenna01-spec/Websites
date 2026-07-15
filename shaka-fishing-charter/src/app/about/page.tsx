import type { Metadata } from "next";
import { Anchor, Compass, ShieldCheck, Users } from "lucide-react";
import PageHeader from "@/components/page-header";
import SectionHeading from "@/components/section-heading";
import Reveal from "@/components/reveal";
import CtaButton from "@/components/cta-button";
import { siteConfig } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "About | Shaka Fishing Charter & Tours",
  description:
    "Shaka Fishing Charter & Tours runs private sportfishing charters out of Lahaina Harbor, Maui — local knowledge, a private boat, and a day built around your group.",
};

const values = [
  {
    icon: Compass,
    title: "Local Knowledge",
    body: "We fish these waters year-round — the drop-offs, the FADs, and the current lines that hold fish off Lahaina.",
  },
  {
    icon: ShieldCheck,
    title: "USCG-Licensed",
    body: "Every charter is run by a licensed captain, with safety gear and briefings handled before lines go in the water.",
  },
  {
    icon: Users,
    title: "Private Charters",
    body: "It's just your group aboard — no stacking strangers on the same trip to fill a boat.",
  },
  {
    icon: Anchor,
    title: "Slip 12, Lahaina Harbor",
    body: "Easy to find, easy to load up, and close to the grounds — less time running, more time fishing.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Local knowledge, Lahaina waters."
        description="Shaka Fishing Charter & Tours runs private sportfishing charters out of Lahaina Harbor — built around your group, your day, your catch."
      />

      {/* Story */}
      <section className="bg-foam px-5 py-20 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal className="order-2 lg:order-1">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-lagoon">
              Our Story
            </p>
            <h2 className="text-balance mt-3 font-display text-3xl leading-tight text-ink sm:text-4xl">
              Built around one boat, one crew, one group at a time.
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-ink/70 sm:text-lg">
              <p>
                {siteConfig.name} runs out of {siteConfig.harbor}{" "}
                on Maui&apos;s west side, chasing marlin, mahi-mahi, ono, and
                ahi in the blue water between Lahaina and Lāna&apos;i.
              </p>
              <p>
                Every trip is private — one group, one boat, no stacking
                strangers together to fill a charter. Whether it&apos;s your
                first time holding a rod or you&apos;re chasing a personal
                best, the day is built around what you&apos;re here for.
              </p>
            </div>
            <div className="mt-8">
              <CtaButton href="/contact" variant="outline-dark">
                Get in Touch
              </CtaButton>
            </div>
          </Reveal>
          <Reveal className="order-1 aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-marlin via-marlin-deep to-ink lg:order-2">
            <div
              aria-hidden="true"
              className="flex h-full items-center justify-center px-8 text-center font-mono text-xs uppercase tracking-[0.2em] text-foam/40"
            >
              Captain &amp; crew photo coming soon
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-foam-dim px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            align="center"
            eyebrow="Why Fish With Us"
            title="What every charter includes."
          />
          <Reveal
            stagger
            className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-line bg-white p-6"
              >
                <value.icon className="h-6 w-6 text-lagoon" aria-hidden="true" />
                <h3 className="mt-4 font-display text-lg text-ink">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  {value.body}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Boat specs placeholder */}
      <section className="bg-foam px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-dashed border-line bg-white p-10 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-lagoon">
            The Boat
          </p>
          <h2 className="mt-3 font-display text-2xl text-ink">
            Add your boat&apos;s make, model, length, and specs here.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink/60">
            This section is a placeholder — send over your boat details and
            a few photos and we&apos;ll build this into a proper spec sheet.
          </p>
        </div>
      </section>
    </>
  );
}

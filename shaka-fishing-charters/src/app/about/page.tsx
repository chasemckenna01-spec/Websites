import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { OceanScene } from "@/components/decor/ocean-scene";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { business } from "@/lib/site-data";

export const metadata: Metadata = {
  title: `About | ${business.name}`,
  description: `Meet Captain ${business.captain.name} and Fishing Guide ${business.guide.name}, the crew behind ${business.name} in ${business.location.island}.`,
};

const crew = [
  {
    name: business.captain.name,
    role: business.captain.role,
    // PLACEHOLDER — replace with Chase's real bio
    bio: "PLACEHOLDER — Chase's real background goes here: years running charters, USCG license details, favorite grounds around Maui, and what makes a day on the Shaka boat different.",
  },
  {
    name: business.guide.name,
    role: business.guide.role,
    // PLACEHOLDER — replace with Casimiri's real bio
    bio: "PLACEHOLDER — Casimiri's real background goes here: fishing experience, specialties (trolling, bottom fishing, etc.), and role helping guests land fish.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative flex min-h-[50vh] items-end overflow-hidden">
        <OceanScene />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-32 sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-secondary">
            About Us
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold text-balance text-white sm:text-5xl">
            Two locals, one boat, and a lot of respect for these waters
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Our Story"
            title={`How ${business.shortName} started`}
            description={
              // PLACEHOLDER — replace with the real founding story
              "PLACEHOLDER — this is where the real story goes: how Chase and Casimiri started fishing together, how the business came together, and what guests can expect that's different from a typical Maui charter."
            }
          />
        </Reveal>

        <StaggerGroup className="mt-14 grid gap-6 sm:grid-cols-2">
          {crew.map((person) => (
            <StaggerItem key={person.name}>
              <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  {person.role}
                </p>
                <h2 className="mt-2 font-display text-2xl text-primary">{person.name}</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {person.bio}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-col gap-4 rounded-2xl bg-muted p-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="font-display text-lg text-primary">Where we depart from</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {business.location.marina}, {business.location.island}
                </p>
              </div>
            </div>
            <a
              href={`tel:${business.contact.phone.replace(/[^\d+]/g, "")}`}
              className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full border border-primary/20 px-6 py-3 text-sm font-semibold text-primary transition-colors duration-150 hover:bg-primary hover:text-white"
            >
              Call {business.contact.phone}
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

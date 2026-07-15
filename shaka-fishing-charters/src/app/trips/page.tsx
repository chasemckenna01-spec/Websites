import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { TripCard } from "@/components/trip-card";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { OceanAmbiance } from "@/components/decor/ocean-ambiance";
import { FishCursorTrail } from "@/components/decor/fish-cursor-trail";
import { tripTypes, business } from "@/lib/site-data";

export const metadata: Metadata = {
  title: `Trips & Pricing | ${business.name}`,
  description:
    "Half-day, full-day, and full dining experience fishing charters departing Maui, Hawaii.",
};

export default function TripsPage() {
  return (
    <div className="relative overflow-hidden">
      <OceanAmbiance />
      <FishCursorTrail />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Charters"
            title="Trips & Pricing"
            description="Every charter includes tackle, bait, and the full attention of a two-person crew. Pick the length that fits your day, then reserve with a deposit."
          />
        </Reveal>

        <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-3">
          {tripTypes.map((trip, i) => (
            <StaggerItem key={trip.slug}>
              <TripCard trip={trip} index={i} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </div>
  );
}

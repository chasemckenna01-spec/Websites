import type { Metadata } from "next";
import { AtSign } from "lucide-react";
import PageHeader from "@/components/page-header";
import Reveal from "@/components/reveal";
import CatchCard from "@/components/catch-card";
import CtaButton from "@/components/cta-button";
import { siteConfig } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Gallery | Shaka Fishing Charter & Tours",
  description:
    "A look at Shaka Fishing Charter & Tours — the boat, the crew, and the catch out of Lahaina Harbor, Maui.",
};

const captions = [
  "Blue marlin catch, Lahaina grounds",
  "Sunrise departure, Slip 12",
  "Mahi-mahi on the troll",
  "The boat at rest, Lahaina Harbor",
  "Ono, fresh off the line",
  "Full-Day Experience cookout",
  "Ahi, boat-side release",
  "West Maui Mountains from the water",
];

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="The boat, the crew, the catch."
        description="This first draft ships with a placeholder gallery — drop your own photos and video into /public/gallery and swap them in for the real thing."
      />

      <section className="bg-foam px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal
            stagger
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          >
            {captions.map((caption, index) => (
              <CatchCard
                key={caption}
                caption={caption}
                index={index}
                tall={index % 5 === 0}
              />
            ))}
          </Reveal>

          <Reveal className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-line bg-white px-8 py-12 text-center">
            <AtSign className="h-8 w-8 text-lagoon" aria-hidden="true" />
            <p className="max-w-md text-base text-ink/70">
              More of the day-to-day on the water lives on Instagram —
              follow along for real catches as they happen.
            </p>
            <CtaButton href="#" variant="outline-dark">
              Follow {siteConfig.instagram}
            </CtaButton>
          </Reveal>
        </div>
      </section>
    </>
  );
}

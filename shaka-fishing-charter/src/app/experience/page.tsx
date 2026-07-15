import type { Metadata } from "next";
import ScrollExpandMedia from "@/components/blocks/scroll-expansion-hero";
import SectionHeading from "@/components/section-heading";
import CtaButton from "@/components/cta-button";

export const metadata: Metadata = {
  title: "The Experience | Shaka Fishing Charter & Tours",
  description:
    "An aerial look at the waters Shaka Fishing Charter & Tours fishes off Lahaina, Maui — scroll to expand.",
};

export default function ExperiencePage() {
  return (
    <ScrollExpandMedia
      mediaType="video"
      mediaSrc="/media/maui-coastline.mp4"
      posterSrc="/media/maui-coastline-poster.jpg"
      bgImageSrc="/media/maui-coastline.jpg"
      title="Chase Blue Water"
      date="Lahaina, Maui"
      scrollToExpand="Scroll to Expand"
    >
      <div className="mx-auto max-w-3xl py-10">
        <SectionHeading
          align="center"
          eyebrow="The Grounds"
          title="This is Maui's west side."
          description="The drop-offs, current lines, and open water between Lahaina and Lāna'i — the grounds Shaka Fishing Charter & Tours runs every charter through, chasing marlin, mahi-mahi, ono, and ahi."
        />
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <CtaButton href="/charters" variant="primary">
            See the Charters
          </CtaButton>
          <CtaButton href="/contact" variant="outline-dark">
            Book Your Trip
          </CtaButton>
        </div>
      </div>
    </ScrollExpandMedia>
  );
}

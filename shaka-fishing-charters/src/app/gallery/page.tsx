import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { Reveal } from "@/components/motion/reveal";
import { business } from "@/lib/site-data";

export const metadata: Metadata = {
  title: `Gallery | ${business.name}`,
  description: "Photos from the water — catches, crew, and Maui sunsets.",
};

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Gallery"
          title="Life on the water"
          description="A look at recent trips. Tap any photo for a closer look."
        />
      </Reveal>

      <div className="mt-12">
        <GalleryGrid />
      </div>
    </div>
  );
}

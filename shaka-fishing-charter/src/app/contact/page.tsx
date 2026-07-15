import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import PageHeader from "@/components/page-header";
import Reveal from "@/components/reveal";
import InquiryForm from "@/components/inquiry-form";
import { siteConfig } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Contact | Shaka Fishing Charter & Tours",
  description:
    "Book a charter with Shaka Fishing Charter & Tours out of Lahaina Harbor, Maui. Call, text, email, or send an inquiry.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ charter?: string }>;
}) {
  const { charter } = await searchParams;

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's get you on the water."
        description="Tell us when you'd like to go and how many are in your group — we'll help you pick the right charter."
      />

      <section className="bg-foam px-5 py-20 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_0.8fr]">
          <Reveal className="rounded-2xl border border-line bg-white p-6 sm:p-10">
            <h2 className="font-display text-2xl text-ink">Send an inquiry</h2>
            <p className="mt-2 text-sm text-ink/60">
              Fields marked required help us get back to you faster.
            </p>
            <div className="mt-8">
              <InquiryForm initialCharter={charter} />
            </div>
          </Reveal>

          <Reveal stagger className="space-y-6">
            <div className="rounded-2xl bg-marlin p-8 text-foam">
              <h2 className="font-display text-xl">Call or text</h2>
              <p className="mt-2 text-sm text-foam/70">
                Fastest way to lock in a date, especially close to your trip.
              </p>
              <a
                href={`tel:${siteConfig.phoneHref}`}
                className="mt-5 inline-flex items-center gap-2.5 font-mono text-lg tracking-wide text-gold"
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                {siteConfig.phone}
              </a>
            </div>

            <div className="rounded-2xl border border-line bg-white p-8">
              <h2 className="font-display text-xl text-ink">Email</h2>
              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-4 inline-flex items-center gap-2.5 text-sm text-ink/80 hover:text-lagoon"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                {siteConfig.email}
              </a>
            </div>

            <div className="rounded-2xl border border-line bg-white p-8">
              <h2 className="font-display text-xl text-ink">Find us</h2>
              <p className="mt-4 flex items-start gap-2.5 text-sm text-ink/80">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {siteConfig.address}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  siteConfig.address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block font-mono text-xs uppercase tracking-[0.15em] text-lagoon hover:text-marlin"
              >
                Get Directions →
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/motion/reveal";
import { business } from "@/lib/site-data";

export const metadata: Metadata = {
  title: `Contact | ${business.name}`,
  description: `Get in touch with ${business.name} in ${business.location.island}.`,
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Contact"
          title="Get in touch"
          description="Questions about a trip, group bookings, or special requests — reach out and we'll respond as soon as we're off the water."
        />
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
        <Reveal>
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-foreground">Departure location</p>
                <p className="text-sm text-muted-foreground">
                  {business.location.marina}
                  <br />
                  {business.location.island}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-foreground">Phone</p>
                <a
                  href={`tel:${business.contact.phone.replace(/[^\d+]/g, "")}`}
                  className="cursor-pointer text-sm text-muted-foreground transition-colors duration-150 hover:text-accent"
                >
                  {business.contact.phone}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-foreground">Email</p>
                <a
                  href={`mailto:${business.contact.email}`}
                  className="cursor-pointer text-sm text-muted-foreground transition-colors duration-150 hover:text-accent"
                >
                  {business.contact.email}
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </div>
  );
}

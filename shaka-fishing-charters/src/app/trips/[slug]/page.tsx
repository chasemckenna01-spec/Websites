import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, Clock, Users } from "lucide-react";
import { BookingWidget } from "@/components/booking/booking-widget";
import { Reveal } from "@/components/motion/reveal";
import { tripTypes, business } from "@/lib/site-data";

export function generateStaticParams() {
  return tripTypes.map((trip) => ({ slug: trip.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const trip = tripTypes.find((t) => t.slug === slug);
  if (!trip) return {};
  return {
    title: `${trip.name} | ${business.name}`,
    description: trip.summary,
  };
}

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trip = tripTypes.find((t) => t.slug === slug);
  if (!trip) notFound();

  return (
    <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <div>
            {trip.highlight && (
              <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                {trip.highlight}
              </span>
            )}
            <h1 className="mt-4 font-display text-4xl font-semibold text-balance text-primary sm:text-5xl">
              {trip.name}
            </h1>
            <div className="mt-4 flex items-center gap-5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-secondary" aria-hidden="true" />
                {trip.durationHours} hours
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-secondary" aria-hidden="true" />
                Up to {trip.maxGuests} guests
              </span>
            </div>

            <p className="mt-8 text-lg leading-relaxed text-foreground/90">{trip.description}</p>

            <h2 className="mt-10 font-display text-xl text-primary">What&apos;s included</h2>
            <ul className="mt-4 space-y-3">
              {trip.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground/90">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-2xl bg-muted p-6 text-sm leading-relaxed text-muted-foreground">
              Departing {business.location.marina}, {business.location.island}. A{" "}
              {business.depositPercent}% deposit reserves your date; the balance is due the day
              of your trip.
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="lg:sticky lg:top-24">
            <BookingWidget trip={trip} priceCents={trip.price * 100} />
          </div>
        </Reveal>
      </div>
    </div>
  );
}

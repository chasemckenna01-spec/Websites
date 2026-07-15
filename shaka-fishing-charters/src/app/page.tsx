import Link from "next/link";
import { ArrowRight, Anchor, Fish, ShieldCheck } from "lucide-react";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { SectionHeading } from "@/components/section-heading";
import { TripCard } from "@/components/trip-card";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { business, testimonials, tripTypes } from "@/lib/site-data";

export default function HomePage() {
  return (
    <>
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc="/media/hero-video.mp4"
        posterSrc="/media/hero-poster.jpg"
        bgImageSrc="/media/hero-bg.jpg"
        title={business.tagline}
        date={business.location.island}
        scrollToExpand="Scroll to Explore"
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-lg leading-relaxed text-foreground/90">
            Private sportfishing charters departing {business.location.marina} with Captain{" "}
            {business.captain.name} and Fishing Guide {business.guide.name}. Half-day runs,
            full-day blue water hunts, or a full day on the water that ends with dinner
            you caught yourself.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Link
              href="/trips"
              className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent/20 transition-all duration-200 hover:bg-accent-light active:scale-[0.98]"
            >
              Book Your Trip
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/about"
              className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full border border-primary/20 px-7 py-3.5 text-base font-semibold text-primary transition-all duration-200 hover:bg-muted"
            >
              Meet the Crew
            </Link>
          </div>
        </div>
      </ScrollExpandMedia>

      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-border px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8">
          {[
            {
              icon: Anchor,
              title: "Local expertise",
              body: `Captain ${business.captain.name} and Guide ${business.guide.name} fish these waters year-round.`,
            },
            {
              icon: Fish,
              title: "Built for real anglers",
              body: "Small groups, full attention, gear dialed in for Maui's game fish.",
            },
            {
              icon: ShieldCheck,
              title: "Simple booking",
              body: `Reserve online with a ${business.depositPercent}% deposit — balance due day-of.`,
            },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4 py-8 sm:px-8 sm:py-10">
              <item.icon className="h-6 w-6 shrink-0 text-accent" strokeWidth={1.75} aria-hidden="true" />
              <div>
                <h3 className="font-display text-lg text-primary">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Charters"
            title="Choose your day on the water"
            description="Three ways to fish Maui with us, from a fast half-day run to a full-day experience with dinner on the boat."
          />
        </Reveal>

        <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-3">
          {tripTypes.map((trip, i) => (
            <StaggerItem key={trip.slug}>
              <TripCard trip={trip} index={i} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <section className="bg-primary py-24 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="The Crew"
              title="Two locals who know these waters"
              align="center"
              tone="light"
            />
          </Reveal>

          <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-2">
            {[
              {
                name: business.captain.name,
                role: business.captain.role,
                bio: "PLACEHOLDER — add Chase's real bio: years fishing Maui, background, favorite grounds, what guests can expect on board.",
              },
              {
                name: business.guide.name,
                role: business.guide.role,
                bio: "PLACEHOLDER — add Casimiri's real bio: experience, specialties, and role on the boat.",
              },
            ].map((person) => (
              <StaggerItem key={person.name}>
                <div className="rounded-2xl border border-white/15 bg-white/5 p-7 backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    {person.role}
                  </p>
                  <h3 className="mt-2 font-display text-2xl">{person.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">{person.bio}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <Reveal>
          <SectionHeading eyebrow="Guest Stories" title="What guests are saying" align="center" />
        </Reveal>

        <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <StaggerItem key={t.id}>
              <figure className="flex h-full flex-col justify-between rounded-2xl bg-muted p-7">
                <blockquote className="text-base leading-relaxed text-foreground">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 text-sm font-medium text-muted-foreground">
                  {t.author} · {t.location}
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(120deg, #0c4a6e 0%, #0e7490 100%)" }}
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-4xl px-5 py-24 text-center sm:px-8">
          <h2 className="font-display text-3xl font-semibold text-balance text-white sm:text-4xl">
            Ready to get out on the water?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Dates fill fast during peak season. Reserve your charter with a simple deposit and
            we&apos;ll handle the rest.
          </p>
          <Link
            href="/trips"
            className="mt-8 inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:bg-accent-light active:scale-[0.98]"
          >
            Book Your Trip
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}

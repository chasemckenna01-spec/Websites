import Link from "next/link";
import { ArrowRight, Clock, Users } from "lucide-react";
import type { TripType } from "@/lib/site-data";

export function TripCard({ trip, index = 0 }: { trip: TripType; index?: number }) {
  return (
    <Link
      href={`/trips/${trip.slug}`}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-surface p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {trip.highlight && (
        <span className="absolute right-6 top-6 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
          {trip.highlight}
        </span>
      )}

      <span className="font-display text-4xl text-accent/25 transition-colors duration-300 group-hover:text-accent/40">
        {String(index + 1).padStart(2, "0")}
      </span>

      <h3 className="mt-4 font-display text-2xl text-primary">{trip.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{trip.summary}</p>

      <div className="mt-5 flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-secondary" aria-hidden="true" />
          {trip.durationHours} hours
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="h-4 w-4 text-secondary" aria-hidden="true" />
          Up to {trip.maxGuests}
        </span>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
        <span className="font-display text-2xl text-primary">
          ${trip.price.toLocaleString("en-US")}
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-transform duration-200 group-hover:translate-x-1">
          View trip
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

import Link from "next/link";
import { XCircle } from "lucide-react";
import { business } from "@/lib/site-data";

export default function BookingCancelledPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-28 text-center sm:px-8">
      <XCircle className="h-16 w-16 text-muted-foreground" aria-hidden="true" />
      <h1 className="mt-6 font-display text-4xl text-primary">Checkout cancelled</h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        No worries — your date wasn&apos;t charged. If you had trouble at checkout, reach out to{" "}
        {business.captain.name} and {business.guide.name} directly and we&apos;ll get you booked.
      </p>
      <Link
        href="/trips"
        className="mt-8 inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full bg-accent px-6 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-accent-light active:scale-[0.98]"
      >
        Try again
      </Link>
    </div>
  );
}

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { business } from "@/lib/site-data";

export default function BookingSuccessPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-28 text-center sm:px-8">
      <CheckCircle2 className="h-16 w-16 text-accent" aria-hidden="true" />
      <h1 className="mt-6 font-display text-4xl text-primary">You&apos;re booked!</h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        Your deposit is confirmed. A confirmation email is on its way, and{" "}
        {business.captain.name} or {business.guide.name} will follow up with departure details
        for {business.location.marina}.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full bg-accent px-6 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-accent-light active:scale-[0.98]"
      >
        Back to home
      </Link>
    </div>
  );
}

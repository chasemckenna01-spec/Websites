"use client";

import { useId, useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { charterTiers, siteConfig } from "@/lib/site-data";

export default function InquiryForm({
  initialCharter,
}: {
  initialCharter?: string;
}) {
  const formId = useId();
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const phone = String(data.get("phone") ?? "");
    const date = String(data.get("date") ?? "");
    const guests = String(data.get("guests") ?? "");
    const charter = String(data.get("charter") ?? "");
    const message = String(data.get("message") ?? "");

    const charterLabel =
      charterTiers.find((tier) => tier.id === charter)?.name ??
      "Not sure yet";

    const subject = `Charter inquiry from ${name || "website"}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Preferred date: ${date || "Flexible"}`,
      `Guests: ${guests || "Not specified"}`,
      `Charter: ${charterLabel}`,
      "",
      "Message:",
      message || "(none)",
    ].join("\n");

    window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    setStatus("sent");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate={false}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`${formId}-name`}
            className="block text-sm font-medium text-ink"
          >
            Full name
          </label>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            required
            autoComplete="name"
            className="mt-1.5 block w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:border-marlin focus:outline-none"
            placeholder="Kai Anderson"
          />
        </div>
        <div>
          <label
            htmlFor={`${formId}-email`}
            className="block text-sm font-medium text-ink"
          >
            Email
          </label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-1.5 block w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:border-marlin focus:outline-none"
            placeholder="you@email.com"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`${formId}-phone`}
            className="block text-sm font-medium text-ink"
          >
            Phone
          </label>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            className="mt-1.5 block w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:border-marlin focus:outline-none"
            placeholder="(808) 555-0100"
          />
        </div>
        <div>
          <label
            htmlFor={`${formId}-guests`}
            className="block text-sm font-medium text-ink"
          >
            Number of guests
          </label>
          <input
            id={`${formId}-guests`}
            name="guests"
            type="number"
            min={1}
            max={6}
            className="mt-1.5 block w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:border-marlin focus:outline-none"
            placeholder="4"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`${formId}-date`}
            className="block text-sm font-medium text-ink"
          >
            Preferred date
          </label>
          <input
            id={`${formId}-date`}
            name="date"
            type="date"
            className="mt-1.5 block w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink focus:border-marlin focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor={`${formId}-charter`}
            className="block text-sm font-medium text-ink"
          >
            Which charter?
          </label>
          <select
            id={`${formId}-charter`}
            name="charter"
            defaultValue={initialCharter ?? ""}
            className="mt-1.5 block w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink focus:border-marlin focus:outline-none"
          >
            <option value="">Not sure yet</option>
            {charterTiers.map((tier) => (
              <option key={tier.id} value={tier.id}>
                {tier.name} — ${tier.price.toLocaleString()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor={`${formId}-message`}
          className="block text-sm font-medium text-ink"
        >
          Anything else we should know?
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={4}
          className="mt-1.5 block w-full resize-none rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:border-marlin focus:outline-none"
          placeholder="Celebrating something, traveling with kids, chasing a specific fish — let us know."
        />
      </div>

      <button
        type="submit"
        className="cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 font-mono text-xs font-medium uppercase tracking-[0.15em] text-ink transition-all duration-200 hover:bg-gold-bright hover:-translate-y-0.5 sm:w-auto"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        Send Inquiry
      </button>

      <p role="status" aria-live="polite" className="text-xs text-ink/50">
        {status === "sent"
          ? "Opening your email app to send this inquiry — if nothing happens, email us directly at " +
            siteConfig.email
          : "We'll open your email app with this inquiry pre-filled. Prefer to skip that? Call or text us directly."}
      </p>
    </form>
  );
}

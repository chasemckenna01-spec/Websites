"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, CheckCircle2 } from "lucide-react";
import {
  addMonths,
  getMonthGrid,
  monthLabel,
  monthRangeKeys,
  todayDayKey,
} from "@/lib/calendar";
import { formatDateLabel, formatUSD } from "@/lib/format";
import type { TripType } from "@/lib/site-data";
import { business } from "@/lib/site-data";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const MAX_MONTHS_AHEAD = 9;

type Step = "date" | "details" | "submitting" | "success" | "redirecting";

export function BookingWidget({ trip, priceCents }: { trip: TripType; priceCents: number }) {
  const [monthAnchor, setMonthAnchor] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [unavailable, setUnavailable] = useState<Set<string>>(new Set());
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [loadedMonthKey, setLoadedMonthKey] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("date");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const today = todayDayKey();
  const grid = useMemo(() => getMonthGrid(monthAnchor), [monthAnchor]);

  const minMonth = useMemo(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  }, []);
  const maxMonth = useMemo(() => addMonths(minMonth, MAX_MONTHS_AHEAD), [minMonth]);

  const currentMonthKey = monthRangeKeys(monthAnchor).start;
  if (currentMonthKey !== loadedMonthKey && !loadingAvailability) {
    setLoadingAvailability(true);
  }

  useEffect(() => {
    let cancelled = false;
    const { start, end } = monthRangeKeys(monthAnchor);
    fetch(`/api/availability?start=${start}&end=${end}`)
      .then((res) => res.json())
      .then((data: { unavailable?: string[] }) => {
        if (cancelled) return;
        setUnavailable(new Set(data.unavailable ?? []));
        setLoadedMonthKey(start);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load availability. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoadingAvailability(false);
      });
    return () => {
      cancelled = true;
    };
  }, [monthAnchor]);

  const depositCents = Math.round((priceCents * business.depositPercent) / 100);
  const balanceCents = priceCents - depositCents;

  function selectDay(dayKey: string, disabled: boolean) {
    if (disabled) return;
    setSelectedDay(dayKey);
    setStep("details");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDay) return;
    setStep("submitting");
    setError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripSlug: trip.slug,
          date: selectedDay,
          guests,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setStep("details");
        return;
      }

      if (data.stripeConfigured && data.checkoutUrl) {
        setStep("redirecting");
        window.location.href = data.checkoutUrl;
        return;
      }

      setSuccessMessage(
        data.message ??
          "Your booking request was received. We'll be in touch to confirm."
      );
      setStep("success");
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStep("details");
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="border-b border-border bg-muted px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Reserve your date
        </p>
        <p className="mt-1 font-display text-xl text-primary">{trip.name}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatUSD(priceCents)} total · {formatUSD(depositCents)} deposit due today
        </p>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {step === "date" && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  aria-label="Previous month"
                  disabled={monthAnchor.getTime() <= minMonth.getTime()}
                  onClick={() => setMonthAnchor((m) => addMonths(m, -1))}
                  className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-foreground transition-colors duration-150 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <p className="font-display text-lg text-primary" aria-live="polite">
                  {monthLabel(monthAnchor)}
                </p>
                <button
                  type="button"
                  aria-label="Next month"
                  disabled={monthAnchor.getTime() >= maxMonth.getTime()}
                  onClick={() => setMonthAnchor((m) => addMonths(m, 1))}
                  className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-foreground transition-colors duration-150 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
                {WEEKDAY_LABELS.map((w, i) => (
                  <div key={`${w}-${i}`} className="py-1">
                    {w}
                  </div>
                ))}
              </div>

              <div
                className={`grid grid-cols-7 gap-1 transition-opacity duration-200 ${
                  loadingAvailability ? "opacity-50" : "opacity-100"
                }`}
              >
                {grid.map(({ date, dayKey, inCurrentMonth }) => {
                  const isPast = dayKey < today;
                  const isBooked = unavailable.has(dayKey);
                  const disabled = isPast || isBooked || !inCurrentMonth;
                  const isSelected = dayKey === selectedDay;

                  return (
                    <button
                      key={dayKey}
                      type="button"
                      disabled={disabled}
                      onClick={() => selectDay(dayKey, disabled)}
                      aria-label={formatDateLabel(dayKey)}
                      aria-pressed={isSelected}
                      className={`relative aspect-square min-h-[40px] cursor-pointer rounded-lg text-sm font-medium transition-all duration-150 ${
                        !inCurrentMonth
                          ? "invisible"
                          : disabled
                            ? "cursor-not-allowed text-muted-foreground/40 line-through"
                            : isSelected
                              ? "bg-accent text-white shadow-sm"
                              : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                Crossed-out dates are already booked or unavailable. One trip runs per day.
              </p>
            </motion.div>
          )}

          {(step === "details" || step === "submitting" || step === "redirecting") &&
            selectedDay && (
              <motion.form
                key="details"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <button
                  type="button"
                  onClick={() => {
                    setStep("date");
                    setError(null);
                  }}
                  className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-accent transition-colors duration-150 hover:text-accent-light"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  Change date
                </button>

                <div className="rounded-lg bg-muted px-4 py-3 text-sm font-medium text-primary">
                  {formatDateLabel(selectedDay)}
                </div>

                <div>
                  <label htmlFor="guests" className="block text-sm font-medium text-foreground">
                    Guests
                  </label>
                  <select
                    id="guests"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="mt-1.5 block min-h-[44px] w-full cursor-pointer rounded-lg border border-border bg-surface px-3 text-base focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40"
                  >
                    {Array.from({ length: trip.maxGuests }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} guest{n > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground">
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1.5 block min-h-[44px] w-full rounded-lg border border-border bg-surface px-3 text-base focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1.5 block min-h-[44px] w-full rounded-lg border border-border bg-surface px-3 text-base focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1.5 block min-h-[44px] w-full rounded-lg border border-border bg-surface px-3 text-base focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-foreground">
                    Notes <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Dietary needs, group experience level, celebrations, etc."
                    className="mt-1.5 block w-full rounded-lg border border-border bg-surface px-3 py-2 text-base focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40"
                  />
                </div>

                <div className="space-y-1 rounded-lg border border-border px-4 py-3 text-sm">
                  <div className="flex justify-between text-foreground">
                    <span>Trip total</span>
                    <span className="font-medium">{formatUSD(priceCents)}</span>
                  </div>
                  <div className="flex justify-between text-accent">
                    <span>Deposit due now ({business.depositPercent}%)</span>
                    <span className="font-semibold">{formatUSD(depositCents)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Balance due day-of</span>
                    <span>{formatUSD(balanceCents)}</span>
                  </div>
                </div>

                {error && (
                  <p role="alert" className="text-sm font-medium text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={step === "submitting" || step === "redirecting"}
                  className="inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-accent-light active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {step === "submitting" || step === "redirecting" ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                      {step === "redirecting" ? "Redirecting to payment…" : "Submitting…"}
                    </>
                  ) : (
                    `Continue to deposit — ${formatUSD(depositCents)}`
                  )}
                </button>
              </motion.form>
            )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-3 py-6 text-center"
            >
              <CheckCircle2 className="h-12 w-12 text-accent" aria-hidden="true" />
              <p className="font-display text-xl text-primary">Request received</p>
              <p className="text-sm text-muted-foreground">{successMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

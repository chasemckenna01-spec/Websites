import { prisma } from "@/lib/prisma";

// A date "occupies" the single boat/crew slot for the day once a booking on
// it reaches DEPOSIT_PAID or CONFIRMED. PENDING bookings (created right
// before Stripe checkout, before payment completes) do not block the date —
// they expire naturally if the guest abandons checkout.
const OCCUPYING_STATUSES = ["DEPOSIT_PAID", "CONFIRMED"] as const;

export function toDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function parseDayKey(dayKey: string): Date {
  const d = new Date(`${dayKey}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Invalid date: ${dayKey}`);
  }
  return d;
}

export async function getUnavailableDaysInRange(
  start: Date,
  end: Date
): Promise<Set<string>> {
  const [bookings, blocks] = await Promise.all([
    prisma.booking.findMany({
      where: {
        date: { gte: start, lte: end },
        status: { in: [...OCCUPYING_STATUSES] },
      },
      select: { date: true },
    }),
    prisma.blockedDate.findMany({
      where: { date: { gte: start, lte: end } },
      select: { date: true },
    }),
  ]);

  const unavailable = new Set<string>();
  for (const b of bookings) unavailable.add(toDayKey(b.date));
  for (const b of blocks) unavailable.add(toDayKey(b.date));
  return unavailable;
}

export async function isDayAvailable(day: Date): Promise<boolean> {
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);
  if (day.getTime() < startOfToday.getTime()) return false;

  const [existingBooking, block] = await Promise.all([
    prisma.booking.findFirst({
      where: { date: day, status: { in: [...OCCUPYING_STATUSES] } },
      select: { id: true },
    }),
    prisma.blockedDate.findUnique({ where: { date: day } }),
  ]);

  return !existingBooking && !block;
}

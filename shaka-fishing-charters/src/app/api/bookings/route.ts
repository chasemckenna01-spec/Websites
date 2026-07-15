import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { isDayAvailable, parseDayKey } from "@/lib/bookings";
import { bookingRequestSchema } from "@/lib/validation";
import { business } from "@/lib/site-data";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = bookingRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { tripSlug, date, guests, customerName, customerEmail, customerPhone, notes } =
    parsed.data;

  const tripType = await prisma.tripType.findUnique({ where: { slug: tripSlug } });
  if (!tripType) {
    return NextResponse.json({ error: "Unknown trip type" }, { status: 404 });
  }

  if (guests > tripType.maxGuests) {
    return NextResponse.json(
      { error: `This trip allows a maximum of ${tripType.maxGuests} guests` },
      { status: 400 }
    );
  }

  let day: Date;
  try {
    day = parseDayKey(date);
  } catch {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const available = await isDayAvailable(day);
  if (!available) {
    return NextResponse.json(
      { error: "That date is no longer available. Please choose another date." },
      { status: 409 }
    );
  }

  const depositCents = Math.round((tripType.priceCents * business.depositPercent) / 100);

  const booking = await prisma.booking.create({
    data: {
      tripTypeId: tripType.id,
      date: day,
      guests,
      customerName,
      customerEmail,
      customerPhone,
      notes: notes || null,
      totalCents: tripType.priceCents,
      depositCents,
      status: "PENDING",
    },
  });

  if (!isStripeConfigured()) {
    // No Stripe keys configured yet — booking is recorded as PENDING and the
    // crew can follow up manually. Notify the business so nothing is missed.
    await sendEmail({
      to: business.contact.email,
      subject: `New booking request (payment not yet configured): ${tripType.name}`,
      html: `<p>${customerName} requested <strong>${tripType.name}</strong> on ${date} for ${guests} guest(s).</p>
             <p>Email: ${customerEmail} · Phone: ${customerPhone}</p>
             <p>Notes: ${notes || "—"}</p>
             <p>Deposit due: $${(depositCents / 100).toFixed(2)} (Stripe not yet connected — follow up to collect payment).</p>`,
    });

    return NextResponse.json({
      bookingId: booking.id,
      stripeConfigured: false,
      message:
        "Your booking request was received. Online payment isn't active yet, so our crew will contact you to confirm and collect the deposit.",
    });
  }

  const stripe = getStripe()!;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: customerEmail,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: depositCents,
          product_data: {
            name: `${tripType.name} — Deposit (${business.depositPercent}%)`,
            description: `Trip date: ${date} · Guests: ${guests} · Balance due day-of: $${(
              (tripType.priceCents - depositCents) /
              100
            ).toFixed(2)}`,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${siteUrl}/booking/success?booking=${booking.id}`,
    cancel_url: `${siteUrl}/booking/cancelled?booking=${booking.id}`,
    metadata: {
      bookingId: booking.id,
    },
  });

  await prisma.booking.update({
    where: { id: booking.id },
    data: { stripeSessionId: session.id },
  });

  return NextResponse.json({
    bookingId: booking.id,
    stripeConfigured: true,
    checkoutUrl: session.url,
  });
}

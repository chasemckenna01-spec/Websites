import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { sendEmail } from "@/lib/email";
import { business } from "@/lib/site-data";

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    if (!signature) throw new Error("Missing stripe-signature header");
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;

    if (bookingId) {
      const booking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: "DEPOSIT_PAID",
          stripePaymentIntentId:
            typeof session.payment_intent === "string" ? session.payment_intent : null,
        },
        include: { tripType: true },
      });

      const dateLabel = booking.date.toISOString().slice(0, 10);
      const balanceCents = booking.totalCents - booking.depositCents;

      await Promise.all([
        sendEmail({
          to: booking.customerEmail,
          subject: `Booking confirmed — ${booking.tripType.name} on ${dateLabel}`,
          html: `<p>Aloha ${booking.customerName},</p>
                 <p>Your deposit for the <strong>${booking.tripType.name}</strong> on <strong>${dateLabel}</strong> is confirmed.</p>
                 <p>Guests: ${booking.guests}<br/>
                 Deposit paid: $${(booking.depositCents / 100).toFixed(2)}<br/>
                 Balance due day-of: $${(balanceCents / 100).toFixed(2)}</p>
                 <p>We depart from ${business.location.marina}, ${business.location.island}. We'll be in touch with departure details.</p>
                 <p>— ${business.captain.name} & ${business.guide.name}</p>`,
        }),
        sendEmail({
          to: business.contact.email,
          subject: `Deposit received: ${booking.tripType.name} on ${dateLabel}`,
          html: `<p>${booking.customerName} paid the deposit for ${booking.tripType.name} on ${dateLabel}.</p>
                 <p>Guests: ${booking.guests} · Email: ${booking.customerEmail} · Phone: ${booking.customerPhone}</p>
                 <p>Notes: ${booking.notes || "—"}</p>`,
        }),
      ]);
    }
  }

  return NextResponse.json({ received: true });
}

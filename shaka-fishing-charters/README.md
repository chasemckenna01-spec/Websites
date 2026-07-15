# Shaka Fishing Charters & Tours

Marketing site + booking system for a Maui sportfishing charter. Next.js 16
(App Router, Turbopack) + Tailwind CSS 4 + Framer Motion, with a Prisma/SQLite
booking database and Stripe Checkout for deposits.

## Stack

- **Next.js 16** (App Router, Turbopack, React 19)
- **Tailwind CSS 4** — design tokens in `src/app/globals.css`
- **Framer Motion** — scroll reveals, page/menu transitions, all `prefers-reduced-motion`-aware
- **Prisma 7 + SQLite** (`@prisma/adapter-better-sqlite3`) — trip types, bookings, blocked dates
- **Stripe Checkout** — deposit collection
- **Resend** — transactional email (booking + contact notifications)
- **Zod** — request validation

## Getting started

```bash
npm install
npm run db:seed   # seeds the three trip types into dev.db
npm run dev
```

Open http://localhost:3000.

`npm install` runs `prisma generate` automatically via `postinstall`. The
SQLite file (`dev.db`) and generated Prisma client (`src/generated/prisma`)
are gitignored — both are recreated locally.

## Environment variables

Copy `.env.example` to `.env` and fill in real values before launch:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | SQLite connection string (`file:./dev.db` by default) |
| `STRIPE_SECRET_KEY` | Stripe secret key. **Without this, the booking flow still works** — it records the booking as `PENDING` and emails the business to follow up manually instead of charging a deposit online. |
| `STRIPE_WEBHOOK_SECRET` | Required for the `/api/webhooks/stripe` route to mark bookings `DEPOSIT_PAID` after checkout completes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Reserved for future client-side Stripe usage (not currently required by the server-redirect Checkout flow) |
| `RESEND_API_KEY` | Without this, emails are skipped and logged to the console instead — nothing crashes |
| `BUSINESS_NOTIFICATION_EMAIL` | Where booking/contact notifications are sent |
| `NEXT_PUBLIC_SITE_URL` | Used to build Stripe success/cancel redirect URLs |

## Content still marked PLACEHOLDER

Search the codebase for `PLACEHOLDER` before launch — everything below is
invented content standing in for the real thing:

- **`src/lib/site-data.ts`** — departure marina address, phone number, email,
  Instagram handle, deposit percentage, and all three guest testimonials
- **`src/app/about/page.tsx`** and **`src/app/page.tsx`** — Captain Chase's
  and Guide Casimiri's bios, and the "how we started" story
- **`src/lib/gallery-data.ts`** — the gallery currently uses animated gradient
  tiles as stand-ins for real photography. Once you have photos, add them to
  `/public/gallery` and swap `gallery-grid.tsx` to render `next/image` instead
  of the `gradient` style
- **`src/components/decor/ocean-scene.tsx`** — the hero background is an
  animated CSS/SVG ocean scene (waves + sun glow), used in place of real drone
  or on-water video/photography. Swap for a full-bleed video or photo hero
  once footage is available.

## Booking system design notes

- The schema assumes **one boat / one trip per day**: a `Booking` only blocks
  its date once it reaches `DEPOSIT_PAID` or `CONFIRMED` — `PENDING` bookings
  (created right before Stripe redirect) don't hold the date, so abandoned
  checkouts don't lock out other guests.
- `business.depositPercent` (in `site-data.ts`, currently 25%) drives both the
  UI copy and the actual Stripe line item — change it in one place.
- If Stripe isn't configured yet, `/api/bookings` still records the booking
  and emails the business instead of failing, so the site is usable before
  payment processing is wired up.

## Deployment

This currently runs on local SQLite, which won't survive most serverless
deployments (e.g. Vercel's filesystem is ephemeral/read-only in production).
Before deploying:

1. Point `DATABASE_URL` at a hosted database (Postgres is the easiest swap —
   see [Prisma's Postgres adapter](https://www.prisma.io/docs/orm/overview/databases/postgresql))
   and update `prisma/schema.prisma`'s `provider` accordingly.
2. Run `npx prisma migrate deploy` against the hosted database.
3. Set all environment variables from `.env.example` in your hosting
   provider's dashboard, using **live** Stripe keys.
4. Register the Stripe webhook endpoint (`/api/webhooks/stripe`) for the
   `checkout.session.completed` event and set `STRIPE_WEBHOOK_SECRET`
   accordingly.

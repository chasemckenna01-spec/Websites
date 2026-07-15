import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { tripTypes } from "../src/lib/site-data";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  for (const trip of tripTypes) {
    await prisma.tripType.upsert({
      where: { slug: trip.slug },
      update: {
        name: trip.name,
        durationHours: trip.durationHours,
        priceCents: trip.price * 100,
        maxGuests: trip.maxGuests,
      },
      create: {
        slug: trip.slug,
        name: trip.name,
        durationHours: trip.durationHours,
        priceCents: trip.price * 100,
        maxGuests: trip.maxGuests,
      },
    });
  }
  console.log(`Seeded ${tripTypes.length} trip types.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

-- CreateTable
CREATE TABLE "TripType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "durationHours" INTEGER NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "maxGuests" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tripTypeId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "guests" INTEGER NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "totalCents" INTEGER NOT NULL,
    "depositCents" INTEGER NOT NULL,
    "stripeSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Booking_tripTypeId_fkey" FOREIGN KEY ("tripTypeId") REFERENCES "TripType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BlockedDate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "reason" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "TripType_slug_key" ON "TripType"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_stripeSessionId_key" ON "Booking"("stripeSessionId");

-- CreateIndex
CREATE INDEX "Booking_date_idx" ON "Booking"("date");

-- CreateIndex
CREATE UNIQUE INDEX "BlockedDate_date_key" ON "BlockedDate"("date");

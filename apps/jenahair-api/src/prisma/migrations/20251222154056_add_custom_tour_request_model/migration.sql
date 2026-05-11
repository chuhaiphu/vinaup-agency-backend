-- CreateTable
CREATE TABLE "CustomTourRequest" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "adultCount" INTEGER NOT NULL DEFAULT 0,
    "childCount" INTEGER NOT NULL DEFAULT 0,
    "destinations" TEXT[],
    "types" TEXT[],
    "hotelType" TEXT,
    "roomType" TEXT,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerNotes" TEXT,

    CONSTRAINT "CustomTourRequest_pkey" PRIMARY KEY ("id")
);

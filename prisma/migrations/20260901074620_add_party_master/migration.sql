-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "partyId" TEXT;

-- CreateTable
CREATE TABLE "Party" (
    "id" TEXT NOT NULL,
    "partyCode" TEXT NOT NULL,
    "partyName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "phone" TEXT,
    "gstNumber" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Party_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Party_partyCode_key" ON "Party"("partyCode");

-- CreateIndex
CREATE INDEX "Party_partyName_idx" ON "Party"("partyName");

-- CreateIndex
CREATE INDEX "Party_location_idx" ON "Party"("location");

-- CreateIndex
CREATE INDEX "Bill_partyId_idx" ON "Bill"("partyId");

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE SET NULL ON UPDATE CASCADE;

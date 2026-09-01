import { PrismaClient, PaymentMode, PaymentStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.bill.createMany({
    data: [
      {
        partyName: "Apex Pharma Distributors",
        billNumber: "AP-1027",
        billDate: new Date(),
        billAmount: "12840.50",
        paymentStatus: PaymentStatus.UNPAID,
        paymentMode: PaymentMode.CREDIT,
        notes: "Monthly stock purchase"
      },
      {
        partyName: "Carewell Surgical Supply",
        billNumber: "CW-8871",
        billDate: new Date(Date.now() - 86400000),
        billAmount: "5420.00",
        paymentStatus: PaymentStatus.PAID,
        paymentMode: PaymentMode.UPI
      },
      {
        partyName: "Medico Wholesale Agency",
        billNumber: "MW-2414",
        billDate: new Date(Date.now() - 2 * 86400000),
        billAmount: "9340.75",
        paymentStatus: PaymentStatus.PARTIAL,
        paymentMode: PaymentMode.BANK_TRANSFER,
        notes: "Balance due next week"
      }
    ]
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

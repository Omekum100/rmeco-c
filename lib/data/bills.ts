import { Prisma } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import { prisma } from "@/lib/prisma";
import type { BillFilterValues, BillFormValues } from "@/lib/validations/bill";

function buildBillWhere(filters?: BillFilterValues): Prisma.BillWhereInput {
  const query = filters?.q?.trim();
  const partyId = filters?.partyId?.trim();
  const location = filters?.location?.trim();
  const paymentStatus = filters?.paymentStatus || undefined;
  const from = filters?.from ? startOfDay(new Date(filters.from)) : undefined;
  const to = filters?.to ? endOfDay(new Date(filters.to)) : undefined;

  return {
    ...(query
      ? {
          OR: [
            { partyName: { contains: query, mode: "insensitive" } },
            { billNumber: { contains: query, mode: "insensitive" } },
            { party: { partyCode: { contains: query, mode: "insensitive" } } }
          ]
        }
      : {}),
    ...(partyId ? { partyId } : {}),
    ...(location ? { party: { location } } : {}),
    ...(paymentStatus ? { paymentStatus } : {}),
    ...(from || to
      ? {
          billDate: {
            ...(from ? { gte: from } : {}),
            ...(to ? { lte: to } : {})
          }
        }
      : {})
  };
}

export async function getBills(filters?: BillFilterValues) {
  return prisma.bill.findMany({
    where: buildBillWhere(filters),
    include: { party: true },
    orderBy: [{ billDate: "desc" }, { createdAt: "desc" }]
  });
}

export async function getRecentBills(limit = 6) {
  return prisma.bill.findMany({
    include: { party: true },
    orderBy: [{ billDate: "desc" }, { createdAt: "desc" }],
    take: limit
  });
}

export async function getBillById(id: string) {
  return prisma.bill.findUnique({
    where: { id },
    include: { party: true }
  });
}

export async function createBill(data: BillFormValues & { billImageUrl?: string | null }) {
  return prisma.bill.create({
    data: {
      partyId: data.partyId || null,
      partyName: data.partyName,
      billNumber: data.billNumber,
      billDate: new Date(data.billDate),
      billAmount: new Prisma.Decimal(data.billAmount),
      billImageUrl: data.billImageUrl,
      paymentStatus: data.paymentStatus,
      paymentMode: data.paymentMode,
      notes: data.notes || null
    }
  });
}

export async function updateBill(
  id: string,
  data: BillFormValues & { billImageUrl?: string | null }
) {
  return prisma.bill.update({
    where: { id },
    data: {
      partyId: data.partyId || null,
      partyName: data.partyName,
      billNumber: data.billNumber,
      billDate: new Date(data.billDate),
      billAmount: new Prisma.Decimal(data.billAmount),
      ...(data.billImageUrl !== undefined ? { billImageUrl: data.billImageUrl } : {}),
      paymentStatus: data.paymentStatus,
      paymentMode: data.paymentMode,
      notes: data.notes || null
    }
  });
}

export async function deleteBill(id: string) {
  return prisma.bill.delete({
    where: { id }
  });
}

export async function getBillSummary() {
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const [totalBills, totalAmount, todayBills, todayAmount, totalParties, linkedBills] = await Promise.all([
    prisma.bill.count(),
    prisma.bill.aggregate({ _sum: { billAmount: true } }),
    prisma.bill.count({
      where: {
        billDate: {
          gte: todayStart,
          lte: todayEnd
        }
      }
    }),
    prisma.bill.aggregate({
      where: {
        billDate: {
          gte: todayStart,
          lte: todayEnd
        }
      },
      _sum: { billAmount: true }
    }),
    prisma.party.count(),
    prisma.bill.count({ where: { partyId: { not: null } } })
  ]);

  return {
    totalBills,
    totalAmount: Number(totalAmount._sum.billAmount ?? 0),
    todayBills,
    todayAmount: Number(todayAmount._sum.billAmount ?? 0),
    totalParties,
    linkedBills
  };
}

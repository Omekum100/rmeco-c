import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { buildPartyCode } from "@/lib/partyCode";
import type { PartyFilterValues, PartyFormValues } from "@/lib/validations/party";

function cleanOptional(value?: string) {
  return value?.trim() || null;
}

function normalizeCode(value: string) {
  return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

function buildPartyWhere(filters?: PartyFilterValues): Prisma.PartyWhereInput {
  const query = filters?.q?.trim();

  return query
    ? {
        OR: [
          { partyName: { contains: query, mode: "insensitive" } },
          { partyCode: { contains: query, mode: "insensitive" } },
          { location: { contains: query, mode: "insensitive" } }
        ]
      }
    : {};
}

async function getAvailablePartyCode(baseCode: string, currentPartyId?: string) {
  const normalized = normalizeCode(baseCode);
  let candidate = normalized;
  let suffix = 2;

  while (true) {
    const existing = await prisma.party.findUnique({
      where: { partyCode: candidate },
      select: { id: true }
    });

    if (!existing || existing.id === currentPartyId) {
      return candidate;
    }

    candidate = `${normalized}${suffix}`;
    suffix += 1;
  }
}

export async function getParties(filters?: PartyFilterValues) {
  return prisma.party.findMany({
    where: buildPartyWhere(filters),
    orderBy: [{ partyName: "asc" }]
  });
}

export async function getPartyOptions() {
  return prisma.party.findMany({
    orderBy: [{ partyName: "asc" }],
    select: {
      id: true,
      partyName: true,
      partyCode: true,
      location: true
    }
  });
}

export async function getPartyById(id: string) {
  return prisma.party.findUnique({
    where: { id },
    include: {
      bills: {
        include: { party: true },
        orderBy: [{ billDate: "desc" }, { createdAt: "desc" }]
      }
    }
  });
}

export async function createParty(data: PartyFormValues) {
  const baseCode = data.partyCode || buildPartyCode(data.location, data.partyName);
  const partyCode = await getAvailablePartyCode(baseCode);

  return prisma.party.create({
    data: {
      partyCode,
      partyName: data.partyName.trim(),
      location: data.location.trim(),
      phone: cleanOptional(data.phone),
      gstNumber: cleanOptional(data.gstNumber),
      address: cleanOptional(data.address),
      notes: cleanOptional(data.notes)
    }
  });
}

export async function updateParty(id: string, data: PartyFormValues) {
  const baseCode = data.partyCode || buildPartyCode(data.location, data.partyName);
  const partyCode = await getAvailablePartyCode(baseCode, id);

  return prisma.party.update({
    where: { id },
    data: {
      partyCode,
      partyName: data.partyName.trim(),
      location: data.location.trim(),
      phone: cleanOptional(data.phone),
      gstNumber: cleanOptional(data.gstNumber),
      address: cleanOptional(data.address),
      notes: cleanOptional(data.notes)
    }
  });
}

export async function deleteParty(id: string) {
  return prisma.party.delete({
    where: { id }
  });
}

import { z } from "zod";

export const partySchema = z.object({
  partyName: z.string().trim().min(2, "Party name is required"),
  location: z.string().trim().min(2, "Location is required"),
  partyCode: z.string().trim().optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  gstNumber: z.string().trim().optional().or(z.literal("")),
  address: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().optional().or(z.literal(""))
});

export type PartyFormValues = z.infer<typeof partySchema>;

export const partyFilterSchema = z.object({
  q: z.string().optional()
});

export type PartyFilterValues = z.infer<typeof partyFilterSchema>;

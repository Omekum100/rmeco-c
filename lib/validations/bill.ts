import { PaymentMode, PaymentStatus } from "@prisma/client";
import { z } from "zod";

export const paymentStatusOptions = [
  PaymentStatus.UNPAID,
  PaymentStatus.PARTIAL,
  PaymentStatus.PAID
] as const;

export const paymentModeOptions = [
  PaymentMode.CREDIT,
  PaymentMode.CASH,
  PaymentMode.UPI,
  PaymentMode.BANK_TRANSFER,
  PaymentMode.CHEQUE,
  PaymentMode.OTHER
] as const;

export const billSchema = z.object({
  partyId: z.string().trim().optional().or(z.literal("")),
  partyName: z.string().trim().min(2, "Party name is required"),
  billNumber: z.string().trim().min(1, "Bill number is required"),
  billDate: z.string().min(1, "Bill date is required"),
  billAmount: z.coerce
    .number({ invalid_type_error: "Enter a valid amount" })
    .positive("Amount must be greater than zero"),
  paymentStatus: z.nativeEnum(PaymentStatus),
  paymentMode: z.nativeEnum(PaymentMode),
  notes: z.string().trim().optional().or(z.literal(""))
});

export type BillFormValues = z.infer<typeof billSchema>;

export const billFilterSchema = z.object({
  q: z.string().optional(),
  partyId: z.string().optional(),
  location: z.string().optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional().or(z.literal("")),
  from: z.string().optional(),
  to: z.string().optional()
});

export type BillFilterValues = z.infer<typeof billFilterSchema>;

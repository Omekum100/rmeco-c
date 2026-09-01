import { notFound } from "next/navigation";
import { BillForm } from "@/components/bills/BillForm";
import { DatabaseSetupNotice } from "@/components/ui/DatabaseSetupNotice";
import { updateBillAction } from "@/lib/actions/bills";
import { getBillById } from "@/lib/data/bills";
import { getPartyOptions } from "@/lib/data/parties";
import { isDatabaseSetupError } from "@/lib/data/errors";
import { toDateInputValue } from "@/lib/formatters";

export const dynamic = "force-dynamic";

type EditBillPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBillPage({ params }: EditBillPageProps) {
  const { id } = await params;
  let bill;
  let parties;

  try {
    [bill, parties] = await Promise.all([getBillById(id), getPartyOptions()]);
  } catch (error) {
    if (isDatabaseSetupError(error)) {
      return <DatabaseSetupNotice />;
    }

    throw error;
  }

  if (!bill) {
    notFound();
  }

  return (
    <BillForm
      title="Edit bill"
      submitLabel="Save changes"
      action={updateBillAction.bind(null, bill.id)}
      initialValues={{
        partyName: bill.partyName,
        partyId: bill.partyId ?? "",
        billNumber: bill.billNumber,
        billDate: toDateInputValue(bill.billDate),
        billAmount: Number(bill.billAmount),
        paymentStatus: bill.paymentStatus,
        paymentMode: bill.paymentMode,
        notes: bill.notes ?? "",
        billImageUrl: bill.billImageUrl
      }}
      parties={parties}
    />
  );
}

import { BillForm } from "@/components/bills/BillForm";
import { DatabaseSetupNotice } from "@/components/ui/DatabaseSetupNotice";
import { createBillAction } from "@/lib/actions/bills";
import { getPartyOptions } from "@/lib/data/parties";
import { isDatabaseSetupError } from "@/lib/data/errors";

export const dynamic = "force-dynamic";

export default async function NewBillPage() {
  let parties;

  try {
    parties = await getPartyOptions();
  } catch (error) {
    if (isDatabaseSetupError(error)) {
      return <DatabaseSetupNotice />;
    }

    throw error;
  }

  return (
    <div className="space-y-5">
      <BillForm
        title="Add bill"
        submitLabel="Create bill"
        action={createBillAction}
        parties={parties}
      />
    </div>
  );
}

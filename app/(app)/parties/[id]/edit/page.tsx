import { notFound } from "next/navigation";
import { PartyForm } from "@/components/parties/PartyForm";
import { DatabaseSetupNotice } from "@/components/ui/DatabaseSetupNotice";
import { updatePartyAction } from "@/lib/actions/parties";
import { getPartyById } from "@/lib/data/parties";
import { isDatabaseSetupError } from "@/lib/data/errors";

export const dynamic = "force-dynamic";

type EditPartyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPartyPage({ params }: EditPartyPageProps) {
  const { id } = await params;
  let party;

  try {
    party = await getPartyById(id);
  } catch (error) {
    if (isDatabaseSetupError(error)) {
      return <DatabaseSetupNotice />;
    }

    throw error;
  }

  if (!party) {
    notFound();
  }

  return (
    <PartyForm
      title="Edit party"
      submitLabel="Save changes"
      action={updatePartyAction.bind(null, party.id)}
      initialValues={{
        partyName: party.partyName,
        location: party.location,
        partyCode: party.partyCode,
        phone: party.phone ?? "",
        gstNumber: party.gstNumber ?? "",
        address: party.address ?? "",
        notes: party.notes ?? ""
      }}
    />
  );
}

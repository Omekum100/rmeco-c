import { PartyForm } from "@/components/parties/PartyForm";
import { createPartyAction } from "@/lib/actions/parties";

export const dynamic = "force-dynamic";

export default function NewPartyPage() {
  return <PartyForm title="Add party" submitLabel="Create party" action={createPartyAction} />;
}

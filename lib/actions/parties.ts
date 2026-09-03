"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { withToast } from "@/lib/toastUrl";
import { partySchema } from "@/lib/validations/party";

export type PartyActionState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

function formDataToPartyValues(formData: FormData) {
  return {
    partyName: String(formData.get("partyName") ?? ""),
    location: String(formData.get("location") ?? ""),
    partyCode: String(formData.get("partyCode") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    gstNumber: String(formData.get("gstNumber") ?? ""),
    address: String(formData.get("address") ?? ""),
    notes: String(formData.get("notes") ?? "")
  };
}

function revalidatePartyPaths(id?: string) {
  revalidatePath("/parties");
  revalidatePath("/bills");
  revalidatePath("/bills/new");
  if (id) {
    revalidatePath(`/parties/${id}`);
    revalidatePath(`/parties/${id}/edit`);
  }
}

export async function createPartyAction(
  _previousState: PartyActionState,
  formData: FormData
): Promise<PartyActionState> {
  const parsed = partySchema.safeParse(formDataToPartyValues(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors
    };
  }

  try {
    const { createParty } = await import("@/lib/data/parties");
    const party = await createParty(parsed.data);
    revalidatePartyPaths(party.id);
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unable to create party."
    };
  }

  redirect(withToast("/parties", "Party created successfully."));
}

export async function updatePartyAction(
  id: string,
  _previousState: PartyActionState,
  formData: FormData
): Promise<PartyActionState> {
  const parsed = partySchema.safeParse(formDataToPartyValues(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors
    };
  }

  try {
    const { updateParty } = await import("@/lib/data/parties");
    await updateParty(id, parsed.data);
    revalidatePartyPaths(id);
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unable to update party."
    };
  }

  redirect(withToast(`/parties/${id}`, "Party updated successfully."));
}

export async function deletePartyAction(id: string) {
  try {
    const { deleteParty } = await import("@/lib/data/parties");
    await deleteParty(id);
    revalidatePartyPaths(id);
  } catch (error) {
    redirect(
      withToast(
        "/parties",
        error instanceof Error ? error.message : "Unable to delete party.",
        "error"
      )
    );
  }

  redirect(withToast("/parties", "Party deleted successfully."));
}

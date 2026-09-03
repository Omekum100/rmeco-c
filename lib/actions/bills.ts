"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { withToast } from "@/lib/toastUrl";
import { billSchema } from "@/lib/validations/bill";

export type BillActionState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);

async function saveBillImage(file: File | null) {
  if (!file || file.size === 0) {
    return undefined;
  }

  if (!allowedImageTypes.has(file.type)) {
    throw new Error("Only JPG, PNG, WebP, HEIC, and HEIF images are supported.");
  }

  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Bill image must be 8 MB or smaller.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  return `data:${file.type};base64,${bytes.toString("base64")}`;
}

function getSubmittedBillImage(formData: FormData) {
  const cameraImage = formData.get("cameraBillImage");
  const galleryImage = formData.get("galleryBillImage");

  if (cameraImage instanceof File && cameraImage.size > 0) {
    return cameraImage;
  }

  if (galleryImage instanceof File && galleryImage.size > 0) {
    return galleryImage;
  }

  return null;
}

function formDataToBillValues(formData: FormData) {
  return {
    partyId: String(formData.get("partyId") ?? ""),
    partyName: String(formData.get("partyName") ?? ""),
    billNumber: String(formData.get("billNumber") ?? ""),
    billDate: String(formData.get("billDate") ?? ""),
    billAmount: String(formData.get("billAmount") ?? ""),
    paymentStatus: String(formData.get("paymentStatus") ?? ""),
    paymentMode: String(formData.get("paymentMode") ?? ""),
    notes: String(formData.get("notes") ?? "")
  };
}

function revalidateBillPaths(id?: string) {
  revalidatePath("/");
  revalidatePath("/bills");
  if (id) {
    revalidatePath(`/bills/${id}`);
    revalidatePath(`/bills/${id}/edit`);
  }
}

export async function createBillAction(
  _previousState: BillActionState,
  formData: FormData
): Promise<BillActionState> {
  const parsed = billSchema.safeParse(formDataToBillValues(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors
    };
  }

  try {
    const { createBill } = await import("@/lib/data/bills");
    const { getPartyById } = await import("@/lib/data/parties");
    const party = parsed.data.partyId ? await getPartyById(parsed.data.partyId) : null;
    const billImageUrl = await saveBillImage(getSubmittedBillImage(formData));
    const bill = await createBill({
      ...parsed.data,
      partyName: party?.partyName ?? parsed.data.partyName,
      billImageUrl
    });
    revalidateBillPaths(bill.id);
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unable to create bill."
    };
  }

  redirect(withToast("/bills", "Bill created successfully."));
}

export async function updateBillAction(
  id: string,
  _previousState: BillActionState,
  formData: FormData
): Promise<BillActionState> {
  const parsed = billSchema.safeParse(formDataToBillValues(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors
    };
  }

  try {
    const { getBillById, updateBill } = await import("@/lib/data/bills");
    const { getPartyById } = await import("@/lib/data/parties");
    const existingBill = await getBillById(id);

    if (!existingBill) {
      return { ok: false, message: "Bill was not found." };
    }

    const party = parsed.data.partyId ? await getPartyById(parsed.data.partyId) : null;
    const uploadedImageUrl = await saveBillImage(getSubmittedBillImage(formData));
    await updateBill(id, {
      ...parsed.data,
      partyName: party?.partyName ?? parsed.data.partyName,
      billImageUrl: uploadedImageUrl ?? existingBill.billImageUrl
    });
    revalidateBillPaths(id);
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unable to update bill."
    };
  }

  redirect(withToast(`/bills/${id}`, "Bill updated successfully."));
}

export async function deleteBillAction(id: string) {
  try {
    const { deleteBill } = await import("@/lib/data/bills");
    await deleteBill(id);
    revalidateBillPaths(id);
  } catch (error) {
    redirect(
      withToast(
        "/bills",
        error instanceof Error ? error.message : "Unable to delete bill.",
        "error"
      )
    );
  }

  redirect(withToast("/bills", "Bill deleted successfully."));
}

"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { encryptEin } from "@/lib/encryption";
import { revalidatePath } from "next/cache";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "admin@mygrationstation.com,demo@mygrationstation.com")
  .split(",")
  .map((e) => e.trim());

async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    throw new Error("Unauthorized: admin access required");
  }

  return { supabase, user };
}

/**
 * Mark a formation application as "filed_with_state".
 * Called after the admin has submitted paperwork to the state.
 */
export async function markFiledWithState(formationId: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("formation_applications")
    .update({
      status: "filed_with_state",
      filed_at: new Date().toISOString(),
    })
    .eq("id", formationId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin");
  return { success: true };
}

/**
 * Mark a formation application as complete.
 * Updates both the application status and the business formation_status.
 */
export async function markFormationComplete(
  formationId: string,
  businessId: string
) {
  const { supabase } = await requireAdmin();

  const { error: appError } = await supabase
    .from("formation_applications")
    .update({ status: "complete" })
    .eq("id", formationId);

  if (appError) {
    return { success: false, error: appError.message };
  }

  const { error: bizError } = await supabase
    .from("businesses")
    .update({ formation_status: "complete" })
    .eq("id", businessId);

  if (bizError) {
    return { success: false, error: bizError.message };
  }

  revalidatePath("/admin");
  return { success: true };
}

/**
 * Add an admin note to a formation or EIN application.
 */
export async function addAdminNote(
  table: "formation_applications" | "ein_applications",
  id: string,
  note: string
) {
  const { supabase } = await requireAdmin();

  // Fetch existing notes so we append rather than overwrite
  const { data: existing } = await supabase
    .from(table)
    .select("notes")
    .eq("id", id)
    .single();

  const timestamp = new Date().toISOString().slice(0, 16).replace("T", " ");
  const newNote = existing?.notes
    ? `${existing.notes}\n[${timestamp}] ${note}`
    : `[${timestamp}] ${note}`;

  const { error } = await supabase
    .from(table)
    .update({ notes: newNote })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin");
  return { success: true };
}

/**
 * Enter an EIN for a business after receiving it from the IRS.
 * The EIN is validated and encrypted before storage.
 */
export async function enterEIN(einApplicationId: string, ein: string) {
  const { supabase } = await requireAdmin();

  // Validate EIN format (XX-XXXXXXX or 9 digits)
  const cleaned = ein.replace(/\D/g, "");
  if (cleaned.length !== 9) {
    return { success: false, error: "EIN must be exactly 9 digits" };
  }

  // Encrypt before storing
  const encryptedEin = encryptEin(cleaned);

  // Update EIN application
  const { error: einError } = await supabase
    .from("ein_applications")
    .update({
      ein_encrypted: encryptedEin,
      status: "received",
      ein_received_at: new Date().toISOString(),
    })
    .eq("id", einApplicationId);

  if (einError) {
    return { success: false, error: einError.message };
  }

  // Also get the business_id so we can store the encrypted EIN on the business
  const { data: app } = await supabase
    .from("ein_applications")
    .select("business_id")
    .eq("id", einApplicationId)
    .single();

  if (app?.business_id) {
    await supabase
      .from("businesses")
      .update({ ein: encryptedEin })
      .eq("id", app.business_id);
  }

  revalidatePath("/admin");
  return { success: true };
}

"use server";

import { getAuthenticatedUser } from "@/lib/supabase/server";
import { generateSS4Form } from "@/lib/pdf/ss4-generator";

interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Get the user's EIN application status for a given business.
 */
export async function getEinApplicationStatus(businessId: string) {
  const { supabase } = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("ein_applications")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return data;
}

/**
 * Create an EIN application for a business.
 */
export async function createEinApplication(
  businessId: string
): Promise<ActionResult & { applicationId?: string }> {
  try {
    const { supabase } = await getAuthenticatedUser();

    // Get user's residency status to determine EIN path
    const { data: business } = await supabase
      .from("businesses")
      .select("user_id, name, state, formation_draft")
      .eq("id", businessId)
      .single();

    if (!business) return { success: false, error: "Business not found" };

    const { data: user } = await supabase
      .from("users")
      .select("residency_status")
      .eq("id", business.user_id)
      .single();

    if (!user) return { success: false, error: "User not found" };

    const einPath =
      user.residency_status === "ssn_holder"
        ? "online_self"
        : user.residency_status === "itin_holder"
          ? "phone_assisted"
          : "fax_assisted";

    const { data: app, error: insertError } = await supabase
      .from("ein_applications")
      .insert({
        business_id: businessId,
        path: einPath,
        status: "pending_info",
      })
      .select("id")
      .single();

    if (insertError || !app) {
      return { success: false, error: insertError?.message ?? "Insert failed" };
    }

    return { success: true, applicationId: app.id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown" };
  }
}

/**
 * Generate SS-4 PDF and store in vault.
 */
export async function generateAndStoreSS4(
  businessId: string,
  einApplicationId: string
): Promise<ActionResult & { pdfPath?: string }> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    const { data: business } = await supabase
      .from("businesses")
      .select("name, state, formation_draft")
      .eq("id", businessId)
      .single();

    if (!business) return { success: false, error: "Business not found" };

    const draft = business.formation_draft as Record<string, unknown> | null;
    const members = (draft?.members as Array<Record<string, unknown>>) ?? [];
    const primaryMember = members[0];

    const ss4 = await generateSS4Form({
      businessName: business.name,
      stateCode: business.state,
      members: members as never[],
      einPath: ((draft?.einPath as string) ?? "fax_assisted") as "online_self" | "phone_assisted" | "fax_assisted",
      responsiblePartyName: (primaryMember?.fullName as string) ?? "",
      businessAddress: {
        line1: (primaryMember?.addressLine1 as string) ?? "",
        line2: (primaryMember?.addressLine2 as string) ?? undefined,
        city: (primaryMember?.city as string) ?? "",
        state: (primaryMember?.stateProvince as string) ?? business.state,
        zip: (primaryMember?.zipPostal as string) ?? "",
      },
    });

    // Upload to vault
    const storagePath = `${user.id}/${businessId}/${ss4.fileName}`;
    await supabase.storage
      .from("documents")
      .upload(storagePath, ss4.pdfBytes, {
        contentType: "application/pdf",
        upsert: true,
      });

    // Create document record
    await supabase.from("documents").insert({
      user_id: user.id,
      business_id: businessId,
      document_type: "third_party_auth",
      display_name: `Form SS-4 — ${business.name} LLC`,
      source: "system_generated",
      storage_path: storagePath,
      file_size_bytes: ss4.pdfBytes.length,
      mime_type: "application/pdf",
    });

    // Update EIN application
    await supabase
      .from("ein_applications")
      .update({
        ss4_pdf_path: storagePath,
        status: "info_complete",
      })
      .eq("id", einApplicationId);

    return { success: true, pdfPath: storagePath };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Generation failed" };
  }
}

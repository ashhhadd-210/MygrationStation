/**
 * Post-payment orchestration pipeline.
 *
 * After Stripe Checkout completes, this module:
 * 1. Generates Articles of Organization PDF
 * 2. Generates Operating Agreement PDF
 * 3. Stores both in Supabase Storage (private vault)
 * 4. Creates document records in the documents table
 * 5. Sends confirmation email via Resend in user's language
 * 6. Creates formation_application record
 * 7. Auto-generates compliance_events based on profile
 *
 * Called from the Stripe webhook handler or the completeFormation server action.
 */

import { createAdminClient } from "@/lib/supabase/admin";
import { generateArticlesOfOrganization } from "@/lib/pdf/articles-generator";
import { generateOperatingAgreement } from "@/lib/pdf/operating-agreement-generator";
import { sendFormationSubmittedEmail } from "@/lib/email";
import { getStateConfig } from "@/lib/constants/states";
import type { FormationDraft } from "@/lib/supabase/database.types";
import type { Locale } from "@/i18n/config";

interface PostPaymentInput {
  businessId: string;
  userId: string;
  stripeSessionId: string;
}

interface PostPaymentResult {
  success: boolean;
  error?: string;
  articlesPdfPath?: string;
  operatingAgreementPath?: string;
}

export async function executePostPaymentPipeline(
  input: PostPaymentInput
): Promise<PostPaymentResult> {
  const supabase = createAdminClient();

  try {
    // ── 1. Fetch business + user data ─────────────────────────

    const { data: business, error: bizError } = await supabase
      .from("businesses")
      .select("*, formation_draft")
      .eq("id", input.businessId)
      .single();

    if (bizError || !business) {
      return { success: false, error: `Business not found: ${bizError?.message}` };
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("email, lang_pref, residency_status")
      .eq("id", input.userId)
      .single();

    if (userError || !user) {
      return { success: false, error: `User not found: ${userError?.message}` };
    }

    const draft = business.formation_draft as FormationDraft;
    const stateConfig = getStateConfig(business.state);
    const members = draft.members ?? [];
    const primaryMember = members[0];
    const locale = (user.lang_pref ?? "en") as Locale;

    // Determine registered agent info
    let raName = "MygrationStation Registered Agent";
    let raAddress = `${stateConfig.stateName}`;

    if (draft.registeredAgentChoice === "own" && draft.ownRegisteredAgent) {
      const ra = draft.ownRegisteredAgent;
      raName = ra.name;
      raAddress = [ra.addressLine1, ra.addressLine2, ra.city, ra.state, ra.zip]
        .filter(Boolean)
        .join(", ");
    } else if (business.registered_agent_id) {
      const { data: ra } = await supabase
        .from("registered_agents")
        .select("agent_name, address_line1, city, zip")
        .eq("id", business.registered_agent_id)
        .single();
      if (ra) {
        raName = ra.agent_name;
        raAddress = `${ra.address_line1}, ${ra.city}, ${business.state} ${ra.zip}`;
      }
    }

    // ── 2. Generate Articles of Organization PDF ──────────────

    const articlesPdf = await generateArticlesOfOrganization({
      draft,
      businessName: business.name,
      stateCode: business.state,
      members,
      registeredAgentName: raName,
      registeredAgentAddress: raAddress,
      organizerName: primaryMember?.fullName ?? "Organizer",
    });

    // ── 3. Generate Operating Agreement PDF ───────────────────

    const oaPdf = await generateOperatingAgreement({
      businessName: business.name,
      stateCode: business.state,
      stateName: stateConfig.stateName,
      members,
      memberType: draft.memberType ?? "single",
      foreignOwned: business.foreign_owned,
    });

    // ── 4. Upload to Supabase Storage ─────────────────────────

    const storagePath = `${input.userId}/${input.businessId}`;

    const articlesPath = `${storagePath}/${articlesPdf.fileName}`;
    const { error: artUploadError } = await supabase.storage
      .from("documents")
      .upload(articlesPath, articlesPdf.pdfBytes, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (artUploadError) {
      console.error("Articles upload error:", artUploadError.message);
    }

    const oaPath = `${storagePath}/${oaPdf.fileName}`;
    const { error: oaUploadError } = await supabase.storage
      .from("documents")
      .upload(oaPath, oaPdf.pdfBytes, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (oaUploadError) {
      console.error("Operating agreement upload error:", oaUploadError.message);
    }

    // ── 5. Create document records ────────────────────────────

    await supabase.from("documents").insert([
      {
        user_id: input.userId,
        business_id: input.businessId,
        document_type: "articles_of_organization",
        display_name: `Articles of Organization — ${business.name} LLC`,
        source: "system_generated",
        storage_path: articlesPath,
        file_size_bytes: articlesPdf.pdfBytes.length,
        mime_type: "application/pdf",
      },
      {
        user_id: input.userId,
        business_id: input.businessId,
        document_type: "operating_agreement",
        display_name: `Operating Agreement — ${business.name} LLC`,
        source: "system_generated",
        storage_path: oaPath,
        file_size_bytes: oaPdf.pdfBytes.length,
        mime_type: "application/pdf",
      },
    ]);

    // ── 6. Update formation application ───────────────────────

    await supabase
      .from("formation_applications")
      .update({
        articles_pdf_path: articlesPath,
        operating_agreement_path: oaPath,
        status: "submitted_to_mygrationstation",
      })
      .eq("business_id", input.businessId);

    // ── 7. Send confirmation email ────────────────────────────

    try {
      await sendFormationSubmittedEmail({
        to: user.email,
        locale,
        businessName: business.name,
        stateCode: business.state,
        processingDays: stateConfig.standardProcessingDays,
      });
    } catch (emailError) {
      // Log but don't fail the pipeline for email errors
      console.error("Failed to send formation email:", emailError);
    }

    // ── 8. Update business status ─────────────────────────────

    await supabase
      .from("businesses")
      .update({
        formation_status: "submitted",
        formation_draft: {
          ...draft,
          completedAt: new Date().toISOString(),
          currentStep: 8,
        },
      })
      .eq("id", input.businessId);

    return {
      success: true,
      articlesPdfPath: articlesPath,
      operatingAgreementPath: oaPath,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Pipeline failed";
    console.error("Post-payment pipeline error:", message);
    return { success: false, error: message };
  }
}

"use server";

import { getAuthenticatedUser } from "@/lib/supabase/server";
import { formationDraftSchema } from "@/lib/validations/formation";
import { getStateConfig } from "@/lib/constants/states";
import type { FormationDraft, ComplianceEventType, ComplianceStatus } from "@/lib/supabase/database.types";

interface ActionResult {
  success: boolean;
  error?: string;
  businessId?: string;
}

/**
 * Create a new business draft or return the existing one.
 * Called when the user first enters the formation wizard.
 */
export async function getOrCreateFormationDraft(): Promise<{
  businessId: string;
  draft: FormationDraft;
} | null> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    // Check for existing draft
    const { data: existing } = await supabase
      .from("businesses")
      .select("id, formation_draft")
      .eq("user_id", user.id)
      .eq("formation_status", "draft")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (existing) {
      const draft = (existing.formation_draft as FormationDraft) ?? {
        currentStep: 1,
      };
      return { businessId: existing.id, draft };
    }

    // Fetch user profile for defaults
    const { data: profile } = await supabase
      .from("users")
      .select("residency_status")
      .eq("id", user.id)
      .single();

    const defaultDraft: FormationDraft = {
      currentStep: 1,
      residencyStatus: profile?.residency_status ?? undefined,
      foreignOwned: profile?.residency_status === "non_resident",
    };

    // Create new business draft
    const { data: newBiz, error: insertError } = await supabase
      .from("businesses")
      .insert({
        user_id: user.id,
        name: "Untitled LLC",
        state: "WY",
        entity_type: "llc",
        formation_status: "draft",
        foreign_owned: defaultDraft.foreignOwned ?? false,
        formation_draft: defaultDraft,
      })
      .select("id")
      .single();

    if (insertError || !newBiz) {
      console.error("Failed to create business draft:", insertError?.message);
      return null;
    }

    return { businessId: newBiz.id, draft: defaultDraft };
  } catch (error) {
    console.error("getOrCreateFormationDraft error:", error);
    return null;
  }
}

/**
 * Save the formation draft after each wizard step.
 * Validates the draft shape and persists to Supabase.
 */
export async function saveFormationDraft(
  businessId: string,
  draft: FormationDraft
): Promise<ActionResult> {
  try {
    const { supabase } = await getAuthenticatedUser();

    // Validate draft shape
    const parsed = formationDraftSchema.safeParse(draft);
    if (!parsed.success) {
      return {
        success: false,
        error: `Invalid draft data: ${parsed.error.issues[0]?.message ?? "Unknown validation error"}`,
      };
    }

    // Update the business name and state if provided
    const updateData: Record<string, unknown> = {
      formation_draft: draft as unknown as Record<string, unknown>,
    };

    if (draft.businessName) {
      updateData.name = draft.businessName;
    }
    if (draft.stateCode) {
      updateData.state = draft.stateCode;
    }
    if (draft.foreignOwned !== undefined) {
      updateData.foreign_owned = draft.foreignOwned;
    }
    if (draft.registeredAgentChoice === "mygrationstation" && draft.mygrationstationRegisteredAgentId) {
      updateData.registered_agent_id = draft.mygrationstationRegisteredAgentId;
    }

    const { error: updateError } = await supabase
      .from("businesses")
      .update(updateData)
      .eq("id", businessId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true, businessId };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}

/**
 * Fetch registered agents available in a given state.
 */
export async function getRegisteredAgentsForState(
  stateCode: string
): Promise<Array<{ id: string; agentName: string; fullAddress: string }>> {
  try {
    const { supabase } = await getAuthenticatedUser();

    const { data, error } = await supabase
      .from("registered_agents")
      .select("id, agent_name, address_line1, address_line2, city, zip")
      .eq("state", stateCode)
      .eq("active", true);

    if (error || !data) return [];

    return data.map((ra) => ({
      id: ra.id,
      agentName: ra.agent_name,
      fullAddress: [ra.address_line1, ra.address_line2, ra.city, stateCode, ra.zip]
        .filter(Boolean)
        .join(", "),
    }));
  } catch {
    return [];
  }
}

/**
 * Create Stripe Checkout session for formation payment.
 * Returns the Stripe session URL for redirect.
 */
export async function createFormationCheckoutSession(
  businessId: string,
  plan: "standard" | "pro" | "premium"
): Promise<{ url: string } | { error: string }> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    const { data: business, error: bizError } = await supabase
      .from("businesses")
      .select("state, name, formation_draft")
      .eq("id", businessId)
      .single();

    if (bizError || !business) {
      return { error: "Business not found" };
    }

    const { STRIPE_PRICES } = await import("@/lib/stripe");

    const stateConfig = getStateConfig(business.state);
    const basePrice = STRIPE_PRICES[plan].amountCents;
    const stateFee = stateConfig.filingFeeCents;

    const planLabels: Record<string, string> = {
      standard: `LLC Formation - ${business.name}`,
      pro: `LLC Formation + EIN Concierge - ${business.name}`,
      premium: `LLC Formation + EIN + Compliance + Banking - ${business.name}`,
    };

    // Dynamic import to keep Stripe server-only
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
      apiVersion: "2024-06-20",
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email ?? undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: planLabels[plan] ?? `LLC Formation - ${business.name}`,
              description: `${business.state} LLC formation`,
            },
            unit_amount: basePrice,
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${business.state} State Filing Fee`,
              description: `Required state filing fee for ${stateConfig.stateName}`,
            },
            unit_amount: stateFee,
          },
          quantity: 1,
        },
      ],
      metadata: {
        business_id: businessId,
        user_id: user.id,
        plan,
        state: business.state,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/en/formation?step=8&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/en/formation?step=7`,
    });

    if (!session.url) {
      return { error: "Failed to create checkout session" };
    }

    const draft = (business.formation_draft as FormationDraft) ?? {
      currentStep: 7,
    };
    draft.stripeSessionId = session.id;

    await supabase
      .from("businesses")
      .update({
        formation_draft: draft,
      })
      .eq("id", businessId);

    return { url: session.url };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    return { error: message };
  }
}

/**
 * Complete the formation after successful payment.
 * Creates formation_application, compliance_events, updates business status.
 */
export async function completeFormation(
  businessId: string,
  stripeSessionId: string
): Promise<ActionResult> {
  try {
    const { supabase, user: _user } = await getAuthenticatedUser();

    // Fetch business
    const { data: business, error: bizError } = await supabase
      .from("businesses")
      .select("*, formation_draft")
      .eq("id", businessId)
      .single();

    if (bizError || !business) {
      return { success: false, error: "Business not found" };
    }

    const draft = business.formation_draft as FormationDraft;
    const stateConfig = getStateConfig(business.state);

    // Update business status
    const { error: statusError } = await supabase
      .from("businesses")
      .update({
        formation_status: "submitted",
        formation_draft: {
          ...draft,
          completedAt: new Date().toISOString(),
          currentStep: 8,
        },
      })
      .eq("id", businessId);

    if (statusError) {
      return { success: false, error: statusError.message };
    }

    // Create formation application record
    const { error: faError } = await supabase
      .from("formation_applications")
      .insert({
        business_id: businessId,
        status: "submitted_to_mygrationstation",
        state_fee_cents: stateConfig.filingFeeCents,
        stripe_payment_intent_id: stripeSessionId,
        submitted_at: new Date().toISOString(),
      });

    if (faError) {
      console.error("Failed to create formation application:", faError.message);
    }

    // Auto-generate compliance events based on profile
    await generateComplianceEvents(supabase, businessId, business, draft);

    return { success: true, businessId };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}

/**
 * Generate compliance events for a newly formed business.
 */
async function generateComplianceEvents(
  supabase: Awaited<ReturnType<typeof getAuthenticatedUser>>["supabase"],
  businessId: string,
  business: { state: string; foreign_owned: boolean },
  draft: FormationDraft
): Promise<void> {
  const events: Array<{
    business_id: string;
    event_type: ComplianceEventType;
    due_date: string;
    status: ComplianceStatus;
  }> = [];

  const now = new Date();
  const currentYear = now.getFullYear();

  // BOI Report - foreign-owned only, 30 days post-formation
  if (business.foreign_owned) {
    const boiDue = new Date(now);
    boiDue.setDate(boiDue.getDate() + 30);
    events.push({
      business_id: businessId,
      event_type: "boi_report",
      due_date: boiDue.toISOString().split("T")[0] ?? "",
      status: "upcoming",
    });

    // Form 5472 - foreign-owned SMLLCs, April 15
    const form5472Due = new Date(currentYear + 1, 3, 15); // April 15 next year
    events.push({
      business_id: businessId,
      event_type: "form_5472",
      due_date: form5472Due.toISOString().split("T")[0] ?? "",
      status: "upcoming",
    });
  }

  // Quarterly estimated taxes - US residents only
  if (draft.residencyStatus !== "non_resident") {
    const quarterDates: Array<[ComplianceEventType, string]> = [
      ["quarterly_estimated_tax_q1", `${currentYear + 1}-04-15`],
      ["quarterly_estimated_tax_q2", `${currentYear + 1}-06-17`],
      ["quarterly_estimated_tax_q3", `${currentYear + 1}-09-16`],
      ["quarterly_estimated_tax_q4", `${currentYear + 2}-01-15`],
    ];

    for (const [type, date] of quarterDates) {
      events.push({
        business_id: businessId,
        event_type: type,
        due_date: date,
        status: "upcoming",
      });
    }
  }

  // Annual state report (based on state)
  const stateConfig = getStateConfig(business.state);
  if (stateConfig.annualReportFilingFeeCents > 0) {
    // Simplified: set to 1 year from now
    const annualDue = new Date(now);
    annualDue.setFullYear(annualDue.getFullYear() + 1);
    events.push({
      business_id: businessId,
      event_type: "annual_state_report",
      due_date: annualDue.toISOString().split("T")[0] ?? "",
      status: "upcoming",
    });
  }

  // Registered agent renewal - annual
  const raDue = new Date(now);
  raDue.setFullYear(raDue.getFullYear() + 1);
  events.push({
    business_id: businessId,
    event_type: "registered_agent_renewal",
    due_date: raDue.toISOString().split("T")[0] ?? "",
    status: "upcoming",
  });

  if (events.length > 0) {
    const { error } = await supabase.from("compliance_events").insert(events);
    if (error) {
      console.error("Failed to create compliance events:", error.message);
    }
  }
}

/**
 * Initiate the DocuSeal e-signature flow for Articles of Organization.
 * Generates the PDF, uploads to DocuSeal, returns the signing URL.
 */
export async function initiateArticlesSigning(
  businessId: string
): Promise<{ signingUrl: string; embedUrl: string } | { error: string }> {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    const { data: business } = await supabase
      .from("businesses")
      .select("name, state, formation_draft, registered_agent_id")
      .eq("id", businessId)
      .single();

    if (!business) return { error: "Business not found" };

    const draft = business.formation_draft as FormationDraft;
    const members = draft.members ?? [];
    const primaryMember = members[0];

    // Determine RA info
    let raName = "MygrationStation Registered Agent";
    let raAddress = business.state;

    if (draft.registeredAgentChoice === "own" && draft.ownRegisteredAgent) {
      const ra = draft.ownRegisteredAgent;
      raName = ra.name;
      raAddress = [ra.addressLine1, ra.city, ra.state, ra.zip].filter(Boolean).join(", ");
    }

    // Generate PDF
    const { generateArticlesOfOrganization } = await import("@/lib/pdf/articles-generator");
    const { pdfBytes } = await generateArticlesOfOrganization({
      draft,
      businessName: business.name,
      stateCode: business.state,
      members,
      registeredAgentName: raName,
      registeredAgentAddress: raAddress,
      organizerName: primaryMember?.fullName ?? "Organizer",
    });

    // Send to DocuSeal
    const { initiateArticlesSigning: docusealSign } = await import("@/lib/docuseal");
    const { data: userProfile } = await supabase
      .from("users")
      .select("lang_pref")
      .eq("id", user.id)
      .single();
    const locale = userProfile?.lang_pref ?? "en";
    const result = await docusealSign(
      pdfBytes,
      business.name,
      user.email ?? "",
      primaryMember?.fullName ?? "Organizer",
      `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/formation?step=6&signed=true`
    );

    // Save submission ID to draft
    const updatedDraft: FormationDraft = {
      ...draft,
      docusealSubmissionId: String(result.submissionId),
    };

    await supabase
      .from("businesses")
      .update({
        formation_draft: updatedDraft,
      })
      .eq("id", businessId);

    return {
      signingUrl: result.signingUrl,
      embedUrl: result.embedUrl,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Signing failed";
    return { error: message };
  }
}


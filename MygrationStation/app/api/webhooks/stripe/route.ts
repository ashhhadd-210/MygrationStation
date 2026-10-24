import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { executePostPaymentPipeline } from "@/lib/pipeline/post-payment";
import type { FormationDraft } from "@/lib/supabase/database.types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET ?? ""
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe webhook signature verification failed:", message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const businessId = session.metadata?.business_id;
      const userId = session.metadata?.user_id;
      const plan = session.metadata?.plan;

      if (!businessId || !userId) {
        console.error("Missing metadata on checkout session:", session.id);
        break;
      }

      // Update business status
      const { data: business } = await supabase
        .from("businesses")
        .select("formation_draft")
        .eq("id", businessId)
        .single();

      if (business) {
        const draft = (business.formation_draft as FormationDraft) ?? {};
        await supabase
          .from("businesses")
          .update({
            formation_status: "submitted",
            formation_draft: {
              ...draft,
              selectedPlan: (plan as FormationDraft["selectedPlan"]) ?? undefined,
              stripeSessionId: session.id,
              currentStep: 8,
            },
          })
          .eq("id", businessId);
      }

      // Create formation application if not exists
      const { data: existingApp } = await supabase
        .from("formation_applications")
        .select("id")
        .eq("business_id", businessId)
        .limit(1)
        .single();

      if (!existingApp) {
        await supabase.from("formation_applications").insert({
          business_id: businessId,
          status: "submitted_to_mygrationstation",
          stripe_payment_intent_id:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id ?? session.id,
          submitted_at: new Date().toISOString(),
        });
      }

      // If plan includes EIN (pro, premium, or legacy formation_ein), create ein_application
      if (plan === "pro" || plan === "premium" || plan === "formation_ein") {
        const { data: userProfile } = await supabase
          .from("users")
          .select("residency_status")
          .eq("id", userId)
          .single();

        const einPath =
          userProfile?.residency_status === "ssn_holder"
            ? "online_self"
            : userProfile?.residency_status === "itin_holder"
              ? "phone_assisted"
              : "fax_assisted";

        await supabase.from("ein_applications").insert({
          business_id: businessId,
          path: einPath,
          status: "pending_info",
        });
      }

      // Execute post-payment pipeline (PDF generation, vault storage, email)
      const pipelineResult = await executePostPaymentPipeline({
        businessId,
        userId,
        stripeSessionId: session.id,
      });

      if (!pipelineResult.success) {
        console.error("Post-payment pipeline failed:", pipelineResult.error);
        // Pipeline failure is non-fatal — admin can retry manually
      }

      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.user_id;
      if (!userId) break;

      await supabase.from("subscriptions").upsert(
        {
          user_id: userId,
          stripe_subscription_id: subscription.id,
          stripe_customer_id:
            typeof subscription.customer === "string"
              ? subscription.customer
              : subscription.customer.id,
          plan: "compliance_annual",
          status: subscription.status,
          current_period_end: new Date(
            subscription.current_period_end * 1000
          ).toISOString(),
        },
        { onConflict: "stripe_subscription_id" }
      );
      break;
    }

    default:
      // Unhandled event type - log but don't error
      console.log(`Unhandled Stripe event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

/**
 * Stripe pricing configuration.
 * Replace placeholder IDs with real Stripe Price IDs from your dashboard.
 */

export const STRIPE_PRICES = {
  standard: {
    priceId: process.env.STRIPE_PRICE_STANDARD ?? "price_placeholder_standard",
    amountCents: 14900,
    label: "Standard",
  },
  pro: {
    priceId: process.env.STRIPE_PRICE_PRO ?? "price_placeholder_pro",
    amountCents: 24900,
    label: "Pro",
  },
  premium: {
    priceId: process.env.STRIPE_PRICE_PREMIUM ?? "price_placeholder_premium",
    amountCents: 39900,
    label: "Premium (All Inclusive)",
  },
} as const;

export type StripePlan = keyof typeof STRIPE_PRICES;

/** Map old plan names to new ones for backwards compat with existing drafts */
export function normalizePlan(plan: string): StripePlan {
  if (plan === "formation_only") return "standard";
  if (plan === "formation_ein") return "pro";
  if (plan === "standard" || plan === "pro" || plan === "premium") return plan;
  return "standard";
}

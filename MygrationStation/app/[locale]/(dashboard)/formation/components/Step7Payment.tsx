"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { STATES } from "@/lib/constants/states";
import { formatCents } from "@/lib/utils";
import { STRIPE_PRICES, normalizePlan } from "@/lib/stripe";
import { createFormationCheckoutSession } from "../actions";
import type { StepProps } from "./types";
import type { StripePlan } from "@/lib/stripe";

export function Step7Payment({ draft, onBack, businessId }: StepProps) {
  const t = useTranslations("formation.step7");
  const common = useTranslations("common");

  const [plan, setPlan] = useState<StripePlan>(
    draft.selectedPlan ? normalizePlan(draft.selectedPlan) : "pro"
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const stateConfig = draft.stateCode ? STATES[draft.stateCode] : null;
  const stateFee = stateConfig?.filingFeeCents ?? 0;

  function handleProceedToPayment() {
    setError(null);
    startTransition(async () => {
      const result = await createFormationCheckoutSession(businessId, plan);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      window.location.href = result.url;
    });
  }

  const plans: Array<{
    id: StripePlan;
    title: string;
    price: number;
    description: string;
    includes: string[];
    badge: string | null;
  }> = [
    {
      id: "standard",
      title: t("standardTitle"),
      price: STRIPE_PRICES.standard.amountCents,
      description: t("standardDescription"),
      includes: t.raw("standardIncludes") as string[],
      badge: null,
    },
    {
      id: "pro",
      title: t("proTitle"),
      price: STRIPE_PRICES.pro.amountCents,
      description: t("proDescription"),
      includes: t.raw("proIncludes") as string[],
      badge: t("mostPopular"),
    },
    {
      id: "premium",
      title: t("premiumTitle"),
      price: STRIPE_PRICES.premium.amountCents,
      description: t("premiumDescription"),
      includes: t.raw("premiumIncludes") as string[],
      badge: t("allInclusive"),
    },
  ];

  const selectedPrice = STRIPE_PRICES[plan].amountCents;

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900">{t("title")}</h2>
      <p className="mt-1 text-sm text-slate-500">{t("description")}</p>

      {/* 3-tier plan cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {plans.map((p) => (
          <button
            key={p.id}
            onClick={() => setPlan(p.id)}
            className={`relative flex flex-col rounded-xl border-2 p-5 text-start transition-all ${
              plan === p.id
                ? "border-brand-500 bg-brand-50 shadow-md"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            {p.badge && (
              <span className={`absolute -top-2.5 end-3 rounded-full px-3 py-0.5 text-[10px] font-semibold text-white ${
                p.id === "pro" ? "bg-brand-600" : "bg-slate-800"
              }`}>
                {p.badge}
              </span>
            )}
            <h3 className="text-lg font-bold text-slate-900">{p.title}</h3>
            <p className="text-2xl font-bold text-brand-700">
              {formatCents(p.price)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {t("stateFee", { amount: formatCents(stateFee) })}
            </p>
            <p className="mt-2 text-sm text-slate-600">{p.description}</p>
            <ul className="mt-3 flex-1 space-y-1.5">
              {p.includes.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <svg
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      {/* Total */}
      <div className="mt-6 rounded-lg bg-slate-50 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">
            {STRIPE_PRICES[plan].label}
          </span>
          <span className="font-semibold text-slate-900">
            {formatCents(selectedPrice)}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between text-sm">
          <span className="text-slate-600">
            {stateConfig?.stateName} filing fee
          </span>
          <span className="font-semibold text-slate-900">
            {formatCents(stateFee)}
          </span>
        </div>
        <div className="mt-2 border-t border-slate-200 pt-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-900">Total</span>
            <span className="text-lg font-bold text-slate-900">
              {formatCents(selectedPrice + stateFee)}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-danger-50 p-3 text-sm text-danger-700">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          {common("back")}
        </button>
        <button
          onClick={handleProceedToPayment}
          disabled={isPending}
          className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? common("loading") : t("proceedToPayment")}
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-slate-400">
        {t("stripeSecure")}
      </p>
    </div>
  );
}

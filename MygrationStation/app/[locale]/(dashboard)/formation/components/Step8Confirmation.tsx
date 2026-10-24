"use client";

import { useEffect, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { STATES } from "@/lib/constants/states";
import { completeFormation } from "../actions";
import type { StepProps } from "./types";

export function Step8Confirmation({ draft, businessId }: StepProps) {
  const t = useTranslations("formation.step8");

  const [isPending, startTransition] = useTransition();

  const stateConfig = draft.stateCode ? STATES[draft.stateCode] : null;
  const normalizedPlan = draft.selectedPlan === "formation_ein" ? "pro" : draft.selectedPlan === "formation_only" ? "standard" : draft.selectedPlan;
  const includesEin = normalizedPlan === "pro" || normalizedPlan === "premium";

  // Complete formation on mount (if not already completed)
  useEffect(() => {
    if (draft.completedAt) return; // Already completed
    if (!draft.stripeSessionId) return;

    startTransition(async () => {
      await completeFormation(businessId, draft.stripeSessionId ?? "");
    });
  }, [businessId, draft.completedAt, draft.stripeSessionId]);

  return (
    <div className="text-center">
      {/* Success icon */}
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <svg
          className="h-10 w-10 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h2 className="mt-4 text-2xl font-bold text-slate-900">{t("title")}</h2>
      <p className="mt-2 text-slate-600">{t("description")}</p>

      {isPending && (
        <p className="mt-2 text-sm text-slate-400">
          Setting up your compliance calendar...
        </p>
      )}

      {/* Next steps */}
      <div className="mt-8 text-start">
        <h3 className="text-lg font-semibold text-slate-900">
          {t("nextSteps")}
        </h3>
        <div className="mt-4 space-y-3">
          <NextStepItem number={1} text={t("step1Text")} />
          <NextStepItem
            number={2}
            text={t("step2Text", {
              state: stateConfig?.stateName ?? "your state",
            })}
          />
          <NextStepItem number={3} text={t("step3Text")} />
          <NextStepItem
            number={4}
            text={t("step4Text", {
              days: `${stateConfig?.standardProcessingDays ?? 7}-${(stateConfig?.standardProcessingDays ?? 7) + 5} business days`,
            })}
          />
        </div>
      </div>

      {/* EIN Concierge included */}
      {includesEin && (
        <div className="mt-6 rounded-lg bg-brand-50 border border-brand-200 p-4 text-start">
          <h3 className="font-semibold text-brand-900">{t("einIncluded")}</h3>
          <p className="mt-1 text-sm text-brand-700">{t("einNext")}</p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/dashboard"
          className="rounded-lg bg-brand-600 px-8 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          {t("goToDashboard")}
        </Link>
        <Link
          href="/documents"
          className="rounded-lg border border-slate-300 bg-white px-8 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          {t("viewDocuments")}
        </Link>
      </div>
    </div>
  );
}

function NextStepItem({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
        {number}
      </span>
      <p className="mt-0.5 text-sm text-slate-700">{text}</p>
    </div>
  );
}

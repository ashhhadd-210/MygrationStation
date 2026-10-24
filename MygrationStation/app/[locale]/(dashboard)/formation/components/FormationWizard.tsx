"use client";

import { useState, useCallback, useTransition } from "react";
import { useTranslations } from "next-intl";
import type { FormationDraft } from "@/lib/supabase/database.types";
import { saveFormationDraft } from "../actions";
import { ProgressBar } from "./ProgressBar";
import { Step1Residency } from "./Step1Residency";
import { Step2State } from "./Step2State";
import { Step3BusinessName } from "./Step3BusinessName";
import { Step4Owners } from "./Step4Owners";
import { Step5RegisteredAgent } from "./Step5RegisteredAgent";
import { Step6Review } from "./Step6Review";
import { Step7Payment } from "./Step7Payment";
import { Step8Confirmation } from "./Step8Confirmation";

interface FormationWizardProps {
  businessId: string;
  initialDraft: FormationDraft;
}

const STEP_INFO: Array<{ name: string; tip: string; icon: string }> = [
  {
    name: "Residency",
    tip: "This determines your tax obligations and which EIN path we use. Choose carefully — it affects compliance requirements.",
    icon: "🛂",
  },
  {
    name: "State",
    tip: "Wyoming and Delaware are popular for non-residents (low fees, no state income tax). If you'll operate locally, form in that state to avoid extra registration.",
    icon: "📍",
  },
  {
    name: "Business Name",
    tip: "Pick something unique! Search your state's Secretary of State website to make sure the name isn't already taken.",
    icon: "✏️",
  },
  {
    name: "Owners",
    tip: "Add all members who will own the LLC. For BOI reporting, every owner with 25%+ ownership must be listed. Double-check addresses — the IRS uses these.",
    icon: "👥",
  },
  {
    name: "Registered Agent",
    tip: "Your registered agent receives legal mail on behalf of your LLC. If you don't have a US address, use our service — we've got you covered in all 50 states.",
    icon: "📬",
  },
  {
    name: "Review",
    tip: "Almost there! Review everything carefully. Once you proceed to payment, we'll prepare and file your documents with the state.",
    icon: "✅",
  },
  {
    name: "Payment",
    tip: "Your state filing fee is included in the total. After payment, we generate your Articles of Organization and Operating Agreement instantly.",
    icon: "💳",
  },
  {
    name: "Done!",
    tip: "Your LLC formation is submitted! Check your Document Vault for your Articles and Operating Agreement. Keep an eye on your Compliance Calendar for upcoming deadlines.",
    icon: "🎉",
  },
];

export function FormationWizard({
  businessId,
  initialDraft,
}: FormationWizardProps) {
  const t = useTranslations("formation");
  const common = useTranslations("common");

  const [draft, setDraft] = useState<FormationDraft>(initialDraft);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showRestored, setShowRestored] = useState(initialDraft.currentStep > 1);

  const currentStep = draft.currentStep;
  const TOTAL_STEPS = 8;
  const stepInfo = STEP_INFO[currentStep - 1]!;

  const persistDraft = useCallback(
    (updatedDraft: FormationDraft) => {
      startTransition(async () => {
        setSaveError(null);
        const result = await saveFormationDraft(businessId, updatedDraft);
        if (!result.success) {
          setSaveError(result.error ?? common("errorGeneric"));
        }
      });
    },
    [businessId, common]
  );

  function goNext(stepData: Partial<FormationDraft> = {}) {
    const updated: FormationDraft = {
      ...draft,
      ...stepData,
      currentStep: Math.min(currentStep + 1, TOTAL_STEPS),
    };
    setDraft(updated);
    persistDraft(updated);
    setShowRestored(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    if (currentStep <= 1) return;
    const updated: FormationDraft = {
      ...draft,
      currentStep: currentStep - 1,
    };
    setDraft(updated);
    persistDraft(updated);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToStep(step: number) {
    const updated: FormationDraft = { ...draft, currentStep: step };
    setDraft(updated);
    persistDraft(updated);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const stepProps = {
    draft,
    businessId,
    onNext: goNext,
    onBack: goBack,
    isPending,
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-4">
        <h1 className="font-serif text-2xl font-bold text-white">{t("title")}</h1>
        <p className="mt-1 text-sm text-neutral-400">{t("subtitle")}</p>
      </div>

      {/* Step progress with names */}
      <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

      {/* Step indicator + tip */}
      <div className="mb-4 rounded-xl border border-gold-400/20 bg-gold-400/5 p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{stepInfo.icon}</span>
          <div>
            <p className="text-sm font-semibold text-gold-400">
              Step {currentStep} of {TOTAL_STEPS}: {stepInfo.name}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-neutral-400">
              {stepInfo.tip}
            </p>
          </div>
        </div>
      </div>

      {/* Restored draft notice */}
      {showRestored && (
        <div className="mb-4 rounded-xl border border-blue-400/20 bg-blue-900/20 p-3 text-sm text-blue-400">
          {t("draftRestored")}
          <button
            onClick={() => setShowRestored(false)}
            className="ms-2 font-medium underline"
          >
            {common("close")}
          </button>
        </div>
      )}

      {/* Save error */}
      {saveError && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-900/20 p-3 text-sm text-red-400">
          {saveError}
        </div>
      )}

      {/* Saving indicator */}
      {isPending && (
        <div className="mb-4 flex items-center gap-2 text-xs text-neutral-500">
          <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {t("progressSaved")}
        </div>
      )}

      {/* Step content */}
      <div className="card animate-fade-in">
        {currentStep === 1 && <Step1Residency {...stepProps} />}
        {currentStep === 2 && <Step2State {...stepProps} />}
        {currentStep === 3 && <Step3BusinessName {...stepProps} />}
        {currentStep === 4 && <Step4Owners {...stepProps} />}
        {currentStep === 5 && <Step5RegisteredAgent {...stepProps} />}
        {currentStep === 6 && (
          <Step6Review {...stepProps} onGoToStep={goToStep} />
        )}
        {currentStep === 7 && <Step7Payment {...stepProps} />}
        {currentStep === 8 && <Step8Confirmation {...stepProps} />}
      </div>

      {/* Time estimate */}
      {currentStep < 7 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-600">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {currentStep <= 3
            ? "About 10 minutes remaining"
            : currentStep <= 5
              ? "About 5 minutes remaining"
              : "Almost done — just review and pay"}
        </div>
      )}

      <p className="prose-legal mt-6 text-center">
        {common("legalDisclaimer")}
      </p>
    </div>
  );
}

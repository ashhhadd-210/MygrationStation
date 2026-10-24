"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { STATES } from "@/lib/constants/states";
import type { StepProps } from "./types";

interface Step6Props extends StepProps {
  onGoToStep: (step: number) => void;
}

export function Step6Review({ draft, onNext, onBack, onGoToStep }: Step6Props) {
  const t = useTranslations("formation.step6");
  const common = useTranslations("common");

  const [acknowledged, setAcknowledged] = useState(draft.signatureCompleted ?? false);

  const stateConfig = draft.stateCode ? STATES[draft.stateCode] : null;

  function handleContinue() {
    if (!acknowledged) return;
    onNext({
      signatureCompleted: true,
    });
  }

  const sections: Array<{
    key: string;
    label: string;
    value: string;
    editStep: number;
  }> = [
    {
      key: "residency",
      label: t("reviewSections.residency"),
      value: draft.residencyStatus ?? "Not set",
      editStep: 1,
    },
    {
      key: "state",
      label: t("reviewSections.state"),
      value: stateConfig
        ? `${stateConfig.stateName} (${stateConfig.stateCode})`
        : "Not set",
      editStep: 2,
    },
    {
      key: "businessName",
      label: t("reviewSections.businessName"),
      value: draft.businessName ? `${draft.businessName} LLC` : "Not set",
      editStep: 3,
    },
    {
      key: "owners",
      label: t("reviewSections.owners"),
      value: draft.members
        ? draft.members
            .map((m) => `${m.fullName} (${m.ownershipPercentage}%)`)
            .join(", ")
        : "Not set",
      editStep: 4,
    },
    {
      key: "registeredAgent",
      label: t("reviewSections.registeredAgent"),
      value:
        draft.registeredAgentChoice === "mygrationstation"
          ? "MygrationStation Registered Agent"
          : draft.ownRegisteredAgent
            ? `${draft.ownRegisteredAgent.name}, ${draft.ownRegisteredAgent.city}`
            : "Not set",
      editStep: 5,
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-white">{t("title")}</h2>
      <p className="mt-1 text-sm text-neutral-400">{t("description")}</p>

      {/* Review sections */}
      <div className="mt-6 space-y-3">
        {sections.map((section) => (
          <div
            key={section.key}
            className="flex items-start justify-between rounded-xl border border-white/[0.06] bg-neutral-900/60 p-4"
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                {section.label}
              </p>
              <p className="mt-1 text-sm font-medium text-white">
                {section.value}
              </p>
            </div>
            <button
              onClick={() => onGoToStep(section.editStep)}
              className="text-sm font-medium text-gold-400 hover:text-gold-300"
            >
              {t("editSection")}
            </button>
          </div>
        ))}
      </div>

      {/* Foreign-owned notice */}
      {draft.foreignOwned && (
        <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-900/20 p-3 text-sm text-amber-400">
          This is a foreign-owned LLC. Additional compliance requirements apply:
          BOI Report (within 30 days) and Form 5472 + Pro-forma 1120 (annually
          by April 15).
        </div>
      )}

      {/* Authorization acknowledgment */}
      <div className="mt-6 rounded-xl border border-white/[0.06] bg-neutral-900/60 p-5">
        <h3 className="font-semibold text-white">
          Authorization & Acknowledgment
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-400">
          By checking the box below, you confirm that the information provided is accurate and you authorize
          MygrationStation to prepare and file your Articles of Organization and Operating Agreement
          with the state of {stateConfig?.stateName ?? "your chosen state"}.
        </p>

        <label className="mt-4 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="mt-0.5 h-5 w-5 rounded border-neutral-600 bg-neutral-800 text-gold-400 focus:ring-gold-400 focus:ring-offset-0"
          />
          <span className="text-sm text-neutral-300">
            I confirm the above information is correct and I authorize MygrationStation to prepare,
            file, and process my LLC formation documents. I understand that my Articles of Organization
            and Operating Agreement will be generated and available in my Document Vault after payment.
          </span>
        </label>

        {acknowledged && (
          <div className="mt-3 flex items-center gap-2 text-sm text-emerald-400">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            Authorized — you may proceed to payment
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="rounded-xl border border-neutral-700 px-6 py-2.5 text-sm font-medium text-neutral-300 hover:bg-neutral-800"
        >
          {common("back")}
        </button>
        <button
          onClick={handleContinue}
          disabled={!acknowledged}
          className="rounded-xl bg-gold-400 px-6 py-2.5 text-sm font-semibold text-black hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {common("continue")}
        </button>
      </div>
    </div>
  );
}

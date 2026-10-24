"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { ResidencyStatus } from "@/lib/supabase/database.types";
import type { StepProps } from "./types";

export function Step1Residency({ draft, onNext }: StepProps) {
  const t = useTranslations("formation.step1");
  const common = useTranslations("common");

  const [selected, setSelected] = useState<ResidencyStatus>(
    draft.residencyStatus ?? "itin_holder"
  );

  function handleContinue() {
    onNext({
      residencyStatus: selected,
      foreignOwned: selected === "non_resident",
    });
  }

  const options: Array<{
    value: ResidencyStatus;
    label: string;
    description: string;
  }> = [
    {
      value: "ssn_holder",
      label: t("ssnHolder"),
      description: t("ssnHolderDescription"),
    },
    {
      value: "itin_holder",
      label: t("itinHolder"),
      description: t("itinHolderDescription"),
    },
    {
      value: "non_resident",
      label: t("nonResident"),
      description: t("nonResidentDescription"),
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900">{t("title")}</h2>
      <p className="mt-1 text-sm text-slate-500">{t("description")}</p>

      <div className="mt-6 space-y-3">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`block cursor-pointer rounded-xl border-2 p-4 transition-colors ${
              selected === opt.value
                ? "border-brand-500 bg-brand-50"
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="residency"
                value={opt.value}
                checked={selected === opt.value}
                onChange={() => setSelected(opt.value)}
                className="mt-1 h-4 w-4 text-brand-600 focus:ring-brand-500"
              />
              <div>
                <span className="block font-medium text-slate-900">
                  {opt.label}
                </span>
                <span className="mt-0.5 block text-sm text-slate-500">
                  {opt.description}
                </span>
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* S-Corp warning for non-residents */}
      {selected === "non_resident" && (
        <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-4">
          <div className="flex gap-2">
            <svg
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-amber-800">{t("sCorpWarning")}</p>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleContinue}
          className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          {common("continue")}
        </button>
      </div>
    </div>
  );
}

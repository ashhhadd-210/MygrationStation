"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { STATES } from "@/lib/constants/states";
import type { StepProps } from "./types";

export function Step3BusinessName({ draft, onNext, onBack }: StepProps) {
  const t = useTranslations("formation.step3");
  const common = useTranslations("common");

  const [name, setName] = useState(draft.businessName ?? "");
  const [error, setError] = useState<string | null>(null);

  const stateConfig = draft.stateCode ? STATES[draft.stateCode] : null;

  function validate(): boolean {
    if (!name.trim()) {
      setError("Business name is required");
      return false;
    }
    if (name.length > 200) {
      setError("Business name must be under 200 characters");
      return false;
    }
    if (/\b(inc\.?|corp\.?|corporation|incorporated)\b/i.test(name)) {
      setError(
        "LLC names cannot include terms like 'Inc.', 'Corp.', or 'Corporation'"
      );
      return false;
    }
    return true;
  }

  function handleContinue() {
    setError(null);
    if (!validate()) return;
    onNext({ businessName: name.trim() });
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900">{t("title")}</h2>
      <p className="mt-1 text-sm text-slate-500">{t("description")}</p>

      <div className="mt-6">
        <label
          htmlFor="businessName"
          className="block text-sm font-medium text-slate-700"
        >
          {t("businessName")}
        </label>
        <div className="mt-1 flex items-center gap-2">
          <input
            id="businessName"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            placeholder={t("businessNamePlaceholder")}
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
          <span className="whitespace-nowrap rounded-lg bg-slate-100 px-3 py-2.5 text-sm font-medium text-slate-600">
            LLC
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-400">{t("llcSuffix")}</p>

        {error && (
          <p className="mt-2 text-sm text-danger-700">{error}</p>
        )}
      </div>

      {/* SOS verification link */}
      {stateConfig && name.trim() && (
        <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-4">
          <p className="text-sm text-blue-800">
            {t("nameWarning", { state: stateConfig.stateName })}
          </p>
          <a
            href={stateConfig.sosSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-800"
          >
            {t("sosLink", { state: stateConfig.stateCode })}
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      )}

      {/* Naming tips */}
      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold text-slate-700">
          {t("nameTips")}
        </h3>
        <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <span className="mt-1 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" />
            {t("tip1")}
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" />
            {t("tip2")}
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" />
            {t("tip3")}
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" />
            {t("tip4")}
          </li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          {common("back")}
        </button>
        <button
          onClick={handleContinue}
          disabled={!name.trim()}
          className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {common("continue")}
        </button>
      </div>
    </div>
  );
}

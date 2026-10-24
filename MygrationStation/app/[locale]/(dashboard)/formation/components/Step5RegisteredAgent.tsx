"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { StepProps } from "./types";

export function Step5RegisteredAgent({ draft, onNext, onBack }: StepProps) {
  const t = useTranslations("formation.step5");
  const common = useTranslations("common");

  const [choice, setChoice] = useState<"mygrationstation" | "own">(
    draft.registeredAgentChoice ?? "mygrationstation"
  );
  const [ownAgent, setOwnAgent] = useState(
    draft.ownRegisteredAgent ?? {
      name: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: draft.stateCode ?? "",
      zip: "",
    }
  );
  const [error, setError] = useState<string | null>(null);

  function handleContinue() {
    setError(null);
    if (choice === "own") {
      if (!ownAgent.name.trim() || !ownAgent.addressLine1.trim() || !ownAgent.city.trim() || !ownAgent.zip.trim()) {
        setError("All registered agent fields are required");
        return;
      }
      onNext({
        registeredAgentChoice: "own",
        ownRegisteredAgent: ownAgent,
      });
    } else {
      onNext({ registeredAgentChoice: "mygrationstation" });
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900">{t("title")}</h2>
      <p className="mt-1 text-sm text-slate-500">{t("description")}</p>

      <div className="mt-6 space-y-3">
        {/* MygrationStation RA */}
        <label
          className={`block cursor-pointer rounded-xl border-2 p-4 transition-colors ${
            choice === "mygrationstation"
              ? "border-brand-500 bg-brand-50"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-start gap-3">
            <input
              type="radio"
              name="raChoice"
              checked={choice === "mygrationstation"}
              onChange={() => setChoice("mygrationstation")}
              className="mt-1 h-4 w-4 text-brand-600 focus:ring-brand-500"
            />
            <div>
              <span className="block font-medium text-slate-900">
                {t("useMygrationStation")}
              </span>
              <span className="mt-0.5 block text-sm text-slate-500">
                {t("useMygrationStationDescription")}
              </span>
            </div>
          </div>
        </label>

        {/* Own RA */}
        <label
          className={`block cursor-pointer rounded-xl border-2 p-4 transition-colors ${
            choice === "own"
              ? "border-brand-500 bg-brand-50"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-start gap-3">
            <input
              type="radio"
              name="raChoice"
              checked={choice === "own"}
              onChange={() => setChoice("own")}
              className="mt-1 h-4 w-4 text-brand-600 focus:ring-brand-500"
            />
            <div>
              <span className="block font-medium text-slate-900">
                {t("useOwn")}
              </span>
              <span className="mt-0.5 block text-sm text-slate-500">
                {t("useOwnDescription")}
              </span>
            </div>
          </div>
        </label>
      </div>

      {/* Own agent form */}
      {choice === "own" && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-600">
                {t("agentName")} *
              </label>
              <input
                type="text"
                value={ownAgent.name}
                onChange={(e) => setOwnAgent({ ...ownAgent, name: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-600">
                Address Line 1 *
              </label>
              <input
                type="text"
                value={ownAgent.addressLine1}
                onChange={(e) => setOwnAgent({ ...ownAgent, addressLine1: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">City *</label>
              <input
                type="text"
                value={ownAgent.city}
                onChange={(e) => setOwnAgent({ ...ownAgent, city: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">State</label>
              <input
                type="text"
                value={ownAgent.state}
                onChange={(e) => setOwnAgent({ ...ownAgent, state: e.target.value })}
                maxLength={2}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">ZIP *</label>
              <input
                type="text"
                value={ownAgent.zip}
                onChange={(e) => setOwnAgent({ ...ownAgent, zip: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg bg-danger-50 p-3 text-sm text-danger-700">
          {error}
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          {common("back")}
        </button>
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

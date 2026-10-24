"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  STATES,
  POPULAR_STATE_CODES,
  getLaunchStates,
  getAllStatesSorted,
  type StateConfig,
} from "@/lib/constants/states";
import { formatCents } from "@/lib/utils";
import type { StepProps } from "./types";

export function Step2State({ draft, onNext, onBack }: StepProps) {
  const t = useTranslations("formation.step2");
  const common = useTranslations("common");

  const [selected, setSelected] = useState(draft.stateCode ?? "");
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const launchStates = useMemo(() => getLaunchStates(), []);
  const allStates = useMemo(() => getAllStatesSorted(), []);

  const popularStates = useMemo(
    () =>
      POPULAR_STATE_CODES.map((code) => STATES[code]).filter(
        (s): s is StateConfig => s !== undefined
      ),
    []
  );

  const displayStates = showAll ? allStates : launchStates;

  const filteredStates = useMemo(() => {
    if (!search) return displayStates;
    const q = search.toLowerCase();
    return displayStates.filter(
      (s) =>
        s.stateName.toLowerCase().includes(q) ||
        s.stateCode.toLowerCase().includes(q)
    );
  }, [displayStates, search]);

  const selectedConfig = selected ? STATES[selected] : null;

  function handleContinue() {
    if (!selected) return;
    onNext({ stateCode: selected });
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900">{t("title")}</h2>
      <p className="mt-1 text-sm text-slate-500">{t("description")}</p>

      {/* Popular states */}
      <div className="mt-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {t("popular")}
        </h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {popularStates.map((state) => (
            <button
              key={state.stateCode}
              onClick={() => setSelected(state.stateCode)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                selected === state.stateCode
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {state.stateCode} - {state.stateName}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="mt-6">
        <input
          type="text"
          placeholder={t("searchStates")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      {/* State list */}
      <div className="mt-4 max-h-64 space-y-1 overflow-y-auto rounded-lg border border-slate-200 p-2">
        {filteredStates.map((state) => (
          <button
            key={state.stateCode}
            onClick={() => setSelected(state.stateCode)}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-start text-sm transition-colors ${
              selected === state.stateCode
                ? "bg-brand-50 text-brand-700"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span className="font-medium">
              {state.stateCode} - {state.stateName}
            </span>
            <span className="text-xs text-slate-400">
              {formatCents(state.filingFeeCents)}
            </span>
          </button>
        ))}
        {filteredStates.length === 0 && (
          <p className="py-4 text-center text-sm text-slate-400">
            No states found
          </p>
        )}
      </div>

      {/* Toggle show all */}
      {!showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-2 text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          {t("allStates")} (50)
        </button>
      )}

      {/* Selected state details */}
      {selectedConfig && (
        <div className="mt-6 rounded-xl border border-brand-200 bg-brand-50 p-4">
          <h3 className="font-semibold text-brand-900">
            {t("stateSelected", { state: selectedConfig.stateName })}
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-slate-500">{t("filingFee")}</span>
              <p className="font-semibold text-slate-900">
                {formatCents(selectedConfig.filingFeeCents)}
              </p>
            </div>
            <div>
              <span className="text-slate-500">{t("processingTime")}</span>
              <p className="font-semibold text-slate-900">
                {t("days", { count: selectedConfig.standardProcessingDays })}
              </p>
            </div>
            {selectedConfig.expeditedProcessingDays > 0 && (
              <div>
                <span className="text-slate-500">{t("expeditedTime")}</span>
                <p className="font-semibold text-slate-900">
                  {t("days", { count: selectedConfig.expeditedProcessingDays })}
                </p>
              </div>
            )}
            <div className="col-span-2">
              <span className="text-slate-500">{t("annualReport")}</span>
              <p className="text-xs text-slate-700">
                {selectedConfig.annualReportDueRule}
              </p>
            </div>
          </div>
          {!selectedConfig.launchState && (
            <p className="mt-3 text-xs text-amber-700">{t("noDirectFiling")}</p>
          )}
          {selectedConfig.notes && (
            <p className="mt-2 text-xs text-slate-600">
              {selectedConfig.notes}
            </p>
          )}
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
          onClick={handleContinue}
          disabled={!selected}
          className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {common("continue")}
        </button>
      </div>
    </div>
  );
}

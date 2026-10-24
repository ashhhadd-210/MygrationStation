"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { FormationMember } from "@/lib/supabase/database.types";
import type { StepProps } from "./types";

const EMPTY_MEMBER: FormationMember = {
  fullName: "",
  dateOfBirth: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  stateProvince: "",
  zipPostal: "",
  country: "United States",
  ownershipPercentage: 100,
};

export function Step4Owners({ draft, onNext, onBack }: StepProps) {
  const t = useTranslations("formation.step4");
  const common = useTranslations("common");

  const [memberType, setMemberType] = useState<"single" | "multi">(
    draft.memberType ?? "single"
  );
  const [members, setMembers] = useState<FormationMember[]>(
    draft.members?.length ? draft.members : [{ ...EMPTY_MEMBER }]
  );
  const [errors, setErrors] = useState<string[]>([]);

  const isForeignOwned = draft.foreignOwned ?? false;

  function updateMember(index: number, field: keyof FormationMember, value: string | number) {
    setMembers((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  }

  function addMember() {
    const remaining = 100 - members.reduce((s, m) => s + m.ownershipPercentage, 0);
    setMembers((prev) => [
      ...prev,
      { ...EMPTY_MEMBER, ownershipPercentage: Math.max(0, remaining), country: "United States" },
    ]);
  }

  function removeMember(index: number) {
    if (members.length <= 1) return;
    setMembers((prev) => prev.filter((_, i) => i !== index));
  }

  function validate(): boolean {
    const errs: string[] = [];
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m) continue;
      if (!m.fullName.trim()) errs.push(`Member ${i + 1}: Full name is required`);
      if (!m.dateOfBirth) errs.push(`Member ${i + 1}: Date of birth is required`);
      if (!m.addressLine1.trim()) errs.push(`Member ${i + 1}: Address is required`);
      if (!m.city.trim()) errs.push(`Member ${i + 1}: City is required`);
      if (!m.country.trim()) errs.push(`Member ${i + 1}: Country is required`);
    }
    const totalPct = members.reduce((s, m) => s + m.ownershipPercentage, 0);
    if (Math.abs(totalPct - 100) > 0.01) {
      errs.push(`Ownership percentages must total 100% (currently ${totalPct}%)`);
    }
    if (memberType === "single" && members.length !== 1) {
      errs.push("Single-member LLC must have exactly one member");
    }
    setErrors(errs);
    return errs.length === 0;
  }

  function handleContinue() {
    if (!validate()) return;
    onNext({
      memberType,
      members,
      foreignOwned: isForeignOwned,
    });
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900">{t("title")}</h2>
      <p className="mt-1 text-sm text-slate-500">{t("description")}</p>

      {/* Member type toggle */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => {
            setMemberType("single");
            setMembers([members[0] ?? { ...EMPTY_MEMBER }]);
          }}
          className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium ${
            memberType === "single"
              ? "border-brand-500 bg-brand-50 text-brand-700"
              : "border-slate-200 text-slate-600 hover:border-slate-300"
          }`}
        >
          {t("singleMember")}
        </button>
        <button
          onClick={() => {
            setMemberType("multi");
            if (members.length < 2) addMember();
          }}
          className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium ${
            memberType === "multi"
              ? "border-brand-500 bg-brand-50 text-brand-700"
              : "border-slate-200 text-slate-600 hover:border-slate-300"
          }`}
        >
          {t("multiMember")}
        </button>
      </div>

      {/* Member forms */}
      <div className="mt-6 space-y-6">
        {members.map((member, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-slate-200 bg-slate-50/50 p-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">
                {t("memberDetails", { number: idx + 1 })}
              </h3>
              {memberType === "multi" && members.length > 2 && (
                <button
                  onClick={() => removeMember(idx)}
                  className="text-xs text-danger-500 hover:text-danger-700"
                >
                  {t("removeMember")}
                </button>
              )}
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600">
                  {t("fullName")} *
                </label>
                <input
                  type="text"
                  value={member.fullName}
                  onChange={(e) => updateMember(idx, "fullName", e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600">
                  {t("dateOfBirth")} *
                </label>
                <input
                  type="date"
                  value={member.dateOfBirth}
                  onChange={(e) => updateMember(idx, "dateOfBirth", e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600">
                  {t("ownershipPercentage")} *
                </label>
                <div className="mt-1 flex items-center gap-1">
                  <input
                    type="number"
                    min={0.01}
                    max={100}
                    step={0.01}
                    value={member.ownershipPercentage}
                    onChange={(e) =>
                      updateMember(idx, "ownershipPercentage", parseFloat(e.target.value) || 0)
                    }
                    disabled={memberType === "single"}
                    className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-100"
                  />
                  <span className="text-sm text-slate-500">%</span>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600">
                  {t("addressLine1")} *
                </label>
                <input
                  type="text"
                  value={member.addressLine1}
                  onChange={(e) => updateMember(idx, "addressLine1", e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600">
                  {t("city")} *
                </label>
                <input
                  type="text"
                  value={member.city}
                  onChange={(e) => updateMember(idx, "city", e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600">
                  {t("stateProvince")} *
                </label>
                <input
                  type="text"
                  value={member.stateProvince}
                  onChange={(e) => updateMember(idx, "stateProvince", e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600">
                  {t("zipPostal")} *
                </label>
                <input
                  type="text"
                  value={member.zipPostal}
                  onChange={(e) => updateMember(idx, "zipPostal", e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600">
                  {t("country")} *
                </label>
                <input
                  type="text"
                  value={member.country}
                  onChange={(e) => updateMember(idx, "country", e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {memberType === "multi" && (
        <button
          onClick={addMember}
          className="mt-3 text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          + {t("addMember")}
        </button>
      )}

      {/* BOI Section */}
      <div className="mt-6 rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-700">{t("boiSection")}</h3>
        {isForeignOwned ? (
          <div className="mt-2">
            <p className="text-sm text-amber-700">{t("boiRequired")}</p>
            <p className="mt-1 text-xs text-slate-500">{t("boiExplanation")}</p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-green-700">{t("boiNotRequired")}</p>
        )}
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mt-4 rounded-lg bg-danger-50 p-3">
          {errors.map((err, i) => (
            <p key={i} className="text-sm text-danger-700">
              {err}
            </p>
          ))}
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
          className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          {common("continue")}
        </button>
      </div>
    </div>
  );
}

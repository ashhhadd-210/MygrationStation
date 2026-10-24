"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import type { ResidencyStatus, BankName } from "@/lib/supabase/database.types";

interface Business {
  id: string;
  name: string;
  state: string;
  ein: string | null;
}

interface BankingApp {
  id: string;
  business_id: string;
  bank_name: BankName;
  status: string;
}

interface BankProfile {
  name: BankName;
  displayName: string;
  description: string;
  requiresSSN: boolean;
  requiresUSAddress: boolean;
  isFDIC: boolean;
  intlWireFriendly: boolean;
  hasDebitCard: boolean;
  nonResidentAcceptance: "high" | "moderate" | "low";
  pros: string[];
  cons: string[];
}

const BANKS: BankProfile[] = [
  {
    name: "mercury",
    displayName: "Mercury",
    description: "Modern business banking for startups. Requires US physical address (not RA).",
    requiresSSN: false,
    requiresUSAddress: true,
    isFDIC: true,
    intlWireFriendly: true,
    hasDebitCard: true,
    nonResidentAcceptance: "moderate",
    pros: ["No monthly fees", "Modern UI", "API access", "ACH/wire transfers"],
    cons: ["Requires US physical address", "Tightened non-resident approvals in 2025"],
  },
  {
    name: "relay",
    displayName: "Relay",
    description: "Fee-free business banking with multi-account support.",
    requiresSSN: false,
    requiresUSAddress: true,
    isFDIC: true,
    intlWireFriendly: false,
    hasDebitCard: true,
    nonResidentAcceptance: "moderate",
    pros: ["No fees", "Multiple checking accounts", "Profit-first budgeting"],
    cons: ["Requires US address", "Limited international wire support"],
  },
  {
    name: "airwallex",
    displayName: "Airwallex",
    description: "Global business account for international payments. High non-resident acceptance.",
    requiresSSN: false,
    requiresUSAddress: false,
    isFDIC: false,
    intlWireFriendly: true,
    hasDebitCard: true,
    nonResidentAcceptance: "high",
    pros: ["No US address needed", "Multi-currency", "Great FX rates", "High acceptance"],
    cons: ["Not FDIC insured", "Newer platform"],
  },
  {
    name: "wise",
    displayName: "Wise Business",
    description: "Best for international transfers and multi-currency accounts.",
    requiresSSN: false,
    requiresUSAddress: false,
    isFDIC: false,
    intlWireFriendly: true,
    hasDebitCard: true,
    nonResidentAcceptance: "high",
    pros: ["Easy approval", "Best FX rates", "Multi-currency", "No US address needed"],
    cons: ["Not FDIC insured", "Not a traditional bank account"],
  },
  {
    name: "slash",
    displayName: "Slash",
    description: "No SSN or EIN required. Virtual card and deposit account.",
    requiresSSN: false,
    requiresUSAddress: false,
    isFDIC: false,
    intlWireFriendly: false,
    hasDebitCard: true,
    nonResidentAcceptance: "high",
    pros: ["No SSN/EIN needed", "Virtual cards", "Fast approval"],
    cons: ["Not FDIC insured", "Limited features", "No wire transfers"],
  },
  {
    name: "nbkc",
    displayName: "NBKC Bank",
    description: "Traditional bank with online-first approach. Requires SSN.",
    requiresSSN: true,
    requiresUSAddress: true,
    isFDIC: true,
    intlWireFriendly: true,
    hasDebitCard: true,
    nonResidentAcceptance: "low",
    pros: ["FDIC insured", "Traditional bank features", "Good rates"],
    cons: ["Requires SSN", "Not immigrant-friendly"],
  },
];

interface Answers {
  hasUSAddress: boolean | null;
  hasSSN: boolean | null;
  needsFDIC: boolean | null;
  needsIntlWires: boolean | null;
  needsDebitCard: boolean | null;
}

interface Props {
  residencyStatus: ResidencyStatus;
  businesses: Business[];
  existingApplications: BankingApp[];
}

export function BankingProfiler({ residencyStatus, businesses: _businesses, existingApplications: _existingApplications }: Props) {
  const t = useTranslations("banking");
  const common = useTranslations("common");

  const [step, setStep] = useState<"questions" | "results">("questions");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    hasUSAddress: null,
    hasSSN: residencyStatus === "ssn_holder" ? true : false,
    needsFDIC: null,
    needsIntlWires: null,
    needsDebitCard: null,
  });

  const questions: Array<{
    key: keyof Answers;
    text: string;
  }> = [
    { key: "hasUSAddress", text: t("profilerQuestions.q1") },
    { key: "hasSSN", text: t("profilerQuestions.q2") },
    { key: "needsFDIC", text: t("profilerQuestions.q3") },
    { key: "needsIntlWires", text: t("profilerQuestions.q4") },
    { key: "needsDebitCard", text: t("profilerQuestions.q5") },
  ];

  function answer(value: boolean) {
    const q = questions[currentQ];
    if (!q) return;
    setAnswers((prev) => ({ ...prev, [q.key]: value }));
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStep("results");
    }
  }

  function rankBanks(): BankProfile[] {
    return BANKS.map((bank) => {
      let score = 50; // base
      if (answers.hasSSN === false && bank.requiresSSN) score -= 100;
      if (answers.hasUSAddress === false && bank.requiresUSAddress) score -= 40;
      if (answers.needsFDIC === true && !bank.isFDIC) score -= 30;
      if (answers.needsIntlWires === true && bank.intlWireFriendly) score += 20;
      if (answers.needsIntlWires === true && !bank.intlWireFriendly) score -= 15;
      if (bank.nonResidentAcceptance === "high") score += 15;
      if (bank.nonResidentAcceptance === "low" && residencyStatus !== "ssn_holder") score -= 30;
      return { bank, score };
    })
      .sort((a, b) => b.score - a.score)
      .filter((r) => r.score > 0)
      .map((r) => r.bank);
  }

  if (step === "questions") {
    const q = questions[currentQ];
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>

        <div className="mt-8 card">
          <p className="text-xs text-slate-400">
            Question {currentQ + 1} of {questions.length}
          </p>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brand-600 transition-all"
              style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
            />
          </div>
          <p className="mt-6 text-lg font-medium text-slate-900">{q?.text}</p>
          <div className="mt-6 flex gap-3">
            <Button onClick={() => answer(true)} variant="primary" size="lg">
              {common("yes")}
            </Button>
            <Button onClick={() => answer(false)} variant="secondary" size="lg">
              {common("no")}
            </Button>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3">
          <p className="text-xs text-amber-700">{t("noGuarantee")}</p>
        </div>

        <p className="prose-legal mt-6 text-center">{common("legalDisclaimer")}</p>
      </div>
    );
  }

  const ranked = rankBanks();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
      <h2 className="mt-4 text-lg font-semibold text-slate-900">{t("recommendation")}</h2>

      <div className="mt-4 space-y-4">
        {ranked.map((bank, idx) => (
          <div
            key={bank.name}
            className={`rounded-xl border p-5 ${
              idx === 0
                ? "border-brand-300 bg-brand-50 ring-1 ring-brand-200"
                : "border-slate-200 bg-white"
            }`}
          >
            {idx === 0 && (
              <span className="mb-2 inline-block rounded-full bg-brand-600 px-3 py-0.5 text-[10px] font-bold text-white">
                Best Match
              </span>
            )}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {bank.displayName}
                </h3>
                <p className="mt-1 text-sm text-slate-500">{bank.description}</p>
              </div>
              <div className="flex gap-1">
                {bank.isFDIC && (
                  <span className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                    FDIC
                  </span>
                )}
                {!bank.requiresSSN && (
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                    No SSN
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-green-600">Advantages</p>
                <ul className="mt-1 space-y-0.5">
                  {bank.pros.map((pro) => (
                    <li key={pro} className="flex items-start gap-1 text-xs text-slate-600">
                      <span className="mt-0.5 text-green-500">+</span> {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium text-red-500">Considerations</p>
                <ul className="mt-1 space-y-0.5">
                  {bank.cons.map((con) => (
                    <li key={con} className="flex items-start gap-1 text-xs text-slate-600">
                      <span className="mt-0.5 text-red-400">-</span> {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Button variant={idx === 0 ? "primary" : "secondary"} size="sm" className="mt-4">
              {t("applyNow")}
            </Button>
          </div>
        ))}
      </div>

      {/* Virtual mailbox upsell */}
      {answers.hasUSAddress === false && (
        <div className="mt-6 rounded-xl border border-purple-200 bg-purple-50 p-5">
          <h3 className="font-semibold text-purple-900">{t("virtualMailbox")}</h3>
          <p className="mt-1 text-sm text-purple-700">{t("virtualMailboxDescription")}</p>
          <Button variant="secondary" size="sm" className="mt-3">
            Learn More
          </Button>
        </div>
      )}

      <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3">
        <p className="text-xs text-amber-700">{t("noGuarantee")}</p>
      </div>

      {/* Reset */}
      <button
        onClick={() => {
          setStep("questions");
          setCurrentQ(0);
          setAnswers({ hasUSAddress: null, hasSSN: null, needsFDIC: null, needsIntlWires: null, needsDebitCard: null });
        }}
        className="mt-4 text-sm text-brand-600 hover:text-brand-700"
      >
        Retake questionnaire
      </button>

      <p className="prose-legal mt-6 text-center">{common("legalDisclaimer")}</p>
    </div>
  );
}

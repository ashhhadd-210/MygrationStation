"use client";

import { useState } from "react";

const tabs = [
  {
    id: "llc",
    label: "LLC Formation",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    badge: "LLC Formation",
    title: "Form your LLC in any US state",
    description:
      "Articles of Organization and Operating Agreement prepared and filed for you. Our guided wizard walks you through every field — in your language.",
    checks: [
      "All 50 states supported",
      "Operating Agreement included",
      "Filed within 1-3 business days",
    ],
  },
  {
    id: "ein",
    label: "EIN Without SSN",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
      </svg>
    ),
    badge: "EIN Concierge",
    title: "Get your EIN without an SSN",
    description:
      "We handle the IRS paperwork through three submission methods — online, phone, or fax. You choose what works best for your situation.",
    checks: [
      "No SSN required",
      "SS-4 form prepared for you",
      "EIN letter stored in your vault",
    ],
  },
  {
    id: "documents",
    label: "Document Vault",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    badge: "Document Vault",
    title: "Secure encrypted document storage",
    description:
      "All your business documents encrypted and stored securely. Access, download, and share with time-limited links anytime.",
    checks: [
      "256-bit AES encryption",
      "Time-limited sharing links",
      "Organized by category",
    ],
  },
  {
    id: "compliance",
    label: "Compliance",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    badge: "Compliance",
    title: "Never miss a filing deadline",
    description:
      "Automated compliance calendar tracks every deadline — BOI reports, Form 5472, quarterly taxes, annual reports, and more.",
    checks: [
      "Auto-generated deadlines",
      "Email alerts before due dates",
      "Penalty prevention",
    ],
  },
  {
    id: "banking",
    label: "Banking",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
      </svg>
    ),
    badge: "Banking",
    title: "Open a US business bank account",
    description:
      "Find immigrant-friendly banks, get matched based on your profile, and start accepting payments from day one.",
    checks: [
      "Personalized bank matching",
      "No US address required options",
      "Mercury, Relay, and more",
    ],
  },
  {
    id: "languages",
    label: "10 Languages",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
      </svg>
    ),
    badge: "10 Languages",
    title: "Your language, your way",
    description:
      "Full platform available in English, Spanish, Chinese, Arabic, French, Korean, Portuguese, Hindi, Tagalog, and Vietnamese.",
    checks: [
      "Complete UI translation",
      "RTL support for Arabic",
      "Legal documents in your language",
    ],
  },
];

export function FeaturesSection() {
  const [activeTab, setActiveTab] = useState("llc");
  const active = tabs.find((t) => t.id === activeTab) ?? tabs[0]!;
  if (!active) return null;

  return (
    <section id="features" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">
            Everything you need
          </p>
          <h2 className="mt-4 font-serif text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            One platform, complete{" "}
            <span className="text-gold-400">business launch</span>
          </h2>
          <p className="mt-4 text-lg text-neutral-400">
            From formation to banking — we handle the complexity so you can
            focus on building.
          </p>
        </div>

        {/* Tab pills */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "border-gold-400 bg-gold-400/10 text-gold-400"
                  : "border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-neutral-300"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="mt-10 rounded-2xl border border-white/[0.06] bg-neutral-900/60 p-8 lg:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* Left: text */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 text-sm font-medium text-gold-400">
                {active.icon}
                {active.badge}
              </span>
              <h3 className="mt-6 font-serif text-2xl font-bold text-white lg:text-3xl">
                {active.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-neutral-400">
                {active.description}
              </p>
              <ul className="mt-6 space-y-3">
                {active.checks.map((check, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-sm text-neutral-300"
                  >
                    <svg
                      className="h-5 w-5 flex-shrink-0 text-gold-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    {check}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: mockup */}
            <div className="hidden lg:block">
              <div className="rounded-xl border border-white/[0.06] bg-neutral-950 p-6">
                {/* Window dots */}
                <div className="mb-4 flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500/60" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
                  <span className="h-3 w-3 rounded-full bg-green-500/60" />
                </div>
                {/* Placeholder content */}
                <div className="space-y-3">
                  <div className="h-3 w-2/3 rounded bg-neutral-800" />
                  <div className="h-3 w-1/2 rounded bg-neutral-800" />
                  <div className="mt-4 flex items-center justify-center rounded-lg border border-white/[0.04] bg-neutral-900 p-8">
                    <svg
                      className="h-10 w-10 text-neutral-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>
                  </div>
                  <div className="h-10 w-full rounded-lg bg-gold-400/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

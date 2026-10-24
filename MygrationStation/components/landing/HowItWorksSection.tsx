"use client";

import { useState } from "react";

const steps = [
  {
    number: "01",
    title: "Tell us about your business",
    description:
      "Choose your state, name your LLC, and provide owner details. Our guided wizard walks you through every field — in your language.",
    mockupTitle: "LLC Formation Wizard",
    mockupItems: [
      { icon: "file", label: "LLC Name" },
      { icon: "file", label: "State of Formation" },
      { icon: "file", label: "Registered Agent" },
    ],
    cta: "Next Step",
  },
  {
    number: "02",
    title: "We file everything",
    description:
      "Articles of Organization, Operating Agreement, EIN application, and BOI report — we prepare, review, and file it all with the state and IRS.",
    mockupTitle: "Document Preparation",
    mockupItems: [
      { icon: "doc", label: "Articles of Organization" },
      { icon: "doc", label: "Operating Agreement" },
      { icon: "doc", label: "SS-4 Application" },
    ],
    cta: "Next Step",
  },
  {
    number: "03",
    title: "Stay compliant forever",
    description:
      "Automated compliance calendar tracks every deadline. Get alerts before penalties hit. Never miss an annual report or tax filing.",
    mockupTitle: "Compliance Dashboard",
    mockupItems: [
      { icon: "calendar", label: "Annual Report — Dec 31" },
      { icon: "calendar", label: "BOI Filing — Jan 15" },
      { icon: "calendar", label: "Form 5472 — Apr 15" },
    ],
    cta: "Launch",
  },
];

function MockupIcon({ type }: { type: string }) {
  if (type === "calendar") {
    return (
      <svg className="h-5 w-5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    );
  }
  if (type === "doc") {
    return (
      <svg className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    );
  }
  return (
    <svg className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const active = steps[activeStep]!;

  return (
    <section id="how-it-works" className="border-t border-white/[0.06] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">
            Simple process
          </p>
          <h2 className="mt-4 font-serif text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Your LLC in{" "}
            <span className="text-gold-400">3 simple steps</span>
          </h2>
          <p className="mt-4 text-lg text-neutral-400">
            We handle the paperwork. You focus on your business.
          </p>
        </div>

        {/* Content: steps + mockup */}
        <div className="mt-16 grid items-start gap-12 lg:grid-cols-2">
          {/* Left: interactive steps */}
          <div className="space-y-0">
            {steps.map((step, idx) => {
              const isActive = idx === activeStep;
              return (
                <button
                  key={step.number}
                  onClick={() => setActiveStep(idx)}
                  className={`relative block w-full border-s-2 py-6 ps-8 text-start transition-all duration-300 ${
                    isActive
                      ? "border-gold-400"
                      : "border-neutral-800 hover:border-neutral-600"
                  }`}
                >
                  {/* Step number */}
                  <div
                    className={`absolute -start-[17px] top-6 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-gold-400 text-black"
                        : "bg-neutral-800 text-neutral-500"
                    }`}
                  >
                    {step.number}
                  </div>

                  {/* Content wrapper with highlight bg */}
                  <div
                    className={`rounded-xl transition-all duration-300 ${
                      isActive
                        ? "border border-white/[0.08] bg-neutral-900/60 p-5 -ms-2"
                        : "p-0"
                    }`}
                  >
                    <h3
                      className={`text-lg font-semibold transition-colors duration-300 ${
                        isActive ? "text-white" : "text-neutral-500"
                      }`}
                    >
                      {step.title}
                    </h3>
                    {/* Animated description */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isActive ? "mt-2 max-h-40 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="text-sm leading-relaxed text-neutral-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: animated mockup */}
          <div className="hidden lg:block">
            <div
              key={activeStep}
              className="animate-fade-in rounded-2xl border border-white/[0.06] bg-neutral-900/80 p-6"
            >
              {/* Window dots + title */}
              <div className="mb-5 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500/60" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <span className="h-3 w-3 rounded-full bg-green-500/60" />
                <span className="ml-3 text-sm text-neutral-500">
                  {active.mockupTitle}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {active.mockupItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-neutral-950 px-4 py-3.5"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <MockupIcon type={item.icon} />
                      <span className="text-sm font-medium text-neutral-300">
                        {item.label}
                      </span>
                    </div>
                    <span className="h-2.5 w-2.5 rounded-full bg-gold-400/40" />
                  </div>
                ))}
              </div>

              {/* CTA button */}
              <div className="mt-6 flex justify-end">
                <span className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-5 py-2.5 text-sm font-semibold text-black">
                  {active.cta}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

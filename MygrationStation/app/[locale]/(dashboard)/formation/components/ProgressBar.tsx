"use client";

import { useTranslations } from "next-intl";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const STEP_KEYS = [
  "residency",
  "state",
  "businessName",
  "owners",
  "registeredAgent",
  "review",
  "payment",
  "confirmation",
] as const;

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const t = useTranslations("formation.steps");

  return (
    <div className="mb-8">
      {/* Mobile: simple bar + label */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gold-400">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-neutral-500">
            {t(STEP_KEYS[currentStep - 1] ?? "residency")}
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-800">
          <div
            className="h-full rounded-full bg-gold-400 transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop: step indicators */}
      <div className="hidden sm:block">
        <div className="flex items-center">
          {STEP_KEYS.map((key, index) => {
            const stepNum = index + 1;
            const isComplete = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <div key={key} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                      isComplete
                        ? "bg-gold-400 text-black"
                        : isCurrent
                          ? "border-2 border-gold-400 bg-gold-400/10 text-gold-400"
                          : "border border-neutral-700 bg-neutral-900 text-neutral-600"
                    }`}
                  >
                    {isComplete ? (
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      stepNum
                    )}
                  </div>
                  <span
                    className={`mt-1 text-[10px] leading-tight ${
                      isCurrent
                        ? "font-medium text-gold-400"
                        : isComplete
                          ? "text-neutral-400"
                          : "text-neutral-600"
                    }`}
                  >
                    {t(key)}
                  </span>
                </div>
                {index < STEP_KEYS.length - 1 && (
                  <div
                    className={`mx-1 h-0.5 flex-1 ${
                      isComplete ? "bg-gold-400" : "bg-neutral-800"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

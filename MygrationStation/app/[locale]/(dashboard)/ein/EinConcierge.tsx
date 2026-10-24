"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { createEinApplication, generateAndStoreSS4 } from "./actions";
import type { ResidencyStatus, EinStatus, EinPath } from "@/lib/supabase/database.types";

interface Business {
  id: string;
  name: string;
  state: string;
  formation_status: string;
  ein: string | null;
}

interface EinApplication {
  id: string;
  business_id: string;
  path: EinPath;
  status: EinStatus;
  created_at: string;
  fax_sent_at: string | null;
  ein_received_at: string | null;
}

interface Props {
  residencyStatus: ResidencyStatus;
  businesses: Business[];
  einApplications: EinApplication[];
}

const PATH_INFO: Record<EinPath, { title: string; description: string; icon: string }> = {
  online_self: {
    title: "Online (IRS Website)",
    description: "You have an SSN. Apply directly on the IRS website. MygrationStation can assist for $29.",
    icon: "🌐",
  },
  phone_assisted: {
    title: "Phone-Assisted",
    description: "You have an ITIN. MygrationStation calls the IRS international line (267-941-1099) as your authorized third-party designee.",
    icon: "📞",
  },
  fax_assisted: {
    title: "Fax-Assisted",
    description: "You don't have an SSN or ITIN. MygrationStation prepares your SS-4 form and faxes it to the IRS at 855-641-6935.",
    icon: "📠",
  },
};

const STATUS_STEPS: Record<EinStatus, { label: string; color: string }> = {
  pending_info: { label: "Gathering information", color: "bg-slate-300" },
  info_complete: { label: "Information complete", color: "bg-blue-500" },
  fax_sent: { label: "SS-4 faxed to IRS", color: "bg-amber-500" },
  received: { label: "EIN received!", color: "bg-green-500" },
  failed: { label: "Failed — contact support", color: "bg-red-500" },
};

export function EinConcierge({ residencyStatus, businesses, einApplications }: Props) {
  const common = useTranslations("common");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedBiz, setSelectedBiz] = useState(businesses[0]?.id ?? "");

  const einPath: EinPath =
    residencyStatus === "ssn_holder"
      ? "online_self"
      : residencyStatus === "itin_holder"
        ? "phone_assisted"
        : "fax_assisted";

  const pathInfo = PATH_INFO[einPath];

  // Find existing application for selected business
  const existingApp = einApplications.find((a) => a.business_id === selectedBiz);

  function handleStartApplication() {
    if (!selectedBiz) return;
    setError(null);
    startTransition(async () => {
      const result = await createEinApplication(selectedBiz);
      if (!result.success) {
        setError(result.error ?? "Failed to create application");
        return;
      }
      // If fax path, generate SS-4
      if (einPath === "fax_assisted" && result.applicationId) {
        const ss4Result = await generateAndStoreSS4(selectedBiz, result.applicationId);
        if (!ss4Result.success) {
          setError(ss4Result.error ?? "Failed to generate SS-4");
        }
      }
      window.location.reload();
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">EIN Concierge</h1>
      <p className="mt-1 text-sm text-slate-500">
        Obtain your Employer Identification Number (EIN) from the IRS.
      </p>

      {/* Path card */}
      <div className="mt-6 rounded-xl border-2 border-brand-200 bg-brand-50 p-5">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{pathInfo.icon}</span>
          <div>
            <h2 className="text-lg font-semibold text-brand-900">
              Your path: {pathInfo.title}
            </h2>
            <p className="mt-1 text-sm text-brand-700">{pathInfo.description}</p>
          </div>
        </div>
      </div>

      {/* All three paths explained */}
      <div className="mt-6 space-y-3">
        {(Object.entries(PATH_INFO) as Array<[EinPath, typeof PATH_INFO[EinPath]]>).map(
          ([path, info]) => (
            <div
              key={path}
              className={`rounded-lg border p-4 ${
                path === einPath
                  ? "border-brand-300 bg-brand-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{info.icon}</span>
                <h3 className="font-medium text-slate-900">{info.title}</h3>
                {path === einPath && (
                  <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white">
                    YOUR PATH
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-500">{info.description}</p>
            </div>
          )
        )}
      </div>

      {/* Business selector */}
      {businesses.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-900">Select business</h2>
          <select
            value={selectedBiz}
            onChange={(e) => setSelectedBiz(e.target.value)}
            className="mt-2 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm"
          >
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} LLC ({b.state}) — {b.ein ? "EIN assigned" : "No EIN"}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Existing application status */}
      {existingApp && (
        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-slate-900">Application Status</h3>
          <div className="mt-4">
            {/* Progress bar */}
            <div className="flex items-center gap-1">
              {(Object.keys(STATUS_STEPS) as EinStatus[]).map((status, idx) => {
                const step = STATUS_STEPS[status];
                const allStatuses = Object.keys(STATUS_STEPS) as EinStatus[];
                const currentIdx = allStatuses.indexOf(existingApp.status);
                const isComplete = idx <= currentIdx;
                const isCurrent = status === existingApp.status;

                return (
                  <div key={status} className="flex flex-1 flex-col items-center">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        isComplete ? step.color : "bg-slate-200"
                      } ${isCurrent ? "ring-2 ring-offset-2 ring-brand-500" : ""}`}
                    />
                    <span className="mt-1 text-[9px] text-slate-500">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
          {existingApp.fax_sent_at && (
            <p className="mt-3 text-sm text-slate-600">
              SS-4 faxed on {new Date(existingApp.fax_sent_at).toLocaleDateString()}. IRS typically responds within 4-6 weeks.
            </p>
          )}
          {existingApp.status === "received" && (
            <div className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              Your EIN has been received and securely stored in your document vault.
            </div>
          )}
        </div>
      )}

      {/* Start application */}
      {!existingApp && businesses.length > 0 && (
        <div className="mt-6">
          {error && (
            <div className="mb-3 rounded-lg bg-danger-50 p-3 text-sm text-danger-700">{error}</div>
          )}
          <Button onClick={handleStartApplication} loading={isPending}>
            Start EIN Application
          </Button>
        </div>
      )}

      {businesses.length === 0 && (
        <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-6 text-center">
          <p className="text-sm text-slate-500">
            You need to form an LLC first before applying for an EIN.
          </p>
        </div>
      )}

      <p className="prose-legal mt-8 text-center">{common("legalDisclaimer")}</p>
    </div>
  );
}

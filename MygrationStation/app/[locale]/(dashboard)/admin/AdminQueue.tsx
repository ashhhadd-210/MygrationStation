"use client";

import { useState, useTransition } from "react";
import { formatCents } from "@/lib/utils";
import {
  markFiledWithState,
  markFormationComplete,
  addAdminNote,
  enterEIN,
} from "./actions";

interface FormationTask {
  id: string;
  status: string;
  created_at: string;
  submitted_at: string | null;
  notes: string | null;
  state_fee_cents: number | null;
  business_id: string;
  businesses: {
    id: string;
    name: string;
    state: string;
    foreign_owned: boolean;
    user_id: string;
    users: {
      email: string;
      residency_status: string;
      lang_pref: string;
    } | null;
  } | null;
}

interface EinTask {
  id: string;
  path: string;
  status: string;
  created_at: string;
  notes: string | null;
  business_id: string;
  businesses: {
    id: string;
    name: string;
    state: string;
    users: {
      email: string;
      residency_status: string;
    } | null;
  } | null;
}

interface AdminQueueProps {
  formations: FormationTask[];
  einApplications: EinTask[];
}

export function AdminQueue({ formations, einApplications }: AdminQueueProps) {
  const [activeTab, setActiveTab] = useState<"formations" | "eins">(
    "formations"
  );

  return (
    <div className="mt-8">
      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
        <button
          onClick={() => setActiveTab("formations")}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
            activeTab === "formations"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Formation Queue
          {formations.length > 0 && (
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">
              {formations.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("eins")}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
            activeTab === "eins"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          EIN Queue
          {einApplications.length > 0 && (
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">
              {einApplications.length}
            </span>
          )}
        </button>
      </div>

      {/* Formation queue */}
      {activeTab === "formations" && (
        <div className="mt-5 space-y-3">
          {formations.length === 0 ? (
            <EmptyState message="No pending formations" />
          ) : (
            formations.map((task) => (
              <FormationCard key={task.id} task={task} />
            ))
          )}
        </div>
      )}

      {/* EIN queue */}
      {activeTab === "eins" && (
        <div className="mt-5 space-y-3">
          {einApplications.length === 0 ? (
            <EmptyState message="No pending EIN applications" />
          ) : (
            einApplications.map((task) => (
              <EinCard key={task.id} task={task} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="mt-3 text-sm text-slate-400">{message}</p>
    </div>
  );
}

function FormationCard({ task }: { task: FormationTask }) {
  const [expanded, setExpanded] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const biz = task.businesses;
  const user = biz?.users;

  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    submitted_to_mygrationstation: { bg: "bg-blue-50", text: "text-blue-700", label: "Submitted" },
    filed_with_state: { bg: "bg-amber-50", text: "text-amber-700", label: "Filed with State" },
    complete: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Complete" },
  };

  const status = statusConfig[task.status] ?? { bg: "bg-slate-50", text: "text-slate-600", label: task.status };

  function handleMarkFiled() {
    setError(null);
    startTransition(async () => {
      const result = await markFiledWithState(task.id);
      if (!result.success) setError(result.error ?? "Failed");
    });
  }

  function handleMarkComplete() {
    setError(null);
    startTransition(async () => {
      const result = await markFormationComplete(task.id, task.business_id);
      if (!result.success) setError(result.error ?? "Failed");
    });
  }

  function handleAddNote() {
    if (!noteText.trim()) return;
    setError(null);
    startTransition(async () => {
      const result = await addAdminNote("formation_applications", task.id, noteText.trim());
      if (result.success) {
        setNoteText("");
        setShowNoteInput(false);
      } else {
        setError(result.error ?? "Failed");
      }
    });
  }

  const submittedDate = task.submitted_at ?? task.created_at;
  const daysSince = Math.floor(
    (Date.now() - new Date(submittedDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div
        className="cursor-pointer p-5"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50">
              <svg className="h-5 w-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-semibold text-slate-900">
                  {biz?.name ?? "Unknown"} LLC
                </h3>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${status.bg} ${status.text}`}>
                  {status.label}
                </span>
                {biz?.foreign_owned && (
                  <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-purple-700">
                    Foreign-owned
                  </span>
                )}
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                <span>{biz?.state}</span>
                <span className="text-slate-300">|</span>
                <span>{user?.email ?? "No email"}</span>
                <span className="text-slate-300">|</span>
                <span className="capitalize">{user?.residency_status?.replace(/_/g, " ")}</span>
                {task.state_fee_cents ? (
                  <>
                    <span className="text-slate-300">|</span>
                    <span>{formatCents(task.state_fee_cents)} fee</span>
                  </>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-slate-400">{daysSince}d ago</p>
            </div>
            <svg
              className={`h-5 w-5 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-4 animate-slide-down">
          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Business ID</p>
              <p className="mt-1 font-mono text-xs text-slate-600">{task.business_id}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Language</p>
              <p className="mt-1 text-slate-600">{user?.lang_pref ?? "en"}</p>
            </div>
          </div>

          {task.notes && (
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Notes</p>
              <pre className="mt-1 whitespace-pre-wrap rounded-lg bg-white p-3 text-sm text-slate-600 border border-slate-200">
                {task.notes}
              </pre>
            </div>
          )}

          {error && (
            <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
          )}

          {/* Note input */}
          {showNoteInput && (
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Enter admin note..."
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
              />
              <button
                onClick={handleAddNote}
                disabled={isPending || !noteText.trim()}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
              >
                {isPending ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => { setShowNoteInput(false); setNoteText(""); }}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            {task.status === "submitted_to_mygrationstation" && (
              <button
                onClick={handleMarkFiled}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700 disabled:opacity-50 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                {isPending ? "Updating..." : "Mark Filed with State"}
              </button>
            )}
            {task.status === "filed_with_state" && (
              <button
                onClick={handleMarkComplete}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {isPending ? "Updating..." : "Mark Complete"}
              </button>
            )}
            {!showNoteInput && (
              <button
                onClick={() => setShowNoteInput(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                Add Note
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function EinCard({ task }: { task: EinTask }) {
  const [einValue, setEinValue] = useState("");
  const [showEinInput, setShowEinInput] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const biz = task.businesses;
  const user = biz?.users;

  const pathLabels: Record<string, { label: string; bg: string; text: string }> = {
    online_self: { label: "Online (SSN)", bg: "bg-emerald-50", text: "text-emerald-700" },
    phone_assisted: { label: "Phone (ITIN)", bg: "bg-blue-50", text: "text-blue-700" },
    fax_assisted: { label: "Fax (No SSN/ITIN)", bg: "bg-amber-50", text: "text-amber-700" },
  };

  const statusLabels: Record<string, { bg: string; text: string }> = {
    pending_info: { bg: "bg-slate-100", text: "text-slate-600" },
    info_complete: { bg: "bg-blue-50", text: "text-blue-700" },
    fax_sent: { bg: "bg-amber-50", text: "text-amber-700" },
    received: { bg: "bg-emerald-50", text: "text-emerald-700" },
  };

  const pathConfig = pathLabels[task.path] ?? { label: task.path, bg: "bg-slate-100", text: "text-slate-600" };
  const statusStyle = statusLabels[task.status] ?? { bg: "bg-slate-100", text: "text-slate-600" };

  function handleEnterEin() {
    if (!einValue.trim()) return;
    setError(null);
    startTransition(async () => {
      const result = await enterEIN(task.id, einValue.trim());
      if (result.success) {
        setEinValue("");
        setShowEinInput(false);
      } else {
        setError(result.error ?? "Failed");
      }
    });
  }

  function handleAddNote() {
    if (!noteText.trim()) return;
    setError(null);
    startTransition(async () => {
      const result = await addAdminNote("ein_applications", task.id, noteText.trim());
      if (result.success) {
        setNoteText("");
        setShowNoteInput(false);
      } else {
        setError(result.error ?? "Failed");
      }
    });
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50">
              <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-semibold text-slate-900">
                  {biz?.name ?? "Unknown"} LLC
                </h3>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${pathConfig.bg} ${pathConfig.text}`}>
                  {pathConfig.label}
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                  {task.status.replace(/_/g, " ")}
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-x-3 text-sm text-slate-500">
                <span>{biz?.state}</span>
                <span className="text-slate-300">|</span>
                <span>{user?.email ?? "No email"}</span>
                <span className="text-slate-300">|</span>
                <span className="capitalize">{user?.residency_status?.replace(/_/g, " ")}</span>
              </div>
            </div>
          </div>
        </div>

        {task.notes && (
          <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-xs text-slate-500 border border-slate-100">
            {task.notes}
          </pre>
        )}

        {error && (
          <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}

        {/* EIN input */}
        {showEinInput && (
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={einValue}
              onChange={(e) => setEinValue(e.target.value)}
              placeholder="XX-XXXXXXX"
              maxLength={10}
              className="w-40 rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              onKeyDown={(e) => e.key === "Enter" && handleEnterEin()}
            />
            <button
              onClick={handleEnterEin}
              disabled={isPending || !einValue.trim()}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save EIN"}
            </button>
            <button
              onClick={() => { setShowEinInput(false); setEinValue(""); }}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Note input */}
        {showNoteInput && (
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter admin note..."
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
            />
            <button
              onClick={handleAddNote}
              disabled={isPending || !noteText.trim()}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => { setShowNoteInput(false); setNoteText(""); }}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          {!showEinInput && (
            <button
              onClick={() => setShowEinInput(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
              Enter EIN
            </button>
          )}
          {!showNoteInput && (
            <button
              onClick={() => setShowNoteInput(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              Add Note
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

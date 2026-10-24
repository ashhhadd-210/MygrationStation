"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import type { ComplianceEventType, ComplianceStatus } from "@/lib/supabase/database.types";

interface ComplianceEvent {
  id: string;
  event_type: ComplianceEventType;
  due_date: string;
  status: ComplianceStatus;
  completed_at: string | null;
  notes: string | null;
  business_id: string;
  businesses: {
    name: string;
    state: string;
  } | null;
}

interface ComplianceCalendarProps {
  events: ComplianceEvent[];
}

const STATUS_COLORS: Record<ComplianceStatus, { bg: string; text: string; dot: string }> = {
  overdue: { bg: "bg-red-50 border-red-200", text: "text-red-700", dot: "bg-red-500" },
  due_soon: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", dot: "bg-amber-500" },
  upcoming: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", dot: "bg-blue-500" },
  complete: { bg: "bg-green-50 border-green-200", text: "text-green-700", dot: "bg-green-500" },
  not_applicable: { bg: "bg-slate-50 border-slate-200", text: "text-slate-400", dot: "bg-slate-300" },
};

const PENALTIES: Record<string, string> = {
  boi_report: "Up to $500/day, max $10,000. Criminal penalties possible.",
  form_5472: "$25,000 penalty per form for failure to file or maintain records.",
  quarterly_estimated_tax_q1: "Underpayment penalty + interest on amount owed.",
  quarterly_estimated_tax_q2: "Underpayment penalty + interest on amount owed.",
  quarterly_estimated_tax_q3: "Underpayment penalty + interest on amount owed.",
  quarterly_estimated_tax_q4: "Underpayment penalty + interest on amount owed.",
  annual_state_report: "Late fees vary by state. LLC may be administratively dissolved.",
  registered_agent_renewal: "Loss of registered agent may result in missed legal notices.",
  itin_renewal: "Expired ITIN delays tax return processing and refunds.",
};

export function ComplianceCalendar({ events }: ComplianceCalendarProps) {
  const t = useTranslations("compliance");
  const [view, setView] = useState<"list" | "month">("list");
  const [statusFilter, setStatusFilter] = useState<ComplianceStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Update statuses based on current date
  const processedEvents = useMemo(() => {
    const now = new Date();
    return events.map((e) => {
      if (e.status === "complete" || e.status === "not_applicable") return e;
      const due = new Date(e.due_date);
      const daysUntil = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      let status = e.status;
      if (daysUntil < 0) status = "overdue";
      else if (daysUntil <= 30) status = "due_soon";
      else status = "upcoming";
      return { ...e, status };
    });
  }, [events]);

  const filtered = statusFilter === "all"
    ? processedEvents
    : processedEvents.filter((e) => e.status === statusFilter);

  const overdue = processedEvents.filter((e) => e.status === "overdue").length;
  const dueSoon = processedEvents.filter((e) => e.status === "due_soon").length;
  const upcoming = processedEvents.filter((e) => e.status === "upcoming").length;
  const completed = processedEvents.filter((e) => e.status === "complete").length;

  return (
    <div className="mt-6">
      {/* Status summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatusPill
          label={t("overdue")}
          count={overdue}
          color="red"
          active={statusFilter === "overdue"}
          onClick={() => setStatusFilter(statusFilter === "overdue" ? "all" : "overdue")}
        />
        <StatusPill
          label={t("dueSoon")}
          count={dueSoon}
          color="amber"
          active={statusFilter === "due_soon"}
          onClick={() => setStatusFilter(statusFilter === "due_soon" ? "all" : "due_soon")}
        />
        <StatusPill
          label={t("upcoming")}
          count={upcoming}
          color="blue"
          active={statusFilter === "upcoming"}
          onClick={() => setStatusFilter(statusFilter === "upcoming" ? "all" : "upcoming")}
        />
        <StatusPill
          label={t("completed")}
          count={completed}
          color="green"
          active={statusFilter === "complete"}
          onClick={() => setStatusFilter(statusFilter === "complete" ? "all" : "complete")}
        />
      </div>

      {/* View toggle */}
      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          {statusFilter === "all" ? "All events" : t(statusFilter)}
        </h2>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-0.5">
          <button
            onClick={() => setView("list")}
            className={`rounded-md px-3 py-1 text-xs font-medium ${
              view === "list" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"
            }`}
          >
            {t("listView")}
          </button>
          <button
            onClick={() => setView("month")}
            className={`rounded-md px-3 py-1 text-xs font-medium ${
              view === "month" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"
            }`}
          >
            {t("monthView")}
          </button>
        </div>
      </div>

      {/* List view */}
      {view === "list" && (
        <div className="mt-4 space-y-2">
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-400">
              No compliance events found
            </p>
          ) : (
            filtered.map((event) => {
              const colors = STATUS_COLORS[event.status];
              const isExpanded = expandedId === event.id;
              const daysUntil = Math.ceil(
                (new Date(event.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div key={event.id}>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : event.id)}
                    className={`w-full rounded-lg border p-4 text-start transition-colors ${colors.bg}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`h-2.5 w-2.5 rounded-full ${colors.dot}`} />
                        <div>
                          <p className={`font-medium ${colors.text}`}>
                            {t(`eventTypes.${event.event_type}` as Parameters<typeof t>[0])}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {event.businesses?.name ?? "Unknown"} LLC ({event.businesses?.state})
                          </p>
                        </div>
                      </div>
                      <div className="text-end">
                        <p className="text-sm font-semibold text-slate-700">
                          {event.due_date}
                        </p>
                        <p className={`text-xs ${colors.text}`}>
                          {event.status === "complete"
                            ? "Completed"
                            : daysUntil < 0
                              ? `${Math.abs(daysUntil)} days overdue`
                              : daysUntil === 0
                                ? "Due today"
                                : `${daysUntil} days remaining`}
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="mx-2 rounded-b-lg border border-t-0 border-slate-200 bg-white p-4 animate-slide-down">
                      <div className="grid gap-3 text-sm sm:grid-cols-2">
                        <div>
                          <p className="text-xs font-medium text-slate-400">{t("penalty")}</p>
                          <p className="mt-0.5 text-slate-700">
                            {PENALTIES[event.event_type] ?? "Varies. Consult your tax professional."}
                          </p>
                        </div>
                        {event.notes && (
                          <div>
                            <p className="text-xs font-medium text-slate-400">Notes</p>
                            <p className="mt-0.5 text-slate-700">{event.notes}</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button className="rounded-lg bg-brand-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-brand-700">
                          {t("prepKit")}
                        </button>
                        <button className="rounded-lg border border-brand-300 bg-brand-50 px-4 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-100">
                          {t("fileWithMygrationStation")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Month view */}
      {view === "month" && <MonthView events={filtered} />}
    </div>
  );
}

function MonthView({ events }: { events: ComplianceEvent[] }) {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const monthName = new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" });

  // Events grouped by day
  const eventsByDay = new Map<number, ComplianceEvent[]>();
  for (const event of events) {
    const d = new Date(event.due_date);
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      const day = d.getDate();
      const existing = eventsByDay.get(day) ?? [];
      existing.push(event);
      eventsByDay.set(day, existing);
    }
  }

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="rounded-lg p-2 hover:bg-slate-100">
          <svg className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-lg font-semibold text-slate-900">
          {monthName} {currentYear}
        </h3>
        <button onClick={nextMonth} className="rounded-lg p-2 hover:bg-slate-100">
          <svg className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar grid */}
      <div className="mt-4 grid grid-cols-7 gap-px rounded-lg border border-slate-200 bg-slate-200 overflow-hidden">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="bg-slate-50 px-2 py-2 text-center text-xs font-medium text-slate-500">
            {day}
          </div>
        ))}
        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-white p-2" />
        ))}
        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayEvents = eventsByDay.get(day) ?? [];
          const isToday =
            day === now.getDate() &&
            currentMonth === now.getMonth() &&
            currentYear === now.getFullYear();

          return (
            <div
              key={day}
              className={`min-h-[72px] bg-white p-1.5 ${isToday ? "ring-2 ring-inset ring-brand-500" : ""}`}
            >
              <span
                className={`text-xs ${
                  isToday ? "font-bold text-brand-600" : "text-slate-600"
                }`}
              >
                {day}
              </span>
              <div className="mt-0.5 space-y-0.5">
                {dayEvents.slice(0, 2).map((e) => {
                  const colors = STATUS_COLORS[e.status];
                  return (
                    <div
                      key={e.id}
                      className={`flex items-center gap-1 rounded px-1 py-0.5 ${colors.bg}`}
                      title={e.event_type.replace(/_/g, " ")}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
                      <span className={`truncate text-[9px] font-medium ${colors.text}`}>
                        {e.event_type.replace(/_/g, " ").slice(0, 15)}
                      </span>
                    </div>
                  );
                })}
                {dayEvents.length > 2 && (
                  <span className="text-[9px] text-slate-400">
                    +{dayEvents.length - 2} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatusPill({
  label,
  count,
  color,
  active,
  onClick,
}: {
  label: string;
  count: number;
  color: "red" | "amber" | "blue" | "green";
  active: boolean;
  onClick: () => void;
}) {
  const colors = {
    red: active ? "bg-red-100 border-red-300 text-red-700" : "bg-red-50 border-red-100 text-red-600",
    amber: active ? "bg-amber-100 border-amber-300 text-amber-700" : "bg-amber-50 border-amber-100 text-amber-600",
    blue: active ? "bg-blue-100 border-blue-300 text-blue-700" : "bg-blue-50 border-blue-100 text-blue-600",
    green: active ? "bg-green-100 border-green-300 text-green-700" : "bg-green-50 border-green-100 text-green-600",
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-lg border px-3 py-2 text-center transition-colors ${colors[color]}`}
    >
      <p className="text-xl font-bold">{count}</p>
      <p className="text-[10px] font-medium">{label}</p>
    </button>
  );
}

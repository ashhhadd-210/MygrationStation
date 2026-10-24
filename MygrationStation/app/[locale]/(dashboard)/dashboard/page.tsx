import { getTranslations, setRequestLocale } from "next-intl/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function DashboardPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const t = await getTranslations("dashboard");
  const common = await getTranslations("common");

  const { data: businesses, error: bizError } = await supabase
    .from("businesses")
    .select("id, name, state, formation_status, foreign_owned, created_at")
    .order("created_at", { ascending: false });

  const { data: complianceEvents, error: compError } = await supabase
    .from("compliance_events")
    .select("id, event_type, due_date, status, business_id")
    .in("status", ["upcoming", "due_soon", "overdue"])
    .order("due_date", { ascending: true })
    .limit(5);

  if (bizError || compError) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-red-500/20 bg-red-900/20 p-6 text-center">
          <p className="text-sm text-red-400">
            Something went wrong loading your dashboard. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  const hasBusiness = businesses && businesses.length > 0;

  return (
    <div className="mx-auto max-w-5xl">
      {/* Welcome header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-white">
            {t("welcome", { email: user?.email ?? "" })}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Here&apos;s what&apos;s happening with your business
          </p>
        </div>
        {!hasBusiness && (
          <Link
            href="/formation"
            className="inline-flex items-center gap-2 rounded-xl bg-gold-400 px-5 py-2.5 text-sm font-semibold text-black shadow-sm transition-all hover:bg-gold-300 hover:shadow-md"
          >
            {t("startFormation")}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        )}
      </div>

      {/* Active business cards */}
      {hasBusiness && (
        <div className="mt-6 space-y-3">
          {businesses.map((biz) => (
            <div key={biz.id} className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-neutral-900/80 p-5 transition-all hover:border-white/10">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-400/10">
                  <svg className="h-5 w-5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{biz.name} LLC</h3>
                  <div className="mt-0.5 flex items-center gap-2 text-sm text-neutral-500">
                    <span>{biz.state}</span>
                    {biz.foreign_owned && (<><span className="text-neutral-700">&middot;</span><span>Foreign-owned</span></>)}
                  </div>
                </div>
              </div>
              <StatusBadge status={biz.formation_status} />
            </div>
          ))}
        </div>
      )}

      {/* Compliance alerts */}
      {complianceEvents && complianceEvents.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Upcoming Deadlines</h2>
            <Link href="/compliance" className="text-sm font-medium text-gold-400 hover:text-gold-300">View all</Link>
          </div>
          <div className="mt-3 space-y-2">
            {complianceEvents.map((event) => {
              const statusColors: Record<string, string> = {
                overdue: "border-red-500/20 bg-red-900/20",
                due_soon: "border-amber-500/20 bg-amber-900/20",
                upcoming: "border-white/[0.06] bg-neutral-900/80",
              };
              const dotColors: Record<string, string> = {
                overdue: "bg-red-500",
                due_soon: "bg-amber-500",
                upcoming: "bg-blue-500",
              };
              return (
                <div key={event.id} className={`flex items-center justify-between rounded-xl border p-4 ${statusColors[event.status] ?? "border-white/[0.06] bg-neutral-900/80"}`}>
                  <div className="flex items-center gap-3">
                    <span className={`h-2 w-2 rounded-full ${dotColors[event.status] ?? "bg-neutral-500"}`} />
                    <span className="text-sm font-medium text-neutral-300">{event.event_type.replace(/_/g, " ")}</span>
                  </div>
                  <span className="text-sm text-neutral-500">{event.due_date}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick action cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ActionCard href="/formation" title={t("formYourLLC")} description={t("formYourLLCDescription")} iconColor="text-gold-400" icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>} />
        <ActionCard href="/documents" title={t("viewDocuments")} description={t("viewDocumentsDescription")} iconColor="text-blue-400" icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>} />
        <ActionCard href="/compliance" title={t("complianceCalendar")} description={t("complianceCalendarDescription")} iconColor="text-amber-400" icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>} />
        <ActionCard href="/banking" title={t("openBankAccount")} description={t("openBankAccountDescription")} iconColor="text-emerald-400" icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>} />
      </div>

      {/* No business CTA */}
      {!hasBusiness && (
        <div className="mt-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-400/10">
            <svg className="h-8 w-8 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <p className="mt-4 text-neutral-500">{t("noBusiness")}</p>
          <Link href="/formation" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gold-400 px-6 py-3 text-sm font-semibold text-black shadow-sm hover:bg-gold-300 hover:shadow-md">
            {t("startFormation")}
          </Link>
        </div>
      )}

      <p className="prose-legal mt-12 text-center">{common("legalDisclaimer")}</p>
    </div>
  );
}

function ActionCard({ href, title, description, icon, iconColor }: { href: string; title: string; description: string; icon: React.ReactNode; iconColor: string }) {
  return (
    <Link href={href} className="group block rounded-2xl border border-white/[0.06] bg-neutral-900/80 p-5 transition-all duration-200 hover:border-white/10">
      <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-800 ${iconColor}`}>{icon}</div>
      <h3 className="font-semibold text-white group-hover:text-gold-400 transition-colors">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{description}</p>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; dot: string }> = {
    draft: { bg: "bg-neutral-800", text: "text-neutral-400", dot: "bg-neutral-500" },
    submitted: { bg: "bg-blue-900/30", text: "text-blue-400", dot: "bg-blue-500" },
    filed: { bg: "bg-amber-900/30", text: "text-amber-400", dot: "bg-amber-500" },
    complete: { bg: "bg-emerald-900/30", text: "text-emerald-400", dot: "bg-emerald-500" },
  };
  const style = styles[status] ?? styles.draft!;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${style!.bg} ${style!.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style!.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

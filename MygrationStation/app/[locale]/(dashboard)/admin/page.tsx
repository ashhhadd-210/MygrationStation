import { setRequestLocale } from "next-intl/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "@/i18n/navigation";
import { AdminQueue } from "./AdminQueue";

interface PageProps {
  params: Promise<{ locale: string }>;
}

/**
 * Admin dashboard — accessible only to users with admin role.
 * For v1, admin detection is done by checking a hardcoded list of admin emails.
 * In v2, this moves to Supabase custom claims or a roles table.
 */
const ADMIN_EMAILS = [
  "admin@mygrationstation.com",
  "demo@mygrationstation.com",
];

export default async function AdminPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    redirect({ href: "/dashboard", locale });
    return null;
  }

  // Fetch pending formation applications
  const { data: pendingFormations } = await supabase
    .from("formation_applications")
    .select(
      `
      id,
      status,
      created_at,
      submitted_at,
      notes,
      state_fee_cents,
      business_id,
      businesses (
        id,
        name,
        state,
        foreign_owned,
        user_id,
        users (
          email,
          residency_status,
          lang_pref
        )
      )
    `
    )
    .in("status", ["submitted_to_mygrationstation", "filed_with_state"])
    .order("created_at", { ascending: true });

  // Fetch pending EIN applications
  const { data: pendingEins } = await supabase
    .from("ein_applications")
    .select(
      `
      id,
      path,
      status,
      created_at,
      notes,
      business_id,
      businesses (
        id,
        name,
        state,
        users (
          email,
          residency_status
        )
      )
    `
    )
    .in("status", ["pending_info", "info_complete", "fax_sent"])
    .order("created_at", { ascending: true });

  // Stats
  const { count: totalFormations } = await supabase
    .from("formation_applications")
    .select("id", { count: "exact", head: true });

  const { count: totalUsers } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true });

  const { count: completedFormations } = await supabase
    .from("formation_applications")
    .select("id", { count: "exact", head: true })
    .eq("status", "complete");

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Manage formation and EIN applications</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50">
          <svg className="h-5 w-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <StatCard label="Total Users" value={totalUsers ?? 0} icon="users" />
        <StatCard label="Total Formations" value={totalFormations ?? 0} icon="file" />
        <StatCard label="Completed" value={completedFormations ?? 0} icon="check" />
        <StatCard
          label="Pending Queue"
          value={pendingFormations?.length ?? 0}
          icon="clock"
          highlight
        />
      </div>

      {/* Formation Queue */}
      <AdminQueue
        formations={pendingFormations ?? []}
        einApplications={pendingEins ?? []}
      />
    </div>
  );
}

const STAT_ICONS: Record<string, React.ReactNode> = {
  users: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  file: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  check: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  clock: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

function StatCard({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string;
  value: number;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 transition-all ${
        highlight
          ? "border-brand-200 bg-brand-50/50 shadow-card"
          : "border-slate-100 bg-white shadow-card"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-slate-500">{label}</p>
        <div className={`${highlight ? "text-brand-600" : "text-slate-400"}`}>
          {STAT_ICONS[icon]}
        </div>
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
    </div>
  );
}

import { getTranslations, setRequestLocale } from "next-intl/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ComplianceCalendar } from "./ComplianceCalendar";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function CompliancePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const t = await getTranslations("compliance");
  const common = await getTranslations("common");

  // Fetch all compliance events for user's businesses
  const { data: events } = await supabase
    .from("compliance_events")
    .select(
      `
      id,
      event_type,
      due_date,
      status,
      completed_at,
      notes,
      business_id,
      businesses (
        name,
        state
      )
    `
    )
    .order("due_date", { ascending: true });

  // Fetch user's businesses for context
  const { data: _businesses } = await supabase
    .from("businesses")
    .select("id, name, state, foreign_owned")
    .eq("user_id", user.id);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
      <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>

      <ComplianceCalendar events={events ?? []} />

      <p className="prose-legal mt-8 text-center">{common("legalDisclaimer")}</p>
    </div>
  );
}

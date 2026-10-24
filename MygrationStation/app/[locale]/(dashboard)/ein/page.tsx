import { setRequestLocale } from "next-intl/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { EinConcierge } from "./EinConcierge";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function EinPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: userProfile } = await supabase
    .from("users")
    .select("residency_status")
    .eq("id", user.id)
    .single();

  const { data: businesses } = await supabase
    .from("businesses")
    .select("id, name, state, formation_status, ein")
    .eq("user_id", user.id)
    .in("formation_status", ["submitted", "filed", "complete"]);

  const businessIds = (businesses ?? []).map((b) => b.id);
  const { data: einApps } = businessIds.length > 0
    ? await supabase
        .from("ein_applications")
        .select("*")
        .in("business_id", businessIds)
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div className="mx-auto max-w-3xl">
      <EinConcierge
        residencyStatus={userProfile?.residency_status ?? "itin_holder"}
        businesses={businesses ?? []}
        einApplications={einApps ?? []}
      />
    </div>
  );
}

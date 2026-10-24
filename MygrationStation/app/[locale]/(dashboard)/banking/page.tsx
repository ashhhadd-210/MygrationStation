import { setRequestLocale } from "next-intl/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { BankingProfiler } from "./BankingProfiler";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function BankingPage({ params }: PageProps) {
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
    .select("id, name, state, ein")
    .eq("user_id", user.id);

  const { data: bankingApps } = await supabase
    .from("banking_applications")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <BankingProfiler
      residencyStatus={userProfile?.residency_status ?? "itin_holder"}
      businesses={businesses ?? []}
      existingApplications={bankingApps ?? []}
    />
  );
}

import { getTranslations, setRequestLocale } from "next-intl/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DocumentVault } from "./DocumentVault";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function DocumentsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const t = await getTranslations("documents");
  const common = await getTranslations("common");

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: businesses } = await supabase
    .from("businesses")
    .select("id, name")
    .eq("user_id", user.id);

  const { data: profile } = await supabase
    .from("users")
    .select("residency_status")
    .eq("id", user.id)
    .single();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
          <p className="mt-1 text-sm text-neutral-400">{t("subtitle")}</p>
        </div>
      </div>

      <DocumentVault
        documents={documents ?? []}
        businesses={businesses ?? []}
        residencyStatus={profile?.residency_status ?? "non_resident"}
      />

      <p className="prose-legal mt-8 text-center">{common("legalDisclaimer")}</p>
    </div>
  );
}

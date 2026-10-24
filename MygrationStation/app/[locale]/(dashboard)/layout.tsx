import { getTranslations, setRequestLocale } from "next-intl/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "@/i18n/navigation";
import { DashboardShell } from "./DashboardShell";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/login", locale });
    return null;
  }

  // Fetch user profile for the sidebar
  const { data: profile } = await supabase
    .from("users")
    .select("email, lang_pref, residency_status")
    .eq("id", user.id)
    .single();

  const t = await getTranslations("nav");

  const navItems = [
    { href: "/dashboard", label: t("dashboard"), icon: "home" },
    { href: "/formation", label: t("formation"), icon: "file-text" },
    { href: "/ein", label: t("einConcierge"), icon: "file-text" },
    { href: "/documents", label: t("documents"), icon: "folder" },
    { href: "/compliance", label: t("compliance"), icon: "calendar" },
    { href: "/banking", label: t("banking"), icon: "building" },
    { href: "/settings", label: t("settings"), icon: "settings" },
  ];

  return (
    <DashboardShell
      email={profile?.email ?? user.email ?? ""}
      navItems={navItems}
      signOutLabel={t("signOut")}
    >
      {children}
    </DashboardShell>
  );
}

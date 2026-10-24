"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { localeNames, type Locale } from "@/i18n/config";

export default function SettingsPage() {
  const common = useTranslations("common");
  const router = useRouter();

  const [langPref, setLangPref] = useState<Locale>("en");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    startTransition(async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("users").update({ lang_pref: langPref }).eq("id", user.id);
      document.cookie = `NEXT_LOCALE=${langPref};path=/;max-age=31536000`;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  async function handleDeleteAccount() {
    if (!confirm("Are you sure you want to delete your account? This action is irreversible and will delete all your data.")) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-serif text-2xl font-bold text-white">Settings</h1>

      {/* Language */}
      <div className="mt-8 rounded-2xl border border-white/[0.06] bg-neutral-900/80 p-6">
        <h2 className="text-lg font-semibold text-white">Language Preference</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Change the language for all communications and the interface.
        </p>
        <select
          value={langPref}
          onChange={(e) => setLangPref(e.target.value as Locale)}
          className="mt-3 block w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-white focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
        >
          {Object.entries(localeNames).map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>
        <div className="mt-4 flex items-center gap-3">
          <Button onClick={handleSave} loading={isPending}>{common("save")}</Button>
          {saved && <span className="text-sm text-emerald-400">Saved!</span>}
        </div>
      </div>

      {/* Privacy */}
      <div className="mt-6 rounded-2xl border border-white/[0.06] bg-neutral-900/80 p-6">
        <h2 className="text-lg font-semibold text-white">Privacy</h2>
        <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-900/20 p-4">
          <p className="text-sm text-emerald-400">{common("privacyPledge")}</p>
        </div>
      </div>

      {/* Danger zone */}
      <div className="mt-6 rounded-2xl border-2 border-red-500/30 bg-red-900/10 p-6">
        <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
        <p className="mt-1 text-sm text-red-400/70">
          Deleting your account removes all data, documents, and business records permanently.
        </p>
        <Button variant="danger" size="sm" className="mt-4" onClick={handleDeleteAccount}>
          Delete my account
        </Button>
      </div>

      <p className="prose-legal mt-8 text-center">{common("legalDisclaimer")}</p>
    </div>
  );
}

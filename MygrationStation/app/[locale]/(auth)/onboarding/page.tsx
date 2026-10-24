"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { localeNames, type Locale } from "@/i18n/config";

export default function OnboardingPage() {
  const t = useTranslations("onboarding");
  const common = useTranslations("common");
  const router = useRouter();

  const [countryOfBirth, setCountryOfBirth] = useState("");
  const [langPref, setLangPref] = useState<Locale>("en");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { error: updateError } = await supabase
        .from("users")
        .update({ country_of_birth: countryOfBirth || null, lang_pref: langPref })
        .eq("id", user.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      document.cookie = `NEXT_LOCALE=${langPref};path=/;max-age=31536000`;
      router.push("/dashboard");
    } catch {
      setError(common("errorGeneric"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/[0.06] bg-neutral-900/80 p-8">
          <h2 className="font-serif text-2xl font-bold text-white">{t("title")}</h2>
          <p className="mt-1 text-sm text-neutral-400">{t("subtitle")}</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-neutral-300">{t("countryOfBirth")}</label>
              <p className="mt-0.5 text-xs text-neutral-500">{t("countryOfBirthDescription")}</p>
              <input id="country" type="text" value={countryOfBirth} onChange={(e) => setCountryOfBirth(e.target.value)} placeholder="Mexico, China, India, Philippines..." className="mt-1 block w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-white placeholder:text-neutral-500 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20" />
            </div>

            <div>
              <label htmlFor="langPref" className="block text-sm font-medium text-neutral-300">{t("confirmLanguage")}</label>
              <p className="mt-0.5 text-xs text-neutral-500">{t("confirmLanguageDescription")}</p>
              <select id="langPref" value={langPref} onChange={(e) => setLangPref(e.target.value as Locale)} className="mt-1 block w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-white focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20">
                {Object.entries(localeNames).map(([code, name]) => (<option key={code} value={code}>{name}</option>))}
              </select>
            </div>

            {error && (<div className="rounded-xl border border-red-500/20 bg-red-900/20 p-3 text-sm text-red-400">{error}</div>)}

            <button type="submit" disabled={isLoading} className="w-full rounded-xl bg-gold-400 py-2.5 text-sm font-semibold text-black shadow-sm transition-all hover:bg-gold-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50">
              {isLoading ? common("loading") : t("letsGetStarted")}
            </button>
          </form>
        </div>
        <p className="prose-legal mt-4 text-center">{common("privacyPledge")}</p>
      </div>
    </div>
  );
}

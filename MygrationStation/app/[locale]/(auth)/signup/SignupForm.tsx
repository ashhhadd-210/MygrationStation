"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/Logo";
import type { ResidencyStatus } from "@/lib/supabase/database.types";
import { localeNames, type Locale } from "@/i18n/config";

export function SignupForm() {
  const t = useTranslations("auth");
  const common = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [residencyStatus, setResidencyStatus] =
    useState<ResidencyStatus>("itin_holder");
  const [langPref, setLangPref] = useState<Locale>("en");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();

      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            residency_status: residencyStatus,
            lang_pref: langPref,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.push(`/${locale}/onboarding`);
      router.refresh();
    } catch {
      setError(common("errorGeneric"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-neutral-900/80 p-8">
          <h2 className="font-serif text-2xl font-bold text-white">{t("signUp")}</h2>
          <p className="mt-1 text-sm text-neutral-400">{common("tagline")}</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300">{t("email")}</label>
              <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("emailPlaceholder")} className="mt-1 block w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-white placeholder:text-neutral-500 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300">Password</label>
              <input id="password" type="password" required minLength={6} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password (min 6 characters)" className="mt-1 block w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-white placeholder:text-neutral-500 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20" />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300">{t("residencyStatus")}</label>
              <p className="mt-0.5 text-xs text-neutral-500">{t("residencyStatusDescription")}</p>
              <div className="mt-3 space-y-2">
                {(["ssn_holder", "itin_holder", "non_resident"] as const).map((status) => (
                  <label key={status} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${residencyStatus === status ? "border-gold-400/40 bg-gold-400/10" : "border-neutral-700 hover:border-neutral-600"}`}>
                    <input type="radio" name="residencyStatus" value={status} checked={residencyStatus === status} onChange={() => setResidencyStatus(status)} className="mt-0.5 h-4 w-4 border-neutral-600 text-gold-400 focus:ring-gold-400" />
                    <span className="text-sm text-neutral-300">{t(`residencyOptions.${status}`)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="langPref" className="block text-sm font-medium text-neutral-300">{t("languagePreference")}</label>
              <select id="langPref" value={langPref} onChange={(e) => setLangPref(e.target.value as Locale)} className="mt-1 block w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-white focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20">
                {Object.entries(localeNames).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-900/20 p-3">
              <p className="flex items-start gap-2 text-xs text-emerald-400">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>
                {t("privacyNotice")}
              </p>
            </div>

            {error && (<div className="rounded-xl border border-red-500/20 bg-red-900/20 p-3 text-sm text-red-400">{error}</div>)}

            <button type="submit" disabled={isLoading || !email || !password} className="w-full rounded-xl bg-gold-400 py-2.5 text-sm font-semibold text-black shadow-sm transition-all hover:bg-gold-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50">
              {isLoading ? common("loading") : t("signUp")}
            </button>

            <p className="text-center text-xs text-neutral-600">{t("termsAgreement")}</p>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">
            {t("hasAccount")}{" "}
            <Link href="/login" className="font-medium text-gold-400 hover:text-gold-300">{t("signIn")}</Link>
          </p>
        </div>

        <div className="mt-6 space-y-2">
          <p className="text-center text-xs text-neutral-600">{common("privacyPledge")}</p>
          <p className="prose-legal text-center">{common("legalDisclaimer")}</p>
        </div>
      </div>
    </div>
  );
}

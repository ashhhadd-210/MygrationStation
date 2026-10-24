"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/Logo";

export function LoginForm() {
  const t = useTranslations("auth");
  const common = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      router.push(`/${locale}/dashboard`);
      router.refresh();
    } catch {
      setError(common("errorGeneric"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-neutral-900/80 p-8">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold text-white">Welcome back</h2>
            <p className="mt-1 text-sm text-neutral-400">
              Sign in to your MygrationStation account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300">
                {t("email")}
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                className="mt-1.5 block w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-white placeholder:text-neutral-500 transition-colors focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1.5 block w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-white placeholder:text-neutral-500 transition-colors focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-900/20 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full rounded-xl bg-gold-400 py-2.5 text-sm font-semibold text-black shadow-sm transition-all hover:bg-gold-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? common("loading") : t("signIn")}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-500">
              {t("noAccount")}{" "}
              <Link href="/signup" className="font-medium text-gold-400 hover:text-gold-300">
                {t("signUp")}
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <p className="text-center text-xs text-neutral-600">{t("privacyNotice")}</p>
          <p className="prose-legal text-center">{common("legalDisclaimer")}</p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { localeNames, type Locale } from "@/i18n/config";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newLocale = e.target.value as Locale;
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <select
      value={locale}
      onChange={handleChange}
      className="rounded-lg border border-neutral-700 bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:border-neutral-500 focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 focus:outline-none"
      aria-label="Select language"
    >
      {Object.entries(localeNames).map(([code, name]) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select>
  );
}

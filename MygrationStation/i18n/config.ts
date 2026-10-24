export const locales = [
  "en",
  "es",
  "zh",
  "tl",
  "vi",
  "ar",
  "fr",
  "ko",
  "pt",
  "hi",
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const rtlLocales: ReadonlyArray<Locale> = ["ar"] as const;

export function isRtlLocale(locale: Locale): boolean {
  return (rtlLocales as ReadonlyArray<string>).includes(locale);
}

export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  zh: "中文",
  tl: "Tagalog",
  vi: "Tiếng Việt",
  ar: "العربية",
  fr: "Français",
  ko: "한국어",
  pt: "Português",
  hi: "हिन्दी",
};

/**
 * Map locale to the primary country/region for date/number formatting.
 */
export const localeToRegion: Record<Locale, string> = {
  en: "en-US",
  es: "es-MX",
  zh: "zh-CN",
  tl: "tl-PH",
  vi: "vi-VN",
  ar: "ar-SA",
  fr: "fr-FR",
  ko: "ko-KR",
  pt: "pt-BR",
  hi: "hi-IN",
};

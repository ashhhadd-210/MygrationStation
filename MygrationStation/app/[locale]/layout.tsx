import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, isRtlLocale, type Locale } from "@/i18n/config";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: {
    default: "MygrationStation — Start Your US Business Without an SSN",
    template: "%s | MygrationStation",
  },
  description:
    "Form a US LLC, get an EIN without an SSN, and manage compliance — all in your language. Built for immigrants, ITIN holders, and non-resident founders.",
  keywords: [
    "LLC formation",
    "EIN without SSN",
    "ITIN LLC",
    "immigrant business",
    "non-resident LLC",
    "foreign-owned LLC",
    "US business formation",
  ],
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = isRtlLocale(locale as Locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800&display=swap"
          rel="stylesheet"
        />
        {dir === "rtl" && (
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
        )}
      </head>
      <body className="min-h-screen bg-white font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

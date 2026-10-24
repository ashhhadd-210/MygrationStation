"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Link, useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Logo } from "@/components/ui/Logo";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

interface DashboardShellProps {
  children: React.ReactNode;
  email: string;
  navItems: NavItem[];
  signOutLabel: string;
}

const ICONS: Record<string, (active: boolean) => React.ReactNode> = {
  home: (active) => (
    <svg className={`h-[18px] w-[18px] ${active ? "text-gold-400" : "text-neutral-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  "file-text": (active) => (
    <svg className={`h-[18px] w-[18px] ${active ? "text-gold-400" : "text-neutral-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  folder: (active) => (
    <svg className={`h-[18px] w-[18px] ${active ? "text-gold-400" : "text-neutral-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
  ),
  calendar: (active) => (
    <svg className={`h-[18px] w-[18px] ${active ? "text-gold-400" : "text-neutral-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  ),
  building: (active) => (
    <svg className={`h-[18px] w-[18px] ${active ? "text-gold-400" : "text-neutral-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
  ),
  settings: (active) => (
    <svg className={`h-[18px] w-[18px] ${active ? "text-gold-400" : "text-neutral-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

export function DashboardShell({ children, email, navItems, signOutLabel }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  function isActive(href: string): boolean {
    const segments = pathname.split("/").filter(Boolean);
    const pathWithoutLocale = "/" + segments.slice(1).join("/");
    return pathWithoutLocale === href || pathWithoutLocale.startsWith(href + "/");
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* Desktop sidebar */}
      <aside className="hidden w-[260px] flex-shrink-0 border-r border-white/[0.06] bg-neutral-950 lg:flex lg:flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center px-5">
          <Logo size="sm" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 px-3 py-3">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150 ${
                  active
                    ? "bg-gold-400/10 text-gold-400"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                {ICONS[item.icon]?.(active) ?? null}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Language + User section */}
        <div className="border-t border-white/[0.06] p-4">
          <div className="mb-3">
            <LanguageSwitcher />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-400/10 text-xs font-semibold text-gold-400">
              {email.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-neutral-300">{email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="mt-3 w-full rounded-xl border border-neutral-700 px-3 py-2 text-xs font-medium text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-neutral-300"
          >
            {signOutLabel}
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-white/[0.06] bg-neutral-950 px-4 lg:hidden">
          <Logo size="sm" />
          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-xl p-2 text-neutral-500 hover:bg-neutral-800">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              }
            </svg>
          </button>
        </header>

        {/* Mobile nav overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <div className="fixed inset-y-0 end-0 w-72 border-s border-white/[0.06] bg-neutral-950 shadow-elevated">
              <div className="flex h-14 items-center justify-between border-b border-white/[0.06] px-4">
                <span className="text-base font-bold text-white">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="rounded-xl p-1.5 text-neutral-500 hover:text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="space-y-0.5 px-3 py-4">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium ${active ? "bg-gold-400/10 text-gold-400" : "text-neutral-400 hover:bg-neutral-800"}`}>
                      {ICONS[item.icon]?.(active) ?? null}
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="border-t border-white/[0.06] p-4">
                <p className="truncate text-xs text-neutral-500">{email}</p>
                <button onClick={handleSignOut} className="mt-3 w-full rounded-xl border border-neutral-700 px-3 py-2 text-xs font-medium text-neutral-500 hover:bg-neutral-800">
                  {signOutLabel}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="dashboard-content flex-1 overflow-y-auto p-5 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

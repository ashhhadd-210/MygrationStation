import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/ui/Logo";
import { BlogIndex } from "./BlogIndex";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0a]/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Logo size="md" />
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-sm text-neutral-400 transition-colors hover:text-white">Features</Link>
            <Link href="/" className="text-sm text-neutral-400 transition-colors hover:text-white">How It Works</Link>
            <Link href="/" className="text-sm text-neutral-400 transition-colors hover:text-white">Pricing</Link>
            <Link href="/blog" className="text-sm text-white font-medium">Blog</Link>
            <Link href="/" className="text-sm text-neutral-400 transition-colors hover:text-white">FAQ</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden text-sm text-neutral-300 hover:text-white sm:inline-flex">Sign In</Link>
            <Link href="/signup" className="rounded-full border border-gold-400 px-5 py-2 text-sm font-semibold text-gold-400 transition-all hover:bg-gold-400 hover:text-black">Get Started</Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="border-b border-white/[0.06] py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">Resources</p>
            <h1 className="mt-4 font-serif text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Immigration <span className="text-gold-400">Business Blog</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-neutral-400">
              Expert guides on visas, LLC formation, compliance, and everything immigrant entrepreneurs need to launch their US business.
            </p>
          </div>
        </section>

        {/* Blog index (client component for search/filter) */}
        <BlogIndex />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <Logo size="sm" />
              <p className="mt-4 text-sm leading-relaxed text-neutral-500">
                The one-stop shop for immigrants forming a business in America.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Product</h4>
              <ul className="mt-4 space-y-2.5">
                <li><Link href="/signup" className="text-sm text-neutral-400 hover:text-white">LLC Formation</Link></li>
                <li><Link href="/signup" className="text-sm text-neutral-400 hover:text-white">EIN Without SSN</Link></li>
                <li><Link href="/signup" className="text-sm text-neutral-400 hover:text-white">Compliance Calendar</Link></li>
                <li><Link href="/signup" className="text-sm text-neutral-400 hover:text-white">Document Vault</Link></li>
                <li><Link href="/signup" className="text-sm text-neutral-400 hover:text-white">Banking Setup</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Resources</h4>
              <ul className="mt-4 space-y-2.5">
                <li><Link href="/blog" className="text-sm text-neutral-400 hover:text-white">Blog</Link></li>
                <li><a href="#" className="text-sm text-neutral-400 hover:text-white">Visa Guides</a></li>
                <li><a href="#" className="text-sm text-neutral-400 hover:text-white">State Comparison</a></li>
                <li><a href="#" className="text-sm text-neutral-400 hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Company</h4>
              <ul className="mt-4 space-y-2.5">
                <li><a href="#" className="text-sm text-neutral-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-sm text-neutral-400 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-sm text-neutral-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-neutral-400 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-white/[0.06] pt-6 text-center text-xs text-neutral-600">
            &copy; {new Date().getFullYear()} MygrationStation. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

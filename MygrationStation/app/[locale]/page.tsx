import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { Logo } from "@/components/ui/Logo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations("common");
  const pricing = useTranslations("pricing");

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-white">
      {/* ─── NAVBAR ─── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0a]/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Logo size="md" />

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-neutral-400 transition-colors hover:text-white">Features</a>
            <a href="#how-it-works" className="text-sm text-neutral-400 transition-colors hover:text-white">How It Works</a>
            <a href="#pricing" className="text-sm text-neutral-400 transition-colors hover:text-white">Pricing</a>
            <Link href="/blog" className="text-sm text-neutral-400 transition-colors hover:text-white">Blog</Link>
            <a href="#faq" className="text-sm text-neutral-400 transition-colors hover:text-white">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden text-sm text-neutral-300 transition-colors hover:text-white sm:inline-flex">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-gold-400 px-5 py-2 text-sm font-semibold text-gold-400 transition-all hover:bg-gold-400 hover:text-black"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ─── HERO ─── */}
        <section className="relative overflow-hidden pb-8 pt-16 lg:pb-16 lg:pt-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              {/* Left column */}
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 text-sm text-gold-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                  Available in 10 languages
                </div>

                <h1 className="font-serif text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
                  Start Your{" "}
                  <br className="hidden sm:block" />
                  US Business{" "}
                  <br />
                  &mdash;{" "}
                  <em className="text-gold-400">
                    No SSN
                    <br />
                    Required
                  </em>
                </h1>

                <p className="mt-6 max-w-lg text-lg leading-relaxed text-neutral-400">
                  Form a US LLC, get your EIN without an SSN, and stay compliant
                  with automated deadline tracking. Built for immigrant founders
                  worldwide.
                </p>

                {/* Pill tags */}
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-full border border-neutral-700 px-4 py-1.5 text-sm text-neutral-300">
                    Form LLC
                  </span>
                  <span className="rounded-full border border-neutral-700 px-4 py-1.5 text-sm text-neutral-300">
                    Get EIN
                  </span>
                  <span className="rounded-full border border-neutral-700 px-4 py-1.5 text-sm text-neutral-300">
                    Stay Compliant
                  </span>
                </div>

                {/* CTAs */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-7 py-3.5 text-sm font-semibold text-black transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold-400/20"
                  >
                    Start Your LLC Today
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                  <a
                    href="#pricing"
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:border-neutral-500"
                  >
                    View Pricing
                  </a>
                </div>

                <p className="mt-4 text-sm text-neutral-600">
                  No credit card required
                </p>
              </div>

              {/* Right column: Dashboard mockup */}
              <div className="hidden lg:block">
                <div className="rounded-2xl border border-white/[0.06] bg-neutral-900/80 p-6 shadow-2xl">
                  {/* Header */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-400">
                      MygrationStation Dashboard
                    </span>
                  </div>
                  {/* Status row */}
                  <div className="mb-6 grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-white/[0.06] bg-neutral-950 p-4">
                      <p className="text-xs text-neutral-500">LLC Status</p>
                      <p className="mt-1 text-sm font-semibold text-white">
                        Active &mdash; Wyoming
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-neutral-950 p-4">
                      <p className="text-xs text-neutral-500">EIN Application</p>
                      <p className="mt-1 text-sm font-semibold text-gold-400">
                        Approved
                      </p>
                    </div>
                  </div>
                  {/* Upcoming deadlines */}
                  <div className="rounded-xl border border-white/[0.06] bg-neutral-950 p-4">
                    <p className="mb-3 text-xs font-medium text-neutral-500">
                      Upcoming Deadlines
                    </p>
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between rounded-lg bg-neutral-900 px-3 py-2">
                        <span className="text-sm text-neutral-300">Annual Report</span>
                        <span className="text-xs text-neutral-500">Dec 31, 2026</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-neutral-900 px-3 py-2">
                        <span className="text-sm text-neutral-300">BOI Report</span>
                        <span className="text-xs text-neutral-500">Jan 15, 2027</span>
                      </div>
                    </div>
                  </div>
                  {/* Document icons row */}
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {["Articles of Org", "Operating Agmt", "EIN Letter", "BOI Filing"].map((doc) => (
                      <div key={doc} className="flex flex-col items-center gap-1.5 rounded-lg border border-white/[0.04] bg-neutral-950 p-3">
                        <svg className="h-5 w-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        <span className="text-[10px] text-neutral-500 text-center leading-tight">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── TRUST BAR ─── */}
        <section className="border-y border-white/[0.06] py-6">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-8">
                <TrustItem icon={<GlobeIcon />} text="50 States Available" />
                <TrustItem icon={<ShieldIcon />} text="256-bit Encryption" />
                <TrustItem icon={<ClockIcon />} text="24/7 Compliance Monitoring" />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-neutral-500">Trusted by founders from</span>
                <div className="flex gap-1.5">
                  {["MX", "IN", "BR", "PH", "AE", "NG"].map((code) => (
                    <span
                      key={code}
                      className="inline-flex h-7 items-center rounded bg-neutral-800 px-2 text-xs font-medium text-neutral-400"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FEATURES (tabbed) ─── */}
        <FeaturesSection />

        {/* ─── HOW IT WORKS ─── */}
        <HowItWorksSection />

        {/* ─── PRICING ─── */}
        <section id="pricing" className="border-t border-white/[0.06] py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">
                Transparent pricing
              </p>
              <h2 className="mt-4 font-serif text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Simple pricing,{" "}
                <span className="text-gold-400">no hidden fees</span>
              </h2>
              <p className="mt-4 text-lg text-neutral-400">
                Choose the plan that fits your needs. Upgrade anytime.
              </p>
            </div>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              <PricingCard
                tier="Standard"
                description="LLC Formation Filing"
                price={pricing("standardPrice")}
                features={pricing.raw("standardIncludes") as string[]}
                highlighted={false}
                badge={null}
              />
              <PricingCard
                tier="Pro"
                description="Formation + EIN Concierge"
                price={pricing("proPrice")}
                features={pricing.raw("proIncludes") as string[]}
                highlighted={true}
                badge="Most Popular"
              />
              <PricingCard
                tier="Premium"
                description="All Inclusive"
                price={pricing("premiumPrice")}
                features={pricing.raw("premiumIncludes") as string[]}
                highlighted={false}
                badge={null}
              />
            </div>

            <p className="mt-8 text-center text-sm text-neutral-600">
              + state filing fees. All plans include your secure document vault.
              30-day money-back guarantee.
            </p>
          </div>
        </section>

        {/* ─── TESTIMONIALS ─── */}
        <section className="border-t border-white/[0.06] py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">
                Trusted worldwide
              </p>
              <h2 className="mt-4 font-serif text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Entrepreneurs love{" "}
                <span className="text-gold-400">MygrationStation</span>
              </h2>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <TestimonialCard
                quote="I formed my LLC from Mexico in under 30 minutes. The entire process was in Spanish and I had my EIN within two weeks."
                name="Carlos M."
                role="E-commerce Founder"
                location="Mexico City, Mexico"
                countryCode="MX"
              />
              <TestimonialCard
                quote="As a non-resident without an SSN, I thought forming a US business would be impossible. MygrationStation made it simple."
                name="Priya S."
                role="SaaS Founder"
                location="Bangalore, India"
                countryCode="IN"
              />
              <TestimonialCard
                quote="The compliance calendar alone is worth it. I never worry about missing a filing deadline or getting penalized."
                name="Ahmed K."
                role="Freelance Consultant"
                location="Dubai, UAE"
                countryCode="AE"
              />
            </div>
          </div>
        </section>

        {/* ─── BLOG ─── */}
        <section id="blog" className="border-t border-white/[0.06] py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">
                  Resources
                </p>
                <h2 className="mt-4 font-serif text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                  Immigration{" "}
                  <span className="text-gold-400">Business Blog</span>
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden items-center gap-2 text-sm font-medium text-gold-400 transition-colors hover:text-gold-300 sm:inline-flex"
              >
                View all articles
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <BlogCard
                slug="h1b-visa-start-business"
                category="Visa Guides"
                title="H-1B Visa Holders: Can You Start a Business in the US?"
                description="Understanding the rules around side businesses, LLC ownership, and what USCIS allows while on an H-1B visa."
                readTime="8 min read"
              />
              <BlogCard
                slug="forming-llc-without-ssn"
                category="Getting Started"
                title="The Complete Guide to Forming an LLC Without an SSN"
                description="Step-by-step walkthrough for ITIN holders, non-residents, and immigrants who want to start a US business legally."
                readTime="10 min read"
              />
              <BlogCard
                slug="boi-reporting-foreign-llc"
                category="Compliance"
                title="BOI Reporting: What Every Foreign-Owned LLC Must Know in 2025"
                description="FinCEN's Beneficial Ownership Information reporting requirements, deadlines, and penalties — updated with the March 2025 rule changes."
                readTime="7 min read"
              />
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section id="faq" className="border-t border-white/[0.06] py-20 lg:py-28">
          <div className="mx-auto max-w-3xl px-6">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">
                FAQ
              </p>
              <h2 className="mt-4 font-serif text-3xl font-bold text-white sm:text-4xl">
                Frequently asked questions
              </h2>
            </div>

            <div className="mt-14 space-y-4">
              <FaqItem
                question="Can I form a US LLC without a Social Security Number?"
                answer="Yes! Non-residents and ITIN holders can form an LLC in any US state. You don't need an SSN to start a business. We handle the entire process including EIN application via phone or fax submission to the IRS."
              />
              <FaqItem
                question="How long does LLC formation take?"
                answer="Processing times vary by state. Most states complete formation within 3-10 business days with standard processing. Some states like Wyoming and Delaware can be as fast as 1-2 days with expedited processing."
              />
              <FaqItem
                question="What is an EIN and why do I need one?"
                answer="An EIN (Employer Identification Number) is like a Social Security Number for your business. You need it to open a business bank account, file taxes, and hire employees. We can obtain your EIN even without an SSN."
              />
              <FaqItem
                question="Which state should I form my LLC in?"
                answer="It depends on your situation. Wyoming and Delaware are popular for non-residents due to low fees and privacy protections. If you plan to operate in a specific state, forming there avoids foreign qualification fees. Our wizard helps you choose."
              />
              <FaqItem
                question="What compliance requirements will I have?"
                answer="Requirements vary by state and your tax situation. Common obligations include annual state reports, BOI reporting (for foreign-owned LLCs), Form 5472, and quarterly estimated taxes. Our compliance calendar tracks all deadlines automatically."
              />
              <FaqItem
                question="Can I open a US bank account as a non-resident?"
                answer="Yes, several US banks accept non-resident LLC owners. Our banking module matches you with immigrant-friendly banks based on your profile — whether you have an SSN, US address, or need international wire transfers."
              />
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="border-t border-white/[0.06]">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
            <div className="relative overflow-hidden rounded-3xl border border-gold-400/20 bg-gradient-to-br from-neutral-900 to-neutral-950 px-8 py-16 text-center sm:px-16">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(200,169,96,0.08),_transparent_60%)]" />
              <div className="relative">
                <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
                  Ready to start your US business?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-400">
                  Join thousands of immigrant entrepreneurs who launched their business with MygrationStation.
                </p>
                <div className="mt-8">
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-8 py-4 text-base font-semibold text-black transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold-400/20"
                  >
                    Get Started Free
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
                <p className="mt-4 text-sm text-neutral-600">
                  No credit card required &middot; Setup in under 15 minutes
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <Logo size="sm" />
              <p className="mt-4 text-sm leading-relaxed text-neutral-500">
                The immigrant-first business formation platform. Form your US LLC in any state, in your language.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Product</h4>
              <ul className="mt-4 space-y-2.5">
                <li><a href="#features" className="text-sm text-neutral-400 hover:text-white transition-colors">LLC Formation</a></li>
                <li><a href="#features" className="text-sm text-neutral-400 hover:text-white transition-colors">EIN Concierge</a></li>
                <li><a href="#features" className="text-sm text-neutral-400 hover:text-white transition-colors">Compliance Calendar</a></li>
                <li><a href="#pricing" className="text-sm text-neutral-400 hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Resources</h4>
              <ul className="mt-4 space-y-2.5">
                <li><a href="#faq" className="text-sm text-neutral-400 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#how-it-works" className="text-sm text-neutral-400 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#blog" className="text-sm text-neutral-400 hover:text-white transition-colors">Blog</a></li>
                <li><Link href="/login" className="text-sm text-neutral-400 hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Legal</h4>
              <ul className="mt-4 space-y-2.5">
                <li><a href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-white/[0.06] pt-6">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-xs text-neutral-600">
                &copy; {new Date().getFullYear()} MygrationStation. {t("poweredBy")}
              </p>
              <p className="max-w-lg text-center text-[13px] leading-relaxed text-neutral-600 sm:text-end">
                {t("legalDisclaimer")}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════ */

function TrustItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-neutral-500">{icon}</span>
      <span className="text-sm text-neutral-400">{text}</span>
    </div>
  );
}

function PricingCard({
  tier,
  description,
  price,
  features,
  highlighted,
  badge,
}: {
  tier: string;
  description: string;
  price: string;
  features: string[];
  highlighted: boolean;
  badge: string | null;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-8 transition-all ${
        highlighted
          ? "border-gold-400/30 bg-neutral-900/80 shadow-xl shadow-gold-400/5"
          : "border-white/[0.06] bg-neutral-900/40"
      }`}
    >
      {badge && (
        <span className="absolute -top-3 start-6 rounded-full bg-gold-400 px-4 py-1 text-xs font-bold uppercase tracking-wider text-black">
          {badge}
        </span>
      )}
      <div>
        <h3 className="text-lg font-bold text-white">{tier}</h3>
        <p className="mt-1 text-sm text-neutral-500">{description}</p>
      </div>
      <p className="mt-4 flex items-baseline gap-1.5">
        <span className="text-4xl font-extrabold tracking-tight text-white">{price}</span>
        <span className="text-sm text-neutral-600">+ state fees</span>
      </p>
      <ul className="mt-6 flex-1 space-y-3">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm text-neutral-400">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <Link
        href="/signup"
        className={`mt-8 block rounded-full py-3 text-center text-sm font-semibold transition-all ${
          highlighted
            ? "bg-gold-400 text-black hover:bg-gold-300"
            : "border border-neutral-700 text-white hover:border-neutral-500"
        }`}
      >
        Get Started
      </Link>
    </div>
  );
}

function TestimonialCard({
  quote,
  name,
  role,
  location,
  countryCode,
}: {
  quote: string;
  name: string;
  role: string;
  location: string;
  countryCode: string;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-white/[0.06] bg-neutral-900/40 p-6">
      {/* Stars */}
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="h-4 w-4 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-neutral-400">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <div className="mt-5 flex items-center gap-3 border-t border-white/[0.06] pt-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 text-xs font-bold text-neutral-400">
          {countryCode}
        </span>
        <div>
          <p className="text-sm font-semibold text-white">{name}</p>
          <p className="text-xs text-neutral-500">
            {role} &middot; {location}
          </p>
        </div>
      </div>
    </div>
  );
}

function BlogCard({
  category,
  title,
  description,
  readTime,
  slug,
}: {
  category: string;
  title: string;
  description: string;
  readTime: string;
  slug?: string;
}) {
  return (
    <Link href={slug ? `/blog/${slug}` : "/blog"} className="group flex flex-col rounded-2xl border border-white/[0.06] bg-neutral-900/40 p-6 transition-all hover:border-white/10">
      <span className="text-xs font-semibold text-gold-400">{category}</span>
      <h3 className="mt-3 text-lg font-bold text-white group-hover:text-gold-400 transition-colors">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500">{description}</p>
      <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
        <span className="text-xs text-neutral-600">{readTime}</span>
        <svg className="h-4 w-4 text-neutral-600 transition-colors group-hover:text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </div>
    </Link>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-2xl border border-white/[0.06] bg-neutral-900/40">
      <summary className="flex cursor-pointer items-center justify-between p-5 text-sm font-semibold text-white [&::-webkit-details-marker]:hidden">
        {question}
        <svg className="h-5 w-5 flex-shrink-0 text-neutral-600 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </summary>
      <div className="px-5 pb-5 text-sm leading-relaxed text-neutral-400">{answer}</div>
    </details>
  );
}

/* ═══════════════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════════════ */

function GlobeIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

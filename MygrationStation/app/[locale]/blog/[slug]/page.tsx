import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/ui/Logo";
import { posts, getPostBySlug, getRelatedPosts } from "@/lib/blog/posts";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug, 2);

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0a]/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Logo size="md" />
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-sm text-neutral-400 hover:text-white">Features</Link>
            <Link href="/" className="text-sm text-neutral-400 hover:text-white">How It Works</Link>
            <Link href="/" className="text-sm text-neutral-400 hover:text-white">Pricing</Link>
            <Link href="/blog" className="text-sm text-white font-medium">Blog</Link>
            <Link href="/" className="text-sm text-neutral-400 hover:text-white">FAQ</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden text-sm text-neutral-300 hover:text-white sm:inline-flex">Sign In</Link>
            <Link href="/signup" className="rounded-full border border-gold-400 px-5 py-2 text-sm font-semibold text-gold-400 hover:bg-gold-400 hover:text-black">Get Started</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        {/* Back link */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300 mb-8">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to blog
        </Link>

        {/* Article header */}
        <div className="mb-10">
          <span className="text-xs font-semibold text-gold-400">{post.category}</span>
          <p className="mt-1 text-sm text-neutral-500">{post.date} &middot; {post.readTime}</p>
          <h1 className="mt-4 font-serif text-3xl font-bold text-white sm:text-4xl leading-tight">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-neutral-400">{post.description}</p>

          {/* Author */}
          <div className="mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-400/10 text-sm font-bold text-gold-400">
              MS
            </div>
            <div>
              <p className="text-sm font-medium text-white">MygrationStation Team</p>
              <p className="text-xs text-neutral-500">{post.date}</p>
            </div>
          </div>
        </div>

        {/* Article content */}
        <article
          className="blog-prose"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Related articles */}
        {related.length > 0 && (
          <div className="mt-16 border-t border-white/[0.06] pt-10">
            <h3 className="text-lg font-semibold text-white">Continue reading</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group rounded-xl border border-white/[0.06] bg-neutral-900/40 p-5 transition-all hover:border-white/10"
                >
                  <span className="text-xs font-semibold text-gold-400">{r.category}</span>
                  <h4 className="mt-2 font-semibold text-white group-hover:text-gold-400 transition-colors">
                    {r.title}
                  </h4>
                  <p className="mt-1 text-xs text-neutral-500">{r.readTime}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <Logo size="sm" />
              <p className="mt-4 text-sm text-neutral-500">The one-stop shop for immigrants forming a business in America.</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Product</h4>
              <ul className="mt-4 space-y-2.5">
                <li><Link href="/signup" className="text-sm text-neutral-400 hover:text-white">LLC Formation</Link></li>
                <li><Link href="/signup" className="text-sm text-neutral-400 hover:text-white">EIN Without SSN</Link></li>
                <li><Link href="/signup" className="text-sm text-neutral-400 hover:text-white">Compliance Calendar</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Resources</h4>
              <ul className="mt-4 space-y-2.5">
                <li><Link href="/blog" className="text-sm text-neutral-400 hover:text-white">Blog</Link></li>
                <li><a href="#" className="text-sm text-neutral-400 hover:text-white">FAQ</a></li>
                <li><a href="#" className="text-sm text-neutral-400 hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Company</h4>
              <ul className="mt-4 space-y-2.5">
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

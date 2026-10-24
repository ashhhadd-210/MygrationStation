"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { posts, CATEGORIES } from "@/lib/blog/posts";

export function BlogIndex() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = posts.filter((post) => {
    const matchesCategory = category === "All" || post.category === category;
    const matchesSearch =
      search === "" ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 focus:outline-none"
          />
        </div>

        {/* Category filters */}
        <div className="mb-10 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                category === cat
                  ? "bg-gold-400 text-black"
                  : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Post grid */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-neutral-500">No articles found matching your search.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-white/[0.06] bg-neutral-900/40 p-6 transition-all hover:border-white/10"
              >
                <span className="text-xs font-semibold text-gold-400">{post.category}</span>
                <p className="mt-1 text-xs text-neutral-600">{post.date}</p>
                <h2 className="mt-3 text-lg font-bold text-white group-hover:text-gold-400 transition-colors">
                  {post.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500">
                  {post.description}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
                  <span className="text-xs text-neutral-600">{post.readTime}</span>
                  <svg className="h-4 w-4 text-neutral-600 transition-colors group-hover:text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

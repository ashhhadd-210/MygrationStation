import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";
import { createDemoSupabaseClient } from "./demo-client";

const isDemoMode = process.env.DEMO_MODE === "true";

/**
 * Server-side Supabase client for Server Components and Server Actions.
 * Reads auth session from cookies. Uses anon key — RLS enforces access.
 *
 * In DEMO_MODE, returns a mock client with static demo data.
 * Must be called inside a request context (Server Component, Server Action, Route Handler).
 */
export async function createServerSupabaseClient() {
  if (isDemoMode) {
    return createDemoSupabaseClient() as unknown as ReturnType<typeof createServerClient<Database>>;
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // setAll can fail in Server Components (read-only).
            // This is expected — the middleware handles cookie refresh.
          }
        },
      },
    }
  );
}

/**
 * Get the currently authenticated user. Throws if not authenticated.
 * In DEMO_MODE, returns the demo user.
 */
export async function getAuthenticatedUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!isDemoMode && (error || !user)) {
    throw new Error("Not authenticated");
  }

  return { supabase, user: user! };
}

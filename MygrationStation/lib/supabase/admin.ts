import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Admin Supabase client with service_role key.
 * NEVER import this in client components or expose to the browser.
 * Used only in:
 *   - Server actions that need to bypass RLS (e.g., admin operations)
 *   - Webhook handlers
 *   - Background jobs (compliance email cron, etc.)
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables"
    );
  }

  return createClient<Database>(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { ResidencyStatus } from "@/lib/supabase/database.types";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const residency = searchParams.get("residency") as ResidencyStatus | null;
  const lang = searchParams.get("lang") ?? "en";

  if (!code) {
    return NextResponse.redirect(`${origin}/${lang}/login?error=missing_code`);
  }

  const response = NextResponse.redirect(`${origin}/${lang}/dashboard`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(
      `${origin}/${lang}/login?error=auth_failed`
    );
  }

  // Check if user row exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("id", data.user.id)
    .single();

  if (!existingUser) {
    // New user — create profile row and redirect to onboarding
    const { error: insertError } = await supabase.from("users").insert({
      id: data.user.id,
      email: data.user.email ?? "",
      residency_status: residency ?? "itin_holder",
      lang_pref: lang,
    });

    if (insertError) {
      console.error("Failed to create user profile:", insertError.message);
      // Still redirect to onboarding — they can fix profile there
    }

    return NextResponse.redirect(`${origin}/${lang}/onboarding`);
  }

  // Existing user — go to dashboard
  return response;
}

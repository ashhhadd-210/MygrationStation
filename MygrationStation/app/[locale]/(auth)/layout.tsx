import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (process.env.DEMO_MODE === "true") {
    redirect(`/${locale}/dashboard`);
  }

  return <>{children}</>;
}

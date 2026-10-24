import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { LoginForm } from "./LoginForm";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function LoginPage({ params }: Props) {
  // Force dynamic rendering so demo mode redirect works at request time
  cookies();

  if (process.env.DEMO_MODE === "true") {
    const { locale } = await params;
    redirect(`/${locale}/dashboard`);
  }
  return <LoginForm />;
}

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SignupForm } from "./SignupForm";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function SignupPage({ params }: Props) {
  cookies();

  if (process.env.DEMO_MODE === "true") {
    const { locale } = await params;
    redirect(`/${locale}/dashboard`);
  }
  return <SignupForm />;
}

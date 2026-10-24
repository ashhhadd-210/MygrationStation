import { setRequestLocale } from "next-intl/server";
import { getOrCreateFormationDraft } from "./actions";
import { FormationWizard } from "./components/FormationWizard";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function FormationPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const result = await getOrCreateFormationDraft();

  if (!result) {
    return (
      <div className="mx-auto max-w-3xl py-12 text-center">
        <p className="text-slate-600">
          Unable to load formation wizard. Please try again.
        </p>
      </div>
    );
  }

  return (
    <FormationWizard
      businessId={result.businessId}
      initialDraft={result.draft}
    />
  );
}

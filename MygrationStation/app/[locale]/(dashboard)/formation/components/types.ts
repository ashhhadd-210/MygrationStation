import type { FormationDraft } from "@/lib/supabase/database.types";

export interface StepProps {
  draft: FormationDraft;
  businessId: string;
  onNext: (data?: Partial<FormationDraft>) => void;
  onBack: () => void;
  isPending: boolean;
}

/**
 * Database types for MygrationStation.
 *
 * In production, regenerate with:
 *   npx supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > lib/supabase/database.types.ts
 *
 * This file is the authoritative source until gen types is run.
 */

export type ResidencyStatus = "ssn_holder" | "itin_holder" | "non_resident";
export type EntityType = "llc" | "c_corp";
export type FormationStatus = "draft" | "submitted" | "filed" | "complete";

export type FormationApplicationStatus =
  | "draft"
  | "payment_pending"
  | "submitted_to_mygrationstation"
  | "filed_with_state"
  | "complete";

export type EinPath = "online_self" | "phone_assisted" | "fax_assisted";
export type EinStatus =
  | "pending_info"
  | "info_complete"
  | "fax_sent"
  | "received"
  | "failed";

export type DocumentType =
  | "articles_of_organization"
  | "operating_agreement"
  | "ein_letter"
  | "boi_confirmation"
  | "form_5472_kit"
  | "annual_report"
  | "passport"
  | "itin_letter"
  | "third_party_auth"
  | "bank_statement"
  | "business_license"
  | "contract"
  | "other";

export type DocumentSource =
  | "system_generated"
  | "user_uploaded"
  | "staff_uploaded";

export type ComplianceEventType =
  | "boi_report"
  | "form_5472"
  | "quarterly_estimated_tax_q1"
  | "quarterly_estimated_tax_q2"
  | "quarterly_estimated_tax_q3"
  | "quarterly_estimated_tax_q4"
  | "annual_state_report"
  | "registered_agent_renewal"
  | "itin_renewal";

export type ComplianceStatus =
  | "upcoming"
  | "due_soon"
  | "overdue"
  | "complete"
  | "not_applicable";

export type BankName =
  | "mercury"
  | "relay"
  | "airwallex"
  | "wise"
  | "slash"
  | "nbkc"
  | "other";

export type BankingApplicationStatus =
  | "matched"
  | "packet_prepared"
  | "applied"
  | "approved"
  | "rejected";

export type SubscriptionPlan = "compliance_annual";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          lang_pref: string;
          country_of_birth: string | null;
          residency_status: ResidencyStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          lang_pref?: string;
          country_of_birth?: string | null;
          residency_status: ResidencyStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          lang_pref?: string;
          country_of_birth?: string | null;
          residency_status?: ResidencyStatus;
          updated_at?: string;
        };
        Relationships: [];
      };
      businesses: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          state: string;
          entity_type: EntityType;
          formation_status: FormationStatus;
          ein: string | null;
          registered_agent_id: string | null;
          foreign_owned: boolean;
          formation_draft: FormationDraft | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          state: string;
          entity_type?: EntityType;
          formation_status?: FormationStatus;
          ein?: string | null;
          registered_agent_id?: string | null;
          foreign_owned?: boolean;
          formation_draft?: FormationDraft | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          name?: string;
          state?: string;
          entity_type?: EntityType;
          formation_status?: FormationStatus;
          ein?: string | null;
          registered_agent_id?: string | null;
          foreign_owned?: boolean;
          formation_draft?: FormationDraft | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      registered_agents: {
        Row: {
          id: string;
          state: string;
          provider_name: string;
          agent_name: string;
          address_line1: string;
          address_line2: string | null;
          city: string;
          zip: string;
          active: boolean;
        };
        Insert: {
          id?: string;
          state: string;
          provider_name: string;
          agent_name: string;
          address_line1: string;
          address_line2?: string | null;
          city: string;
          zip: string;
          active?: boolean;
        };
        Update: {
          state?: string;
          provider_name?: string;
          agent_name?: string;
          address_line1?: string;
          address_line2?: string | null;
          city?: string;
          zip?: string;
          active?: boolean;
        };
        Relationships: [];
      };
      formation_applications: {
        Row: {
          id: string;
          business_id: string;
          status: FormationApplicationStatus;
          state_fee_cents: number | null;
          articles_pdf_path: string | null;
          operating_agreement_path: string | null;
          submitted_at: string | null;
          filed_at: string | null;
          stripe_payment_intent_id: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          status?: FormationApplicationStatus;
          state_fee_cents?: number | null;
          articles_pdf_path?: string | null;
          operating_agreement_path?: string | null;
          submitted_at?: string | null;
          filed_at?: string | null;
          stripe_payment_intent_id?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          business_id?: string;
          status?: FormationApplicationStatus;
          state_fee_cents?: number | null;
          articles_pdf_path?: string | null;
          operating_agreement_path?: string | null;
          submitted_at?: string | null;
          filed_at?: string | null;
          stripe_payment_intent_id?: string | null;
          notes?: string | null;
        };
        Relationships: [];
      };
      ein_applications: {
        Row: {
          id: string;
          business_id: string;
          path: EinPath;
          status: EinStatus;
          fax_sent_at: string | null;
          ein_received_at: string | null;
          cp575_path: string | null;
          ein_encrypted: string | null;
          itin_of_responsible_party: string | null;
          ss4_pdf_path: string | null;
          third_party_auth_path: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          path: EinPath;
          status?: EinStatus;
          fax_sent_at?: string | null;
          ein_received_at?: string | null;
          cp575_path?: string | null;
          ein_encrypted?: string | null;
          itin_of_responsible_party?: string | null;
          ss4_pdf_path?: string | null;
          third_party_auth_path?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          business_id?: string;
          path?: EinPath;
          status?: EinStatus;
          fax_sent_at?: string | null;
          ein_received_at?: string | null;
          cp575_path?: string | null;
          ein_encrypted?: string | null;
          itin_of_responsible_party?: string | null;
          ss4_pdf_path?: string | null;
          third_party_auth_path?: string | null;
          notes?: string | null;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          user_id: string;
          business_id: string | null;
          document_type: DocumentType;
          display_name: string;
          source: DocumentSource;
          storage_path: string;
          file_size_bytes: number | null;
          mime_type: string | null;
          expires_at: string | null;
          alert_60d_sent: boolean;
          alert_30d_sent: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          business_id?: string | null;
          document_type: DocumentType;
          display_name: string;
          source: DocumentSource;
          storage_path: string;
          file_size_bytes?: number | null;
          mime_type?: string | null;
          expires_at?: string | null;
          alert_60d_sent?: boolean;
          alert_30d_sent?: boolean;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          business_id?: string | null;
          document_type?: DocumentType;
          display_name?: string;
          source?: DocumentSource;
          storage_path?: string;
          file_size_bytes?: number | null;
          mime_type?: string | null;
          expires_at?: string | null;
          alert_60d_sent?: boolean;
          alert_30d_sent?: boolean;
        };
        Relationships: [];
      };
      compliance_events: {
        Row: {
          id: string;
          business_id: string;
          event_type: ComplianceEventType;
          due_date: string;
          completed_at: string | null;
          status: ComplianceStatus;
          alert_60d_sent: boolean;
          alert_30d_sent: boolean;
          document_id: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          event_type: ComplianceEventType;
          due_date: string;
          completed_at?: string | null;
          status?: ComplianceStatus;
          alert_60d_sent?: boolean;
          alert_30d_sent?: boolean;
          document_id?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          business_id?: string;
          event_type?: ComplianceEventType;
          due_date?: string;
          completed_at?: string | null;
          status?: ComplianceStatus;
          alert_60d_sent?: boolean;
          alert_30d_sent?: boolean;
          document_id?: string | null;
          notes?: string | null;
        };
        Relationships: [];
      };
      banking_applications: {
        Row: {
          id: string;
          business_id: string;
          bank_name: BankName;
          status: BankingApplicationStatus;
          applied_at: string | null;
          outcome_at: string | null;
          rejection_reason: string | null;
          referral_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          bank_name: BankName;
          status?: BankingApplicationStatus;
          applied_at?: string | null;
          outcome_at?: string | null;
          rejection_reason?: string | null;
          referral_id?: string | null;
          created_at?: string;
        };
        Update: {
          business_id?: string;
          bank_name?: BankName;
          status?: BankingApplicationStatus;
          applied_at?: string | null;
          outcome_at?: string | null;
          rejection_reason?: string | null;
          referral_id?: string | null;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_subscription_id: string;
          stripe_customer_id: string;
          plan: SubscriptionPlan;
          status: string;
          current_period_end: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_subscription_id: string;
          stripe_customer_id: string;
          plan: SubscriptionPlan;
          status: string;
          current_period_end: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          stripe_subscription_id?: string;
          stripe_customer_id?: string;
          plan?: SubscriptionPlan;
          status?: string;
          current_period_end?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

/**
 * Formation draft shape stored as JSONB on businesses.formation_draft.
 * Persisted after each wizard step so users can resume.
 */
export interface FormationDraft {
  currentStep: number;
  residencyStatus?: ResidencyStatus;
  stateCode?: string;
  businessName?: string;
  members?: FormationMember[];
  memberType?: "single" | "multi";
  foreignOwned?: boolean;
  registeredAgentChoice?: "mygrationstation" | "own";
  ownRegisteredAgent?: {
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zip: string;
  };
  mygrationstationRegisteredAgentId?: string;
  signatureCompleted?: boolean;
  docusealSubmissionId?: string;
  selectedPlan?: "standard" | "pro" | "premium" | "formation_only" | "formation_ein";
  stripeSessionId?: string;
  completedAt?: string;
}

export interface FormationMember {
  fullName: string;
  dateOfBirth: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateProvince: string;
  zipPostal: string;
  country: string;
  ownershipPercentage: number;
  idDocumentPath?: string;
}

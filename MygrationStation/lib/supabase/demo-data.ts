/**
 * Mock data for DEMO_MODE — allows the app to render without a real Supabase instance.
 */

export const DEMO_USER = {
  id: "demo-user-001",
  email: "demo@mygrationstation.com",
  app_metadata: {},
  user_metadata: {},
  aud: "authenticated",
  created_at: "2025-01-15T00:00:00Z",
};

export const DEMO_PROFILE = {
  email: "demo@mygrationstation.com",
  lang_pref: "en",
  residency_status: "itin_holder",
};

export const DEMO_BUSINESSES = [
  {
    id: "biz-001",
    user_id: "demo-user-001",
    name: "Sakura Digital",
    state: "Wyoming",
    entity_type: "llc",
    formation_status: "complete",
    foreign_owned: true,
    ein: "88-1234567",
    registered_agent_id: "ra-001",
    formation_draft: null,
    created_at: "2025-02-01T00:00:00Z",
  },
  {
    id: "biz-002",
    user_id: "demo-user-001",
    name: "Horizon Ventures",
    state: "Delaware",
    entity_type: "llc",
    formation_status: "filed",
    foreign_owned: false,
    ein: null,
    registered_agent_id: "ra-002",
    formation_draft: {
      step: 6,
      residency: "itin_holder",
      state: "Delaware",
      businessName: "Horizon Ventures",
      owners: [{ fullName: "Demo User", ownershipPercentage: 100 }],
    },
    created_at: "2025-03-10T00:00:00Z",
  },
];

export const DEMO_COMPLIANCE_EVENTS = [
  {
    id: "ce-001",
    event_type: "boi_report",
    due_date: "2026-04-30",
    status: "due_soon",
    completed_at: null,
    notes: null,
    business_id: "biz-001",
    businesses: { name: "Sakura Digital", state: "Wyoming" },
  },
  {
    id: "ce-002",
    event_type: "annual_state_report",
    due_date: "2026-05-15",
    status: "upcoming",
    completed_at: null,
    notes: null,
    business_id: "biz-001",
    businesses: { name: "Sakura Digital", state: "Wyoming" },
  },
  {
    id: "ce-003",
    event_type: "form_5472",
    due_date: "2026-04-15",
    status: "overdue",
    completed_at: null,
    notes: null,
    business_id: "biz-001",
    businesses: { name: "Sakura Digital", state: "Wyoming" },
  },
  {
    id: "ce-004",
    event_type: "quarterly_estimated_tax_q2",
    due_date: "2026-06-15",
    status: "upcoming",
    completed_at: null,
    notes: null,
    business_id: "biz-002",
    businesses: { name: "Horizon Ventures", state: "Delaware" },
  },
  {
    id: "ce-005",
    event_type: "registered_agent_renewal",
    due_date: "2026-02-01",
    status: "completed",
    completed_at: "2026-01-20T00:00:00Z",
    notes: "Renewed via MygrationStation",
    business_id: "biz-001",
    businesses: { name: "Sakura Digital", state: "Wyoming" },
  },
];

export const DEMO_DOCUMENTS = [
  {
    id: "doc-001",
    user_id: "demo-user-001",
    business_id: "biz-001",
    document_type: "articles_of_organization",
    display_name: "Articles of Organization - Sakura Digital LLC",
    source: "mygrationstation",
    storage_path: "demo/articles.pdf",
    file_size_bytes: 245000,
    mime_type: "application/pdf",
    expires_at: null,
    created_at: "2025-02-05T00:00:00Z",
  },
  {
    id: "doc-002",
    user_id: "demo-user-001",
    business_id: "biz-001",
    document_type: "operating_agreement",
    display_name: "Operating Agreement - Sakura Digital LLC",
    source: "mygrationstation",
    storage_path: "demo/operating-agreement.pdf",
    file_size_bytes: 380000,
    mime_type: "application/pdf",
    expires_at: null,
    created_at: "2025-02-05T00:00:00Z",
  },
  {
    id: "doc-003",
    user_id: "demo-user-001",
    business_id: "biz-001",
    document_type: "ein_letter",
    display_name: "EIN Confirmation Letter (CP575)",
    source: "mygrationstation",
    storage_path: "demo/ein-letter.pdf",
    file_size_bytes: 120000,
    mime_type: "application/pdf",
    expires_at: null,
    created_at: "2025-02-20T00:00:00Z",
  },
  {
    id: "doc-004",
    user_id: "demo-user-001",
    business_id: "biz-001",
    document_type: "passport",
    display_name: "Passport Copy",
    source: "user_upload",
    storage_path: "demo/passport.pdf",
    file_size_bytes: 500000,
    mime_type: "application/pdf",
    expires_at: "2028-06-15",
    created_at: "2025-02-01T00:00:00Z",
  },
];

export const DEMO_EIN_APPLICATIONS = [
  {
    id: "ein-001",
    business_id: "biz-001",
    path: "fax",
    status: "complete",
    created_at: "2025-02-10T00:00:00Z",
    notes: "EIN received: 88-1234567",
    ss4_pdf_path: "demo/ss4.pdf",
    businesses: {
      id: "biz-001",
      name: "Sakura Digital",
      state: "Wyoming",
    },
  },
];

export const DEMO_FORMATION_APPLICATIONS = [
  {
    id: "fa-001",
    business_id: "biz-001",
    status: "complete",
    created_at: "2025-02-01T00:00:00Z",
    submitted_at: "2025-02-01T00:00:00Z",
    notes: "Filed and approved",
    state_fee_cents: 10000,
    businesses: {
      id: "biz-001",
      name: "Sakura Digital",
      state: "Wyoming",
      user_id: "demo-user-001",
    },
  },
  {
    id: "fa-002",
    business_id: "biz-002",
    status: "filed_with_state",
    created_at: "2025-03-12T00:00:00Z",
    submitted_at: "2025-03-12T00:00:00Z",
    notes: "Awaiting state approval",
    state_fee_cents: 9000,
    businesses: {
      id: "biz-002",
      name: "Horizon Ventures",
      state: "Delaware",
      user_id: "demo-user-001",
    },
  },
];

export const DEMO_BANKING_APPLICATIONS: unknown[] = [];

export const DEMO_REGISTERED_AGENTS = [
  {
    id: "ra-001",
    agent_name: "MygrationStation Registered Agent",
    address_line1: "1712 Pioneer Ave",
    address_line2: "Suite 500",
    city: "Cheyenne",
    zip: "82001",
    state: "Wyoming",
    active: true,
  },
];

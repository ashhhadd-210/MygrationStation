-- MygrationStation Initial Schema Migration
-- Run with: supabase db push
-- All tables have RLS enabled. No exceptions.

-- ══════════════════════════════════════════════════════════════════
-- 1. USERS
-- ══════════════════════════════════════════════════════════════════

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  lang_pref text not null default 'en',
  country_of_birth text,
  residency_status text not null check (residency_status in ('ssn_holder', 'itin_holder', 'non_resident')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "users_select_own" on public.users
  for select using (auth.uid() = id);

create policy "users_insert_own" on public.users
  for insert with check (auth.uid() = id);

create policy "users_update_own" on public.users
  for update using (auth.uid() = id)
  with check (auth.uid() = id);

-- Trigger to auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at
  before update on public.users
  for each row execute function public.handle_updated_at();


-- ══════════════════════════════════════════════════════════════════
-- 2. REGISTERED AGENTS
-- ══════════════════════════════════════════════════════════════════

create table public.registered_agents (
  id uuid primary key default gen_random_uuid(),
  state text not null,
  provider_name text not null,
  agent_name text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  zip text not null,
  active boolean not null default true
);

alter table public.registered_agents enable row level security;

-- Registered agents are read-only for authenticated users
create policy "ra_select_authenticated" on public.registered_agents
  for select to authenticated using (active = true);


-- ══════════════════════════════════════════════════════════════════
-- 3. BUSINESSES
-- ══════════════════════════════════════════════════════════════════

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  state text not null,
  entity_type text not null default 'llc' check (entity_type in ('llc', 'c_corp')),
  formation_status text not null default 'draft' check (formation_status in ('draft', 'submitted', 'filed', 'complete')),
  ein text,
  registered_agent_id uuid references public.registered_agents(id),
  foreign_owned boolean not null default false,
  formation_draft jsonb, -- Wizard state persisted as JSONB for resumable flow
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.businesses enable row level security;

create policy "businesses_select_own" on public.businesses
  for select using (auth.uid() = user_id);

create policy "businesses_insert_own" on public.businesses
  for insert with check (auth.uid() = user_id);

create policy "businesses_update_own" on public.businesses
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger businesses_updated_at
  before update on public.businesses
  for each row execute function public.handle_updated_at();


-- ══════════════════════════════════════════════════════════════════
-- 4. FORMATION APPLICATIONS
-- ══════════════════════════════════════════════════════════════════

create table public.formation_applications (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  status text not null default 'draft' check (status in (
    'draft', 'payment_pending', 'submitted_to_mygrationstation', 'filed_with_state', 'complete'
  )),
  state_fee_cents integer,
  articles_pdf_path text,
  operating_agreement_path text,
  submitted_at timestamptz,
  filed_at timestamptz,
  stripe_payment_intent_id text,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.formation_applications enable row level security;

-- User can read their own formation applications (join through businesses)
create policy "fa_select_own" on public.formation_applications
  for select using (
    exists (
      select 1 from public.businesses b
      where b.id = formation_applications.business_id
      and b.user_id = auth.uid()
    )
  );

create policy "fa_insert_own" on public.formation_applications
  for insert with check (
    exists (
      select 1 from public.businesses b
      where b.id = formation_applications.business_id
      and b.user_id = auth.uid()
    )
  );


-- ══════════════════════════════════════════════════════════════════
-- 5. EIN APPLICATIONS
-- ══════════════════════════════════════════════════════════════════

create table public.ein_applications (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  path text not null check (path in ('online_self', 'phone_assisted', 'fax_assisted')),
  status text not null default 'pending_info' check (status in (
    'pending_info', 'info_complete', 'fax_sent', 'received', 'failed'
  )),
  fax_sent_at timestamptz,
  ein_received_at timestamptz,
  cp575_path text,
  ein_encrypted text,
  itin_of_responsible_party text,
  ss4_pdf_path text,
  third_party_auth_path text,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.ein_applications enable row level security;

create policy "ein_select_own" on public.ein_applications
  for select using (
    exists (
      select 1 from public.businesses b
      where b.id = ein_applications.business_id
      and b.user_id = auth.uid()
    )
  );

create policy "ein_insert_own" on public.ein_applications
  for insert with check (
    exists (
      select 1 from public.businesses b
      where b.id = ein_applications.business_id
      and b.user_id = auth.uid()
    )
  );


-- ══════════════════════════════════════════════════════════════════
-- 6. DOCUMENTS
-- ══════════════════════════════════════════════════════════════════

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  business_id uuid references public.businesses(id) on delete cascade,
  document_type text not null check (document_type in (
    'articles_of_organization', 'operating_agreement', 'ein_letter',
    'boi_confirmation', 'form_5472_kit', 'annual_report',
    'passport', 'itin_letter', 'third_party_auth',
    'bank_statement', 'business_license', 'contract', 'other'
  )),
  display_name text not null,
  source text not null check (source in ('system_generated', 'user_uploaded', 'staff_uploaded')),
  storage_path text not null,
  file_size_bytes integer,
  mime_type text,
  expires_at timestamptz,
  alert_60d_sent boolean not null default false,
  alert_30d_sent boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.documents enable row level security;

create policy "docs_select_own" on public.documents
  for select using (auth.uid() = user_id);

create policy "docs_insert_own" on public.documents
  for insert with check (auth.uid() = user_id);

create policy "docs_update_own" on public.documents
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "docs_delete_own" on public.documents
  for delete using (auth.uid() = user_id);


-- ══════════════════════════════════════════════════════════════════
-- 7. COMPLIANCE EVENTS
-- ══════════════════════════════════════════════════════════════════

create table public.compliance_events (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  event_type text not null check (event_type in (
    'boi_report', 'form_5472',
    'quarterly_estimated_tax_q1', 'quarterly_estimated_tax_q2',
    'quarterly_estimated_tax_q3', 'quarterly_estimated_tax_q4',
    'annual_state_report', 'registered_agent_renewal', 'itin_renewal'
  )),
  due_date date not null,
  completed_at timestamptz,
  status text not null default 'upcoming' check (status in (
    'upcoming', 'due_soon', 'overdue', 'complete', 'not_applicable'
  )),
  alert_60d_sent boolean not null default false,
  alert_30d_sent boolean not null default false,
  document_id uuid references public.documents(id),
  notes text,
  created_at timestamptz not null default now()
);

alter table public.compliance_events enable row level security;

create policy "ce_select_own" on public.compliance_events
  for select using (
    exists (
      select 1 from public.businesses b
      where b.id = compliance_events.business_id
      and b.user_id = auth.uid()
    )
  );


-- ══════════════════════════════════════════════════════════════════
-- 8. BANKING APPLICATIONS
-- ══════════════════════════════════════════════════════════════════

create table public.banking_applications (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  bank_name text not null check (bank_name in (
    'mercury', 'relay', 'airwallex', 'wise', 'slash', 'nbkc', 'other'
  )),
  status text not null default 'matched' check (status in (
    'matched', 'packet_prepared', 'applied', 'approved', 'rejected'
  )),
  applied_at timestamptz,
  outcome_at timestamptz,
  rejection_reason text,
  referral_id text,
  created_at timestamptz not null default now()
);

alter table public.banking_applications enable row level security;

create policy "ba_select_own" on public.banking_applications
  for select using (
    exists (
      select 1 from public.businesses b
      where b.id = banking_applications.business_id
      and b.user_id = auth.uid()
    )
  );

create policy "ba_insert_own" on public.banking_applications
  for insert with check (
    exists (
      select 1 from public.businesses b
      where b.id = banking_applications.business_id
      and b.user_id = auth.uid()
    )
  );


-- ══════════════════════════════════════════════════════════════════
-- 9. SUBSCRIPTIONS
-- ══════════════════════════════════════════════════════════════════

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  stripe_subscription_id text unique not null,
  stripe_customer_id text not null,
  plan text not null check (plan in ('compliance_annual')),
  status text not null,
  current_period_end timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "subs_select_own" on public.subscriptions
  for select using (auth.uid() = user_id);

create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.handle_updated_at();


-- ══════════════════════════════════════════════════════════════════
-- 10. STORAGE BUCKET (private document vault)
-- ══════════════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents',
  'documents',
  false,
  52428800, -- 50MB max file size
  array['application/pdf', 'image/png', 'image/jpeg', 'image/webp',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Storage RLS: users can only access their own folder (user_id prefix)
create policy "storage_select_own" on storage.objects
  for select using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage_insert_own" on storage.objects
  for insert with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage_delete_own" on storage.objects
  for delete using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );


-- ══════════════════════════════════════════════════════════════════
-- 11. INDEXES
-- ══════════════════════════════════════════════════════════════════

create index idx_businesses_user_id on public.businesses(user_id);
create index idx_formation_applications_business_id on public.formation_applications(business_id);
create index idx_ein_applications_business_id on public.ein_applications(business_id);
create index idx_documents_user_id on public.documents(user_id);
create index idx_documents_business_id on public.documents(business_id);
create index idx_compliance_events_business_id on public.compliance_events(business_id);
create index idx_compliance_events_due_date on public.compliance_events(due_date);
create index idx_compliance_events_status on public.compliance_events(status);
create index idx_banking_applications_business_id on public.banking_applications(business_id);
create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_subscriptions_stripe_customer on public.subscriptions(stripe_customer_id);

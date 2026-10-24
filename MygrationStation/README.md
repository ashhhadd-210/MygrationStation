# MygrationStation — Immigrant-First Business Formation Platform

## What This Is

MygrationStation helps immigrants form US LLCs, obtain EINs without SSNs, and manage compliance — in 10 languages. This is the v1 foundation with Module 1 (LLC Formation Wizard) fully built.

## What's Included

### All 5 Modules + Full Infrastructure (81 files)

**Module 1 — LLC Formation Wizard** (Items 1-10)
- 8-step multi-step form with Supabase JSONB persistence (resumable from any device)
- 10 launch states fully populated (AZ, CA, TX, FL, NY, WY, DE, NV, WA, IL) with real filing fees
- Articles of Organization PDF generation via pdf-lib (10 state-specific templates)
- Operating Agreement generation (single-member + multi-member variants)
- DocuSeal e-signature integration (template upload, submission, webhook handler)
- Stripe Checkout (formation_only $149, formation_ein $249 + state fees)
- Post-payment pipeline: PDF gen → vault storage → compliance events → email via Resend
- Admin dashboard with formation queue + EIN task queue

**Module 2 — EIN Concierge**
- Three-path routing: online (SSN), phone-assisted (ITIN), fax-assisted (no SSN/ITIN)
- IRS Form SS-4 PDF generator pre-filled from formation data
- Application status tracking with step progress
- Admin queue for pending EIN tasks

**Module 3 — Document Vault**
- Private Supabase Storage with signed URLs (15-min expiry)
- Upload with MIME validation (PDF, PNG, JPG, DOCX, 50MB max)
- Category filtering, share links (24h/72h), delete
- Auto-populated from formation + EIN flows
- Expiration tracking with visual alerts

**Module 4 — Compliance Calendar**
- Month view (interactive calendar grid) + list view
- Color-coded urgency (overdue/due_soon/upcoming/complete)
- Status filtering with count badges
- Penalty information per event type
- Auto-generated at formation based on residency + foreign_owned + state
- Events: BOI (30 days), Form 5472 (April 15), quarterly taxes, annual reports, RA renewal

**Module 5 — Banking Onboarding**
- 5-question profiler determining bank compatibility
- Ranked recommendations from 6 banks: Mercury, Relay, Airwallex, Wise, Slash, NBKC
- Scoring algorithm based on SSN, US address, FDIC, intl wires, residency status
- Virtual mailbox upsell for non-residents
- Pros/cons per bank, "No SSN" and "FDIC" badges

### Infrastructure
- Next.js 14 App Router + TypeScript strict (no `any`)
- TailwindCSS with RTL plugin (Arabic support)
- next-intl with 10 locales (EN fully translated, ES fully translated, 8 stubs)
- Supabase: 9 tables + RLS + indexes + private storage bucket
- Middleware: locale detection + auth guards
- AES-256-GCM encryption for EIN/ITIN
- Stripe webhooks (checkout + subscriptions)
- DocuSeal webhooks (signature completion)
- Resend emails in user's language (4 email types)
- Reusable UI components (Button, ErrorBoundary)
- Zod validation schemas

## Setup Instructions

```bash
# 1. Clone and install
cd mygrationstation
npm install

# 2. Copy environment variables
cp .env.local.example .env.local
# Fill in all values

# 3. Set up Supabase
npx supabase init  # if not already done
npx supabase db push  # applies migrations

# 4. Generate encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Add to ENCRYPTION_KEY in .env.local

# 5. Run dev server
npm run dev
```

## Next Steps (to production)

| Priority | Task | Notes |
|----------|------|-------|
| 1 | Professional translation | 8 locale stubs need certified translation. Legal strings require legal translator review. |
| 2 | Stripe Dashboard setup | Create products/prices matching STRIPE_PRICES constants. Set up webhook endpoint. |
| 3 | Seed registered_agents | Populate with your RA partner data for all 10 launch states. |
| 4 | DocuSeal account | Create account, get API key, configure webhook URL. Test end-to-end signing. |
| 5 | Resend domain verification | Verify your sending domain for deliverability. |
| 6 | Supabase production setup | Create project, apply migration, set up storage bucket, configure auth. |
| 7 | eFax/Faxage integration | Get API credentials for SS-4 fax submission to IRS. |
| 8 | State PDF templates | Refine Articles of Organization templates per actual state forms. |
| 9 | Vercel deployment | Deploy, configure environment variables, set up custom domain. |
| 10 | Security audit | Penetration testing, RLS policy review, encryption key rotation setup. |

## File Count

48 source files across the project.

## Architecture Decisions

- **No localStorage for wizard state**: Form state persisted to Supabase JSONB, not browser storage. Users can resume from any device.
- **Server Components by default**: Only client components where interactivity requires it (wizard steps, sidebar).
- **Server Actions for mutations**: No API routes for form submissions. All mutations in `actions.ts`.
- **RLS on every table**: No exceptions. Admin uses service_role key server-side only.
- **Encryption at application layer**: EIN/ITIN encrypted with AES-256-GCM before hitting Postgres.

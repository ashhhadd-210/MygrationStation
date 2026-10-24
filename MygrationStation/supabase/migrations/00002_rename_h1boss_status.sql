-- Rename "submitted_to_h1boss" → "submitted_to_mygrationstation" in formation_applications status CHECK constraint
-- Run this against your live Supabase database (SQL Editor or supabase db push)

-- 1. Update any existing rows that use the old status value
UPDATE public.formation_applications
SET status = 'submitted_to_mygrationstation'
WHERE status = 'submitted_to_h1boss';

-- 2. Drop the old CHECK constraint and add the new one
ALTER TABLE public.formation_applications
  DROP CONSTRAINT IF EXISTS formation_applications_status_check;

ALTER TABLE public.formation_applications
  ADD CONSTRAINT formation_applications_status_check
  CHECK (status IN ('draft', 'payment_pending', 'submitted_to_mygrationstation', 'filed_with_state', 'complete'));

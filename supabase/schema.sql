create extension if not exists pgcrypto;

create table if not exists public.scans (
  id uuid primary key default gen_random_uuid(),
  input_type text not null check (
    input_type in (
      'job_url',
      'job_description',
      'recruiter_email',
      'job_offer'
    )
  ),
  input_value text not null,
  company_name text,
  job_title text,
  detected_email text,
  original_url text,
  final_url text,
  score integer not null check (score between 0 and 100),
  recommendation text not null check (
    recommendation in ('Apply', 'Verify First', 'High Caution')
  ),
  summary text,
  created_at timestamptz not null default now()
);

create table if not exists public.scan_signals (
  id uuid primary key default gen_random_uuid(),
  scan_id uuid not null references public.scans(id) on delete cascade,
  label text not null,
  status text not null check (status in ('positive', 'warning', 'unknown')),
  severity text not null check (severity in ('info', 'low', 'medium', 'high')),
  message text not null,
  evidence text,
  created_at timestamptz not null default now()
);

create index if not exists scan_signals_scan_id_idx
  on public.scan_signals(scan_id);

alter table public.scans enable row level security;
alter table public.scan_signals enable row level security;

-- The application uses the service role from server-only code. No public
-- policies are required for this MVP.

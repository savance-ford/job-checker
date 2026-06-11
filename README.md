# JobCheck

JobCheck is a lean, deterministic job-verification MVP. A visitor can submit a
job URL, job description, recruiter email, or offer message and receive a saved
trust report with a score, recommendation, and evidence checklist.

The checker reports observable signals. It does not claim that a job or company
is fraudulent, and it does not use an AI model.

## Stack

- Next.js App Router and TypeScript
- Tailwind CSS
- Supabase
- Zod

## Supabase setup

1. Create a Supabase project.
2. Open the SQL editor and run [`supabase/schema.sql`](supabase/schema.sql).
3. Copy `.env.example` to `.env.local`.
4. Add the project URL, anon key, and service role key:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://your-production-domain.example
```

`SUPABASE_SERVICE_ROLE_KEY` is used only by server-only modules. Never expose it
in browser code or commit `.env.local`.

The anon key is included for standard Supabase project configuration and future
client-side use. This MVP stores and reads reports through the server-side
service role because row-level security is enabled without public policies.

`NEXT_PUBLIC_SITE_URL` sets the canonical and Open Graph origin. On Vercel, the
app falls back to the production deployment hostname when this value is not set.

## Run locally

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful verification commands:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## API

`POST /api/scan`

```json
{
  "input": "Job title: Support Specialist...",
  "inputType": "job_description"
}
```

Accepted input types are `job_url`, `job_description`, `recruiter_email`, and
`job_offer`. Successful scans are saved to Supabase and return a
`/job-report/[id]` URL.

`GET /api/report/[id]` returns a saved scan with its signals or a 404 response
when the UUID is not found.

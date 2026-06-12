# JobCheck

JobCheck is a lean, deterministic job-verification MVP. A visitor can submit a
job URL, job description, recruiter email, or offer message and receive a saved
trust report with a score, recommendation, and evidence checklist.

The checker reports observable signals. It does not claim that a job or company
is fraudulent, and it does not use an AI model.

## Recommendation scale

- **Lower Risk**: The scan found fewer risk signals. This scan is not a
  guarantee, and the role should still be confirmed through the official
  company or ATS link.
- **Verify First**: Evidence found should be checked through the company's
  official careers page before continuing.
- **High Caution**: Multiple risk signals or verification gaps suggest pausing
  until the employer is independently verified.

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

Existing installations should rerun `supabase/schema.sql` to migrate stored
`Apply` recommendations, the database constraint to `Lower Risk`, and add the
company website and careers page columns.

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
npm test
npm run lint
npx tsc --noEmit
npm run build
```

## Privacy behavior

- Reports are public to anyone with the link.
- Full submitted text is stored for scan processing but is not returned by the
  public report API or shown on public report pages.
- Public reports show only derived fields such as input type, detected company
  and job title, email domain, and URL domains.
- Users should not paste Social Security numbers, banking details, home
  addresses, passwords, or other sensitive personal information.
- JobCheck provides risk signals, not legal or fraud determinations.

Privacy helper coverage is available through `npm test`. For a manual check,
open a saved report and confirm that it shows "Submitted content hidden for
privacy" and never displays the original pasted text, a full email address, or
a URL path/query string.

## Company website verification

Company website verification works best when the user provides the employer's
official website in the optional scan field. This MVP does not use a search API
to discover a company website.

When a website is provided, JobCheck checks whether it is reachable, reviews
common careers paths and relevant homepage links, and looks for a connection to
the detected Greenhouse, Lever, or Ashby provider where possible. Network
errors and missing careers pages are treated as incomplete evidence rather than
proof about the employer. Results are risk and verification signals, not
guarantees.

## API

`POST /api/scan`

```json
{
  "input": "Job title: Support Specialist...",
  "inputType": "job_description",
  "companyWebsite": "https://example.com"
}
```

Accepted input types are `job_url`, `job_description`, `recruiter_email`, and
`job_offer`. `companyWebsite` is optional and must be a valid HTTP or HTTPS URL
when provided. Successful scans are saved to Supabase and return a
`/job-report/[id]` URL.

`GET /api/report/[id]` returns a redacted saved report with its signals or a
404 response when the UUID is not found. It does not return `input_value`, full
email addresses, or full submitted URLs.

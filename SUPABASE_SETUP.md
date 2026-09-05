# AlexFisher membership and administrator guide

The live website is connected to Supabase. Authentication, the community database,
media storage, subscription records, administrator access, and production deployment
variables are configured.

## Open the control center

1. Sign in at `https://www.alexfisherofficial.com/login` with the owner account.
2. Open `https://www.alexfisherofficial.com/admin`.
3. You can also open **My account** and choose **Open administrator control center**.

Only a profile whose role is `admin` can load the control-center data or perform an
administrator action. The private Supabase key is stored only in the server deployment
environment and is never sent to the browser.

## Dashboard sections

- **Overview** — membership, subscriptions, marketing audience, community activity,
  upcoming expirations, suspended accounts, and uploaded-file totals.
- **Members** — search users, invite by email, change member/moderator/admin roles,
  suspend or restore access, assign a plan, and permanently delete an account.
- **Subscriptions** — review current and historical assignments, start/end dates,
  duration, renewal status, and cancellations.
- **Plans & access** — create or edit prices and durations, activate a plan, define
  included features, and add future website features.
- **Community** — review and remove posts across fishing, surfing, and kayaking.
- **Media** — review and permanently delete uploaded community photographs.
- **Marketing** — manage consent, lifecycle stages, search contacts, and export CSV.
- **Audit log** — see which administrator action occurred and when.
- **Settings** — operational guidance and links to Supabase and Vercel.

## Subscription workflow

Starter templates exist for free, one-month, two-month, three-month, and annual access.
They are free/draft values until prices and availability are deliberately configured.

To create another duration, open **Plans & access → New plan**, set the duration in
months, price, currency, and availability, then select which features it includes.
Use `0` months only for access that does not expire.

To give a plan to a member, open **Members** and choose the desired plan. The server
records a start date and calculates the expiration date from the plan duration.

## Important safeguards

- Deleting a member permanently removes the authentication account and related data.
- Deleting a community post also removes associated replies, reactions, and media.
- Keep at least one administrator account and never share the private service key.
- Marketing exports identify consent; only contact people who opted in.
- Manual plans do not collect money. Before charging customers, connect Stripe through
  verified server-side webhooks and add billing terms, taxes, invoices, and refunds.
- Configure branded SMTP before sending invitations or confirmation email at scale.

## Scaling

The structure supports growth, but capacity is not unlimited. Monitor Supabase database,
authentication, realtime, storage, and email usage, plus Vercel bandwidth and function
usage. Upgrade plans and add rate limits, moderation workflows, backups, observability,
and support processes before traffic reaches free-tier limits. A million-member service
requires deliberate database indexing, pagination, background jobs, abuse controls,
delivery providers, and a paid infrastructure plan.

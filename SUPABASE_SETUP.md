# AlexFisher membership setup

The membership code is ready, but it must be connected to a Supabase project before deployment.

## 1. Create the project

Create a Supabase project and keep its region close to the majority of members. In **Project Settings → API**, copy:

- Project URL
- Publishable key (never use the service-role key in the browser)

## 2. Create the membership database

Open **SQL Editor**, paste the complete contents of:

`supabase/migrations/202609050001_membership_community.sql`

Run it once. This creates profiles, private audience contacts, subscription-ready fields, community messages, replies, reactions, image storage, indexes, realtime, and row-level security.

## 3. Configure authentication

In **Authentication → URL Configuration** set:

- Site URL: `https://www.alexfisherofficial.com`
- Redirect URL: `https://www.alexfisherofficial.com/auth/callback`

Keep email confirmation enabled. Configure a custom SMTP provider before a large launch so confirmation emails reliably use the AlexFisher identity.

## 4. Configure deployment variables

Add these variables to Production, Preview, and Development in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Redeploy only after both variables are saved and the migration has succeeded.

## 5. Assign the first administrator

Create the owner's account through the website, then run this in Supabase SQL Editor using the owner's email:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'OWNER_EMAIL_HERE'
);
```

The owner can then open `/admin/audience` to review members and export a consent-aware CSV.

## Before charging members

Connect Stripe through server-side webhooks, map prices to the existing `plan` and `subscription_status` fields, publish Terms and Refund policies, and never unlock paid access based only on a browser response.

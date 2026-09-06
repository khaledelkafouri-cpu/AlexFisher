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
- **Learning** — create courses and curriculum sections; add, publish, archive, or
  delete lessons; connect video providers; upload private lesson resources; and choose
  which subscription plans can open each course.
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

## Academy workflow

Apply `supabase/migrations/202609052300_learning_management.sql` once in the Supabase
SQL editor. It creates the course database, learner progress, plan access, and the
private `course-resources` storage bucket.

Then open **Admin → Learning**:

1. Create or edit a course and choose `Published` only when it is ready.
2. Select its subscription plans under **Subscription access**. A course with no plan
   selected is available to every signed-in member.
3. Add curriculum sections and lessons. Draft lessons remain hidden.
4. For a video lesson, choose YouTube, Vimeo, Cloudflare Stream, Mux, or an embeddable
   hosted URL. Paste either the playback ID or URL, then publish the lesson.
5. Save a lesson before reopening it to upload PDFs, images, ZIP files, or add external
   links. Stored files remain private; members receive temporary signed download URLs.

Members see published content at `/learning`, and completed lessons are saved to their
accounts. For large-scale paid video, prefer Cloudflare Stream or Mux over storing raw
video in Supabase; both are built for adaptive streaming and high bandwidth.

## Learning Q&A and progress

Apply `supabase/migrations/202609060600_learning_questions.sql` in the same Supabase
project after the Academy migration. This adds persistent lesson questions and replies.
Until it is applied, Q&A displays an unavailable message; it does not pretend posts are saved.

Members open a lesson, select **Q&A** beside **Resources**, and post a question/comment.
**Comments & replies** opens the discussion under each question. Questions and replies
are paginated, preserve drafts after posting failures, and require an active membership
with access to the published lesson. Only display names are shown, not email addresses.
The tables are protected with RLS and accessed exclusively through the authenticated
server API. Administrators can inspect/moderate the tables in Supabase Table Editor.

The top **Your progress** circle now counts all unique published lessons across the
member's available courses: completed lessons / total lessons. The pop-up separately
shows each course's counts. Draft, archived and inaccessible lessons are excluded.
100% is displayed only when every available lesson has been completed. Publishing new
lessons changes the total on the next page load.

## Important safeguards

### Member profile settings

Members open **Account** in the bottom navigation or visit `/account`. Profile details
(display name, optional country/city and activities) and marketing consent save in
separate forms using the existing own-row Supabase policies. The fields already exist.
Before releasing these settings, apply
`supabase/migrations/202609061700_profile_settings_permissions.sql` in Supabase SQL
Editor after the existing admin and community migrations. It removes the older grant
that allowed authenticated users to change their own role, and protects moderation
status while preserving server-side admin updates and authorised community moderation.
This hardening migration has to be applied separately from a GitHub deployment.
Review existing administrator/moderator roles after applying it; the migration does
not change previously stored roles or detect historical misuse.
Optional profile fields are readable by signed-in members under the existing profile
policy; the settings page explains this before users enter location information.

The page includes password confirmation, optional Supabase reauthentication codes,
sign-out for this browser or other sessions, read-only membership status and a JSON
download of saved profile settings (not a full community/course-history export).
Language is a browser preference, not a synced account setting. Sign-in email is
read-only; self-service email changes, avatar uploads, deletion and billing controls
are not part of this settings release. Keep Supabase password security and email
delivery configured; other sessions can retain access until their access tokens expire.

### Administration

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

-- AlexFisher Academy: courses, curriculum, resources, access and progress.
create extension if not exists pgcrypto;

create table if not exists public.learning_courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title_en text not null,
  title_ar text not null default '',
  description_en text not null default '',
  description_ar text not null default '',
  level text not null default 'Beginner',
  thumbnail_url text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.learning_sections (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.learning_courses(id) on delete cascade,
  title_en text not null,
  title_ar text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.learning_lessons (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.learning_sections(id) on delete cascade,
  title_en text not null,
  title_ar text not null default '',
  description_en text not null default '',
  description_ar text not null default '',
  lesson_type text not null default 'video' check (lesson_type in ('video','article','quiz')),
  video_provider text not null default 'external' check (video_provider in ('external','youtube','vimeo','cloudflare_stream','mux')),
  video_url text,
  video_id text,
  article_body text not null default '',
  duration_minutes integer not null default 0 check (duration_minutes >= 0),
  is_preview boolean not null default false,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.learning_resources (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.learning_lessons(id) on delete cascade,
  title text not null,
  resource_type text not null default 'file' check (resource_type in ('file','link')),
  storage_path text,
  external_url text,
  file_name text,
  mime_type text,
  size_bytes bigint,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint learning_resource_location check (
    (resource_type = 'file' and storage_path is not null) or
    (resource_type = 'link' and external_url is not null)
  )
);

create table if not exists public.course_plan_access (
  course_id uuid not null references public.learning_courses(id) on delete cascade,
  plan_code text not null references public.subscription_plans(code) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (course_id, plan_code)
);

create table if not exists public.learning_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.learning_lessons(id) on delete cascade,
  completed boolean not null default false,
  progress_seconds integer not null default 0 check (progress_seconds >= 0),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create index if not exists learning_sections_course_sort_idx on public.learning_sections(course_id, sort_order);
create index if not exists learning_lessons_section_sort_idx on public.learning_lessons(section_id, sort_order);
create index if not exists learning_resources_lesson_sort_idx on public.learning_resources(lesson_id, sort_order);
create index if not exists learning_progress_user_idx on public.learning_progress(user_id);

alter table public.learning_courses enable row level security;
alter table public.learning_sections enable row level security;
alter table public.learning_lessons enable row level security;
alter table public.learning_resources enable row level security;
alter table public.course_plan_access enable row level security;
alter table public.learning_progress enable row level security;

grant select on public.learning_courses, public.learning_sections, public.learning_lessons, public.learning_resources, public.course_plan_access to authenticated;
grant select, insert, update, delete on public.learning_progress to authenticated;
grant all on public.learning_courses, public.learning_sections, public.learning_lessons, public.learning_resources, public.course_plan_access, public.learning_progress to service_role;

create policy "members read published courses" on public.learning_courses for select to authenticated using (status = 'published' or public.is_admin());
create policy "members read published course sections" on public.learning_sections for select to authenticated using (
  exists (select 1 from public.learning_courses c where c.id = course_id and (c.status = 'published' or public.is_admin()))
);
create policy "members read published lessons" on public.learning_lessons for select to authenticated using (
  status = 'published' and exists (
    select 1 from public.learning_sections s join public.learning_courses c on c.id = s.course_id
    where s.id = section_id and c.status = 'published'
  ) or public.is_admin()
);
create policy "members read published resources" on public.learning_resources for select to authenticated using (
  exists (select 1 from public.learning_lessons l where l.id = lesson_id and l.status = 'published') or public.is_admin()
);
create policy "members read course access" on public.course_plan_access for select to authenticated using (true);
create policy "members read own progress" on public.learning_progress for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "members add own progress" on public.learning_progress for insert to authenticated with check (user_id = auth.uid());
create policy "members update own progress" on public.learning_progress for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('course-resources','course-resources',false,52428800,array['application/pdf','application/zip','text/plain','image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=false, file_size_limit=excluded.file_size_limit, allowed_mime_types=excluded.allowed_mime_types;

create policy "admins upload course resources" on storage.objects for insert to authenticated with check (bucket_id='course-resources' and public.is_admin());
create policy "admins update course resources" on storage.objects for update to authenticated using (bucket_id='course-resources' and public.is_admin());
create policy "admins delete course resources" on storage.objects for delete to authenticated using (bucket_id='course-resources' and public.is_admin());

insert into public.learning_courses (slug,title_en,title_ar,description_en,description_ar,level,status,sort_order)
values
('rods','Fishing Rods','قصبات الصيد','Choose the right length, power, action and casting weight.','اختار الطول والقوة والأكشن ووزن الرمي المناسب.','Beginner','published',10),
('reels','Fishing Reels','ماكينات الصيد','Select, set up and maintain the right reel for the job.','اختار ماكينة الصيد المناسبة، جهزها وحافظ عليها.','Beginner','published',20),
('hooks','Hooks','السنار','Match hook shape, size and strength to bait and target fish.','طابق شكل وحجم وقوة السن مع الطُعم والسمكة.','Beginner','published',30),
('lures','Lures & Jigs','الطعوم والجيج','Choose lure type, colour, depth and retrieve for the conditions.','اختار النوع واللون والعمق وطريقة السحب حسب الظروف.','Intermediate','published',40),
('braid','Braided Line','الخيط المجدول','Understand PE rating, strength, leaders, knots and spool setup.','افهم تصنيف PE والقوة والليدر والعُقد وتجهيز البكرة.','Intermediate','published',50)
on conflict (slug) do nothing;

insert into public.learning_sections (course_id,title_en,title_ar,sort_order)
select c.id, v.en, v.ar, v.pos from public.learning_courses c cross join lateral (
  values
    ('Foundations','الأساسيات',10),
    ('Choose and set up','الاختيار والتجهيز',20),
    ('Care and practice','العناية والتطبيق',30)
) as v(en,ar,pos)
where not exists (select 1 from public.learning_sections s where s.course_id=c.id);

insert into public.learning_lessons (section_id,title_en,title_ar,description_en,duration_minutes,is_preview,status,sort_order)
select s.id,
  case c.slug when 'rods' then 'Rod parts and terminology' when 'reels' then 'Reel types explained' when 'hooks' then 'Hook anatomy and sizes' when 'lures' then 'Hard lures, plastics and jigs' else 'Diameter, PE and strand count' end,
  case c.slug when 'rods' then 'أجزاء القصبة والمصطلحات' when 'reels' then 'شرح أنواع ماكينات الصيد' when 'hooks' then 'أجزاء السن ومقاساته' when 'lures' then 'الطعوم الصلبة والسيليكون والجيج' else 'القطر وتصنيف PE وعدد الخيوط' end,
  c.description_en, 8, true, 'published', 10
from public.learning_sections s join public.learning_courses c on c.id=s.course_id
where s.sort_order=10 and not exists (select 1 from public.learning_lessons l where l.section_id=s.id);

insert into public.feature_catalog(feature_key,name,category,description,is_active)
values ('learning-academy','Learning Academy','Learning','Access published courses, lessons and resources.',true)
on conflict (feature_key) do update set name=excluded.name, category=excluded.category, description=excluded.description, is_active=true;

insert into public.plan_features(plan_code,feature_key,enabled)
values ('free','learning-academy',true)
on conflict (plan_code,feature_key) do update set enabled=true;

insert into public.course_plan_access(course_id,plan_code)
select id,'free' from public.learning_courses
on conflict do nothing;

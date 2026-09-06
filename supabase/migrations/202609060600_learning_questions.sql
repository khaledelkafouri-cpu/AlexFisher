-- Lesson discussions are accessed through the authenticated Learning API.
create table if not exists public.learning_questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.learning_lessons(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 4000),
  created_at timestamptz not null default now(),
  unique(id,lesson_id)
);
create table if not exists public.learning_replies (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null,
  lesson_id uuid not null references public.learning_lessons(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 4000),
  created_at timestamptz not null default now(),
  foreign key (question_id,lesson_id) references public.learning_questions(id,lesson_id) on delete cascade
);
create index if not exists learning_questions_lesson_created_idx on public.learning_questions(lesson_id,created_at desc,id desc);
create index if not exists learning_replies_question_created_idx on public.learning_replies(question_id,created_at,id);
alter table public.learning_questions enable row level security;
alter table public.learning_replies enable row level security;
revoke all on public.learning_questions, public.learning_replies from anon,authenticated;
grant select,insert,update,delete on public.learning_questions,public.learning_replies to service_role;

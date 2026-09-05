alter table public.profiles add column if not exists banned boolean not null default false;

grant update(banned,role) on public.profiles to authenticated;

drop policy if exists "admin manage member status" on public.profiles;
create policy "admin manage member status" on public.profiles for update to authenticated
  using(exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in('moderator','admin')))
  with check(exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in('moderator','admin')));

drop policy if exists "create messages" on public.community_messages;
create policy "create messages" on public.community_messages for insert to authenticated
  with check(author_id=auth.uid() and not exists(select 1 from public.profiles where id=auth.uid() and banned=true));

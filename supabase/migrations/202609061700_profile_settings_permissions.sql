-- Profile editing must not grant members authority over roles or account status.
-- Remove any table-level UPDATE grant before applying a column allowlist.
revoke update on public.profiles from authenticated, anon, public;
revoke update(role, account_status) on public.profiles from authenticated, anon, public;
grant update(display_name, avatar_url, interests, country, city, updated_at, banned)
  on public.profiles to authenticated;

-- The community uses direct authenticated updates to moderate members.
-- The own-profile RLS policy must not let ordinary members unban themselves.
create or replace function public.guard_profile_authority()
returns trigger language plpgsql security definer set search_path = '' as $$
declare actor_role text;
begin
  -- Server-side admin actions retain their existing authority.
  if auth.role() = 'service_role' then return new; end if;
  -- Permit maintenance through SQL, but not through anonymous/authenticated JWTs.
  if auth.uid() is null and coalesce(auth.role(), '') not in ('anon','authenticated') then
    return new;
  end if;
  if new.role is distinct from old.role
    or new.account_status is distinct from old.account_status then
    raise exception 'Account authority can only be changed by the admin service';
  end if;
  if new.banned is distinct from old.banned then
    select role into actor_role from public.profiles where id = auth.uid();
    if coalesce(actor_role, '') not in ('admin','moderator')
      or old.id = auth.uid()
      or (actor_role = 'moderator' and old.role <> 'member') then
      raise exception 'You cannot change this member moderation status';
    end if;
  end if;
  return new;
end;
$$;
revoke all on function public.guard_profile_authority() from public, anon, authenticated;
drop trigger if exists guard_profile_authority on public.profiles;
create trigger guard_profile_authority before update on public.profiles
  for each row execute function public.guard_profile_authority();

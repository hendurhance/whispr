-- Replaces the edge function's read-then-write, which loses views when two visits land together.
create or replace function public.record_profile_view(p_username text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_views integer;
begin
  update profiles
     set total_views = coalesce(total_views, 0) + 1
   where username = lower(p_username)
  returning user_id, total_views into v_user_id, v_views;

  if v_user_id is null then
    return null;
  end if;

  insert into weekly_stats (user_id, date, views, whisprs)
  values (v_user_id, current_date, 1, 0)
  on conflict (user_id, date)
  do update set views = coalesce(weekly_stats.views, 0) + 1, updated_at = now();

  return v_views;
end;
$$;

-- Only the update-profile-views edge function (service role) may count views.
revoke execute on function public.record_profile_view(text) from public, anon, authenticated;
grant execute on function public.record_profile_view(text) to service_role;

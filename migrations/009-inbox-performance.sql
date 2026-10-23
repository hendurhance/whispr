-- Matches the inbox query: where user_id = ? and status = 'active' order by created_at desc.
create index if not exists idx_whisprs_inbox on whisprs (user_id, status, created_at desc);

-- user_id is covered by idx_whisprs_inbox; type and is_read are too low-cardinality to help.
drop index if exists idx_whisprs_user_id;
drop index if exists idx_whisprs_type;
drop index if exists idx_whisprs_is_read;

-- (select auth.uid()) is evaluated once per query instead of once per row.
drop policy if exists "Users can view their own whisprs" on whisprs;
create policy "Users can view their own whisprs" on whisprs
  for select using ((select auth.uid()) = user_id);

create or replace function public.get_inbox_summary()
returns json
language sql
stable
security invoker
set search_path = public
as $$
  select json_build_object(
    'total', coalesce(sum(n), 0),
    'unread', coalesce(sum(unread), 0),
    'byType', coalesce(json_object_agg(type, n), '{}'::json)
  )
  from (
    select type, count(*) as n, count(*) filter (where is_read is not true) as unread
      from whisprs
     where user_id = (select auth.uid())
       and status = 'active'
     group by type
  ) t;
$$;

revoke all on function public.get_inbox_summary() from public, anon;
grant execute on function public.get_inbox_summary() to authenticated;

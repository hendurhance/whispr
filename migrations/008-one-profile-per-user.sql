-- Preview what will be deleted before running (kept row is rn = 1):
--
-- select p.user_id, p.username, p.created_at, u.raw_user_meta_data->>'username' as metadata_username,
--        row_number() over (
--          partition by p.user_id
--          order by (p.username = u.raw_user_meta_data->>'username') desc nulls last, p.created_at asc
--        ) as rn
--   from profiles p
--   join auth.users u on u.id = p.user_id
--  where p.user_id in (select user_id from profiles group by user_id having count(*) > 1)
--  order by p.user_id, rn;

begin;

-- Keep the profile whose username matches the one setup wrote to auth metadata; else the oldest.
with ranked as (
  select p.id,
         row_number() over (
           partition by p.user_id
           order by (p.username = u.raw_user_meta_data->>'username') desc nulls last, p.created_at asc
         ) as rn
    from profiles p
    join auth.users u on u.id = p.user_id
)
delete from profiles
 where id in (select id from ranked where rn > 1);

alter table profiles add constraint profiles_user_id_key unique (user_id);

create or replace function public.submit_anonymous_whispr(
  recipient_username text,
  whispr_content text,
  whispr_type text
) returns uuid as $$
declare
  recipient_id uuid;
  recipient_allows_anonymous boolean;
  new_whispr_id uuid;
  v_content text := btrim(coalesce(whispr_content, ''));
begin

  if length(v_content) < 1 or length(v_content) > 500 then
    raise exception 'Message must be between 1 and 500 characters';
  end if;
  if whispr_type not in ('question','compliment','roast','confession','rumor','suggestion','secret','hot_take','dare') then
    raise exception 'Invalid whispr type';
  end if;

  select user_id, allow_anonymous into recipient_id, recipient_allows_anonymous
    from profiles
   where username = recipient_username;
  if recipient_id is null then
    return null;
  end if;

  if not coalesce(recipient_allows_anonymous, true) then
    raise exception 'This user is not accepting messages right now';
  end if;

  if not check_rate_limit('to:' || lower(recipient_username), 40, 60) then
    raise exception 'Too many messages for this user right now. Try again in a moment.';
  end if;

  insert into whisprs (id, user_id, content, type)
  values (uuid_generate_v4(), recipient_id, v_content, whispr_type)
  returning id into new_whispr_id;

  update profiles set total_whisprs = total_whisprs + 1 where user_id = recipient_id;

  insert into weekly_stats (user_id, date, whisprs)
  values (recipient_id, current_date, 1)
  on conflict (user_id, date) do update set whisprs = weekly_stats.whisprs + 1;

  return new_whispr_id;
end;
$$ language plpgsql security definer;

commit;

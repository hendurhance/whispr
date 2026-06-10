create table if not exists rate_limit_hits (
  bucket text not null,
  ts timestamptz not null default now()
);
create index if not exists idx_rate_limit_hits_bucket_ts on rate_limit_hits (bucket, ts);
alter table rate_limit_hits enable row level security;

create or replace function public.check_rate_limit(bucket text, max_hits int, window_seconds int)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
begin

  delete from rate_limit_hits
   where rate_limit_hits.bucket = check_rate_limit.bucket
     and ts < now() - make_interval(secs => window_seconds);

  select count(*) into v_count
    from rate_limit_hits
   where rate_limit_hits.bucket = check_rate_limit.bucket;

  if v_count >= max_hits then
    return false;
  end if;

  insert into rate_limit_hits (bucket) values (check_rate_limit.bucket);
  return true;
end;
$$;

revoke all on function public.check_rate_limit(text, int, int) from public;
grant execute on function public.check_rate_limit(text, int, int) to anon, authenticated;

create or replace function public.submit_anonymous_whispr(
  recipient_username text,
  whispr_content text,
  whispr_type text
) returns uuid as $$
declare
  recipient_id uuid;
  new_whispr_id uuid;
  v_content text := btrim(coalesce(whispr_content, ''));
begin

  if length(v_content) < 1 or length(v_content) > 500 then
    raise exception 'Message must be between 1 and 500 characters';
  end if;
  if whispr_type not in ('question','compliment','roast','confession','rumor','suggestion','secret','hot_take','dare') then
    raise exception 'Invalid whispr type';
  end if;

  select user_id into recipient_id from profiles where username = recipient_username;
  if recipient_id is null then
    return null;
  end if;

  if not coalesce((select allow_anonymous from profiles where user_id = recipient_id), true) then
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

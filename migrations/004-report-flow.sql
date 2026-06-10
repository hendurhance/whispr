alter table whisprs
  add column if not exists status text not null default 'active';

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'whisprs_status_check') then
    alter table whisprs add constraint whisprs_status_check check (status in ('active', 'reported', 'removed'));
  end if;
end $$;

create table if not exists content_reports (
  id uuid primary key default gen_random_uuid(),
  whispr_id uuid not null references whisprs(id) on delete cascade,
  reporter_id uuid references auth.users(id) on delete set null,
  reason text not null,
  status text not null default 'open' check (status in ('open', 'reviewed', 'actioned', 'dismissed')),
  created_at timestamptz not null default now()
);

alter table content_reports enable row level security;

create index if not exists idx_content_reports_open on content_reports (created_at) where status = 'open';

create or replace function report_whispr(whispr_id uuid, reason text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner uuid;
begin
  select w.user_id into v_owner from whisprs w where w.id = report_whispr.whispr_id;
  if v_owner is null or v_owner <> auth.uid() then
    return false;
  end if;

  insert into content_reports (whispr_id, reporter_id, reason)
  values (report_whispr.whispr_id, auth.uid(), coalesce(nullif(btrim(report_whispr.reason), ''), 'unspecified'));

  update whisprs w set status = 'reported' where w.id = report_whispr.whispr_id;
  return true;
end;
$$;

revoke all on function report_whispr(uuid, text) from public;
grant execute on function report_whispr(uuid, text) to authenticated;

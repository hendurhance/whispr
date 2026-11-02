alter table whisprs
  add column if not exists answer text,
  add column if not exists answered_at timestamptz;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'whisprs_answer_length') then
    alter table whisprs add constraint whisprs_answer_length check (char_length(answer) <= 280);
  end if;
end $$;

-- An empty answer clears it. Returns false when the whispr is not the caller's.
create or replace function public.answer_whispr(whispr_id uuid, answer text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_answer text := nullif(btrim(coalesce(answer_whispr.answer, '')), '');
begin
  if char_length(v_answer) > 280 then
    raise exception 'Answer must be 280 characters or less';
  end if;

  update whisprs w
     set answer = v_answer,
         answered_at = case when v_answer is null then null else now() end
   where w.id = answer_whispr.whispr_id
     and w.user_id = auth.uid();

  return found;
end;
$$;

revoke execute on function public.answer_whispr(uuid, text) from public, anon;
grant execute on function public.answer_whispr(uuid, text) to authenticated;

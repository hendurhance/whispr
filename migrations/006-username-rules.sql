create or replace function public.enforce_username_rules()
returns trigger
language plpgsql
as $$
begin

  if tg_op = 'UPDATE' and new.username is not distinct from old.username then
    return new;
  end if;

  if new.username is null or new.username !~* '^[a-z0-9_]{3,20}$' then
    raise exception 'Invalid username: 3–20 characters, letters, numbers and underscore only';
  end if;

  if lower(new.username) = any (array[
    'admin','administrator','root','system','support','help',
    'dashboard','settings','stats','profile','auth','login','logout',
    'signup','register','api','static','public','private',
    'whispr','whisper','trywhispr','official','mod','moderator',
    'staff','team','security','abuse','null','undefined',
    'terms','privacy','about','contact','feedback','setup-profile',
    'for','vs','blog','prompts','safety','for-creators','confessions','anonymous-questions','anonymous-feedback',
    'anonymous-compliments','anonymous-roasts','anonymous-dares','anonymous-secrets',
    'anonymous-hot-takes','ngl-alternative'
  ]) then
    raise exception 'That username is reserved and cannot be used';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_enforce_username_rules on profiles;
create trigger trg_enforce_username_rules
  before insert or update of username on profiles
  for each row execute function enforce_username_rules();

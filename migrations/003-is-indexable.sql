alter table profiles
  add column if not exists is_indexable boolean not null default true;

create index if not exists idx_profiles_is_indexable
  on profiles (is_indexable)
  where is_indexable = true;

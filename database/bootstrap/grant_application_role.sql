-- Run as the hosseintalab_owner role after 001_initial_commerce.sql.
-- The app role is intentionally given data access only: no schema changes,
-- no database ownership, and no access to unrelated databases.

begin;

do $$
begin
  execute format('revoke all on database %I from public', current_database());
end;
$$;
revoke all on schema public from public;
revoke all on schema hosseintalab from public;
revoke all on all tables in schema hosseintalab from public;
revoke all on all sequences in schema hosseintalab from public;
revoke all on all functions in schema hosseintalab from public;

do $$
begin
  execute format('grant connect on database %I to hosseintalab_app', current_database());
end;
$$;
-- citext is installed in public. Usage is safe; CREATE remains revoked.
grant usage on schema public to hosseintalab_app;
grant usage on schema hosseintalab to hosseintalab_app;
grant select, insert, update, delete on all tables in schema hosseintalab to hosseintalab_app;
grant usage, select on all sequences in schema hosseintalab to hosseintalab_app;
grant execute on all functions in schema hosseintalab to hosseintalab_app;

do $$
declare
  type_record record;
begin
  for type_record in
    select t.oid::regtype as type_name
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'hosseintalab'
      and t.typtype in ('b', 'e')
      and t.typelem = 0
  loop
    execute format('revoke usage on type %s from public', type_record.type_name);
    execute format('grant usage on type %s to hosseintalab_app', type_record.type_name);
  end loop;
end;
$$;

alter default privileges for role hosseintalab_owner in schema hosseintalab
  grant select, insert, update, delete on tables to hosseintalab_app;
alter default privileges for role hosseintalab_owner in schema hosseintalab
  grant usage, select on sequences to hosseintalab_app;
alter default privileges for role hosseintalab_owner in schema hosseintalab
  grant execute on functions to hosseintalab_app;

commit;

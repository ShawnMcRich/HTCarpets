-- Allow catalog-only products to carry a public USD price.
-- Checkout remains Toman-only; USD-priced products must stay non-orderable.

begin;

set local search_path = hosseintalab, public;

alter table products
  add column if not exists price_usd integer;

do $$
declare
  constraint_record record;
begin
  for constraint_record in
    select conname
    from pg_constraint
    where conrelid = 'hosseintalab.products'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%price_visibility%'
      and pg_get_constraintdef(oid) ilike '%price_toman%'
  loop
    execute format(
      'alter table hosseintalab.products drop constraint %I',
      constraint_record.conname
    );
  end loop;
end;
$$;

alter table products
  drop constraint if exists products_price_usd_check,
  drop constraint if exists products_single_catalog_price_check,
  drop constraint if exists products_public_price_check;

alter table products
  add constraint products_price_usd_check
    check (price_usd is null or price_usd >= 0),
  add constraint products_single_catalog_price_check
    check (num_nonnulls(price_toman, price_usd) <= 1),
  add constraint products_public_price_check
    check (price_visibility <> 'public' or num_nonnulls(price_toman, price_usd) = 1);

comment on column products.price_usd is
  'Whole US dollars for public catalog display; USD products are not supported by the Toman checkout flow.';

commit;

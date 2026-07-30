-- Hosseintalab inventory, customer, and commerce foundation.
-- Apply to a new managed Supabase project before connecting the storefront.

begin;

create extension if not exists pgcrypto;

create type public.product_collection as enum ('home', 'antique');
create type public.product_status as enum ('draft', 'active', 'reserved', 'sold', 'archived');
create type public.product_shape as enum ('rectangular', 'runner', 'round', 'oval', 'other');
create type public.age_category as enum ('contemporary', 'old', 'semi_antique', 'antique', 'unknown');
create type public.dye_type as enum ('vegetable', 'natural', 'synthetic', 'mixed', 'unknown');
create type public.price_visibility as enum ('public', 'inquiry_only', 'private');
create type public.money_unit as enum ('toman');
create type public.material_role as enum ('pile', 'warp', 'weft', 'fringe', 'other');
create type public.product_image_kind as enum (
  'full_frontal', 'three_quarter', 'corner', 'field_detail', 'border_detail',
  'fringe', 'condition', 'in_room', 'other'
);
create type public.inventory_movement_type as enum (
  'received', 'adjustment', 'sold', 'returned', 'damaged', 'write_off'
);
create type public.reservation_status as enum ('active', 'released', 'fulfilled', 'expired');
create type public.profile_role as enum ('customer', 'staff', 'admin');
create type public.order_status as enum (
  'draft', 'awaiting_payment', 'paid', 'confirmed', 'fulfillment', 'shipped',
  'delivered', 'cancelled', 'refunded'
);
create type public.payment_status as enum ('pending', 'authorized', 'paid', 'failed', 'refunded', 'cancelled');

create table public.origins (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name_fa text not null unique,
  name_en text,
  province_fa text,
  description_fa text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.patterns (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name_fa text not null unique,
  name_en text,
  description_fa text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.materials (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[a-z0-9_]+$'),
  name_fa text not null unique,
  name_en text not null,
  description_fa text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.materials (code, name_fa, name_en, description_fa) values
  ('wool', 'پشم', 'Wool', 'پشم طبیعی'),
  ('silk', 'ابریشم', 'Silk', 'ابریشم طبیعی'),
  ('kork_wool', 'کرک', 'Kork wool', 'پشم نرم و ظریف، معمولاً کرک بره'),
  ('cotton', 'پنبه', 'Cotton', 'پنبه، معمولاً برای چله یا پود'),
  ('mixed', 'ترکیبی', 'Mixed', 'ترکیب بیش از یک الیاف'),
  ('other', 'سایر', 'Other', 'نیازمند توضیح تکمیلی');

create table public.products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique check (sku ~ '^[A-Za-z0-9][A-Za-z0-9_-]{2,63}$'),
  collection public.product_collection not null,
  status public.product_status not null default 'draft',
  title_fa text not null,
  title_en text,
  description_fa text,
  origin_id uuid references public.origins(id) on delete set null,
  pattern_id uuid references public.patterns(id) on delete set null,
  shape public.product_shape not null default 'rectangular',
  width_cm numeric(8, 2) check (width_cm is null or width_cm > 0),
  length_cm numeric(8, 2) check (length_cm is null or length_cm > 0),
  diameter_cm numeric(8, 2) check (diameter_cm is null or diameter_cm > 0),
  dimension_note_fa text,
  weaving_year_shamsi integer check (weaving_year_shamsi is null or weaving_year_shamsi between 1000 and 1600),
  weaving_year_note_fa text,
  age_years integer check (age_years is null or age_years >= 0),
  age_confidence smallint check (age_confidence is null or age_confidence between 1 and 5),
  age_category public.age_category generated always as (
    case
      when age_years is null then 'unknown'::public.age_category
      when age_years < 20 then 'contemporary'::public.age_category
      when age_years < 50 then 'old'::public.age_category
      when age_years < 100 then 'semi_antique'::public.age_category
      else 'antique'::public.age_category
    end
  ) stored,
  dye_type public.dye_type not null default 'unknown',
  condition_note_fa text,
  restoration_note_fa text,
  provenance_note_fa text,
  price_toman bigint check (price_toman is null or price_toman >= 0),
  price_visibility public.price_visibility not null default 'inquiry_only',
  orderable boolean not null default false,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (shape not in ('round', 'oval') or diameter_cm is not null or (width_cm is not null and length_cm is not null)),
  check (price_visibility <> 'public' or price_toman is not null)
);

create table public.product_materials (
  product_id uuid not null references public.products(id) on delete cascade,
  material_id uuid not null references public.materials(id) on delete restrict,
  role public.material_role not null,
  note_fa text,
  primary key (product_id, material_id, role)
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null unique,
  kind public.product_image_kind not null default 'other',
  alt_fa text not null,
  sort_order smallint not null default 0 check (sort_order >= 0),
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index product_images_one_primary_per_product
  on public.product_images(product_id)
  where is_primary;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.profile_role not null default 'customer',
  full_name text,
  phone_e164 text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  recipient_name text not null,
  phone_e164 text not null,
  province_fa text not null,
  city_fa text not null,
  address_line1 text not null,
  address_line2 text,
  postal_code text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index customer_addresses_one_default_per_customer
  on public.customer_addresses(customer_id)
  where is_default;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity unique,
  customer_id uuid not null references public.profiles(id) on delete restrict,
  status public.order_status not null default 'draft',
  money_unit public.money_unit not null default 'toman',
  subtotal_toman bigint not null default 0 check (subtotal_toman >= 0),
  delivery_toman bigint not null default 0 check (delivery_toman >= 0),
  discount_toman bigint not null default 0 check (discount_toman >= 0),
  total_toman bigint generated always as (subtotal_toman + delivery_toman - discount_toman) stored,
  shipping_address jsonb,
  customer_note text,
  internal_note text,
  placed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (subtotal_toman + delivery_toman >= discount_toman)
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  sku_snapshot text not null,
  title_fa_snapshot text not null,
  dimension_snapshot_fa text,
  unit_price_toman bigint not null check (unit_price_toman >= 0),
  quantity integer not null check (quantity > 0),
  line_total_toman bigint generated always as (unit_price_toman * quantity) stored,
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null,
  provider_reference text unique,
  status public.payment_status not null default 'pending',
  amount_toman bigint not null check (amount_toman >= 0),
  gateway_payload jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete restrict,
  order_item_id uuid references public.order_items(id) on delete set null,
  movement_type public.inventory_movement_type not null,
  quantity_delta integer not null check (quantity_delta <> 0),
  note_fa text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.stock_reservations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete restrict,
  order_item_id uuid not null unique references public.order_items(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  status public.reservation_status not null default 'active',
  expires_at timestamptz not null,
  released_at timestamptz,
  created_at timestamptz not null default now(),
  check ((status = 'active' and released_at is null) or status <> 'active')
);

create index products_catalog_filter_idx
  on public.products(status, collection, origin_id, pattern_id, age_category);
create index product_images_product_sort_idx
  on public.product_images(product_id, sort_order);
create index inventory_movements_product_idx
  on public.inventory_movements(product_id, created_at);
create index stock_reservations_available_idx
  on public.stock_reservations(product_id, expires_at)
  where status = 'active';
create index orders_customer_created_idx
  on public.orders(customer_id, created_at desc);
create index order_items_order_idx
  on public.order_items(order_id);

create view public.inventory_balance as
select
  product_id,
  coalesce(sum(quantity_delta), 0)::integer as quantity_available
from public.inventory_movements
group by product_id;

create view public.inventory_availability as
with stock as (
  select product_id, coalesce(sum(quantity_delta), 0)::integer as quantity_on_hand
  from public.inventory_movements
  group by product_id
), reserved as (
  select product_id, coalesce(sum(quantity), 0)::integer as quantity_reserved
  from public.stock_reservations
  where status = 'active' and expires_at > now()
  group by product_id
)
select
  stock.product_id,
  stock.quantity_on_hand,
  coalesce(reserved.quantity_reserved, 0)::integer as quantity_reserved,
  greatest(stock.quantity_on_hand - coalesce(reserved.quantity_reserved, 0), 0)::integer as quantity_available
from stock
left join reserved using (product_id);

-- PostgreSQL 15+ lets views respect the caller's RLS policies. Supabase runs
-- on a current PostgreSQL version; the version guard also keeps this migration
-- parseable in local PostgreSQL 14 development environments.
do $$
begin
  if current_setting('server_version_num')::integer >= 150000 then
    execute 'alter view public.inventory_balance set (security_invoker = true)';
    execute 'alter view public.inventory_availability set (security_invoker = true)';
  end if;
end;
$$;

create function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('staff', 'admin')
  );
$$;

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger set_origins_updated_at before update on public.origins
for each row execute function public.set_updated_at();
create trigger set_patterns_updated_at before update on public.patterns
for each row execute function public.set_updated_at();
create trigger set_materials_updated_at before update on public.materials
for each row execute function public.set_updated_at();
create trigger set_products_updated_at before update on public.products
for each row execute function public.set_updated_at();
create trigger set_profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger set_customer_addresses_updated_at before update on public.customer_addresses
for each row execute function public.set_updated_at();
create trigger set_orders_updated_at before update on public.orders
for each row execute function public.set_updated_at();
create trigger set_payments_updated_at before update on public.payments
for each row execute function public.set_updated_at();
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.origins enable row level security;
alter table public.patterns enable row level security;
alter table public.materials enable row level security;
alter table public.products enable row level security;
alter table public.product_materials enable row level security;
alter table public.product_images enable row level security;
alter table public.profiles enable row level security;
alter table public.customer_addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.stock_reservations enable row level security;

create policy "Public can read active origins" on public.origins
for select using (is_active or public.is_staff());
create policy "Staff manage origins" on public.origins
for all using (public.is_staff()) with check (public.is_staff());

create policy "Public can read active patterns" on public.patterns
for select using (is_active or public.is_staff());
create policy "Staff manage patterns" on public.patterns
for all using (public.is_staff()) with check (public.is_staff());

create policy "Public can read active materials" on public.materials
for select using (is_active or public.is_staff());
create policy "Staff manage materials" on public.materials
for all using (public.is_staff()) with check (public.is_staff());

create policy "Public can read active products" on public.products
for select using (status = 'active' or public.is_staff());
create policy "Staff manage products" on public.products
for all using (public.is_staff()) with check (public.is_staff());

create policy "Public can read materials for active products" on public.product_materials
for select using (
  public.is_staff() or exists (
    select 1 from public.products
    where products.id = product_materials.product_id and products.status = 'active'
  )
);
create policy "Staff manage product materials" on public.product_materials
for all using (public.is_staff()) with check (public.is_staff());

create policy "Public can read images for active products" on public.product_images
for select using (
  public.is_staff() or exists (
    select 1 from public.products
    where products.id = product_images.product_id and products.status = 'active'
  )
);
create policy "Staff manage product images" on public.product_images
for all using (public.is_staff()) with check (public.is_staff());

create policy "Users can read their own profile" on public.profiles
for select using (id = auth.uid() or public.is_staff());
create policy "Users can update their own profile" on public.profiles
for update using (id = auth.uid() or public.is_staff())
with check (id = auth.uid() or public.is_staff());

create policy "Users manage their own addresses" on public.customer_addresses
for all using (customer_id = auth.uid() or public.is_staff())
with check (customer_id = auth.uid() or public.is_staff());

create policy "Users can read their own orders" on public.orders
for select using (customer_id = auth.uid() or public.is_staff());
create policy "Staff manage orders" on public.orders
for all using (public.is_staff()) with check (public.is_staff());

create policy "Users can read items in their own orders" on public.order_items
for select using (
  public.is_staff() or exists (
    select 1 from public.orders
    where orders.id = order_items.order_id and orders.customer_id = auth.uid()
  )
);
create policy "Staff manage order items" on public.order_items
for all using (public.is_staff()) with check (public.is_staff());

create policy "Users can read payments for their own orders" on public.payments
for select using (
  public.is_staff() or exists (
    select 1 from public.orders
    where orders.id = payments.order_id and orders.customer_id = auth.uid()
  )
);
create policy "Staff manage payments" on public.payments
for all using (public.is_staff()) with check (public.is_staff());

create policy "Staff manage inventory movements" on public.inventory_movements
for all using (public.is_staff()) with check (public.is_staff());

create policy "Staff manage stock reservations" on public.stock_reservations
for all using (public.is_staff()) with check (public.is_staff());

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public can read product images in storage" on storage.objects
for select using (bucket_id = 'product-images');
create policy "Staff can upload product images" on storage.objects
for insert with check (bucket_id = 'product-images' and public.is_staff());
create policy "Staff can update product images" on storage.objects
for update using (bucket_id = 'product-images' and public.is_staff())
with check (bucket_id = 'product-images' and public.is_staff());
create policy "Staff can delete product images" on storage.objects
for delete using (bucket_id = 'product-images' and public.is_staff());

-- After creating the first Auth user, promote that user once:
-- update public.profiles set role = 'admin' where id = '<auth-user-uuid>';

commit;

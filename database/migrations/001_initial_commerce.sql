-- Hosseintalab private PostgreSQL commerce foundation.
--
-- Apply this only through a local server administrator connection. The web
-- browser must never connect to PostgreSQL directly; the future Node API is
-- the only application allowed to use the htc_app database role.

begin;

create extension if not exists pgcrypto;
create extension if not exists citext;

create schema if not exists hosseintalab;
set local search_path = hosseintalab, public;

create type product_collection as enum ('home', 'antique');
create type product_status as enum ('draft', 'active', 'reserved', 'sold', 'archived');
create type product_shape as enum ('rectangular', 'runner', 'round', 'oval', 'other');
create type age_category as enum ('contemporary', 'old', 'semi_antique', 'antique', 'unknown');
create type dye_type as enum ('vegetable', 'natural', 'synthetic', 'mixed', 'unknown');
create type price_visibility as enum ('public', 'inquiry_only', 'private');
create type material_role as enum ('pile', 'warp', 'weft', 'fringe', 'other');
create type product_image_kind as enum (
  'full_frontal', 'three_quarter', 'corner', 'field_detail', 'border_detail',
  'fringe', 'condition', 'in_room', 'other'
);
create type inventory_movement_type as enum (
  'received', 'adjustment', 'sold', 'returned', 'damaged', 'write_off'
);
create type reservation_status as enum ('active', 'released', 'fulfilled', 'expired');
create type user_role as enum ('customer', 'staff', 'admin');
create type user_status as enum ('pending_verification', 'active', 'suspended');
create type order_status as enum (
  'draft', 'awaiting_payment', 'paid', 'confirmed', 'fulfillment', 'shipped',
  'delivered', 'cancelled', 'refunded'
);
create type payment_status as enum ('pending', 'authorized', 'paid', 'failed', 'refunded', 'cancelled');

create table origins (
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

create table patterns (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name_fa text not null unique,
  name_en text,
  description_fa text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table materials (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[a-z0-9_]+$'),
  name_fa text not null unique,
  name_en text not null,
  description_fa text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into materials (code, name_fa, name_en, description_fa) values
  ('wool', 'پشم', 'Wool', 'پشم طبیعی'),
  ('silk', 'ابریشم', 'Silk', 'ابریشم طبیعی'),
  ('kork_wool', 'کرک', 'Kork wool', 'پشم نرم و ظریف، معمولاً کرک بره'),
  ('cotton', 'پنبه', 'Cotton', 'پنبه، معمولاً برای چله یا پود'),
  ('mixed', 'ترکیبی', 'Mixed', 'ترکیب بیش از یک الیاف'),
  ('other', 'سایر', 'Other', 'نیازمند توضیح تکمیلی');

create table products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique check (sku ~ '^[A-Za-z0-9][A-Za-z0-9_-]{2,63}$'),
  collection product_collection not null,
  status product_status not null default 'draft',
  title_fa text not null,
  title_en text,
  description_fa text,
  origin_id uuid references origins(id) on delete set null,
  pattern_id uuid references patterns(id) on delete set null,
  shape product_shape not null default 'rectangular',
  width_cm numeric(8, 2) check (width_cm is null or width_cm > 0),
  length_cm numeric(8, 2) check (length_cm is null or length_cm > 0),
  diameter_cm numeric(8, 2) check (diameter_cm is null or diameter_cm > 0),
  dimension_note_fa text,
  weaving_year_shamsi integer check (weaving_year_shamsi is null or weaving_year_shamsi between 1000 and 1600),
  weaving_year_note_fa text,
  age_years integer check (age_years is null or age_years >= 0),
  age_confidence smallint check (age_confidence is null or age_confidence between 1 and 5),
  age_category age_category generated always as (
    case
      when age_years is null then 'unknown'::age_category
      when age_years < 20 then 'contemporary'::age_category
      when age_years < 50 then 'old'::age_category
      when age_years < 100 then 'semi_antique'::age_category
      else 'antique'::age_category
    end
  ) stored,
  dye_type dye_type not null default 'unknown',
  condition_note_fa text,
  restoration_note_fa text,
  provenance_note_fa text,
  price_toman bigint check (price_toman is null or price_toman >= 0),
  price_visibility price_visibility not null default 'inquiry_only',
  orderable boolean not null default false,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (shape not in ('round', 'oval') or diameter_cm is not null or (width_cm is not null and length_cm is not null)),
  check (price_visibility <> 'public' or price_toman is not null)
);

create table product_materials (
  product_id uuid not null references products(id) on delete cascade,
  material_id uuid not null references materials(id) on delete restrict,
  role material_role not null,
  note_fa text,
  primary key (product_id, material_id, role)
);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  storage_key text not null unique,
  mime_type text not null check (mime_type in ('image/jpeg', 'image/png', 'image/webp', 'image/avif')),
  byte_size bigint not null check (byte_size > 0),
  kind product_image_kind not null default 'other',
  alt_fa text not null,
  sort_order smallint not null default 0 check (sort_order >= 0),
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index product_images_one_primary_per_product
  on product_images(product_id)
  where is_primary;

create table users (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  password_hash text not null,
  role user_role not null default 'customer',
  status user_status not null default 'pending_verification',
  full_name text,
  phone_e164 text,
  email_verified_at timestamptz,
  last_signed_in_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (char_length(email::text) between 3 and 320),
  check (phone_e164 is null or phone_e164 ~ '^\\+[1-9][0-9]{7,14}$')
);

create table user_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  token_hash text not null unique,
  ip_address inet,
  user_agent text,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  check (expires_at > created_at)
);

create index user_sessions_lookup_idx
  on user_sessions(token_hash)
  where revoked_at is null;

create table email_verification_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now(),
  check (expires_at > created_at)
);

create table password_reset_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now(),
  check (expires_at > created_at)
);

create table customer_addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references users(id) on delete cascade,
  recipient_name text not null,
  phone_e164 text not null check (phone_e164 ~ '^\\+[1-9][0-9]{7,14}$'),
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
  on customer_addresses(customer_id)
  where is_default;

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity unique,
  customer_id uuid not null references users(id) on delete restrict,
  status order_status not null default 'draft',
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

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  sku_snapshot text not null,
  title_fa_snapshot text not null,
  dimension_snapshot_fa text,
  unit_price_toman bigint not null check (unit_price_toman >= 0),
  quantity integer not null check (quantity > 0),
  line_total_toman bigint generated always as (unit_price_toman * quantity) stored,
  created_at timestamptz not null default now()
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  provider text not null,
  provider_reference text unique,
  status payment_status not null default 'pending',
  amount_toman bigint not null check (amount_toman >= 0),
  gateway_payload jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table inventory_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete restrict,
  order_item_id uuid references order_items(id) on delete set null,
  movement_type inventory_movement_type not null,
  quantity_delta integer not null check (quantity_delta <> 0),
  note_fa text,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table stock_reservations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete restrict,
  order_item_id uuid not null unique references order_items(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  status reservation_status not null default 'active',
  expires_at timestamptz not null,
  released_at timestamptz,
  created_at timestamptz not null default now(),
  check ((status = 'active' and released_at is null) or status <> 'active')
);

create table audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references users(id) on delete set null,
  event_type text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  ip_address inet,
  created_at timestamptz not null default now()
);

create index products_catalog_filter_idx
  on products(status, collection, origin_id, pattern_id, age_category);
create index product_images_product_sort_idx
  on product_images(product_id, sort_order);
create index orders_customer_created_idx
  on orders(customer_id, created_at desc);
create index order_items_order_idx
  on order_items(order_id);
create index inventory_movements_product_idx
  on inventory_movements(product_id, created_at);
create index stock_reservations_available_idx
  on stock_reservations(product_id, expires_at)
  where status = 'active';
create index audit_events_entity_idx
  on audit_events(entity_type, entity_id, created_at desc);

create view v_inventory_balance as
select
  product_id,
  coalesce(sum(quantity_delta), 0)::integer as quantity_on_hand
from inventory_movements
group by product_id;

create view v_inventory_availability as
with stock as (
  select product_id, coalesce(sum(quantity_delta), 0)::integer as quantity_on_hand
  from inventory_movements
  group by product_id
), reserved as (
  select product_id, coalesce(sum(quantity), 0)::integer as quantity_reserved
  from stock_reservations
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

create function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_origins_updated_at before update on origins
for each row execute function set_updated_at();
create trigger set_patterns_updated_at before update on patterns
for each row execute function set_updated_at();
create trigger set_materials_updated_at before update on materials
for each row execute function set_updated_at();
create trigger set_products_updated_at before update on products
for each row execute function set_updated_at();
create trigger set_users_updated_at before update on users
for each row execute function set_updated_at();
create trigger set_customer_addresses_updated_at before update on customer_addresses
for each row execute function set_updated_at();
create trigger set_orders_updated_at before update on orders
for each row execute function set_updated_at();
create trigger set_payments_updated_at before update on payments
for each row execute function set_updated_at();

comment on schema hosseintalab is 'Private Hosseintalab commerce data. Access only through the server-side API.';
comment on column products.price_toman is 'Integer Toman; convert to Rial only at a gateway boundary if required.';
comment on column product_materials.role is 'warp is چله; fringe is the exposed ریشه.';
comment on column users.password_hash is 'A server-side Argon2id or scrypt hash; never a password or reversible encryption.';

commit;

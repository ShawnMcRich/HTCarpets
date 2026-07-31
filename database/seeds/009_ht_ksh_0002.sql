-- Live catalog record: HT-KSH-0002.
-- Apply after database/migrations/001_initial_commerce.sql.

begin;

set local search_path = hosseintalab, public;

insert into origins (slug, name_fa, name_en, description_fa)
values ('kashan', 'کاشان', 'Kashan', 'کاشان؛ یکی از مراکز مهم قالی‌بافی ایران.')
on conflict (slug) do update set
  name_fa = excluded.name_fa,
  name_en = excluded.name_en,
  description_fa = excluded.description_fa;

insert into patterns (slug, name_fa, name_en, description_fa)
values ('lachak-toranj-plain-field', 'لچک‌وترنجِ کف‌ساده', 'Lachak Toranj Plain Field', 'ساختاری مرکزگرا با ترنجِ مرکزی و زمینه‌ای نسبتاً باز و ساده.')
on conflict (slug) do update set
  name_fa = excluded.name_fa,
  name_en = excluded.name_en,
  description_fa = excluded.description_fa;

insert into products (
  sku, collection, status, title_fa, title_en, description_fa,
  origin_id, pattern_id, shape, width_cm, length_cm, dimension_note_fa,
  weaving_year_note_fa, age_years, age_confidence, dye_type, condition_note_fa,
  price_toman, price_visibility, orderable, featured
)
select
  'HT-KSH-0002', 'antique', 'active',
  'لچک‌وترنجِ کف‌ساده‌ی کاشان', 'Kashan Lachak Toranj Plain Field',
  'فرش کاشان با زمینه‌ی لاکی، نقشه‌ی لچک‌وترنجِ کف‌ساده و حاشیه‌ی تیره‌ی گل‌دار.',
  origins.id, patterns.id, 'rectangular', 135, 207, '۱۳۵ × ۲۰۷ سانتی‌متر',
  'حدود ۸۰ تا ۱۰۰ سال؛ بازه‌ی تقریبی که به مرز آنتیک نزدیک است.', 90, 2, 'unknown',
  'بازه‌ی قدمت نیازمند تأیید کارشناسی است؛ برآورد کنونی در مرز نیمه‌آنتیک و آنتیک قرار دارد.',
  220000000, 'public', false, true
from origins
join patterns on patterns.slug = 'lachak-toranj-plain-field'
where origins.slug = 'kashan'
on conflict (sku) do update set
  collection = excluded.collection,
  status = excluded.status,
  title_fa = excluded.title_fa,
  title_en = excluded.title_en,
  description_fa = excluded.description_fa,
  origin_id = excluded.origin_id,
  pattern_id = excluded.pattern_id,
  shape = excluded.shape,
  width_cm = excluded.width_cm,
  length_cm = excluded.length_cm,
  dimension_note_fa = excluded.dimension_note_fa,
  weaving_year_note_fa = excluded.weaving_year_note_fa,
  age_years = excluded.age_years,
  age_confidence = excluded.age_confidence,
  dye_type = excluded.dye_type,
  condition_note_fa = excluded.condition_note_fa,
  price_toman = excluded.price_toman,
  price_visibility = excluded.price_visibility,
  orderable = excluded.orderable,
  featured = excluded.featured;

insert into product_materials (product_id, material_id, role, note_fa)
select products.id, materials.id, 'pile', 'پشم.'
from products
join materials on materials.code = 'wool'
where products.sku = 'HT-KSH-0002'
on conflict (product_id, material_id, role) do update set note_fa = excluded.note_fa;

insert into product_images (product_id, storage_key, mime_type, byte_size, kind, alt_fa, sort_order, is_primary)
select products.id, image.storage_key, image.mime_type, image.byte_size, image.kind::product_image_kind,
       image.alt_fa, image.sort_order, image.is_primary
from products
cross join (
  values
    ('media/products/ht-ksh-0002/full-frontal.png', 'image/png', 3320563::bigint, 'full_frontal', 'نمای روبه‌روی کامل فرش کاشان با نقشه‌ی لچک‌وترنج کف‌ساده', 0, true),
    ('media/products/ht-ksh-0002/studio-three-quarter.png', 'image/png', 3146531::bigint, 'three_quarter', 'نمای زاویه‌دار فرش کاشان با زمینه‌ی لاکی و ترنج مرکزی', 1, false),
    ('media/products/ht-ksh-0002/plain-field-and-medallion-detail.jpg', 'image/jpeg', 4939271::bigint, 'field_detail', 'جزئیات ترنج و زمینه‌ی لاکیِ فرش کاشان', 2, false),
    ('media/products/ht-ksh-0002/courtyard-context.png', 'image/png', 3021105::bigint, 'in_room', 'فرش لچک‌وترنج کاشان در حیاط خانه‌ی ایرانی', 3, false),
    ('media/products/ht-ksh-0002/kashan-context.png', 'image/png', 2835940::bigint, 'in_room', 'فرش کاشان در نمای شهری و معماری ایرانی', 4, false)
) as image(storage_key, mime_type, byte_size, kind, alt_fa, sort_order, is_primary)
where products.sku = 'HT-KSH-0002'
on conflict (storage_key) do update set
  mime_type = excluded.mime_type,
  byte_size = excluded.byte_size,
  kind = excluded.kind,
  alt_fa = excluded.alt_fa,
  sort_order = excluded.sort_order,
  is_primary = excluded.is_primary;

insert into inventory_movements (product_id, movement_type, quantity_delta, note_fa)
select products.id, 'received', 1, 'ثبت اولیه‌ی موجودی؛ تک‌تخته.'
from products
where products.sku = 'HT-KSH-0002'
  and not exists (
    select 1
    from inventory_movements
    where inventory_movements.product_id = products.id
      and inventory_movements.movement_type = 'received'
      and inventory_movements.note_fa = 'ثبت اولیه‌ی موجودی؛ تک‌تخته.'
  );

commit;

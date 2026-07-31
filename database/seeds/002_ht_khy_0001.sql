-- Live catalog record: HT-KHY-0001.
-- Apply after database/migrations/001_initial_commerce.sql.
-- The four PNG files must be deployed under public/media/products/ht-khy-0001/.

begin;

set local search_path = hosseintalab, public;

insert into origins (slug, name_fa, name_en, province_fa, description_fa)
values ('khoy', 'خوی', 'Khoy', 'آذربایجان غربی', 'خوی، آذربایجان غربی.')
on conflict (slug) do update set
  name_fa = excluded.name_fa,
  name_en = excluded.name_en,
  province_fa = excluded.province_fa,
  description_fa = excluded.description_fa;

insert into patterns (slug, name_fa, name_en, description_fa)
values ('one-sided-vase', 'گلدانی یک‌طرفه', 'One-sided Vase', 'نقشه‌ای جهت‌دار که از گلدانِ پایین فرش رو به بالا گسترش می‌یابد.')
on conflict (slug) do update set
  name_fa = excluded.name_fa,
  name_en = excluded.name_en,
  description_fa = excluded.description_fa;

insert into products (
  sku, collection, status, title_fa, title_en, description_fa,
  origin_id, pattern_id, shape, width_cm, length_cm, dimension_note_fa,
  weaving_year_note_fa, age_years, age_confidence, dye_type,
  price_toman, price_visibility, orderable, featured
)
select
  'HT-KHY-0001', 'antique', 'active',
  'گلدانیِ خوی', 'Khoy One-sided Vase',
  'فرش نیمه‌آنتیک خوی با زمینه‌ی لاکی، نقش گلدانیِ یک‌طرفه و حاشیه‌ی سرمه‌ای.',
  origins.id, patterns.id, 'rectangular', 135, 194, '۱۳۵ × ۱۹۴ سانتی‌متر',
  'حدود ۶۰ تا ۸۰ سال؛ بازه‌ی تقریبی.', 70, 3, 'unknown',
  95000000, 'public', false, true
from origins
join patterns on patterns.slug = 'one-sided-vase'
where origins.slug = 'khoy'
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
  price_toman = excluded.price_toman,
  price_visibility = excluded.price_visibility,
  orderable = excluded.orderable,
  featured = excluded.featured;

insert into product_materials (product_id, material_id, role, note_fa)
select products.id, materials.id, 'pile', 'پشم.'
from products
join materials on materials.code = 'wool'
where products.sku = 'HT-KHY-0001'
on conflict (product_id, material_id, role) do update set note_fa = excluded.note_fa;

insert into product_images (product_id, storage_key, mime_type, byte_size, kind, alt_fa, sort_order, is_primary)
select products.id, image.storage_key, 'image/png', image.byte_size, image.kind::product_image_kind,
       image.alt_fa, image.sort_order, image.is_primary
from products
cross join (
  values
    ('media/products/ht-khy-0001/full-frontal.png', 3215470::bigint, 'full_frontal', 'نمای روبه‌روی کامل فرش نیمه‌آنتیک خوی با نقش گلدانی یک‌طرفه', 0, true),
    ('media/products/ht-khy-0001/studio-three-quarter.png', 3018278::bigint, 'three_quarter', 'نمای زاویه‌دار فرش خوی با زمینه‌ی لاکی و حاشیه‌ی سرمه‌ای', 1, false),
    ('media/products/ht-khy-0001/vase-and-border-detail.png', 3873497::bigint, 'field_detail', 'جزئیات گلدان، گل‌ها و حاشیه‌ی سرمه‌ای فرش خوی', 2, false),
    ('media/products/ht-khy-0001/khoy-context.png', 2995235::bigint, 'in_room', 'فرش خوی در یک فضای باز با معماری ایرانی', 3, false)
) as image(storage_key, byte_size, kind, alt_fa, sort_order, is_primary)
where products.sku = 'HT-KHY-0001'
on conflict (storage_key) do update set
  byte_size = excluded.byte_size,
  kind = excluded.kind,
  alt_fa = excluded.alt_fa,
  sort_order = excluded.sort_order,
  is_primary = excluded.is_primary;

insert into inventory_movements (product_id, movement_type, quantity_delta, note_fa)
select products.id, 'received', 1, 'ثبت اولیه‌ی موجودی؛ تک‌تخته.'
from products
where products.sku = 'HT-KHY-0001'
  and not exists (
    select 1
    from inventory_movements
    where inventory_movements.product_id = products.id
      and inventory_movements.movement_type = 'received'
      and inventory_movements.note_fa = 'ثبت اولیه‌ی موجودی؛ تک‌تخته.'
  );

commit;

-- Live catalog record: HT-TBZ-0001.
-- Apply after database/migrations/001_initial_commerce.sql.

begin;

set local search_path = hosseintalab, public;

insert into origins (slug, name_fa, name_en, province_fa, description_fa)
values (
  'tabriz',
  'تبریز',
  'Tabriz',
  'آذربایجان شرقی',
  'تبریز؛ یکی از مراکز مهم قالی‌بافی ایران.'
)
on conflict (slug) do update set
  name_fa = excluded.name_fa,
  name_en = excluded.name_en,
  province_fa = excluded.province_fa,
  description_fa = excluded.description_fa;

insert into patterns (slug, name_fa, name_en, description_fa)
values (
  'lachak-toranj',
  'لچک‌وترنج',
  'Lachak Toranj',
  'ساختاری مرکزگرا با ترنجِ مرکزی و لچک‌های چهارگانه.'
)
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
  'HT-TBZ-0001', 'antique', 'active',
  'لچک‌وترنجِ تبریز، ۶۰ رج', 'Tabriz 60-Raj Lachak Toranj',
  'فرش کرک تبریز با نقشه‌ی لچک‌وترنج، زمینه‌ی لاکی و ترنجِ سبز تیره.',
  origins.id, patterns.id, 'rectangular', 136, 192,
  '۱۳۶ × ۱۹۲ سانتی‌متر.',
  'حدود ۷۰ تا ۹۰ سال؛ برآورد تقریبی.', 80, 2, 'unknown',
  'بنا بر اعلام مالک: بافت ۶۰ رجِ ریز و استادباف. نام بافنده ارائه نشده و قدمت، ظرافت بافت و وضعیت فنی نیازمند تأیید کارشناسی است.',
  470000000, 'public', false, true
from origins
join patterns on patterns.slug = 'lachak-toranj'
where origins.slug = 'tabriz'
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
select products.id, materials.id, 'pile', 'کرک؛ بر اساس اطلاعات ارائه‌شده.'
from products
join materials on materials.code = 'kork_wool'
where products.sku = 'HT-TBZ-0001'
on conflict (product_id, material_id, role) do update set
  note_fa = excluded.note_fa;

insert into product_images (product_id, storage_key, mime_type, byte_size, kind, alt_fa, sort_order, is_primary)
select products.id, image.storage_key, image.mime_type, image.byte_size, image.kind::product_image_kind,
       image.alt_fa, image.sort_order, image.is_primary
from products
cross join (
  values
    ('media/products/ht-tbz-0001/full-frontal.png', 'image/png', 3265645::bigint, 'full_frontal', 'نمای روبه‌روی کامل فرش لچک‌وترنج تبریز، ۶۰ رج', 0, true),
    ('media/products/ht-tbz-0001/studio-three-quarter.png', 'image/png', 2844028::bigint, 'three_quarter', 'نمای زاویه‌دار فرش لچک‌وترنج تبریز، ۶۰ رج', 1, false),
    ('media/products/ht-tbz-0001/medallion-detail.png', 'image/png', 3505534::bigint, 'field_detail', 'جزئیات ترنج و گل‌های زمینه‌ی لاکی فرش تبریز', 2, false),
    ('media/products/ht-tbz-0001/tabriz-context.png', 'image/png', 3043811::bigint, 'in_room', 'فرش لچک‌وترنج تبریز در نمای محیطی', 3, false)
) as image(storage_key, mime_type, byte_size, kind, alt_fa, sort_order, is_primary)
where products.sku = 'HT-TBZ-0001'
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
where products.sku = 'HT-TBZ-0001'
  and not exists (
    select 1
    from inventory_movements
    where inventory_movements.product_id = products.id
      and inventory_movements.movement_type = 'received'
      and inventory_movements.note_fa = 'ثبت اولیه‌ی موجودی؛ تک‌تخته.'
  );

commit;

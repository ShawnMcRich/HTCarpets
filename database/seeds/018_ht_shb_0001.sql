-- Live catalog record: HT-SHB-0001.
-- Apply after database/migrations/001_initial_commerce.sql.

begin;

set local search_path = hosseintalab, public;

insert into origins (slug, name_fa, name_en, province_fa, description_fa)
values (
  'shahr-babak-sirjan',
  'شهر بابک / سیرجان',
  'Shahr Babak / Sirjan',
  'کرمان',
  'منطقه‌ی شهر بابک و سیرجان در استان کرمان؛ ثبتِ مبدأ بر اساس اطلاعات ارائه‌شده.'
)
on conflict (slug) do update set
  name_fa = excluded.name_fa,
  name_en = excluded.name_en,
  province_fa = excluded.province_fa,
  description_fa = excluded.description_fa;

insert into patterns (slug, name_fa, name_en, description_fa)
values (
  'moharramat',
  'محرمات',
  'Moharramat',
  'ترکیب‌بندیِ نواری و تکرارشونده با ردیف‌های عمودیِ نقش‌دار.'
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
  'HT-SHB-0001', 'antique', 'active',
  'محرماتِ شهر بابک / سیرجان', 'Shahr Babak / Sirjan Moharramat',
  'فرش محرماتِ شهر بابک / سیرجان با ردیف‌های عمودیِ تکرارشونده و زمینه‌ی تیره.',
  origins.id, patterns.id, 'rectangular', null, null,
  'احتمالاً پرده‌ای؛ ابعاد دقیق در دست تعیین.',
  'حدود ۹۰ تا ۱۱۰ سال؛ برآورد تقریبی.', 100, 1, 'unknown',
  'بنا بر اعلام مالک: وضعیت عالی. ابعاد، جنس الیاف، قدمت و وضعیت فنی نیازمند تأیید کارشناسی است.',
  85000000, 'public', false, true
from origins
join patterns on patterns.slug = 'moharramat'
where origins.slug = 'shahr-babak-sirjan'
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

insert into product_images (product_id, storage_key, mime_type, byte_size, kind, alt_fa, sort_order, is_primary)
select products.id, image.storage_key, image.mime_type, image.byte_size, image.kind::product_image_kind,
       image.alt_fa, image.sort_order, image.is_primary
from products
cross join (
  values
    ('media/products/ht-shb-0001/full-frontal.png', 'image/png', 3389817::bigint, 'full_frontal', 'نمای روبه‌روی کامل فرش محرمات شهر بابک / سیرجان', 0, true),
    ('media/products/ht-shb-0001/studio-three-quarter.png', 'image/png', 2715270::bigint, 'three_quarter', 'نمای زاویه‌دار فرش محرمات شهر بابک / سیرجان', 1, false),
    ('media/products/ht-shb-0001/moharramat-detail.png', 'image/png', 3646067::bigint, 'field_detail', 'جزئیات ردیف‌های عمودیِ نقشه‌ی محرمات', 2, false),
    ('media/products/ht-shb-0001/hanging-view.png', 'image/png', 3358858::bigint, 'other', 'نمای آویخته‌ی فرش محرمات شهر بابک / سیرجان', 3, false),
    ('media/products/ht-shb-0001/shahr-babak-context.png', 'image/png', 3314456::bigint, 'in_room', 'فرش محرمات شهر بابک / سیرجان در نمای محیطی', 4, false)
) as image(storage_key, mime_type, byte_size, kind, alt_fa, sort_order, is_primary)
where products.sku = 'HT-SHB-0001'
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
where products.sku = 'HT-SHB-0001'
  and not exists (
    select 1
    from inventory_movements
    where inventory_movements.product_id = products.id
      and inventory_movements.movement_type = 'received'
      and inventory_movements.note_fa = 'ثبت اولیه‌ی موجودی؛ تک‌تخته.'
  );

commit;

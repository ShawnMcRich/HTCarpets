-- Live catalog record: HT-KSH-0004.
-- Apply after database/migrations/001_initial_commerce.sql and 002_product_usd_prices.sql.

begin;

set local search_path = hosseintalab, public;

insert into origins (slug, name_fa, name_en, province_fa, description_fa)
values ('kashan', 'کاشان', 'Kashan', 'اصفهان', 'کاشان؛ یکی از مراکز شاخص قالی‌بافی ایران.')
on conflict (slug) do update set
  name_fa = excluded.name_fa,
  name_en = excluded.name_en,
  province_fa = excluded.province_fa,
  description_fa = excluded.description_fa;

insert into patterns (slug, name_fa, name_en, description_fa)
values (
  'pictorial-luminaries',
  'تصویریِ مشاهیر',
  'Pictorial Luminaries',
  'نقشه‌ای تصویری با چهره‌های نام‌گذاری‌شده از مشاهیر ادب و فرهنگ.'
)
on conflict (slug) do update set
  name_fa = excluded.name_fa,
  name_en = excluded.name_en,
  description_fa = excluded.description_fa;

insert into products (
  sku, collection, status, title_fa, title_en, description_fa,
  origin_id, pattern_id, shape, width_cm, length_cm, dimension_note_fa,
  weaving_year_note_fa, age_years, age_confidence, dye_type,
  condition_note_fa, provenance_note_fa,
  price_toman, price_usd, price_visibility, orderable, featured
)
select
  'HT-KSH-0004', 'antique', 'active',
  'تابلوفرشِ مشاهیرِ کاشان', 'Kashan Pictorial Carpet of Persian Luminaries',
  'تابلوفرش پشمی کاشان با نقشه‌ی تصویری مشاهیر، شش چهره‌ی نام‌گذاری‌شده و امضای بافته‌شده‌ی «ترسیم محمد افسری».',
  origins.id, patterns.id, 'rectangular', 106, 156, '۱۰۶ × ۱۵۶ سانتی‌متر',
  'حدود ۷۰ سال؛ برآورد تقریبی.', 70, 2, 'unknown',
  'نمای کامل، دو نمای زاویه‌دار، جزئیات چهره‌ها و نمای نزدیک امضا ثبت شده‌اند. وضعیت فنی، قدمت و هرگونه مرمت احتمالی نیازمند تأیید کارشناسی است.',
  'دارای امضای بافته‌شده‌ی «ترسیم محمد افسری»؛ انتساب بر اساس کتیبه‌ی قابل مشاهده و اطلاعات ارائه‌شده ثبت شده است.',
  null, 5000, 'public', false, true
from origins
join patterns on patterns.slug = 'pictorial-luminaries'
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
  provenance_note_fa = excluded.provenance_note_fa,
  price_toman = excluded.price_toman,
  price_usd = excluded.price_usd,
  price_visibility = excluded.price_visibility,
  orderable = excluded.orderable,
  featured = excluded.featured;

insert into product_materials (product_id, material_id, role, note_fa)
select products.id, materials.id, 'pile', 'پشم؛ بر اساس اطلاعات ارائه‌شده.'
from products
join materials on materials.code = 'wool'
where products.sku = 'HT-KSH-0004'
on conflict (product_id, material_id, role) do update set note_fa = excluded.note_fa;

insert into product_images (product_id, storage_key, mime_type, byte_size, kind, alt_fa, sort_order, is_primary)
select products.id, image.storage_key, image.mime_type, image.byte_size, image.kind::product_image_kind,
       image.alt_fa, image.sort_order, image.is_primary
from products
cross join (
  values
    ('media/products/ht-ksh-0004/full-frontal.webp', 'image/webp', 262524::bigint, 'full_frontal', 'نمای روبه‌روی کامل تابلوفرش مشاهیر کاشان', 0, true),
    ('media/products/ht-ksh-0004/studio-three-quarter.webp', 'image/webp', 270938::bigint, 'three_quarter', 'نمای زاویه‌دار تابلوفرش مشاهیر کاشان', 1, false),
    ('media/products/ht-ksh-0004/low-angle.webp', 'image/webp', 295430::bigint, 'three_quarter', 'نمای کم‌ارتفاع از تابلوفرش مشاهیر کاشان', 2, false),
    ('media/products/ht-ksh-0004/portrait-detail.webp', 'image/webp', 373640::bigint, 'field_detail', 'جزئیات شش چهره و کتیبه‌های تابلوفرش مشاهیر کاشان', 3, false),
    ('media/products/ht-ksh-0004/signature-detail.webp', 'image/webp', 337434::bigint, 'field_detail', 'نمای نزدیک امضای بافته‌شده‌ی ترسیم محمد افسری', 4, false),
    ('media/products/ht-ksh-0004/kashan-context.webp', 'image/webp', 188826::bigint, 'in_room', 'تابلوفرش مشاهیر در فضای معماری کاشان', 5, false)
) as image(storage_key, mime_type, byte_size, kind, alt_fa, sort_order, is_primary)
where products.sku = 'HT-KSH-0004'
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
where products.sku = 'HT-KSH-0004'
  and not exists (
    select 1
    from inventory_movements
    where inventory_movements.product_id = products.id
      and inventory_movements.movement_type = 'received'
      and inventory_movements.note_fa = 'ثبت اولیه‌ی موجودی؛ تک‌تخته.'
  );

commit;

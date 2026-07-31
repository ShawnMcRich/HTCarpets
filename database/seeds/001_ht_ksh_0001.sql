-- First live catalog record: HT-KSH-0001.
-- Apply after database/migrations/001_initial_commerce.sql.
-- The six PNG files must be deployed under public/media/products/ht-ksh-0001/.

begin;

set local search_path = hosseintalab, public;

insert into origins (slug, name_fa, name_en, description_fa)
values ('kashan', 'کاشان', 'Kashan', 'کاشان؛ یکی از مراکز مهم قالی‌بافی ایران.')
on conflict (slug) do update set
  name_fa = excluded.name_fa,
  name_en = excluded.name_en,
  description_fa = excluded.description_fa;

insert into patterns (slug, name_fa, name_en, description_fa)
values ('tree-of-life', 'درخت زندگی', 'Tree of Life', 'نقشه‌ی درختی با حضور گیاهان، پرندگان و جانوران.')
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
  'HT-KSH-0001', 'antique', 'active',
  'درختِ زندگیِ کاشان', 'Kashan Tree of Life',
  'فرش نیمه‌آنتیک کاشان با زمینه‌ی عاجی، نقشه‌ی درختی، پرندگان و جانوران.',
  origins.id, patterns.id, 'rectangular', 138, 217, '۱۳۸ × ۲۱۷ سانتی‌متر',
  'حدود ۶۰ تا ۸۰ سال؛ بازه‌ی تقریبی.', 70, 3, 'unknown',
  370000000, 'public', false, true
from origins
join patterns on patterns.slug = 'tree-of-life'
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
  price_toman = excluded.price_toman,
  price_visibility = excluded.price_visibility,
  orderable = excluded.orderable,
  featured = excluded.featured;

insert into product_materials (product_id, material_id, role, note_fa)
select products.id, materials.id, 'pile', 'ترکیب پشم و ابریشم؛ جزئیات نسبت الیاف در دست تکمیل است.'
from products
join materials on materials.code in ('wool', 'silk')
where products.sku = 'HT-KSH-0001'
on conflict (product_id, material_id, role) do update set note_fa = excluded.note_fa;

insert into product_images (product_id, storage_key, mime_type, byte_size, kind, alt_fa, sort_order, is_primary)
select products.id, image.storage_key, 'image/png', image.byte_size, image.kind::product_image_kind,
       image.alt_fa, image.sort_order, image.is_primary
from products
cross join (
  values
    ('media/products/ht-ksh-0001/full-frontal.png', 3086273::bigint, 'full_frontal', 'نمای روبه‌روی کامل فرش نیمه‌آنتیک کاشان با نقشه‌ی درخت زندگی', 0, true),
    ('media/products/ht-ksh-0001/studio-three-quarter.png', 3008187::bigint, 'three_quarter', 'نمای سه‌رخ فرش کاشان روی زمینه‌ی خاکستری خنثی', 1, false),
    ('media/products/ht-ksh-0001/detail-tree-and-birds.png', 3094382::bigint, 'field_detail', 'جزئیات پرز، شاخه‌ها و پرندگان در نقشه‌ی درختی فرش کاشان', 2, false),
    ('media/products/ht-ksh-0001/draped-full-view.png', 3074254::bigint, 'other', 'نمای آویخته‌ی فرش کاشان که افت و حاشیه‌های آن را نشان می‌دهد', 3, false),
    ('media/products/ht-ksh-0001/kashan-courtyard-three-quarter.png', 3623948::bigint, 'in_room', 'فرش کاشان در حیاطی با آب‌نما و نور عصرگاهی', 4, false),
    ('media/products/ht-ksh-0001/kashan-garden-context.png', 3552571::bigint, 'in_room', 'فرش کاشان در فضای باغ ایرانی کنار آب‌نما', 5, false)
) as image(storage_key, byte_size, kind, alt_fa, sort_order, is_primary)
where products.sku = 'HT-KSH-0001'
on conflict (storage_key) do update set
  byte_size = excluded.byte_size,
  kind = excluded.kind,
  alt_fa = excluded.alt_fa,
  sort_order = excluded.sort_order,
  is_primary = excluded.is_primary;

insert into inventory_movements (product_id, movement_type, quantity_delta, note_fa)
select products.id, 'received', 1, 'ثبت اولیه‌ی موجودی؛ تک‌تخته.'
from products
where products.sku = 'HT-KSH-0001'
  and not exists (
    select 1
    from inventory_movements
    where inventory_movements.product_id = products.id
      and inventory_movements.movement_type = 'received'
      and inventory_movements.note_fa = 'ثبت اولیه‌ی موجودی؛ تک‌تخته.'
  );

commit;

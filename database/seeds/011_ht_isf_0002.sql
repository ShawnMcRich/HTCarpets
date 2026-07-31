-- Live catalog record: HT-ISF-0002.
-- Apply after database/migrations/001_initial_commerce.sql.

begin;

set local search_path = hosseintalab, public;

insert into origins (slug, name_fa, name_en, province_fa, description_fa)
values ('isfahan', 'اصفهان', 'Isfahan', 'اصفهان', 'اصفهان؛ یکی از مراکز شناخته‌شده‌ی قالی‌بافی ظریف ایران.')
on conflict (slug) do update set
  name_fa = excluded.name_fa,
  name_en = excluded.name_en,
  province_fa = excluded.province_fa,
  description_fa = excluded.description_fa;

insert into patterns (slug, name_fa, name_en, description_fa)
values ('hunting-scene', 'شکارگاه', 'Hunting Scene', 'نقشه‌ای روایی با سواران، جانوران، پرندگان و پوشش گیاهی.')
on conflict (slug) do update set
  name_fa = excluded.name_fa,
  name_en = excluded.name_en,
  description_fa = excluded.description_fa;

insert into products (
  sku, collection, status, title_fa, title_en, description_fa,
  origin_id, pattern_id, shape, width_cm, length_cm, dimension_note_fa,
  weaving_year_note_fa, age_years, age_confidence, dye_type, condition_note_fa,
  provenance_note_fa, price_toman, price_visibility, orderable, featured
)
select
  'HT-ISF-0002', 'home', 'active',
  'شکارگاهِ اصفهان', 'Isfahan Hunting Scene',
  'فرش اصفهان با نقشه‌ی شکارگاه، کرک و گل‌ابریشم بر چله‌ی ابریشم.',
  origins.id, patterns.id, 'rectangular', 153, 233, '۱۵۳ × ۲۳۳ سانتی‌متر',
  'قدمت در دست تکمیل؛ نیازمند کارشناسی.', null, null, 'unknown',
  'وضعیت فنی، قدمت و هرگونه مرمت احتمالی نیازمند بررسی کارشناسی است.',
  'بنا بر اعلام مالک: بافت استاد انتشاری. انتساب نیازمند بررسی امضا، شناسنامه یا مستندات معتبر پیش از انتشار عمومی است.',
  420000000, 'public', false, true
from origins
join patterns on patterns.slug = 'hunting-scene'
where origins.slug = 'isfahan'
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
  price_visibility = excluded.price_visibility,
  orderable = excluded.orderable,
  featured = excluded.featured;

insert into product_materials (product_id, material_id, role, note_fa)
select products.id, materials.id,
       case materials.code when 'silk' then 'warp'::material_role else 'pile'::material_role end,
       case materials.code
         when 'kork_wool' then 'کرک؛ پرز اصلی.'
         when 'silk' then 'چله ابریشم؛ گل‌ابریشم نیز در نقش‌ها به‌کار رفته است.'
       end
from products
join materials on materials.code in ('kork_wool', 'silk')
where products.sku = 'HT-ISF-0002'
on conflict (product_id, material_id, role) do update set note_fa = excluded.note_fa;

insert into product_materials (product_id, material_id, role, note_fa)
select products.id, materials.id, 'pile', 'گل‌ابریشم در نقش‌ها.'
from products
join materials on materials.code = 'silk'
where products.sku = 'HT-ISF-0002'
on conflict (product_id, material_id, role) do update set note_fa = excluded.note_fa;

insert into product_images (product_id, storage_key, mime_type, byte_size, kind, alt_fa, sort_order, is_primary)
select products.id, image.storage_key, image.mime_type, image.byte_size, image.kind::product_image_kind,
       image.alt_fa, image.sort_order, image.is_primary
from products
cross join (
  values
    ('media/products/ht-isf-0002/full-frontal.png', 'image/png', 3104487::bigint, 'full_frontal', 'نمای روبه‌روی کامل فرش اصفهان با نقشه‌ی شکارگاه', 0, true),
    ('media/products/ht-isf-0002/studio-three-quarter.png', 'image/png', 2955102::bigint, 'three_quarter', 'نمای زاویه‌دار فرش شکارگاه اصفهان', 1, false),
    ('media/products/ht-isf-0002/hunting-scene-detail.jpg', 'image/jpeg', 3806174::bigint, 'field_detail', 'جزئیات سواران، اسب‌ها و جانوران در نقشه‌ی شکارگاه فرش اصفهان', 2, false),
    ('media/products/ht-isf-0002/weaving-room-context.png', 'image/png', 3397710::bigint, 'in_room', 'فرش شکارگاه اصفهان در فضای کار بافندگی', 3, false),
    ('media/products/ht-isf-0002/isfahan-context.png', 'image/png', 3338849::bigint, 'in_room', 'فرش شکارگاه اصفهان در نمای شهری اصفهان', 4, false)
) as image(storage_key, mime_type, byte_size, kind, alt_fa, sort_order, is_primary)
where products.sku = 'HT-ISF-0002'
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
where products.sku = 'HT-ISF-0002'
  and not exists (
    select 1
    from inventory_movements
    where inventory_movements.product_id = products.id
      and inventory_movements.movement_type = 'received'
      and inventory_movements.note_fa = 'ثبت اولیه‌ی موجودی؛ تک‌تخته.'
  );

commit;

-- Live catalog record: HT-NHV-0001.
-- The museum-loan statement remains a private provenance note until supporting material is supplied.
-- Apply after database/migrations/001_initial_commerce.sql.

begin;

set local search_path = hosseintalab, public;

insert into origins (slug, name_fa, name_en, province_fa, description_fa)
values ('nahavand', 'نهاوند', 'Nahavand', 'همدان', 'نهاوند، همدان.')
on conflict (slug) do update set
  name_fa = excluded.name_fa,
  name_en = excluded.name_en,
  province_fa = excluded.province_fa,
  description_fa = excluded.description_fa;

insert into patterns (slug, name_fa, name_en, description_fa)
values ('pictorial', 'تصویری', 'Pictorial', 'نقشه‌ای که شخصیت، صحنه یا موضوع تصویری را نمایش می‌دهد.')
on conflict (slug) do update set
  name_fa = excluded.name_fa,
  name_en = excluded.name_en,
  description_fa = excluded.description_fa;

insert into products (
  sku, collection, status, title_fa, title_en, description_fa,
  origin_id, pattern_id, shape, width_cm, length_cm, dimension_note_fa,
  weaving_year_note_fa, age_years, age_confidence, dye_type,
  condition_note_fa, provenance_note_fa,
  price_toman, price_visibility, orderable, featured
)
select
  'HT-NHV-0001', 'antique', 'active',
  'تابلوفرش تصویریِ نورعلی‌شاه', 'Pictorial Nur Ali Shah Nahavand',
  'تابلوفرش تصویریِ دستباف نهاوند با موضوع نورعلی‌شاه. ثبت نهایی تصاویر و مدارک پیشینه در دست تکمیل است.',
  origins.id, patterns.id, 'rectangular', 135, 190, '۱۳۵ × ۱۹۰ سانتی‌متر',
  'حدود ۱۲۰ سال؛ برآورد تقریبی.', 120, 3, 'unknown',
  'بنا بر اعلام مالک: سلامت کامل، پرز کامل و ضخامت مطلوب. بررسی و مستندسازی نهایی پیش از انتشار انجام می‌شود.',
  'بنا بر اعلام مالک: این فرش پیش‌تر به موزه‌ی ملی فرش ایران امانت داده شده است. سند امانت یا مکاتبه برای انتشار عمومی باید به پرونده افزوده شود.',
  750000000, 'public', false, true
from origins
join patterns on patterns.slug = 'pictorial'
where origins.slug = 'nahavand'
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
select products.id, materials.id, 'pile', 'پشم.'
from products
join materials on materials.code = 'wool'
where products.sku = 'HT-NHV-0001'
on conflict (product_id, material_id, role) do update set note_fa = excluded.note_fa;

insert into product_images (product_id, storage_key, mime_type, byte_size, kind, alt_fa, sort_order, is_primary)
select products.id, image.storage_key, 'image/png', image.byte_size, image.kind::product_image_kind,
       image.alt_fa, image.sort_order, image.is_primary
from products
cross join (
  values
    ('media/products/ht-nhv-0001/full-frontal.png', 2876472::bigint, 'full_frontal', 'نمای روبه‌روی کامل تابلوفرش نورعلی‌شاه با حاشیه‌های کتیبه‌دار', 0, true),
    ('media/products/ht-nhv-0001/studio-three-quarter.png', 2600117::bigint, 'three_quarter', 'نمای زاویه‌دار تابلوفرش تصویری نورعلی‌شاه', 1, false),
    ('media/products/ht-nhv-0001/display-context.png', 2665547::bigint, 'in_room', 'تابلوفرش نورعلی‌شاه در نمای نمایشگاهی روی دیوار', 2, false),
    ('media/products/ht-nhv-0001/portrait-detail.jpg', 4762663::bigint, 'field_detail', 'جزئیات پرتره‌ی نورعلی‌شاه، پوشش و ابزار در تابلوفرش', 3, false),
    ('media/products/ht-nhv-0001/portrait-and-blossom-detail.jpg', 3998471::bigint, 'field_detail', 'جزئیات چهره و شکوفه‌های تابلوفرش نورعلی‌شاه', 4, false),
    ('media/products/ht-nhv-0001/portrait-and-tree-detail.jpg', 4799785::bigint, 'field_detail', 'جزئیات پرتره و درختِ نقش‌شده در تابلوفرش', 5, false),
    ('media/products/ht-nhv-0001/garment-detail.jpg', 4085934::bigint, 'field_detail', 'جزئیات بافت لباس و نقش کیسه‌ی تابلوفرش', 6, false),
    ('media/products/ht-nhv-0001/headdress-and-flower-detail.jpg', 4534417::bigint, 'field_detail', 'جزئیات سربند، شکوفه‌ها و کتیبه‌ی تابلوفرش', 7, false),
    ('media/products/ht-nhv-0001/botanical-weave-detail.jpg', 4236816::bigint, 'field_detail', 'جزئیات شاخه‌ها و پرز تابلوفرش روی زمینه‌ی مشکی', 8, false),
    ('media/products/ht-nhv-0001/botanical-detail.jpg', 4440484::bigint, 'field_detail', 'جزئیات شاخه و گلِ بافته‌شده در تابلوفرش', 9, false),
    ('media/products/ht-nhv-0001/tree-and-calligraphy-detail.jpg', 3562217::bigint, 'border_detail', 'جزئیات درخت و کتیبه‌ی فارسی در حاشیه‌ی تابلوفرش', 10, false),
    ('media/products/ht-nhv-0001/branch-and-calligraphy-detail.jpg', 3863563::bigint, 'border_detail', 'جزئیات شاخه و کتیبه‌ی پایینی تابلوفرش', 11, false),
    ('media/products/ht-nhv-0001/inscription-and-animals.jpg', 4645625::bigint, 'border_detail', 'جزئیات پرندگان، ماهی و کتیبه‌ی فارسی در پایین تابلوفرش', 12, false),
    ('media/products/ht-nhv-0001/waterlife-detail.jpg', 3636356::bigint, 'field_detail', 'جزئیات ماهی‌ها و پرندگانِ بافته‌شده در پایین تابلوفرش', 13, false)
) as image(storage_key, byte_size, kind, alt_fa, sort_order, is_primary)
where products.sku = 'HT-NHV-0001'
on conflict (storage_key) do update set
  byte_size = excluded.byte_size,
  kind = excluded.kind,
  alt_fa = excluded.alt_fa,
  sort_order = excluded.sort_order,
  is_primary = excluded.is_primary;

insert into inventory_movements (product_id, movement_type, quantity_delta, note_fa)
select products.id, 'received', 1, 'ثبت اولیه‌ی موجودی؛ تک‌تخته.'
from products
where products.sku = 'HT-NHV-0001'
  and not exists (
    select 1
    from inventory_movements
    where inventory_movements.product_id = products.id
      and inventory_movements.movement_type = 'received'
      and inventory_movements.note_fa = 'ثبت اولیه‌ی موجودی؛ تک‌تخته.'
  );

commit;

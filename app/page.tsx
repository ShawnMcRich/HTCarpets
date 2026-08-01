import { useEffect, useMemo, useState } from "react";
import { catalogProducts } from "./catalog";
import {
  collectionLabel,
  formatPrice,
  getContextImage,
  isKnownValue,
  productSearchText,
} from "./catalog-helpers";

type CollectionFilter = "all" | "home" | "antique";
type SortOrder = "curated" | "price-asc" | "price-desc";

const collectionFilters: Array<{ value: CollectionFilter; label: string }> = [
  { value: "all", label: "همه‌ی فرش‌ها" },
  { value: "home", label: "برای خانه" },
  { value: "antique", label: "آنتیک و نیمه‌آنتیک" },
];

const contextStories = catalogProducts
  .map((product) => ({ product, image: getContextImage(product) }))
  .filter((story): story is { product: (typeof catalogProducts)[number]; image: NonNullable<ReturnType<typeof getContextImage>> } => Boolean(story.image))
  .filter(({ product }) =>
    ["HT-KSH-0001", "HT-KHY-0001", "HT-ISF-0002", "HT-SNH-0001", "HT-QOM-0004", "HT-TBZ-0001"].includes(product.sku),
  );

function formatIndex(index: number) {
  return index.toLocaleString("fa-IR", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
}

export default function Home() {
  const [collectionFilter, setCollectionFilter] = useState<CollectionFilter>("all");
  const [originFilter, setOriginFilter] = useState("all");
  const [collectionQuery, setCollectionQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("curated");

  useEffect(() => {
    document.title = "فرش حسین‌طلب | مجموعه‌ی فرش‌های دستباف ایرانی";
  }, []);

  const origins = useMemo(
    () =>
      Array.from(new Set(catalogProducts.map((product) => product.originName))).sort(
        new Intl.Collator("fa-IR").compare,
      ),
    [],
  );

  const visibleCollection = useMemo(() => {
    const query = collectionQuery.trim().toLocaleLowerCase("fa-IR");
    const products = catalogProducts.filter((product) => {
      const matchesCollection =
        collectionFilter === "all" || product.collection === collectionFilter;
      const matchesOrigin = originFilter === "all" || product.originName === originFilter;
      const matchesQuery = !query || productSearchText(product).includes(query);
      return matchesCollection && matchesOrigin && matchesQuery;
    });

    if (sortOrder === "price-asc") {
      return [...products].sort((a, b) => a.priceToman - b.priceToman);
    }
    if (sortOrder === "price-desc") {
      return [...products].sort((a, b) => b.priceToman - a.priceToman);
    }
    return products;
  }, [collectionFilter, collectionQuery, originFilter, sortOrder]);

  const resetFilters = () => {
    setCollectionFilter("all");
    setOriginFilter("all");
    setCollectionQuery("");
    setSortOrder("curated");
  };

  const heroProduct = catalogProducts.find((product) => product.sku === "HT-QOM-0003")!;
  const heroImage = getContextImage(heroProduct)!;

  return (
    <>
      <a className="skip-link" href="#main-content">
        رفتن به محتوای اصلی
      </a>

      <div className="service-line">
        <div className="shell service-line__inner">
          <p>بازار فرش تهران · از ۱۲۹۰ هجری شمسی</p>
          <p>هر فرش با کد، تصاویر همان تخته و اطلاعات ثبت‌شده</p>
        </div>
      </div>

      <header className="site-header">
        <div className="shell site-header__inner">
          <a className="site-brand" href="#top" aria-label="فرش حسین‌طلب؛ صفحه‌ی نخست">
            <picture>
              <source media="(max-width: 580px)" srcSet="/brand/exports/hosseintalab-icon-192.png" />
              <img
                src="/brand/exports/hosseintalab-lockup-horizontal.svg"
                alt="Hosseintalab — Persian Handwoven Carpets — Est. 1290 SH"
                width="1600"
                height="300"
              />
            </picture>
          </a>
          <nav className="main-nav" aria-label="راهنمای اصلی">
            <a href="#collection">فرش‌های موجود</a>
            <a href="#places">فرش و جغرافیا</a>
            <a href="#buying-guide">روش انتخاب</a>
            <a href="#heritage">درباره‌ی حسین‌طلب</a>
          </nav>
          <a className="header-cta" href="#collection">
            دیدن مجموعه
          </a>
        </div>
      </header>

      <main id="main-content">
        <section id="top" className="hero shell">
          <div className="hero__intro">
            <div className="hero__title">
              <p className="eyebrow">مجموعه‌ی حاضر · {catalogProducts.length.toLocaleString("fa-IR")} تک‌تخته</p>
              <h1>
                فرش را کامل ببینید.
                <em>بعد انتخاب کنید.</em>
              </h1>
            </div>
            <div className="hero__copy">
              <p className="hero__lead">
                نمای کامل، جزئیات بافت و تصویر محیطیِ همان تخته را کنار اطلاعات روشن آن ببینید؛
                بی‌برش، بی‌اغراق و آماده‌ی مقایسه.
              </p>
              <div className="hero__actions">
                <a className="button button--primary" href="#collection">
                  فرش‌های موجود را ببینید
                </a>
                <a className="text-link" href="#buying-guide">
                  روش بررسی هر فرش
                </a>
              </div>
            </div>
          </div>

          <figure className="hero__media">
            <a href={`/carpets/${heroProduct.slug}`} aria-label={`مشاهده‌ی ${heroProduct.name}`}>
              <img
                src={heroImage.src}
                alt={heroImage.alt}
                width="1536"
                height="1024"
                fetchPriority="high"
              />
            </a>
            <figcaption>
              <div>
                <span>قم · نمای محیطی همان تخته</span>
                <strong>{heroProduct.name}</strong>
              </div>
              <a href={`/carpets/${heroProduct.slug}`}>دیدن تصاویر و شناسنامه</a>
            </figcaption>
          </figure>
        </section>

        <section className="proof-strip" aria-label="اصول ارائه‌ی مجموعه">
          <div className="shell proof-strip__grid">
            <article>
              <strong>۰۱</strong>
              <div>
                <h2>تصاویرِ همان تخته</h2>
                <p>نمای کامل، جزئیات و تصویر محیطیِ همان فرش را پیش از تصمیم کنار هم ببینید.</p>
              </div>
            </article>
            <article>
              <strong>۰۲</strong>
              <div>
                <h2>قیمت، پیش از تماس</h2>
                <p>قیمت ثبت‌شده روی صفحه آمده است تا محدوده‌ی انتخاب از همان ابتدا روشن باشد.</p>
              </div>
            </article>
            <article>
              <strong>۰۳</strong>
              <div>
                <h2>یک کد برای پیگیری</h2>
                <p>هر سؤال و بررسی بعدی را با کد یکتای همان فرش ادامه دهید.</p>
              </div>
            </article>
          </div>
        </section>

        <section id="places" className="section context-section">
          <div className="shell">
            <div className="context-section__head">
              <div>
                <p className="eyebrow">فرش و جغرافیا</p>
                <h2>هر تخته را در نسبت با جایی که از آن آمده ببینید.</h2>
              </div>
              <p>
                تصاویر محیطی بخشی از روایت محصول‌اند: نه پس‌زمینه‌ی تزئینی، بلکه راهی برای دیدن
                رنگ، مقیاس و شخصیت فرش در یک قاب ایرانی.
              </p>
            </div>

            <div className="place-grid">
              {contextStories.map(({ product, image }, index) => (
                <figure className="place-card" key={product.sku}>
                  <a className="place-card__image" href={`/carpets/${product.slug}`}>
                    <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
                  </a>
                  <figcaption>
                    <span>{formatIndex(index + 1)}</span>
                    <div>
                      <p>{product.originName}</p>
                      <a href={`/carpets/${product.slug}`}>{product.name}</a>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="collection" className="section collection-section">
          <div className="shell">
            <div className="section-heading section-heading--split collection-heading">
              <div>
                <p className="eyebrow">مجموعه‌ی موجود</p>
                <h2>فرش را کامل ببینید؛ بعد مقایسه کنید.</h2>
              </div>
              <p>
                هر کارت با نمای روبه‌روی کامل آغاز می‌شود. اگر تصویر محیطیِ همان تخته ثبت شده
                باشد، بدون برش و تغییر نسبت کنار آن می‌آید.
              </p>
            </div>

            <div className="collection-tools" aria-label="فیلترهای مجموعه">
              <div className="collection-tabs" aria-label="نوع مجموعه">
                {collectionFilters.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    className={collectionFilter === filter.value ? "is-active" : ""}
                    aria-pressed={collectionFilter === filter.value}
                    onClick={() => setCollectionFilter(filter.value)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              <label className="field-control field-control--search">
                <span>جست‌وجو</span>
                <input
                  type="search"
                  value={collectionQuery}
                  onChange={(event) => setCollectionQuery(event.target.value)}
                  placeholder="نام، کد، شهر، نقش یا رنگ"
                />
              </label>

              <label className="field-control">
                <span>محل بافت</span>
                <select value={originFilter} onChange={(event) => setOriginFilter(event.target.value)}>
                  <option value="all">همه‌ی شهرها</option>
                  {origins.map((origin) => (
                    <option value={origin} key={origin}>{origin}</option>
                  ))}
                </select>
              </label>

              <label className="field-control">
                <span>مرتب‌سازی</span>
                <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as SortOrder)}>
                  <option value="curated">چیدمان مجموعه</option>
                  <option value="price-asc">کمترین قیمت</option>
                  <option value="price-desc">بیشترین قیمت</option>
                </select>
              </label>
            </div>

            <div className="collection-result-line" aria-live="polite">
              <p>{visibleCollection.length.toLocaleString("fa-IR")} فرش نمایش داده می‌شود</p>
              {(collectionFilter !== "all" || originFilter !== "all" || collectionQuery || sortOrder !== "curated") && (
                <button type="button" onClick={resetFilters}>پاک‌کردن فیلترها</button>
              )}
            </div>

            <div className="product-grid">
              {visibleCollection.map((product, index) => {
                const contextImage = getContextImage(product);
                return (
                  <article className="product-card" key={product.sku}>
                    <div className="product-card__visual">
                      <a className="product-card__frontal" href={`/carpets/${product.slug}`}>
                        <img src={product.image} alt={product.alt} loading="lazy" decoding="async" />
                      </a>
                      {contextImage && (
                        <figure className="product-card__context">
                          <a href={`/carpets/${product.slug}`} tabIndex={-1}>
                            <img src={contextImage.src} alt="" loading="lazy" decoding="async" />
                          </a>
                          <figcaption>در {product.originName}</figcaption>
                        </figure>
                      )}
                    </div>

                    <div className="product-card__body">
                      <div className="product-card__meta">
                        <span>{formatIndex(index + 1)}</span>
                        <span>{collectionLabel(product)}</span>
                        <span dir="ltr">{product.sku}</span>
                      </div>
                      <h3><a href={`/carpets/${product.slug}`}>{product.name}</a></h3>
                      <p>{product.description}</p>
                      <dl>
                        <div><dt>محل بافت</dt><dd>{product.originName}</dd></div>
                        {isKnownValue(product.size) && <div><dt>ابعاد</dt><dd>{product.size}</dd></div>}
                        <div><dt>قیمت</dt><dd>{formatPrice(product.priceToman)}</dd></div>
                      </dl>
                      <a className="product-card__link" href={`/carpets/${product.slug}`}>
                        تصاویر و شناسنامه‌ی کامل
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>

            {visibleCollection.length === 0 && (
              <div className="collection-empty">
                <p>فرشی با این ترکیب پیدا نشد.</p>
                <button type="button" onClick={resetFilters}>نمایش دوباره‌ی همه‌ی فرش‌ها</button>
              </div>
            )}
          </div>
        </section>

        <section id="buying-guide" className="section buying-guide">
          <div className="shell buying-guide__grid">
            <div className="buying-guide__intro">
              <p className="eyebrow eyebrow--light">روش انتخاب</p>
              <h2>اطمینان از دیدن شروع می‌شود.</h2>
              <p>
                برای یک فرش تک‌تخته، عکس زیبا کافی نیست. باید بتوانید کل فرش، نسبت واقعی، لبه‌ها،
                جزئیات نقش و اطلاعات ثبت‌شده را کنار هم ببینید.
              </p>
            </div>
            <ol className="buying-guide__steps">
              <li>
                <span>۱</span>
                <div><h3>نمای کامل را ببینید</h3><p>نسبت، رنگ زمینه و ساختار حاشیه را بدون برش بررسی کنید.</p></div>
              </li>
              <li>
                <span>۲</span>
                <div><h3>جزئیات ثبت‌شده را بخوانید</h3><p>ابعاد، محل بافت، جنس ثبت‌شده، قدمت و توضیح وضعیت را کنار تصویر بگذارید.</p></div>
              </li>
              <li>
                <span>۳</span>
                <div><h3>کد فرش را نگه دارید</h3><p>هر گفت‌وگو و بررسی بعدی را با همان کد یکتا ادامه دهید تا ابهامی درباره‌ی تخته نباشد.</p></div>
              </li>
            </ol>
          </div>
        </section>

        <section id="heritage" className="section heritage-section">
          <div className="shell heritage-section__grid">
            <div className="heritage-section__mark">
              <img
                src="/brand/exports/hosseintalab-seal.svg"
                alt="نشان حسین‌طلب؛ فرش دستباف ایرانی؛ تأسیس ۱۲۹۰ هجری شمسی"
                width="900"
                height="1000"
                loading="lazy"
              />
            </div>
            <div className="heritage-section__copy">
              <p className="eyebrow">ریشه در بازار فرش تهران</p>
              <h2>اعتماد، پیش از فروشگاه آنلاین ساخته شده است.</h2>
              <p>
                فعالیت خانواده‌ی حسین‌طلب از سال ۱۲۹۰ هجری شمسی در بازار فرش تهران آغاز شده
                است. این فروشگاه قرار نیست آن تجربه را با ادعاهای پرزرق‌وبرق جایگزین کند؛ باید
                شناخت فرش را به اطلاعات روشن، تصویر دقیق و انتخاب کم‌ریسک‌تر تبدیل کند.
              </p>
              <a className="text-link" href="#collection">بازگشت به مجموعه‌ی موجود</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell site-footer__top">
          <img
            src="/brand/exports/hosseintalab-lockup-horizontal-reversed.svg"
            alt="Hosseintalab"
            width="1600"
            height="300"
          />
          <p>فرش دستباف ایرانی، با تصویر همان تخته و اطلاعاتی که بتوان بررسی کرد.</p>
        </div>
        <div className="shell site-footer__nav">
          <a href="#collection">فرش‌های موجود</a>
          <a href="#places">فرش و جغرافیا</a>
          <a href="#buying-guide">روش انتخاب</a>
          <a href="#heritage">درباره‌ی حسین‌طلب</a>
        </div>
        <div className="shell site-footer__bottom">
          <p>© ۱۴۰۵ حسین‌طلب</p>
          <a href="#top">بازگشت به ابتدای صفحه</a>
        </div>
      </footer>
    </>
  );
}

import { useEffect, useMemo, useState } from "react";
import { catalogProducts, type CatalogProduct } from "./catalog";
import {
  collectionLabel,
  formatPrice,
  getContextImage,
  isKnownValue,
} from "./catalog-helpers";
import { contact, whatsappProductHref } from "./contact";

type Spec = {
  label: string;
  value: string;
};

export default function ProductPage({ product }: { product: CatalogProduct }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const activeImage = product.images[selectedImage];
  const contextImage = getContextImage(product);

  useEffect(() => {
    document.title = `${product.name} | فرش حسین‌طلب`;
    setSelectedImage(0);
    setLightboxOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [product.name]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [lightboxOpen]);

  const specs = useMemo(() => {
    const values: Array<Spec & { known?: boolean }> = [
      { label: "محل بافت", value: product.originName },
      { label: "ابعاد", value: product.dimensions, known: isKnownValue(product.dimensions) },
      { label: "طرح و نقشه", value: product.pattern },
      { label: "جنس ثبت‌شده", value: product.materials, known: isKnownValue(product.materials) },
      { label: "قدمت تقریبی", value: product.ageLabel, known: isKnownValue(product.ageLabel) },
      { label: "رنگ زمینه", value: product.fieldColor },
      { label: "رنگ‌های حاشیه", value: product.borderColor },
    ];
    return values.filter((spec) => spec.known !== false);
  }, [product]);

  const relatedProducts = useMemo(() => {
    const sameOrigin = catalogProducts.filter(
      (candidate) => candidate.slug !== product.slug && candidate.originName === product.originName,
    );
    const sameCollection = catalogProducts.filter(
      (candidate) => candidate.slug !== product.slug && candidate.collection === product.collection,
    );
    return Array.from(new Map([...sameOrigin, ...sameCollection].map((candidate) => [candidate.slug, candidate])).values()).slice(0, 3);
  }, [product]);

  const copyProductLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <a className="skip-link" href="#product-main">رفتن به محتوای اصلی</a>

      <div className="service-line">
        <div className="shell service-line__inner">
          <p>بازار فرش تهران · از ۱۲۹۰ هجری شمسی</p>
          <p>تصاویر این صفحه متعلق به همین فرش است</p>
        </div>
      </div>

      <header className="site-header product-site-header">
        <div className="shell site-header__inner">
          <a className="site-brand" href="/" aria-label="فرش حسین‌طلب؛ صفحه‌ی نخست">
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
          <nav className="product-nav" aria-label="راهنمای صفحه‌ی فرش">
            <a href="#identity">شناسنامه</a>
            {contextImage && <a href="#place">نمای محیطی</a>}
            <a href="#all-images">همه‌ی تصاویر</a>
          </nav>
          <a className="header-cta" href="/#collection">بازگشت به مجموعه</a>
        </div>
      </header>

      <main id="product-main" className="product-page">
        <div className="shell product-breadcrumb" aria-label="مسیر صفحه">
          <a href="/">صفحه‌ی نخست</a>
          <span>/</span>
          <a href="/#collection">مجموعه‌ی فرش‌ها</a>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <section className="shell product-hero">
          <div className="product-gallery">
            <button
              className="product-gallery__main"
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label={`نمایش بزرگ ${activeImage.label}`}
            >
              <img src={activeImage.src} alt={activeImage.alt} />
              <span>نمایش در اندازه‌ی بزرگ</span>
            </button>

            <div className="product-gallery__thumbs" aria-label="انتخاب تصویر فرش">
              {product.images.map((image, index) => (
                <button
                  className={index === selectedImage ? "is-active" : ""}
                  key={image.src}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  aria-pressed={index === selectedImage}
                >
                  <img src={image.src} alt="" loading="lazy" decoding="async" />
                  <span>{image.label}</span>
                </button>
              ))}
            </div>
          </div>

          <aside className="product-summary">
            <p className="eyebrow">{collectionLabel(product)}</p>
            <h1>{product.name}</h1>
            <p className="product-summary__lead">{product.description}</p>
            <div className="product-summary__price">
              <span>قیمت ثبت‌شده</span>
              <strong>{formatPrice(product)}</strong>
            </div>
            <p className="product-summary__availability">
              تک‌تخته · موجودی و وضعیت نهایی پیش از تصمیم تأیید می‌شود
            </p>

            <dl className="product-summary__quick-facts">
              <div><dt>محل بافت</dt><dd>{product.originName}</dd></div>
              {isKnownValue(product.dimensions) && <div><dt>ابعاد</dt><dd>{product.dimensions}</dd></div>}
              <div><dt>طرح و نقشه</dt><dd>{product.pattern}</dd></div>
            </dl>

            <div className="product-summary__actions">
              <a
                className="button button--primary"
                href={whatsappProductHref(product)}
                target="_blank"
                rel="noreferrer"
              >
                پیام در واتساپ درباره‌ی این فرش
              </a>
              <a
                className="button product-summary__instagram"
                href={contact.instagramHref}
                target="_blank"
                rel="noreferrer"
              >
                دایرکت اینستاگرام
              </a>
              <a className="button product-summary__call" href={contact.callHref}>
                تماس تلفنی
              </a>
              <button className="product-summary__copy" type="button" onClick={copyProductLink}>
                {copied ? "لینک صفحه کپی شد" : "کپی لینک این فرش"}
              </button>
            </div>
            <p className="product-summary__note">
              لازم نیست کدی حفظ کنید؛ نام فرش، لینک همین صفحه یا اسکرین‌شات آن کافی است.
              <br />
              واتساپ: <a href={contact.whatsappHref} dir="ltr">{contact.whatsappDisplay}</a>
              <span aria-hidden="true"> · </span>
              اینستاگرام: <a href={contact.instagramHref} dir="ltr">{contact.instagramDisplay}</a>
              <span aria-hidden="true"> · </span>
              تماس: <a href={contact.callHref} dir="ltr">{contact.callDisplay}</a>
            </p>
          </aside>
        </section>

        <section id="identity" className="section product-identity">
          <div className="shell product-identity__grid">
            <div className="section-heading product-identity__intro">
              <p className="eyebrow">شناسنامه‌ی فرش</p>
              <h2>آنچه درباره‌ی این تخته ثبت شده است.</h2>
              <p>{product.longDescription}</p>
            </div>
            <dl className="product-specs">
              {specs.map((spec) => (
                <div key={spec.label}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
              <div><dt>قیمت ثبت‌شده</dt><dd>{formatPrice(product)}</dd></div>
            </dl>
          </div>
        </section>

        {contextImage && (
          <section id="place" className="section product-place">
            <div className="shell product-place__grid">
              <figure>
                <img src={contextImage.src} alt={contextImage.alt} loading="lazy" decoding="async" />
                <figcaption>نمای محیطی ثبت‌شده برای {product.name}</figcaption>
              </figure>
              <div>
                <p className="eyebrow">فرش در بستر جغرافیا</p>
                <h2>{product.originName}؛ زمینه‌ای برای دیدن رنگ و شخصیت فرش.</h2>
                <p>{product.designNote}</p>
                <p className="product-place__note">
                  تصویر محیطی برای روایت و مقیاس است. برای بررسی دقیق رنگ، حاشیه و تناسب، نمای کامل و تصاویر جزئیات را ملاک قرار دهید.
                </p>
              </div>
            </div>
          </section>
        )}

        <section id="all-images" className="section product-record">
          <div className="shell">
            <div className="section-heading section-heading--split">
              <div>
                <p className="eyebrow">پرونده‌ی تصویری</p>
                <h2>همه‌ی تصاویر، با نسبت اصلی.</h2>
              </div>
              <p>
                نمای کامل برای شکل کلی، نمای زاویه‌دار برای افت و حجم، و تصاویر نزدیک برای دیدن نقش و بافت کنار هم آمده‌اند.
              </p>
            </div>
            <div className="product-record__grid">
              {product.images.map((image, index) => (
                <figure key={image.src}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(index);
                      setLightboxOpen(true);
                    }}
                    aria-label={`نمایش بزرگ ${image.label}`}
                  >
                    <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
                  </button>
                  <figcaption>{image.label}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="section product-notes">
          <div className="shell product-notes__grid">
            <article>
              <p className="eyebrow">خوانش طرح</p>
              <h2>ساختار نقشه</h2>
              <p>{product.designNote}</p>
            </article>
            <article>
              <p className="eyebrow">وضعیت و بررسی</p>
              <h2>پیش از تصمیم نهایی</h2>
              <p>{product.conditionNote}</p>
            </article>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="section related-products">
            <div className="shell">
              <div className="section-heading section-heading--split">
                <div>
                  <p className="eyebrow">برای مقایسه</p>
                  <h2>سه تخته‌ی دیگر از مجموعه</h2>
                </div>
                <a className="text-link" href="/#collection">دیدن همه‌ی فرش‌ها</a>
              </div>
              <div className="related-products__grid">
                {relatedProducts.map((related) => (
                  <article key={related.sku}>
                    <a href={`/carpets/${related.slug}`}>
                      <img src={related.image} alt={related.alt} loading="lazy" decoding="async" />
                    </a>
                    <h3><a href={`/carpets/${related.slug}`}>{related.name}</a></h3>
                    <span>{related.originName} · {formatPrice(related)}</span>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="site-footer product-footer">
        <div className="shell site-footer__top">
          <img
            src="/brand/exports/hosseintalab-lockup-horizontal-reversed.svg"
            alt="Hosseintalab"
            width="1600"
            height="300"
          />
          <p>فرش دستباف ایرانی، با تصویر همان تخته و اطلاعاتی که بتوان بررسی کرد.</p>
        </div>
        <div className="shell site-footer__bottom">
          <p>© ۱۴۰۵ حسین‌طلب</p>
          <div className="product-footer__links">
            <a href={contact.whatsappHref} target="_blank" rel="noreferrer" dir="ltr">
              WhatsApp {contact.whatsappDisplay}
            </a>
            <a href={contact.instagramHref} target="_blank" rel="noreferrer" dir="ltr">
              Instagram {contact.instagramDisplay}
            </a>
            <a href={contact.callHref} dir="ltr">Call {contact.callDisplay}</a>
            <a href={contact.mapsHref} target="_blank" rel="noreferrer">{contact.address}</a>
            <a href="/#collection">بازگشت به مجموعه‌ی فرش‌ها</a>
          </div>
        </div>
      </footer>

      {lightboxOpen && (
        <div
          className="image-lightbox"
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setLightboxOpen(false);
          }}
        >
          <div className="image-lightbox__dialog" role="dialog" aria-modal="true" aria-label={activeImage.label}>
            <button type="button" onClick={() => setLightboxOpen(false)}>بستن</button>
            <img src={activeImage.src} alt={activeImage.alt} />
            <p>{activeImage.label} · {product.name}</p>
          </div>
        </div>
      )}
    </>
  );
}

import type { CatalogProduct } from "./catalog";
import { collectionLabel, formatPrice } from "./catalog-helpers";
import { contact } from "./contact";

export function BrandSignature({ reversed = false }: { reversed?: boolean }) {
  return (
    <span className={`brand-signature${reversed ? " brand-signature--reversed" : ""}`}>
      <img
        src="/brand/raster/hosseintalab-medallion-transparent.png"
        alt=""
        width="608"
        height="710"
      />
      <span>
        <strong lang="en" dir="ltr">HOSSEINTALAB</strong>
        <small>فرش دستباف ایرانی</small>
      </span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <>
      <div className="service-line">
        <div className="shell service-line__inner">
          <p>بازار فرش تهران · بازدید حضوری با هماهنگی</p>
          <p>هر فرش با نام، تصاویر همان تخته و اطلاعات ثبت‌شده</p>
        </div>
      </div>
      <header className="site-header editorial-site-header">
        <div className="shell site-header__inner">
          <a className="site-brand" href="/" aria-label="فرش حسین‌طلب؛ صفحه‌ی نخست">
            <BrandSignature />
          </a>
          <nav className="main-nav" aria-label="راهنمای اصلی">
            <a href="/#collection">فرش‌های موجود</a>
            <a href="/origins/">محل بافت</a>
            <a href="/guides/">راهنمای خرید</a>
            <a href="/about/">درباره‌ی حسین‌طلب</a>
            <a href="/contact/">تماس</a>
          </nav>
          <a className="header-cta" href="/#collection">دیدن مجموعه</a>
        </div>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__top">
        <BrandSignature reversed />
        <p>فرش دستباف ایرانی، با تصویر همان تخته و اطلاعاتی که بتوان بررسی کرد.</p>
      </div>
      <div className="shell site-footer__nav">
        <a href="/#collection">فرش‌های موجود</a>
        <a href="/origins/">فرش‌ها بر پایه‌ی محل بافت</a>
        <a href="/guides/">راهنمای خرید و شناخت فرش</a>
        <a href="/about/">درباره‌ی حسین‌طلب</a>
        <a href="/contact/">نشانی و راه‌های تماس</a>
        <a href={contact.whatsappHref} target="_blank" rel="noreferrer" dir="ltr">
          WhatsApp {contact.whatsappDisplay}
        </a>
        <a href={contact.instagramHref} target="_blank" rel="noreferrer" dir="ltr">
          Instagram {contact.instagramDisplay}
        </a>
        <a href={contact.callHref} dir="ltr">Call {contact.callDisplay}</a>
        <a href={contact.mapsHref} target="_blank" rel="noreferrer">{contact.address}</a>
      </div>
      <div className="shell site-footer__bottom">
        <p>© ۱۴۰۵ حسین‌طلب</p>
        <a href="#top">بازگشت به ابتدای صفحه</a>
      </div>
    </footer>
  );
}

export function Breadcrumbs({
  items,
}: {
  items: Array<{ label: string; href?: string }>;
}) {
  return (
    <nav className="shell product-breadcrumb" aria-label="مسیر صفحه">
      {items.map((item, index) => (
        <span className="breadcrumb-item" key={`${item.label}-${index}`}>
          {index > 0 && <span aria-hidden="true">/</span>}
          {item.href ? <a href={item.href}>{item.label}</a> : <span aria-current="page">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function CatalogCard({ product }: { product: CatalogProduct }) {
  return (
    <article className="seo-product-card">
      <a className="seo-product-card__image" href={`/carpets/${product.slug}/`}>
        <img src={product.image} alt={product.alt} loading="lazy" decoding="async" />
      </a>
      <div>
        <p>{collectionLabel(product)} · {product.originName}</p>
        <h3><a href={`/carpets/${product.slug}/`}>{product.name}</a></h3>
        <span>{product.dimensions} · {formatPrice(product)}</span>
      </div>
    </article>
  );
}

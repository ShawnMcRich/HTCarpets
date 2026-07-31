import { useEffect, useState } from "react";
import type { CatalogProduct } from "./catalog";

function formatPrice(price: number) {
  return `${price.toLocaleString("fa-IR")} تومان`;
}

export default function ProductPage({ product }: { product: CatalogProduct }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const activeImage = product.images[selectedImage];

  useEffect(() => {
    document.title = `${product.name} | فرش حسین‌طلب`;
  }, [product.name]);

  return (
    <main className="product-page">
      <header className="product-header">
        <a className="product-header__brand" href="/" aria-label="بازگشت به صفحه‌ی اصلی حسین‌طلب">
          <img src="/brand/vector/hosseintalab-lockup-horizontal.svg" alt="فرش حسین‌طلب" />
        </a>
        <a className="product-header__back" href="/#collection">
          بازگشت به فرش‌های موجود
        </a>
      </header>

      <section className="product-hero shell">
        <div className="product-gallery">
          <div className="product-gallery__main">
            <img src={activeImage.src} alt={activeImage.alt} width="1000" height="1573" />
          </div>
          <div className="product-gallery__thumbs" aria-label="گالری تصاویر فرش">
            {product.images.map((image, index) => (
              <button
                className={index === selectedImage ? "is-active" : ""}
                key={image.src}
                type="button"
                onClick={() => setSelectedImage(index)}
                aria-pressed={index === selectedImage}
                aria-label={`نمایش ${image.label}`}
              >
                <img src={image.src} alt="" width="160" height="220" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        <div className="product-summary">
          <p className="eyebrow">
            {product.collection === "antique" ? "فرش آنتیک" : "فرش دستباف"} · رنگ طبیعی · تک‌تخته
          </p>
          <p className="product-summary__sku">کد فرش: {product.sku}</p>
          <h1>{product.name}</h1>
          <p className="product-summary__lead">{product.description}</p>
          <p className="product-summary__price">{formatPrice(product.priceToman)}</p>
          <p className="product-summary__availability">موجود · تنها یک تخته</p>
          <div className="product-summary__craft" aria-label="ویژگی‌های بافت">
            <span><strong>رنگ طبیعی</strong><small>رنگرزی گیاهی</small></span>
            <span><strong>پشم دست‌ریس</strong><small>Hand-spun wool</small></span>
          </div>
          <a className="button" href="/#consultation">
            درخواست مشاوره و بازدید
          </a>
          <p className="product-summary__note">پیش از خرید، عکس و ویدیوی تکمیلی یا بازدید حضوری هماهنگ می‌شود.</p>
        </div>
      </section>

      <section className="product-details shell">
        <div className="product-details__intro">
          <p className="eyebrow">شناسنامه‌ی فرش</p>
          <h2>طرح و روایتِ این فرش</h2>
          <p>{product.longDescription}</p>
        </div>
        <dl className="product-specs">
          <div><dt>محل بافت</dt><dd>{product.originName}</dd></div>
          <div><dt>ابعاد</dt><dd>{product.dimensions}</dd></div>
          <div><dt>قدمت تقریبی</dt><dd>{product.ageLabel}</dd></div>
          <div><dt>دسته‌ی سنی</dt><dd>نیمه‌آنتیک</dd></div>
          <div><dt>طرح و نقشه</dt><dd>{product.pattern}</dd></div>
          <div><dt>جنس پرز</dt><dd>{product.materials} · پشم دست‌ریس</dd></div>
          <div><dt>نوع رنگ</dt><dd>رنگ طبیعی / گیاهی</dd></div>
          <div><dt>رنگ زمینه</dt><dd>{product.fieldColor}</dd></div>
          <div><dt>رنگ‌های حاشیه</dt><dd>{product.borderColor}</dd></div>
          <div><dt>قیمت</dt><dd>{product.priceLabel}</dd></div>
          <div><dt>موجودی</dt><dd>۱ تخته</dd></div>
        </dl>
      </section>

      <section className="product-notes">
        <div className="shell product-notes__grid">
          <article>
            <p className="eyebrow">خوانش نقشه</p>
            <h2>درخت، پرنده و باغ</h2>
            <p>{product.designNote}</p>
          </article>
          <article>
            <p className="eyebrow">وضعیت و بازدید</p>
            <h2>شفاف پیش از انتخاب</h2>
            <p>{product.conditionNote}</p>
          </article>
        </div>
      </section>
    </main>
  );
}

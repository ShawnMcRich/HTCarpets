import { catalogProducts } from "./catalog";
import { contact } from "./contact";
import type { GuidePage, OriginGroup } from "./seo-content";
import { guidePages, originGroups } from "./seo-content";
import { Breadcrumbs, CatalogCard, SiteFooter, SiteHeader } from "./site-frame";

function PageIntro({
  eyebrow,
  title,
  summary,
}: {
  eyebrow: string;
  title: string;
  summary: string;
}) {
  return (
    <section className="editorial-hero shell">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{summary}</p>
    </section>
  );
}

function FaqSection({ items }: { items: GuidePage["faq"] }) {
  return (
    <section className="section editorial-faq">
      <div className="shell">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">پرسش‌های متداول</p>
            <h2>پاسخ کوتاه به پرسش‌های اصلی</h2>
          </div>
          <p>اگر پاسخ به وضعیت یک فرش مشخص وابسته است، صفحه‌ی همان تخته و بررسی کارشناسی را ملاک قرار دهید.</p>
        </div>
        <div className="faq-list">
          {items.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GuidesIndexPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">رفتن به محتوای اصلی</a>
      <SiteHeader />
      <main id="main-content">
        <div id="top" />
        <Breadcrumbs items={[{ label: "صفحه‌ی نخست", href: "/" }, { label: "راهنمای فرش دستباف" }]} />
        <PageIntro
          eyebrow="راهنمای فرش دستباف"
          title="پیش از انتخاب، سؤال درست بپرسید."
          summary="این راهنماها برای کسی نوشته شده‌اند که می‌خواهد فرش دستباف را برای یک خانه‌ی واقعی انتخاب کند؛ با زبان روشن، بدون ادعای کلی و با تمرکز بر چیزهایی که واقعاً می‌شود دید و بررسی کرد."
        />
        <section className="section editorial-index-section">
          <div className="shell editorial-index-grid">
            {guidePages.map((guide, index) => (
              <article className="editorial-index-card" key={guide.slug}>
                <span>{(index + 1).toLocaleString("fa-IR", { minimumIntegerDigits: 2 })}</span>
                <p className="eyebrow">{guide.eyebrow}</p>
                <h2><a href={`/guides/${guide.slug}/`}>{guide.shortTitle}</a></h2>
                <p>{guide.summary}</p>
                <a className="text-link" href={`/guides/${guide.slug}/`}>خواندن راهنما</a>
              </article>
            ))}
          </div>
        </section>
        <section className="section editorial-cta">
          <div className="shell editorial-cta__inner">
            <div><p className="eyebrow eyebrow--light">از راهنما تا انتخاب</p><h2>برای فضای خودتان فرش می‌خواهید؟</h2></div>
            <p>عکس اتاق، اندازه‌ی تقریبی محل و حدود بودجه را بفرستید تا چند تخته‌ی متناسب از مجموعه پیشنهاد شود.</p>
            <a className="button button--primary" href={contact.whatsappHref} target="_blank" rel="noreferrer">ارسال عکس فضا در واتساپ</a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

export function GuidePageView({ guide }: { guide: GuidePage }) {
  return (
    <>
      <a className="skip-link" href="#main-content">رفتن به محتوای اصلی</a>
      <SiteHeader />
      <main id="main-content">
        <div id="top" />
        <Breadcrumbs
          items={[
            { label: "صفحه‌ی نخست", href: "/" },
            { label: "راهنمای فرش دستباف", href: "/guides/" },
            { label: guide.shortTitle },
          ]}
        />
        <PageIntro eyebrow={guide.eyebrow} title={guide.title} summary={guide.summary} />
        <section className="editorial-meta shell" aria-label="اطلاعات راهنما">
          <span>نویسنده و بازبین: فرش حسین‌طلب</span>
          <span>آخرین بازبینی: مرداد ۱۴۰۵</span>
          <span>{guide.sections.length.toLocaleString("fa-IR")} بخش کاربردی</span>
        </section>
        <article className="section editorial-article">
          <div className="shell editorial-article__layout">
            <div className="editorial-article__body">
              {guide.sections.map((section, index) => (
                <section key={section.heading}>
                  <span className="editorial-article__number">{(index + 1).toLocaleString("fa-IR", { minimumIntegerDigits: 2 })}</span>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.bullets && (
                    <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
                  )}
                </section>
              ))}
            </div>
            <aside className="editorial-article__aside">
              <p className="eyebrow">راهنماهای مرتبط</p>
              {guidePages.filter((candidate) => candidate.slug !== guide.slug).slice(0, 4).map((candidate) => (
                <a href={`/guides/${candidate.slug}/`} key={candidate.slug}>{candidate.shortTitle}</a>
              ))}
              <a className="editorial-article__collection" href="/#collection">دیدن فرش‌های موجود</a>
            </aside>
          </div>
        </article>
        <FaqSection items={guide.faq} />
        <section className="section editorial-cta">
          <div className="shell editorial-cta__inner">
            <div><p className="eyebrow eyebrow--light">مشاوره‌ی انتخاب</p><h2>این راهنما را روی اتاق خودتان اجرا کنید.</h2></div>
            <p>عکس فضا، اندازه‌ی تقریبی و نام فرشی را که پسندیده‌اید بفرستید تا تناسب آن صادقانه بررسی شود.</p>
            <a className="button button--primary" href={contact.whatsappHref} target="_blank" rel="noreferrer">شروع گفت‌وگو در واتساپ</a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

export function OriginsIndexPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">رفتن به محتوای اصلی</a>
      <SiteHeader />
      <main id="main-content">
        <div id="top" />
        <Breadcrumbs items={[{ label: "صفحه‌ی نخست", href: "/" }, { label: "فرش‌ها بر پایه‌ی محل بافت" }]} />
        <PageIntro
          eyebrow="محل بافت"
          title="فرش‌های مجموعه را شهر به شهر ببینید."
          summary="محل بافت یکی از راه‌های شناخت فرش است، نه یک حکم درباره‌ی کیفیت یا قیمت. در هر صفحه فقط نمونه‌های ثبت‌شده‌ی همان گروه همراه با اطلاعات واقعی خودشان نمایش داده می‌شوند."
        />
        <section className="section origin-index-section">
          <div className="shell origin-index-grid">
            {originGroups.map((origin) => {
              const products = catalogProducts.filter((product) => origin.originNames.includes(product.originName));
              const hero = products[0];
              return (
                <article className="origin-index-card" key={origin.slug}>
                  {hero && <a href={`/origins/${origin.slug}/`}><img src={hero.image} alt={hero.alt} loading="lazy" decoding="async" /></a>}
                  <div>
                    <p>{products.length.toLocaleString("fa-IR")} تخته در مجموعه</p>
                    <h2><a href={`/origins/${origin.slug}/`}>{origin.name}</a></h2>
                    <span>{origin.summary}</span>
                    <a className="text-link" href={`/origins/${origin.slug}/`}>دیدن فرش‌های {origin.name}</a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

export function OriginPageView({ origin }: { origin: OriginGroup }) {
  const products = catalogProducts.filter((product) => origin.originNames.includes(product.originName));
  const faq = [
    {
      question: `قیمت فرش دستباف ${origin.name} چطور مشخص می‌شود؟`,
      answer: `قیمت هر تخته به اندازه، نقش، مواد ثبت‌شده، وضعیت، مرمت و ویژگی‌های خود آن وابسته است. قیمت نمونه‌های موجود ${origin.name} در صفحه‌ی هر محصول جداگانه نوشته شده است.`,
    },
    {
      question: `برای خرید اینترنتی فرش ${origin.name} چه چیزی را بررسی کنیم؟`,
      answer: "نمای کامل، جزئیات بافت، لبه و ریشه، ابعاد دقیق، قیمت و توضیح وضعیت را ببینید. برای تأیید رنگ و مقیاس می‌توانید ویدئو یا بازدید حضوری درخواست کنید.",
    },
    {
      question: "آیا همه‌ی فرش‌های این صفحه موجودند؟",
      answer: "صفحه بر پایه‌ی مجموعه‌ی ثبت‌شده ساخته شده است، اما چون هر فرش تک‌تخته است، موجودی نهایی پیش از تصمیم دوباره تأیید می‌شود.",
    },
  ];

  return (
    <>
      <a className="skip-link" href="#main-content">رفتن به محتوای اصلی</a>
      <SiteHeader />
      <main id="main-content">
        <div id="top" />
        <Breadcrumbs
          items={[
            { label: "صفحه‌ی نخست", href: "/" },
            { label: "محل بافت", href: "/origins/" },
            { label: origin.name },
          ]}
        />
        <PageIntro eyebrow="فرش بر پایه‌ی محل بافت" title={origin.title} summary={origin.summary} />
        <section className="section origin-products-section">
          <div className="shell">
            <div className="section-heading section-heading--split">
              <div><p className="eyebrow">مجموعه‌ی موجود</p><h2>{products.length.toLocaleString("fa-IR")} تخته برای بررسی و مقایسه</h2></div>
              <p>قیمت و مشخصات در صفحه‌ی هر فرش آمده است. موجودی نهایی پیش از تصمیم دوباره تأیید می‌شود.</p>
            </div>
            <div className="seo-product-grid">{products.map((product) => <CatalogCard product={product} key={product.slug} />)}</div>
          </div>
        </section>
        <section className="section origin-reading-section">
          <div className="shell origin-reading-section__grid">
            <div><p className="eyebrow">روش مقایسه</p><h2>نام شهر، آغاز بررسی است.</h2></div>
            <div><p>{origin.comparisonNote}</p><p>دو فرش با محل بافت یکسان ممکن است از نظر اندازه، نقش، مواد، سن تقریبی و وضعیت تفاوت جدی داشته باشند. تصمیم را بر پایه‌ی اطلاعات همان تخته بگیرید.</p><a className="text-link" href="/guides/buying-handmade-carpet/">خواندن راهنمای کامل خرید</a></div>
          </div>
        </section>
        <FaqSection items={faq} />
      </main>
      <SiteFooter />
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">رفتن به محتوای اصلی</a>
      <SiteHeader />
      <main id="main-content">
        <div id="top" />
        <Breadcrumbs items={[{ label: "صفحه‌ی نخست", href: "/" }, { label: "درباره‌ی حسین‌طلب" }]} />
        <PageIntro
          eyebrow="درباره‌ی حسین‌طلب"
          title="تجربه‌ی بازار فرش، با اطلاعاتی که آنلاین هم بتوان سنجید."
          summary="حسین‌طلب یک کسب‌وکار خانوادگی در بازار فرش تهران است. نقش این وب‌سایت جایگزین‌کردن گفت‌وگوی کارشناسی نیست؛ قرار است پیش از آن، تصاویر، ابعاد، قیمت و وضعیت هر تخته را روشن و قابل مقایسه کند."
        />
        <section className="section about-values">
          <div className="shell about-values__grid">
            <article><span>۰۱</span><h2>همان تخته را نشان می‌دهیم</h2><p>هر فرش تک‌تخته است. نام، صفحه و تصاویر آن باید به یک موجودی مشخص برگردند تا چیزی که می‌بینید با چیزی که درباره‌اش می‌پرسید یکی باشد.</p></article>
            <article><span>۰۲</span><h2>ابهام را پنهان نمی‌کنیم</h2><p>اگر قدمت، مواد، مرمت یا انتسابی هنوز نیازمند بررسی است، همان وضعیت نوشته می‌شود. عبارت دقیق بهتر از ادعای چشمگیر اما بی‌پشتوانه است.</p></article>
            <article><span>۰۳</span><h2>انتخاب از خانه شروع می‌شود</h2><p>اندازه‌ی فضا، نور، مبلمان و بودجه بخشی از انتخاب‌اند. فرش باید برای شیوه‌ی زندگی و اتاق واقعی شما مناسب باشد.</p></article>
          </div>
        </section>
        <section className="section editorial-cta">
          <div className="shell editorial-cta__inner">
            <div><p className="eyebrow eyebrow--light">بازار فرش تهران</p><h2>برای دیدن مجموعه حضوری هماهنگ کنید.</h2></div>
            <p>{contact.address}</p>
            <a className="button button--primary" href="/contact/">نشانی و راه‌های تماس</a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

export function ContactPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">رفتن به محتوای اصلی</a>
      <SiteHeader />
      <main id="main-content">
        <div id="top" />
        <Breadcrumbs items={[{ label: "صفحه‌ی نخست", href: "/" }, { label: "تماس و نشانی" }]} />
        <PageIntro
          eyebrow="تماس با فرش حسین‌طلب"
          title="نام فرش، لینک صفحه یا عکس اتاق را بفرستید."
          summary="برای بررسی موجودی، دریافت اطلاعات بیشتر، هماهنگی بازدید یا انتخاب فرش برای یک فضای مشخص، از یکی از راه‌های زیر با ما در تماس باشید."
        />
        <section className="section contact-page-section">
          <div className="shell contact-page-grid">
            <a href={contact.whatsappHref} target="_blank" rel="noreferrer"><span>واتساپ</span><strong dir="ltr">{contact.whatsappDisplay}</strong><p>ارسال نام فرش، لینک، اسکرین‌شات یا عکس فضا</p></a>
            <a href={contact.instagramHref} target="_blank" rel="noreferrer"><span>اینستاگرام</span><strong dir="ltr">{contact.instagramDisplay}</strong><p>دیدن محتوای تازه و ارسال دایرکت</p></a>
            <a href={contact.callHref}><span>تماس تلفنی</span><strong dir="ltr">{contact.callDisplay}</strong><p>پرسش درباره‌ی موجودی و هماهنگی بازدید</p></a>
            <a href={contact.mapsHref} target="_blank" rel="noreferrer"><span>نشانی فروشگاه</span><strong>{contact.address}</strong><p>بازکردن موقعیت در نقشه‌ی گوگل</p></a>
          </div>
        </section>
        <section className="section visit-note-section">
          <div className="shell visit-note-section__grid">
            <div><p className="eyebrow">پیش از مراجعه</p><h2>برای بازدید حضوری هماهنگ کنید.</h2></div>
            <div><p>هر فرش تک‌تخته است و ممکن است وضعیت موجودی تغییر کند. پیش از حرکت، نام فرش موردنظر و زمان تقریبی مراجعه را اعلام کنید تا موجودی و امکان بازدید تأیید شود.</p><p>ساعات کاری در این صفحه درج نشده است؛ زمان دقیق مراجعه را هنگام تماس هماهنگ کنید.</p></div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

export function NotFoundPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="not-found-page shell">
        <p className="eyebrow">خطای ۴۰۴</p>
        <h1>این صفحه پیدا نشد.</h1>
        <p>ممکن است نشانی تغییر کرده باشد یا فرش موردنظر دیگر در این مسیر ثبت نشده باشد.</p>
        <div><a className="button button--primary" href="/">بازگشت به صفحه‌ی نخست</a><a className="text-link" href="/#collection">دیدن مجموعه‌ی موجود</a></div>
      </main>
      <SiteFooter />
    </>
  );
}

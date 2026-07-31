import {
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { catalogProducts } from "./catalog";

type CatalogPath = "size" | "origin" | "pattern";

type CatalogSample = {
  name: string;
  note: string;
  use: string;
  image: string;
  alt: string;
};

const navigation = [
  { href: "#collection", label: "مجموعه فرش‌ها" },
  { href: "#craft", label: "جنس و رنگ" },
  { href: "#catalog", label: "راهنمای انتخاب" },
  { href: "#story", label: "داستان حسین‌طلب" },
];

const catalogPaths: Record<
  CatalogPath,
  {
    label: string;
    kicker: string;
    title: string;
    description: string;
    items: CatalogSample[];
  }
> = {
  size: {
    label: "قواره",
    kicker: "از اندازه‌ی فضا شروع کنید",
    title: "قواره‌ای که درست در خانه بنشیند",
    description:
      "اندازه‌های رایج بازار را با کاربرد واقعی‌شان ببینید؛ از قالیچه‌ی کنار تخت تا فرش اصلی پذیرایی.",
    items: [
      {
        name: "ذرع‌ونیم",
        note: "حدود ۱٫۵ مترمربع",
        use: "کنار مبل، ورودی یا گوشه‌های کوچک",
        image: "/media/categories/sizes/zaro-nim.jpg",
        alt: "فرش ذرع‌ونیم در کنار صندلی",
      },
      {
        name: "قالیچه‌ی سه‌متری",
        note: "معمولاً ۱۵۰ × ۲۰۰",
        use: "اتاق خواب یا نشیمن کوچک",
        image: "/media/categories/sizes/ghalicheh-3m.jpg",
        alt: "قالیچه‌ی سه‌متری در اتاق خواب",
      },
      {
        name: "پرده‌ای",
        note: "حدود چهار مترمربع",
        use: "فضاهای باریک و کشیده",
        image: "/media/categories/sizes/pardei-4m.jpg",
        alt: "فرش پرده‌ای در فضای کشیده",
      },
      {
        name: "شش‌متری",
        note: "معمولاً ۲۰۰ × ۳۰۰",
        use: "بیشتر نشیمن‌های آپارتمانی",
        image: "/media/categories/sizes/6m.jpg",
        alt: "فرش شش‌متری در نشیمن",
      },
      {
        name: "نه‌متری",
        note: "معمولاً ۲۵۰ × ۳۵۰",
        use: "پذیرایی‌های متوسط",
        image: "/media/categories/sizes/9m.jpg",
        alt: "فرش نه‌متری در پذیرایی",
      },
      {
        name: "دوازده‌متری",
        note: "معمولاً ۳۰۰ × ۴۰۰",
        use: "پذیرایی بزرگ و فرش اصلی خانه",
        image: "/media/categories/sizes/12m.jpg",
        alt: "فرش دوازده‌متری در پذیرایی بزرگ",
      },
      {
        name: "کناره",
        note: "باریک و کشیده",
        use: "راهرو، ورودی یا کنار تخت",
        image: "/media/categories/sizes/runner.jpg",
        alt: "فرش کناره در راهروی خانه",
      },
    ],
  },
  origin: {
    label: "محل بافت",
    kicker: "هر شهر، امضای خودش را دارد",
    title: "فرش را از روی ریشه‌اش بشناسید",
    description:
      "رنگ، نقش و شیوه‌ی بافت در هر منطقه متفاوت است. اینجا تفاوت‌ها را ساده و تصویری می‌بینید.",
    items: [
      {
        name: "تبریز",
        note: "ریزبافت و متنوع",
        use: "از ماهی تا نقشه‌های شهری ظریف",
        image: "/media/categories/origins/tabriz-mahi-v2.jpg",
        alt: "فرش تبریز با نقشه‌ی ماهی درهم",
      },
      {
        name: "هریس",
        note: "هندسی و پرقدرت",
        use: "رنگ‌های گرم برای خانه‌های روشن",
        image: "/media/products/heriz-madder.jpg",
        alt: "فرش هریس با نقش هندسی",
      },
      {
        name: "بیجار",
        note: "متراکم و ماندگار",
        use: "بافتی محکم برای استفاده‌ی طولانی",
        image: "/media/categories/origins/bijar-gol-farang.jpg",
        alt: "فرش بیجار با نقش گل‌فرنگ",
      },
      {
        name: "نائین",
        note: "آرام و ظریف",
        use: "رنگ‌های روشن و جزئیات منظم",
        image: "/media/products/nain-ivory.jpg",
        alt: "فرش نائین با زمینه‌ی روشن",
      },
      {
        name: "کاشان",
        note: "شهری و کلاسیک",
        use: "نقشه‌های اصیل با ترکیب‌بندی رسمی",
        image: "/media/categories/origins/kashan-afshan.jpg",
        alt: "فرش کاشان با نقشه‌ی افشان",
      },
      {
        name: "اصفهان",
        note: "ظریف و دقیق",
        use: "نقش‌های پرجزئیات و بافت منظم",
        image: "/media/categories/origins/isfahan-tree-vase.jpg",
        alt: "فرش اصفهان با نقش درختی و گلدانی",
      },
      {
        name: "قشقایی",
        note: "ذهنی‌باف و زنده",
        use: "رنگ‌های صریح و نقش‌های هندسی",
        image: "/media/categories/origins/qashqai-boteh.jpg",
        alt: "فرش قشقایی با نقش بته‌جقه",
      },
      {
        name: "بختیاری",
        note: "خشتی و رنگارنگ",
        use: "قاب‌هایی پر از گل و نقش طبیعت",
        image: "/media/categories/origins/bakhtiari-kheshti.jpg",
        alt: "فرش بختیاری با نقشه‌ی خشتی",
      },
    ],
  },
  pattern: {
    label: "نقشه",
    kicker: "اسم درست نقش‌ها را یاد بگیرید",
    title: "نقشه‌ای هماهنگ با چیدمان شما",
    description:
      "به‌جای عنوان‌های مبهم، ساختار واقعی نقش را بشناسید و انتخاب دقیق‌تری داشته باشید.",
    items: [
      {
        name: "لچک‌وترنج",
        note: "مرکزگرا و متقارن",
        use: "مناسب فرش اصلی پذیرایی",
        image: "/media/products/tabriz-navy.jpg",
        alt: "فرش با نقشه‌ی لچک‌وترنج",
      },
      {
        name: "افشان",
        note: "روان و بدون ترنج مرکزی",
        use: "فضا را بازتر و یکدست‌تر نشان می‌دهد",
        image: "/media/categories/origins/kashan-afshan.jpg",
        alt: "فرش با نقشه‌ی افشان",
      },
      {
        name: "ماهی درهم",
        note: "ریز و تکرارشونده",
        use: "پرنقش اما منظم و آرام از فاصله",
        image: "/media/categories/origins/tabriz-mahi-v2.jpg",
        alt: "فرش با نقشه‌ی ماهی درهم",
      },
      {
        name: "خشتی",
        note: "قاب‌بندی‌شده",
        use: "هر قاب با گل و نقش جداگانه",
        image: "/media/categories/origins/bakhtiari-kheshti.jpg",
        alt: "فرش با نقشه‌ی خشتی",
      },
      {
        name: "بته‌جقه",
        note: "ایرانی و آشنا",
        use: "بته‌های تکرارشونده با حرکت نرم",
        image: "/media/categories/origins/qashqai-boteh.jpg",
        alt: "فرش با نقش بته‌جقه",
      },
      {
        name: "درختی و گلدانی",
        note: "برگرفته از طبیعت",
        use: "نقش‌هایی از درخت، گل و گلدان",
        image: "/media/categories/origins/isfahan-tree-vase.jpg",
        alt: "فرش با نقش درختی و گلدانی",
      },
      {
        name: "هندسی و عشایری",
        note: "آزاد و صریح",
        use: "مناسب چیدمان‌های ساده و امروزی",
        image: "/media/products/heriz-madder.jpg",
        alt: "فرش با نقش هندسی",
      },
      {
        name: "گل‌فرنگ",
        note: "گل‌های درشت و رنگی",
        use: "برای دوست‌داران طرح‌های گل‌دار",
        image: "/media/categories/origins/bijar-gol-farang.jpg",
        alt: "فرش با نقش گل‌فرنگ",
      },
    ],
  },
};

const rooms = [
  {
    title: "پذیرایی",
    note: "فرشی با حضور قوی برای مرکز چیدمان",
    tip: "برای اینکه مبلمان از هم جدا دیده نشود، بهتر است دست‌کم پایه‌های جلویی مبل روی فرش قرار بگیرد.",
    image: "/media/rooms/reception-room.jpg",
    alt: "فرش دستباف سرمه‌ای در پذیرایی روشن",
  },
  {
    title: "نشیمن",
    note: "گرم، راحت و مناسب زندگی روزمره",
    tip: "در فضای پررفت‌وآمد، بافت محکم و رنگ‌های میانه نگهداری روزمره را آسان‌تر می‌کند.",
    image: "/media/rooms/living-room.jpg",
    alt: "فرش هریس در نشیمن خانوادگی",
  },
  {
    title: "اتاق خواب",
    note: "رنگ‌های آرام برای شروع و پایان روز",
    tip: "قالیچه‌ای انتخاب کنید که هنگام پایین آمدن از تخت، هر دو پا روی بافت نرم آن قرار بگیرد.",
    image: "/media/rooms/bedroom-v2.jpg",
    alt: "فرش روشن در اتاق خواب آرام",
  },
  {
    title: "فضاهای کوچک",
    note: "قالیچه و کناره برای استفاده‌ی هوشمندانه",
    tip: "فرش بیش‌ازحد کوچک فضا را تکه‌تکه نشان می‌دهد؛ چند سانتی‌متر بزرگ‌تر معمولاً انتخاب بهتری است.",
    image: "/media/rooms/small-space.jpg",
    alt: "قالیچه‌ی دستباف در فضای کوچک",
  },
];

const collection = catalogProducts;

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 12H5m6-6-6 6 6 6" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className={`menu-icon ${open ? "is-open" : ""}`} aria-hidden="true">
      <i />
      <i />
    </span>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function getFocusable(container: HTMLElement | null) {
  if (!container) return [] as HTMLElement[];
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
}

function formatIndex(index: number) {
  return index.toLocaleString("fa-IR", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catalogPath, setCatalogPath] = useState<CatalogPath>("size");
  const [selectedSample, setSelectedSample] = useState<CatalogSample | null>(null);
  const [activeRoom, setActiveRoom] = useState(0);
  const [collectionFilter, setCollectionFilter] = useState<"all" | "home" | "antique">("all");
  const [collectionQuery, setCollectionQuery] = useState("");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const sampleTriggerRef = useRef<HTMLButtonElement | null>(null);
  const activeCatalog = catalogPaths[catalogPath];
  const visibleCollection = useMemo(() => {
    const query = collectionQuery.trim().toLocaleLowerCase("fa");
    return collection.filter((product) => {
      const matchesKind = collectionFilter === "all" || product.collection === collectionFilter;
      const haystack = `${product.name} ${product.originName} ${product.pattern} ${product.fieldColor}`.toLocaleLowerCase("fa");
      return matchesKind && (!query || haystack.includes(query));
    });
  }, [collectionFilter, collectionQuery]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = getFocusable(menuPanelRef.current);
    focusable[0]?.focus();

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
      if (event.key === "Tab" && focusable.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!selectedSample) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = getFocusable(dialogRef.current);
    focusable[0]?.focus();

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedSample(null);
        sampleTriggerRef.current?.focus();
      }
      if (event.key === "Tab" && focusable.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [selectedSample]);

  const closeMenu = () => setMenuOpen(false);

  const openSample = (
    sample: CatalogSample,
    trigger: HTMLButtonElement,
  ) => {
    sampleTriggerRef.current = trigger;
    setSelectedSample(sample);
  };

  const handleTabKey = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    path: CatalogPath,
  ) => {
    const order: CatalogPath[] = ["size", "origin", "pattern"];
    const index = order.indexOf(path);
    let nextIndex = index;
    if (event.key === "ArrowLeft") nextIndex = (index + 1) % order.length;
    if (event.key === "ArrowRight")
      nextIndex = (index - 1 + order.length) % order.length;
    if (nextIndex !== index) {
      event.preventDefault();
      const next = order[nextIndex];
      setCatalogPath(next);
      document.getElementById(`catalog-tab-${next}`)?.focus();
    }
  };

  return (
    <>
      <a className="skip-link" href="#main-content">
        رفتن به محتوای اصلی
      </a>

      <div className="service-bar">
        <div className="shell service-bar__inner">
          <p>تمام فرش‌ها با رنگ طبیعی و پشم دست‌ریس</p>
          <span aria-hidden="true" />
          <p>مشاوره‌ی مستقیم با کارشناس فرش</p>
          <a href="#story">فعال در بازار تهران از ۱۲۹۰</a>
        </div>
      </div>

      <header className="site-header">
        <div className="shell site-header__inner">
          <a className="brand-link" href="#top" aria-label="حسین‌طلب؛ صفحه‌ی نخست">
            <img
              className="brand-link__desktop"
              src="/brand/exports/hosseintalab-lockup-horizontal.svg"
              alt="Hosseintalab — Persian Handwoven Carpets — Est. 1290 SH"
              width="1600"
              height="300"
            />
            <img
              className="brand-link__mobile"
              src="/brand/raster/hosseintalab-medallion-transparent.png"
              alt=""
              width="760"
              height="887"
            />
          </a>

          <nav className="desktop-nav" aria-label="راهنمای اصلی">
            {navigation.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <a className="text-action" href="#consultation">
              <span>مشاوره و انتخاب</span>
              <ArrowIcon />
            </a>
            <button
              ref={menuButtonRef}
              className="menu-button"
              type="button"
              aria-label={menuOpen ? "بستن فهرست" : "باز کردن فهرست"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((value) => !value)}
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`mobile-menu ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <button
          className="mobile-menu__scrim"
          type="button"
          tabIndex={menuOpen ? 0 : -1}
          aria-label="بستن فهرست"
          onClick={closeMenu}
        />
        <div
          ref={menuPanelRef}
          className="mobile-menu__panel"
          role="dialog"
          aria-modal="true"
          aria-label="فهرست سایت"
        >
          <div className="mobile-menu__head">
            <img
              src="/brand/exports/hosseintalab-lockup-stacked.svg"
              alt="Hosseintalab"
              width="900"
              height="1000"
            />
            <button
              type="button"
              aria-label="بستن فهرست"
              onClick={() => {
                closeMenu();
                menuButtonRef.current?.focus();
              }}
            >
              <CloseIcon />
            </button>
          </div>
          <nav aria-label="راهنمای موبایل">
            {navigation.map((item, index) => (
              <a key={item.href} href={item.href} onClick={closeMenu}>
                <small>{formatIndex(index + 1)}</small>
                <span>{item.label}</span>
                <ChevronIcon />
              </a>
            ))}
          </nav>
          <a className="button button--gold" href="#consultation" onClick={closeMenu}>
            درخواست مشاوره
            <ArrowIcon />
          </a>
          <p>بازار فرش تهران · ارسال به سراسر ایران</p>
        </div>
      </div>

      <main id="main-content">
        <section id="top" className="hero">
          <img
            className="hero__image"
            src="/media/hero-home-v2.jpg"
            alt="فرش دستباف ایرانی در نشیمن روشن و صمیمی"
            width="1672"
            height="941"
            fetchPriority="high"
          />
          <div className="hero__veil" />
          <div className="shell hero__content">
            <p className="eyebrow eyebrow--light">
              رنگ طبیعی · پشم دست‌ریس · تک‌تخته
            </p>
            <h1>
              رنگی که از طبیعت آمده؛
              <em>هنری که برای زندگی مانده.</em>
            </h1>
            <p className="hero__lead">
              مجموعه‌ای از فرش‌های دستباف ایرانی با رنگرزی گیاهی و پشم دست‌ریس؛
              هر تخته با شناسنامه، تصاویر دقیق و کارشناسی خانواده‌ای با بیش از یک قرن تجربه.
            </p>
            <div className="hero__actions">
              <a className="button button--ivory" href="#collection">
                دیدن همه‌ی فرش‌ها
                <ArrowIcon />
              </a>
              <a className="button button--ghost" href="#consultation">
                برای انتخاب کمک می‌خواهم
              </a>
            </div>
          </div>
          <div className="hero__aside">
            <span>مجموعه‌ی حاضر</span>
            <a href="#collection">
              <strong>{collection.length.toLocaleString("fa-IR")} تخته</strong>
              <small>هرکدام یگانه و موجود</small>
            </a>
            <a href="#antiques">
              <strong>از ۱۲۹۰</strong>
              <small>ریشه در بازار تهران</small>
            </a>
          </div>
          <a className="hero__scroll" href="#home-carpets" aria-label="ادامه‌ی صفحه">
            <span />
            پایین بروید
          </a>
        </section>

        <section className="trust-ribbon" aria-label="خدمات حسین‌طلب">
          <div className="shell trust-ribbon__grid">
            <article>
              <span>۱۰۰٪</span>
              <div>
                <strong>رنگرزی طبیعی</strong>
                <p>رنگ‌های گیاهی، زنده و ماندگار</p>
              </div>
            </article>
            <article>
              <span>✦</span>
              <div>
                <strong>پشم دست‌ریس</strong>
                <p>بافت اصیل با لمس و شخصیت طبیعی</p>
              </div>
            </article>
            <article>
              <span>۱</span>
              <div>
                <strong>هر فرش، تنها یک تخته</strong>
                <p>شناسنامه و تصاویر واقعی همان اثر</p>
              </div>
            </article>
            <article>
              <span>۱۲۹۰</span>
              <div>
                <strong>ریشه در بازار تهران</strong>
                <p>شناخت فرش، نسل به نسل</p>
              </div>
            </article>
          </div>
        </section>

        <section id="craft" className="craft-statement">
          <div className="shell craft-statement__grid">
            <p className="craft-statement__number">۰۱</p>
            <div>
              <p className="eyebrow">امضای مشترک تمام مجموعه</p>
              <h2>نه رنگ شیمیایی.<br />نه نخ کارخانه‌ای.</h2>
            </div>
            <div className="craft-statement__copy">
              <p>تمام فرش‌های حسین‌طلب با <strong>رنگ‌های طبیعی و گیاهی</strong> و <strong>پشم دست‌ریس</strong> بافته شده‌اند؛ تفاوتی که در عمق رنگ، لطافت بافت و زیباییِ گذر زمان دیده می‌شود.</p>
              <div className="craft-statement__facts">
                <span><b>رنگ طبیعی</b><small>Natural dyes</small></span>
                <span><b>پشم دست‌ریس</b><small>Hand-spun wool</small></span>
              </div>
            </div>
          </div>
        </section>

        <section id="home-carpets" className="section intro-section">
          <div className="shell intro-section__grid">
            <div className="section-heading">
              <p className="eyebrow">فرش برای خانه</p>
              <h2>از اتاق شروع کنید، نه از اصطلاحات بازار.</h2>
              <p>
                لازم نیست از قبل فرق نقشه‌ها و بافت‌ها را بدانید. بگویید فرش را
                برای کدام فضا می‌خواهید؛ ما قدم‌به‌قدم گزینه‌ها را روشن می‌کنیم.
              </p>
              <a className="inline-link" href="#catalog">
                راهنمای ساده‌ی انتخاب
                <ArrowIcon />
              </a>
            </div>

            <div className="room-finder">
              <div className="room-finder__media">
                {rooms.map((room, index) => (
                  <img
                    key={room.title}
                    className={index === activeRoom ? "is-active" : ""}
                    src={room.image}
                    alt={index === activeRoom ? room.alt : ""}
                    width="1122"
                    height="1402"
                    loading="lazy"
                    decoding="async"
                  />
                ))}
                <p>
                  <span>نکته‌ی انتخاب</span>
                  {rooms[activeRoom].tip}
                </p>
              </div>
              <div className="room-finder__choices" aria-label="انتخاب فضای خانه">
                {rooms.map((room, index) => (
                  <button
                    key={room.title}
                    type="button"
                    className={index === activeRoom ? "is-active" : ""}
                    aria-pressed={index === activeRoom}
                    onClick={() => setActiveRoom(index)}
                  >
                    <span>{formatIndex(index + 1)}</span>
                    <div>
                      <strong>{room.title}</strong>
                      <small>{room.note}</small>
                    </div>
                    <ChevronIcon />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="catalog" className="section catalog-section">
          <div className="shell">
            <div className="catalog-section__head">
              <div className="section-heading">
                <p className="eyebrow">راهنمای انتخاب فرش</p>
                <h2>با سه زبان اصلی بازار آشنا شوید.</h2>
              </div>
              <p>
                فرش‌ها را با نام واقعی‌شان دسته‌بندی کرده‌ایم تا هنگام دیدن،
                پرسیدن و مقایسه‌کردن دقیق‌تر باشید.
              </p>
            </div>

            <div className="catalog-tabs" role="tablist" aria-label="روش دسته‌بندی فرش">
              {(Object.keys(catalogPaths) as CatalogPath[]).map((path) => (
                <button
                  id={`catalog-tab-${path}`}
                  key={path}
                  type="button"
                  role="tab"
                  aria-selected={catalogPath === path}
                  aria-controls="catalog-panel"
                  tabIndex={catalogPath === path ? 0 : -1}
                  onClick={() => setCatalogPath(path)}
                  onKeyDown={(event) => handleTabKey(event, path)}
                >
                  بر اساس {catalogPaths[path].label}
                </button>
              ))}
            </div>

            <div
              id="catalog-panel"
              className="catalog-panel"
              role="tabpanel"
              aria-labelledby={`catalog-tab-${catalogPath}`}
            >
              <div className="catalog-panel__intro">
                <p className="eyebrow">{activeCatalog.kicker}</p>
                <h3>{activeCatalog.title}</h3>
                <p>{activeCatalog.description}</p>
                <small>برای دیدن نمونه، روی هر تصویر بزنید.</small>
              </div>
              <div className="catalog-panel__rail">
                {activeCatalog.items.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    className="sample-card"
                    onClick={(event) => openSample(item, event.currentTarget)}
                    aria-label={`دیدن نمونه‌ی ${item.name}`}
                  >
                    <span className="sample-card__image">
                      <img
                        src={item.image}
                        alt=""
                        width="1200"
                        height="800"
                        loading="lazy"
                        decoding="async"
                      />
                      <i>دیدن نمونه</i>
                    </span>
                    <strong>{item.name}</strong>
                    <small>{item.note}</small>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="collection" className="section collection-section">
          <div className="shell">
            <div className="collection-section__head">
              <div className="section-heading">
                <p className="eyebrow">مجموعه‌ی موجود</p>
                <h2>هر تخته، یک جهان مستقل.</h2>
              </div>
              <p>
                تمام فرش‌های موجود را ببینید؛ با تصاویر واقعی، مشخصات کامل و شناسنامه‌ی هر اثر.
              </p>
            </div>

            <div className="collection-tools">
              <div className="collection-filters" aria-label="فیلتر مجموعه">
                {([
                  ["all", "همه"],
                  ["home", "برای خانه"],
                  ["antique", "آنتیک و نیمه‌آنتیک"],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={collectionFilter === value ? "is-active" : ""}
                    aria-pressed={collectionFilter === value}
                    onClick={() => setCollectionFilter(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <label className="collection-search">
                <span>جست‌وجو در مجموعه</span>
                <input
                  value={collectionQuery}
                  onChange={(event) => setCollectionQuery(event.target.value)}
                  placeholder="نام، شهر، نقشه یا رنگ…"
                  type="search"
                />
              </label>
              <p className="collection-count" aria-live="polite">
                {visibleCollection.length.toLocaleString("fa-IR")} فرش
              </p>
            </div>

            <div className="product-grid">
              {visibleCollection.map((product, index) => (
                <article className="product-card" key={product.sku}>
                  <a
                    className="product-card__image"
                    href={`/carpets/${product.slug}`}
                    aria-label={`مشاهده‌ی ${product.name}`}
                  >
                    <img
                      src={product.image}
                      alt={product.alt}
                      width="1122"
                      height="1402"
                      loading="lazy"
                      decoding="async"
                    />
                    <span>{product.sku}</span>
                  </a>
                  <div className="product-card__body">
                    <p>{product.origin} · رنگ طبیعی</p>
                    <h3>{product.name}</h3>
                    <span>{product.description}</span>
                    <footer>
                      <small>{product.size}</small>
                      <a href={`/carpets/${product.slug}`}>
                        مشاهده‌ی فرش
                        <ArrowIcon />
                      </a>
                    </footer>
                  </div>
                  <span className="product-card__number" aria-hidden="true">
                    {formatIndex(index + 1)}
                  </span>
                </article>
              ))}
            </div>
            {visibleCollection.length === 0 && (
              <div className="collection-empty">
                <p>فرشی با این مشخصات پیدا نشد.</p>
                <button type="button" onClick={() => { setCollectionFilter("all"); setCollectionQuery(""); }}>
                  نمایش همه‌ی فرش‌ها
                </button>
              </div>
            )}
          </div>
        </section>

        <section id="antiques" className="antiques-section">
          <div className="antiques-section__image">
            <img
              src="/media/story/bazaar-inspection.jpg"
              alt="کارشناسی فرش دستباف قدیمی در بازار تهران"
              width="1122"
              height="1402"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="antiques-section__content">
            <p className="eyebrow eyebrow--light">مجموعه‌ی خصوصی</p>
            <h2>فرش آنتیک</h2>
            <p>
              فرش‌های قدیمی و کمیاب، بخشی از ریشه‌ی حرفه‌ای خانواده‌ی حسین‌طلب
              هستند. این مجموعه برای خریداران و مجموعه‌دارانی است که به اصالت،
              قدمت و شناسنامه‌ی هر اثر اهمیت می‌دهند.
            </p>
            <ul>
              <li>بررسی اصالت و سلامت بافت</li>
              <li>ارائه‌ی اطلاعات قدمت و محل بافت</li>
              <li>معرفی گزیده و فقط با هماهنگی</li>
            </ul>
            <a className="button button--ivory" href="#consultation">
              گفت‌وگو درباره‌ی فرش آنتیک
              <ArrowIcon />
            </a>
          </div>
          <span className="antiques-section__seal" aria-hidden="true">
            <img
              src="/brand/exports/hosseintalab-watermark.png"
              alt=""
              width="1200"
              height="1200"
              loading="lazy"
            />
          </span>
        </section>

        <section id="story" className="section story-section">
          <div className="shell story-section__grid">
            <div className="story-section__seal">
              <img
                src="/brand/exports/hosseintalab-seal.svg"
                alt="نشان رسمی حسین‌طلب؛ تأسیس ۱۲۹۰ هجری شمسی"
                width="1600"
                height="1600"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="section-heading">
              <p className="eyebrow">داستان حسین‌طلب</p>
              <h2>اعتماد، پیش از آنکه آنلاین شود، در بازار ساخته شد.</h2>
              <p>
                فعالیت خانواده‌ی حسین‌طلب از سال ۱۲۹۰ هجری شمسی در بازار فرش
                تهران آغاز شده است. تجربه‌ی شناخت بافت، تشخیص کیفیت و دادوستد
                بین‌المللی، امروز با زبانی روشن‌تر در اختیار خریدار خانه قرار
                می‌گیرد.
              </p>
              <p>
                هدف این فروشگاه فقط نمایش فرش نیست؛ می‌خواهیم فاصله‌ی میان تخصص
                بازار و نیاز واقعی یک خانه را کمتر کنیم.
              </p>
              <a className="inline-link" href="#consultation">
                از ما راهنمایی بگیرید
                <ArrowIcon />
              </a>
            </div>
            <div className="story-section__quote">
              <span>«</span>
              <blockquote>
                فرش خوب باید با خانه، شیوه‌ی زندگی و سال‌هایی که قرار است کنار
                شما بماند، جور باشد.
              </blockquote>
              <p>خانواده‌ی حسین‌طلب · بازار فرش تهران</p>
            </div>
          </div>
        </section>

        <section id="consultation" className="consultation-section">
          <img
            src="/media/consultation-room-measure-v2.jpg"
            alt="اندازه‌گیری فضای نشیمن برای انتخاب فرش"
            width="1536"
            height="1024"
            loading="lazy"
            decoding="async"
          />
          <div className="consultation-section__veil" />
          <div className="shell consultation-section__content">
            <p className="eyebrow eyebrow--light">هنوز مطمئن نیستید؟</p>
            <h2>یک عکس از فضا بفرستید؛ از همان‌جا شروع می‌کنیم.</h2>
            <p>
              اندازه‌ی تقریبی فضا، رنگ مبلمان و بودجه‌تان را بگویید تا چند مسیر
              مناسب پیشنهاد کنیم. مشاوره می‌تواند آنلاین باشد یا با دیدار در
              فروشگاه ادامه پیدا کند.
            </p>
            <div>
              <a className="button button--gold" href="tel:+982155675890">
                تماس با فروشگاه
                <ArrowIcon />
              </a>
              <a className="button button--ghost" href="#footer-contact">
                راه‌های ارتباطی
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer id="footer-contact" className="site-footer">
        <div className="shell site-footer__top">
          <a className="site-footer__brand" href="#top" aria-label="بازگشت به بالای صفحه">
            <img
              src="/brand/exports/hosseintalab-lockup-horizontal-reversed.svg"
              alt="Hosseintalab — Persian Handwoven Carpets"
              width="1600"
              height="300"
              loading="lazy"
            />
          </a>
          <p>
            فرش دستباف برای خانه و فرش آنتیک؛ با کارشناسی خانواده‌ی حسین‌طلب در
            بازار فرش تهران.
          </p>
          <a className="back-to-top" href="#top">
            بازگشت به بالا
            <span aria-hidden="true">↑</span>
          </a>
        </div>
        <div className="shell site-footer__grid">
          <div>
            <h2>مجموعه</h2>
            <a href="#home-carpets">فرش برای خانه</a>
            <a href="#antiques">فرش آنتیک</a>
            <a href="#collection">انتخاب این هفته</a>
          </div>
          <div>
            <h2>راهنمای انتخاب</h2>
            <a href="#catalog">بر اساس قواره</a>
            <a href="#catalog">بر اساس محل بافت</a>
            <a href="#catalog">بر اساس نقشه</a>
          </div>
          <div>
            <h2>ارتباط</h2>
            <a href="tel:+982155675890" dir="ltr">
              +98 21 5567 5890
            </a>
            <a href="mailto:info@hosseintalab.com" dir="ltr">
              info@hosseintalab.com
            </a>
            <p>تهران، بازار بزرگ، بازار فرش</p>
          </div>
          <div>
            <h2>ساعات حضور</h2>
            <p>شنبه تا چهارشنبه · ۹ تا ۱۷</p>
            <p>پنجشنبه · با هماهنگی</p>
          </div>
        </div>
        <div className="shell site-footer__bottom">
          <p>© ۱۴۰۵ حسین‌طلب. همه‌ی حقوق محفوظ است.</p>
          <p>فرش دستباف ایرانی · بازار تهران</p>
        </div>
      </footer>

      {selectedSample && (
        <div
          className="sample-dialog"
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) {
              setSelectedSample(null);
              sampleTriggerRef.current?.focus();
            }
          }}
        >
          <div
            ref={dialogRef}
            className="sample-dialog__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sample-title"
            aria-describedby="sample-description"
          >
            <button
              className="sample-dialog__close"
              type="button"
              aria-label="بستن نمونه"
              onClick={() => {
                setSelectedSample(null);
                sampleTriggerRef.current?.focus();
              }}
            >
              <CloseIcon />
            </button>
            <img
              src={selectedSample.image}
              alt={selectedSample.alt}
              width="1200"
              height="800"
            />
            <div>
              <p className="eyebrow">نمونه‌ی تصویری</p>
              <h2 id="sample-title">{selectedSample.name}</h2>
              <p id="sample-description">{selectedSample.use}</p>
              <span>{selectedSample.note}</span>
              <a className="inline-link" href="#consultation" onClick={() => setSelectedSample(null)}>
                درباره‌ی این دسته راهنمایی می‌خواهم
                <ArrowIcon />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

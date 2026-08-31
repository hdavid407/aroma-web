import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  businessProfile,
  getRouteBreadcrumbs,
  isEventUpcoming,
  type EventRecord,
  type GalleryItem,
  type HoursEntry,
  type PageAction,
  type ProofAsset,
  type RouteDefinition,
  resolveRoute,
} from "./siteContent";

const BasePathContext = createContext("/");

const useBasePath = () => useContext(BasePathContext);

const assetUrl = (basePath: string, filename: string) =>
  `${basePath}assets/${filename}`;

const routeHref = (basePath: string, path: string) => {
  const trimmedPath = path.startsWith("/") ? path.slice(1) : path;

  return `${basePath}${trimmedPath}`;
};

const getExperienceCards = (basePath: string) => [
  {
    id: "food",
    title: "Food",
    copy: "Bold flavors, rooted in culture.",
    image: "food-01.jpg",
    alt: "A spread of flavorful dishes and wings",
    href: routeHref(basePath, "/menu/"),
    analytics: "menu-experience-food",
  },
  {
    id: "cocktails",
    title: "Cocktails",
    copy: "Crafted with intention.",
    image: "drinks-01.jpg",
    alt: "A chili-rimmed cocktail with lime",
    href: routeHref(basePath, "/menu/"),
    analytics: "menu-experience-cocktails",
  },
  {
    id: "brunch",
    title: "Brunch",
    copy: "Weekends done right.",
    image: "brunch-01.jpg",
    alt: "French toast topped with strawberries and blueberries",
    href: `${routeHref(basePath, "/menu/")}#brunch-menu`,
    analytics: "menu-experience-brunch",
  },
  {
    id: "after-dark",
    title: "After dark",
    copy: "Music. Drinks. Vibes.",
    image: "lounge-01.jpg",
    alt: "Guests enjoying cocktails in the lounge",
    href: routeHref(basePath, "/events/"),
    analytics: "menu-experience-events",
  },
] as const;

const GLITTER_SPARKS = Array.from({ length: 10 }, (_, index) => index + 1);

type ArrowProps = {
  className?: string;
};

type AppProps = {
  routePath: string;
  basePath?: string;
};

type HeaderProps = {
  isHome: boolean;
};

type RouteActionProps = {
  action: PageAction;
  variant?: "primary" | "outline" | "text";
};

type PageHeroProps = {
  route: RouteDefinition;
};

type BreadcrumbsProps = {
  route: RouteDefinition;
};

type PageActionsProps = {
  route: RouteDefinition;
};

type CopySectionProps = {
  title: string;
  body: string[];
  id?: string;
};

type MenuRouteProps = {
  route: RouteDefinition;
};

type EventListProps = {
  events: EventRecord[];
};

type HoursListProps = {
  entries: HoursEntry[];
};

type GalleryGridProps = {
  items: GalleryItem[];
};

function Arrow({ className = "" }: ArrowProps) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      viewBox="0 0 42 18"
      fill="none"
    >
      <path d="M1 9h38M32 2l7 7-7 7" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M14 4v10.2a4.2 4.2 0 1 1-3.2-4.1M14 4c.7 2.8 2.3 4.4 5 4.8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Header({ isHome }: HeaderProps) {
  const basePath = useBasePath();
  const [menuOpen, setMenuOpen] = useState(false);
  const homeAnchors = useMemo(
    () => ({
      brunch: `${routeHref(basePath, "/menu/")}#brunch-menu`,
      afterDark: routeHref(basePath, "/events/"),
    }),
    [basePath],
  );

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const brandHref = isHome ? "#top" : routeHref(basePath, "/");

  return (
    <header className="site-header">
      <a className="brand" href={brandHref} aria-label="Aroma Gastro Bar home">
        <img src={assetUrl(basePath, "aroma-logo.png")} alt="Aroma Gastro Bar" />
      </a>

      <button
        className="menu-toggle"
        type="button"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
      </button>

      <nav className={menuOpen ? "nav is-open" : "nav"} aria-label="Main navigation">
        <a href={routeHref(basePath, "/menu/")} data-analytics="menu-nav" onClick={closeMenu}>
          Menu
        </a>
        <a href={homeAnchors.brunch} data-analytics="menu-brunch-nav" onClick={closeMenu}>
          Brunch
        </a>
        <a
          href={homeAnchors.afterDark}
          data-analytics="menu-after-dark-nav"
          onClick={closeMenu}
        >
          After dark
        </a>
        <a href={routeHref(basePath, "/visit/")} data-analytics="visit-nav" onClick={closeMenu}>
          Visit
        </a>
        <a href={routeHref(basePath, "/contact/")} onClick={closeMenu}>
          Contact
        </a>
        <a
          className="nav-reserve"
          href={businessProfile.reservationUrl}
          target="_blank"
          rel="noreferrer"
          data-analytics="reserve-nav"
          onClick={closeMenu}
        >
          Reserve
        </a>
      </nav>
    </header>
  );
}

function Experiences() {
  const basePath = useBasePath();

  return (
    <section className="experiences section-pad" id="experiences">
      <div className="section-intro">
        <h2>
          One place.
          <br />
          Four moods.
        </h2>
        <p>
          From chef-driven Dominican fusion to cocktails, weekend brunch and late
          nights, Aroma moves with the moment.
        </p>
      </div>

      <div className="experience-rail">
        {getExperienceCards(basePath).map((item, index) => (
          <a
            className={`experience experience-${index + 1}`}
            id={item.id}
            href={item.href}
            key={item.title}
            data-analytics={item.analytics}
          >
            <div className="experience-image">
              <img src={assetUrl(basePath, item.image)} alt={item.alt} />
            </div>
            <div className="experience-copy">
              <div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
              <Arrow />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function Reservation() {
  const basePath = useBasePath();

  return (
    <section className="reservation" id="reserve">
      <div
        className="reservation-photo"
        style={{
          backgroundImage: `url("${assetUrl(basePath, "lounge-01.jpg")}")`,
        }}
        aria-hidden="true"
      />
      <div className="reservation-content section-pad">
        <h2>
          The night
          <br />
          starts here.
        </h2>
        <p>Dinner, cocktails, music and the unmistakable energy of Aroma.</p>
        <div className="reservation-actions">
          <a
            className="button button-primary"
            href={businessProfile.reservationUrl}
            target="_blank"
            rel="noreferrer"
            data-analytics="reserve-primary"
          >
            Reserve your table
          </a>
          <a
            className="text-link"
            href={businessProfile.directionsUrl}
            target="_blank"
            rel="noreferrer"
            data-analytics="directions-primary"
          >
            Get directions
          </a>
          <a
            className="text-link"
            href={businessProfile.orderUrl}
            target="_blank"
            rel="noreferrer"
            data-analytics="order-primary"
          >
            Order online
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const basePath = useBasePath();

  return (
    <footer className="footer section-pad" id="visit">
      <div className="visit-grid">
        <div className="visit-detail">
          <span className="detail-index">01</span>
          <div>
            <span className="detail-label">Located at</span>
            <address>
              {businessProfile.addressLines[0]}
              <br />
              {businessProfile.addressLines[1]}
            </address>
          </div>
        </div>
        <div className="visit-detail">
          <span className="detail-index">02</span>
          <div>
            <span className="detail-label">After dark</span>
            <p>{businessProfile.afterDarkNote}</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <a
          className="footer-brand"
          href={routeHref(basePath, "/")}
          aria-label="Aroma Gastro Bar home"
        >
          <img src={assetUrl(basePath, "aroma-logo.png")} alt="Aroma Gastro Bar" />
        </a>
        <nav className="footer-nav" aria-label="Footer navigation">
          <a href={routeHref(basePath, "/visit/")}>Visit</a>
          <a href={routeHref(basePath, "/reservations/")}>Reservations</a>
          <a href={routeHref(basePath, "/faq/")}>FAQ</a>
          <a href={routeHref(basePath, "/group-dining/")}>Group dining</a>
        </nav>
        <div className="social-links">
          {businessProfile.socialLinks.map((socialLink) => (
            <a href={socialLink.href} target="_blank" rel="noreferrer" key={socialLink.id}>
              {socialLink.id === "instagram" ? <InstagramIcon /> : <TikTokIcon />}
              {socialLink.label}
            </a>
          ))}
        </div>
      </div>
      <div className="copyright">
        <span>© 2026 Aroma Gastro Bar</span>
        <span>Orlando, Florida</span>
      </div>
    </footer>
  );
}

function RouteAction({ action, variant = "primary" }: RouteActionProps) {
  const basePath = useBasePath();
  const className =
    variant === "text"
      ? "text-link"
      : variant === "outline"
        ? "button button-outline"
        : "button button-primary";

  return (
    <a
      className={className}
      href={action.href.startsWith("/") ? routeHref(basePath, action.href) : action.href}
      target={action.external ? "_blank" : undefined}
      rel={action.external ? "noreferrer" : undefined}
      data-analytics={action.analytics}
    >
      {action.label}
    </a>
  );
}

function Breadcrumbs({ route }: BreadcrumbsProps) {
  const basePath = useBasePath();
  const breadcrumbs = getRouteBreadcrumbs(route);

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {breadcrumbs.map((breadcrumb, index) => {
          const isCurrent = index === breadcrumbs.length - 1;

          return (
            <li
              aria-current={isCurrent ? "page" : undefined}
              key={breadcrumb.path}
            >
              {isCurrent ? (
                breadcrumb.name
              ) : (
                <a href={routeHref(basePath, breadcrumb.path)}>{breadcrumb.name}</a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function PageHero({ route }: PageHeroProps) {
  const basePath = useBasePath();

  return (
    <section className="page-hero" id="top">
      <Header isHome={false} />
      <div
        className="page-hero-image"
        style={{
          backgroundImage: `url("${assetUrl(basePath, route.meta.heroImage)}")`,
        }}
        aria-hidden="true"
      />
      <div className="page-hero-shade" aria-hidden="true" />
      <div className="page-hero-content section-pad">
        <Breadcrumbs route={route} />
        <span className="page-eyebrow">{route.meta.eyebrow}</span>
        <h1>{route.meta.heading}</h1>
        <p>{route.meta.intro}</p>
      </div>
    </section>
  );
}

function PageActions({ route }: PageActionsProps) {
  const { primaryAction, secondaryAction, tertiaryAction } = route.content;

  if (!primaryAction && !secondaryAction && !tertiaryAction) {
    return null;
  }

  return (
    <div className="route-actions">
      {primaryAction ? <RouteAction action={primaryAction} /> : null}
      {secondaryAction ? <RouteAction action={secondaryAction} variant="outline" /> : null}
      {tertiaryAction ? <RouteAction action={tertiaryAction} variant="text" /> : null}
    </div>
  );
}

function CopySection({ title, body, id }: CopySectionProps) {
  return (
    <section className="route-card" id={id}>
      <h2>{title}</h2>
      {body.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </section>
  );
}

function ReviewsPlaceholder({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <section className="route-card route-placeholder">
      <div>
        <span className="page-eyebrow">Future boundary</span>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
    </section>
  );
}

function ProofGrid({ assets }: { assets: ProofAsset[] }) {
  const basePath = useBasePath();
  const approvedAssets = assets.filter((asset) => asset.approved);

  if (!approvedAssets.length) {
    return null;
  }

  return (
    <section className="route-card proof-grid" aria-label="Aroma Gastro Bar proof">
      <div className="route-card-header">
        <span className="page-eyebrow">Why Aroma</span>
        <h2>Good food, good nights, and a room worth returning to.</h2>
      </div>
      <div className="proof-items">
        {approvedAssets.map((asset) => (
          <article className="proof-item" key={`${asset.kind}-${asset.title}`}>
            {asset.image ? (
              <img
                className="proof-image"
                src={assetUrl(basePath, asset.image)}
                alt={asset.imageAlt ?? asset.title}
              />
            ) : null}
            <span className="page-eyebrow">{asset.kind.replaceAll("-", " ")}</span>
            <h3>{asset.title}</h3>
            <p>{asset.body}</p>
            {asset.href && asset.source ? (
              <a className="text-link" href={asset.href} target="_blank" rel="noreferrer">
                {asset.source}
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function MenuRoute({ route }: MenuRouteProps) {
  return (
    <>
      {route.content.menuSections?.map((section) => (
        <section className="route-card" id={section.id} key={section.id}>
          <div className="route-card-header">
            <span className="page-eyebrow">{section.title}</span>
            <h2>{section.summary}</h2>
          </div>
          <div className="menu-grid">
            {section.items.map((item) => (
              <article className="menu-item" key={item.name}>
                <div className="menu-item-header">
                  <h3>{item.name}</h3>
                  {item.price ? <span>{item.price}</span> : null}
                </div>
                {item.description ? <p>{item.description}</p> : null}
              </article>
            ))}
          </div>
        </section>
      ))}
      {route.content.sections?.map((section) => (
        <CopySection body={section.body} id="brunch-menu" key={section.title} title={section.title} />
      ))}
    </>
  );
}

function EventList({ events }: EventListProps) {
  const basePath = useBasePath();
  const upcomingEvents = useMemo(
    () => events.filter((event) => isEventUpcoming(event)),
    [events],
  );

  return (
    <section className="route-card">
      <div className="route-card-header">
        <span className="page-eyebrow">Upcoming</span>
        <h2>Current hand-maintained event listings</h2>
      </div>
      {upcomingEvents.length === 0 ? (
        <p>No currently scheduled events are published right now. Check back soon or call the team for updates.</p>
      ) : (
        <div className="event-list">
          {upcomingEvents.map((event) => (
            <article
              className="event-card"
              data-event-id={event.id}
              data-event-start={event.startIso}
              data-event-end={event.endIso}
              key={event.id}
            >
              <time className="event-date" dateTime={event.startIso}>{event.displayDate}</time>
              <h3>{event.title}</h3>
              <p className="event-time">{event.timeLabel}</p>
              <p>{event.summary}</p>
              {event.recurringNote ? <p className="event-note">{event.recurringNote}</p> : null}
              <a
                className="text-link"
                href={routeHref(basePath, `/events/${event.slug}/`)}
                data-analytics="event-detail"
              >
                View event details
              </a>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function EventDetails({ event }: { event: EventRecord }) {
  return (
    <section className="route-card event-detail-summary">
      <div className="route-card-header">
        <span className="page-eyebrow">Event details</span>
        <h2>{event.title} in Orlando</h2>
      </div>
      <div className="event-detail-meta">
        <time dateTime={event.startIso}>{event.displayDate}</time>
        <span>{event.timeLabel}</span>
      </div>
      <p>{event.summary}</p>
      {event.recurringNote ? <p className="event-note">{event.recurringNote}</p> : null}
      <p>
        <strong>{businessProfile.name}</strong>
        <br />
        {businessProfile.fullAddress}
      </p>
    </section>
  );
}

function FaqGrid({ items }: { items: RouteDefinition["content"]["faqs"] }) {
  if (!items?.length) {
    return null;
  }

  return (
    <section className="route-card">
      <div className="route-card-header">
        <span className="page-eyebrow">FAQ</span>
        <h2>Helpful planning details</h2>
      </div>
      <div className="faq-grid">
        {items.map((item) => (
          <article className="faq-item" key={item.question}>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function HoursList({ entries }: HoursListProps) {
  return (
    <div className="hours-list">
      {entries.map((entry) => (
        <div className="hours-row" key={entry.days}>
          <span>{entry.days}</span>
          <span>{entry.hours}</span>
        </div>
      ))}
    </div>
  );
}

function ContactDetails({ route }: { route: RouteDefinition }) {
  return (
    <section className="route-card route-card-split">
      <div>
        <span className="page-eyebrow">Visit Aroma</span>
        <h2>{businessProfile.fullAddress}</h2>
        <p>
          <a href={businessProfile.phoneHref}>{businessProfile.phoneDisplay}</a>
          <br />
          <a href={businessProfile.emailHref}>{businessProfile.email}</a>
        </p>
        {route.content.hoursNote ? <p className="event-note">{route.content.hoursNote}</p> : null}
      </div>
      <div>
        <span className="page-eyebrow">Current posted hours</span>
        <HoursList entries={businessProfile.hours} />
      </div>
    </section>
  );
}

function GalleryGrid({ items }: GalleryGridProps) {
  const basePath = useBasePath();

  return (
    <section className="route-card">
      <div className="gallery-grid">
        {items.map((item) => (
          <figure className="gallery-item" key={item.image}>
            <img src={assetUrl(basePath, item.image)} alt={item.alt} />
            <figcaption>{item.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function GenericRoutePage({ route }: { route: RouteDefinition }) {
  return (
    <main className="route-page">
      <PageHero route={route} />
      <section className="route-content section-pad">
        <div className="route-intro">
          <span className="page-eyebrow">{route.meta.eyebrow}</span>
          <p>{route.content.lead ?? route.meta.description}</p>
          <PageActions route={route} />
        </div>

        {route.event ? <EventDetails event={route.event} /> : null}
        {route.event && route.content.sections
          ? route.content.sections.map((section) => (
              <CopySection body={section.body} key={section.title} title={section.title} />
            ))
          : null}
        {route.id === "menu" ? <MenuRoute route={route} /> : null}
        {route.id === "events" && !route.event && route.content.sections
          ? route.content.sections.map((section) => (
              <CopySection body={section.body} key={section.title} title={section.title} />
            ))
          : null}
        {route.id === "events" && !route.event && route.content.events ? <EventList events={route.content.events} /> : null}
        {route.id === "contact" || route.id === "visit" ? <ContactDetails route={route} /> : null}
        {route.id === "gallery" && route.content.gallery ? <GalleryGrid items={route.content.gallery} /> : null}
        {route.id !== "menu" && route.id !== "events" && route.id !== "contact" && route.id !== "visit" && route.id !== "gallery"
          ? route.content.sections?.map((section) => (
              <CopySection body={section.body} key={section.title} title={section.title} />
            ))
          : null}
        {route.content.faqs ? <FaqGrid items={route.content.faqs} /> : null}
        {route.content.proofAssets ? <ProofGrid assets={route.content.proofAssets} /> : null}
        {route.id === "story" && route.content.reviewPlaceholder ? (
          <ReviewsPlaceholder
            body={route.content.reviewPlaceholder.body}
            title={route.content.reviewPlaceholder.title}
          />
        ) : null}
      </section>
      <Reservation />
      <Footer />
    </main>
  );
}

function HomePage() {
  const basePath = useBasePath();
  const heroRef = useRef<HTMLElement>(null);
  const [heroVisible, setHeroVisible] = useState(true);

  useEffect(() => {
    const hero = heroRef.current;

    if (!hero || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.08 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <section
        ref={heroRef}
        className={heroVisible ? "hero is-visible" : "hero"}
        id="top"
      >
        <Header isHome />
        <div
          className="hero-image"
          style={{
            backgroundImage: `url("${assetUrl(basePath, "hero-entrance-v2.png")}")`,
          }}
          aria-hidden="true"
        />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-glitter" aria-hidden="true">
          {GLITTER_SPARKS.map((spark) => (
            <span className={`glitter-spark glitter-spark-${spark}`} key={spark} />
          ))}
        </div>
        <div className="hero-content">
          <h1>
            Dominican roots.
            <br />
            Global flavor.
          </h1>
          <p>
            A contemporary Dominican kitchen, cocktail bar &amp; late-night
            destination in Orlando.
          </p>
          <div className="hero-actions">
            <a
              className="button button-primary"
              href={businessProfile.reservationUrl}
              target="_blank"
              rel="noreferrer"
              data-analytics="reserve-hero"
            >
              Reserve a table
            </a>
            <a
              className="button button-outline"
              href={routeHref(basePath, "/menu/")}
              data-analytics="menu-hero"
            >
              Explore the menu
            </a>
          </div>
        </div>
        <a className="scroll-cue" href="#experiences" aria-label="Explore Aroma">
          <span>Explore</span>
          <svg aria-hidden="true" viewBox="0 0 12 44" fill="none">
            <path d="M6 0v41M1 36l5 5 5-5" stroke="currentColor" />
          </svg>
        </a>
      </section>

      <Experiences />
      <Reservation />
      <Footer />
    </main>
  );
}

export default function App({ routePath, basePath = "/" }: AppProps) {
  const route = useMemo(
    () => resolveRoute(routePath, basePath),
    [basePath, routePath],
  );

  useEffect(() => {
    document.title = route.meta.title;
  }, [route]);

  useEffect(() => {
    document.body.dataset.routeId = route.id;
    return () => {
      delete document.body.dataset.routeId;
    };
  }, [route.id]);

  if (route.id === "home") {
    return (
      <BasePathContext.Provider value={basePath}>
        <HomePage />
      </BasePathContext.Provider>
    );
  }

  return (
    <BasePathContext.Provider value={basePath}>
      <GenericRoutePage route={route} />
    </BasePathContext.Provider>
  );
}

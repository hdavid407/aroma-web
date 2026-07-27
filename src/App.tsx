import { useEffect, useState } from "react";

const RESERVE_URL = "https://calendar.app.google/cpmqknZ47F98bgRA8";
const assetUrl = (filename: string) =>
  `${import.meta.env.BASE_URL}assets/${filename}`;

type ArrowProps = {
  className?: string;
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

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Aroma Gastrobar home">
        <img src={assetUrl("aroma-logo.png")} alt="Aroma Gastrobar" />
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
        <a href="#experiences" onClick={closeMenu}>
          Menu
        </a>
        <a href="#brunch" onClick={closeMenu}>
          Brunch
        </a>
        <a href="#after-dark" onClick={closeMenu}>
          After dark
        </a>
        <a href="#visit" onClick={closeMenu}>
          Contact
        </a>
        <a
          className="nav-reserve"
          href={RESERVE_URL}
          target="_blank"
          rel="noreferrer"
          onClick={closeMenu}
        >
          Reserve
        </a>
      </nav>
    </header>
  );
}

const experiences = [
  {
    id: "food",
    title: "Food",
    copy: "Bold flavors, rooted in culture.",
    image: assetUrl("food-01.jpg"),
    href: "https://www.aromagastrobar.com/dinner",
  },
  {
    id: "cocktails",
    title: "Cocktails",
    copy: "Crafted with intention.",
    image: assetUrl("drinks-01.jpg"),
    href: "https://www.aromagastrobar.com/drinks",
  },
  {
    id: "brunch",
    title: "Brunch",
    copy: "Weekends done right.",
    image: assetUrl("brunch-01.jpg"),
    href: "#visit",
  },
  {
    id: "after-dark",
    title: "After dark",
    copy: "Music. Drinks. Vibes.",
    image: assetUrl("lounge-01.jpg"),
    href: "#reserve",
  },
];

function Experiences() {
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
          nights—Aroma moves with the moment.
        </p>
      </div>

      <div className="experience-rail">
        {experiences.map((item, index) => (
          <a
            className={`experience experience-${index + 1}`}
            id={item.id}
            href={item.href}
            key={item.title}
          >
            <div className="experience-image">
              <img src={item.image} alt="" />
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
  return (
    <section className="reservation" id="reserve">
      <div
        className="reservation-photo"
        style={{
          backgroundImage: `url("${assetUrl("lounge-01.jpg")}")`,
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
            href={RESERVE_URL}
            target="_blank"
            rel="noreferrer"
          >
            Reserve your table
          </a>
          <a
            className="text-link"
            href="https://maps.google.com/?q=1700+N+Semoran+Blvd+Suite+118+Orlando+FL+32807"
            target="_blank"
            rel="noreferrer"
          >
            Get directions
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer section-pad" id="visit">
      <div className="visit-grid">
        <div className="visit-detail">
          <span className="detail-index">01</span>
          <div>
            <span className="detail-label">Located at</span>
            <address>
              1700 N Semoran Blvd, Suite 118
              <br />
              Orlando, FL 32807
            </address>
          </div>
        </div>
        <div className="visit-detail">
          <span className="detail-index">02</span>
          <div>
            <span className="detail-label">After dark</span>
            <p>Fri &amp; Sat — Lounge after 10PM</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <a className="footer-brand" href="#top" aria-label="Back to top">
          <img src={assetUrl("aroma-logo.png")} alt="Aroma Gastrobar" />
        </a>
        <div className="social-links">
          <a
            href="https://instagram.com/aroma_orlando"
            target="_blank"
            rel="noreferrer"
          >
            <InstagramIcon />
            Instagram
          </a>
          <a
            href="https://tiktok.com/aroma_orlando"
            target="_blank"
            rel="noreferrer"
          >
            <TikTokIcon />
            TikTok
          </a>
        </div>
      </div>
      <div className="copyright">
        <span>© 2026 Aroma Gastrobar</span>
        <span>Orlando, Florida</span>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <main>
      <section className="hero" id="top">
        <Header />
        <div
          className="hero-image"
          style={{
            backgroundImage: `url("${assetUrl("hero-entrance-v2.png")}")`,
          }}
          aria-hidden="true"
        />
        <div className="hero-shade" aria-hidden="true" />
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
              href={RESERVE_URL}
              target="_blank"
              rel="noreferrer"
            >
              Reserve a table
            </a>
            <a className="button button-outline" href="#experiences">
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

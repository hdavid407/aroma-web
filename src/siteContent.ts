const MAPS_URL =
  "https://maps.google.com/?q=1700+N+Semoran+Blvd+Suite+118+Orlando+FL+32807";

export type RouteId =
  | "home"
  | "menu"
  | "events"
  | "catering"
  | "story"
  | "contact"
  | "gallery"
  | "gift-cards"
  | "careers";

export type SocialPlatform = "instagram" | "tiktok";

export type SocialLink = {
  id: SocialPlatform;
  label: string;
  href: string;
};

export type HoursEntry = {
  days: string;
  hours: string;
  status: "provisional";
};

export type BusinessProfile = {
  name: string;
  addressLines: [string, string];
  fullAddress: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  emailHref: string;
  reservationUrl: string;
  directionsUrl: string;
  socialLinks: SocialLink[];
  hours: HoursEntry[];
  afterDarkNote: string;
};

export type RouteMeta = {
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  intro: string;
  heroImage: string;
  heroAlt: string;
};

export type PageAction = {
  label: string;
  href: string;
  analytics: string;
  external?: boolean;
};

export type ContentSection = {
  title: string;
  body: string[];
};

export type MenuItem = {
  name: string;
  description?: string;
  price?: string;
};

export type MenuSection = {
  id: string;
  title: string;
  summary: string;
  items: MenuItem[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type EventRecord = {
  id: string;
  title: string;
  startIso: string;
  endIso?: string;
  displayDate: string;
  timeLabel: string;
  summary: string;
  href?: string;
  recurringNote?: string;
  verified: boolean;
};

export type GalleryItem = {
  image: string;
  alt: string;
  caption: string;
};

export type RouteContent = {
  lead?: string;
  sections?: ContentSection[];
  menuSections?: MenuSection[];
  faqs?: FaqItem[];
  events?: EventRecord[];
  gallery?: GalleryItem[];
  hoursNote?: string;
  primaryAction?: PageAction;
  secondaryAction?: PageAction;
  tertiaryAction?: PageAction;
  orderingNote?: string;
  reviewPlaceholder?: {
    title: string;
    body: string;
  };
};

export type RouteDefinition = {
  id: RouteId;
  path: string;
  meta: RouteMeta;
  content: RouteContent;
};

export const businessProfile: BusinessProfile = {
  name: "Aroma Gastrobar",
  addressLines: ["1700 N Semoran Blvd, Suite 118", "Orlando, FL 32807"],
  fullAddress: "1700 N Semoran Blvd, Suite 118, Orlando, FL 32807",
  phoneDisplay: "(407) 237-9661",
  phoneHref: "tel:+14072379661",
  email: "aromagastrobar@gmail.com",
  emailHref: "mailto:aromagastrobar@gmail.com",
  reservationUrl: "https://calendar.app.google/cpmqknZ47F98bgRA8",
  directionsUrl: MAPS_URL,
  socialLinks: [
    {
      id: "instagram",
      label: "Instagram",
      href: "https://instagram.com/aroma_orlando",
    },
    {
      id: "tiktok",
      label: "TikTok",
      href: "https://tiktok.com/aroma_orlando",
    },
  ],
  hours: [
    { days: "Monday", hours: "Closed", status: "provisional" },
    { days: "Tuesday", hours: "4 PM to 12 AM", status: "provisional" },
    { days: "Wednesday", hours: "4 PM to 12 AM", status: "provisional" },
    { days: "Thursday", hours: "4 PM to 2 AM", status: "provisional" },
    { days: "Friday", hours: "4 PM to 2 AM", status: "provisional" },
    { days: "Saturday", hours: "12 PM to 2 AM", status: "provisional" },
    { days: "Sunday", hours: "12 PM to 2 AM", status: "provisional" },
  ],
  afterDarkNote: "Fri & Sat — Lounge after 10PM",
};

export const canonicalRoutes: RouteDefinition[] = [
  {
    id: "home",
    path: "/",
    meta: {
      title: "Aroma Gastrobar | Dominican Fusion Dining, Brunch & Late Nights in Orlando",
      description:
        "Aroma Gastrobar brings together Dominican-inspired plates, cocktails, brunch, and late-night energy in Orlando.",
      eyebrow: "Aroma Gastrobar",
      heading: "Dominican roots. Global flavor.",
      intro:
        "A contemporary Dominican kitchen, cocktail bar & late-night destination in Orlando.",
      heroImage: "hero-entrance-v2.png",
      heroAlt: "Aroma Gastrobar entrance glowing at night",
    },
    content: {},
  },
  {
    id: "menu",
    path: "/menu/",
    meta: {
      title: "Menu | Aroma Gastrobar Orlando",
      description:
        "Browse Aroma Gastrobar menu highlights, from empanadas and ceviche to mofongo, sushi, desserts, and weekend brunch energy.",
      eyebrow: "Menu",
      heading: "Bold plates, brunch energy, and late-night favorites.",
      intro:
        "Explore public menu highlights from Aroma Gastrobar. Prices stay optional here so the team can update them manually when needed.",
      heroImage: "food-01.jpg",
      heroAlt: "A spread of Aroma Gastrobar dishes",
    },
    content: {
      lead:
        "The menu blends Dominican comfort, seafood, street-food cues, and chef-driven plates for dinner, drinks, and weekend plans.",
      menuSections: [
        {
          id: "starters",
          title: "Starters",
          summary:
            "Shareable plates and signature openers built for the first round at the table.",
          items: [
            {
              name: "Empanadas",
              description:
                "Crispy, golden empanadas stuffed with jerk chicken, beef, or cheese and served with cilantro aioli.",
            },
            {
              name: "Aroma Wings",
              description:
                "Signature wings with guava BBQ, spicy pineapple, passion fruit glaze, lemon pepper, or Aroma's spicy sauce.",
            },
            {
              name: "Crispy Shrimp & Calamari Ceviche",
              description:
                "A bright, crunchy take on ceviche finished with aji amarillo aioli.",
            },
            {
              name: "Yuca or Plantain Baskets",
              description:
                "Crispy cups filled with pulled pork, shrimp guisado, or Mongolian chicken.",
            },
          ],
        },
        {
          id: "mains",
          title: "Entrees",
          summary:
            "Dominican staples and larger-format plates for dinner service.",
          items: [
            {
              name: "La Bandera",
              description:
                "White rice, stewed beans, chef's rotating pollo guisado or carne guisada, and fresh avocado.",
            },
            {
              name: "Mofongo",
              description:
                "Hearty mofongo topped with shrimp, chicken, or chicharron and finished with salsa criolla or creamy garlic sauce.",
            },
            {
              name: "Chofan Dominicano",
              description:
                "Dominican-style fried rice with onions, peppers, cabbage, chicken, ham, pork, chorizo, and sweet maduro bits.",
            },
            {
              name: "El Jefe Steak",
              description:
                "Grilled steak and shrimp with malanga puree, seasonal vegetables, and a rum cream sauce.",
            },
          ],
        },
        {
          id: "sushi",
          title: "Sushi",
          summary:
            "House rolls that keep the menu flexible between dinner and late-night tables.",
          items: [
            {
              name: "La Toxica Roll",
            },
            {
              name: "El Diablo Roll",
            },
            {
              name: "La Chapi Roll",
            },
          ],
        },
        {
          id: "dessert",
          title: "Dessert",
          summary:
            "Sweet finishes with island notes and a few comfort-food classics.",
          items: [
            {
              name: "Flan de Coco",
              description:
                "A silky sweet potato and coconut flan with a rich island finish.",
            },
            {
              name: "Rum Pineapple Upside-Down Cake",
              description:
                "Moist pineapple cake with dark rum and caramelized tropical sweetness.",
            },
            {
              name: "Warm Bread Pudding a la mode",
              description:
                "Warm bread pudding with vanilla ice cream and caramel rum sauce.",
            },
          ],
        },
      ],
      sections: [
        {
          title: "Brunch",
          body: [
            "Weekend brunch stays part of the Aroma rhythm, with signature favorites, cocktails, and a lively daytime atmosphere.",
            "Use the reservation link or call ahead if you want to confirm the current brunch lineup before visiting.",
          ],
        },
      ],
      primaryAction: {
        label: "Reserve your table",
        href: businessProfile.reservationUrl,
        analytics: "reserve-menu",
        external: true,
      },
      secondaryAction: {
        label: "Get directions",
        href: businessProfile.directionsUrl,
        analytics: "directions-menu",
        external: true,
      },
      orderingNote:
        "Future online ordering will connect here after a first-party ordering destination is approved.",
    },
  },
  {
    id: "events",
    path: "/events/",
    meta: {
      title: "Events | Aroma Gastrobar Orlando",
      description:
        "See upcoming Aroma Gastrobar events and the late-night lounge programming that shapes weekends in Orlando.",
      eyebrow: "Events",
      heading: "Dinner, cocktails, and a lounge that stays in motion.",
      intro:
        "Aroma pairs dinner service with weekend lounge energy and a small hand-maintained list of upcoming events.",
      heroImage: "lounge-01.jpg",
      heroAlt: "Guests enjoying the Aroma lounge at night",
    },
    content: {
      lead:
        "Fridays and Saturdays lean into after-dark energy, while Aroma Social programming keeps the calendar fresh without filling this page with stale event cards.",
      sections: [
        {
          title: "What to expect",
          body: [
            "The lounge comes alive on Friday and Saturday nights after 10 PM with music, cocktails, and a more social pace.",
            "Aroma Social programming can include paint-and-sip nights, domino competitions, curated networking events, and recurring party concepts.",
          ],
        },
      ],
      events: [
        {
          id: "rnb-saturdays-2026-09-05",
          title: "R&B Saturdays",
          startIso: "2026-09-05T22:00:00-04:00",
          endIso: "2026-09-06T02:00:00-04:00",
          displayDate: "Saturday, September 5, 2026",
          timeLabel: "10 PM to 2 AM",
          summary:
            "Aroma Social returns with smooth R&B, lounge energy, food and drinks, and limited reservation-based perks.",
          href: "https://aromagastrobar.com/events/EIQqsARgdFDv",
          recurringNote: "Public listing notes this event repeats every two weeks on Saturday.",
          verified: true,
        },
        {
          id: "afro-caribbean-day-party-2026-08-15",
          title: "Afro-Caribbean Day Party",
          startIso: "2026-08-15T15:00:00-04:00",
          endIso: "2026-08-15T22:00:00-04:00",
          displayDate: "Saturday, August 15, 2026",
          timeLabel: "3 PM to 10 PM",
          summary:
            "Past Aroma Social event retained in the record list so expired entries can drop out of the rendered page automatically.",
          href: "https://aromagastrobar.com/events/Z0hQVsxVmS8f",
          verified: true,
        },
      ],
      primaryAction: {
        label: "Reserve your table",
        href: businessProfile.reservationUrl,
        analytics: "reserve-events",
        external: true,
      },
      secondaryAction: {
        label: "Call for event details",
        href: businessProfile.phoneHref,
        analytics: "contact-events",
      },
    },
  },
  {
    id: "catering",
    path: "/catering/",
    meta: {
      title: "Catering & Group Dining | Aroma Gastrobar Orlando",
      description:
        "Plan catering, private dining, or group celebrations with Aroma Gastrobar through direct phone and email contact.",
      eyebrow: "Catering",
      heading: "Start the conversation directly with the team.",
      intro:
        "For catering, private dining, and larger hosted gatherings, this page keeps the next step clear: call or email Aroma directly.",
      heroImage: "food-03.jpg",
      heroAlt: "Plated dishes arranged for a group meal",
    },
    content: {
      lead:
        "Whether you're organizing an office dinner, birthday, or off-site food drop, Aroma can talk through timing, guest count, and menu fit one conversation at a time.",
      sections: [
        {
          title: "Best fit",
          body: [
            "Use this page for private dining requests, hosted celebrations, and catering conversations that need real back-and-forth.",
            "Direct phone and email outreach keeps details aligned without implying that a website form has already booked anything.",
          ],
        },
      ],
      faqs: [
        {
          question: "How do I start a catering or private dining request?",
          answer:
            "Call or email Aroma with your date, guest count, and the kind of event you are planning so the team can guide the next step.",
        },
        {
          question: "Can I use this for larger groups?",
          answer:
            "Yes. Aroma's public reservation page specifically asks larger private-event groups to reach out directly instead of relying on an instant booking flow.",
        },
        {
          question: "Is there an online submission form on this page?",
          answer:
            "No. The call and email actions below are the intended handoff for this route.",
        },
      ],
      primaryAction: {
        label: "Call Aroma",
        href: businessProfile.phoneHref,
        analytics: "catering-phone",
      },
      secondaryAction: {
        label: "Email Aroma",
        href: businessProfile.emailHref,
        analytics: "catering-email",
      },
      tertiaryAction: {
        label: "Get directions",
        href: businessProfile.directionsUrl,
        analytics: "directions-catering",
        external: true,
      },
    },
  },
  {
    id: "story",
    path: "/story/",
    meta: {
      title: "Story | Aroma Gastrobar Orlando",
      description:
        "Learn how Aroma Gastrobar brings Dominican inspiration, cocktails, brunch, and lounge energy together under one roof in Orlando.",
      eyebrow: "Story",
      heading: "One room, several moods, one clear point of view.",
      intro:
        "Aroma moves between dinner, cocktails, brunch, and after-dark lounge energy without losing the through-line of Dominican-rooted hospitality.",
      heroImage: "interior-detail.jpg",
      heroAlt: "Interior detail inside Aroma Gastrobar",
    },
    content: {
      lead:
        "The restaurant's public story is less about a scripted origin tale and more about the way food, drinks, music, and atmosphere share the same space.",
      sections: [
        {
          title: "Dominican roots, modern range",
          body: [
            "Aroma describes the kitchen as contemporary Dominican with global flavor, blending familiar island cues with cocktails, seafood, shareable plates, and dinner staples.",
            "That range is what lets the room work for a weeknight meal, a weekend brunch plan, or a later lounge visit without feeling like separate concepts stitched together.",
          ],
        },
        {
          title: "Designed around the night",
          body: [
            "The dining room leads naturally into cocktails and after-dark energy, especially when the lounge shifts gears on Friday and Saturday nights.",
            "If you're planning dinner first and deciding on the rest later, that flexibility is part of the appeal.",
          ],
        },
      ],
      primaryAction: {
        label: "Explore the menu",
        href: "/menu/",
        analytics: "menu-story",
      },
      secondaryAction: {
        label: "Reserve your table",
        href: businessProfile.reservationUrl,
        analytics: "reserve-story",
        external: true,
      },
      reviewPlaceholder: {
        title: "Google reviews integration boundary",
        body:
          "Live Google review excerpts and attribution will appear here once the future API-backed integration is connected. No copied or fabricated review text is rendered in this build.",
      },
    },
  },
  {
    id: "contact",
    path: "/contact/",
    meta: {
      title: "Contact | Aroma Gastrobar Orlando",
      description:
        "Find Aroma Gastrobar in Orlando, view current posted hours, and get direct phone, email, reservation, and directions links.",
      eyebrow: "Contact",
      heading: "Plan the visit without hunting for details.",
      intro:
        "Address, phone, email, posted hours, reservation access, and directions all stay in one place here.",
      heroImage: "hero-interior.jpg",
      heroAlt: "A dining view inside Aroma Gastrobar",
    },
    content: {
      lead:
        "Aroma Gastrobar is located on North Semoran in Orlando, with direct reservation and contact links ready for dinner plans, brunch, and late-night visits.",
      hoursNote:
        "Hours shown here are the current posted schedule being used as provisional content for this project.",
      primaryAction: {
        label: "Get directions",
        href: businessProfile.directionsUrl,
        analytics: "directions-contact",
        external: true,
      },
      secondaryAction: {
        label: "Reserve your table",
        href: businessProfile.reservationUrl,
        analytics: "reserve-contact",
        external: true,
      },
      tertiaryAction: {
        label: "Call Aroma",
        href: businessProfile.phoneHref,
        analytics: "contact-phone",
      },
    },
  },
  {
    id: "gallery",
    path: "/gallery/",
    meta: {
      title: "Gallery | Aroma Gastrobar Orlando",
      description:
        "Browse a quick visual look at Aroma Gastrobar dining, cocktails, brunch, and late-night atmosphere.",
      eyebrow: "Gallery",
      heading: "A quick look at the room, the plates, and the mood.",
      intro:
        "The gallery keeps the focus on the same imagery already carrying the homepage: dining, drinks, brunch, and the lounge.",
      heroImage: "drinks-02.jpg",
      heroAlt: "Cocktails at Aroma Gastrobar",
    },
    content: {
      lead:
        "These images are drawn from the current site assets so the gallery feels like the same brand system rather than a separate content block.",
      gallery: [
        {
          image: "hero-entrance-v2.png",
          alt: "Aroma Gastrobar exterior at night",
          caption: "Night arrival sets the tone before dinner and lounge hours.",
        },
        {
          image: "food-02.jpg",
          alt: "A plated dish from Aroma Gastrobar",
          caption: "Dominican-rooted dishes stay central to the experience.",
        },
        {
          image: "brunch-02.png",
          alt: "A brunch dish at Aroma Gastrobar",
          caption: "Weekend brunch keeps its own energy without leaving the main concept behind.",
        },
        {
          image: "lounge-01.jpg",
          alt: "Guests gathered in the Aroma lounge",
          caption: "After-dark lounge programming rounds out the night.",
        },
      ],
      primaryAction: {
        label: "Reserve your table",
        href: businessProfile.reservationUrl,
        analytics: "reserve-gallery",
        external: true,
      },
      secondaryAction: {
        label: "View the menu",
        href: "/menu/",
        analytics: "menu-gallery",
      },
    },
  },
  {
    id: "gift-cards",
    path: "/gift-cards/",
    meta: {
      title: "Gift Card Information | Aroma Gastrobar Orlando",
      description:
        "Contact Aroma Gastrobar directly for gift card information and in-house guidance.",
      eyebrow: "Gift Cards",
      heading: "Handle gift card questions with the restaurant directly.",
      intro:
        "This route gives guests a simple place to ask about gift card information without inventing a checkout flow that is not connected yet.",
      heroImage: "drinks-01.jpg",
      heroAlt: "A cocktail at Aroma Gastrobar",
    },
    content: {
      lead:
        "Use this page to contact Aroma directly about gift card information.",
      sections: [
        {
          title: "Direct information",
          body: [
            "Call if you want the fastest answer about gift card information.",
            "Email works well when you want to leave a written request and hear back directly from the restaurant.",
          ],
        },
      ],
      primaryAction: {
        label: "Call Aroma",
        href: businessProfile.phoneHref,
        analytics: "gift-card-phone",
      },
      secondaryAction: {
        label: "Email Aroma",
        href: businessProfile.emailHref,
        analytics: "gift-card-email",
      },
      tertiaryAction: {
        label: "Reserve your table",
        href: businessProfile.reservationUrl,
        analytics: "reserve-gift-cards",
        external: true,
      },
    },
  },
  {
    id: "careers",
    path: "/careers/",
    meta: {
      title: "Careers | Aroma Gastrobar Orlando",
      description:
        "Contact Aroma Gastrobar directly for employment information and hiring-related questions in Orlando.",
      eyebrow: "Careers",
      heading: "Reach out if you'd like to work with the team.",
      intro:
        "This route gives applicants a direct line for employment information without pretending there is a staffed applicant portal behind the page.",
      heroImage: "food-03.jpg",
      heroAlt: "Plated dinner service at Aroma Gastrobar",
    },
    content: {
      lead:
        "Use this page to contact Aroma directly about employment information or to ask where to send experience details.",
      sections: [
        {
          title: "Direct contact",
          body: [
            "Email is the clearest way to ask where experience details should be sent and what information is most helpful.",
            "Call if you want to confirm the best contact path before sending anything over.",
          ],
        },
      ],
      primaryAction: {
        label: "Email Aroma",
        href: businessProfile.emailHref,
        analytics: "careers-email",
      },
      secondaryAction: {
        label: "Call Aroma",
        href: businessProfile.phoneHref,
        analytics: "careers-phone",
      },
      tertiaryAction: {
        label: "View the menu",
        href: "/menu/",
        analytics: "menu-careers",
      },
    },
  },
];

export const routeById = Object.fromEntries(
  canonicalRoutes.map((route) => [route.id, route]),
) as Record<RouteId, RouteDefinition>;

const routeByPath = Object.fromEntries(
  canonicalRoutes.map((route) => [route.path, route]),
) as Record<string, RouteDefinition>;

export function normalizeRoutePath(pathname: string, basePath = "/") {
  const [withoutQuery] = pathname.split(/[?#]/u);
  const normalizedBase = basePath.endsWith("/") ? basePath : `${basePath}/`;
  const baseTrimmed =
    normalizedBase !== "/" && withoutQuery.startsWith(normalizedBase)
      ? withoutQuery.slice(normalizedBase.length - 1)
      : withoutQuery;
  const withLeadingSlash = baseTrimmed.startsWith("/")
    ? baseTrimmed
    : `/${baseTrimmed}`;
  const normalized =
    withLeadingSlash === "/" ? withLeadingSlash : withLeadingSlash.replace(/\/+$/u, "/");

  return normalized || "/";
}

export function resolveRoute(pathname: string, basePath = "/") {
  const normalized = normalizeRoutePath(pathname, basePath);
  return routeByPath[normalized] ?? routeById.home;
}

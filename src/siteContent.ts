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
  | "careers"
  | "visit"
  | "reservations"
  | "faq"
  | "group-dining";

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

export type BusinessAddress = {
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
};

export type BusinessProfile = {
  name: string;
  address: BusinessAddress;
  addressLines: [string, string];
  fullAddress: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  emailHref: string;
  reservationUrl: string;
  orderUrl: string;
  directionsUrl: string;
  socialLinks: SocialLink[];
  hours: HoursEntry[];
  cuisines: string[];
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
  slug: string;
  id: string;
  title: string;
  startIso: string;
  endIso?: string;
  displayDate: string;
  timeLabel: string;
  summary: string;
  href?: string;
  recurringNote?: string;
  image?: string;
  verified: boolean;
};

export type ProofAsset = {
  kind:
    | "testimonial"
    | "press"
    | "award"
    | "google-business-profile"
    | "photography";
  title: string;
  body: string;
  source?: string;
  href?: string;
  image?: string;
  imageAlt?: string;
  approved: boolean;
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
  proofAssets?: ProofAsset[];
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
  event?: EventRecord;
};

export type RouteBreadcrumb = {
  name: string;
  path: string;
};

const BUSINESS_ADDRESS: BusinessAddress = {
  streetAddress: "1700 N Semoran Blvd, Suite 118",
  addressLocality: "Orlando",
  addressRegion: "FL",
  postalCode: "32807",
  addressCountry: "US",
};

const BUSINESS_ADDRESS_CITY_LINE = `${BUSINESS_ADDRESS.addressLocality}, ${BUSINESS_ADDRESS.addressRegion} ${BUSINESS_ADDRESS.postalCode}`;

export const businessProfile: BusinessProfile = {
  name: "Aroma Gastro Bar",
  address: BUSINESS_ADDRESS,
  addressLines: [BUSINESS_ADDRESS.streetAddress, BUSINESS_ADDRESS_CITY_LINE],
  fullAddress: `${BUSINESS_ADDRESS.streetAddress}, ${BUSINESS_ADDRESS_CITY_LINE}`,
  phoneDisplay: "(407) 237-9661",
  phoneHref: "tel:+14072379661",
  email: "aromagastrobar@gmail.com",
  emailHref: "mailto:aromagastrobar@gmail.com",
  reservationUrl: "https://calendar.app.google/cpmqknZ47F98bgRA8",
  orderUrl: "https://aromagastrobar.com/menu",
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
    { days: "Tuesday", hours: "5 PM to 12 AM", status: "provisional" },
    { days: "Wednesday", hours: "5 PM to 12 AM", status: "provisional" },
    { days: "Thursday", hours: "5 PM to 2 AM", status: "provisional" },
    { days: "Friday", hours: "5 PM to 2 AM", status: "provisional" },
    { days: "Saturday", hours: "5 PM to 2 AM", status: "provisional" },
    { days: "Sunday", hours: "12 PM to 12 AM", status: "provisional" },
  ],
  cuisines: ["Dominican", "Latin fusion"],
  afterDarkNote: "Fri & Sat — Lounge after 10PM",
};

export const eventRecords: EventRecord[] = [
  {
    slug: "game-night",
    id: "game-night-2026-09-02",
    title: "Game Night",
    startIso: "2026-09-02T17:00:00-04:00",
    endIso: "2026-09-02T23:45:00-04:00",
    displayDate: "Wednesday, September 2, 2026",
    timeLabel: "5 PM to 11:45 PM",
    summary:
      "Aroma Gastro Bar's current midweek Game Night listing brings food, drinks, and social energy to Orlando.",
    href: "https://aromagastrobar.com/events/Bom2sFNutRF1",
    recurringNote: "Recurring event listing; confirm the current week's details before visiting.",
    image: "lounge-01.jpg",
    verified: true,
  },
  {
    slug: "noche-toxica-friday",
    id: "noche-toxica-friday-2026-09-04",
    title: "Noche Toxica Friday",
    startIso: "2026-09-04T22:00:00-04:00",
    endIso: "2026-09-05T02:00:00-04:00",
    displayDate: "Friday, September 4, 2026",
    timeLabel: "10 PM to 2 AM",
    summary:
      "A late-night Aroma Social event with DJ music, cocktails, and the lounge energy that defines Friday nights.",
    href: "https://aromagastrobar.com/events/CRctpwUc40BN",
    recurringNote: "Recurring event listing; confirm the current week's details before visiting.",
    image: "lounge-01.jpg",
    verified: true,
  },
  {
    slug: "rnb-saturdays",
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
    image: "lounge-01.jpg",
    verified: true,
  },
  {
    slug: "afro-caribbean-day-party",
    id: "afro-caribbean-day-party-2026-08-15",
    title: "Afro-Caribbean Day Party",
    startIso: "2026-08-15T15:00:00-04:00",
    endIso: "2026-08-15T22:00:00-04:00",
    displayDate: "Saturday, August 15, 2026",
    timeLabel: "3 PM to 10 PM",
    summary:
      "Past Aroma Social event retained in the record list so expired entries can drop out of generated pages automatically.",
    href: "https://aromagastrobar.com/events/Z0hQVsxVmS8f",
    image: "lounge-01.jpg",
    verified: true,
  },
];

export function isEventUpcoming(event: EventRecord, now = new Date()) {
  const activeUntil = event.endIso ?? event.startIso;

  return event.verified && new Date(activeUntil).getTime() > now.getTime();
}

export const upcomingEvents = (now = new Date()) =>
  eventRecords.filter((event) => isEventUpcoming(event, now));

export const canonicalRoutes: RouteDefinition[] = [
  {
    id: "home",
    path: "/",
    meta: {
      title: "Aroma Gastro Bar | Dominican Latin Fusion & Nightlife in Orlando",
      description:
        "Aroma Gastro Bar brings Dominican-rooted Latin fusion, cocktails, brunch, and late-night events to Azalea Park in Orlando.",
      eyebrow: "Aroma Gastro Bar",
      heading: "Dominican roots. Global flavor.",
      intro:
        "A Dominican-rooted Latin-fusion restaurant, cocktail bar, and late-night destination in Azalea Park, Orlando.",
      heroImage: "hero-entrance-v2.png",
      heroAlt: "Aroma Gastro Bar entrance glowing at night",
    },
    content: {},
  },
  {
    id: "menu",
    path: "/menu/",
    meta: {
      title: "Dominican & Latin Fusion Menu | Aroma Gastro Bar Orlando",
      description:
        "Explore Aroma Gastro Bar's curated Orlando menu of empanadas, mofongo, Dominican classics, sushi, brunch, cocktails, desserts, and late-night favorites.",
      eyebrow: "Menu",
      heading: "Bold plates, brunch energy, and late-night favorites.",
      intro:
        "Explore signature Dominican-rooted plates, Latin-fusion favorites, sushi, brunch, cocktails, and late-night food before your visit.",
      heroImage: "food-01.jpg",
      heroAlt: "A spread of Aroma Gastro Bar dishes",
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
      tertiaryAction: {
        label: "Order online",
        href: businessProfile.orderUrl,
        analytics: "order-menu",
        external: true,
      },
    },
  },
  {
    id: "events",
    path: "/events/",
    meta: {
      title: "Orlando Nightlife & Events | Aroma Gastro Bar",
      description:
        "Find Orlando nightlife at Aroma Gastro Bar: Game Night, Noche Toxica Fridays, R&B Saturdays, cocktails, DJs, and late-night food.",
      eyebrow: "Events",
      heading: "Dinner, cocktails, and Orlando nights in motion.",
      intro:
        "Aroma Gastro Bar pairs Dominican-rooted food with cocktails, DJs, recurring nightlife, and current events in Azalea Park, Orlando.",
      heroImage: "lounge-01.jpg",
      heroAlt: "Guests enjoying the Aroma lounge at night",
    },
    content: {
      lead:
        "Friday and Saturday nights lean into after-dark energy, while Aroma Social programming keeps the calendar fresh without leaving guests to guess what is happening this week.",
      sections: [
        {
          title: "Orlando nightlife at Aroma",
          body: [
            "The lounge comes alive on Friday and Saturday nights after 10 PM with music, cocktails, and a more social pace.",
            "Current programming includes Game Night, Noche Toxica Friday, and R&B Saturdays. Event details, dates, and times are maintained here as they are confirmed.",
          ],
        },
      ],
      events: eventRecords,
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
    id: "visit",
    path: "/visit/",
    meta: {
      title: "Visit Aroma Gastro Bar | Hours & Location in Orlando",
      description:
        "Plan a visit to Aroma Gastro Bar in Azalea Park, Orlando. Find the address, posted hours, directions, reservations, and online ordering.",
      eyebrow: "Visit",
      heading: "Your next Orlando night starts here.",
      intro:
        "Find Aroma Gastro Bar on North Semoran in Azalea Park, with current hours and the links you need for dinner, brunch, nightlife, or pickup.",
      heroImage: "hero-interior.jpg",
      heroAlt: "Dining room inside Aroma Gastro Bar in Orlando",
    },
    content: {
      lead:
        "Aroma Gastro Bar brings Dominican-rooted Latin-fusion food, cocktails, brunch, and late-night events together at 1700 N Semoran Blvd, Suite 118, Orlando, FL 32807.",
      hoursNote:
        "Hours shown here follow the current posted schedule and should be checked before special-event visits.",
      primaryAction: {
        label: "Get directions",
        href: businessProfile.directionsUrl,
        analytics: "directions-visit",
        external: true,
      },
      secondaryAction: {
        label: "Reserve your table",
        href: businessProfile.reservationUrl,
        analytics: "reserve-visit",
        external: true,
      },
      tertiaryAction: {
        label: "Order online",
        href: businessProfile.orderUrl,
        analytics: "order-visit",
        external: true,
      },
    },
  },
  {
    id: "reservations",
    path: "/reservations/",
    meta: {
      title: "Reservations | Aroma Gastro Bar Orlando",
      description:
        "Reserve a table at Aroma Gastro Bar in Orlando for Dominican-rooted Latin-fusion dining, brunch, cocktails, and late-night events.",
      eyebrow: "Reservations",
      heading: "Make the night yours.",
      intro:
        "Use Aroma's reservation link to plan dinner, brunch, celebrations, and nights built around the lounge.",
      heroImage: "lounge-01.jpg",
      heroAlt: "A lively evening at Aroma Gastro Bar",
    },
    content: {
      lead:
        "A reservation gives your group a clear starting point for food, drinks, music, and the late-night energy of Aroma Gastro Bar.",
      sections: [
        {
          title: "Planning a larger gathering",
          body: [
            "For group dining, private events, or a celebration with extra details, contact the team directly so they can guide the best next step.",
            "For current event nights, check the Events page before reserving so your plans line up with the latest program details.",
          ],
        },
      ],
      primaryAction: {
        label: "Reserve your table",
        href: businessProfile.reservationUrl,
        analytics: "reserve-reservations",
        external: true,
      },
      secondaryAction: {
        label: "Call Aroma",
        href: businessProfile.phoneHref,
        analytics: "reservations-phone",
      },
      tertiaryAction: {
        label: "Visit information",
        href: "/visit/",
        analytics: "visit-reservations",
      },
    },
  },
  {
    id: "faq",
    path: "/faq/",
    meta: {
      title: "Aroma Gastro Bar FAQ | Orlando Dining & Nightlife",
      description:
        "Get answers about Aroma Gastro Bar in Orlando, including cuisine, hours, reservations, online ordering, brunch, events, and location.",
      eyebrow: "FAQ",
      heading: "The useful details, all in one place.",
      intro:
        "Answers for planning dinner, brunch, ordering, reservations, and an after-dark visit to Aroma Gastro Bar.",
      heroImage: "interior-detail.jpg",
      heroAlt: "Interior detail at Aroma Gastro Bar",
    },
    content: {
      lead:
        "If you are deciding where to eat, meet, celebrate, or spend the night in Orlando, these are the details guests ask about most.",
      faqs: [
        {
          question: "Where is Aroma Gastro Bar located?",
          answer:
            "Aroma Gastro Bar is at 1700 N Semoran Blvd, Suite 118, Orlando, FL 32807, in the Azalea Park area.",
        },
        {
          question: "What kind of food does Aroma serve?",
          answer:
            "Aroma serves Dominican-rooted Latin-fusion food, including empanadas, wings, ceviche, mofongo, La Bandera, Chofan Dominicano, sushi, desserts, and other shareable plates.",
        },
        {
          question: "Does Aroma offer brunch?",
          answer:
            "Weekend brunch is part of the Aroma experience. The lineup and hours can change, so call ahead or check the current reservation details before visiting.",
        },
        {
          question: "Can I reserve a table?",
          answer:
            "Yes. Use the reservations link on this site to choose the current booking option for Aroma Gastro Bar.",
        },
        {
          question: "Does Aroma offer online ordering?",
          answer:
            "Yes. Online ordering for pickup and delivery is available through Aroma's live ordering menu.",
        },
        {
          question: "What happens at Aroma after dark?",
          answer:
            "Friday and Saturday nights lean into lounge energy after 10 PM, with cocktails, music, DJs, and recurring Aroma Social events.",
        },
        {
          question: "How do I ask about a group or private event?",
          answer:
            "Call or email Aroma with your date, guest count, and event details so the team can guide the right group-dining or catering conversation.",
        },
      ],
      primaryAction: {
        label: "Reserve your table",
        href: businessProfile.reservationUrl,
        analytics: "reserve-faq",
        external: true,
      },
      secondaryAction: {
        label: "Get directions",
        href: businessProfile.directionsUrl,
        analytics: "directions-faq",
        external: true,
      },
      tertiaryAction: {
        label: "Contact Aroma",
        href: "/contact/",
        analytics: "contact-faq",
      },
    },
  },
  {
    id: "group-dining",
    path: "/group-dining/",
    meta: {
      title: "Group Dining & Private Events | Aroma Gastro Bar Orlando",
      description:
        "Ask Aroma Gastro Bar about group dining, private events, celebrations, and catering in Orlando through direct phone or email contact.",
      eyebrow: "Group Dining",
      heading: "Bring your people. We will help shape the plan.",
      intro:
        "Start a group-dining, private-event, or celebration conversation with the Aroma Gastro Bar team in Orlando.",
      heroImage: "food-03.jpg",
      heroAlt: "Plated dishes prepared for group dining at Aroma Gastro Bar",
    },
    content: {
      lead:
        "Aroma is built for dinner plans, birthdays, office gatherings, and nights that need food, drinks, and a social room in one place.",
      sections: [
        {
          title: "Start with the details",
          body: [
            "Share your preferred date, guest count, occasion, and whether you are considering dining at Aroma or catering elsewhere.",
            "The team can talk through menu fit, timing, reservations, and the next step for your group.",
          ],
        },
      ],
      primaryAction: {
        label: "Call Aroma",
        href: businessProfile.phoneHref,
        analytics: "group-dining-phone",
      },
      secondaryAction: {
        label: "Email Aroma",
        href: businessProfile.emailHref,
        analytics: "group-dining-email",
      },
      tertiaryAction: {
        label: "Reserve a table",
        href: businessProfile.reservationUrl,
        analytics: "group-dining-reserve",
        external: true,
      },
    },
  },
  {
    id: "catering",
    path: "/catering/",
    meta: {
      title: "Catering & Group Dining | Aroma Gastro Bar Orlando",
      description:
        "Plan catering, private dining, or group celebrations with Aroma Gastro Bar through direct phone and email contact.",
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
      title: "Story | Aroma Gastro Bar Orlando",
      description:
        "Learn how Aroma Gastro Bar brings Dominican inspiration, cocktails, brunch, and lounge energy together under one roof in Orlando.",
      eyebrow: "Story",
      heading: "One room, several moods, one clear point of view.",
      intro:
        "Aroma moves between dinner, cocktails, brunch, and after-dark lounge energy without losing the through-line of Dominican-rooted hospitality.",
      heroImage: "interior-detail.jpg",
      heroAlt: "Interior detail inside Aroma Gastro Bar",
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
      title: "Contact | Aroma Gastro Bar Orlando",
      description:
        "Find Aroma Gastro Bar in Orlando, view current posted hours, and get direct phone, email, reservation, and directions links.",
      eyebrow: "Contact",
      heading: "Plan the visit without hunting for details.",
      intro:
        "Address, phone, email, posted hours, reservation access, and directions all stay in one place here.",
      heroImage: "hero-interior.jpg",
      heroAlt: "A dining view inside Aroma Gastro Bar",
    },
    content: {
      lead:
        "Aroma Gastro Bar is located on North Semoran in Orlando, with direct reservation and contact links ready for dinner plans, brunch, and late-night visits.",
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
      title: "Gallery | Aroma Gastro Bar Orlando",
      description:
        "Browse a quick visual look at Aroma Gastro Bar dining, cocktails, brunch, and late-night atmosphere.",
      eyebrow: "Gallery",
      heading: "A quick look at the room, the plates, and the mood.",
      intro:
        "The gallery keeps the focus on the same imagery already carrying the homepage: dining, drinks, brunch, and the lounge.",
      heroImage: "drinks-02.jpg",
      heroAlt: "Cocktails at Aroma Gastro Bar",
    },
    content: {
      lead:
        "These images are drawn from the current site assets so the gallery feels like the same brand system rather than a separate content block.",
      gallery: [
        {
          image: "hero-entrance-v2.png",
          alt: "Aroma Gastro Bar exterior at night",
          caption: "Night arrival sets the tone before dinner and lounge hours.",
        },
        {
          image: "food-02.jpg",
          alt: "A plated dish from Aroma Gastro Bar",
          caption: "Dominican-rooted dishes stay central to the experience.",
        },
        {
          image: "brunch-02.png",
          alt: "A brunch dish at Aroma Gastro Bar",
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
      title: "Gift Card Information | Aroma Gastro Bar Orlando",
      description:
        "Contact Aroma Gastro Bar directly for gift card information and in-house guidance.",
      eyebrow: "Gift Cards",
      heading: "Handle gift card questions with the restaurant directly.",
      intro:
        "This route gives guests a simple place to ask about gift card information without inventing a checkout flow that is not connected yet.",
      heroImage: "drinks-01.jpg",
      heroAlt: "A cocktail at Aroma Gastro Bar",
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
      title: "Careers | Aroma Gastro Bar Orlando",
      description:
        "Contact Aroma Gastro Bar directly for employment information and hiring-related questions in Orlando.",
      eyebrow: "Careers",
      heading: "Reach out if you'd like to work with the team.",
      intro:
        "This route gives applicants a direct line for employment information without pretending there is a staffed applicant portal behind the page.",
      heroImage: "food-03.jpg",
      heroAlt: "Plated dinner service at Aroma Gastro Bar",
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

export const eventRoutes: RouteDefinition[] = upcomingEvents().map((event) => ({
  id: "events",
  path: `/events/${event.slug}/`,
  meta: {
    title: `${event.title} | Aroma Gastro Bar Orlando`,
    description: `${event.title} at Aroma Gastro Bar in Orlando on ${event.displayDate}. Find event details, timing, food, drinks, and reservations.`,
    eyebrow: "Events",
    heading: event.title,
    intro: `${event.displayDate} · ${event.timeLabel} · Aroma Gastro Bar, Orlando.`,
    heroImage: event.image ?? "lounge-01.jpg",
    heroAlt: `${event.title} at Aroma Gastro Bar`,
  },
  content: {
    lead: event.summary,
    sections: [
      {
        title: "Plan your night",
        body: [
          `${event.title} is part of Aroma Gastro Bar's current Orlando nightlife programming.`,
          "The full food and drink experience is available for guests planning dinner, drinks, and late-night energy around the event.",
          event.recurringNote ?? "Check the Events page for future dates and current program updates.",
        ],
      },
    ],
    primaryAction: {
      label: "Reserve your table",
      href: businessProfile.reservationUrl,
      analytics: "reserve-event-detail",
      external: true,
    },
    secondaryAction: {
      label: "See all events",
      href: "/events/",
      analytics: "events-event-detail",
    },
    tertiaryAction: {
      label: "Order online",
      href: businessProfile.orderUrl,
      analytics: "order-event-detail",
      external: true,
    },
  },
  event,
}));

export const allRoutes = [...canonicalRoutes, ...eventRoutes];

export function getRouteBreadcrumbs(route: RouteDefinition): RouteBreadcrumb[] {
  if (route.id === "home") {
    return [];
  }

  if (route.event) {
    return [
      { name: "Home", path: routeById.home.path },
      { name: "Events", path: routeById.events.path },
      { name: route.event.title, path: route.path },
    ];
  }

  return [
    { name: "Home", path: routeById.home.path },
    { name: route.meta.eyebrow, path: route.path },
  ];
}

const routeByPath = Object.fromEntries(
  allRoutes.map((route) => [route.path, route]),
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

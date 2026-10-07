// src/lib/seo.ts
// Single source of truth for business identity + search metadata
// (layout metadata, robots, sitemap, LocalBusiness JSON-LD, per-page titles).

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.copperfoxcollective.com').replace(/\/$/, '');

export const BUSINESS = {
  name: 'Copper Fox Collective',
  /** Former name — kept so searches for the old brand still find the new one. */
  formerName: 'CM Florals & Gifts',
  founder: 'Carole Murray',
  email: 'shop@copperfoxcollective.com',
  telephone: '+1-630-448-0108',
  address: {
    streetAddress: '522 W Main St',
    addressLocality: 'St. Charles',
    addressRegion: 'IL',
    postalCode: '60174',
    addressCountry: 'US',
  },
  geo: { latitude: 41.912779, longitude: -88.321028 },
  areaServed: [
    'St. Charles',
    'Geneva',
    'Batavia',
    'Wayne',
    'Campton Hills',
    'Elburn',
    'South Elgin',
    'Elgin',
    'Aurora',
    'Naperville',
    'Chicago',
  ],
  hours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '11:00', closes: '17:00' },
    { days: ['Saturday'], opens: '09:00', closes: '13:00' },
  ],
  sameAs: [
    'https://www.instagram.com/cm_florals/',
    'https://www.tiktok.com/@cmflorals',
    'https://www.facebook.com/profile.php?id=61578447401671',
  ],
  ogImage: '/og.jpg',
} as const;

export const DEFAULT_TITLE = 'Copper Fox Collective | Gift Shop & Florist in St. Charles, IL';
export const DEFAULT_DESCRIPTION =
  'Copper Fox Collective (formerly CM Florals & Gifts) is a St. Charles, IL gift shop and florist on W Main St — handcrafted gifts from local artists, fresh flower arrangements, wedding & event florals, floral design classes, and bloom bar rentals.';

export const KEYWORDS = [
  'Copper Fox Collective',
  'CM Florals',
  'CM Florals & Gifts',
  'St. Charles florist',
  'florist St. Charles IL',
  'flower shop St. Charles',
  'gift shop St. Charles IL',
  'handmade gifts St. Charles',
  'local artist gifts',
  'Zipperworks',
  'flower delivery St. Charles',
  'Geneva IL florist',
  'Batavia IL florist',
  'Fox Valley florist',
  'wedding florist St. Charles',
  'event florals Chicago suburbs',
  'floral design classes',
  'flower arranging class near me',
  'bloom bar rental',
  'Carole Murray florist',
];

/** Per-route search titles/descriptions. Keys are page slugs ('' = home). */
export const PAGE_SEO: Record<string, { title: string; description: string }> = {
  shop: {
    title: 'Shop Flowers & Gifts',
    description:
      'Order fresh bouquets, arrangements, plants, and handcrafted gifts online from Copper Fox Collective in St. Charles, IL. Delivery and curbside pickup available.',
  },
  custom: {
    title: 'Custom Floral Request',
    description:
      'Request a custom floral arrangement or bloom bar event from Copper Fox Collective in St. Charles, IL. Tell us your colors, style, and budget and we’ll follow up with a quote.',
  },
  'weddings-events': {
    title: 'Wedding & Event Florist',
    description:
      'Wedding, shower, corporate, and celebration florals designed by Copper Fox Collective — serving St. Charles, Geneva, Batavia, and the Chicago suburbs.',
  },
  classes: {
    title: 'Floral Design Classes',
    description:
      'Hands-on floral design and arrangement classes in St. Charles, IL. All flowers and supplies included, BYOB, take your arrangement home. Book a class or private party.',
  },
  boombar: {
    title: 'Bloom Bar Party Rentals',
    description:
      'Rent a DIY bloom bar or book a florist-led private bloom bar party for weddings, showers, birthdays, and corporate events — Copper Fox Collective, St. Charles, IL.',
  },
  contact: {
    title: 'Contact & Directions',
    description:
      'Visit Copper Fox Collective at 522 W Main St, St. Charles, IL. Hours Mon–Fri 11am–5pm, Sat 9am–1pm. Call, text, or email to order or plan your event.',
  },
};

/** Routes to list in sitemap.xml. */
export const SITEMAP_ROUTES = ['', ...Object.keys(PAGE_SEO)];

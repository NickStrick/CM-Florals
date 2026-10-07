import { BUSINESS, DEFAULT_DESCRIPTION, SITE_URL } from "@/lib/seo";

export default function SeoLocalBusinessSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Florist", "Store"],
    "@id": `${SITE_URL}/#business`,
    "name": BUSINESS.name,
    "alternateName": BUSINESS.formerName,
    "description": DEFAULT_DESCRIPTION,
    "url": SITE_URL,
    "email": BUSINESS.email,
    "telephone": BUSINESS.telephone,
    "image": `${SITE_URL}${BUSINESS.ogImage}`,
    "founder": { "@type": "Person", "name": BUSINESS.founder },
    "address": { "@type": "PostalAddress", ...BUSINESS.address },
    "geo": { "@type": "GeoCoordinates", ...BUSINESS.geo },
    "hasMap": "https://www.google.com/maps/search/?api=1&query=522+W+Main+St+St.+Charles+IL+60174",
    "areaServed": BUSINESS.areaServed.map((name) => ({ "@type": "City", name })),
    "openingHoursSpecification": BUSINESS.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": h.days,
      "opens": h.opens,
      "closes": h.closes,
    })),
    "sameAs": BUSINESS.sameAs,
    "makesOffer": [
      "Handcrafted gifts from local artists",
      "Fresh flower arrangements & bouquets",
      "Wedding & event florals",
      "Floral design classes",
      "Bloom bar rentals & parties",
    ].map((name) => ({ "@type": "Offer", "itemOffered": { "@type": "Service", name } })),
    "priceRange": "$$",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

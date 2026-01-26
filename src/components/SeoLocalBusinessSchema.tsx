export default function SeoLocalBusinessSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Florist",
    "name": "CM Florals & Gifts",
    "url": "https://www.cmfloralsandgifts.com",
    "telephone": "+17732094805",
    "image": "https://www.cmfloralsandgifts.com/og.jpg",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "500 W Madison St",
      "addressLocality": "Chicago",
      "addressRegion": "IL",
      "postalCode": "60661",
      "addressCountry": "US"
    },
    "areaServed": [
      { "@type": "City", "name": "Chicago" }
    ],
    "openingHoursSpecification": [
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Monday", "opens": "09:00", "closes": "17:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Tuesday", "opens": "09:00", "closes": "17:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Wednesday", "opens": "09:00", "closes": "17:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Thursday", "opens": "09:00", "closes": "17:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Friday", "opens": "09:00", "closes": "17:00" }
    ],
    "priceRange": "$$"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

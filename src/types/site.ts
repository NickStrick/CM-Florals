// src/types/site.ts
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
export type ThemePreset =
  | 'ocean'
  | 'sunset'
  | 'forest'
  | 'slate'
  | 'festival'
  | 'candy'
  | 'neon'
  | 'grove'
  | 'forest-earthy'
  | 'lavender'
  | 'irish'
  | 'splunk'
  | 'sue';  // new

export type Theme = {
  preset: ThemePreset;
  primary?: string;
  accent?: string;
  radius?: 'sm' | 'md' | 'lg' | 'xl';
};
export type SiteStyle = {
  preset: ThemePreset;
  primary?: string;   
  accent?: string;
  radius?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
};

export type SectionBase = {
  id: string;
  type:
    | 'header'
    | 'hero'
    | 'features'
    | 'cta'
    | 'newsletter'
    | 'contact'
    | 'scheduling'
    | 'footer'
    | 'testimonials'
    | 'stats'
    | 'about'
    | 'disclaimer'
    | 'sectional'
    | 'skills'
    | 'pricing'
    | 'share'
    | 'partners'
    | 'instagram'
    | 'gallery'
    | 'socials'
    | 'video'
    | 'productListings'
    | 'persons'
    ;

  // visible/editable flags to support your builder UI
  visible?: boolean;
  editable?: boolean;
  backgroundClass?: string; // custom bg class (e.g. "bg-gradient-to-r from-blue-500 to-green-500")
  topWaveType?: string;
  bottomWaveType?: string;
};

export type AnySection =
  | HeaderSection
  | HeroSection
  | FeaturesSection
  | AboutSection       
  | DisclaimerSection 
  | CTASection
  | NewsletterSection
  | ContactSection
  | SchedulingSection
  | FooterSection
  | TestimonialsSection
  | StatsSection
  | SectionalSection
  | SkillsSection
  | PricingSection
  | ShareSection
  | PartnersSection
  | InstagramSection
  | GallerySection
  | SocialsSection
  | VideoSection
  | ProductListingsSection
  | PersonsSection; 
  ;
// add this near other shared types
export type HeaderStyle = {
  sticky?: boolean;                // default: true
  blur?: boolean;                  // default: true (backdrop blur)
  elevation?: 'none' | 'sm' | 'md';// shadow strength
  transparent?: boolean;           // if true, no solid bg (uses transparent/overlay)
};

// update HeaderSection
export type HeaderSection = SectionBase & {
  type: 'header';
  logoText?: string;
  logoImage?: string;
  links?: { label: string; href: string }[];
  cta?: { label: string; href: string };
  style?: HeaderStyle; // 👈 new
};


export type HeroSection = SectionBase & {
  type: 'hero';
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  imageUrl?: string;
};

// ✅ NEW: About
export type AboutSection = SectionBase & {
  type: 'about';
  title?: string;
  body: string;           // markdown or plain text
  imageUrl?: string;      // headshot or supporting image
  bullets?: string[];     // optional quick facts
  align?: 'left' | 'right' | 'center'; // image/text alignment
};

// ✅ NEW: Disclaimer (used in your config)
export type DisclaimerSection = SectionBase & {
  type: 'disclaimer';
  title?: string;
  body: string;
  enabled?: boolean;
};
export type FeatureMeta = { label: string; value: string };

export type FeaturesSection = SectionBase & {
  type: 'features';
  title?: string;
  items: {
    icon?: string;
    title: string;
    body?: string;
    link?: string;
    imageUrl?: string;
    imageSize?: 'sm' | 'md' | 'lg'; // image size presets
    meta?: FeatureMeta[];   // ← was `{}`; now structured array
  }[];
};

export type CTASection = SectionBase & {
  type: 'cta';
  title: string;
  body?: string;
  cta: { label: string; href: string };
};

export type NewsletterSection = SectionBase & {
  type: 'newsletter';
  title?: string;
  body?: string;
  googleFormEmbedUrl: string; // prefill URL
};

export type ContactSection = SectionBase & {
  type: 'contact';
  title?: string;
  email?: string;
  phone?: { label: string; href: string };
  address?: string;
  mapEmbedUrl?: string;
  backgroundUrl?: string; // optional background image
  socials?: { label: string; href: string; customIcon?: IconDefinition }[];
};

export type SchedulingSection = SectionBase & {
  type: 'scheduling';
  title?: string;
  body?: string;
  calendlyUrl: string; // https://calendly.com/username
};

export type FooterSection = SectionBase & {
  type: 'footer';
  columns?: { title?: string; links: { label: string; href: string }[] }[];
  legal?: string;
};

export type SectionalSection = SectionBase & {
  id: string;
  type: 'sectional';
  title: string;
  body?: string;
  backgroundUrl?: string;   // accepts /public path or external URL
  overlay?: boolean;        // tint overlay for contrast
  align?: 'left' | 'center' | 'right';
  height?: 'xs' | 'sm' | 'md' | 'lg' | 'full'; // hero height presets
  motion?: {
    direction?: 'x' | 'y';
    offset?: number;      // px
    duration?: number;    // seconds
  };
};



export type SiteConfig = {
  theme: SiteStyle;
  sections: AnySection[];
  meta?: { title?: string; description?: string; favicon?: string };
};


export type TestimonialItem = {
  quote: string;
  name: string;
  role?: string;
  avatarUrl?: string; // optional
};

export type TestimonialsStyle = {
  variant?: 'card' | 'ink' | 'carousel';   // ink = deep, primary-colored cards
  columns?: 2 | 3;            // default responsive cols
  showQuoteIcon?: boolean;    // default true
  rounded?: 'lg' | 'xl' | '2xl';
  background?: 'default' | 'band'; // band -> subtle tinted section bg
};

export type TestimonialsSection = SectionBase & {
  type: 'testimonials';
  title?: string;
  subtitle?: string;
  items: TestimonialItem[];
  style?: TestimonialsStyle;
};
export type StatItem = {
  value: number;        // 10_000_000
  label: string;        // "Users"
  prefix?: string;      // "$", "~"
  suffix?: string;      // "+", "%", "k"
  decimals?: number;    // how many decimals to show when animating
};

export type StatsStyle = {
  align?: 'left' | 'center';     // text alignment
  columns?: 2 | 3 | 4;           // grid columns (responsive adjusts)
  compact?: boolean;             // smaller spacing/typography
  divider?: 'none' | 'dot' | 'line';
  color?: 'default' | 'accent' | 'primary'; // number color
};

export type StatsSection = SectionBase & {
  type: 'stats';
  title?: string;
  subtitle?: string;
  items: StatItem[];
  style?: StatsStyle;
};
export type SkillItem = {
  title: string;
  body?: string;
  imageUrl?: string;   // optional icon/logo/photo
};

export type SkillsSection = SectionBase & {
  id: string;
  type: 'skills';
  title?: string;
  subtitle?: string;
  items: SkillItem[];
  columns?: 2 | 3 | 4; // grid columns (default 3)
};
export type PricingPlan = {
    name: string;
    price?: string;
    period?: string;
    description?: string;
    features?: string[];
    cta?: { label?: string; href?: string };
    featured?: boolean;
    badge?: string;
};

export type PricingSection = SectionBase & {
  id: string;
  type: 'pricing';
  title?: string;
  subtitle?: string;
  plans: PricingPlan[];
};
export type ShareItem = {
  /** URL to encode in QR. If omitted, use current site URL */
  value?: string;
  /** Optional label under the QR code */
  label?: string;
  /** Optional size in px (default 220) */
  size?: number;
};

export type ShareStyle = {
  /** layout variant */
  variant?: 'default' | 'band'; // band = tinted bg
  /** alignment of text & QR code */
  align?: 'left' | 'center';
  /** whether to show action buttons (copy/share/download) */
  actions?: boolean;
};

export type ShareSection = SectionBase & {
  id: string;
  type: 'share';
  title?: string;
  subtitle?: string;
  /** one or more QR codes */
  items: ShareItem[];
  style?: ShareStyle;
  value?: string;
  /** QR code size in pixels */
  size?: number; // default 220
  /** Add a CTA button to open the link (useful on desktop for preview) */
  showOpen?: boolean;
};

export type PartnerLink = {
  type: 'instagram' | 'facebook' | 'linkedin' | 'website' | 'youtube' | 'tiktok' | 'linktree';
  href: string;
  customLabel?: string;
};

export type PartnerItem = {
  name: string;
  description?: string;
  logoUrl?: string;
  links?: PartnerLink[];
};

export type PartnersStyle = {
  variant?: 'cards' | 'grid';
  columns?: 2 | 3 | 4;
  rounded?: 'lg' | 'xl' | '2xl';
  background?: 'default' | 'band';
};

export type PartnersSection = SectionBase & {
  id: string;
  type: 'partners';
  title?: string;
  subtitle?: string;
  items: PartnerItem[];
  style?: PartnersStyle;
};

export type InstagramItem = {
  url: string; // permalink to a post or reel
};

// Section config for Instagram embeds
export type InstagramSection = SectionBase & {
  id: string;
  type: 'instagram';
  title?: string;
  subtitle?: string;
  items: InstagramItem[];           // pass one or more items
  align?: 'left' | 'center';        // heading alignment
  maxWidth?: number;                // px; default 640
  rounded?: 'lg' | 'xl' | '2xl';    // rounded corners for embeds
  columns?: 1 | 2 | 3;              // grid columns when multiple
  orientation?: 'profile' | 'landscape'; // NEW
};
export type GalleryItem = {
  imageUrl: string;
  alt?: string;
  caption?: string;
};

export type GalleryStyle = {
  rounded?: 'lg' | 'xl' | '2xl';
  columns?: 2 | 3 | 4 | 5;
  gap?: 'sm' | 'md' | 'lg';
};

export type GallerySource =
  | { type: 'static'; items: GalleryItem[] }
  | {
      type: 's3';
      bucket?: string;       // defaults from env
      prefix?: string;       // e.g. "carole/gallery/"
      region?: string;       // defaults from env
      cdnBase?: string;      // e.g. CloudFront domain (optional)
      limit?: number;        // optional cap
      recursive?: boolean;   // default true
    };

export type GallerySection = SectionBase & {
  id: string;
  type: 'gallery';
  title?: string;
  subtitle?: string;
  style?: GalleryStyle;
  backgroundClass?: string;
  /** choose either source or items for backwards-compat */
  source?: GallerySource;
  items?: GalleryItem[];
};
export type SocialItem = {
  type:
    | 'instagram'
    | 'facebook'
    | 'linkedin'
    | 'x'
    | 'youtube'
    | 'tiktok'
    | 'email'
    | 'website';
  href: string; // mailto: allowed for email
  label?: string; // optional label under icon
};

export type SocialsSection = SectionBase & {
  id?: string;
  type?: 'socials';
  title?: string;
  subtitle?: string;
  items: SocialItem[];
  style?: {
    background?: 'default' | 'band';
    rounded?: 'lg' | 'xl' | '2xl';
    size?: 'sm' | 'md' | 'lg'; // icon button size
    gap?: 'sm' | 'md' | 'lg';
    align?: 'left' | 'center';
  };
};
// ---- Video section types ----
export type VideoSourceUrl = {
  type: 'url';
  href: string;                 // YouTube/Vimeo page or direct mp4
};

export type VideoSourceLocal = {
  type: 'local';
  path: string;                 // e.g., "/videos/intro.mp4" or imported asset src
};

export type VideoSourceS3 = {
  type: 's3';
  key: string;                  // e.g., "configs/carole/videos/intro.mp4"
  bucket?: string;              // optional override; defaults to S3_DEFAULT_BUCKET
  cdnBase?: string;             // optional override; defaults to NEXT_PUBLIC_S3_CDN_BASE
};

export type VideoSource = VideoSourceUrl | VideoSourceLocal | VideoSourceS3;

export type VideoStyle = {
  aspect?: '16/9' | '9/16' | '4/3' | '1/1';
  rounded?: 'lg' | 'xl' | '2xl';
  shadow?: 'sm' | 'md' | 'lg' | 'none';
  background?: 'default' | 'band';
};

export type VideoSection = SectionBase & {
  id: string;
  type: 'video';
  title?: string;
  subtitle?: string;
  source: VideoSource;
  posterUrl?: string;           // optional poster image (can be S3 key or full URL)
  controls?: boolean;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  style?: VideoStyle;
};

export type Money = {
  amount: number;        // 1999 (cents) or 19.99 as number — choose one style; below we assume cents
  currency?: string;     // 'USD' default
};

export type ProductImage = {
  url: string;           // full URL or S3 key resolved at render
  alt?: string;
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductColor = { name: string; hex?: string; imageUrl?: string };
export type ProductSize  = { label: string; value?: string };


export type Product = {
  id: string;            // stable id/slug
  name: string;
  subtitle?: string;
  sku?: string;

  // pricing (use cents to avoid float issues)
  price: number;         // e.g. 2999 == $29.99
  compareAtPrice?: number;
  currency?: string;     // default 'USD'

  thumbnailUrl?: string;
  images?: ProductImage[];

  summary?: string;      // short blurb
  description?: string;  // long description (markdown/plain)

  features?: string[];   // bullet points
  specs?: ProductSpec[]; // table

  badges?: string[];     // e.g. "New", "Bestseller"
  tags?: string[];

  stock?: 'in_stock' | 'low_stock' | 'out_of_stock';
  quantityAvailable?: number;

  digital?: boolean;     // digital product?
  weightKg?: number;
  widthCm?: number;
  heightCm?: number;
  depthCm?: number;
  shippingClass?: string;

  // where Buy Now leads (until payments are integrated)
  purchaseUrl?: string;  // external checkout or link
  ctaLabel?: string;     // default "Buy Now"
  
   colors?: ProductColor[];
  sizes?: ProductSize[];           // e.g. ['S','M','L','XL']
  maxQuantity?: number;          // default 10
};

export type ProductListingsStyle = {
  columns?: 1 | 2 | 3;           // default responsive columns, desktop cap at 3
  cardVariant?: 'default' | 'ink';
  showBadges?: boolean;
};

export type ProductListingsSection = SectionBase & {
  id: string;
  type: 'productListings';
  title?: string;
  subtitle?: string;
  products: Product[];
  style?: ProductListingsStyle;
  showAllThreshold?: number;     // default 3 — show "Show all" if > threshold
  buyCtaFallback?: string;       // default "Buy Now"
};

export type PersonItem = {
  name: string;
  title?: string;              // e.g., "CEO", "Senior Developer", "Mentor"
  description?: string;        // bio or description
  avatarUrl?: string;          // image URL
  badges?: string[];           // qualifications, labels, certifications
};

export type PersonsStyle = {
  columns?: 2 | 3 | 4;        // grid columns (default responsive)
  cardVariant?: 'default' | 'ink'; // card style
  rounded?: 'lg' | 'xl' | '2xl';   // rounded corners
  align?: 'left' | 'center';       // text alignment
};

export type PersonsSection = SectionBase & {
  id: string;
  type: 'persons';
  title?: string;              // header
  subtitle?: string;           // description
  items: PersonItem[];
  style?: PersonsStyle;
};
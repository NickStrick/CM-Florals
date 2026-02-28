// src/mocks/chellesConfig.ts
import type { SiteConfig } from "@/types/site";

const etsyShopHref =
  "https://www.etsy.com/shop/ChellesFiberCrafts?ref=shop-header-name&listing_id=1745550181&from_page=listing";

  import booth from "../../public/carole/booth.jpg";
  import flower2 from "../../public/carole/flower2.png";
  import flower3 from "../../public/carole/cmFlower.jpg";
  import flower4 from "../../public/carole/flower4.png";
  import flower5 from "../../public/carole/flower5.png";
  import flower6 from "../../public/carole/flower6.png";
  import flower7 from "../../public/carole/flower7.png";
  import flower8 from "../../public/carole/flower8.png";
  import flowerwall2 from "../../public/carole/flowerwall2.jpg";
  import flowerwall3 from "../../public/carole/flowerwall3.jpg";

export const mockSiteConfig: SiteConfig = {
  theme: { preset: "lavender", radius: "xl" },

  meta: {
    title: "Chelle's Fiber Crafts — Knit & Crochet",
    description: "Knit and Crochet Apparel Plushies and more!",
    // You can also use an Etsy image as favicon if you want:
    // favicon: "https://i.etsystatic.com/47599280/r/il/4a4927/6276586701/il_300x300.6276586701_jyp4.jpg",
  },

  settings: {
    general: {
      businessDisplayName: "Chelle's Fiber Crafts",
      businessNotificationEmail: "orders@chellesfibercrafts.com", // TODO: replace
    },

    payments: {
      cartActive: true,

      // ✅ matches your type: 'converge' | 'clover' | 'externalLink'
      // Until direct payments are integrated, you can run checkout using an external link:
      paymentType: "externalLink",

      supportEmail: "support@chellesfibercrafts.com", // TODO: replace
      supportPhone: {
        label: "Email support",
        href: "mailto:support@chellesfibercrafts.com",
      },

      taxes: {
        enabled: false,
        ratePercent: 0,
        taxShipping: false,
        defaultProductTaxable: true,
      },

      delivery: {
        enabled: true,
        type: "flat",
        flatFeeCents: 0, // TODO: set shipping
        mode: "delivery",
        addressCapture: {
          enabled: true,
          required: true,
          // ✅ matches: 'googleForm' | 's3'
          method: "s3",
          s3Prefix: "orders/chelles-fiber-crafts/",
        },
      },

      checkoutInputs: [
        {
          id: "customer-name",
          label: "Name",
          type: "text",
          required: true,
          placeholder: "Your full name",
        },
        {
          id: "customer-email",
          label: "Email",
          type: "email",
          required: true,
          placeholder: "you@example.com",
        },
        {
          id: "customer-phone",
          label: "Phone",
          type: "tel",
          required: false,
          placeholder: "(555) 555-5555",
        },
        {
          id: "special-instructions",
          label: "Special Instructions",
          type: "textarea",
          required: false,
          placeholder: "Color requests, gift note, sizing notes, etc.",
        },
      ],
    },
  },

  sections: [
    // ======================
    // HEADER
    // ======================
    {
      visible: true,
      id: "hdr",
      type: "header",
      logoText: "Chelle's Fiber Crafts",
      // external URL ok (string)
      logoImage:
        "https://i.etsystatic.com/47599280/r/il/4a4927/6276586701/il_300x300.6276586701_jyp4.jpg",
      links: [
        { label: "Home", href: "#top" },
        { label: "Products", href: "#products" },
        { label: "About", href: "#about" },
        { label: "Testimonials", href: "#testimonials" },
        { label: "Etsy", href: etsyShopHref },
      ],
      cta: { label: "Shop Now", href: "#products" },
      style: { sticky: true, blur: true, elevation: "sm", transparent: false },
    },

    // ======================
    // HERO
    // ======================
    {
      visible: true,
      id: "hero",
      type: "hero",
      eyebrow: "Knit • Crochet • Plushies",
      title: "Handmade Knit & Crochet Gifts",
      subtitle: "Knit and Crochet Apparel Plushies and more!",
      primaryCta: { label: "Shop Products", href: "#products" },
      secondaryCta: { label: "View Etsy Shop", href: etsyShopHref },
      // Using one of the Etsy listing images as hero
      imageUrl:
        "https://i.etsystatic.com/47599280/r/il/d491cd/6351032865/il_1000x1000.6351032865_eiz7.jpg",
    },

    // ======================
    // PRODUCTS
    // ======================
    {
      visible: true,
      id: "products",
      type: "productListings",
      title: "Products",
      subtitle: "Buy directly from our website (no need to rely solely on Etsy).",
      style: { columns: 3, cardVariant: "default", showBadges: true },
      showAllThreshold: 7,
      buyCtaFallback: "Buy On Etsy",
      viewType: "featured",

      products: [
        {
          id: "cfc-giant-octopus-1731259768",
          name: 'Giant Octopus Plushie (Approx. 32")',
          subtitle: "Made to order crochet octopus",
          sku: "CFC-OCTO-32",
          price: 12500,
          currency: "USD",
          thumbnailUrl:
            "https://i.etsystatic.com/47599280/r/il/d491cd/6351032865/il_600x600.6351032865_eiz7.jpg",
          images: [
            {
              url: "https://i.etsystatic.com/47599280/r/il/d491cd/6351032865/il_1000x1000.6351032865_eiz7.jpg",
              alt: "Giant Octopus Plushie",
            },
          ],
          summary: "A huge, super-soft plush crochet octopus.",
          description:
            'Made-to-order plush crochet octopus, approx. 32". Great as statement plush, cozy accessory, or decor.',
          features: ["Made to order", 'Approx. 32" plush', "Handmade crochet"],
          badges: ["Made to Order"],
          stock: "in_stock",
          quantityAvailable: 99,
          purchaseUrl:
            "https://www.etsy.com/listing/1731259768/giant-octopus-plushie-made-to-order",
          ctaLabel: "Buy On Etsy",
          maxQuantity: 3,
          taxable: true,
        },

        {
          id: "cfc-bucket-hat-1745550181",
          name: "Colorful Granny-Stitch Bucket Hat",
          subtitle: "Cotton",
          sku: "CFC-HAT-GRANNY",
          price: 3000,
          currency: "USD",
          thumbnailUrl:
            "https://i.etsystatic.com/47599280/r/il/4a4927/6276586701/il_600x600.6276586701_jyp4.jpg",
          images: [
            {
              url: "https://i.etsystatic.com/47599280/r/il/4a4927/6276586701/il_1000x1000.6276586701_jyp4.jpg",
              alt: "Colorful Granny-Stitch Bucket Hat",
            },
          ],
          summary: "A bright, comfy bucket hat with granny-stitch style.",
          description:
            "Handmade cotton bucket hat — colorful, breathable, and perfect for everyday wear.",
          features: ["Handmade", "Cotton", "Lightweight"],
          badges: ["Popular"],
          stock: "in_stock",
          quantityAvailable: 99,
          purchaseUrl:
            "https://www.etsy.com/listing/1745550181/colorful-granny-stitch-bucket-hat-cotton",
          ctaLabel: "Buy On Etsy",
          maxQuantity: 5,
          taxable: true,
        },

        {
          id: "cfc-measuring-tape-4451319358",
          name: "Floral Retractable Measuring Tape",
          subtitle: "For tailors, crafters, and more",
          sku: "CFC-TAPE-FLORAL",
          price: 1495,
          currency: "USD",
          thumbnailUrl:
            "https://i.etsystatic.com/47599280/r/il/c35028/7668339386/il_600x600.7668339386_aqwy.jpg",
          images: [
            {
              url: "https://i.etsystatic.com/47599280/r/il/c35028/7668339386/il_1000x1000.7668339386_aqwy.jpg",
              alt: "Floral retractable measuring tape",
            },
          ],
          summary: "Cute + functional retractable measuring tape.",
          description:
            "A handy measuring tape with an adorable floral design — great for sewing, crafting, and fiber projects.",
          features: ["Retractable", "Giftable", "Craft essential"],
          stock: "in_stock",
          quantityAvailable: 99,
          purchaseUrl: "https://www.etsy.com/listing/4451319358/adorable-and-functional-floral",
          ctaLabel: "Buy On Etsy",
          maxQuantity: 10,
          taxable: true,
        },

        {
          id: "cfc-penguin-4417600167",
          name: 'Penguin Plushie (Approx. 10")',
          subtitle: "Handmade crocheted animal",
          sku: "CFC-PENG-10",
          price: 2000,
          currency: "USD",
          thumbnailUrl:
            "https://i.etsystatic.com/47599280/r/il/54b7ee/7679115734/il_600x600.7679115734_a0ug.jpg",
          images: [
            {
              url: "https://i.etsystatic.com/47599280/r/il/54b7ee/7679115734/il_800x800.7679115734_a0ug.jpg",
              alt: "Penguin plushie",
            },
          ],
          summary: "A cute penguin plushie — soft, squishy, and handmade.",
          description: "Handmade crocheted penguin plushie, approx. 10\".",
          features: ["Handmade crochet", 'Approx. 10"', "Gift ready"],
          badges: ["Only 1 left"],
          stock: "low_stock",
          quantityAvailable: 1,
          purchaseUrl: "https://www.etsy.com/listing/4417600167/penguin-plushie-approx-10-plush-handmade",
          ctaLabel: "Buy On Etsy",
          maxQuantity: 1,
          taxable: true,
        },

        {
          id: "cfc-earwarmer-1738667986",
          name: "Handmade Striped Knit Earwarmer",
          subtitle: "Acrylic adult size",
          sku: "CFC-EAR-STRIPE",
          price: 2000,
          currency: "USD",
          thumbnailUrl:
            "https://i.etsystatic.com/47599280/r/il/da28c6/6476802206/il_600x600.6476802206_7led.jpg",
          images: [
            {
              url: "https://i.etsystatic.com/47599280/r/il/da28c6/6476802206/il_800x800.6476802206_7led.jpg",
              alt: "Striped knit earwarmer",
            },
          ],
          summary: "Cozy earwarmer for chilly days — comfy and stylish.",
          description: "Handmade striped knit earwarmer designed for comfort.",
          features: ["Handmade knit", "Warm + comfy"],
          stock: "in_stock",
          quantityAvailable: 99,
          purchaseUrl:
            "https://www.etsy.com/listing/1738667986/handmade-striped-knit-earwarmer-acrylic",
          ctaLabel: "Buy On Etsy",
          maxQuantity: 5,
          taxable: true,
        },

        {
          id: "cfc-winter-beanie-1820740853",
          name: "Knit Winter Beanie (Removable Pom)",
          subtitle: "Custom colors available",
          sku: "CFC-BEANIE-POM",
          price: 3000,
          compareAtPrice:50000,
          currency: "USD",
          thumbnailUrl:
            "https://i.etsystatic.com/47599280/r/il/566b46/6452090011/il_600x600.6452090011_lqo1.jpg",
          images: [
            {
              url: "https://i.etsystatic.com/47599280/r/il/566b46/6452090011/il_800x800.6452090011_lqo1.jpg",
              alt: "Knit winter beanie with removable pom",
            },
          ],
          summary: "Warm winter beanie with a removable pom.",
          description: "Handmade knit beanie with removable pom. Custom colors available.",
          features: ["Removable pom", "Custom colors", "Handmade knit"],
          badges: ["Custom"],
          stock: "in_stock",
          quantityAvailable: 99,
          purchaseUrl:
            "https://www.etsy.com/listing/1820740853/knit-winter-beanie-w-removable-pom",
          ctaLabel: "Buy On Etsy",
          maxQuantity: 5,
          taxable: true,
        },

        {
          id: "cfc-scrubbies-1811614163",
          name: "Reusable Cotton Scrubbies",
          subtitle: "Face, body, dishes, and more",
          sku: "CFC-SCRUB-COTTON",
          price: 99,
          currency: "USD",
          thumbnailUrl:
            "https://i.etsystatic.com/47599280/r/il/635629/6406841365/il_600x600.6406841365_c3f4.jpg",
          images: [
            {
              url: "https://i.etsystatic.com/47599280/r/il/635629/6406841365/il_800x800.6406841365_c3f4.jpg",
              alt: "Reusable cotton scrubbies",
            },
          ],
          summary: "Eco-friendly scrubbies for home + self care.",
          description:
            "Reusable cotton scrubbies for skincare routines, cleaning, and everyday tasks.",
          features: ["Reusable", "Cotton", "Multi-use"],
          stock: "in_stock",
          quantityAvailable: 99,
          purchaseUrl:
            "https://www.etsy.com/listing/1811614163/reusable-cotton-scrubbies-for-face-body",
          ctaLabel: "Buy On Etsy",
          maxQuantity: 20,
          taxable: true,
        },
      ],
    },

    // ======================
    // FEATURES
    // ======================
    {
      visible: true,
      id: "features",
      type: "features",
      title: "What you'll find here",
      items: [
        {
          title: "Plushies & Amigurumi",
          body: "Handmade crochet plushies designed to be hugged, gifted, and displayed.",
          imageUrl:
            "https://i.etsystatic.com/47599280/r/il/d491cd/6351032865/il_800x800.6351032865_eiz7.jpg",
        },
        {
          title: "Knit + Crochet Apparel",
          body: "Beanies, earwarmers, hats, and cozy wearables made with care.",
          imageUrl:
            "https://i.etsystatic.com/47599280/r/il/566b46/6452090011/il_800x800.6452090011_lqo1.jpg",
        },
        {
          title: "Tools & Giftables",
          body: "Cute, useful craft tools and small add-on gifts.",
          imageUrl:
            "https://i.etsystatic.com/47599280/r/il/c35028/7668339386/il_800x800.7668339386_aqwy.jpg",
        },
      ],
    },

    // ======================
    // ABOUT
    // ======================
    {
      visible: true,
      id: "about",
      type: "about",
      title: "About Chelle's Fiber Crafts",
      body:
        "Chelle’s Fiber Crafts creates handmade knit and crochet items — cozy apparel, plushies, and practical gifts. Every item is made with attention to detail and a love for fiber art.",
      imageUrl:
        "https://i.etsystatic.com/47599280/r/il/4a4927/6276586701/il_600x600.6276586701_jyp4.jpg",
      bullets: ["Handmade in the United States", "Knit + crochet wearables", "Plushies + giftable items"],
      align: "left",
    },

    // ======================
    // TESTIMONIALS (from provided review text)
    // ======================
    {
      visible: true,
      id: "testimonials",
      type: "testimonials",
      title: "Customer Reviews",
      subtitle: "Feedback from Etsy customers",
      bottomWaveType: "1-hill",
      topWaveType: "1-hill",
      items: [
        {
          quote:
            "Amazing timing! Really comfortable and looks great! Thanks for warming up the holidays :)",
          name: "Kent",
          role: "Customer",
        },
        {
          quote:
            "The craftsmanship is exceptional—each stitch is perfectly placed, and the texture is so soft and comfortable. It fits wonderfully and stays in place all day.",
          name: "Brittney",
          role: "Customer",
        },
        {
          quote:
            "I LOVE my octopus so much. It’s so soft and plushy definitely some good quality stuff. Very good sizing too!",
          name: "Donald",
          role: "Customer",
        },
      ],
      style: { variant: "carousel", columns: 2, showQuoteIcon: true, rounded: "xl", background: "band" },
    },
     {
  visible: true,
  id: "gallery",
  type: "gallery",
  title: "Previous Work",
  subtitle: "bouquets, gifts and event florals",
  style: { columns: 4, rounded: "xl", gap: "md" },
  backgroundClass: 'bg-gradient-2',
  // NEW: load dynamically from S3
  // source: {
  //   type: "s3",
  //   // bucket: "my-bucket-name",
  //   prefix: "configs/carole/assets/",
  //   // region: "us-east-2",
  //   // cdnBase: "https://dxxxxx.cloudfront.net",
  //   limit: 200,
  //   recursive: true,
  // },
    items: [
      { imageUrl: booth.src,        alt: "Booth display" },
      { imageUrl: flowerwall3.src,  alt: "Flower wall 3" },
      { imageUrl: flowerwall2.src,  alt: "Flower wall 2" },
      
      { imageUrl: flower8.src,      alt: "Arrangement 7" },
      
      { imageUrl: flower2.src,      alt: "Arrangement 1" },
      
      { imageUrl: flower3.src,      alt: "Arrangement 2" },
      { imageUrl: flower4.src,      alt: "Arrangement 3" },
      { imageUrl: flower5.src,      alt: "Arrangement 4" },
      { imageUrl: flower6.src,      alt: "Arrangement 5" },
      { imageUrl: flower7.src,      alt: "Arrangement 6" },
    
      
    //   { imageUrl: flower11.src,      alt: "Arrangement 11" },
    //   { imageUrl: flower9.src,      alt: "Arrangement 9" },
    //   {imageUrl: logo2.src,      alt: "Arrangement 0" },
    //   { imageUrl: flower10.src,      alt: "Arrangement 10" },
    //   { imageUrl: fallDecor1.src,      alt: "fall decor" },
    //   { imageUrl: fallDecor2.src,      alt: "fall decor alt" },
    //   { imageUrl: flowerwall.src,   alt: "Flower wall" },
        
    //   { imageUrl: flowertable2.src, alt: "Table setup" },
    ],
    bottomWaveType: "1-hill",
    
},
 {
  visible: true,
  id: "gallery2",
  type: "gallery",
  title: "Sourced from local Organic farms",
  subtitle: "",
  style: { columns: 4, rounded: "xl", gap: "md" },
  backgroundClass: 'bg-gradient-2',
  // NEW: load dynamically from S3
  // source: {
  //   type: "s3",
  //   // bucket: "my-bucket-name",
  //   prefix: "configs/carole/assets/",
  //   // region: "us-east-2",
  //   // cdnBase: "https://dxxxxx.cloudfront.net",
  //   limit: 200,
  //   recursive: true,
  // },
    items: [
      { imageUrl: booth.src,        alt: "Booth display" },
      { imageUrl: flowerwall3.src,  alt: "Flower wall 3" },
      { imageUrl: flowerwall2.src,  alt: "Flower wall 2" },
      
      { imageUrl: flower8.src,      alt: "Arrangement 7" },
    ],
    bottomWaveType: "1-hill",
    
},
{
  visible: true,
  id: "socials",
  type: "socials",
  title: "Connect With Me",
  subtitle: "Want to collaborate? Follow or message me.",
  items: [
    { type: "instagram", href: '#', label: "Instagram" },
    { type: "tiktok", href: '#', label: "TikTok"  },
    { type: "facebook",  href: '#' ,   label: "Facebook" },
    { type: "linkedin",  href: '#',     label: "LinkedIn" },
    
  ],
  style: { background: "band", rounded: "xl", size: "lg", gap: "md", align: "center" }
},

    {
      visible: true,
      id: "book",
      type: "cta",
      title: "Ready to start?",
      body:
        "Checkout our etsy page",
      cta: { label: "Shop on etsy", href: '' },
    },


    // ======================
    // CONTACT
    // ======================
    {
      visible: true,
      id: "contact",
      type: "contact",
      title: "Contact",
      email: "support@chellesfibercrafts.com", // TODO: replace
      address: "United States",
      socials: [{ label: "Etsy", href: etsyShopHref }],
    },

    // ======================
    // SHARE
    // ======================
    {
        // topWaveType: "1-hill",
        // backgroundClass: 'bg-gradient',
      visible: true,
      id: "share",
      type: "share",
      title: "Share this site",
      subtitle: "Send to a friend or scan on your phone.",
      style: { variant: "band", align: "center", actions: true },
      items: [{ label: "Website (this page)" }],
    },

    // ======================
    // FOOTER
    // ======================
    {
      visible: true,
      id: "ftr",
      type: "footer",
      columns: [
        {
          title: "Explore",
          links: [
            { label: "Home", href: "#top" },
            { label: "Products", href: "#products" },
            { label: "About", href: "#about" },
            { label: "Reviews", href: "#testimonials" },
            { label: "Contact", href: "#contact" },
          ],
        },
        {
          title: "Shop",
          links: [
            { label: "Etsy Shop", href: etsyShopHref },
            { label: "Email Support", href: "mailto:support@chellesfibercrafts.com" },
          ],
        },
      ],
      legal: "© 2026 Chelle's Fiber Crafts. All rights reserved.",
    },
  ],
};

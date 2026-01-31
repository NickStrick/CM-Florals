// src/mocks/caroleConfig.ts
import type { SiteConfig } from "@/types/site";

// ---- Image imports ----           // Hero/banner image
import booth from "../../public/carole/booth.jpg";
import cart from "../../public/carole/cart.png";
import flower2 from "../../public/carole/flower2.png";
import flower3 from "../../public/carole/cmFlower.jpg";
import flower4 from "../../public/carole/flower4.png";
import flower5 from "../../public/carole/flower5.png";
import flower6 from "../../public/carole/flower6.png";
import flower7 from "../../public/carole/flower7.png";
import flower8 from "../../public/carole/flower8.png";
import flower9 from "../../public/carole/flower9.jpg";
import flower10 from "../../public/carole/flower10.jpg";
import flower11 from "../../public/carole/flower11.jpg";
import flowertable from "../../public/carole/flowertable.jpg";
import flowertable2 from "../../public/carole/flowertable2.jpg";
import flowerwall from "../../public/carole/flowerwall.jpg";
import flowerwall2 from "../../public/carole/flowerwall2.jpg";
import flowerwall3 from "../../public/carole/flowerwall3.jpg";
import fallDecor1 from "../../public/carole/fallDecor1.jpg";
import fallDecor2 from "../../public/carole/fallDecor2.jpg";
import logoMain from "../../public/carole/booth.jpg";
import logoWhite from "../../public/carole/logo-main.jpg";
import logo2 from "../../public/carole/logo2.png";
import carole from "../../public/carole/carole2.jpg";

import productItem1 from "../../public/carole/products/flower1.jpg";
import productItem2 from "../../public/carole/products/flower2.jpg";
import productItem3 from "../../public/carole/products/flower3.jpg";
import productItem4 from "../../public/carole/products/flower4.jpg";
import productItem5 from "../../public/carole/products/flower5.jpg";
import productItem6 from "../../public/carole/products/flower6.png";
import productItem7 from "../../public/carole/products/flower7.jpg";
import productItem8 from "../../public/carole/products/flower8.png";
import productItem9 from "../../public/carole/products/flower9.png";
import productItem10 from "../../public/carole/products/flower10.png";

import review1 from "../../public/carole/reveiw1.png"
import review2 from "../../public/carole/review2.png"

const phoneHref = "tel:17732094805";
const tiktokHref = "https://www.tiktok.com/@carolemurray87_group7?is_from_webapp=1&sender_device=pc";
const instagramHref = "https://www.instagram.com/cm_florals/";
const facebookHref = "https://www.facebook.com/carole.murray.370/";
const linkedinHref = "https://www.linkedin.com/in/carole-murray-61458b20a/";

export const mockSiteConfig: SiteConfig = {
  theme: { preset: "lavender", radius: "xl" },
  meta: {
    title: "CM Florals — Floral Design & Gifts",
    description:
      "CM Florals creates joyful floral design for weddings, holidays, celebrations and everyday gifting across Chicago. Founding Florist Carole Murray.",
    favicon: logo2.src,
  },
  sections: [
    // HEADER
    {
      visible: true,
      id: "hdr",
      type: "header",
      logoText: "CM Florals",
      logoImage: logoWhite.src,
      links: [
        { label: "Home", href: "#top" },
        {label: "Products", href: "#products"},
        { label: "About", href: "#create" },
        { label: "Previous Work", href: "#gallery" },
        { label: "Testimonials", href: "#testimonials" },
        { label: "Contact", href: "#contact" },
        { label: "Pay", href: "#pay" },
      ],
      cta: { label: "Order Now", href: '#products' },
      style: { sticky: true, blur: true, elevation: "sm", transparent: false },
    },

    // HERO
    {
      visible: true,
      id: "hero",
      type: "hero",
      eyebrow: "CM Florals • Floral Design • Gifts",
      title: "Floral Design and Gifts for Chicago",
      subtitle:
        "Custom florals for celebrations, weddings, holidays, and everyday gifting. Crafted with warmth and color to fit your story. Founded by Carole Murray.",
      primaryCta: { label: "Order Now", href: '#products' },
      // secondaryCta: { label: "DM on Insta or Tiktok", href: "#socials" },
       secondaryCta: { label: "Find us at Ogilvie / Accenture Tower", href: "#contact" },
      imageUrl: logoMain.src,
    },
{
      visible: true,
      id: "products",
      type: "productListings",
      title: "Valentines Arrangements",
      subtitle: "Handcrafted florals — pickup at Ogilvie / Accenture Tower",
      style: { columns: 3, cardVariant: "default", showBadges: true },
      showAllThreshold: 20,
      buyCtaFallback: "Buy Now",
      cartActive: true,
      paymentType: "externalLink",
      googleFormOptions:{
        addItemToGForm: true,
        itemsEntryId: "entry.918647669",
        totalEntryId: "entry.65280150",
      },
      
      externalPaymentUrl: "https://venmo.com/u/Carole-Murray-9",
      googleFormUrl: 'https://docs.google.com/forms/d/1NgHLz-cE-xzqcehqCNcr9C-OLnxzbo2kz1147S5rMWQ/formResponse',
      checkoutInputs:[{
        id: "customer-name",
        label: "Name",
        type: "text",
        required: true,
        placeholder: "Enter your full name",
        description: "The name of the person purchasing the arrangement.",
        googleFormEntryId: "entry.1007473156",
      },
      {
        id: "customer-phone",
        label: "Phone",
        type: "text",
        required: true,
        placeholder: "Enter your phone number",
        description: "The phone number of the person purchasing the arrangement.",
        googleFormEntryId: "entry.1090739960",
      },
      {
        id: "pickup-date",
        label: "Pick up Date and Time",
        type: "text",
        required: true,
        googleFormEntryId: "entry.299847389",
      },
      {
        id: "special-instructions",
        label: "Special Instructions",
        type: "textarea",
        placeholder: "Any special requests or notes?",
        googleFormEntryId: "entry.809680059",
      },
    ],
      products: [
        {
          id: "cmf-rose-6",
          name: "6 Rose Bouquet",
          subtitle: "Classic red roses",
          sku: "CMF-R6",
          price: 3500,
          compareAtPrice: 4500,
          currency: "USD",
          thumbnailUrl: productItem1.src,
          images: [
            { url: productItem1.src, alt: "6 Rose Bouquet 1" },
          ],
          summary: "Six long-stem roses with fresh greenery.",
          description:
            "Six red roses hand-tied with seasonal greenery for a timeless, romantic gift.",
          features: ["Seasonal blooms", "Hand-tied & vased", "Gift note included"],
          specs: [
          ],
          badges: ["Bestseller", "Valentine's Special"],
          tags: ["spring", "bright", "gift"],
          stock: "in_stock",
          quantityAvailable: 99,
          digital: false,
          weightKg: 1.2,
          widthCm: 24,
          heightCm: 36,
          depthCm: 24,
          shippingClass: "fragile",
          ctaLabel: "Buy Now",
          maxQuantity: 99,
        },
        {
          id: "cmf-rose-12",
          name: "12 Rose Bouquet",
          subtitle: "Signature dozen roses",
          sku: "CMF-R12",
          price: 6000,
          compareAtPrice: 7500,
          currency: "USD",
          thumbnailUrl: productItem2.src,
          images: [
            { url: productItem2.src, alt: "12 Rose Bouquet 1" },
          ],
          summary: "A full dozen reds in our signature wrap.",
          description:
            "Twelve red roses arranged with lush greenery for a classic, show-stopping bouquet.",
          features: ["Seasonal blooms", "Hand-tied & vased", "Gift note included"],
          specs: [
          ],
          badges: ["Bestseller", "Valentine's Special"],
          stock: "in_stock",
          quantityAvailable: 99,
          digital: false,
          shippingClass: "fragile",
          ctaLabel: "Buy Now",
          maxQuantity: 99,
        },
        {
          id: "cmf-candy-valentine",
          name: "Candy Valentine Bouquet",
          subtitle: "Sweet accents + red roses",
          sku: "CMF-CVB",
          price: 3500,
          compareAtPrice: 4000,
          currency: "USD",
          thumbnailUrl: productItem3.src,
          images: [
            { url: productItem3.src, alt: "Candy Valentine Bouquet 1" },
          ],
          summary: "A playful Valentine bouquet with sweet touches.",
          description:
            "Red roses with candy-inspired accents for a fun, festive Valentine’s surprise.",
          features: ["Seasonal blooms", "Hand-tied & vased", "Gift note included"],
          specs: [
          ],
          badges: ["Bestseller", "Valentine's Special"],
          stock: "in_stock",
          quantityAvailable: 99,
          digital: false,
          shippingClass: "fragile",
          ctaLabel: "Buy Now",
          maxQuantity: 99,
        },
        {
          id: "cmf-longstem-12",
          name: "1 Dozen Long Stem Roses",
          subtitle: "Premium long-stem roses",
          sku: "CMF-LS12",
          price: 7500,
          compareAtPrice: 8000,
          currency: "USD",
          thumbnailUrl: productItem4.src,
          images: [
            { url: productItem4.src, alt: "1 Dozen Long Stem Roses 1" },
          ],
          summary: "Elegant long-stem roses with a luxe finish.",
          description:
            "Twelve premium long-stem roses designed for an elegant, elevated presentation.",
          features: ["Seasonal blooms", "Hand-tied & vased", "Gift note included"],
          specs: [
          ],
          badges: ["Bestseller", "Valentine's Special"],
          stock: "in_stock",
          quantityAvailable: 99,
          digital: false,
          shippingClass: "fragile",
          ctaLabel: "Buy Now",
          maxQuantity: 99,
        },
        {
          id: "cmf-multicolor-12",
          name: "1 dozen multi color roses",
          subtitle: "Rainbow rose mix",
          sku: "CMF-MC12",
          price: 6500,
          compareAtPrice: 7500,
          currency: "USD",
          thumbnailUrl: productItem5.src,
          images: [
            { url: productItem5.src, alt: "1 dozen multi color roses 1" },
          ],
          summary: "A colorful dozen for a bright celebration.",
          description:
            "A dozen mixed-color roses arranged with fresh greenery for a vibrant gift.",
          features: ["Seasonal blooms", "Hand-tied & vased", "Gift note included"],
          specs: [
          ],
          badges: ["Bestseller", "Valentine's Special"],
          stock: "in_stock",
          quantityAvailable: 99,
          digital: false,
          shippingClass: "fragile",
          ctaLabel: "Buy Now",
          maxQuantity: 99,
        },
        {
          id: "cmf-mixed-6-8",
          name: "Multi Flowered Bouquet with 6-8 Flowers",
          subtitle: "Seasonal mixed bouquet",
          sku: "CMF-MX68",
          price: 4000,
          compareAtPrice: 5500,
          currency: "USD",
          thumbnailUrl: productItem6.src,
          images: [
            { url: productItem6.src, alt: "Multi Flowered Bouquet with 6-8 Flowers 1" },
          ],
          summary: "A seasonal mix of 6â€“8 blooms.",
          description:
            "A seasonal selection of 6â€“8 blooms arranged with greenery for a fresh, airy look.",
          features: ["Seasonal blooms", "Hand-tied & vased", "Gift note included"],
          specs: [
          ],
          badges: ["Bestseller", "Valentine's Special"],
          stock: "in_stock",
          quantityAvailable: 99,
          digital: false,
          shippingClass: "fragile",
          ctaLabel: "Buy Now",
          maxQuantity: 99,
        },
        {
          id: "cmf-glass-vase",
          name: "Glass Vase added to order",
          subtitle: "Add-on vase upgrade",
          sku: "CMF-VASE",
          price: 1500,
          currency: "USD",
          thumbnailUrl: productItem7.src,
          images: [
            { url: productItem7.src, alt: "Glass Vase added to order 1" },
          ],
          summary: "Upgrade any bouquet with a clear glass vase.",
          description:
            "Add a simple, elegant glass vase so your flowers arrive ready to display.",
          features: ["Seasonal blooms", "Hand-tied & vased", "Gift note included"],
          specs: [
          ],
          badges: ["Bestseller", "Valentine's Special"],
          stock: "in_stock",
          quantityAvailable: 99,
          digital: false,
          shippingClass: "fragile",
          ctaLabel: "Buy Now",
          maxQuantity: 99,
        },
        {
          id: "cmf-mixed-xl",
          name: "Extra Large Mixed Floral Bouquet ",
          subtitle: "Extra-large statement bouquet",
          sku: "CMF-MXXL",
          price: 17500,
          compareAtPrice: 19500,
          currency: "USD",
          thumbnailUrl: productItem8.src,
          images: [
            { url: productItem8.src, alt: "Extra Large Mixed Floral Bouquet  1" },
          ],
          summary: "A bold, oversized mix for big moments.",
          description:
            "An extra-large mixed bouquet designed to make a grand impression.",
          features: ["Seasonal blooms", "Hand-tied & vased", "Gift note included"],
          specs: [
          ],
          badges: ["Bestseller", "Valentine's Special"],
          stock: "in_stock",
          quantityAvailable: 99,
          digital: false,
          shippingClass: "fragile",
          ctaLabel: "Buy Now",
          maxQuantity: 99,
        },
        {
          id: "cmf-rose-36",
          name: "3 Dozen Mega Valentines Day Bouquet",
          subtitle: "Three dozen Valentineâ€™s roses",
          sku: "CMF-R36",
          price: 20000,
          compareAtPrice: 21500,
          currency: "USD",
          thumbnailUrl: productItem9.src,
          images: [
            { url: productItem9.src, alt: "3 Dozen Mega Valentines Day Bouquet  1" },
          ],
          summary: "Three dozen roses for an unforgettable gesture.",
          description:
            "Thirty-six red roses arranged lush and full for the ultimate Valentineâ€™s statement.",
          features: ["Seasonal blooms", "Hand-tied & vased", "Gift note included"],
          specs: [
          ],
          badges: ["Bestseller", "Valentine's Special"],
          stock: "in_stock",
          quantityAvailable: 99,
          digital: false,
          shippingClass: "fragile",
          ctaLabel: "Buy Now",
          maxQuantity: 99,
        },
        {
          id: "cmf-rose-24-flatback",
          name: "Dozen Roses with Flat back Dozen Roses",
          subtitle: "Two-dozen flat-back display",
          sku: "CMF-R24FB",
          price: 7000,
          compareAtPrice: 8500,
          currency: "USD",
          thumbnailUrl: productItem10.src,
          images: [
            { url: productItem10.src, alt: "Dozen Roses with Flat back Dozen Roses 1" },
          ],
          summary: "A fuller two-dozen arrangement with a flat-back design.",
          description:
            "A two-dozen rose display designed with a flat-back profile for table or wall placement.",
          features: ["Seasonal blooms", "Hand-tied & vased", "Gift note included"],
          specs: [
          ],
          badges: ["Bestseller", "Valentine's Special"],
          stock: "in_stock",
          quantityAvailable: 99,
          digital: false,
          shippingClass: "fragile",
          ctaLabel: "Buy Now",
          maxQuantity: 99,
        },

      ],
    },
    // WHAT WE CREATE
    {
      visible: true,
      id: "create",
      type: "features",
      title: "What we create",
      items: [
        {
          title: "Celebration & Event Florals",
          body:
            "Wedding parties, holidays, and special events — designed with warmth and color to fit your story.",
          imageUrl: flowertable.src,
        },
        {
          title: "Bouquets & Gifting",
          body:
            "Handcrafted bouquets and arrangements for friends and loved ones — same-day options available.",
          imageUrl: flowerwall.src,
        },
        {
          title: "Plants & Accents",
          body:
            "Potted plants, seasonal stems, and textural greenery to brighten homes and workplaces.",
          imageUrl: cart.src,
        },
      ],
    },

   {
  visible: true,
  id: 'promo',
  type: 'video',
  title: 'Introducing CM Floral Design',
  subtitle: '',
  source: { type: 'url', href: 'https://youtu.be/w_Q4mTpHzog?si=lhWk_PGVBpehZIxs' },
  // posterUrl: 'configs/carole/assets/poster.jpg', // optional (S3 key or full URL)
  style: { aspect: '16/9', rounded: 'xl', shadow: 'lg', background: 'default' },
  controls: true,
  autoplay: false,
  muted: false,
  loop: false,
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
    
      
      { imageUrl: flower11.src,      alt: "Arrangement 11" },
      { imageUrl: flower9.src,      alt: "Arrangement 9" },
      {imageUrl: logo2.src,      alt: "Arrangement 0" },
      { imageUrl: flower10.src,      alt: "Arrangement 10" },
      { imageUrl: fallDecor1.src,      alt: "fall decor" },
      { imageUrl: fallDecor2.src,      alt: "fall decor alt" },
      { imageUrl: flowerwall.src,   alt: "Flower wall" },
        
      { imageUrl: flowertable2.src, alt: "Table setup" },
    ],
    bottomWaveType: "1-hill",
},

    {
      visible: true,
      id: "floating",
      type: "sectional",
      title: "Bringing sunshine and smiles to Chicago",
      body: "Floral design that brings joy to everyday life.",
      backgroundUrl: booth.src,
      overlay: true,
      height: "md",
    },
     
     // ======================
    // TESTIMONIALS
    // ======================
    {
      visible: true,
      id: "testimonials",
      type: "testimonials",
      title: "What Customers Experience",
      topWaveType: "1-hill",
      bottomWaveType: "1-hill",
      subtitle: "We strive to help our cusomters connect with loved ones through the art of gift giving.",
      items: [
        {
          quote:
            "Carole is true artist! Even in a pinch, she arranges the most beautiful combination of flowers and colors, making every bouquet lovely and truly unique. Her flowers are fresh and long-lasting. CM is our go-to!",
          name: "Maggie Ghobrial",
          role: "Customer",
          avatarUrl: review1.src
        },
        
        {
          quote:
            "Carole makes amazing bouquets! My girlfriend loves them ❤️❤️❤️❤️",
          name: "Arnav Sinha",
          role: "Customer",
        },
        {
          quote:
            "The Love and care that Carole puts into her bouquets is apparent from their beauty, creativeness, and quality! You can expect exactly what she promises, gorgeous and creative mastery of the art of florals through decades of experience!",
          name: "Nick Stricker",
          role: "Customer & Business Partner",
          avatarUrl: review2.src
        },
        {
          quote:
            "I know very little about flowers, but I said it's my wife's birthday, I said she likes hydrangeas, set my budget, and I received an absolutely stunning bouquet a few minutes later. My wife loves them! I'm so thankful that we UP commuters have such a gifted florist at OTC!",
          name: "Jonathan Walker",
          role: "Customer",
        },
        
      ],
      style: {
        variant: "carousel",
columns: 2,
        showQuoteIcon: true,
        rounded: "xl",
        background: "band",
      },
    },
    // ABOUT FOUNDER
    {
      visible: true,
      id: "about",
      type: "about",
      title: "About the Founder — Carole Murray",
      body:
        "Grew up in the Chicago suburbs, inspired by the natural prairie fields of Illinois. I have worked in the Chicago floral industry for 45 years — from neighborhood shops to destination assignments in Las Vegas and Hawaii. I love training beginners and getting them excited to enter the world of floral design. I look at life as an opportunity to make people smile.",
      imageUrl: carole.src,
      backgroundClass: 'bg-gradient-1',
      
    },
    {
  visible: true,
  id: "socials",
  type: "socials",
  title: "Connect With Me",
  subtitle: "Want to collaborate? Follow or message me.",
  items: [
    { type: "instagram", href: instagramHref, label: "Instagram" },
    { type: "tiktok", href: tiktokHref, label: "TikTok"  },
    { type: "facebook",  href: facebookHref ,   label: "Facebook" },
    { type: "linkedin",  href: linkedinHref,     label: "LinkedIn" },
    
  ],
  style: { background: "band", rounded: "xl", size: "lg", gap: "md", align: "center" }
},

    {
      visible: true,
      id: "book",
      type: "cta",
      title: "Ready to start?",
      body:
        "Text or call to set up your event space.",
      cta: { label: "Call Now", href: phoneHref },
    },
    

    // CONTACT
    {
      visible: true,
      id: "contact",
      type: "contact",
      title: "How to Find Us",
      email: "shop@cmfloralsandgifts.com",
      address: "Ogilvie / Accenture Tower, 500 W Madison St, Chicago, IL 60661",
        phone: { label: "(773) 209-4805", href: phoneHref },
      backgroundUrl: booth.src,
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2970.4544466085986!2d-87.64308727391516!3d41.8830827712412!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e2cc71c0b855f%3A0xb098c28fb3a60491!2sOgilvie%20Transportation%20Center!5e0!3m2!1sen!2sus!4v1757250851078!5m2!1sen!2sus" ,
      socials: [
        
        { label: "LinkedIn", href: linkedinHref },
        { label: "TikTok", href: tiktokHref },
        { label: "Instagram", href: instagramHref },
        { label: "Facebook", href: facebookHref },
      ],
    },
     {
      visible: true,
      id: "pay",
      type: "cta",
      title: "Want to complete an order or make a payment?",
      body:
        "Visit our Venmo page to complete your transaction.",
      cta: { label: "Pay Now", href: "https://venmo.com/u/Carole-Murray-9" },
    },
    

    // SHARE (QR)
    {
      visible: true,
      id: "share",
      type: "share",
      title: "Share this site",
      subtitle: "Scan on your phone or send to a friend.",
      style: { variant: "band", align: "center", actions: true },
      items: [
        { label: "Website (this page)" },
      ],
      backgroundClass: "bg-gradient-2-top",
    },

    // FOOTER
    {
      visible: true,
      id: "ftr",
      type: "footer",
      columns: [
        {
          title: "Explore",
          links: [
            { label: "Home", href: "/" },
            { label: "Products", href: "#products" },
            { label: "About", href: "#create" },
            { label: "Founder", href: "#about" },
            { label: "Previous Work", href: "#gallery" },
            { label: "Testimonials", href: "#testimonials" },
            { label: "Pay", href: "#pay" },
            { label: "Contact", href: "#contact" },
          ],
        },
         {
          title: "Info",
          links: [
            { label: "CM Florals & Gifts", href: '/' },
            { label: "500 W Madison St, Chicago, IL 60661", href: "https://maps.app.goo.gl/uHEar2C6fxQPoHUo6" },
            { label: "(773) 209-4805", href: phoneHref },   
            { label: "Hours: Mon–Fri 9am–5pm", href: "#" },
          ],
        },
        {
          title: "Connect",
          links: [
            { label: "shop@cmfloralsandgifts.com", href: 'mailto:shop@cmfloralsandgifts.com' },
            { label: "Instagram", href: instagramHref },
            { label: "TikTok", href: tiktokHref },   
            { label: "LinkedIn", href: linkedinHref },
          ],
        },
      ],
       
      legal: "© 2025 CM Florals. All rights reserved.",
    },
  ],
};

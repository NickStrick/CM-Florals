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

import review1 from "../../public/carole/reveiw1.png"
import review2 from "../../public/carole/review2.png"

const phoneHref = "tel:17732094805";

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
        { label: "About", href: "#create" },
        { label: "Founder", href: "#about" },
        { label: "Contact", href: "#contact" },
        { label: "Order & Pay", href: "#pay" },
      ],
      cta: { label: "Call Now", href: phoneHref },
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
      primaryCta: { label: "Call for services", href: phoneHref },
      // secondaryCta: { label: "DM on Insta or Tiktok", href: "#socials" },
       secondaryCta: { label: "Find us at Ogilvie / Accenture Tower", href: "#contact" },
      imageUrl: logoMain.src,
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
  title: "Gallery",
  subtitle: "Selected work — bouquets and event florals",
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
          role: "Customer & Partner",
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
    { type: "instagram", href: "https://www.instagram.com/carolemurray37/", label: "Instagram" },
    { type: "tiktok", href: "https://www.tiktok.com/@carolemurray87", label: "TikTok"  },
    { type: "facebook",  href: "https://www.facebook.com/carole.murray.370/" ,   label: "Facebook" },
    { type: "linkedin",  href: "https://www.linkedin.com/in/carole-murray-61458b20a/",     label: "LinkedIn" },
    
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
        
        { label: "LinkedIn", href: "https://www.linkedin.com/in/carole-murray-61458b20a/" },
        { label: "TikTok", href: "https://www.tiktok.com/@carolemurray87" },
        { label: "Instagram", href: "https://www.instagram.com/carolemurray37/" },
        { label: "Facebook", href: "https://www.facebook.com/carole.murray.370/" },
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
            { label: "About", href: "#create" },
            { label: "Founder", href: "#about" },
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
            { label: "Instagram", href: "https://www.instagram.com/carolemurray37/" },
            { label: "TikTok", href: "https://www.tiktok.com/@carolemurray87" },   
            { label: "LinkedIn", href: "https://www.linkedin.com/in/carole-murray-61458b20a/" },
          ],
        },
      ],
      legal: "© 2025 CM Florals. All rights reserved.",
    },
  ],
};

// src/mocks/connorConfig.ts
import type { SiteConfig } from "@/types/site";

// ---- Image imports (swap with real assets when ready) ----
import hero from "../../public/connor/connorstage.jpg";        // Live on stage image
import stage1 from "../../public/connor/connorstage2.jpg";          // Band photo
import stage2 from "../../public/connor/connorcrowd.jpg";          // Band photo
import lessonsImg from "../../public/connor/connorplaying.jpg";     // Lesson image
import guitarImg from "../../public/connor/connorsmerk.jpg";       // Guitar image
import theoryImg from "../../public/connor/connorabout.jpg"; // Music theory photo
import band1Logo from "../../public/connor/band-one-logo.png"; // Band 1 logo
import band2Logo from "../../public/connor/band-two-logo.png"; // Band 2 logo

export const mockSiteConfig: SiteConfig = {
  theme: { preset: "neon", radius: "xl" },
  meta: {
    title: "Connor Murray — Stage Guitarist & Music Teacher",
    description:
      "Connor Murray is a stage guitarist and experienced music teacher in Chicago. Lessons in guitar, bass, drums, piano, ukulele & music theory.",
    favicon: "/favicon.ico",
  },
  sections: [
    // HEADER
    {
      visible: true,
      id: "hdr",
      type: "header",
      logoText: "Connor Murray",
      links: [
        { label: "Home", href: "/" },
        { label: "Experience", href: "#experience" },
        { label: "Bands", href: "#bands" },
        { label: "Lessons", href: "#instructs" },
        { label: "Contact", href: "#contact" }
      ],
      cta: { label: "Contact Me", href: "#contact" },
      style: { sticky: false, blur: true, elevation: "sm", transparent: false },
    },

    // HERO
    {
      visible: true,
      id: "hero",
      type: "hero",
      eyebrow: "Stage Guitarist • Music Teacher",
      title: "Connor Murray",
      subtitle:
        "Live performance energy meets clear, personalized music instruction.",
      primaryCta: { label: "Contact Me", href: "#contact" },
      secondaryCta: { label: "Share this site", href: "#share" },
      imageUrl: hero.src,
    },

    // EXPERIENCE (stage / bands)
    {
      visible: true,
      id: "experience",
      type: "features",
      title: "On-Stage Experience",
      items: [
        {
          title: "Lead Guitarist — Current & Past Bands",
          body:
            "Three years of stage experience as lead guitarist across several bands. Currently performing in Chicago with a focus on indie/alternative and classic blues/rock sets.",
          imageUrl: stage1.src,
           imageSize: "lg"
        },
        {
          title: "Previous Endeavors",
          body:
            "Recorded and performed with multiple local acts; collaborated on arrangements, tone design, and live show direction.",
          imageUrl: stage2.src,
           imageSize: "lg"
        },
        {
          title: "Live Tone & Rig",
          body:
            "Dialed for clarity and feel — from glassy cleans to expressive overdrive — tailored to the room and the set.",
          imageUrl: guitarImg.src,
          imageSize: "lg"
        },
      ],
    },

    {
  visible: true,
  id: "bands",
  type: "partners",
  title: "Current Bands",
  subtitle: "Chicago performances & collaborators",
  style: { variant: "cards", columns: 3, rounded: "xl", background: "default" },
  items: [
     {
      name: "Paid Vacation",
      logoUrl:  band2Logo.src,
      links: [
        { type: "instagram", href: "https://www.instagram.com/paidvacationband/?hl=en" },
        { type: "tiktok", href: "https://www.tiktok.com/@paidvacationband" },
        { type: "linktree", href: "https://linktr.ee/paidvacationband" },
        // { type: "youtube", href: "https://youtube.com/@bandtwo" } // if you add 'youtube' to types later
      ]
    },
    {
      name: "High Dive",
      logoUrl: band1Logo.src,
      links: [
        { type: "instagram", href: "https://www.instagram.com/highdive.band/?hl=en" },
        // { type: "website", href: "https://bandone.com" }
      ]
    },
   
  ]
},


    // ABOUT (teaching background)
    {
      visible: true,
      id: "about",
      type: "about",
      title: "About Connor",
      body:
        "I am a self-taught multi-instrumentalist with a primary focus in guitar and music theory. The time spent honing my craft has allowed me to cater lessons to the needs of each individual student — without countless hours turning wheels with no real progress. My experience with piano helps apply core music concepts across instruments, and my teaching experience lets me break down struggles into simple, effective exercises that turn weaknesses into strengths.",
      imageUrl: theoryImg.src,
    },
    // GENRES
    {
      visible: true,
      id: "genres",
      type: "skills",
      title: "Genres",
      subtitle:
        "I enjoy most genres, drawing inspiration from indie/alternative bands and blues/rock guitarists like Eric Clapton, Jimi Hendrix, Jimmy Page, and David Gilmour.",
      items: [
        { title: "Blues" },
        { title: "Classical" },
        { title: "Country" },
        { title: "Folk" },
        { title: "Hip Hop" },
        { title: "Jazz" },
        { title: "Pop" },
        { title: "R&B" },
        { title: "Rock" },
      ],
      columns: 3,
      backgroundClass:'bg-gradient-2',
    },
    // OPTIONAL SECTIONAL BANNER
    {
      visible: true,
      id: "floating",
      type: "sectional",
      title: "Personalized Music Lessons From an Experienced Musician",
      body: "",
      backgroundUrl: lessonsImg.src,
      overlay: true,
      height: "md",
    },
    
    // INSTRUCTS (instruments taught)
    {
      visible: true,
      id: "instructs",
      type: "skills",
      title: "Instruments & Topics I Teach",
      subtitle: "Personalized lessons for all ages and levels",
      items: [
        { title: "Guitar" },
        { title: "Bass Guitar" },
        { title: "Drums" },
        { title: "Piano" },
        { title: "Ukulele" },
        { title: "Music Theory" },
      ],
      columns: 3,
      backgroundClass:'bg-gradient-2-top',
    },


    // PRICING (lessons)
    {
      visible: true,
      id: "pricing",
      type: "pricing",
      title: "Lesson Pricing",
      subtitle: "At Guitar Center — 2633 N. Halsted St., Chicago, IL 60614-2301",
      plans: [
        {
          name: "(4) × 30 minutes",
          price: "$136",
          description: "Four 30-minute lessons — focused fundamentals and rapid feedback.",
          features: [
            "Individualized lesson plan",
            "Technique + musicality",
            "All ages welcome",
          ],
          cta: { label: "Text/Call (630) 994-6044", href: "tel:16309946044" },
          featured: true,
          badge: "Popular",
        },
        {
          name: "(4) × 60 minutes",
          price: "$260",
          description: "Four 60-minute lessons — deeper practice and performance prep.",
          features: [
            "Expanded repertoire",
            "Ear training & theory",
            "Flexible pacing",
          ],
          cta: { label: "Text/Call (630) 994-6044", href: "tel:16309946044" },
        },
      ],
    },
    

    // BOOKING CTA
    {
      visible: true,
      id: "book",
      type: "cta",
      title: "Ready to start?",
      body:
        "Text or call to set up a private lesson.",
      cta: { label: "Text/Call (630) 994-6044", href: "tel:16309946044" },
    },


    // CONTACT
    {
      visible: true,
      id: "contact",
      type: "contact",
      title: "Contact",
      email: "", // optional
      phone: { label: "(630) 994-6044", href: "tel:16309946044" },
      address: "Lakeview, Chicago, IL",
      backgroundUrl: lessonsImg.src,
      socials: [
        // { label: "Text/Call (630) 994-6044", href: "tel:16309946044" },
      ],
    },
    // INSTAGRAM
{
visible: true,
id: "instagram",
type: "instagram",
title: "Here's a Taste",
subtitle: "check out a recent performance clip",
items: [
{ url: "https://www.instagram.com/reel/C9ajGnUJFZY/?utm_source=ig_web_copy_link" }
],
align: "center",
maxWidth: 560,
rounded: "xl",
columns: 1,
orientation: "profile",
},

    // SHARE (QR)
    {
      visible: true,
      id: "share",
      type: "share",
      title: "Share this site",
      subtitle: "Scan on your phone or share with a friend.",
      style: { variant: "band", align: "center", actions: true },
      items: [
        { label: "Website (this page)" }, // uses current URL
      ],
    },
    // DISCLAIMER (future-proofed)
    {
      visible: true,
      id: "disclaimer",
      type: "disclaimer",
      title: "Disclaimer",
      body:
        "Information on this site is for educational purposes only and does not replace personalized professional guidance.",
      enabled: false,
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
        { label: "Experience", href: "#experience" },
        { label: "Bands", href: "#bands" },
        { label: "Lessons", href: "#instructs" },
        { label: "Prices", href: "#pricing" },
        { label: "Contact", href: "#contact" },
          ],
        },
        {
          title: "Connect",
          links: [
            { label: "Text/Call (630) 994-6044", href: "tel:16309946044" },
          ],
        },
      ],
      legal: "© 2025 Connor Murray. All rights reserved.",
    },
  ],
};

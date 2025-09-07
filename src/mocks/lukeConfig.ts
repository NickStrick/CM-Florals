// src/mocks/lukeConfig.ts
import type { SiteConfig } from "@/types/site";

// Image imports (swap these for your actual asset paths)
import main from "../../public/luke/headshot.jpg";
import bg from "../../public/luke/cages.png";
import image2 from "../../public/luke/facility.jpg"; // optional
import avatar1 from "../../public/luke/steve.png"; // optional

const bookingUrl = "https://www.vagaro.com/swingscience/book-now";

export const mockSiteConfig: SiteConfig = {
  theme: { preset: "sunset", radius: "xl" },
  meta: {
    title: "Luke Stricker — Private Hitting Coach | Swing Science Hitting Lab",
    description:
      "I am Luke Stricker, Private Hitting Coach at Swing Science Hitting Lab in Chicago, IL. One-on-one instruction with individualized plans for hitters of all ages.",
    favicon: "/favicon.ico",
  },
  sections: [
    // HEADER
    {
      visible: true,
      id: "hdr",
      type: "header",
      logoText: "Luke Stricker ",
      links: [
        { label: "About", href: "#about" },
        { label: "Lessons", href: "#lessons" },
        { label: "Testimonials", href: "#testimonials" },
        { label: "Contact", href: "#contact" },
      ],
      cta: { label: "Book Now", href: bookingUrl },
      style: { sticky: true, blur: true, elevation: "sm", transparent: false },
    },
    // {
    //   visible: true,
    //   id: "floating",
    //   type: "sectional",
    //   title: "Coach Luke Stricker",
    //   body: "",
    //   backgroundUrl: bg.src,
    //   overlay: true,
    //   height: "xs",
    // },
    // HERO
    {
      visible: true,
      id: "hero",
      type: "hero",
      eyebrow: "Swing Science Hitting Lab",
      title: "Private Hitting Instruction",
      subtitle:
        "I am Luke Stricker, a Private Hitting Coach focused on individualized plans, clear cues, and repeatable mechanics.",
      primaryCta: { label: "Book a Lesson", href: bookingUrl },
      secondaryCta: { label: "Text or Call (630) 303-8329", href: "tel:16303038329" },
      imageUrl: main.src,
    },

    // OPTIONAL SECTIONAL BANNER
    {
      visible: true,
      id: "floating",
      type: "sectional",
      title: "Chicago-area one-on-one hitting lessons",
      body: "Top-tier instruction for baseball & softball hitters — all ages.",
      backgroundUrl: bg.src,
      overlay: true,
      height: "sm",
    },

    // ABOUT
    {
      visible: true,
      id: "about",
      type: "about",
      title: "About Luke",
      body:
        "A college athlete turned coach, I have over 15 years of experience with baseball and 10 years with softball. While coaching at Geneva baseball and Wasco Diamond fast pitch softball, I had also been running private and team hitting lessons for the last 6 years for softball and baseball players of all ages. I believe hard work and discipline are crucial to growing a player and their game but not at the expense of losing what is most important to the game and that is having fun. Certified Speed & Agility Instructor (NESTA), A.C.E. Certified, and SafeSport Certified. Biology degree with emphasis on EMT certification and anatomy.",
      imageUrl: image2.src,
    },

    // LESSONS / PRICING
    // LESSONS / PRICING as SKILLS
{
  visible: true,
  id: "lessons",
  type: "pricing",
  title: "Pricing.",
  subtitle: "One-on-one hitting instruction at Swing Science Hitting Lab.",
  plans: [
    {
      name: "Private Instruction",
      price: "$67",
      period: "for 30 minutes",
      description: "Individualized plans for hitters of all ages.",
      features: [
        "One-on-one coaching",
        "Individualized plans based on goals",
        "Tee work, soft toss, live BP",
        "Located in Chicago, IL"
      ],
      cta: { label: "Book now", href: "https://www.vagaro.com/swingscience/book-now" },
      featured: false,
      badge: "basic"
    },
     {
      name: "Private Instruction",
      price: "$120",
      period: "for 60 minutes",
      description: "Individualized plans for hitters of all ages.",
      features: [
        "One-on-one coaching",
        "Individualized plans based on goals",
        "Tee work, soft toss, live BP",
        "Located in Chicago, IL"
      ],
      cta: { label: "Book now", href: "https://www.vagaro.com/swingscience/book-now" },
      featured: true,
      badge: "featured"
    },
    {
      name: "Custom",
      price: "",
      period: "",
      description: "We talk and build a plan that works for you.",
      features: [
        "hitting lessons",
        "specialty training",
        "custom plans",
        "Located in Chicago, IL"
      ],
      cta: { label: "Call or Text", href: "/#contact" },
      featured: false,
      badge: ""
    },
  ]
},

    

    // TESTIMONIALS (modeled as features for compatibility)
    {
visible: true,
id: "testimonials",
type: "testimonials",
title: "Testimonials",
style: {
variant: "carousel",
columns: 2,
showQuoteIcon: true,
rounded: "xl",
background: "default",
},
items: [
{
quote:
"I have 2 words to describe Coach Luke's lessons: improvement and motivation. Luke always has the proper drills and settings for the hitter's needs, he identifies the settings and goes to work on it. Thank you Luke for always going above and beyond.",
name: "Jorge G",
},
{
quote:
"My daughter loves Luke. He’s encouraging, knowledgeable and knows how to reach the kids he’s working with. I would highly recommend Luke!",
name: "Amanda H",
},
{
quote:
"Luke did a great job with my 9 and 6 year old sons. They felt very comfortable, he gave excellent cues, and Luke has a great energetic supportive attitude.",
name: "Steve R",
avatarUrl: avatar1.src,
},
],
},
// BOOKING CTA
    {
      visible: true,
      id: "book",
      type: "cta",
      title: "Ready to train?",
      body:
        "Lock in your spot through our booking system, or text/call for availability and questions.",
      cta: { label: "Book A Lesson Now", href: bookingUrl },
    },

    // CONTACT
    {
      visible: true,
      id: "contact",
      type: "contact",
      title: "Contact",
      email: "", // optional
      phone: { label: "630-303-8329", href: "tel:16303038329" },
      address: "Chicago, IL",
      backgroundUrl: bg.src,
      socials: [
        { label: "Book a Lesson", href: bookingUrl },
        // { label: "Text or Call (630) 303-8329", href: "tel:16303038329" },
      ],
    },
    {
  visible: true,
  id: "share",
  type: "share",
  title: "Share this site",
  subtitle: "Scan or share the QR code below to open on your phone",
  style: { variant: "band", align: "center", actions: true },
  items: [
    {
      value: "https://www.vagaro.com/swingscience/book-now",
      label: "Book Lessons",
      size: 240,
    },
  ],
},

    // DISCLAIMER (kept for future-proofing)
    {
      visible: true,
      id: "disclaimer",
      type: "disclaimer",
      title: "Disclaimer",
      body:
        "Training recommendations are general guidance and not a substitute for individualized medical or rehabilitative advice.",
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
            { label: "About", href: "#about" },
            { label: "Lessons", href: "#lessons" },
            { label: "Testimonials", href: "#testimonials" },
            { label: "Contact", href: "#contact" },
          ],
        },
        {
          title: "Connect",
          links: [
            { label: "Book on Vagaro", href: bookingUrl },
            { label: "Text or Call (630) 303-8329", href: "tel:16303038329" },
          ],
        },
      ],
      legal: "© 2025 Luke Stricker. All rights reserved.",
    },
  ],
};

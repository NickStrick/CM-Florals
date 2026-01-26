// src/mocks/sueStrickerConfig.ts
import type { SiteConfig } from "@/types/site";

// ---- Image imports ----
// (Create these files under /public/sue/ or update paths to match what you have)
import heroSue from "../../public/sue/heroSue.jpg";
import sueCoach from "../../public/sue/sueCoach.jpg";
import yellowJeep from "../../public/sue/sueHike.jpg";
import cagePractice from "../../public/sue/cagePractice.jpg";
import clinic from "../../public/sue/practiceTeam.jpg";
import hitting from "../../public/sue/hittingCage.jpg";

import gallery1 from "../../public/sue/gallery-13.jpg";
import gallery2 from "../../public/sue/gallery-14.jpg";
import gallery3 from "../../public/sue/gallery-15.jpg";
import gallery4 from "../../public/sue/gallery-10.jpg";
import gallery5 from "../../public/sue/gallery-11.jpg";
import gallery6 from "../../public/sue/gallery-12.jpg";
import gallery7 from "../../public/sue/gallery-16.jpg";
import gallery8 from "../../public/sue/gallery-17.jpg";
import gallery9 from "../../public/sue/gallery-18.jpg";
import gallery10 from "../../public/sue/gallery-19.jpg";
import gallery11 from "../../public/sue/gallery-20.jpg";
import gallery12 from "../../public/sue/gallery-23.jpg";

import book1 from "../../public/sue/book-1.jpg";
import book2 from "../../public/sue/book-2.jpg";

import logoSoftballScience from "../../public/sue/logo-softball-science.png";
import logoBringItSports from "../../public/sue/bring-it.jpg";
import logoChampions from "../../public/sue/champion.png";

const website = "https://www.softball-science.com";

// TODO: Replace with Sue’s real contact info when you have it
const phoneHref = "tel:16303361553";
const phoneLabel = "(630) 336-1553";
const email = "sftbllcoach@gmail.com";

export const mockSiteConfig: SiteConfig = {
  theme: { preset: "sue", radius: "xl" },
  meta: {
    title: "Softball Science — Coaching by Sue Stricker",
    description:
      "Softball Science coaching and clinics led by Sue Stricker — former professional player, coach, and author. Private lessons, team training, and hitting development.",
    favicon: logoSoftballScience.src,
  },
  sections: [
    // ======================
    // HEADER
    // ======================
    {
      visible: true,
      id: "hdr",
      type: "header",
      logoText: "Sue Stricker",
      links: [
        { label: "Home", href: "/" },
        { label: "Announcements", href: "#announcements" },
        { label: "Founder", href: "#about" },
        { label: "Clinics & Lessons", href: "#clinics" },
        { label: "Books", href: "#books" },
        { label: "Gallery", href: "#gallery" },
        { label: "Testimonials", href: "#testimonials" },
        { label: "Partners", href: "#partners" },
        { label: "Contact", href: "#contact" },
      ],
      cta: { label: "Visit Softball-Science.com", href: website },
      style: { sticky: true, blur: true, elevation: "sm", transparent: false },
    },

    // ======================
    // HERO
    // ======================
    {
      visible: true,
      id: "hero",
      type: "hero",
      eyebrow: "Softball Science • Coaching • Clinics • Lessons",
      title: "Coaching by Sue Stricker",
      subtitle:
        "Coach Sue Stricker helps athletes of all ages level up with proven instruction, high standards, and a supportive coaching style. Private lessons, small groups, and team training.",
      primaryCta: { label: "Visit Softball-Science.com", href: website },
      secondaryCta: { label: "Contact Coach Sue", href: "#contact" },
      imageUrl: heroSue.src,
    },

    // ======================
    // ANNOUNCEMENTS (using FEATURES type)
    // ======================
    {
      visible: true,
      id: "announcements",
      type: "features",
      title: "Latest coaching updates",
      items: [
        {
          title: "New clinic dates posted",
          body:
            "Fresh clinic schedules and lesson availability are posted on the Softball Science site. Check often—spots fill quickly.",
          link: website,
          imageUrl: clinic.src,
          imageSize: "md",
          meta: [{ label: "Update", value: "Rolling weekly" }],
        },
        {
          title: "CUDIT Concentric Hitting focus",
          body:
            "Training designed to transform swing mechanics and mindset. Great for hitters who want real, measurable progress.",
          link: `${website}`,
          imageUrl: hitting.src,
          imageSize: "md",
          meta: [{ label: "Best for", value: "All ages & levels" }],
        },
        {
          title: "Team lessons available",
          body:
            "Bring Softball Science training to your team—practice plans, hitting, and skill development tailored to your goals.",
          link: "#contact",
          imageUrl: cagePractice.src,
          imageSize: "md",
          meta: [{ label: "Format", value: "Team / small group / private" }],
        },
      ],
    },

    // ======================
    // FOUNDER / ABOUT
    // ======================
    {
      visible: true,
      id: "about",
      type: "about",
      title: "Hi, I'm Sue Stricker",
      body:
        "Founder and creator of Softball Science, Sue Stricker is a former professional softball player and coach. With over 20 years of experience in coaching the sport, she has dedicated her career to training and developing young athletes. Sue has authored several books on softball techniques and strategies, and her insights have been featured in numerous sports publications and broadcasts. She continues to inspire and educate through her work at Softball Science.\n\nCoach Sue Stricker has been coaching the game for over 20 years. She is currently the Head Coach for the Wasco Daimonds 14 U team, and the General Manager at Bring It Sports where she gives private, small group, and team lessons. Her CUDIT Concentric Hitting lessons bring her hitters in the area to a level like no other.\n\nSue has coached area teams such as the Wasco Diamonds 14U (Head Coach), Homer Hawks Gold 16U and 18U (Assistant Coach), The Northern Illinois Lightning (Head Coach) 14U and 16U, and the St. Charles Angels (Head Coach). She has also coached Varsity and J.V. High School teams.\n\nSue has coached every skill level in softball. From a beginner travel team at 10U playing USSSA to a Gold Level PGF team at 18U which played in both ASA and PGF. She has helped bring her teams to Nationals at all levels on several occasions and placing in the semi-finals and finals, with the last team she brought to Nationals winning 1st place.\n\nCoach has also helped many of her players move onto the College Level. She has helped place players on teams at the D1, D2, D3 and NAIA levels. Some of these schools include Illinois State University, University of Missouri St. Louis, IUPUI, Purdue Calumet, and Clarke University.\n\nSue is currently the Certified CUDIT Concentric Hitting Coach of four teams and gives lessons to athletes of all ages. Be ready to transform your swing and mindset when working with Coach Sue Stricker!",
      imageUrl: sueCoach.src,
      bullets: [
        "Former professional softball player",
        "20+ years coaching experience",
        "Certified CUDIT Concentric Hitting Coach",
        "Drives a yellow Jeep Wrangler that screams “softball energy” at every stoplight 🥎",
      ],
      align: "left",
      backgroundClass: "",
    },

    // ======================
    // CLINICS / LESSONS + RATE (Pricing)
    // ======================
    {
      visible: true,
      id: "clinics",
      type: "pricing",
      title: "Clinics, classes & lessons",
      subtitle: "Book and view availability on Softball Science",
      plans: [
        {
          name: "Private Lesson",
          price: "$95",
          period: "per hour",
          description:
            "One-on-one coaching focused on mechanics, mindset, and repeatable results.",
          features: ["Personalized plan", "Video feedback (when available)", "All ages & levels"],
          cta: { label: "View availability", href: website },
          featured: true,
          badge: "Most requested",
        },
        {
          name: "Small Group",
          price: "$65",
          period: "per athlete / hour",
          description:
            "High reps, high intent. Great for athletes who want competitive energy and coaching attention.",
          features: ["2–4 athletes", "Skill stations", "Hitting + fielding options"],
          cta: { label: "See schedules", href: website },
        },
        {
          name: "Team Training",
          price: "Custom",
          period: "per session",
          description:
            "Bring Softball Science coaching to your team with training tailored to your goals.",
          features: ["Team practice plan", "Skill + hitting focus", "Progress tracking"],
          cta: { label: "Request team training", href: "#contact" },
        },
      ],
    },

    // ======================
    // CTA (Quick jump to site)
    // ======================
    {
      visible: true,
      id: "cta-site",
      type: "cta",
      title: "View my latest clinics, classes & lessons",
      body: "Schedules and bookings live on Softball Science.",
      cta: { label: "Go to Softball-Science.com", href: website },
    },

    // ======================
    // BOOKS (Product Listings)
    // ======================
    {
      visible: true,
      id: "books",
      type: "productListings",
      title: "Books by Coach Sue",
      subtitle: "Training tools you can use anytime",
      style: { columns: 3, cardVariant: "default", showBadges: true },
      showAllThreshold: 3,
      buyCtaFallback: "View",
      products: [
        {
          id: "softball-science-book-1",
          name: "Softball Journal",
          subtitle: "",
          sku: "SS-BOOK-001",
          price: 1999,
          currency: "USD",
          thumbnailUrl: book1.src,
          images: [{ url: book1.src, alt: "Softball Science Book 1 cover" }],
          summary: "A practical guide for athletes and parents.",
          description:
            "",
          features: ["Technique breakdowns", "Coaching cues", "Drills you can repeat"],
          badges: ["Book"],
          tags: ["book", "strategy"],
          stock: "in_stock",
          purchaseUrl: 'https://a.co/d/gMLNFek',
          ctaLabel: "Get a Copy",
        },
        {
          id: "softball-science-book-2",
          name: "BaseBall Journal",
          subtitle: "",
          sku: "SS-BOOK-002",
          price: 1999,
          currency: "USD",
          thumbnailUrl: book2.src,
          images: [{ url: book2.src, alt: "Softball Science Book 2 cover" }],
          summary: "",
          description:
            "Strategy, mindset, and advanced concepts to help athletes compete with confidence.",
          features: ["Approach + mindset", "Game situations", "Training routines"],
          badges: ["Book", "New"],
          tags: ["book", "strategy"],
          stock: "in_stock",
          purchaseUrl: 'https://a.co/d/4pzIu5s',
          ctaLabel: "Get a Copy",
        },
      ],
    },

    // ======================
    // GALLERY
    // ======================
    {
      visible: true,
      id: "gallery",
      type: "gallery",
      title: "Athletes in action",
      subtitle: "A few moments from training, games, and growth",
      style: { columns: 3, rounded: "xl", gap: "md" },
      backgroundClass: "",
      items: [
        { imageUrl: gallery1.src, alt: "Student training moment 1" },
        { imageUrl: gallery2.src, alt: "Student training moment 2" },
        { imageUrl: gallery3.src, alt: "Student training moment 3" },
        { imageUrl: gallery4.src, alt: "Student training moment 4" },
        { imageUrl: gallery5.src, alt: "Student training moment 5" },
        { imageUrl: gallery6.src, alt: "Student training moment 6" },
        { imageUrl: gallery7.src, alt: "Student training moment 7" },
        { imageUrl: gallery8.src, alt: "Student training moment 8" },
        { imageUrl: gallery9.src, alt: "Student training moment 9" },
        { imageUrl: gallery10.src, alt: "Student training moment 10" },
        { imageUrl: gallery11.src, alt: "Student training moment 11" },
        { imageUrl: gallery12.src, alt: "Student training moment 12" },
      ],
    },

    // ======================
    // TESTIMONIALS
    // ======================
    {
      visible: true,
      id: "testimonials",
      type: "testimonials",
      title: "What athletes & parents say",
      subtitle: "Real progress. Real confidence.",
      items: [
        {
          quote:
            "Coach Sue simplified my swing and helped me feel confident at the plate. The mindset work changed everything.",
          name: "Athlete",
          role: "High school hitter",
        },
        {
          quote:
            "We saw improvement in just a few sessions—better mechanics, better approach, and a more confident player.",
          name: "Parent",
          role: "Travel ball family",
        },
        {
          quote:
            "High intensity, clear cues, and a coach who genuinely cares. Our team left sharper and more focused.",
          name: "Coach",
          role: "14U head coach",
        },
      ],
      style: {
        variant: "ink",
        columns: 3,
        showQuoteIcon: true,
        rounded: "xl",
        background: "band",
      },
    },

    // ======================
    // PARTNERS
    // ======================
    {
      visible: true,
      id: "partners",
      type: "partners",
      title: "Partners & affiliations",
      subtitle: "Teams, organizations, and places we train",
      style: { variant: "cards", columns: 3, rounded: "xl", background: "band" },
      items: [
        {
          name: "Softball Science",
          description: "Clinics, classes, lessons, and updates",
          logoUrl: logoSoftballScience.src,
          links: [{ type: "website", href: website }],
        },
        {
          name: "Bring It Sports",
          description: "Private, small group, and team lessons",
          logoUrl: logoBringItSports.src,
          links: [{ type: "website", href: website }],
        },
        {
          name: "Champion craft coaching",
          description: "Large coaching partner",
          logoUrl: logoChampions.src,
          links: [{ type: "website", href: website }],
        },
      ],
    },

    // ======================
    // SOCIALS
    // ======================
    {
      visible: true,
      id: "socials",
      type: "socials",
      title: "Connect with Coach Sue",
      subtitle: "Follow, share, and stay up to date",
      items: [
        { type: "website", href: website, label: "Softball Science" },
        // TODO: Replace placeholders with real profiles
        { type: "instagram", href: "https://instagram.com/sftbllcoach", label: "Instagram" },
        { type: "facebook", href: "https://facebook.com/sftbllcoach", label: "Facebook" },
        { type: "email", href: `mailto:${email}`, label: "Email" },
      ],
      style: { background: "band", rounded: "xl", size: "lg", gap: "md", align: "center" },
      backgroundClass: "bg-gradient-2",
    },

    // ======================
    // CONTACT
    // ======================
    {
      visible: true,
      id: "contact",
      type: "contact",
      title: "Contact Coach Sue",
      address: "Training locations vary — see Softball Science for current schedules.",
      phone: { label: phoneLabel, href: phoneHref },
      email,
      backgroundUrl: yellowJeep.src,
      socials: [
        { label: "Softball Science", href: website },
        { label: "Instagram", href: "https://instagram.com/sftbllcoach" },
        { label: "Facebook", href: "https://facebook.com/sftbllcoach" },
      ],
    },

    // ======================
    // SHARE (QR) — great for networking in person
    // ======================
    {
      visible: true,
      id: "share",
      type: "share",
      title: "Share this site",
      subtitle: "Scan to book, follow, or send to a teammate.",
      style: { variant: "band", align: "center", actions: true },
      items: [
        { label: "Softball Science (Website)", value: website, size: 200 },
        { label: "Contact Coach Sue", value: `${website}`, size: 180 },
      ],
      backgroundClass: "bg-gradient-2-top",
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
            { label: "Home", href: "/" },
            { label: "Announcements", href: "#announcements" },
            { label: "Founder", href: "#about" },
            { label: "Clinics & Lessons", href: "#clinics" },
            { label: "Books", href: "#books" },
            { label: "Gallery", href: "#gallery" },
          ],
        },
        {
          title: "Connect",
          links: [
            { label: "Softball-Science.com", href: website },
            { label: `Call ${phoneLabel}`, href: phoneHref },
            { label: "Email", href: `mailto:${email}` },
          ],
        },
      ],
      legal: "© 2025 Softball Science. All rights reserved.",
    },
  ],
};

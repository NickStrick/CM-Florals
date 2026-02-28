// src/mocks/markStrickerConfig.ts
import type { SiteConfig } from "@/types/site";
import { faNewspaper, faGlobe } from '@fortawesome/free-solid-svg-icons';

// ---- Image imports (swap with real assets when available) ----
import headshot from "../../public/mark/headshot.png";
import headshot2 from "../../public/mark/headshot2.png";
import tech from "../../public/mark/emerging-tech.jpg";
import logoMark from "../../public/mark/headshot.png";
import backdrop from "../../public/mark/backdrop.jpg";

import strickerDigital from "../../public/mark/strickerdigital.png";
import substack from "../../public/mark/substack.png";
import linkedin from "../../public/mark/linkedin.png";

import blog1 from "../../public/mark/blog1.jpg";
import blog2 from "../../public/mark/blog2.jpg";
import blog3 from "../../public/mark/blog3.jpg";
import blog4 from "../../public/mark/blog4.jpg";
import blog5 from "../../public/mark/blog5.jpg";
import nature from "../../public/mark/nature.jpg";

import testimonal1 from "../../public/mark/testimonials/1.jpg";
import testimonal2 from "../../public/mark/testimonials/2.jpg";
import testimonal3 from "../../public/mark/testimonials/3.jpg";
import testimonal4 from "../../public/mark/testimonials/4.jpg";
// -------------------------------------------------------------

const SUBSTACK_BLOG = "https://stricker.substack.com/";
const SUBSTACK_ABOUT = "https://substack.com/@stricker?utm_source=about-page";
const LINKEDIN = "https://www.linkedin.com/in/markanthonystricker/";
const STRICKER_DIGITAL = "https://www.strickerdigital.com/";
const YOUTUBE = "https://www.youtube.com/@MarkStricker1";

const EMAIL = "markanthonystricker@gmail.com";

export const mockSiteConfig: SiteConfig = {
  theme: { preset: "splunk", radius: "xl" },
  meta: {
    title: "Mark Stricker   Emerging Tech Educator & Solutions Engineer",
    description:
      "Mark Stricker writes and teaches about emerging technologies, certification strategy, and learning systems. Staff Solutions Engineer at Splunk and longtime instructor.",
    favicon: logoMark.src,
  },
  settings: {
    general: {},
    payments: {
      cartActive: true,
      paymentType: "externalLink",
      externalPaymentUrl: "https://venmo.com/u/Mark-Stricker-2?txn=pay&note=Purchase&amount=",
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
      logoText: "Mark Stricker",
      links: [
        { label: "Home", href: "#top" },
        { label: "Blog", href: "#blog" },
        { label: "Teachings", href: "#teach" },
        { label: "About", href: "#about" },
        { label: "Products", href: "#products" },
        { label: "Testimonials", href: "#testimonials" },
        { label: "Philosophy", href: "#about-philosophy" },
      ],
      // Primary CTA = Substack blog
      cta: { label: "Read my Blog", href: SUBSTACK_BLOG },
      style: { sticky: true, blur: true, elevation: "sm", transparent: false },
    },

    // ======================
    // HERO (Primary CTA -> Substack)
    // ======================
    {
      visible: true,
      id: "hero",
      type: "hero",
      eyebrow: "Emerging Tech • Solutions Engineer • Learning Systems",
      title: "Learn fast. Test smart. Stay ahead of emerging tech.",
      subtitle:
        "I write and teach practical frameworks for mastering new technologies, passing exams, and building durable learning habits. Staff Solutions Engineer (Splunk) and longtime instructor of emerging technologies.",
      primaryCta: { label: "Read my Substack", href: SUBSTACK_BLOG },
      secondaryCta: { label: "Browse Products", href: "#products" },
      imageUrl: headshot.src,
    },

    // ======================
    // BLOG HIGHLIGHTS (using Features)
    // ======================
    {
      visible: true,
      id: "blog",
      type: "features",
      title: "Featured posts",
      items: [
        {
          title: "Learn Like a Hero!",
          body:
            "A learning philosophy for building momentum, confidence, and repeatable progress.",
          link: SUBSTACK_BLOG,
          imageUrl: blog1.src,
          imageSize: "md",
        },
        {
          title: "Be a Master of Attention and Intention",
          body:
            "Practical ways to protect focus and build intention in a noisy world.",
          link: SUBSTACK_BLOG,
          imageUrl: blog5.src,
          imageSize: "md",
        },
        {
          title: "Interview like a champ!",
          body:
            "A clearer approach to preparation, storytelling, and performance under pressure.",
          link: SUBSTACK_BLOG,
          imageUrl: blog2.src,
          imageSize: "md",
        },
        {
          title: "How Not to be the Smartest One in the room",
          body:
            "A mindset shift for collaboration, humility, and faster growth.",
          link: SUBSTACK_BLOG,
        },
        {
          title: "Pass that Exam!",
          body:
            "Exam strategy and learning systems for certifications and professional development.",
          link: SUBSTACK_BLOG,
        },
        {
          title: "Better Questions",
          body:
            "A framework for asking questions that accelerate learning and unlock better outcomes.",
          link: SUBSTACK_BLOG,
        },
      ],
    },

    // ======================
    // WHAT I TEACH / OFFERINGS
    // ======================
    {
      visible: true,
      id: "teach",
      type: "features",
      title: "What I teach",
      items: [
        {
          title: "Emerging technologies (applied)",
          body:
            "Practical explanations that connect new tech to real business use cases built for professionals who need clarity, not hype.",
          imageUrl: tech.src,
          imageSize: "md",
          meta: [
            { label: "Focus", value: "Clarity + application" },
            { label: "Style", value: "Frameworks + examples" },
          ],
        },
        {
          title: "Certification & exam strategy",
          body:
            "Study systems, practice structures, and mindset habits designed to help you pass confidently and retain what you learn.",
          meta: [
            { label: "Outcome", value: "Pass exams + keep the knowledge" },
            { label: "Approach", value: "Systems over cramming" },
          ],
        },
        {
          title: "Solutions engineering perspective",
          body:
            "A practitioner view from enterprise solution work how to scope, sell, demo, and implement effectively.",
          meta: [
            { label: "Experience", value: "Enterprise solutions" },
            { label: "Domains", value: "Cloud / SaaS, Security, ITSM/ITOM" },
          ],
        },
      ],
      backgroundClass: "bg-gradient-3-top",
    },

    // ======================
    // AI SKILLS
    // ======================
    {
      visible: true,
      id: "ai-skills",
      type: "skills",
      title: "AI in the field",
      subtitle:
        "Bold, practical use of AI to strengthen cybersecurity, observability, and customer outcomes.",
      columns: 3,
      items: [
        {
          title: "ChatGPT",
          body:
            "Rapid synthesis and clear customer-ready explanations for complex security and cloud concepts.",
        },
        {
          title: "Gemini",
          body:
            "Multi-modal reasoning and structured analysis to speed up research and solution design.",
        },
        {
          title: "Gumroad",
          body:
            "Applied AI exploration for new threat-hunting workflows and security playbooks.",
        },
        {
          title: "CrowdStrike Falcon",
          body:
            "Endpoint telemetry and AI-driven detection to harden environments against advanced threats.",
        },
        {
          title: "Microsoft Security Copilot",
          body:
            "Copilot-assisted investigations, summarization, and response acceleration.",
        },
        {
          title: "Darktrace ActiveAI Security Platform",
          body:
            "Self-learning AI for detection and autonomous response in dynamic environments.",
        },
      ],
      backgroundClass: "bg-gradient-3",
    },

    // ======================
    // STATS
    // ======================
    {
      visible: true,
      id: "stats",
      type: "stats",
      title: "Field snapshots",
      subtitle: "Real-world experience guiding modern security teams.",
      style: { align: "center", columns: 4, divider: "line", color: "primary" },
      items: [
        { value: 1130, label: "LinkedIn followers" },
        { value: 10, label: "Years in enterprise solutions", suffix: "+" },
        { value: 6, label: "Years at Splunk", suffix: "+" },
        { value: 9, label: "Roles at Splunk" },
      ],
    },

    // ======================
    // ABOUT
    // ======================

    {
      visible: true,
      id: "about",
      type: "about",
      title: "About Mark",
      body:
        "I'm Mark Stricker - an emerging technology educator and solutions engineer. I've taught clients and college students on emerging technologies, and I've spent 10+ years scoping, selling, demonstrating, and implementing enterprise solutions.\n\nI specialize in cloud and SaaS solutions, security solutions, and ITSM/ITOM. I've worked with Fortune 500 commercial customers, public sector / DoD clients, state and local government, and higher education.\n\nToday, I write and teach practical frameworks for learning new technologies, earning certifications, and passing exams - without burnout.",
      imageUrl: headshot2.src,
      bullets: [
        "10+ years enterprise solutions experience",
        "Cloud/SaaS - Security - ITSM/ITOM",
        "Teaching emerging technologies since the 1990s",
        "Educator mindset: frameworks, habits, outcomes",
      ],
      align: "left",
      backgroundClass: "bg-[var(--bg)]",
    },


   

    // ======================
    // CTA (Primary: subscribe/read)
    // ======================
    {
      visible: true,
      id: "cta",
      type: "cta",
      title: "Get the newest posts first",
      body:
        "Read the blog and subscribe on Substack for updates on learning systems, exam strategy, and emerging tech.",
      cta: { label: "Go to Substack", href: SUBSTACK_BLOG },
    },

    // ======================
    // YOUTUBE (coming soon)
    // ======================
    {
      visible: true,
      id: "youtube",
      type: "cta",
      title: "YouTube (coming soon)",
      body:
        "Short lessons that complement the blog learning systems, certification strategy, and emerging tech explainers.",
      cta: { label: "Go to Chanel", href: YOUTUBE },
    },
    // {
    //   visible: true,
    //   id: "youtube",
    //   type: "video",
    //   title: "YouTube (coming soon)",
    //   subtitle:
    //     "Short lessons that complement the blog learning systems, certification strategy, and emerging tech explainers.",
    //   // placeholder; replace with channel URL when ready
    //   source: { type: "url", href: "https://www.youtube.com/" },
    //   style: { aspect: "16/9", rounded: "xl", shadow: "md", background: "band" },
    //   controls: true,
    //   autoplay: false,
    //   muted: false,
    //   loop: false,
    // },
    {
      visible: true,
      id: "products",
      type: "productListings",
      title: "Handcrafted Resources",
      subtitle: "Expert designed Learning Strategies, philosophy, and practical frameworks.",
      style: { columns: 2, cardVariant: "default", showBadges: true },
      showAllThreshold: 20,
      buyCtaFallback: "Buy Now",
      products: [
        {
          id: "PDF-001",
          name: "Study Guide: Learn Like a Hero",
          subtitle: "A learning philosophy for building momentum, confidence, and repeatable progress.",
          sku: "CMF-R6",
          price: 5500,
          currency: "USD",
          thumbnailUrl: blog1.src,
          images: [
            { url: blog1.src, alt: "Study Guide: Learn Like a Hero 1" },
          ],
          summary: " A concise guide to adopting the 'Learn Like a Hero' mindset and strategies.",
           description:
             "This study guide provides a step-by-step approach to mastering new skills and knowledge effectively. It includes practical tips, exercises, and real-world examples to help learners build confidence and achieve their learning goals.",
           features: ["Comprehensive learning strategies", "Practical exercises", "Real-world examples"],
           badges: ["Bestseller", "New"],
           stock: "in_stock",
           quantityAvailable: 99,
           ctaLabel: "Buy Now",
           maxQuantity: 99,
         },
        {
          id: "PDF-002",
          name: "BioHacks: Science Backed Longevity & Vitality",
          subtitle: "Practical biohacks for enhancing longevity, vitality, and overall well-being.",
          sku: "CMF-R6",
          price: 3500,
          compareAtPrice: 4500,
          currency: "USD",
          thumbnailUrl: blog4.src,
          images: [
            { url: blog4.src, alt: "BioHacks: longevity & Vitality 1" },
          ],
          summary: " A concise guide to adopting the 'BioHacks: longevity & Vitality' mindset and strategies.",
           description:
             "biohacks that provide a step-by-step approach to enhancing longevity and vitality effectively. It includes practical tips, exercises, and real-world examples to help individuals improve their well-being and achieve their health goals.",
           features: ["Comprehensive biohacking strategies", "Practical exercises", "Real-world examples"],
           badges: ["Bestseller", "Discount", "Limited Edition"],
           stock: "in_stock",
           quantityAvailable: 99,
           ctaLabel: "Buy Now",
           maxQuantity: 99,
         },

      ],
    },

    // ======================
    // PARTNERS
    // ======================
    {
      visible: true,
      id: "partners",
      type: "partners",
      title: "Links",
      subtitle: "Collaborations and projects",
      style: { variant: "cards", columns: 3, rounded: "xl", background: "band" },
      items: [
        {
          name: "Stricker Digital",
          description:
            "Partnering as an emerging tech educator, education philosopher, and health expert (with my son’s web development company).",
          logoUrl: strickerDigital.src,
          links: [{ type: "website", href: STRICKER_DIGITAL }],
        },
        {
          name: "Substack",
          description: "Writing archive and newsletter",
          logoUrl: substack.src,
          links: [
            { type: "website", href: SUBSTACK_BLOG, customLabel: "Blog" },
            { type: "website", href: SUBSTACK_ABOUT, customLabel: "About" },
          ],
        },
        {
          name: "LinkedIn",
          description: "Work history and professional profile",
          logoUrl: linkedin.src,
          links: [{ type: "linkedin", href: LINKEDIN }],
        },
      ],
    },
    {
  visible: true,
  id: 'promo',
  type: 'video',
  title: 'Introducing Splunk, my favorite workplace ever',
  subtitle: 'the Data-to-Everything™ Platform',
  source: { type: 'url', href: 'https://youtu.be/1eg8zUGalCg?si=FLqwI_wbMhxi9QtY' },
  // posterUrl: 'configs/carole/assets/poster.jpg', // optional (S3 key or full URL)
  style: { aspect: '16/9', rounded: 'xl', shadow: 'lg', background: 'default' },
  controls: true,
  autoplay: false,
  muted: false,
  loop: false,
},
    {
      visible: true,
      id: "testimonials",
      type: "testimonials",
      title: "Testimonials",
      subtitle: "What colleagues and leaders have shared about working with Mark",
      bottomWaveType: "1-hill",
      style: { variant: "card", columns: 2, rounded: "xl", background: "band" },
      items: [
        {
          avatarUrl: testimonal1.src,
          name: "Randal Locke",
          role: "Technical Sales Leader - Service Desk Manager - ITIL v3 Expert",
          quote:
            "Mark does a great job of understanding what the client is looking for, asking detailed questions to drill into realistic capabilities, and then putting a plan together with the client to achieve those goals. He is very good in front of a client and easily gains their trust with his interpersonal capabilities as well as his understanding in the Service Management and Asset Management industries. Mark would be an asset to any organization.",
        },
        {
          avatarUrl: testimonal2.src,
          name: "Julia Ferguson",
          role: "Designer, Continual Improver, Community Builder",
          quote:
            "Mark is hard-working, intelligent, broad-thinking, trust-worthy, and also a genuinely nice guy. These traits were recognized early-on in the years we worked together at CA Technologies and I recommended him for several promotions that gave him increasing levels of responsibility. He never disappointed. Mark has a rare combination of strong creative, \"soft\" skills and deep technical knowledge that makes him an excellent problem-solver and analyst. He's a quick study and never stops learning and embracing new ideas. If I were building a team and looking for someone to lead it, Mark would be among my top choices.",
        },
        {
          avatarUrl: testimonal3.src,
          name: "Bill Messick",
          role: "Former ITSM Senior Consultant (Retired)",
          quote:
            "Mark was the architect on a large enterprise-wide project involving several CA applications, any one of which would have been a sizable project by itself. His encyclopedic knowledge of CA products and other IT technologies, as well as his exceptional work ethic and willingness to help other team members with technical challenges, helped to inspire and energize the whole project team.",
        },
        {
          avatarUrl: testimonal4.src,
          name: "June Wang",
          role: "Sr. Consultant at CA, a Broadcom Company",
          quote:
            "I have worked with Mark for the past year. Mark has been a tremendous asset to our team. He is an important contributor to our USARC project along with other teammates. He consistently delivers high quality work, meets or exceeds deadlines, and assists his co-workers at every opportunity with his broad technical knowledge. When under an especially strict timeline on that project, he worked a lot of overtime to ensure the client was pleased. Mark exemplifies good character and he is a trustworthy, reliable worker who goes extra miles to get job done and has made so many clients very happy.",
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
      title: "Connect",
      subtitle: "Follow the writing and reach out",
      items: [
        { type: "website", href: SUBSTACK_BLOG, label: "Substack" },
        { type: "linkedin", href: LINKEDIN, label: "LinkedIn" },
        { type: "email", href: `mailto:${EMAIL}`, label: "Email" },
      ],
      bottomWaveType: "1-hill",
      style: { background: "band", rounded: "xl", size: "lg", gap: "md", align: "center" },
    },

    // ======================
    // CONTACT
    // ======================
    {
      visible: true,
      id: "contact",
      type: "contact",
      title: "Contact",
      email: EMAIL,
      address: "Chicago Area (remote-friendly)",
      socials: [
        { label: "Substack", href: SUBSTACK_BLOG, customIcon: faNewspaper },
        { label: "LinkedIn", href: LINKEDIN },
        { label: "Stricker Digital", href: STRICKER_DIGITAL, customIcon: faGlobe },
      ],
      backgroundUrl: backdrop.src,
      
    },
     // ======================
    // ABOUT (PHILOSOPHY + FAMILY)
    // ======================
    {
      visible: true,
      id: "about-philosophy",
      type: "about",
      title: "Philosophy, education, and family",
      body:
        `I’m rooted in philosophy and lifelong learning, heavily influenced by Zen Buddhism, Alan Watts, and the kind of thinking that reminds you to slow down, breathe, and maybe stop overthinking everything for five minutes. I spend a lot of time in nature for the same reason, it’s honest, humbling, and wildly good at putting things back into perspective. I also admire Tony Robbins’ obsession with discipline, energy, and momentum… which explains a lot about my calendar and my caffeine intake.

I work in technology, cybersecurity, and AI, and I’m also a lifelong health hacker—constantly experimenting with habits, routines, and data to stay sharp, energized, and human in a world that doesn’t always encourage balance.

At the center of it all is love and family. They keep me grounded, patient, and real. Everything I do, teaching, mentoring, building, and learning, is an extension of that love. That’s the throughline of my work: philosophy as a compass, nature as a reset button, and service as the way forward.`,
      imageUrl: nature.src,
      align: "right",
      backgroundClass: "bg-gradient-2",
      topWaveType: "1-hill",
    },

    // ======================
    // SHARE (QR)
    // ======================
    {
      visible: true,
      id: "share",
      type: "share",
      title: "Share the blog",
      subtitle: "Scan to read and subscribe.",
      style: { variant: "band", align: "center", actions: true },
      items: [
        { label: "Stricker Substack", value: SUBSTACK_BLOG, size: 200 },
        { label: "LinkedIn", value: LINKEDIN, size: 180 },
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
            { label: "Home", href: "#top" },
            { label: "Blog", href: "#blog" },
            { label: "Teachings", href: "#teach" },
            { label: "About", href: "#about" },
            { label: "Products", href: "#products" },
            { label: "Testimonials", href: "#testimonials" },
            { label: "Philosophy", href: "#about-philosophy" },
          ],
        },
        {
          title: "Connect",
          links: [
            { label: "Substack", href: SUBSTACK_BLOG },
            { label: "LinkedIn", href: LINKEDIN },
            { label: "Email", href: `mailto:${EMAIL}` },
          ],
        },
      ],
      legal: "© 2026 Mark Stricker. All rights reserved.",
    },
  ],
};

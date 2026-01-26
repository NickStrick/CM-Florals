// src/mocks/iselaOrtizConfig.ts
import type { SiteConfig } from "@/types/site";

// ---- Image imports (replace with real images when available) ----
import headshot from "../../public/isela/headshot.jpg";
import speaking from "../../public/isela/presentation.jpg";
import outreach from "../../public/isela/outreach.jpg";
import organizer from "../../public/isela/event.jpg";
import content from "../../public/isela/content.jpg";
import team from "../../public/isela/team.jpg";
import teamwork from "../../public/isela/teamwork.jpg";
import leaf from "../../public/isela/leaf.jpg";

const LINKEDIN = "https://www.linkedin.com/in/iselaiortiz/";
const TIKTOK = "https://www.tiktok.com/@cutiewithanxiety";

const EMAIL = "iselaortizreyna@gmail.com";
const PHONE_HREF = "tel:17737540751";
const RESUME_URL = "https://docs.google.com/document/d/1aWb8lWwNsCgAs4aOJF6-gD_-Cm8Op3E5WBkjM7gbgdY/edit?usp=sharing";

export const mockSiteConfig: SiteConfig = {
  theme: { preset: "candy", radius: "xl" },
  meta: {
    title: "Isela Ortiz Reyna ,  Strategic Communications & Recruitment",
    description:
      "Bilingual (English/Spanish) communications professional with experience in research recruitment, presentations, outreach, scheduling coordination, and content creation. Northwestern University recruitment coordinator. Preparing for law school (LSAT).",
  },
  sections: [
    // ======================
    // HEADER
    // ======================
    {
      visible: true,
      id: "hdr",
      type: "header",
      logoText: "Isela Ortiz Reyna",
      links: [
        { label: "About", href: "#about" },
        { label: "Skills", href: "#skills" },
        { label: "Experience", href: "#experience" },
        { label: "Strengths", href: "#value" },
        
        { label: "Direction", href: "#direction" },
        { label: "Content ", href: "#content" },
        
        { label: "Contact", href: "#contact" },
      ],
      cta: { label: "Download Resume", href: RESUME_URL },
      style: { sticky: true, blur: true, elevation: "sm", transparent: false },
    },

    // ======================
    // HERO
    // ======================
    {
      visible: true,
      id: "hero",
      type: "hero",
      eyebrow: "Strategic Communication • Recruitment Outreach • Bilingual ENG/SPA",
      title: "Communication, Content, and Outreach.",
      subtitle:
        "Research Studies Recruitment Coordinator at Northwestern University with experience in participant outreach, presentations, event support, and scheduling coordination. Bilingual (English/Spanish). Short-form content creator with measurable engagement.",
      primaryCta: { label: "View LinkedIn", href: LINKEDIN },
      secondaryCta: { label: "Contact", href: "#contact" },
      imageUrl: headshot.src,
    },

    // ======================
    // ABOUT
    // ======================
    {
      visible: true,
      id: "about",
      type: "about",
      title: "About Me",
      body:
        "I’m a bilingual communications professional with experience in recruitment, outreach, scheduling coordination, and event support in fast-paced environments.\n\nI earned my B.A. in Communication while supporting myself through college by working as a nanny to cover living and school expenses. Today, I work at Northwestern University as a Research Studies Recruitment Coordinator where I support study enrollment through eligibility screening, participant communication, and outreach strategies.\n\nI’m also preparing for law school (LSAT in progress), and I’m especially motivated by work that supports people and communities through clear communication and trusted relationships.",
      imageUrl: speaking.src,
      bullets: [
        "B.A. in Communication",
        "Bilingual: English & Spanish",
        "Research recruitment + outreach",
        "LSAT in progress (law school path)",
      ],
      align: "left",
       backgroundClass: "bg-solid-primary",
    },

      // ======================
    // SKILLS
    // ======================
    {
      visible: true,
      id: "skills",
      type: "skills",
      title: "Skills & tools",
      subtitle: "What I bring to a communications or recruiting team",
      columns: 3,
      items: [
        { title: "Recruitment & engagement", body: "Screening, follow-up, rapport-building, outreach" },
        { title: "Communication", body: "Presentations, messaging, bilingual ENG/SPA support" },
        { title: "Coordination", body: "Scheduling, calendars, cross-team collaboration" },
        { title: "Content creation", body: "Short-form video, copywriting, creative iteration" },
        { title: "Design + email", body: "Canva, Adobe Creative Suite, email campaigns" },
        { title: "Systems", body: "Microsoft Office, Mailchimp, REDCap, data entry" },
      ],
      backgroundClass: "bg-gradient-mid-bottom",
    },

    // ======================
    // RESULTS (more quantifiable, non-invented)
    // ======================
    {
      visible: true,
      id: "results",
      type: "stats",
      title: "Results & measurable signals",
      subtitle: "A snapshot of scale, consistency, and reach",
      items: [
        { value: 100, label: "Calls per Week", suffix: "+" },
    { value: 10, label: "Presentations Delivered", suffix: "+", decimals: 0 },
    { value: 10, label: "Events Organized", suffix: "+", decimals: 0 },
        // TikTok (from user-provided stats)
        { value: 3729, label: "TikTok Followers", suffix: "+" },
        { value: 89300, label: "TikTok Likes", suffix: "+" },
        // Recent performance (from user-provided stats)
        { value: 94500, label: "Recent Video Views", suffix: "+" },
    
      ],
      style: { align: "center", columns: 3, compact: false, divider: "dot", color: "primary" },
      backgroundClass: "bg-gradient-mid",
    },
     // ======================
    // EXPERIENCE SUMMARY
    // ======================
    {
      visible: true,
      id: "experience",
      type: "about",
      title: "Experience summary",
      body:
        "At Northwestern University, I serve as the primary point of contact for prospective research participants, conduct eligibility screenings, explain study procedures, and coordinate scheduling across teams. I also design recruitment outreach using flyers, email campaigns, phone calls, and participant registries, supported by Canva and Adobe Creative Suite.\n\nPreviously, I supported communications work for a community campaign by recruiting volunteers, delivering presentations in-person and via Zoom, monitoring engagement trends, and providing administrative support.\n\nI’m currently studying for the LSAT as I work toward law school, and I’m especially interested in roles where communication, operations, and people-centered service overlap, particularly in legal, education, healthcare, nonprofit, or mission-driven environments.",
      imageUrl: outreach.src,
      bullets: [
        "Recruitment & outreach strategy",
        "Presentations (in-person + Zoom)",
        "Scheduling coordination across teams",
        "Translation support for Spanish-speaking participants",
        "Canva + Adobe Creative Suite + Mailchimp + MS Office + REDCap",
      ],
      align: "left",
    },

    // ======================
    // VALUE / STRENGTHS THAT DELIVER RESULTS (corporate-friendly)
    // ======================
    {
      visible: true,
      id: "value",
      type: "features",
      title: "Value I bring",
      items: [
        {
          title: "Trust-building communication (ENG/SPA)",
          body:
            "I build rapport quickly and communicate clearly with diverse audiences, especially in sensitive, high-trust contexts like research recruitment and community engagement.",
          imageUrl: speaking.src,
          imageSize: "md",
          meta: [
            { label: "Strength", value: "Bilingual communication + empathy" },
            { label: "Outcome", value: "Higher clarity, stronger relationships" },
          ],
        },
        {
          title: "Reliable coordination in fast-paced environments",
          body:
            "I keep schedules, follow-ups, and details organized across teams, so stakeholders feel supported and work keeps moving.",
          imageUrl: teamwork.src,
          imageSize: "md",
          meta: [
            { label: "Strength", value: "Organization + attention to detail" },
            { label: "Outcome", value: "Fewer drop-offs, smoother operations" },
          ],
        },
        {
          title: "Content that performs (without losing professionalism)",
          body:
            "I translate ideas into clear, audience-first content and improve it using performance signals (views/likes/comments). This same process supports corporate content, internal comms, recruiting ads, and campaign messaging.",
          imageUrl: content.src,
          imageSize: "md",
          meta: [
            { label: "Strength", value: "Messaging + iteration" },
            { label: "Outcome", value: "More engagement and clearer calls-to-action" },
          ],
        },
        {
          title: "Mission-aligned mindset",
          body:
            "I’m motivated by work that helps people and strengthens communities, and I bring that care into how I represent organizations publicly and internally.",
          meta: [{ label: "Outcome", value: "Stronger brand trust + better stakeholder experience" }],
        },
      ],
    },

        // ======================
    // INTERESTS / FUTURE DIRECTION (replaces “Target roles”)
    // ======================
    {
      visible: true,
      id: "direction",
      type: "features",
      title: "Interests & future direction",
      items: [
        {
          title: "Where I want to grow",
          body:
            "I’m pursuing communications, recruiter, or content & social media roles, especially in environments where clarity, empathy, and trust matter. I’m particularly interested in supporting a law firm or legal organization where communication plays a key role in client experience and community impact.",
          imageUrl: organizer.src,
          imageSize: "md",
          meta: [
            { label: "Ideal focus", value: "Communication, recruiting, content + client experience" },
            { label: "North Star", value: "Law path + social justice impact" },
          ],
        },
        {
          title: "What I’m looking for in a team",
          body:
            "A warm company culture and a mission to help people and communities. I do my best work where collaboration is strong, expectations are clear, and the work has real meaning.",
          imageUrl: team.src,
          imageSize: "md",
          meta: [
            { label: "Culture", value: "Warm, collaborative, growth-oriented" },
            { label: "Mission", value: "People + community impact" },
          ],
        },
        {
          title: "How I learn and improve",
          body:
            "I’m naturally curious, comfortable with feedback, and I iterate quickly, whether I’m improving outreach messaging, refining a presentation, or optimizing content based on engagement signals.",
          meta: [{ label: "Work style", value: "Ownership + iteration + follow-through" }],
        },
      ],
    },

    // ======================
    // CONTENT & SOCIAL (corporate framing)
    // ======================
    {
      visible: true,
      id: "content",
      type: "features",
      title: "Corporate-friendly content experience",
      items: [
        {
          title: "Audience-first messaging",
          body:
            "I create content with a clear goal (inform, persuade, drive action), and I refine based on audience response, useful for recruiting content, employer branding, and customer/client-facing communications.",
          meta: [{ label: "Applies to", value: "Recruiting, comms, brand, campaigns" }],
        },
        {
          title: "Repeatable workflows",
          body:
            "I batch content, keep consistent publishing cadence, and build lightweight systems that make execution reliable and on-time.",
          meta: [{ label: "Applies to", value: "Social media calendars, campaign planning" }],
        },
        {
          title: "Professional tools",
          body:
            "Comfortable building graphics and outreach materials using Canva and Adobe Creative Suite, plus email and office tools for coordination and reporting.",
          meta: [{ label: "Tools", value: "Canva, Adobe, Mailchimp, MS Office" }],
        },
      ],
    },
     // CTA (OPTIONAL)
    {
      visible: true,
      id: "cta",
      type: "cta",
      title: "Ready to work together?",
      body: "learn more about my experience and how I can add value to your team.",
      cta: { label: "Download my Resume", href: RESUME_URL},
    },


    // ======================
    // SOCIAL LINKS
    // ======================
    {
      visible: true,
      id: "socials",
      type: "socials",
      title: "Online profiles",
      subtitle: "Let’s connect",
      items: [
        { type: "linkedin", href: LINKEDIN, label: "LinkedIn" },
        { type: "tiktok", href: TIKTOK, label: "TikTok (Content Portfolio)" },
        { type: "email", href: `mailto:${EMAIL}`, label: "Email" },
      ],
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
      phone: { label: "(773) 754-0751", href: PHONE_HREF },
      address: "Chicago, IL",
      backgroundUrl: leaf.src,
    },

    // ======================
    // SHARE
    // ======================
    {
      visible: true,
      id: "share",
      type: "share",
      title: "Share my profile",
      subtitle: "Scan to view LinkedIn or download my resume.",
      style: { variant: "band", align: "center", actions: true },
      items: [
        { label: "LinkedIn", value: LINKEDIN, size: 200 },
        { label: "Resume", value: RESUME_URL, size: 180 },
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
          title: "Quick Links",
          links: [
            { label: "About", href: "#about" },
            { label: "Skills", href: "#skills" },
            { label: "Experience", href: "#experience" },
            { label: "Direction", href: "#direction" },
            { label: "Contact", href: "#contact" },
          ],
        },
        {
          title: "Connect",
          links: [
            { label: "LinkedIn", href: LINKEDIN },
            { label: "TikTok", href: TIKTOK },
            { label: "Email", href: `mailto:${EMAIL}` },
          ],
        },
      ],
      legal: "© 2026 Isela Ortiz Reyna. All rights reserved.",
    },
  ],
};

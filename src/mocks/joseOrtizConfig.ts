import type { SiteConfig } from "@/types/site";

// You can replace these placeholder paths with imports like:
// import heroImg from "../../public/jose/hero.jpg"; then use heroImg.src below.
const heroImg = "/jose/hero.jpg";
const portraitImg = "/jose/jose-portrait.jpg";
const eventImg1 = "/jose/events/event-1.jpg";
const eventImg2 = "/jose/events/event-2.jpg";
const eventImg3 = "/jose/events/event-3.jpg";
const logoCdots = "/jose/logos/connecting-dots-logo.png";
const logoALL = "/jose/logos/academy-local-leadership.png";

const phoneHref = "tel:+13125550123";
const emailHref = "mailto:hello@connectingdotsforlatinx.com";

export const mockSiteConfig: SiteConfig = {
  theme: { preset: "festival", radius: "xl" },
  meta: {
    title: "Jose O. Ortiz — Connecting Dots for Latinx Professionals",
    description:
      "Social impact innovator, leadership development strategist, and co-founder of Connecting Dots for Latinx Professionals. Bilingual (ENG/SPA).",
    favicon: logoCdots,
  },
  sections: [
    // ======================
    // HEADER
    // ======================
    {
      id: "hdr",
      type: "header",
      visible: true,
      logoText: "Jose O. Ortiz",
      links: [
        { label: "Home", href: "/" },
        { label: "About", href: "#about" },
        { label: "Connecting Dots", href: "#cdots" },
        { label: "Work & Impact", href: "#work" },
        { label: "Events", href: "#events" },
        { label: "Contact", href: "#contact" },
      ],
      cta: { label: "Connect on LinkedIn", href: "https://www.linkedin.com/in/jose-o-ortiz-msc-420670135/" },
      style: { sticky: true, blur: true, elevation: "sm", transparent: false },
    },

    // ======================
    // HERO
    // ======================
    {
      id: "hero",
      type: "hero",
      visible: true,
      eyebrow: "Social Impact • Leadership • Community",
      title: "Building Opportunity Through Connection",
      subtitle:
        "I help people and organizations unlock their potential through leadership development, strategic communication, and inclusive community building. Co-founder of Connecting Dots for Latinx Professionals. Bilingual (ENG/SPA).",
      primaryCta: { label: "Connect on LinkedIn", href: "https://www.linkedin.com/in/jose-o-ortiz-msc-420670135/" },
      secondaryCta: { label: "Explore Connecting Dots", href: "#cdots" },
      imageUrl: heroImg,
    },

    // ======================
    // ABOUT
    // ======================
    {
      id: "about",
      type: "about",
      visible: true,
      title: "About Jose",
      body:
        "As a first-generation immigrant and bilingual leader (English/Spanish), I’m passionate about helping people and organizations grow. My background spans public, nonprofit, and business sectors — including management, fundraising, consulting, and community engagement — always with a focus on impact and inclusion.\n\nI currently support Chicago Public Schools with LSC training and community engagement, and I co-founded *Connecting Dots for Latinx Professionals* to build a stronger, more collaborative professional ecosystem.",
      imageUrl: portraitImg,
      bullets: [
        "MSC, Northwestern University",
        "Community Engagement / LSC Specialist, CPS",
        "Co-Founder, Connecting Dots for Latinx Professionals",
        "Leadership, fundraising, and strategic communications",
      ],
      align: "left",
    },

    // ======================
    // FEATURES (pillar areas)
    // ======================
    {
      id: "work",
      type: "features",
      visible: true,
      title: "Work & Impact",
      items: [
        {
          title: "Leadership Development",
          body:
            "Design and facilitation of practical leadership experiences for emerging and established leaders.",
          imageUrl: eventImg1,
          meta: [
            { label: "Approach", value: "Cohort-based, peer learning" },
            { label: "Format", value: "Workshops / Fellowships" },
          ],
        },
        {
          title: "Strategic Communication",
          body:
            "Message design, coalition storytelling, and stakeholder alignment for impact-driven teams.",
          imageUrl: eventImg2,
          meta: [
            { label: "Focus", value: "Clarity, voice, outcomes" },
            { label: "Audience", value: "Internal & external" },
          ],
        },
        {
          title: "Community Engagement",
          body:
            "Inclusive outreach, partnership activation, and culturally responsive organizing.",
          imageUrl: eventImg3,
          meta: [
            { label: "Sectors", value: "Public, nonprofit, education" },
            { label: "Geography", value: "Chicago metro" },
          ],
        },
      ],
    },

    // ======================
    // SECTIONAL (story band)
    // ======================
    {
      id: "values",
      type: "sectional",
      visible: true,
      title: "Purpose-Driven, People-First",
      body:
        "My work is rooted in resilience, connection, and opportunity — elevating voices and building systems that include everyone.",
      backgroundUrl: "/jose/banners/values.jpg",
      overlay: true,
      align: "center",
      height: "md",
      motion: { direction: "y", offset: 20, duration: 0.6 },
    },

    // ======================
    // CONNECTING DOTS (org highlight)
    // ======================
    {
      id: "cdots",
      type: "features",
      visible: true,
      title: "Connecting Dots for Latinx Professionals",
      items: [
        {
          title: "Why We Exist",
          body:
            "To cultivate a supportive, cross-sector community where Latinx professionals can grow, collaborate, and lead.",
          imageUrl: logoCdots,
          imageSize: "sm",
        },
        {
          title: "What We Do",
          body:
            "Host events, share opportunities, and spotlight leaders while fostering mentorship and resource exchange.",
          imageUrl: "/jose/cdots/what-we-do.jpg",
          meta: [{ label: "Format", value: "Meetups, panels, features" }],
        },
        {
          title: "Who We Serve",
          body:
            "Students, early-career, and established leaders across the Greater Chicago Area — and beyond.",
          imageUrl: "/jose/cdots/who-we-serve.jpg",
        },
      ],
    },

    // ======================
    // STATS (trust signals)
    // ======================
    {
      id: "stats",
      type: "stats",
      visible: true,
      title: "A Growing Network",
      subtitle: "Momentum across community and partnerships",
      items: [
        { value: 500, label: "Connections", suffix: "+", decimals: 0 },
        { value: 8, label: "Years at CPS", decimals: 0 },
        { value: 2, label: "Cofounded Initiatives", decimals: 0 },
        { value: 25, label: "Events Hosted", suffix: "+", decimals: 0 },
      ],
      style: { align: "center", columns: 4, divider: "dot", color: "accent" },
    },

    // ======================
    // TESTIMONIALS
    // ======================
    {
      id: "testimonials",
      type: "testimonials",
      visible: true,
      title: "What Colleagues Say",
      subtitle: "Leadership • Clarity • Follow-through",
      items: [
        {
          quote:
            "Jose brings people together and gets results. His empathy and structure help teams move from ideas to action.",
          name: "Community Partner",
          role: "Nonprofit Leader",
        },
        {
          quote:
            "A thoughtful facilitator who listens deeply and designs for impact.",
          name: "Program Collaborator",
          role: "Education Sector",
        },
        {
          quote:
            "He’s a connector — generous with his network and focused on outcomes.",
          name: "Fellow Organizer",
          role: "Civic Engagement",
        },
      ],
      style: { variant: "card", columns: 3, showQuoteIcon: true, rounded: "xl", background: "band" },
    },

    // ======================
    // GALLERY (events)
    // ======================
    {
      id: "events",
      type: "gallery",
      visible: true,
      title: "Events & Moments",
      subtitle: "A look at community in action",
      style: { columns: 3, gap: "md", rounded: "xl" },
      items: [
        { imageUrl: eventImg1, alt: "Workshop moment" },
        { imageUrl: eventImg2, alt: "Panel conversation" },
        { imageUrl: eventImg3, alt: "Networking circle" },
      ],
    },

    // ======================
    // PARTNERS (ally orgs)
    // ======================
    {
      id: "partners",
      type: "partners",
      visible: true,
      title: "Partners & Programs",
      subtitle: "Collaborations that strengthen impact",
      style: { variant: "cards", columns: 2, rounded: "xl", background: "band" },
      items: [
        {
          name: "Connecting Dots for Latinx Professionals",
          description: "Community, mentorship, and opportunity exchange.",
          logoUrl: logoCdots,
          links: [
            { type: "website", href: "https://www.connectingdotsforlatinx.com" },
            { type: "linkedin", href: "https://www.linkedin.com/company/connecting-dots-for-latinx-professionals/" },
          ],
        },
        {
          name: "Academy for Local Leadership",
          description: "Cohort-based learning for Chicago’s education ecosystem.",
          logoUrl: logoALL,
          links: [{ type: "linkedin", href: "https://www.linkedin.com/company/academy-for-local-leadership/" }],
        },
      ],
    },

    // ======================
    // INSTAGRAM (swap to LinkedIn posts later if desired)
    // ======================
    {
      id: "instagram",
      type: "instagram",
      visible: true,
      title: "From the Community",
      subtitle: "Snapshots from recent programming",
      items: [
        { url: "https://www.instagram.com/p/Cv6h2Y8LkXY/" },
        { url: "https://www.instagram.com/p/CuZt2nAFmY1/" },
      ],
      align: "center",
      maxWidth: 640,
      rounded: "xl",
      columns: 2,
      orientation: "landscape",
    },

    // ======================
    // NEWSLETTER (or interest form)
    // ======================
    {
      id: "newsletter",
      type: "newsletter",
      visible: true,
      title: "Join the Network",
      body: "Get invitations to events, opportunities, and leadership resources.",
      googleFormEmbedUrl:
        "https://docs.google.com/forms/d/e/1FAIpQLSf-MockConnectingDotsInterest/viewform?embedded=true",
    },

    // ======================
    // CTA (speaking / collab)
    // ======================
    {
      id: "cta-collab",
      type: "cta",
      visible: true,
      title: "Speaking • Workshops • Collaborations",
      body:
        "Open to partnering with mission-driven organizations. Let’s design something useful together.",
      cta: { label: "Start a conversation", href: emailHref },
    },

    // ======================
    // SCHEDULING
    // ======================
    {
      id: "scheduling",
      type: "scheduling",
      visible: true,
      title: "Book a Conversation",
      body: "15–30 minutes to explore challenges and opportunities.",
      calendlyUrl: "https://calendly.com/your-calendly-username/intro-chat",
    },

    // ======================
    // SOCIALS (footer pre-contact)
    // ======================
    {
      id: "socials",
      type: "socials",
      visible: true,
      title: "Connect Online",
      subtitle: "Follow and say hello",
      items: [
        { type: "linkedin", href: "https://www.linkedin.com/in/jose-o-ortiz-msc-420670135/", label: "LinkedIn" },
        { type: "instagram", href: "https://www.instagram.com/connectingdotslatinx/", label: "Instagram" },
        { type: "website", href: "https://www.connectingdotsforlatinx.com", label: "Connecting Dots" },
        { type: "email", href: emailHref, label: "Email" },
      ],
      style: { background: "band", rounded: "xl", size: "md", gap: "md", align: "center" },
    },

    // ======================
    // CONTACT
    // ======================
    {
      id: "contact",
      type: "contact",
      visible: true,
      title: "Get in Touch",
      email: "hello@connectingdotsforlatinx.com",
      phone: { label: "(312) 555-0123", href: phoneHref },
      address: "Greater Chicago Area",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d190337.088!2d-87.94011!3d41.833903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!",
      socials: [
        { label: "LinkedIn", href: "https://www.linkedin.com/in/jose-o-ortiz-msc-420670135/" },
        { label: "Connecting Dots", href: "https://www.connectingdotsforlatinx.com" },
      ],
    },

    // ======================
    // DISCLAIMER (optional)
    // ======================
    {
      id: "disclaimer",
      type: "disclaimer",
      visible: true,
      title: "Disclaimer",
      body:
        "All opinions are my own and do not represent any employer. Photos may include program participants with permission.",
      enabled: true,
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

    // ======================
    // FOOTER
    // ======================
    {
      id: "ftr",
      type: "footer",
      visible: true,
      columns: [
        {
          title: "Explore",
          links: [
            { label: "About", href: "#about" },
            { label: "Connecting Dots", href: "#cdots" },
            { label: "Work & Impact", href: "#work" },
            { label: "Events", href: "#events" },
          ],
        },
        {
          title: "Connect",
          links: [
            { label: "LinkedIn", href: "https://www.linkedin.com/in/jose-o-ortiz-msc-420670135/" },
            { label: "Connecting Dots", href: "https://www.connectingdotsforlatinx.com" },
            { label: "Email", href: emailHref },
          ],
        },
      ],
      legal: "© 2025 Jose O. Ortiz. All rights reserved.",
    },
  ],
};

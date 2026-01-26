import type { SiteConfig } from "@/types/site";

const LINKEDIN = "https://www.linkedin.com/in/fernando-rayas-357aa210/";
const CDOTS_WEBSITE = "https://www.connectingdotsforlatinx.com";
const EMAIL = "mrrayas1@gmail.com"

import backdropImg from "../../public/backdrop.jpg";

export const mockSiteConfig: SiteConfig = {
  theme: { preset: "festival", radius: "xl" },
  meta: {
    title: "Fernando Rayas — Connecting Dots for Latinx Professionals",
    description:
      "Mission-driven social impact innovator and bilingual leader (ENG/SPA). Co-founder of Connecting Dots for Latinx Professionals. Dedicated to faith-based community building, education, and leadership development.",
    favicon: "configs/jose-ortiz/assets/logo.png",
  },
  sections: [
    {
      id: "hdr",
      type: "header",
      visible: true,
      logoText: "Fernando Rayas",
      links: [
        { label: "Home", href: "/" },
        { label: "About", href: "#about" },
        { label: "Connecting Dots", href: "#cdots" },
        { label: "Work & Mission", href: "#work" },
        { label: "Events", href: "#events" },
        { label: "Contact", href: "#contact" },
      ],
      cta: {
        label: "Connect on LinkedIn",
        href: "https://www.linkedin.com/in/fernando-rayas-357aa210/",
      },
      style: { sticky: true, blur: true, elevation: "sm", transparent: false },
    },

    // HERO
    {
      id: "hero",
      type: "hero",
      visible: true,
      eyebrow: "Faith • Leadership • Community Impact",
      title: "Empowering People. Strengthening Communities.",
      subtitle:
        "I’m a mission-driven social innovator passionate about building community, advancing leadership, and creating systems rooted in equity. Bilingual (ENG/SPA). Co-founder of Connecting Dots for Latinx Professionals.",
      primaryCta: {
        label: "Connect on LinkedIn",
        href: "https://www.linkedin.com/in/fernando-rayas-357aa210/",
      },
      secondaryCta: {
        label: "Learn about Connecting Dots",
        href: "#cdots",
      },
      imageUrl: "configs/jose-ortiz/assets/fernando&omar.png",
    },

    // ABOUT
    {
      id: "about",
      type: "about",
      visible: true,
      title: "About Fernando",
      body:
        "With over a decade of experience in education, faith-based organizing, and social impact, I’ve worked to bridge community leadership and institutional change. From founding the *Parish Peace Project* to supporting Local School Councils at Chicago Public Schools, my mission has always been to build stronger, more connected communities.\n\nAs a bilingual leader and co-founder of *Connecting Dots for Latinx Professionals*, I’m committed to mentorship, empowerment, and creating spaces where Latinx professionals thrive.",
      imageUrl: "configs/jose-ortiz/assets/omar&fernando2.jpg",
      bullets: [
        "MSW, University of Illinois Chicago",
        "Community Engagement Specialist, CPS",
        "Founder, Parish Peace Project",
        "Co-Founder, Connecting Dots for Latinx Professionals",
      ],
      align: "left",
    },

    // WORK
    {
      id: "work",
      type: "features",
      visible: true,
      title: "Work & Mission",
      items: [
        {
          title: "Community Leadership",
          body:
            "Empowering leaders across faith-based and civic spaces to organize, collaborate, and lead with purpose.",
          imageUrl: "configs/jose-ortiz/assets/event2row.jpg",
          meta: [
            { label: "Approach", value: "Training & capacity-building" },
            { label: "Focus", value: "Civic engagement & inclusion" },
          ],
        },
        {
          title: "Faith-Based Organizing",
          body:
            "Bringing values of empathy, service, and social justice to community partnerships and education reform.",
          imageUrl: "configs/jose-ortiz/assets/event1speakers.jpg",
          meta: [
            { label: "Partners", value: "Archdiocese of Chicago, local parishes" },
            { label: "Method", value: "Dialogue, mentorship, reflection" },
          ],
        },
        {
          title: "Social Impact Strategy",
          body:
            "Designing community programs and mentorship initiatives that strengthen networks and uplift emerging leaders.",
          imageUrl: "configs/jose-ortiz/assets/event2table.jpg",
          meta: [
            { label: "Projects", value: "Parish Peace Project, Connecting Dots" },
            { label: "Skills", value: "Leadership, communications, organizing" },
          ],
        },
      ],
      bottomWaveType: "1-hill",
    },

    // SECTIONAL (core values)
    {
      id: "values",
      type: "sectional",
      visible: true,
      title: "Faith, Leadership, and Equity",
      body:
        "I believe in leadership that’s both compassionate and courageous — rooted in faith and expressed through service to others.",
      backgroundUrl: "configs/jose-ortiz/assets/hands.jpg",
      overlay: true,
      align: "center",
      height: "md",
    },

    // CONNECTING DOTS
    {
      id: "cdots",
      type: "features",
      visible: true,
      title: "Connecting Dots for Latinx Professionals",
      topWaveType: "1-hill",
      items: [
        {
          title: "Community First",
          body:
            "Connecting Latinx professionals across Chicago to share knowledge, celebrate identity, and build leadership pipelines.",
          imageUrl: "configs/jose-ortiz/assets/logo.png",
          imageSize: "sm",
        },
        {
          title: "Programs & Mentorship",
          body:
            "Design and facilitation of the Connecting Dots Mentorship Program — focusing on Legacy, Empowerment, and Transformation.",
          imageUrl: "configs/jose-ortiz/assets/event2row.jpg",
        },
        {
          title: "Empowerment Through Collaboration",
          body:
            "Creating sustainable networks for professionals to collaborate and create positive social impact.",
          imageUrl: "configs/jose-ortiz/assets/event2table.jpg",
        },
      ],
    },

    // STATS
    {
      id: "stats",
      type: "stats",
      visible: true,
      title: "Community in Numbers",
      subtitle: "Impact across leadership, faith, and mentorship",
      items: [
        { value: 1200, label: "Followers", suffix: "+", decimals: 0 },
        { value: 10, label: "Years of Community Leadership" },
        { value: 3, label: "Programs Founded" },
        { value: 25, label: "Mentorship Events", suffix: "+", decimals: 0 },
      ],
      style: { align: "center", columns: 4, divider: "dot", color: "primary" },
    },

    // TESTIMONIALS
    {
      id: "testimonials",
      type: "testimonials",
      visible: true,
      title: "What Colleagues Say",
      subtitle: "Purpose • Compassion • Leadership",
      items: [
        {
          quote:
            "Fernando has a gift for empowering others. His leadership style blends empathy, organization, and purpose.",
          name: "Community Leader",
          role: "Education Partner",
        },
        {
          quote:
            "He leads with faith and inclusivity — connecting people and ideas for the common good.",
          name: "Nonprofit Partner",
          role: "Mentor & Organizer",
        },
        {
          quote:
            "A steady and thoughtful voice in community development and social impact.",
          name: "Colleague",
          role: "CPS Education Specialist",
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

    // PERSONS (Team/Mentors/Speakers)
    {
      id: "persons",
      type: "persons",
      visible: true,
      title: "Mentors & Team",
      subtitle: "The dedicated leaders and mentors who make our community thrive",
      items: [
        {
          name: "Omar Rayas",
          title: "Co-Founder & Mentor",
          description: "Passionate about empowering Latinx professionals through mentorship and community building.",
          avatarUrl: "configs/jose-ortiz/assets/fernando&omar.png",
          badges: ["Leadership", "Mentorship", "Community Organizer"],
        },
        {
          name: "Community Leader",
          title: "Education Partner",
          description: "Dedicated to advancing educational opportunities and supporting emerging leaders.",
          badges: ["Education", "Advocacy", "Mentorship"],
        },
        {
          name: "Nonprofit Partner",
          title: "Mentor & Organizer",
          description: "Bringing faith and inclusivity to community development and social impact initiatives.",
          badges: ["Faith-Based Organizing", "Social Impact", "Leadership"],
        },
      ],
      style: {
        columns: 3,
        cardVariant: "default",
        rounded: "xl",
        align: "center",
      },
      topWaveType: "1-hill",
      backgroundClass: "bg-[var(--bg)]",
    },

    // GALLERY
    {
      id: "events",
      type: "gallery",
      visible: true,
      title: "Community & Faith in Action",
      subtitle: "Snapshots from programs and gatherings",
      style: { columns: 3, rounded: "xl", gap: "md" },
      items: [
        { imageUrl: "gallery/event1speakers.jpg", alt: "Speakers event" },
        { imageUrl: "gallery/event2table.jpg", alt: "Mentorship gathering" },
        { imageUrl: "gallery/eventGroup.png", alt: "Connecting Dots group" },
      ],
    },

    // CTA
    {
      id: "cta",
      type: "cta",
      visible: true,
      title: "Partnering for Purpose",
      body:
        "Let’s collaborate on initiatives that uplift leaders and strengthen our communities.",
      cta: { label: "Start a conversation", href: `mailto:${EMAIL}` },
    },

    // SOCIALS
    {
      id: "socials",
      type: "socials",
      visible: true,
      title: "Connect Online",
      subtitle: "Follow my work and stay involved",
      bottomWaveType: "1-hill",
      items: [
        {
          type: "linkedin",
          href: "https://www.linkedin.com/in/fernando-rayas-357aa210/",
          label: "LinkedIn",
        },
        {
          type: "instagram",
          href: "https://www.instagram.com/connectingdotslatinx/",
          label: "Instagram",
        },
        {
          type: "website",
          href: "https://www.connectingdotsforlatinx.com",
          label: "Connecting Dots",
        },
        {
          type: "email",
          href: EMAIL,
          label: "Email",
        },
      ],
      style: {
        background: "band",
        rounded: "xl",
        size: "md",
        gap: "md",
        align: "center",
      },
    },

    // CONTACT
    {
      id: "contact",
      type: "contact",
      visible: true,
      title: "Get in Touch",
      email: EMAIL,
      address: "Cicero, Illinois, United States",
      socials: [
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/fernando-rayas-357aa210/",
        },
        {
          label: "Connecting Dots",
          href: "https://www.connectingdotsforlatinx.com",
        },
      ],
      backgroundUrl: backdropImg.src,
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
        { label: "Connecting Dots", value: CDOTS_WEBSITE, size: 180 },
      ],
      backgroundClass: "bg-gradient-2-top",
      topWaveType: "1-hill",
    },

    // FOOTER
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
            { label: "Work & Mission", href: "#work" },
            { label: "Events", href: "#events" },
          ],
        },
        {
          title: "Connect",
          links: [
            {
              label: "LinkedIn",
              href: "https://www.linkedin.com/in/fernando-rayas-357aa210/",
            },
            {
              label: "Connecting Dots",
              href: CDOTS_WEBSITE,
            },
            { label: "Email", href: `mailto:${EMAIL}` },
          ],
        },
      ],
      legal: "© 2025 Fernando Rayas. All rights reserved.",
    },
  ],
};

// src/mocks/siteConfig.amanda.ts
import type { SiteConfig } from "@/types/site";

import main from '../../public/amanda/face.jpg';
import bg from '../../public/amanda/conserve.jpg';
import image1 from '../../public/amanda/mind.png';
import image2 from '../../public/amanda/book.png';
import image3 from '../../public/amanda/heart.png';
import image4 from '../../public/amanda/chat.png';
// import imageQ from '../../public/amanda/quote.jpg';

export const mockSiteConfig: SiteConfig = {
  theme: { preset: "grove", radius: "xl" },
  meta: {
    title: "Amanda Grau, BCBA",
    description:
      "Guided by compassion, grounded in science. Board Certified Behavior Analyst in the Chicago suburbs.",
    favicon: "/favicon.ico",
  },
  sections: [
    {
      visible:true,
      id: "hdr",
      type: "header",
      logoText: "Amanda Grau, BCBA",
      links: [
        { label: "About", href: "#about" },
        { label: "Services", href: "#services" },
        { label: "Experience", href: "#credentials" },
        { label: "Contact", href: "#contact" },
      ],
      cta: {
        label: "Connect on LinkedIn",
        href: 'https://www.linkedin.com/in/amanda-grau-7134071a2/',
      },
      style: {
        sticky: false,
        blur: true,
        elevation: "sm",
        transparent: false,
      },
    },
     {
      visible:true,
      id: "floating",
      type: "sectional",
      title: "Guided by compassion, grounded in science.",
      body: "",
      backgroundUrl: bg.src,
      overlay: true,
      height: "sm",
      },
    {
      visible:true,
      id: "hero",
      type: "hero",
      eyebrow: "Board Certified Behavior Analyst",
      title: "Amanda Grau",
      subtitle:
        "I support children with autism—and the adults who love and teach them—through compassionate, science-based strategies.",
      primaryCta: {
        label: "Connect on LinkedIn",
        href: "https://www.linkedin.com/in/amanda-grau-7134071a2/",
      },
      secondaryCta: { label: "Get in touch", href: "#contact" },
      imageUrl: main.src,
    },
    {
      visible:true,
      id: "about",
      type: "about",
      title: "About Amanda",
      body: `I’m Amanda Grau, a Board Certified Behavior Analyst based in the suburbs of Chicago, Illinois. I’ve worked in home, and clinic settings, supporting children with autism and their families. My approach is rooted in compassion, science, and a trauma-informed lens, always seeking to empower parents, teachers, and professionals with strategies that create meaningful change. I hold a Master of Applied Behavior Analysis with an emphasis in Autism Spectrum Disorder from Ball State University, and I’m passionate about neurodiversity-affirming care, ACT-informed practice, and contextual behaviorism.`,
      imageUrl: "",
    },
    {
      visible:true,
      id: "book",
      type: "features",
      title: "Book & Projects",
      items: [
        {
          title: "Quote Book (Upcoming)",
          body: "A curated collection of compassionate, science-informed quotes for parents, teachers, and professionals.",
          imageUrl: "/images/placeholders/book-cover.png",
          meta: [
            { label: "Format", value: "Print & Digital (TBD)" },
            { label: "Release", value: "TBD" },
          ],
        },
      ],
    },
    {
      visible:true,
      id: "services",
      type: "cta",
      title: "Services (Coming Soon)",
      body: "Parent consulting and CEUs are planned for the future. In the meantime, feel free to connect and follow along for updates.",
      cta: { label: "Get notified", href: "#newsletter" },
    },
    {
      visible:true,
      id: "floating2",
      type: "sectional",
      title: "\"A program is only as good as the relationship is strengthens\"",
      body: "- Dr. Rosemarie Griffin",
      backgroundUrl: bg.src,
      overlay: true
      },
      {
        visible:true,
  id: "credentials",
  type: "features",
  title: "Degrees, Certifications, & Experience",
  items: [
    {
      title: "Master of Applied Behavior Analysis (ASD Emphasis)",
      body: "Ball State University",
      meta: [{ label: "Location", value: "Muncie, IN" }],
    },
    {
      title: "Board Certified Behavior Analyst (BCBA)",
      body: "Issued by: Behavior Analyst Certification Board (BACB)",
      meta: [{ label: "Credential", value: "BACB" }],
    },
    {
      title: "Clinical Experience",
      body:
        "Home and clinic settings; supporting children with autism and their families across the Chicago suburbs.",
      meta: [{ label: "Regions", value: "Chicago Suburbs, IL" }],
    },
    {
      title: "Level One PEAK Certified",
      body:"PEAK Relational Training System is an evaluation and curriculum guide for teaching basic and advanced language skills from a contemporary behavior analytic approach.",
    },
    {
      title: "PDA North America level 1 and 2 certification",
      body: "Issued by: PDA North America"
    }
  ],
},
{
  visible:true,
  id: "skills",
  type: "skills",
  title: "Core Skills & Attributes",
  subtitle: "The values and practices guiding my work",
  items: [
    {
      title: "Neurodiversity-affirming",
      body: "Approach rooted in respect and acceptance.",
      imageUrl: image1.src,
    },
    {
      title: "ACT-Informed Practice",
      body: "Applied behavior analysis aligned with acceptance & commitment therapy.",
      imageUrl: image2.src,
    },
    {
      title: "Trauma-Informed Care",
      body: "Always aware of past experiences to ensure safety and support.",
      imageUrl: image3.src,
    },
    {
      title: "Parent & Teacher Coaching",
      body: "Empowering caregivers and educators with actionable strategies.",
       imageUrl: image4.src,
    },
  ],
  columns: 2,
},
    {
      visible:true,
      id: "contact",
      type: "contact",
      title: "Contact",
      email: "amandagrau22@gmail.com",
      address: "Naperville, IL",
      backgroundUrl: bg.src,
      socials: [
        { label: "My LinkedIn", href: "https://www.linkedin.com/in/amanda-grau-7134071a2/" },
      ],
    },
    {
      visible:true,
      id: "disclaimer",
      type: "disclaimer",
      title: "Disclaimer",
      body: "Information on this site is for educational purposes only and is not a substitute for professional advice or individualized services.",
      enabled: false,
    },
    {
      visible:true,
      id: "ftr",
      type: "footer",
      columns: [
        {
          title: "Explore",
          links: [
            { label: "About", href: "#about" },
            { label: "Services", href: "#services" },
            { label: "Experience", href: "#credentials" },
            
          ],
        },
        {
          title: "Connect",
          links: [
            {
              label: "LinkedIn",
              href: "https://www.linkedin.com/in/amanda-grau-7134071a2/",
            },
            { label: "Email", href: "mailto:amandagrau22@gmail.com" },
          ],
        },
      ],
      legal: "© 2025 Amanda Grau. All rights reserved. Designed and developed by Stricker Digital.",
    },
  ],
};
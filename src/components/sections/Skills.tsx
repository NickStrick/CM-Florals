// src/sections/Skills.tsx
'use client';

import type { SkillsSection } from '@/types/site';
import AnimatedSection from '@/components/AnimatedSection';
import Image from "next/image";

export default function Skills({
  title,
  subtitle,
  items,
  id,
  columns = 3,
  backgroundClass ='bg-[var(--bg)]',
}: SkillsSection) {
  return (
    <section id={id} className={`py-16 ${backgroundClass} text-[var(--text-1)] `}>
      <div className="container mx-auto px-4">
        {title && (
          <AnimatedSection><h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8">
            {title}
          </h2></AnimatedSection>
        )}
        {subtitle && (
          <AnimatedSection><p className="text-center text-muted  mb-8">{subtitle}</p></AnimatedSection>
        )}

        <div
          className={`grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-${columns}`}
        >
          {items.map((skill, i) => (
            <AnimatedSection key={i} delay={i * 0.08}
              className="skill-item flex flex-col items-center text-center p-6 rounded-xl shadow-sm bg-white/70 backdrop-blur"
            >
              {skill.imageUrl && (
                <Image
                width={60}
                height={60}
                  src={skill.imageUrl}
                  alt={skill.title}
                  className="w-12 h-12 mb-4 object-contain"
                />
              )}
              <h3 className="text-xl font-semibold text-[var(--fg)]">
                {skill.title}
              </h3>
              {skill.body && (
                <p className="text-[var(--fg)]/80 mt-2">{skill.body}</p>
              )}
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

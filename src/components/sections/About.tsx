// src/sections/About.tsx
'use client';
import type { AboutSection } from '@/types/site';
import AnimatedSection from '@/components/AnimatedSection';
import { motion } from 'framer-motion';
import Image from "next/image";

export function About({ id, title = 'About', body, imageUrl, bullets, align = 'left', backgroundClass = 'bg-[var(--bg)' }: AboutSection) {
  const imageFirst = align === 'left';
  return (
    <section id={id} className={`section !py-6 !pt-12 ${backgroundClass} !pb-8`}>
      <div className={`container mx-auto px-4 grid gap-10 ${imageUrl?'md:grid-cols-2':'md:grid-cols-1'} items-center `}>
        {imageUrl && imageFirst && (
          <motion.div
              initial={{ opacity: 0, scale: .94, y: 16 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: .6, ease: 'easeOut', delay: .1 }}
              className="relative w-fit mx-auto"
            >
            {/* <div className="absolute -inset-6 rounded-full bg-[color-mix(in_srgb,var(--primary)_18%,transparent)] blur-2xl z-0" /> */}
            <div className="overflow-hidden rounded-full max-h-[600px] max-w-[600px] z-2 relative">
              <Image width={600} height={600} src={imageUrl} alt={title} className="w-full rounded-xl object-cover" />
            </div>
          </motion.div>
        )}
        <AnimatedSection className="mx-auto max-w-6xl">
          {title && <h2 className="text-3xl font-semibold mb-4 text-center text-muted">{title}</h2>}
          <p className="text-lg leading-relaxed indent-[50px]">{body}</p>
          {bullets && bullets.length > 0 && (
            <ul className="mt-6 space-y-2 list-disc pl-5">
              {bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          )}
        </AnimatedSection>
        {imageUrl && !imageFirst && (
          // <Image src={imageUrl} alt={title} className="w-full rounded-xl object-cover py-[15px]" />
          <motion.div
              initial={{ opacity: 0, scale: .94, y: 16 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: .6, ease: 'easeOut', delay: .1 }}
              className="relative"
            >
              {/* soft blob shadow */}
              {/* <div className="absolute -inset-6 rounded-full bg-[color-mix(in_srgb,var(--primary)_18%,transparent)] blur-2xl -z-10" /> */}
              <div className="overflow-hidden rounded-full max-h-[380px] max-w-[380px] mx-auto">
                <Image src={imageUrl} alt="" width={980} height={740} className="w-full h-auto" />
              </div>
            </motion.div>
        )}
      </div>
    </section>
  );
}

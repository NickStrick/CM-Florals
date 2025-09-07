'use client';
import type { HeroSection } from '@/types/site';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';

export function Hero({ id, eyebrow, title, subtitle, primaryCta, secondaryCta, imageUrl }: HeroSection) {
  return (
    <section id={id} className="section curve bg-app bg-gradient-1">
      <AnimatedSection>
        <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-[4rem] md:gap-[10rem] items-center">
          <div>
            {eyebrow ? <p className="h-eyebrow mb-3">{eyebrow}</p> : null}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: .6, ease: 'easeOut', delay: .05 }}
              className="h-display mb-4"
            >
              {title}
            </motion.h1>
            {subtitle ? (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: .15 }}
                className="h-hero-p text-muted text-lg max-w-xl mb-8"
              >
                {subtitle}
              </motion.p>
            ) : null}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: .25 }} className="flex flex-wrap gap-4">
              {primaryCta && <Link href={primaryCta.href} className="btn-gradient">{primaryCta.label}</Link>}
              {secondaryCta && <Link href={secondaryCta.href} className="btn-gradient-inverted">{secondaryCta.label}</Link>}
            </motion.div>
          </div>

          {imageUrl ? (
            <motion.div
              initial={{ opacity: 0, scale: .94, y: 16 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: .6, ease: 'easeOut', delay: .1 }}
              className="relative w-fit mx-auto"
            >
              {/* soft blob shadow */}
              <div className="absolute -inset-6 rounded-full bg-[color-mix(in_srgb,var(--primary)_18%,transparent)] blur-2xl -z-10" />
              <div className="overflow-hidden rounded-full max-h-[380px] max-w-[380px] sm:min-w-[380px] sm:min-h-[380px] ">
                <Image src={imageUrl} alt="" width={980} height={740} className="w-full h-auto sm:min-w-[380px] sm:min-h-[380px]" loading='eager' />
              </div>
            </motion.div>
          ) : null}
        </div>
      </AnimatedSection>
    </section>
  );
}

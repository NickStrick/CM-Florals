'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';
import type { GallerySection } from '@/types/site';

// map helpers
const gaps: Record<string, string> = {
  sm: 'gap-3 [&>figure]:mb-3',
  md: 'gap-4 [&>figure]:mb-4',
  lg: 'gap-6 [&>figure]:mb-6',
};

export default function Gallery({
  id,
  title = 'Gallery',
  subtitle,
  items,
  style,
  backgroundClass = 'bg-[var(--bg)]',
}: GallerySection) {
  const rounded =
    style?.rounded === '2xl'
      ? 'rounded-3xl'
      : style?.rounded === 'lg'
      ? 'rounded-xl'
      : 'rounded-2xl';

  // responsive masonry columns (like the reference)
  const cols =
    style?.columns === 4
      ? 'columns-1 sm:columns-2 md:columns-3 xl:columns-4'
      : style?.columns === 2
      ? 'columns-1 sm:columns-2'
      : 'columns-1 sm:columns-2 md:columns-3'; // default 3

  const gapCls = gaps[style?.gap ?? 'md'];

  return (
    <section id={id} className={`section ${backgroundClass}`}>
      <div className="mx-auto max-w-6xl">
        {(title || subtitle) && (
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-8">
            {title && <h2 className="text-4xl md:text-5xl font-extrabold">{title}</h2>}
            {subtitle && <p className="text-muted mt-3">{subtitle}</p>}
          </AnimatedSection>
        )}

        {/* Masonry via CSS columns; each figure uses break-inside-avoid */}
        <div className={`${cols} ${gapCls} [column-fill:_balance]`}>
          {items.map((img, i) => (
            <motion.figure
              key={`${img.imageUrl}-${i}`}
              initial={{ opacity: 0, y: 22, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
              className={`break-inside-avoid overflow-hidden ${rounded} shadow-[0_10px_30px_rgba(0,0,0,.12)] bg-[var(--bg)]`}
            >
              <Image
                src={img.imageUrl}
                alt={img.alt ?? 'Gallery image'}
                width={1200}
                height={1600}
                className="w-full h-auto object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                priority={i < 4} // speed first row
              />
              {img.caption && (
                <figcaption className="p-3 text-sm text-muted">{img.caption}</figcaption>
              )}
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

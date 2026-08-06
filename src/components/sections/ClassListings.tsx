'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import type { ClassListingsSection, ClassItem } from '@/types/site';
import AnimatedSection from '@/components/AnimatedSection';
import { motion } from 'framer-motion';
import { resolveAssetUrl } from '@/lib/assetUrl';
import { useSite } from '@/context/SiteContext';
import ClassDetailModal from './ClassDetailModal';

function cls(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(' ');
}

function formatPrice(cents: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100);
}

export default function ClassListings({
  id,
  title,
  subtitle,
  classItemIds,
  style,
  showAllThreshold = 3,
  buyCtaFallback = 'Book Now',
}: ClassListingsSection) {
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<ClassItem | null>(null);
  const { config } = useSite();

  const catalog = useMemo(() => config?.classes?.classItems ?? [], [config?.classes?.classItems]);
  const classes = useMemo<ClassItem[]>(() => {
    if (!classItemIds?.length) return [];
    return classItemIds
      .map((cid) => catalog.find((c) => c.id === cid))
      .filter((c): c is ClassItem => c !== undefined);
  }, [classItemIds, catalog]);

  const hasOverflow = classes.length > showAllThreshold;
  const visible = useMemo(
    () => (showAll ? classes : classes.slice(0, showAllThreshold)),
    [classes, showAll, showAllThreshold]
  );

  const cardInk = style?.cardVariant === 'ink';
  const cols = style?.columns ?? 3;

  const smGridColsClass = cols <= 1 ? 'sm:grid-cols-1' : 'sm:grid-cols-2';
  const lgGridColsClass =
    cols === 1
      ? 'lg:grid-cols-1'
      : cols === 2
        ? 'lg:grid-cols-2'
        : cols === 3
          ? 'lg:grid-cols-3'
          : cols === 4
            ? 'lg:grid-cols-4'
            : 'lg:grid-cols-5';

  if (classes.length === 0) return null;

  return (
    <>
      <section id={id} className="section">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="relative w-fit mx-auto"
          >
            <div className="mb-10 text-center">
              {title && <h2 className="h-display mt-2">{title}</h2>}
              {subtitle && <p className="mt-4 h-hero-p opacity-80 max-w-2xl mx-auto">{subtitle}</p>}
            </div>
          </motion.div>

          <div className={cls('grid gap-1', smGridColsClass, lgGridColsClass)}>
            {visible.map((c, i) => {
              const thumb = resolveAssetUrl(c.thumbnailUrl ?? c.images?.[0]?.url);
              const hasTimes = (c.classTimeIds ?? []).length > 0;

              return (
                <AnimatedSection key={c.id + '-' + i}>
                  <div
                    className="relative h-full overflow-hidden card-ink card-interactive flex flex-col card-hover cursor-pointer"
                    onClick={() => setSelected(c)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setSelected(c);
                    }}
                    aria-label={`View details for ${c.name}`}
                  >
                    {c.badges && c.badges.length > 0 && style?.showBadges !== false && (
                      <div className="absolute top-3 left-4 flex gap-2 flex-wrap">
                        {c.badges.map((b, bi) => (
                          <span key={b + bi} className="rounded-full border px-3 py-1 text-xs font-medium opacity-90">
                            {b}
                          </span>
                        ))}
                      </div>
                    )}
                    {!hasTimes && (
                      <div className="absolute top-3 right-4">
                        <span className="rounded-full border px-3 py-1 text-xs font-semibold opacity-80">
                          Coming soon
                        </span>
                      </div>
                    )}

                    {thumb ? (
                      <Image src={thumb} alt={c.name} className="w-full h-auto feature-image" width={400} height={300} />
                    ) : (
                      <div className="w-full aspect-[4/3] bg-black/10" />
                    )}

                    <div className={cls('flex-1 flex flex-col p-6 sm:p-7 md:p-8 pt-4', cardInk && 'card-ink')}>
                      <h3 className="text-2xl font-semibold">{c.name}</h3>
                      {c.subtitle && <p className="mt-2 opacity-90">{c.subtitle}</p>}
                      <div className="mt-6 flex items-end gap-2">
                        <div className="text-3xl font-extrabold leading-none">
                          {formatPrice(c.price, c.currency)}
                        </div>
                        {typeof c.compareAtPrice === 'number' && c.compareAtPrice > c.price && (
                          <div className="pb-1 text-sm opacity-70 line-through">
                            {formatPrice(c.compareAtPrice, c.currency)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>

          {hasOverflow && (
            <div className="mt-8 text-center">
              <button className="btn btn-gradient rounded-[999px]" onClick={() => setShowAll((x) => !x)}>
                {showAll ? 'Show Less' : 'Show All'}
              </button>
            </div>
          )}
        </div>
      </section>

      {selected && (
        <ClassDetailModal
          classItem={selected}
          onClose={() => setSelected(null)}
          buyCtaFallback={buyCtaFallback}
        />
      )}
    </>
  );
}

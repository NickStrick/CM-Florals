'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import type { ProductListingsSection, Product } from '@/types/site';
import AnimatedSection from '@/components/AnimatedSection';
import { motion } from 'framer-motion';
import ProductDetailModal from './ProductDetailModal';
import { resolveAssetUrl } from '@/lib/assetUrl';

import CartModal from '../payments/CartModal';
import PaymentPage from '../payments/PaymentPage';
import { useCart } from '@/context/CartContext';

function cls(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(' ');
}

function formatPrice(cents: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}
export default function ProductListings({
  id,
  title,
  subtitle,
  products,
  detailsEnabled,
  cartActive,
  checkoutInputs,
  googleFormUrl,
  googleFormOptions,
  paymentType,
  externalPaymentUrl,
  style,
  showAllThreshold = 3,
  buyCtaFallback = 'Buy Now',
}: ProductListingsSection) {
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const { addItem, openCart } = useCart();

  const hasOverflow = (products?.length ?? 0) > showAllThreshold;
  const visible = useMemo(
    () => (showAll ? products : products.slice(0, showAllThreshold)),
    [products, showAll, showAllThreshold]
  );

  const cardInk = style?.cardVariant === 'ink';
  const cols = style?.columns ?? 3; // only affects small screens; lg caps at 3

  return (
    <>
    {cartActive && <CartModal />}
    {cartActive && (
      <PaymentPage
        checkoutInputs={checkoutInputs}
        googleFormUrl={googleFormUrl}
        googleFormOptions={googleFormOptions}
        paymentType={paymentType}
        externalPaymentUrl={externalPaymentUrl}
      />
    )}
    <section id={id} className="section sectionAboveWavePad">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="relative w-fit mx-auto"
        >
          <div className="mb-10 text-center">
            {title && <h2 className="h-display mt-2">{title}</h2>}
            {subtitle && (
              <p className="mt-4 h-hero-p opacity-80 max-w-2xl mx-auto">{subtitle}</p>
            )}
          </div>
        </motion.div>

        <div className={`grid gap-6 sm:grid-cols-${Math.min(cols, 2)} lg:grid-cols-${cols}`}>
          {visible.map((p, i) => {
            const thumb = resolveAssetUrl(p.thumbnailUrl ?? p.images?.[0]?.url);
            const priceStr = formatPrice(p.price, p.currency ?? 'USD');
            const compareStr =
              typeof p.compareAtPrice === 'number' && p.compareAtPrice > p.price
                ? formatPrice(p.compareAtPrice, p.currency ?? 'USD')
                : null;

            return (
              <AnimatedSection key={p.id + '-' + i}>
                <div className={cls(
                  'relative h-full p-6 sm:p-7 md:p-8 card-ink card-interactive flex flex-col',
                  cardInk && 'card-ink'
                )}>
                  {/* Badge row */}
                  {p.badges && p.badges.length > 0 && style?.showBadges !== false && (
                    <div className="absolute top-3 left-4 flex gap-2 flex-wrap">
                      {p.badges.map((b, bi) => (
                        <span key={b + bi} className="rounded-full border px-3 py-1 text-xs font-medium opacity-90">
                          {b}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Image */}
                  {thumb ? (
                    <Image src={thumb} alt={p.name} className="w-full h-auto rounded-xl mb-4 mt-3 feature-image" width={400} height={300} />
                  ) : (
                    <div className="w-full aspect-[4/3] bg-black/10 rounded-xl mb-4" />
                  )}

                  {/* Header */}
                  <header>
                    <h3 className="text-2xl font-semibold">{p.name}</h3>
                    {p.subtitle && <p className="mt-2 opacity-90">{p.subtitle}</p>}
                    <div className="mt-6 flex items-end gap-2">
                      <div className="text-3xl font-extrabold leading-none">{priceStr}</div>
                      {compareStr && (
                        <div className="pb-1 text-sm opacity-70 line-through">{compareStr}</div>
                      )}
                    </div>
                    {p.summary && <p className="mt-3 text-sm opacity-90">{p.summary}</p>}
                  </header>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto">
                    {detailsEnabled?<button
                      className={cls(
                        'btn mt-6 w-full justify-center',
                        cardInk ? 'btn-gradient btn-white-outline' : 'btn-gradient-inverted'
                      )}
                      onClick={() => setSelected(p)}
                      aria-label={`View details for ${p.name}`}
                    >
                      Details
                    </button>: null}
                    {p.purchaseUrl && (
                      <a
                        href={p.purchaseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn mt-6 btn-gradient btn-white-outline w-full justify-center"
                      >
                        {p.ctaLabel ?? buyCtaFallback}
                      </a>
                    )}
                    {cartActive && (
                      <button
                      className={cls(
                        'btn mt-6 w-full justify-center', 'btn-gradient btn-white-outline' 
                      )}
                      onClick={() => { addItem({ id: p.id, name: p.name, price: p.price, currency: p.currency, imageUrl: thumb ?? undefined }); openCart(); }}
                      aria-label={`Add ${p.name} to cart`}
                    >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        {hasOverflow && (
          <div className="mt-8 text-center">
            <button className="btn btn-gradient" onClick={() => setShowAll((x) => !x)}>
              {showAll ? 'Show Less' : 'Show All'}
            </button>
          </div>
        )}
      </div>

      {selected && (
        <ProductDetailModal
          product={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
    </>
  );
}

'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/types/site';
import { motion } from 'framer-motion';
import { resolveAssetUrl } from '@/lib/assetUrl';

type Props = {
  product: Product;
  onClose: () => void;
};

function formatPrice(cents: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format((cents || 0) / 100);
}

// Normalize colors: allow string[] or {name, hex?, imageUrl?}[]
type NormColor = { name: string; hex?: string; imageUrl?: string };
function normalizeColors(colors: Product['colors']): NormColor[] {
  if (!Array.isArray(colors)) return [];
  return colors.map((c: unknown) => {
    if (c && typeof c === 'object') {
      const obj = c as Record<string, unknown>;
      return {
        name: String(obj.name ?? ''),
        hex: typeof obj.hex === 'string' ? obj.hex : undefined,
        imageUrl: typeof obj.imageUrl === 'string' ? obj.imageUrl : undefined,
      };
    }
    return { name: String(c) };
  });
}

// Normalize sizes: allow string[] or {label, value?}[]
type NormSize = { label: string; value?: string };
function normalizeSizes(sizes: Product['sizes']): NormSize[] {
  if (!Array.isArray(sizes)) return [];
  return sizes.map((s: unknown) => {
    if (s && typeof s === 'object') {
      const obj = s as Record<string, unknown>;
      return {
        label: String(obj.label ?? ''),
        value: typeof obj.value === 'string' ? obj.value : undefined,
      };
    }
    return { label: String(s) };
  });
}

export default function ProductDetailModal({ product, onClose }: Props) {
  const {
    name,
    subtitle,
    price = 0,
    compareAtPrice,
    currency = 'USD',
    images = [],
    description,
    badges,
    purchaseUrl,
    ctaLabel = 'Buy Now',
    colors: rawColors,
    sizes: rawSizes,
  } = product;

  // Normalize variants defensively
  const colors = useMemo(() => normalizeColors(rawColors), [rawColors]);
  const sizes  = useMemo(() => normalizeSizes(rawSizes), [rawSizes]);

  // Main image with thumbnail switch
  const [mainIndex, setMainIndex] = useState(0);
  const mainImage = useMemo(() => {
    const src = images[mainIndex]?.url ?? product.thumbnailUrl ?? '';
    return resolveAssetUrl(src);
  }, [images, mainIndex, product.thumbnailUrl]);

  // Variant selection
  const [selectedColor, setSelectedColor] = useState<NormColor | null>(colors[0] ?? null);
  const [selectedSize, setSelectedSize]   = useState<NormSize  | null>(sizes[0]  ?? null);

  const canBuy = !!purchaseUrl && (product.stock ?? 'in_stock') !== 'out_of_stock';

  return (
    <div className="fixed inset-0 z-[1200] bg-black/60 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="card card-modal relative w-full max-w-3xl p-0 overflow-hidden"
      >
        <button
          className="absolute right-3 top-3 btn btn-ghost"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-0">
          {/* Media */}
          <div className="p-4 md:p-6 border-b md:border-b-0 md:border-r">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={images[mainIndex]?.alt ?? name}
                className="w-full h-auto rounded-xl"
                width={400}
                height={400}
                style={{ width: '100%', height: 'auto' }}
              />
            ) : (
              <div className="w-full aspect-[4/3] bg-black/10 rounded-xl" />
            )}

            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {images.slice(0, 5).map((im, idx) => {
                  const resolved = resolveAssetUrl(im.url);
                  const isActive = idx === mainIndex;
                  if (!resolved) return null;
                  return (
                    <button
                      type="button"
                      key={im.url + idx}
                      onClick={() => setMainIndex(idx)}
                      className={`rounded-lg overflow-hidden border ${
                        isActive ? 'border-primary' : 'border-transparent opacity-90 hover:opacity-100'
                      }`}
                      aria-label={`Show image ${idx + 1}`}
                    >
                      <Image
                        src={resolved}
                        alt={im.alt ?? `${name} ${idx + 1}`}
                        className="w-full h-auto block"
                        width={80}
                        height={80}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-4 md:p-6 space-y-4">
            <div>
              {badges && badges.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {badges.map((b, i) => (
                    <span key={b + i} className="rounded-full border px-2 py-0.5 text-xs opacity-90">
                      {b}
                    </span>
                  ))}
                </div>
              )}
              <h3 className="text-2xl font-semibold">{name}</h3>
              {subtitle && <p className="mt-1 opacity-80">{subtitle}</p>}
            </div>

            <div className="flex items-end gap-3">
              <div className="text-3xl font-extrabold leading-none">
                {formatPrice(price, currency)}
              </div>
              {typeof compareAtPrice === 'number' && compareAtPrice > price && (
                <div className="pb-1 text-sm line-through opacity-60">
                  {formatPrice(compareAtPrice, currency)}
                </div>
              )}
            </div>

            {description && <p className="text-sm opacity-90 whitespace-pre-wrap">{description}</p>}

            {/* Color selector */}
            {colors.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Color</div>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => {
                    const active = selectedColor?.name === c.name;
                    const swatchBg = c.hex ? { backgroundColor: c.hex } : undefined;
                    return (
                      <button
                        key={`color-${c.name}`}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`px-3 py-1 rounded-full border text-sm ${
                          active ? 'border-primary' : 'border-black/10 hover:border-black/30'
                        }`}
                        title={c.name}
                      >
                        <span className="inline-flex items-center gap-2">
                          {c.hex && (
                            <span
                              className="inline-block w-3 h-3 rounded-full border"
                              style={swatchBg}
                            />
                          )}
                          {c.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size selector */}
            {sizes.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Size</div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => {
                    const label = s.label || s.value || '';
                    const active = (selectedSize?.label || selectedSize?.value) === (s.label || s.value);
                    return (
                      <button
                        key={`size-${label}`}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1 rounded-full border text-sm ${
                          active ? 'border-primary' : 'border-black/10 hover:border-black/30'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            {/* <div className="space-y-2">
              <label className="block text-sm font-medium">Quantity</label>
              <input
                type="number"
                min={1}
                className="input w-24"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              />
            </div> */}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <ul className="space-y-1">
                {product.features.map((f, i) => (
                  <li key={i} className="text-sm opacity-90">• {f}</li>
                ))}
              </ul>
            )}

            {/* Specs */}
            {product.specs && product.specs.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {product.specs.map((s, i) => (
                  <div key={i} className="text-sm">
                    <span className="opacity-70">{s.label}:</span> {s.value}
                  </div>
                ))}
              </div>
            )}

            {/* CTA */}
            {purchaseUrl && (
              <a
                href={purchaseUrl}
                className={`btn w-full justify-center mt-2 ${canBuy ? 'btn-gradient' : 'btn-ghost'}`}
                rel="noopener noreferrer"
                target="_blank"
                aria-disabled={!canBuy}
              >
                {canBuy ? ctaLabel : 'Out of stock'}
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

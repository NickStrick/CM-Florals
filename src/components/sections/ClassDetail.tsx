'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ClassDetailSection } from '@/types/site';
import { resolveAssetUrl } from '@/lib/assetUrl';
import { useCart } from '@/context/CartContext';
import { useSite } from '@/context/SiteContext';
import { getSiteId } from '@/lib/siteId';
import {
  buildClassLineItemId,
  buildVariantLabel,
  effectivePriceForSelection,
  normalizeOptionGroups,
  normalizeSelection,
} from '@/lib/productOptions';
import ClassTimePicker, { type ClassAvailability } from './ClassTimePicker';

function formatPrice(cents: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format((cents || 0) / 100);
}

function formatTimeLabel(time: string): string {
  const [hStr, mStr] = time.split(':');
  const h = Number(hStr);
  const m = Number(mStr);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return time;
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

export default function ClassDetail({ id, classItemId, buyCtaFallback = 'Book Now' }: ClassDetailSection) {
  const { config } = useSite();
  const { addItem, openCart } = useCart();
  const siteId = getSiteId();

  const classItem = useMemo(
    () => (config?.classes?.classItems ?? []).find((c) => c.id === classItemId) ?? null,
    [config?.classes?.classItems, classItemId]
  );

  const payments = config?.settings?.payments;
  const cartActive = payments?.cartActive === true;

  const classTimes = useMemo(() => {
    if (!classItem) return [];
    const all = config?.classes?.classTimes ?? [];
    const assigned = new Set(classItem.classTimeIds ?? []);
    return all.filter((t) => assigned.has(t.id));
  }, [config?.classes?.classTimes, classItem]);

  const optionGroups = useMemo(() => normalizeOptionGroups(classItem?.options), [classItem?.options]);
  const [selectedByGroup, setSelectedByGroup] = useState<Record<string, string>>({});
  const selection = useMemo(
    () => normalizeSelection(optionGroups, selectedByGroup),
    [optionGroups, selectedByGroup]
  );
  const effectivePrice = useMemo(
    () => (classItem ? effectivePriceForSelection(classItem.price, optionGroups, selection) : 0),
    [classItem, optionGroups, selection]
  );

  const [selectedTimeId, setSelectedTimeId] = useState<string | null>(null);
  const selectedTime = classTimes.find((t) => t.id === selectedTimeId) ?? null;

  const [availability, setAvailability] = useState<ClassAvailability>({});
  useEffect(() => {
    if (!classItem) return;
    const ids = classTimes.map((t) => t.id);
    if (ids.length === 0) return;
    const params = new URLSearchParams({ businessId: siteId, classTimeIds: ids.join(',') });
    fetch(`/api/classes/availability?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.availability) setAvailability(data.availability);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId, classItem?.id]);

  const [added, setAdded] = useState(false);
  const [mainIndex, setMainIndex] = useState(0);

  // If an admin swaps which class this section points to (live preview), don't
  // carry over the old class's option/time/image selection.
  useEffect(() => {
    setSelectedByGroup({});
    setSelectedTimeId(null);
    setAdded(false);
    setMainIndex(0);
  }, [classItemId]);

  if (!classItem) return null;

  const images = classItem.images ?? [];
  const mainImage = resolveAssetUrl(images[mainIndex]?.url ?? classItem.thumbnailUrl);
  const thumb = resolveAssetUrl(classItem.thumbnailUrl ?? images[0]?.url);

  const handleAddToCart = () => {
    if (!selectedTime) return;
    const variantLabel = buildVariantLabel(optionGroups, selection);
    const itemId = buildClassLineItemId(classItem.id, selectedTime.id, selection);
    const timeLabel = `${new Date(`${selectedTime.date}T00:00:00`).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })} · ${formatTimeLabel(selectedTime.startTime)}`;
    const itemName = variantLabel ? `${classItem.name} (${variantLabel})` : classItem.name;

    addItem({
      id: itemId,
      name: itemName,
      price: effectivePrice,
      currency: classItem.currency,
      imageUrl: thumb ?? undefined,
      options: selection,
      classItemId: classItem.id,
      classTimeId: selectedTime.id,
      classTimeLabel: timeLabel,
      classLocation: selectedTime.location || undefined,
    });
    setAdded(true);
    openCart();
  };

  return (
    <section id={id} className="section">
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Media */}
          <div>
            {mainImage ? (
              <div className="w-full max-h-[560px] flex items-center justify-center overflow-hidden rounded-xl">
                <img
                  src={mainImage}
                  alt={images[mainIndex]?.alt ?? classItem.name}
                  className="rounded-xl object-contain w-full h-full"
                  style={{ maxHeight: '560px', width: 'auto', height: 'auto', maxWidth: '100%' }}
                />
              </div>
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
                      className={`overflow-hidden border product-select ${
                        isActive ? 'bg-gradient-colored' : 'border-2 border-transparent opacity-90 hover:opacity-100'
                      }`}
                      aria-label={`Show image ${idx + 1}`}
                    >
                      <div className="w-full max-h-[100px] flex items-center justify-center overflow-hidden">
                        <img
                          src={resolved}
                          alt={im.alt ?? `${classItem.name} ${idx + 1}`}
                          className="object-contain block w-full h-full"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4 text-[var(--text-1)]">
            <div>
              {classItem.badges && classItem.badges.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {classItem.badges.map((b, i) => (
                    <span key={b + i} className="rounded-full border border-[var(--text-1)] px-2 py-0.5 text-xs opacity-90">
                      {b}
                    </span>
                  ))}
                </div>
              )}
              <h2 className="text-2xl md:text-3xl font-semibold">{classItem.name}</h2>
              {classItem.subtitle && <p className="mt-1 opacity-80">{classItem.subtitle}</p>}
            </div>

            <div className="flex items-end gap-3">
              <div className="text-3xl font-extrabold leading-none">
                {formatPrice(effectivePrice, classItem.currency)}
              </div>
              {typeof classItem.compareAtPrice === 'number' && classItem.compareAtPrice > effectivePrice && (
                <div className="pb-1 text-sm line-through opacity-70">
                  {formatPrice(classItem.compareAtPrice, classItem.currency)}
                </div>
              )}
            </div>

            {classItem.description && (
              <p className="text-sm opacity-90 whitespace-pre-wrap">{classItem.description}</p>
            )}

            {/* Options */}
            {optionGroups.length > 0 && (
              <div className="space-y-4">
                {optionGroups.map((g) => {
                  const selectedKey = selection[g.label] ?? '';
                  return (
                    <div key={`opt-${g.label}`} className="space-y-2">
                      <div className="text-sm font-medium">{g.label}</div>
                      <div className="flex flex-wrap gap-2">
                        {g.optionItems.map((it) => {
                          const key = it.value ?? it.label;
                          const active = key === selectedKey;
                          return (
                            <button
                              key={`opt-${g.label}-${key}`}
                              type="button"
                              onClick={() => setSelectedByGroup((cur) => ({ ...cur, [g.label]: key }))}
                              className={`px-3 py-1 border product-select ${
                                active ? 'bg-gradient-colored' : 'border-black/50 hover:border-black/60 border-2'
                              }`}
                            >
                              {it.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Time picker / booking */}
            {!cartActive ? (
              <p className="text-sm text-muted">Booking isn&apos;t available on this site yet.</p>
            ) : (
              <div className="space-y-2">
                <div className="text-sm font-medium">Choose a time</div>
                <ClassTimePicker
                  key={classItem.id}
                  classTimes={classTimes}
                  selectedTimeId={selectedTimeId}
                  onSelect={setSelectedTimeId}
                  availability={availability}
                />

                {selectedTime && (
                  <div className="rounded-lg border border-[var(--text-1)]/15 bg-[var(--bg-2)]/60 px-3 py-2 text-sm space-y-0.5">
                    <div className="font-medium">
                      {new Date(`${selectedTime.date}T00:00:00`).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}{' '}
                      · {formatTimeLabel(selectedTime.startTime)}
                      {selectedTime.endTime ? ` – ${formatTimeLabel(selectedTime.endTime)}` : ''}
                    </div>
                    {selectedTime.location && <div className="opacity-80">📍 {selectedTime.location}</div>}
                    {(() => {
                      const remaining = availability[selectedTime.id]?.remaining;
                      if (typeof remaining !== 'number') return null;
                      return (
                        <div className="opacity-80">
                          {remaining} spot{remaining === 1 ? '' : 's'} left
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {cartActive && (
              <button
                className="btn w-full justify-center mt-2 btn-gradient"
                type="button"
                disabled={!selectedTime}
                onClick={handleAddToCart}
              >
                {added ? 'Added — pick another time?' : selectedTime ? (classItem.ctaLabel || buyCtaFallback) : 'Select a time to continue'}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

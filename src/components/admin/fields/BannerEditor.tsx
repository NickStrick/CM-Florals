'use client';

import { useMemo } from 'react';
import type { BannerSection, BannerVariant } from '@/types/site';
import { resolveAssetUrl } from '@/lib/assetUrl';
import { useSite } from '@/context/SiteContext';
import type { EditorProps } from './types';

// infer mode from href
function hrefKind(href?: string) {
  if (!href) return { kind: 'external' as const, sectionId: '' };
  if (href === '/') return { kind: 'internal' as const, sectionId: '/' };
  if (href.startsWith('/#')) return { kind: 'internal' as const, sectionId: href.slice(2) };
  if (href.startsWith('#')) return { kind: 'internal' as const, sectionId: href.slice(1) };
  if (href.startsWith('/')) return { kind: 'sub-page' as const, sectionId: '' };
  return { kind: 'external' as const, sectionId: '' };
}

export function EditBanner({
  section,
  onChange,
  openMediaPicker,
  siteId,
}: EditorProps<BannerSection>) {
  const { config } = useSite();
  const allSections = useMemo(() => config?.sections ?? [], [config?.sections]);
  const allPages = useMemo(() => config?.pages ?? [], [config?.pages]);

  const cta = section.cta;
  const { kind, sectionId } = hrefKind(cta?.href);

  const setCta = (patch: Partial<NonNullable<BannerSection['cta']>>) => {
    const current = cta ?? { label: '', href: '' };
    const merged = { ...current, ...patch };
    const isEmpty = !merged.label && !merged.href;
    onChange({ ...section, cta: isEmpty ? undefined : merged });
  };

  return (
    <div className="space-y-6">
      {/* Variant */}
      <div>
        <label className="block text-sm font-medium">Style</label>
        <select
          className="select w-full"
          value={section.variant ?? 'announcement'}
          onChange={(e) => onChange({ ...section, variant: e.target.value as BannerVariant })}
        >
          <option value="announcement">Announcement (neutral)</option>
          <option value="promo">Promo (gradient)</option>
          <option value="alert">Alert (amber)</option>
        </select>
      </div>

      {/* Title / Body */}
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Lead-in (bold)</label>
          <input
            className="input w-full"
            value={section.title ?? ''}
            onChange={(e) => onChange({ ...section, title: e.target.value })}
            placeholder="e.g., New: or Reminder:"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Message</label>
          <input
            className="input w-full"
            value={section.body ?? ''}
            onChange={(e) => onChange({ ...section, body: e.target.value })}
            placeholder="e.g., Spring collection is here — shop now."
          />
        </div>
      </div>

      {/* Image */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Image (optional)</label>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 aspect-square overflow-hidden rounded-md border border-gray-200 bg-gray-50 flex-shrink-0">
            {section.imageUrl ? (
              <img
                src={resolveAssetUrl(section.imageUrl) ?? section.imageUrl}
                alt="Image preview"
                className="admin-image-preview"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-[10px] text-muted">
                None
              </div>
            )}
          </div>
          <input
            className="input flex-1"
            value={section.imageUrl ?? ''}
            onChange={(e) => onChange({ ...section, imageUrl: e.target.value })}
            placeholder="https://… or configs/{siteId}/assets/badge.png"
          />
          <button
            type="button"
            className="btn btn-inverted"
            onClick={async () => {
              const picked = await openMediaPicker(`configs/${siteId}/assets/`);
              if (picked) onChange({ ...section, imageUrl: picked });
            }}
          >
            Pick…
          </button>
          {section.imageUrl && (
            <button
              type="button"
              className="btn btn-ghost text-red-600"
              onClick={() => onChange({ ...section, imageUrl: '' })}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">CTA Button (optional)</label>
          {cta && (
            <button
              type="button"
              className="btn btn-ghost text-red-600"
              onClick={() => onChange({ ...section, cta: undefined })}
            >
              Remove CTA
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input
            className="input w-full"
            placeholder="Label (e.g., Shop Now)"
            value={cta?.label ?? ''}
            onChange={(e) => setCta({ label: e.target.value })}
          />

          <div className="flex gap-2">
            <select
              className="select w-36"
              value={kind}
              onChange={(e) => {
                const nextKind = e.target.value as 'internal' | 'external' | 'sub-page';
                if (nextKind === 'internal') {
                  const first = allSections[0]?.id ?? '';
                  setCta({ href: first ? `/#${first}` : '' });
                } else if (nextKind === 'sub-page') {
                  const first = allPages[0]?.slug ?? '';
                  setCta({ href: first ? `/${first.replace(/^\/+/, '')}` : '' });
                } else {
                  setCta({ href: '' });
                }
              }}
            >
              <option value="internal">Internal (section)</option>
              <option value="sub-page">Sub-page</option>
              <option value="external">External URL</option>
            </select>

            {kind === 'internal' ? (
              <select
                className="select flex-1"
                value={sectionId}
                onChange={(e) => {
                  const id = e.target.value;
                  setCta({ href: id === '/' ? '/' : id ? `/#${id}` : '' });
                }}
              >
                <option value="">— Select section —</option>
                <option value="/">Home • Top of page</option>
                {allSections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.type.charAt(0).toUpperCase() + s.type.slice(1)} • {s.id}
                  </option>
                ))}
              </select>
            ) : kind === 'sub-page' ? (
              <select
                className="select flex-1"
                value={cta?.href ?? ''}
                onChange={(e) => setCta({ href: e.target.value })}
              >
                <option value="">— Select page —</option>
                {allPages.map((page) => {
                  const href = `/${page.slug.replace(/^\/+/, '')}`;
                  return (
                    <option key={page.slug} value={href}>
                      {page.title || page.slug}
                    </option>
                  );
                })}
              </select>
            ) : (
              <input
                className="input flex-1"
                value={cta?.href ?? ''}
                onChange={(e) => setCta({ href: e.target.value })}
                placeholder="https://…, /shop, mailto:…, tel:…"
              />
            )}
          </div>
        </div>
      </div>

      {/* Dismissible */}
      <div className="flex items-center gap-3">
        <input
          id="banner-dismissible"
          type="checkbox"
          className="checkbox"
          checked={section.dismissible ?? true}
          onChange={(e) => onChange({ ...section, dismissible: e.target.checked })}
        />
        <label htmlFor="banner-dismissible" className="text-sm">
          Show a dismiss (X) button — visitors who close it won&apos;t see it again this session
        </label>
      </div>
    </div>
  );
}

export default EditBanner;

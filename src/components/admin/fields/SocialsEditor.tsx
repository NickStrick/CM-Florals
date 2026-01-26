'use client';

import { useCallback, useMemo } from 'react';
import type { SocialsSection, SocialItem } from '@/types/site';
import type { EditorProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
// tiny immutable helper consistent with your other editors
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

const ALL_TYPES: SocialItem['type'][] = [
  'instagram',
  'facebook',
  'linkedin',
  'x',
  'youtube',
  'tiktok',
  'email',
  'website',
];

export default function EditSocials({
  section,
  onChange,
}: EditorProps<SocialsSection>) {
  const items = section.items ?? [];

  // ---- top-level setters ----
  const setField = useCallback(
    <K extends keyof SocialsSection>(key: K, value: SocialsSection[K]) => {
      onChange({ ...section, [key]: value });
    },
    [onChange, section]
  );

  const style = useMemo(
    () => section.style ?? { background: 'default', rounded: 'xl', size: 'md', gap: 'md', align: 'center' },
    [section.style]
  );
  const setStyle = useCallback(
    <K extends keyof NonNullable<SocialsSection['style']>>(key: K, value: NonNullable<SocialsSection['style']>[K]) => {
      onChange({ ...section, style: { ...(section.style ?? {}), [key]: value } });
    },
    [onChange, section]
  );

  // ---- items ops ----
  const addItem = useCallback(() => {
    const next = deepClone(section);
    next.items = [
      ...(next.items ?? []),
      { type: 'instagram', href: '', label: '' } as SocialItem,
    ];
    onChange(next);
  }, [onChange, section]);

  const removeItem = useCallback(
    (idx: number) => {
      const next = deepClone(section);
      next.items = (next.items ?? []).filter((_, i) => i !== idx);
      onChange(next);
    },
    [onChange, section]
  );

  const moveItem = useCallback(
    (from: number, to: number) => {
      const next = deepClone(section);
      const arr = next.items ?? [];
      if (to < 0 || to >= arr.length) return;
      const [spliced] = arr.splice(from, 1);
      arr.splice(to, 0, spliced);
      next.items = arr;
      onChange(next);
    },
    [onChange, section]
  );

  const updateItem = useCallback(
    (idx: number, patch: Partial<SocialItem>) => {
      const next = deepClone(section);
      const arr = next.items ?? [];
      arr[idx] = { ...(arr[idx] as SocialItem), ...patch };
      next.items = arr;
      onChange(next);
    },
    [onChange, section]
  );

  // optional light normalization for email type
  const normalizeHref = (t: SocialItem['type'], href: string) => {
    if (t === 'email') {
      // if plain email, prepend mailto:
      if (href && !href.startsWith('mailto:') && !href.includes('://')) {
        return `mailto:${href}`;
      }
    }
    return href;
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            className="input w-full"
            value={section.title ?? ''}
            onChange={(e) => setField('title', e.target.value)}
            placeholder="e.g., Connect With Me"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Subtitle</label>
          <input
            className="input w-full"
            value={section.subtitle ?? ''}
            onChange={(e) => setField('subtitle', e.target.value)}
            placeholder="Optional supporting text"
          />
        </div>
      </div>

      {/* Style */}
      <div className="grid md:grid-cols-5 gap-3">
        <div>
          <label className="block text-sm font-medium">Background</label>
          <select
            className="select w-full"
            value={style.background ?? 'default'}
            onChange={(e) => setStyle('background', e.target.value as NonNullable<SocialsSection['style']>['background'])}
          >
            <option value="default">default</option>
            <option value="band">band</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Rounded</label>
          <select
            className="select w-full"
            value={style.rounded ?? 'xl'}
            onChange={(e) => setStyle('rounded', e.target.value as NonNullable<SocialsSection['style']>['rounded'])}
          >
            <option value="lg">lg</option>
            <option value="xl">xl</option>
            <option value="2xl">2xl</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Icon Size</label>
          <select
            className="select w-full"
            value={style.size ?? 'md'}
            onChange={(e) => setStyle('size', e.target.value as NonNullable<SocialsSection['style']>['size'])}
          >
            <option value="sm">sm</option>
            <option value="md">md</option>
            <option value="lg">lg</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Gap</label>
          <select
            className="select w-full"
            value={style.gap ?? 'md'}
            onChange={(e) => setStyle('gap', e.target.value as NonNullable<SocialsSection['style']>['gap'])}
          >
            <option value="sm">sm</option>
            <option value="md">md</option>
            <option value="lg">lg</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Align</label>
          <select
            className="select w-full"
            value={style.align ?? 'center'}
            onChange={(e) => setStyle('align', e.target.value as NonNullable<SocialsSection['style']>['align'])}
          >
            <option value="left">left</option>
            <option value="center">center</option>
          </select>
        </div>
      </div>

      {/* Items header */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Links ({items.length})</div>
        <button className="btn btn-ghost" onClick={addItem}>
          <FontAwesomeIcon icon={faPlus} className="text-xs" />
          Add link
        </button>
      </div>

      {/* Items list */}
      <div className="space-y-3">
        {items.map((it, i) => {
          const hrefPlaceholder =
            it.type === 'email'
              ? 'name@example.com or mailto:name@example.com'
              : it.type === 'website'
              ? 'https://example.com'
              : `https://...`;

        return (
          <div key={`social-${i}`} className="card p-3 space-y-3">
            <div className="grid md:grid-cols-[1fr_2fr_1fr_auto_auto_auto] gap-2">
              <select
                className="select"
                value={it.type}
                onChange={(e) => updateItem(i, { type: e.target.value as SocialItem['type'] })}
                title="Platform"
              >
                {ALL_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <input
                className="input"
                placeholder={hrefPlaceholder}
                value={it.href}
                onChange={(e) => updateItem(i, { href: normalizeHref(it.type, e.target.value) })}
              />

              <input
                className="input"
                placeholder="Optional label"
                value={it.label ?? ''}
                onChange={(e) => updateItem(i, { label: e.target.value })}
              />

              <button
                className="btn btn-ghost"
                onClick={() => moveItem(i, i - 1)}
                disabled={i === 0}
                title="Move up"
              >
                 <FontAwesomeIcon icon={faChevronUp} className="text-sm" />
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => moveItem(i, i + 1)}
                disabled={i === items.length - 1}
                title="Move down"
              >
                <FontAwesomeIcon icon={faChevronDown} className="text-sm" />
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => removeItem(i)}
                title="Remove"
              >
                <FontAwesomeIcon icon={faTrash} className="text-sm" />
              </button>
            </div>
          </div>
        );})}

        {items.length === 0 && (
          <div className="text-sm text-muted">No links yet. Click “Add link”.</div>
        )}
      </div>
    </div>
  );
}

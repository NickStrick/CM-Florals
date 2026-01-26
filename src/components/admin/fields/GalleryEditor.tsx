'use client';

import { useCallback } from 'react';
import type {
  GalleryItem,
  GallerySection,
  GallerySource,
  GalleryStyle,
} from '@/types/site';
import type { EditorProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';  

// tiny immutable helper
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

function ensureS3Source(
  s: GallerySection
): Extract<GallerySource, { type: 's3' }> {
  const current =
    s.source && s.source.type === 's3' ? s.source : undefined;
  return (
    current ?? {
      type: 's3',
      prefix: 'gallery/',
      limit: 200,
      recursive: true,
    }
  );
}

export default function EditGallery({
  section,
  onChange,
  openMediaPicker,
}: EditorProps<GallerySection>) {
  const style: GalleryStyle = section.style ?? {};

  // --- Mode toggle (static vs s3)
  const mode: 'static' | 's3' =
    section.source && section.source.type === 's3' ? 's3' : 'static';

  const setMode = useCallback(
    (next: 'static' | 's3') => {
      if (next === 'static') {
        onChange({ ...section, source: undefined, items: section.items ?? [] });
      } else {
        onChange({ ...section, source: ensureS3Source(section), items: undefined });
      }
    },
    [onChange, section]
  );

  // --- Adders (static mode)
  const addFromPicker = useCallback(async () => {
    const picked = await openMediaPicker('gallery/'); // or `configs/${section.id}/assets/` if you prefer
    if (!picked) return;
    const alt = picked.split('/').pop() ?? 'Image';
    const nextItem: GalleryItem = { imageUrl: picked, alt };
    const copy = deepClone(section);
    copy.items = [...(copy.items ?? []), nextItem];
    onChange(copy);
  }, [onChange, openMediaPicker, section]);

  const addManual = useCallback(() => {
    const nextItem: GalleryItem = { imageUrl: '', alt: '' };
    const copy = deepClone(section);
    copy.items = [...(copy.items ?? []), nextItem];
    onChange(copy);
  }, [onChange, section]);

  // --- Style updater (simple & well-typed)
  const updateStyle = (patch: Partial<GalleryStyle>) => {
    onChange({ ...section, style: { ...(section.style ?? {}), ...patch } });
  };

  // --- S3 source updater
  const updateS3 = <
    K extends keyof Extract<GallerySource, { type: 's3' }>
  >(
    key: K,
    value: Extract<GallerySource, { type: 's3' }>[K]
  ) => {
    const s3 = ensureS3Source(section);
    onChange({ ...section, source: { ...s3, [key]: value } });
  };

  // selections -> typed conversions
  const toColumns = (v: string) => Number(v) as GalleryStyle['columns'];
  const toRounded = (v: string) => v as GalleryStyle['rounded'];
  const toGap = (v: string) => v as GalleryStyle['gap'];

  return (
    <div className="space-y-5">
      {/* Mode switch */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium">Data source:</span>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={mode === 'static'}
            onChange={() => setMode('static')}
          />
          <span>Static list</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={mode === 's3'}
            onChange={() => setMode('s3')}
          />
          <span>S3 (prefix scan)</span>
        </label>
      </div>

      {/* STATIC MODE */}
      {mode === 'static' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-medium">
              Images ({(section.items ?? []).length})
            </div>
            <div className="flex gap-2">
              <button className="btn btn-inverted" onClick={addFromPicker}>
                <FontAwesomeIcon icon={faPlus} className="text-xs" />Add from S3
              </button>
              <button className="btn btn-ghost" onClick={addManual}>
                <FontAwesomeIcon icon={faPlus} className="text-xs" />Add manual
              </button>
            </div>
          </div>

          <div className="grid gap-2">
            {(section.items ?? []).map((it, i) => (
              <div key={`${it.imageUrl || 'new'}-${i}`} className="flex items-center gap-2">
                <input
                  className="input flex-1"
                  value={it.imageUrl}
                  placeholder="https://… or S3 key"
                  onChange={(e) => {
                    const copy = deepClone(section);
                    if (!copy.items) copy.items = [];
                    copy.items[i] = { ...copy.items[i], imageUrl: e.target.value };
                    onChange(copy);
                  }}
                />
                <input
                  className="input flex-[0.7]"
                  placeholder="alt"
                  value={it.alt ?? ''}
                  onChange={(e) => {
                    const copy = deepClone(section);
                    if (!copy.items) copy.items = [];
                    copy.items[i] = { ...copy.items[i], alt: e.target.value };
                    onChange(copy);
                  }}
                />
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    const copy = deepClone(section);
                    copy.items = (copy.items ?? []).filter((_, idx) => idx !== i);
                    onChange(copy);
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} className="text-sm" />
                </button>
              </div>
            ))}
            {(section.items ?? []).length === 0 && (
              <div className="text-sm text-muted">No images yet.</div>
            )}
          </div>
        </div>
      )}

      {/* S3 MODE */}
      {mode === 's3' && (
        <div className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">Prefix</label>
              <input
                className="input w-full"
                value={ensureS3Source(section).prefix ?? 'gallery/'}
                onChange={(e) => updateS3('prefix', e.target.value)}
                placeholder="gallery/"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Limit</label>
              <input
                type="number"
                className="input w-full"
                value={ensureS3Source(section).limit ?? 200}
                onChange={(e) => updateS3('limit', Number(e.target.value || 0))}
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Recursive</label>
              <select
                className="select w-full"
                value={String(ensureS3Source(section).recursive ?? true)}
                onChange={(e) => updateS3('recursive', e.target.value === 'true')}
              >
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">CDN Base (optional)</label>
              <input
                className="input w-full"
                value={ensureS3Source(section).cdnBase ?? ''}
                onChange={(e) => updateS3('cdnBase', e.target.value || undefined)}
                placeholder="https://dxxxxx.cloudfront.net"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Bucket (override, optional)</label>
              <input
                className="input w-full"
                value={ensureS3Source(section).bucket ?? ''}
                onChange={(e) => updateS3('bucket', e.target.value || undefined)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Region (override, optional)</label>
              <input
                className="input w-full"
                value={ensureS3Source(section).region ?? ''}
                onChange={(e) => updateS3('region', e.target.value || undefined)}
              />
            </div>
          </div>
          <p className="text-xs text-muted">
            The gallery grid will fetch objects with this prefix at runtime (client), using your <code>/api/gallery</code> endpoint.
          </p>
        </div>
      )}

      {/* Style + background */}
      <div className="grid md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium">Columns</label>
          <select
            className="select w-full"
            value={style.columns ?? 4}
            onChange={(e) => updateStyle({ columns: toColumns(e.target.value) })}
          >
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Rounded</label>
          <select
            className="select w-full"
            value={style.rounded ?? 'xl'}
            onChange={(e) => updateStyle({ rounded: toRounded(e.target.value) })}
          >
            <option value="lg">lg</option>
            <option value="xl">xl</option>
            <option value="2xl">2xl</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Gap</label>
          <select
            className="select w-full"
            value={style.gap ?? 'md'}
            onChange={(e) => updateStyle({ gap: toGap(e.target.value) })}
          >
            <option value="sm">sm</option>
            <option value="md">md</option>
            <option value="lg">lg</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Background Class (optional)</label>
        <input
          className="input w-full"
          value={section.backgroundClass ?? ''}
          onChange={(e) =>
            onChange({
              ...section,
              backgroundClass: e.target.value || undefined,
            })
          }
          placeholder="e.g. bg-gradient-2"
        />
      </div>
    </div>
  );
}

'use client';

import { useCallback, useState } from 'react';
import type {
  GalleryItem,
  GallerySection,
  GallerySource,
  GalleryStyle,
} from '@/types/site';
import type { EditorProps } from './types';
import GalleryImageCard from './GalleryImageCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const GALLERY_UPLOAD_PREFIX = 'gallery/';

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
  openMediaPickerMulti,
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

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // --- Adders (static mode)
  // Images always upload to the shared "gallery/" prefix; each section just
  // picks which of those shared images it wants to display. Reopening the
  // picker pre-checks this section's current picks so (un)checking an image
  // adds/removes it here too. Manually pasted URLs (outside the shared
  // prefix) are left untouched by this reconciliation.
  const addFromPicker = useCallback(async () => {
    if (!openMediaPickerMulti) return;
    const existing = section.items ?? [];
    const existingKeys = existing
      .filter((it) => it.imageUrl.startsWith(GALLERY_UPLOAD_PREFIX))
      .map((it) => it.imageUrl);
    const picked = await openMediaPickerMulti(GALLERY_UPLOAD_PREFIX, existingKeys);
    if (!picked) return;

    const pickedSet = new Set(picked);
    const untouched = existing.filter((it) => !it.imageUrl.startsWith(GALLERY_UPLOAD_PREFIX));
    const kept = existing.filter(
      (it) => it.imageUrl.startsWith(GALLERY_UPLOAD_PREFIX) && pickedSet.has(it.imageUrl)
    );
    const keptKeys = new Set(kept.map((it) => it.imageUrl));
    const added: GalleryItem[] = picked
      .filter((key) => !keptKeys.has(key))
      .map((key) => ({ imageUrl: key, alt: key.split('/').pop() ?? 'Image' }));

    const copy = deepClone(section);
    copy.items = [...untouched, ...kept, ...added];
    onChange(copy);
  }, [onChange, openMediaPickerMulti, section]);

  const addManual = useCallback(() => {
    const nextItem: GalleryItem = { imageUrl: '', alt: '' };
    const copy = deepClone(section);
    copy.items = [...(copy.items ?? []), nextItem];
    onChange(copy);
  }, [onChange, section]);

  // --- Item mutators (static mode)
  const updateItem = useCallback(
    (index: number, patch: Partial<GalleryItem>) => {
      const copy = deepClone(section);
      const items = copy.items ?? [];
      items[index] = { ...items[index], ...patch };
      copy.items = items;
      onChange(copy);
    },
    [onChange, section]
  );

  const removeItem = useCallback(
    (index: number) => {
      const copy = deepClone(section);
      copy.items = (copy.items ?? []).filter((_, idx) => idx !== index);
      onChange(copy);
    },
    [onChange, section]
  );

  const moveItem = useCallback(
    (from: number, to: number) => {
      if (from === to) return;
      const copy = deepClone(section);
      const items = copy.items ?? [];
      const [moved] = items.splice(from, 1);
      items.splice(to, 0, moved);
      copy.items = items;
      onChange(copy);
    },
    [onChange, section]
  );

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
      {/* Title / Subtitle — also shown in the section list, so give each
          gallery a distinct name when you have more than one. */}
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            className="input w-full"
            value={section.title ?? ''}
            onChange={(e) => onChange({ ...section, title: e.target.value || undefined })}
            placeholder="e.g. Weddings"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Subtitle</label>
          <input
            className="input w-full"
            value={section.subtitle ?? ''}
            onChange={(e) => onChange({ ...section, subtitle: e.target.value || undefined })}
            placeholder="Optional supporting text"
          />
        </div>
      </div>

      {/* Mode switch */}
      <div>
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
        <p className="text-xs text-muted mt-1">
          Static list: hand-pick which shared uploads appear in this gallery — use this when you
          have multiple galleries. S3 scan: automatically shows every image in a folder, which is
          only right for a single "show everything" gallery.
        </p>
      </div>

      {/* STATIC MODE */}
      {mode === 'static' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-medium">
              Images ({(section.items ?? []).length})
            </div>
            <div className="flex gap-2">
              <button className="btn btn-inverted" onClick={addFromPicker} disabled={!openMediaPickerMulti}>
                <FontAwesomeIcon icon={faPlus} className="text-xs" />Add from Gallery Uploads
              </button>
              <button className="btn btn-ghost" onClick={addManual}>
                <FontAwesomeIcon icon={faPlus} className="text-xs" />Add manual
              </button>
            </div>
          </div>

          {(section.items ?? []).length > 0 ? (
            <>
              <p className="text-xs text-muted">Drag a card to reorder how images appear on the page.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {(section.items ?? []).map((it, i) => (
                  <GalleryImageCard
                    key={i}
                    item={it}
                    index={i}
                    isDragging={draggingIndex === i}
                    isDragOver={dragOverIndex === i}
                    onAltChange={(alt) => updateItem(i, { alt })}
                    onUrlChange={(imageUrl) => updateItem(i, { imageUrl })}
                    onRemove={() => removeItem(i)}
                    onDragStart={() => setDraggingIndex(i)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (draggingIndex !== null && draggingIndex !== i) setDragOverIndex(i);
                    }}
                    onDrop={() => {
                      if (draggingIndex !== null) moveItem(draggingIndex, i);
                      setDraggingIndex(null);
                      setDragOverIndex(null);
                    }}
                    onDragEnd={() => {
                      setDraggingIndex(null);
                      setDragOverIndex(null);
                    }}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-sm text-muted">
              No images selected yet. Click &ldquo;Add from Gallery Uploads&rdquo; to pick from your
              shared photo library, or upload new ones from the same button.
            </div>
          )}
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

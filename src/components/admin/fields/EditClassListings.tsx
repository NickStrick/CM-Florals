'use client';

import { useCallback, useMemo } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { ClassListingsSection } from '@/types/site';
import type { EditorProps } from './types';
import { useSite } from '@/context/SiteContext';
import { resolveAssetUrl } from '@/lib/assetUrl';

export default function EditClassListings({
  section,
  onChange,
}: EditorProps<ClassListingsSection>) {
  const { config } = useSite();
  const catalog = config?.classes?.classItems ?? [];

  const set = useCallback(
    <K extends keyof ClassListingsSection>(key: K, value: ClassListingsSection[K]) =>
      onChange({ ...section, [key]: value }),
    [onChange, section]
  );

  const setStyle = useCallback(
    (patch: Partial<NonNullable<ClassListingsSection['style']>>) =>
      onChange({ ...section, style: { ...(section.style ?? {}), ...patch } }),
    [onChange, section]
  );

  const classItemIds = useMemo(() => section.classItemIds ?? [], [section.classItemIds]);
  const style = section.style ?? {};

  const addClass = useCallback((id: string) => {
    if (classItemIds.includes(id)) return;
    set('classItemIds', [...classItemIds, id]);
  }, [classItemIds, set]);

  const removeClass = useCallback((id: string) => {
    set('classItemIds', classItemIds.filter((cid) => cid !== id));
  }, [classItemIds, set]);

  const moveClass = useCallback((from: number, to: number) => {
    if (to < 0 || to >= classItemIds.length) return;
    const next = classItemIds.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    set('classItemIds', next);
  }, [classItemIds, set]);

  const unselected = catalog.filter((c) => !classItemIds.includes(c.id));

  return (
    <div className="space-y-5">

      {/* Heading */}
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            className="input w-full"
            value={section.title ?? ''}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Upcoming Classes"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Subtitle</label>
          <input
            className="input w-full"
            value={section.subtitle ?? ''}
            onChange={(e) => set('subtitle', e.target.value)}
            placeholder="Learn something new with us"
          />
        </div>
      </div>

      {/* Style */}
      <div className="grid md:grid-cols-4 gap-3">
        <div>
          <label className="block text-sm font-medium">Columns</label>
          <select
            className="select w-full"
            value={style.columns ?? 3}
            onChange={(e) => setStyle({ columns: Number(e.target.value) as 1 | 2 | 3 | 4 | 5 })}
          >
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Card variant</label>
          <select
            className="select w-full"
            value={style.cardVariant ?? 'default'}
            onChange={(e) => setStyle({ cardVariant: e.target.value as 'default' | 'ink' })}
          >
            <option value="default">Default</option>
            <option value="ink">Ink</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Show-all threshold</label>
          <input
            type="number"
            min={1}
            className="input w-full"
            value={section.showAllThreshold ?? 3}
            onChange={(e) => set('showAllThreshold', Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Button label</label>
          <input
            className="input w-full"
            value={section.buyCtaFallback ?? 'Book Now'}
            onChange={(e) => set('buyCtaFallback', e.target.value)}
            placeholder="Book Now"
          />
        </div>
        <label className="flex items-end gap-2 pb-1">
          <input
            type="checkbox"
            checked={style.showBadges !== false}
            onChange={(e) => setStyle({ showBadges: e.target.checked })}
          />
          <span className="text-sm">Show badges</span>
        </label>
      </div>

      {/* Selected classes */}
      <div className="space-y-2">
        <div className="text-sm font-semibold border-b pb-1">
          Selected classes ({classItemIds.length})
        </div>

        {classItemIds.length === 0 && (
          <p className="text-sm text-muted">No classes selected. Add from the catalog below.</p>
        )}

        {classItemIds.map((cid, idx) => {
          const item = catalog.find((c) => c.id === cid);
          if (!item) return (
            <div key={cid} className="card admin-card card-solid p-3 flex items-center justify-between gap-3">
              <span className="text-sm text-muted italic">Class not found: {cid}</span>
              <button className="btn btn-ghost text-red-500" onClick={() => removeClass(cid)}>
                <FontAwesomeIcon icon={faTrash} className="text-xs" />
              </button>
            </div>
          );

          const thumb = resolveAssetUrl(item.thumbnailUrl ?? item.images?.[0]?.url);

          return (
            <div key={cid} className="card admin-card card-solid p-3 flex items-center gap-3">
              {thumb && (
                <Image src={thumb} alt={item.name} width={40} height={40} className="w-10 h-10 rounded object-cover flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{item.name}</div>
                {item.category && <div className="text-xs text-muted">{item.category}</div>}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  className="btn btn-ghost"
                  onClick={() => moveClass(idx, idx - 1)}
                  disabled={idx === 0}
                  title="Move up"
                >
                  <FontAwesomeIcon icon={faChevronUp} className="text-xs" />
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => moveClass(idx, idx + 1)}
                  disabled={idx === classItemIds.length - 1}
                  title="Move down"
                >
                  <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                </button>
                <button
                  className="btn btn-ghost text-red-500"
                  onClick={() => removeClass(cid)}
                  title="Remove"
                >
                  <FontAwesomeIcon icon={faTrash} className="text-xs" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Catalog picker */}
      {unselected.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-semibold border-b pb-1">Add from catalog</div>
          <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
            {unselected.map((item) => {
              const thumb = resolveAssetUrl(item.thumbnailUrl ?? item.images?.[0]?.url);
              return (
                <div
                  key={item.id}
                  className="card admin-card card-solid p-3 flex items-center gap-3 hover:cursor-pointer hover:bg-black/5"
                  onClick={() => addClass(item.id)}
                >
                  {thumb && (
                    <Image src={thumb} alt={item.name} width={32} height={32} className="w-8 h-8 rounded object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{item.name}</div>
                    {item.category && <div className="text-xs text-muted">{item.category}</div>}
                  </div>
                  <span className="text-xs text-primary font-medium flex-shrink-0">+ Add</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {catalog.length === 0 && (
        <p className="text-sm text-muted">
          No classes in catalog. Add classes via the <strong>Classes</strong> button in the admin bar.
        </p>
      )}

    </div>
  );
}

'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SiteConfig, AnySection } from '@/types/site';
import { useSite } from '@/context/SiteContext';
import { getSiteId } from '@/lib/siteId';
import MediaPicker from './MediaPicker';
import { SECTION_REGISTRY, getAllowedSectionTypes } from './configRegistry';
import { getEditorForSection } from './EditSections';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

// -----------------------------
// Utilities
// -----------------------------
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

// -----------------------------
// Props
// -----------------------------
export type ConfigModalProps = {
  onClose: () => void;
};

// -----------------------------
// Component
// -----------------------------
export default function ConfigModal({ onClose }: ConfigModalProps) {
  const { config, setConfig } = useSite();
  const siteId = getSiteId();

  // Working copy (nullable until config is ready)
  const [draft, setDraft] = useState<SiteConfig | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (config) {
      const copy = deepClone(config);
      setDraft(copy);
      setSelectedIndex(0); // default to first section on open/load
    }
  }, [config]);

  // keep selectedIndex in bounds whenever sections length changes
  useEffect(() => {
    if (!draft) return;
    setSelectedIndex((i) => clamp(i, 0, Math.max(0, draft.sections.length - 1)));
  }, [draft]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------------------------
  // MediaPicker bridge (Promise-based)
  // ---------------------------
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerPrefix, setPickerPrefix] = useState<string>(`configs/${siteId}/assets/`);
  const pickerResolveRef = useRef<((key: string | null) => void) | null>(null);

  const bucket = process.env.NEXT_PUBLIC_S3_DEFAULT_BUCKET;

  const openMediaPicker = useCallback((prefix: string): Promise<string | null> => {
    setPickerPrefix(prefix);
    setPickerOpen(true);
    return new Promise<string | null>((resolve) => {
      pickerResolveRef.current = resolve;
    });
  }, []);

  const handlePick = useCallback((key: string) => {
    if (pickerResolveRef.current) {
      pickerResolveRef.current(key);
      pickerResolveRef.current = null;
    }
    setPickerOpen(false);
  }, []);

  const handleCancelPick = useCallback(() => {
    if (pickerResolveRef.current) {
      pickerResolveRef.current(null);
      pickerResolveRef.current = null;
    }
    setPickerOpen(false);
  }, []);

  // ---------------------------
  // Section editing
  // ---------------------------
  const updateSection = useCallback((index: number, next: AnySection) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const copy = deepClone(prev);
      copy.sections[index] = next;
      return copy;
    });
  }, []);

  const removeSection = useCallback((index: number) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const copy = deepClone(prev);
      copy.sections.splice(index, 1);
      return copy;
    });
    // adjust selection after state updates: next tick clamp by effect; also set a best-guess now
    setSelectedIndex((i) => (i > index ? i - 1 : i === index ? Math.max(0, i - 1) : i));
  }, []);

  const addSection = useCallback((type: AnySection['type']) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const maker = SECTION_REGISTRY[type]?.create;
      const next = maker ? maker() : undefined;
      if (!next) return prev;
      const updated = { ...prev, sections: [...prev.sections, next] };
      return updated;
    });
    // select the newly added section (at the end)
    setSelectedIndex((i) => {
      // we can’t read updated length here, but after setDraft it will be prevLen+1; selecting "end" on next effect:
      return i; // effect below will keep it in range; we’ll set explicitly once we know new length
    });
  }, []);

  // after an add, auto-select last if we detect we grew by one
  const prevLenRef = useRef<number>(0);
  useEffect(() => {
    if (!draft) return;
    const len = draft.sections.length;
    if (prevLenRef.current && len === prevLenRef.current + 1) {
      setSelectedIndex(len - 1);
    }
    prevLenRef.current = len;
  }, [draft?.sections.length, draft]);

  // reordering helpers
  function reorder<T>(arr: T[], from: number, to: number): T[] {
    const copy = arr.slice();
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    return copy;
  }
  const moveSection = useCallback((from: number, to: number) => {
    setDraft((prev) => {
      if (!prev) return prev;
      if (to < 0 || to >= prev.sections.length) return prev;
      return { ...prev, sections: reorder(prev.sections, from, to) };
    });
    // keep selection attached to the moved item if it was selected
    setSelectedIndex((sel) => {
      if (sel === from) return to;
      if (sel === to) return from; // swapped positions
      return sel;
    });
  }, []);

  const moveUp   = useCallback((index: number) => moveSection(index, index - 1), [moveSection]);
  const moveDown = useCallback((index: number) => moveSection(index, index + 1), [moveSection]);

  // ---------------------------
  // Save
  // ---------------------------
  const canSave = useMemo(() => !!draft && Array.isArray(draft.sections), [draft]);

  const onSave = useCallback(async () => {
    if (!draft) return;
    setSaving(true);
    setError(null);

    try {
      const variant = (process.env.NEXT_PUBLIC_CONFIG_VARIANT ?? 'draft') as 'draft' | 'published';
      const url = `/api/admin/config/${encodeURIComponent(siteId)}?variant=${variant}`;

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-local-admin': '1',
        },
        body: JSON.stringify(draft),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Save failed with HTTP ${res.status}`);
      }

      const saved: SiteConfig = await res.json();
      setConfig(saved);
      onClose();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to save.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  }, [draft, onClose, setConfig, siteId]);

  // ---------------------------
  // Single-section editor renderer
  // ---------------------------
  function renderEditor(
    section: AnySection,
    index: number,
    onChange: (next: AnySection) => void
  ) {
    const Editor = getEditorForSection(section);

    return (
      <>
        <div className="flex items-center justify-between">
          <div className="font-semibold">{section.type.toUpperCase()}</div>
          <div className="pt-2 flex items-center gap-2">
            <div className="flex-1" />
            <button className="btn btn-ghost" onClick={() => removeSection(index)}>
              <FontAwesomeIcon icon={faTrash} className="text-sm" />
              Remove section
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Common fields */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium">ID</label>
              <input className="input w-full" value={section.id} readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium">Type</label>
              <input className="input w-full" value={section.type} readOnly />
            </div>
            <label className="flex items-end gap-2">
              <input
                type="checkbox"
                checked={section.visible !== false}
                onChange={(e) => onChange({ ...section, visible: e.target.checked })}
              />
              <span>Visible</span>
            </label>
          </div>

          {/* Type-specific */}
          {Editor ? (
            <Editor
              section={section as AnySection}
              onChange={(s: AnySection) => onChange(s)}
              openMediaPicker={openMediaPicker}
              siteId={siteId}
            />
          ) : (
            <div className="text-sm text-muted">
              No editor implemented for <code>{section.type}</code> yet.
            </div>
          )}

        </div>
      </>
    );
  }

  // ---------------------------
  // UI
  // ---------------------------
  if (!draft) {
    return (
      <div className="fixed inset-0 z-[1200] bg-black/50 flex items-center justify-center p-4">
        <div className="card p-6">
          <div className="text-sm text-muted">Loading config…</div>
          <div className="mt-4 text-right">
            <button className="btn btn-ghost" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selected = draft.sections[selectedIndex];

  return (
    <div className="fixed edit-modal inset-0 z-[12000] bg-black/50 flex items-center justify-center p-4">
      <div className="card card-solid p-4 relative w-fit !max-w-full pr-[70px] overflow-hidden card-screen-height">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="font-semibold text-lg">Edit Site Content</div>
          <div className="flex items-center gap-2 save-config-btns">
            {error && <div className="text-red-600 text-sm mr-3">{error}</div>}
            <button className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={onSave} disabled={!canSave || saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="grid md:grid-cols-3 gap-0">
          {/* Left: Sections list (select one) */}
          <div className="border-r p-4 space-y-3">
            <div className="text-sm opacity-70">Sections</div>

            <div className="space-y-2">
              {draft.sections.map((s, i) => {
                const isSelected = i === selectedIndex;
                return (
                  <div
                    key={s.id}
                    // type="button"
                    onClick={() => setSelectedIndex(i)}
                    className={[
                      'card card-solid p-3 w-full text-left flex items-start justify-between gap-2 transition hover:cursor-pointer',
                      isSelected ? 'outline outline-2 outline-primary bg-black/5' : 'hover:bg-black/5',
                    ].join(' ')}
                    aria-current={isSelected ? 'true' : undefined}
                  >
                    <div className="flex flex-row gap-3">
                      <div className="flex flex-col gap-1">
                        <button
                          className="btn btn-ghost px-2 py-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveUp(i);
                          }}
                          disabled={i === 0}
                          title="Move up"
                        >
                          <FontAwesomeIcon icon={faChevronUp} className="text-xs" />
                        </button>
                        <button
                          className="btn btn-ghost px-2 py-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveDown(i);
                          }}
                          disabled={i === draft.sections.length - 1}
                          title="Move down"
                        >
                          <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                        </button>
                      </div>
                    <div className="min-w-0">
                      <div className="font-medium">{s.type}</div>
                      <div className="text-xs text-muted break-all">{s.id}</div>
                    </div>
                    </div>
                    <button className="btn btn-ghost" onClick={() => removeSection(i)} title={"Remove section"}>
                        <FontAwesomeIcon icon={faTrash} className="text-sm" />
                      </button>
                  </div>
                );
              })}
              {draft.sections.length === 0 && (
                <div className="text-muted text-sm">No sections yet.</div>
              )}
            </div>

            {/* Quick add (dynamic) */}
            <div className="pt-4 border-t">
              <div className="text-sm opacity-70 mb-2">
                <FontAwesomeIcon icon={faPlus} className="text-xs" />
                Add section</div>
              <div className="flex flex-wrap gap-2">
                {getAllowedSectionTypes().map((t) => (
                  <button
                    key={t}
                    className="btn btn-inverted"
                    onClick={() => addSection(t)}
                  >
                    {SECTION_REGISTRY[t].label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Only the selected editor */}
          <div className="md:col-span-2 p-4 space-y-4 right-editor-container">
            {selected ? (
              <div key={selected.id} className="card card-solid p-4 space-y-3 right-editor-card">
                {renderEditor(selected, selectedIndex, (next) => updateSection(selectedIndex, next))}
              </div>
            ) : (
              <div className="text-sm text-muted">Select a section to edit.</div>
            )}
          </div>
        </div>
      </div>

      {/* Media Picker Overlay */}
      {pickerOpen && (
        <div className="fixed inset-0 z-[1300] bg-black/60 flex items-center justify-center p-4">
          <div className="card card-solid p-4 relative w-fit max-w-[95vw] pr-[70px] max-h-[90vh] overflow-auto">
            <button
              onClick={handleCancelPick}
              className="absolute right-3 top-3 btn btn-ghost"
              aria-label="Close media picker"
            >
              ✕
            </button>
            <MediaPicker
              bucket={bucket}
              prefix={pickerPrefix}
              onPick={(key) => {
                handlePick(key);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

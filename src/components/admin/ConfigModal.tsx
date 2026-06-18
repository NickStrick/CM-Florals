'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { WAVE_TYPES, type SiteConfig, type AnySection, type HeaderSection, type FooterSection } from '@/types/site';
import { useSite } from '@/context/SiteContext';
import { getSiteId } from '@/lib/siteId';
import MediaPicker from './MediaPicker';
import { SECTION_REGISTRY, getAllowedSectionTypes } from './configRegistry';
import { getEditorForSection } from './EditSections';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import AdminAIChatPanel from './AdminAIChatPanel';
import { applySiteConfigPatch } from '@/lib/siteConfigPatch';
import { getAdminSectionSlots, getAdminPageSectionSlots, normalizeSiteConfig } from '@/lib/siteConfigSections';
import { isAdminAiUiEnabled } from '@/lib/adminAi';
import type { SitePage } from '@/types/site';

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
  initialPatch?: Partial<SiteConfig> | null;
  openInPreview?: boolean;
  externalPatch?: Partial<SiteConfig> | null;
  externalPatchNonce?: number;
  externalPatchPreview?: boolean;
};

// -----------------------------
// Component
// -----------------------------
export default function ConfigModal({
  onClose,
  initialPatch = null,
  openInPreview = false,
  externalPatch = null,
  externalPatchNonce = 0,
  externalPatchPreview = false,
}: ConfigModalProps) {
  const { config, setConfig } = useSite();
  const adminAiEnabled = isAdminAiUiEnabled();
  const siteId = getSiteId();

  // Working copy (nullable until config is ready)
  const [draft, setDraft] = useState<SiteConfig | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'main' | 'pages'>('main');
  const [editingPageIndex, setEditingPageIndex] = useState<number | null>(null);
  const originalRef = useRef<SiteConfig | null>(null);
  const previewDraftRef = useRef<SiteConfig | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const pendingAutoPreviewRef = useRef(false);
  const ignoreConfigSyncRef = useRef(false);
  const initialPatchAppliedRef = useRef(false);
  const lastExternalPatchNonceRef = useRef<number>(0);

  useEffect(() => {
    if (ignoreConfigSyncRef.current) {
      ignoreConfigSyncRef.current = false;
      return;
    }
    if (config) {
      const copy = deepClone(config);
      setDraft(copy);
      originalRef.current = copy;
      setSelectedIndex(0); // default to header on open/load
    }
  }, [config]);

  const startPreview = useCallback(() => {
    if (!draft) return;
    const snapshot = deepClone(draft);
    previewDraftRef.current = snapshot;
    ignoreConfigSyncRef.current = true;
    setConfig(snapshot);
    setIsPreviewing(true);
  }, [draft, setConfig]);

  useEffect(() => {
    if (!pendingAutoPreviewRef.current) return;
    if (!draft) return;
    pendingAutoPreviewRef.current = false;
    startPreview();
  }, [draft, startPreview]);

  useEffect(() => {
    if (initialPatchAppliedRef.current) return;
    if (!draft) return;
    if (!initialPatch) return;

    initialPatchAppliedRef.current = true;
    pendingAutoPreviewRef.current = openInPreview;
    setDraft((prev) => (prev ? applySiteConfigPatch(prev, initialPatch) : prev));
  }, [draft, initialPatch, openInPreview]);

  useEffect(() => {
    if (!draft) return;
    if (!externalPatch) return;
    if (externalPatchNonce <= 0) return;
    if (lastExternalPatchNonceRef.current === externalPatchNonce) return;

    lastExternalPatchNonceRef.current = externalPatchNonce;
    pendingAutoPreviewRef.current = externalPatchPreview;
    setDraft((prev) => (prev ? applySiteConfigPatch(prev, externalPatch) : prev));
  }, [draft, externalPatch, externalPatchNonce, externalPatchPreview]);

  const slots = useMemo(() => {
    if (!draft) return [];
    if (activeTab === 'pages' && editingPageIndex !== null) {
      return getAdminPageSectionSlots(draft, editingPageIndex);
    }
    return getAdminSectionSlots(draft);
  }, [draft, activeTab, editingPageIndex]);

  // keep selectedIndex in bounds whenever slot count changes
  useEffect(() => {
    if (!slots.length) {
      setSelectedIndex(0);
      return;
    }
    setSelectedIndex((i) => clamp(i, 0, Math.max(0, slots.length - 1)));
  }, [slots.length]);

  const selectedSlot = slots[selectedIndex];

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isDirty = useMemo(() => {
    if (!draft || !originalRef.current) return false;
    return JSON.stringify(draft) !== JSON.stringify(originalRef.current);
  }, [draft]);

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
    // keep selection safe after delete
    setSelectedIndex(0);
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
    const currentSections =
      activeTab === 'pages' && editingPageIndex !== null
        ? (draft.pages?.[editingPageIndex]?.sections ?? [])
        : draft.sections;
    const len = currentSections.length;
    if (prevLenRef.current && len === prevLenRef.current + 1) {
      // In main mode: header is slot 0, so last section = slot `len`.
      // In page mode: no header slot, so last section = slot `len - 1`.
      setSelectedIndex(activeTab === 'pages' && editingPageIndex !== null ? len - 1 : len);
    }
    prevLenRef.current = len;
  }, [draft, activeTab, editingPageIndex]);

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
      const selBody = sel - 1; // header occupies slot 0
      if (selBody === from) return to + 1;
      if (selBody === to) return from + 1; // swapped positions
      return sel;
    });
  }, []);

  const moveUp   = useCallback((index: number) => moveSection(index, index - 1), [moveSection]);
  const moveDown = useCallback((index: number) => moveSection(index, index + 1), [moveSection]);

  // ---------------------------
  // Page section mutations (mirrors main mutations but targets draft.pages[i].sections)
  // ---------------------------
  const updatePageSection = useCallback((pageIdx: number, sectionIdx: number, next: AnySection) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const pages = deepClone(prev.pages ?? []);
      pages[pageIdx].sections[sectionIdx] = next;
      return { ...prev, pages };
    });
  }, []);

  const removePageSection = useCallback((pageIdx: number, sectionIdx: number) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const pages = deepClone(prev.pages ?? []);
      pages[pageIdx].sections.splice(sectionIdx, 1);
      return { ...prev, pages };
    });
    setSelectedIndex(0);
  }, []);

  const addPageSection = useCallback((pageIdx: number, type: AnySection['type']) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const maker = SECTION_REGISTRY[type]?.create;
      const next = maker ? maker() : undefined;
      if (!next) return prev;
      const pages = deepClone(prev.pages ?? []);
      pages[pageIdx].sections = [...pages[pageIdx].sections, next];
      return { ...prev, pages };
    });
  }, []);

  const movePageSection = useCallback((pageIdx: number, from: number, to: number) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const pages = deepClone(prev.pages ?? []);
      const secs = pages[pageIdx].sections;
      if (to < 0 || to >= secs.length) return prev;
      pages[pageIdx].sections = reorder(secs, from, to);
      return { ...prev, pages };
    });
    setSelectedIndex((sel) => {
      if (sel === from) return to;
      if (sel === to) return from;
      return sel;
    });
  }, []);

  // ---------------------------
  // Page CRUD
  // ---------------------------
  const addPage = useCallback(() => {
    const slug = `page-${Math.random().toString(36).slice(2, 6)}`;
    const newPage: SitePage = { slug, title: 'New Page', sections: [] };
    setDraft((prev) => {
      if (!prev) return prev;
      return { ...prev, pages: [...(prev.pages ?? []), newPage] };
    });
  }, []);

  const deletePage = useCallback((pageIdx: number) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const pages = (prev.pages ?? []).filter((_, i) => i !== pageIdx);
      return { ...prev, pages };
    });
    setEditingPageIndex(null);
  }, []);

  const updatePageMeta = useCallback((pageIdx: number, patch: Partial<SitePage>) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const pages = deepClone(prev.pages ?? []);
      pages[pageIdx] = { ...pages[pageIdx], ...patch };
      return { ...prev, pages };
    });
  }, []);

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
        body: JSON.stringify(normalizeSiteConfig(draft)),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Save failed with HTTP ${res.status}`);
      }

      const saved: SiteConfig = await res.json();
      setConfig(saved);
      originalRef.current = deepClone(saved);
      onClose();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to save.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  }, [draft, onClose, setConfig, siteId]);

  const onRestore = useCallback(() => {
    if (!originalRef.current) return;
    const restored = deepClone(originalRef.current);
    setDraft(restored);
    setSelectedIndex(0);
  }, []);

  const returnToEditor = useCallback(() => {
    if (previewDraftRef.current) {
      ignoreConfigSyncRef.current = true;
      setConfig(previewDraftRef.current);
    }
    setIsPreviewing(false);
  }, [setConfig]);

  const undoChanges = useCallback(() => {
    if (!originalRef.current) return;
    const restored = deepClone(originalRef.current);
    ignoreConfigSyncRef.current = true;
    setConfig(restored);
    setDraft(restored);
    previewDraftRef.current = null;
    setIsPreviewing(false);
    onClose();
  }, [onClose, setConfig]);

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
            {section.type !== 'header' && section.type !== 'footer' && index >= 0 && (
              <button className="btn btn-ghost" onClick={() => removeSection(index)}>
                <FontAwesomeIcon icon={faTrash} className="text-sm" />
                Remove section
              </button>
            )}
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
                checked={
                  section.type === 'header'
                    ? (draft?.showHeader ?? true)
                    : section.type === 'footer'
                      ? (draft?.showFooter ?? true)
                      : section.visible !== false
                }
                onChange={(e) => {
                  if (section.type === 'header') {
                    setDraft((prev) => (prev ? { ...prev, showHeader: e.target.checked } : prev));
                    return;
                  }
                  if (section.type === 'footer') {
                    setDraft((prev) => (prev ? { ...prev, showFooter: e.target.checked } : prev));
                    return;
                  }
                  onChange({ ...section, visible: e.target.checked });
                }}
              />
              <span>{section.type === 'header' || section.type === 'footer' ? 'Show' : 'Visible'}</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">Top wave</label>
              <select
                className="select w-full"
                value={section.topWaveType ?? ''}
                onChange={(e) =>
                  onChange({
                    ...section,
                    topWaveType: (e.target.value || undefined) as AnySection['topWaveType'],
                  })
                }
              >
                <option value="">— none —</option>
                {WAVE_TYPES.map((waveType) => (
                  <option key={waveType} value={waveType}>
                    {waveType}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Bottom wave</label>
              <select
                className="select w-full"
                value={section.bottomWaveType ?? ''}
                onChange={(e) =>
                  onChange({
                    ...section,
                    bottomWaveType: (e.target.value || undefined) as AnySection['bottomWaveType'],
                  })
                }
              >
                <option value="">— none —</option>
                {WAVE_TYPES.map((waveType) => (
                  <option key={waveType} value={waveType}>
                    {waveType}
                  </option>
                ))}
              </select>
            </div>
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
        <div className="card admin-card p-6">
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

  if (isPreviewing) {
    return (
      <div className="fixed inset-0 z-[12000] pointer-events-none">
        <div className="fixed top-[90px] right-4 z-[12010] pointer-events-auto">
          <div className="card card-solid admin-card px-4 py-3 flex items-center gap-3">
            <div className="text-sm text-muted">Previewing draft</div>
            <button className="btn btn-primary" onClick={onSave} disabled={!canSave || saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button className="btn btn-ghost" onClick={undoChanges}>
              Undo Changes
            </button>
            <button className="btn btn-inverted" onClick={returnToEditor}>
              Return to editor
            </button>
          </div>
        </div>
      </div>
    );
  }

  // page-mode helpers
  const inPageMode = activeTab === 'pages' && editingPageIndex !== null;
  const currentSectionCount = inPageMode
    ? (draft.pages?.[editingPageIndex!]?.sections.length ?? 0)
    : draft.sections.length;

  const selected = inPageMode
    ? (selectedSlot?.kind === 'section'
        ? draft.pages?.[editingPageIndex!]?.sections[selectedSlot.index]
        : undefined)
    : selectedSlot?.kind === 'header'
      ? draft.header
      : selectedSlot?.kind === 'footer'
        ? draft.footer
        : selectedSlot?.kind === 'section'
          ? draft.sections[selectedSlot.index]
          : undefined;

  return (
    <div className="fixed edit-modal inset-0 z-[12000] bg-black/50 flex items-center justify-center p-4">
      <div className="card card-solid admin-card p-4 relative w-fit !max-w-full pr-[70px] overflow-hidden card-screen-height">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="font-semibold text-lg">Edit Site Content</div>
          <div className="flex items-center gap-2 save-config-btns">
            {error && <div className="text-red-600 text-sm mr-3">{error}</div>}
            {isDirty && (
              <button className="btn btn-inverted" onClick={startPreview}>
                Preview
              </button>
            )}
            {isDirty && (
              <button className="btn btn-ghost" onClick={onRestore}>
                Restore
              </button>
            )}
            <button className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={onSave} disabled={!canSave || saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
        {adminAiEnabled && (
          <div className="p-4 border-b">
            <AdminAIChatPanel
              mode="inline"
              title="AI (Edit Sections)"
              placeholder="Ask AI to update sections, content, or theme..."
              config={draft}
              onApplyPatch={(patch) => {
                pendingAutoPreviewRef.current = true;
                setDraft((prev) => (prev ? applySiteConfigPatch(prev, patch) : prev));
              }}
            />
          </div>
        )}

        {/* Body */}
        <div className="grid md:grid-cols-3 gap-0">
          {/* Left panel */}
          <div className="border-r p-4 space-y-3">

            {/* Tab strip */}
            <div className="flex gap-1 border-b pb-2">
              <button
                className={['btn btn-ghost text-sm px-3 py-1', activeTab === 'main' ? 'font-bold underline' : ''].join(' ')}
                onClick={() => { setActiveTab('main'); setEditingPageIndex(null); setSelectedIndex(0); }}
              >
                Main Page
              </button>
              <button
                className={['btn btn-ghost text-sm px-3 py-1', activeTab === 'pages' ? 'font-bold underline' : ''].join(' ')}
                onClick={() => { setActiveTab('pages'); setEditingPageIndex(null); setSelectedIndex(0); }}
              >
                Pages {draft.pages?.length ? `(${draft.pages.length})` : ''}
              </button>
            </div>

            {/* ── PAGES LIST view ── */}
            {activeTab === 'pages' && editingPageIndex === null && (
              <div className="space-y-2">
                {(draft.pages ?? []).map((page, i) => (
                  <div
                    key={page.slug}
                    className="card card-solid admin-card p-3 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="font-medium truncate">{page.title || <em className="opacity-40">Untitled</em>}</div>
                      <div className="text-xs text-muted">/{page.slug}</div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        className="btn btn-ghost text-sm"
                        onClick={() => { setEditingPageIndex(i); setSelectedIndex(0); }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-ghost text-red-500 text-sm"
                        onClick={() => deletePage(i)}
                        title="Delete page"
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-xs" />
                      </button>
                    </div>
                  </div>
                ))}
                {!draft.pages?.length && (
                  <div className="text-sm text-muted">No custom pages yet.</div>
                )}
                <button className="btn btn-inverted w-full mt-2" onClick={addPage}>
                  + Add Page
                </button>
              </div>
            )}

            {/* ── PAGE SECTION EDITING view ── */}
            {activeTab === 'pages' && editingPageIndex !== null && (
              <>
                {/* Back + page meta */}
                <div className="space-y-2">
                  <button
                    className="btn btn-ghost text-sm"
                    onClick={() => { setEditingPageIndex(null); setSelectedIndex(0); }}
                  >
                    ← Back to pages
                  </button>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-0.5">Page Title</label>
                    <input
                      className="input w-full text-sm"
                      value={draft.pages?.[editingPageIndex]?.title ?? ''}
                      onChange={(e) => updatePageMeta(editingPageIndex, { title: e.target.value })}
                      placeholder="My Page"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-0.5">Slug (URL path)</label>
                    <input
                      className="input w-full text-sm font-mono"
                      value={draft.pages?.[editingPageIndex]?.slug ?? ''}
                      onChange={(e) => updatePageMeta(editingPageIndex, { slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                      placeholder="my-page"
                    />
                    <p className="text-xs text-muted mt-0.5">Accessible at /{draft.pages?.[editingPageIndex]?.slug}</p>
                  </div>
                </div>

                {/* Section list for this page */}
                <div className="space-y-2">
                  {slots.map((slot, i) => {
                    if (slot.kind !== 'section') return null;
                    const s = slot.section;
                    const isSelected = i === selectedIndex;
                    return (
                      <div
                        key={`page-sec:${s.id}`}
                        onClick={() => setSelectedIndex(i)}
                        className={[
                          'card card-solid admin-card p-3 w-full text-left flex items-start justify-between gap-2 transition hover:cursor-pointer',
                          isSelected ? 'outline outline-2 outline-primary bg-black/5' : 'hover:bg-black/5',
                        ].join(' ')}
                        aria-current={isSelected ? 'true' : undefined}
                      >
                        <div className="flex flex-row gap-3">
                          <div className="flex flex-col gap-1">
                            {slot.index > 0 && (
                              <button
                                className="btn btn-ghost px-2 py-1"
                                onClick={(e) => { e.stopPropagation(); movePageSection(editingPageIndex, slot.index, slot.index - 1); }}
                                title="Move up"
                              >
                                <FontAwesomeIcon icon={faChevronUp} className="text-xs" />
                              </button>
                            )}
                            {slot.index < currentSectionCount - 1 && (
                              <button
                                className="btn btn-ghost px-2 py-1"
                                onClick={(e) => { e.stopPropagation(); movePageSection(editingPageIndex, slot.index, slot.index + 1); }}
                                title="Move down"
                              >
                                <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                              </button>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium">{s.type}</div>
                            <div className="text-xs text-muted break-all">{s.id}</div>
                          </div>
                        </div>
                        <button
                          className="btn btn-ghost"
                          onClick={(e) => { e.stopPropagation(); removePageSection(editingPageIndex, slot.index); }}
                          title="Remove section"
                        >
                          <FontAwesomeIcon icon={faTrash} className="text-sm" />
                        </button>
                      </div>
                    );
                  })}
                  {currentSectionCount === 0 && (
                    <div className="text-muted text-sm">No sections yet. Add one below.</div>
                  )}
                </div>

                {/* Add section */}
                <div className="pt-4 border-t">
                  <div className="text-sm opacity-70 mb-2">Add section</div>
                  <div className="flex flex-wrap gap-2">
                    {getAllowedSectionTypes().map((t) => (
                      <button
                        key={t}
                        className="btn btn-inverted"
                        onClick={() => addPageSection(editingPageIndex, t)}
                      >
                        {SECTION_REGISTRY[t].label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── MAIN PAGE section list ── */}
            {activeTab === 'main' && (
              <>
                <div className="space-y-2">
                  {slots.map((slot, i) => {
                    const s = slot.section;
                    const isLocked = slot.kind === 'header' || slot.kind === 'footer';
                    const isSelected = i === selectedIndex;
                    return (
                      <div
                        key={`${slot.kind}:${s.id}`}
                        onClick={() => setSelectedIndex(i)}
                        className={[
                          'card card-solid admin-card p-3 w-full text-left flex items-start justify-between gap-2 transition hover:cursor-pointer',
                          isSelected ? 'outline outline-2 outline-primary bg-black/5' : 'hover:bg-black/5',
                        ].join(' ')}
                        aria-current={isSelected ? 'true' : undefined}
                      >
                        <div className="flex flex-row gap-3">
                          <div className="flex flex-col gap-1">
                            {!isLocked && slot.kind === 'section' && slot.index > 0 && (
                              <button
                                className="btn btn-ghost px-2 py-1"
                                onClick={(e) => { e.stopPropagation(); moveUp(slot.index); }}
                                title="Move up"
                              >
                                <FontAwesomeIcon icon={faChevronUp} className="text-xs" />
                              </button>
                            )}
                            {!isLocked && slot.kind === 'section' && slot.index < currentSectionCount - 1 && (
                              <button
                                className="btn btn-ghost px-2 py-1"
                                onClick={(e) => { e.stopPropagation(); moveDown(slot.index); }}
                                title="Move down"
                              >
                                <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                              </button>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium">{s.type}</div>
                            <div className="text-xs text-muted break-all">{s.id}</div>
                          </div>
                        </div>
                        {slot.kind === 'section' && (
                          <button
                            className="btn btn-ghost"
                            onClick={(e) => { e.stopPropagation(); removeSection(slot.index); }}
                            title="Remove section"
                          >
                            <FontAwesomeIcon icon={faTrash} className="text-sm" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                  {draft.sections.length === 0 && (
                    <div className="text-muted text-sm">No body sections yet.</div>
                  )}
                </div>

                {/* Quick add */}
                <div className="pt-4 border-t">
                  <div className="text-sm opacity-70 mb-2">Add section</div>
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
              </>
            )}

          </div>

          {/* Right: editor panel */}
          <div className="md:col-span-2 p-4 space-y-4">
            {activeTab === 'pages' && editingPageIndex === null ? (
              <div className="text-sm text-muted">Select a page to edit its sections, or create a new one.</div>
            ) : selected ? (
              <div key={selected.id} className="card card-solid admin-card p-4 space-y-3 right-editor-card">
                {inPageMode
                  ? (selectedSlot?.kind === 'section'
                      ? renderEditor(selected as AnySection, selectedSlot.index, (next) =>
                          updatePageSection(editingPageIndex!, selectedSlot.index, next)
                        )
                      : null)
                  : selectedSlot?.kind === 'header'
                    ? renderEditor(selected as AnySection, -1, (next) =>
                        setDraft((prev) => (prev ? { ...prev, header: next as HeaderSection } : prev))
                      )
                    : selectedSlot?.kind === 'footer'
                      ? renderEditor(selected as AnySection, -1, (next) =>
                          setDraft((prev) => (prev ? { ...prev, footer: next as FooterSection } : prev))
                        )
                      : selectedSlot?.kind === 'section'
                        ? renderEditor(selected as AnySection, selectedSlot.index, (next) =>
                            updateSection(selectedSlot.index, next)
                          )
                        : null}
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
          <div className="card card-solid admin-card p-4 relative w-fit max-w-[95vw] pr-[70px] max-h-[90vh] overflow-auto">
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

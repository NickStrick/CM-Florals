'use client';

import { useEffect, useMemo, useState } from 'react';
import type { PageLinksSection, PageLinksStyle } from '@/types/site';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useSite } from '@/context/SiteContext';
import type { EditorProps } from './types';

type LinkItem = { label: string; href: string; variant?: 'primary' | 'inverted' };
type LocalLinkItem = LinkItem & { _id: string };

function ensureStyle(style?: PageLinksStyle): PageLinksStyle {
  return {
    align: style?.align ?? 'center',
  };
}

function makeLocalItems(items: PageLinksSection['items']): LocalLinkItem[] {
  const base: LinkItem[] = Array.isArray(items) ? items : [];
  return base.map((l) => ({ ...l, _id: crypto.randomUUID() }));
}

// infer mode from href
function hrefKind(href?: string) {
  if (!href) return { kind: 'external' as const, sectionId: '' };
  if (href === '/') return { kind: 'internal' as const, sectionId: '/' };
  if (href.startsWith('/#')) return { kind: 'internal' as const, sectionId: href.slice(2) };
  if (href.startsWith('#')) return { kind: 'internal' as const, sectionId: href.slice(1) };
  if (href.startsWith('/')) return { kind: 'sub-page' as const, sectionId: '' };
  return { kind: 'external' as const, sectionId: '' };
}

export function EditPageLinks({ section, onChange }: EditorProps<PageLinksSection>) {
  const { config } = useSite();
  const allSections = useMemo(() => config?.sections ?? [], [config?.sections]);
  const allPages = useMemo(() => config?.pages ?? [], [config?.pages]);

  const [localItems, setLocalItems] = useState<LocalLinkItem[]>(() =>
    makeLocalItems(section.items)
  );

  useEffect(() => {
    setLocalItems(makeLocalItems(section.items));
  }, [section.items]);

  const style = ensureStyle(section.style);

  const commitItems = (next: LocalLinkItem[]) => {
    setLocalItems(next);
    const stripped: LinkItem[] = next.map(({ _id, ...rest }) => rest);
    onChange({ ...section, items: stripped });
  };

  const updateItem = (id: string, patch: Partial<LinkItem>) => {
    const next = localItems.map((l) => (l._id === id ? { ...l, ...patch } : l));
    commitItems(next);
  };

  const addItem = () => {
    const next = [
      ...localItems,
      { _id: crypto.randomUUID(), label: 'New Link', href: '', variant: 'primary' as const },
    ];
    commitItems(next);
  };

  const removeItem = (id: string) => {
    commitItems(localItems.filter((l) => l._id !== id));
  };

  const moveItem = (id: string, dir: -1 | 1) => {
    const idx = localItems.findIndex((l) => l._id === id);
    if (idx < 0) return;
    const j = idx + dir;
    if (j < 0 || j >= localItems.length) return;
    const next = [...localItems];
    const tmp = next[idx];
    next[idx] = next[j];
    next[j] = tmp;
    commitItems(next);
  };

  const setStyle = (patch: Partial<PageLinksStyle>) => {
    onChange({ ...section, style: { ...style, ...patch } });
  };

  return (
    <div className="space-y-6">
      {/* Title / Subtitle */}
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          className="input w-full"
          value={section.title ?? ''}
          onChange={(e) => onChange({ ...section, title: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Subtitle</label>
        <textarea
          className="textarea w-full"
          value={section.subtitle ?? ''}
          onChange={(e) => onChange({ ...section, subtitle: e.target.value })}
        />
      </div>

      {/* Links */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Links</label>
          <button className="btn btn-inverted" type="button" onClick={addItem}>
            <FontAwesomeIcon icon={faPlus} className="text-xs" />Add Link
          </button>
        </div>

        {localItems.length === 0 && (
          <div className="text-sm text-muted">No links yet.</div>
        )}

        <div className="space-y-2">
          {localItems.map((lnk, i) => {
            const { kind, sectionId } = hrefKind(lnk.href);

            return (
              <div key={lnk._id} className="card admin-card card-solid p-3 flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                  {/* Label */}
                  <input
                    className="input w-full"
                    value={lnk.label}
                    onChange={(e) => updateItem(lnk._id, { label: e.target.value })}
                    placeholder="Label (e.g., Shop Now)"
                  />

                  {/* Mode selector + target */}
                  <div className="flex gap-2">
                    {/* Mode */}
                    <select
                      className="select w-36"
                      value={kind}
                      onChange={(e) => {
                        const nextKind = e.target.value as 'internal' | 'external' | 'sub-page';
                        if (nextKind === 'internal') {
                          const first = allSections[0]?.id ?? '';
                          updateItem(lnk._id, { href: first ? `/#${first}` : '' });
                        } else if (nextKind === 'sub-page') {
                          const first = allPages[0]?.slug ?? '';
                          updateItem(lnk._id, { href: first ? `/${first.replace(/^\/+/, '')}` : '' });
                        } else {
                          updateItem(lnk._id, { href: '' });
                        }
                      }}
                    >
                      <option value="internal">Internal (section)</option>
                      <option value="sub-page">Sub-page</option>
                      <option value="external">External URL</option>
                    </select>

                    {/* Target */}
                    {kind === 'internal' ? (
                      <select
                        className="select flex-1"
                        value={sectionId}
                        onChange={(e) => {
                          const id = e.target.value;
                          updateItem(lnk._id, { href: id === '/' ? '/' : id ? `/#${id}` : '' });
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
                        value={lnk.href}
                        onChange={(e) => updateItem(lnk._id, { href: e.target.value })}
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
                        value={lnk.href}
                        onChange={(e) => updateItem(lnk._id, { href: e.target.value })}
                        placeholder="https://…, /contact, mailto:…, tel:…"
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-muted">Style</label>
                  <select
                    className="select w-36"
                    value={lnk.variant ?? 'primary'}
                    onChange={(e) =>
                      updateItem(lnk._id, { variant: e.target.value as 'primary' | 'inverted' })
                    }
                  >
                    <option value="primary">Primary</option>
                    <option value="inverted">Inverted</option>
                  </select>

                  <button
                    type="button"
                    className="btn btn-ghost ml-auto"
                    onClick={() => moveItem(lnk._id, -1)}
                    disabled={i === 0}
                    title="Move up"
                  >
                    <FontAwesomeIcon icon={faChevronUp} className="text-sm" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => moveItem(lnk._id, +1)}
                    disabled={i === localItems.length - 1}
                    title="Move down"
                  >
                    <FontAwesomeIcon icon={faChevronDown} className="text-sm" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost text-red-600"
                    onClick={() => removeItem(lnk._id)}
                    title="Remove"
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-sm" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Style */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Alignment</label>
        <select
          className="select w-48"
          value={style.align ?? 'center'}
          onChange={(e) => setStyle({ align: e.target.value as PageLinksStyle['align'] })}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
    </div>
  );
}

export default EditPageLinks;

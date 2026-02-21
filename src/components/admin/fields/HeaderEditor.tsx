'use client';

import { useEffect, useMemo, useState } from 'react';
import type { HeaderSection, HeaderStyle } from '@/types/site';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown, faTrash, faPlus} from '@fortawesome/free-solid-svg-icons';
import { useSite } from '@/context/SiteContext';

export type EditorProps<T> = {
  section: T;
  onChange: (next: T) => void;
  openMediaPicker: (prefix: string) => Promise<string | null>; // not used here
  siteId: string; // not used here
};

type NavLink = { label: string; href: string };
type LocalNavLink = NavLink & { _id: string }; // stable key for React

function ensureStyle(style?: HeaderStyle): HeaderStyle {
  return {
    sticky: style?.sticky ?? true,
    blur: style?.blur ?? true,
    elevation: style?.elevation ?? 'sm',
    transparent: style?.transparent ?? false,
  };
}

function makeLocalLinks(links: HeaderSection['links']): LocalNavLink[] {
  const base: NavLink[] = Array.isArray(links) ? links : [];
  // Attach stable ids
  return base.map((l) => ({ ...l, _id: crypto.randomUUID() }));
}

// infer mode from href
function hrefKind(href?: string) {
  if (!href) return { kind: 'external' as const, sectionId: '' };
  if (href.startsWith('/#')) return { kind: 'internal' as const, sectionId: href.slice(2) };
  if (href.startsWith('#')) return { kind: 'internal' as const, sectionId: href.slice(1) };
  return { kind: 'external' as const, sectionId: '' };
}

export function EditHeader({
  section,
  onChange,
}: EditorProps<HeaderSection>) {
  const { config } = useSite(); // 👈 get sections without changing props
  const allSections = useMemo(() => config?.sections ?? [], [config?.sections]);

  const [localLinks, setLocalLinks] = useState<LocalNavLink[]>(() =>
    makeLocalLinks(section.links)
  );

  // If the section.links reference changes from outside, resync local state
  useEffect(() => {
    setLocalLinks(makeLocalLinks(section.links));
  }, [section.links]);

  const style = ensureStyle(section.style);

  // Push localLinks back to section when they change
  const commitLinks = (next: LocalNavLink[]) => {
    setLocalLinks(next);
    const stripped: NavLink[] = next.map(({ ...rest }) => rest);
    onChange({ ...section, links: stripped });
  };

  // ---- logo text ----
  const setLogoText = (logoText?: string) =>
    onChange({ ...section, logoText });

  // ---- links CRUD ----
  const updateLink = (id: string, patch: Partial<NavLink>) => {
    const next = localLinks.map((l) =>
      l._id === id ? { ...l, ...patch } : l
    );
    commitLinks(next);
  };

  const addLink = () => {
    const next = [
      ...localLinks,
      { _id: crypto.randomUUID(), label: 'New', href: '' },
    ];
    commitLinks(next);
  };

  const removeLink = (id: string) => {
    const next = localLinks.filter((l) => l._id !== id);
    commitLinks(next);
  };

  const moveLink = (id: string, dir: -1 | 1) => {
    const idx = localLinks.findIndex((l) => l._id === id);
    if (idx < 0) return;
    const j = idx + dir;
    if (j < 0 || j >= localLinks.length) return;
    const next = [...localLinks];
    const tmp = next[idx];
    next[idx] = next[j];
    next[j] = tmp;
    commitLinks(next);
  };

  // ---- CTA (optional) ----
  const cta = section.cta;
  const setCta = (patch: Partial<NonNullable<HeaderSection['cta']>>) => {
    const current = cta ?? { label: '', href: '' };
    const merged = { ...current, ...patch };
    const isEmpty = !merged.label && !merged.href;
    onChange({ ...section, cta: isEmpty ? undefined : merged });
  };

  const clearCta = () => onChange({ ...section, cta: undefined });

  // ---- Style ----
  const setStyle = (patch: Partial<HeaderStyle>) => {
    onChange({ ...section, style: { ...style, ...patch } });
  };

  return (
    <div className="space-y-6">
      {/* Logo */}
      <div>
        <label className="block text-sm font-medium">Logo Text</label>
        <input
          className="input w-full"
          value={section.logoText ?? ''}
          onChange={(e) => setLogoText(e.target.value)}
          placeholder="e.g., CM Florals"
        />
      </div>

      {/* Links */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Navigation Links</label>
          <button className="btn btn-inverted" type="button" onClick={addLink}>
            <FontAwesomeIcon icon={faPlus} className="text-xs" />Add Link
          </button>
        </div>

        {localLinks.length === 0 && (
          <div className="text-sm text-muted">No nav links yet.</div>
        )}

        <div className="space-y-2">
          {localLinks.map((lnk, i) => {
            const { kind, sectionId } = hrefKind(lnk.href);

            return (
              <div key={'linkid-' + i} className="card admin-card card-solid p-3 flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                  {/* Label */}
                  <input
                    className="input w-full"
                    value={lnk.label}
                    onChange={(e) => updateLink(lnk._id, { label: e.target.value })}
                    placeholder="Label (e.g., Home)"
                  />

                  {/* Mode selector + target */}
                  <div className="flex gap-2">
                    {/* Mode */}
                    <select
                      className="select w-36"
                      value={kind}
                      onChange={(e) => {
                        const nextKind = e.target.value as 'internal' | 'external';
                        if (nextKind === 'internal') {
                          // switch to internal: default to first section or blank
                          const first = allSections[0]?.id ?? '';
                          updateLink(lnk._id, { href: first ? `/#${first}` : '' });
                        } else {
                          // switch to external: keep existing external or blank
                          updateLink(lnk._id, { href: '' });
                        }
                      }}
                    >
                      <option value="internal">Internal (section)</option>
                      <option value="external">External URL</option>
                    </select>

                    {/* Target */}
                    {kind === 'internal' ? (
                      <select
                        className="select flex-1"
                        value={sectionId}
                        onChange={(e) => {
                          const id = e.target.value;
                          updateLink(lnk._id, { href: id ? `/#${id}` : '' });
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
                    ) : (
                      <input
                        className="input flex-1"
                        value={lnk.href}
                        onChange={(e) => updateLink(lnk._id, { href: e.target.value })}
                        placeholder="https://…, /contact, mailto:…, tel:…"
                      />
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => moveLink(lnk._id, -1)}
                    disabled={i === 0}
                    title="Move up"
                  >
                    <FontAwesomeIcon icon={faChevronUp} className="text-sm" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => moveLink(lnk._id, +1)}
                    disabled={i === localLinks.length - 1}
                    title="Move down"
                  >
                    <FontAwesomeIcon icon={faChevronDown} className="text-sm" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost text-red-600 ml-auto"
                    onClick={() => removeLink(lnk._id)}
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

      {/* CTA */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">CTA (optional)</label>
          {cta && (
            <button type="button" className="btn btn-ghost text-red-600" onClick={clearCta}>
              <FontAwesomeIcon icon={faTrash} className="text-sm" />
              Remove CTA
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            className="input w-full"
            placeholder="CTA label (e.g., Call Now)"
            value={cta?.label ?? ''}
            onChange={(e) => setCta({ label: e.target.value })}
          />
          <input
            className="input w-full"
            placeholder="CTA href (tel:, mailto:, /path, https://…)"
            value={cta?.href ?? ''}
            onChange={(e) => setCta({ href: e.target.value })}
          />
        </div>
      </div>

      {/* Style */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Header Style</label>

        <div className="grid md:grid-cols-4 gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!style.sticky}
              onChange={(e) => setStyle({ sticky: e.target.checked })}
            />
            <span>Sticky</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!style.blur}
              onChange={(e) => setStyle({ blur: e.target.checked })}
            />
            <span>Blur</span>
          </label>

          <div>
            <label className="block text-xs font-medium mb-1">Elevation</label>
            <select
              className="select w-full"
              value={style.elevation ?? 'sm'}
              onChange={(e) => setStyle({ elevation: e.target.value as HeaderStyle['elevation'] })}
            >
              <option value="none">none</option>
              <option value="sm">sm</option>
              <option value="md">md</option>
            </select>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!style.transparent}
              onChange={(e) => setStyle({ transparent: e.target.checked })}
            />
            <span>Transparent</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default EditHeader;

'use client';

import { useEffect } from 'react';
import type { SiteConfig } from '@/types/site';

// -----------------------------
// Shared config save: every admin panel PUTs the whole SiteConfig, so a panel
// holding a stale copy could overwrite another panel's earlier save. Instead,
// only the top-level keys this panel changed (draft vs original) are written
// on top of the last config saved this session.
// -----------------------------
let lastSaved: SiteConfig | null = null;

export async function saveAdminConfig(siteId: string, draft: SiteConfig, original: SiteConfig): Promise<SiteConfig> {
  const merged = { ...(lastSaved ?? original) } as Record<string, unknown>;
  const keys = new Set([...Object.keys(draft), ...Object.keys(original)]) as Set<keyof SiteConfig>;
  for (const key of keys) {
    if (JSON.stringify(draft[key]) !== JSON.stringify(original[key])) merged[key] = draft[key];
  }

  const variant = (process.env.NEXT_PUBLIC_CONFIG_VARIANT ?? 'draft') as 'draft' | 'published';
  const res = await fetch(`/api/admin/config/${encodeURIComponent(siteId)}?variant=${variant}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-local-admin': '1' },
    body: JSON.stringify(merged),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `Save failed with HTTP ${res.status}`);
  }

  const saved: SiteConfig = await res.json();
  lastSaved = saved;
  return saved;
}

// -----------------------------
// Save-on-hide registry: admin panels with unsaved edits register their Save
// handler here, and AdminGate flushes them before hiding the admin UI.
// -----------------------------
type Saver = () => Promise<boolean>;

const savers = new Set<Saver>();

/** Register `save` while `isDirty` is true. `save` resolves true on success. */
export function useAdminAutoSave(isDirty: boolean, save: Saver) {
  useEffect(() => {
    if (!isDirty) return;
    savers.add(save);
    return () => {
      savers.delete(save);
    };
  }, [isDirty, save]);
}

/** Run every pending save (one at a time, since each PUTs the whole config). Resolves true if all succeeded. */
export async function flushAdminSaves(): Promise<boolean> {
  let ok = true;
  for (const save of Array.from(savers)) {
    const saved = await save().catch(() => false);
    ok = ok && saved;
  }
  return ok;
}

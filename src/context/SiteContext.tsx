// src/context/SiteContext.tsx
'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { SiteConfig, SiteStyle, ThemePreset } from '@/types/site';

type Ctx = {
  config: SiteConfig | null;
  setStyle: (update: Partial<SiteStyle>) => void;
  isLoading: boolean;
};
const SiteCtx = createContext<Ctx>({ config: null, setStyle: () => {}, isLoading: true });
export const useSite = () => useContext(SiteCtx);

export function SiteProvider({ initial, children }: { initial: SiteConfig; children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(initial);

  // apply data-theme + allow runtime color overrides (from endpoint or builder UI)
  useEffect(() => {
    const b = document.body;
    const preset = (config.theme.preset ?? 'ocean') as ThemePreset;
    b.setAttribute('data-theme', preset);
    if (config.theme.primary) b.style.setProperty('--primary', config.theme.primary);
    if (config.theme.accent)  b.style.setProperty('--accent',  config.theme.accent);
    if (config.theme.radius)  b.style.setProperty('--radius',  radiusToPx(config.theme.radius));
  }, [config.theme]);

  const setStyle = (update: Partial<SiteStyle>) =>
    setConfig(prev => ({ ...prev, theme: { ...prev.theme, ...update } }));

  const value = useMemo<Ctx>(() => ({ config, setStyle, isLoading: !config }), [config]);

  return <SiteCtx.Provider value={value}>{children}</SiteCtx.Provider>;
}

function radiusToPx(r: NonNullable<SiteStyle['radius']>) {
  switch (r) {
    case 'sm': return '6px';
    case 'md': return '10px';
    case 'lg': return '14px';
    case 'xl': return '18px';
    case '2xl': return '24px';
    default: return '16px';
  }
}

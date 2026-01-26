// src/context/SiteContext.tsx
'use client';

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import type { SiteConfig, SiteStyle, ThemePreset } from '@/types/site';

type Ctx = {
  /** Current site configuration (null only before initial mount) */
  config: SiteConfig | null;

  /** Replace the entire SiteConfig (used by admin editor after saving) */
  setConfig: (next: SiteConfig) => void;

  /** Update just the theme/style portion (keeps existing behavior) */
  setStyle: (update: Partial<SiteStyle>) => void;

  /** Loading flag (true only if config is null) */
  isLoading: boolean;
};

const SiteCtx = createContext<Ctx>({
  config: null,
  setConfig: () => {},
  setStyle: () => {},
  isLoading: true,
});

export const useSite = () => useContext(SiteCtx);

export function SiteProvider({
  initial,
  children,
}: {
  initial: SiteConfig;
  children: React.ReactNode;
}) {
  const [config, _setConfig] = useState<SiteConfig>(initial);

  // expose full-replacement setter while preserving previous API
  const setConfig = useCallback((next: SiteConfig) => _setConfig(next), []);

  // apply data-theme + runtime CSS vars (unchanged from your version)
  useEffect(() => {
    if (!config) return;
    const b = document.body;
    const preset = (config.theme.preset ?? 'ocean') as ThemePreset;
    b.setAttribute('data-theme', preset);
    if (config.theme.primary) b.style.setProperty('--primary', config.theme.primary);
    if (config.theme.accent)  b.style.setProperty('--accent',  config.theme.accent);
    if (config.theme.radius)  b.style.setProperty('--radius',  radiusToPx(config.theme.radius));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config?.theme]);

  // keep your existing style-updater helper
  const setStyle = useCallback((update: Partial<SiteStyle>) =>
    _setConfig(prev => ({ ...prev, theme: { ...prev.theme, ...update } })), []);

  const value = useMemo<Ctx>(
    () => ({
      config,
      setConfig,
      setStyle,
      isLoading: !config,
    }),
    [config, setConfig, setStyle]
  );

  return <SiteCtx.Provider value={value}>{children}</SiteCtx.Provider>;
}

function radiusToPx(r: NonNullable<SiteStyle['radius']>) {
  switch (r) {
    case 'sm': return '6px';
    case 'md': return '10px';
    case 'lg': return '14px';
    case 'xl': return '18px';
    case '2xl': return '24px';
    case 'full': return '9999px';
    default: return '16px';
  }
}

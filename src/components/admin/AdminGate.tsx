'use client';

import { useEffect, useState } from 'react';

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isToggle = (e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'a';
      if (isToggle) setEnabled(v => !v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!enabled) return null;
  return <>{children}</>;
}

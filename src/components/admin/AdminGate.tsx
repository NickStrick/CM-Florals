'use client';

import { useEffect, useRef, useState } from 'react';
import { flushAdminSaves } from '@/lib/adminAutoSave';

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const enabledRef = useRef(false);
  const hidingRef = useRef(false);

  useEffect(() => {
    const onKey = async (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      const hasAKey = e.code === 'KeyA' || `${e.key}`?.toLowerCase() === 'a';
      const ctrlOrMeta = e.ctrlKey || e.metaKey;
      const ctrlAndMeta = e.ctrlKey && e.metaKey;
      const altOrShift = e.altKey || e.shiftKey;
      const isToggle = hasAKey && (ctrlAndMeta || (ctrlOrMeta && altOrShift));
      if (!isToggle || hidingRef.current) return;

      if (!enabledRef.current) {
        enabledRef.current = true;
        setEnabled(true);
        return;
      }

      // Hiding: save any unsaved admin edits first. If a save fails, stay open
      // so the panel's error message is visible and nothing is lost.
      hidingRef.current = true;
      try {
        if (await flushAdminSaves()) {
          enabledRef.current = false;
          setEnabled(false);
        }
      } finally {
        hidingRef.current = false;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!enabled) return null;
  return <>{children}</>;
}

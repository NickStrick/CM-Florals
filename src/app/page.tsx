// src/app/page.tsx
'use client';

import { useSite } from '@/context/SiteContext';
import { SectionRenderer } from '@/components/SectionRenderer';

export default function Page() {
  const { config, isLoading } = useSite();

  if (isLoading || !config) {
    // (optional) drop in a simple skeleton while the config loads
    return <main className="bg-app"><div className="section">Loading…</div></main>;
  }

  return (
    <main className="bg-main ">
      {config.sections?.length
        ? config.sections.map(s => <SectionRenderer key={s.id} section={s} />)
        : <div className="section">No sections configured.</div>}
    </main>
  );
}

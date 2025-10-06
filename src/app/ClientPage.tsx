'use client';

import { useSite } from '@/context/SiteContext';
import { SectionRenderer } from '@/components/SectionRenderer';

export default function ClientPage() {
  const { config, isLoading } = useSite();

  if (isLoading || !config) {
    return (
      <main className="bg-app">
        <div className="section">Loading…</div>
      </main>
    );
  }
//   if (error) {
//     return (
//       <main className="bg-app">
//         <div className="section text-red-600">Error: {error}</div>
//       </main>
//     );
//   }

  return (
    <main className="bg-main">
      {config.sections?.length ? (
        config.sections.map((s) => <SectionRenderer key={s.id ?? Math.random()} section={s} />)
      ) : (
        <div className="section">No sections configured.</div>
      )}
    </main>
  );
}

// Server Component by default — no 'use client'
import { Suspense } from 'react';
import ClientPage from './ClientPage';

export default function Page() {
  return (
    <Suspense fallback={<main className="bg-app"><div className="section">Loading…</div></main>}>
      <ClientPage />
    </Suspense>
  );
}

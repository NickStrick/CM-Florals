import { Suspense } from 'react';
import type { Metadata } from 'next';
import SlugClientPage from './ClientPage';
import { BUSINESS, PAGE_SEO } from '@/lib/seo';
import { mockSiteConfig } from '@/mocks/caroleConfig';

// Each custom page gets its own title/description and a self-referencing
// canonical (otherwise it inherits the root layout's canonical "/").
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = mockSiteConfig.pages?.find((p) => p.slug === slug);
  const seo = PAGE_SEO[slug];
  const title = page?.meta?.title || seo?.title || page?.title;
  const description = page?.meta?.description || seo?.description;

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: { canonical: `/${slug}` },
    // openGraph isn't deep-merged with the layout's, so repeat the shared fields.
    openGraph: {
      type: 'website',
      url: `/${slug}`,
      siteName: BUSINESS.name,
      locale: 'en_US',
      images: [{ url: BUSINESS.ogImage, width: 1200, height: 630, alt: BUSINESS.name }],
      ...(title ? { title: `${title} | ${BUSINESS.name}` } : {}),
      ...(description ? { description } : {}),
    },
  };
}

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <Suspense
      fallback={
        <main className="bg-app w-[100vw]">
          <div className="section w-[100vw]">
            <span className="loading-span w-[100vw]">Loading…</span>
          </div>
        </main>
      }
    >
      <SlugClientPage slug={slug} />
    </Suspense>
  );
}

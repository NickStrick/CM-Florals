'use client';

import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';
import type { PartnersSection } from '@/types/site';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faLinkedin, faYoutube, faTiktok, faLinktree } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { resolveAssetUrl } from '@/lib/assetUrl';
/**
 * Partners component
 * - Displays a list of partners/bands/businesses with logo, name, and social links
 * - Typed via PartnersSection so it can be driven entirely by config
 * - Uses globals.css classes: .card, .btn, .btn-inverted, etc.
 */

function iconFor(kind: 'instagram' | 'facebook' | 'linkedin' | 'website' | 'youtube' | 'tiktok' | 'linktree') {
  switch (kind) {
    case 'instagram':
      return faInstagram;
    case 'facebook':
      return faFacebook;
    case 'linkedin':
      return faLinkedin;
    case 'youtube':
      return faYoutube;
    case 'linktree':
      return faLinktree;
    case 'tiktok':
        return faTiktok;
    default:
      return faGlobe;
  }
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? '').join('');
}

export default function Partners({ id, title, subtitle, items, style, backgroundClass = 'bg-[var(--bg)]' }: PartnersSection) {
  const {
    variant = 'cards',
    columns = 3,
    rounded = 'xl',
  } = style || {};

  const radius = rounded === '2xl' ? 'rounded-3xl' : rounded === 'lg' ? 'rounded-xl' : 'rounded-2xl';
  const gridCols =
    columns === 2 ? 'grid-cols-1 md:grid-cols-2' : columns === 4 ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';
  console.log('Partners section render with items:', items);
  return (
    <section
      id={id}
      className={[
        backgroundClass,
        'section',
      ].join(' ')}
    >
      <div className="mx-auto max-w-6xl">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-10">
          {title && <h2 className="text-4xl md:text-5xl font-extrabold">{title}</h2>}
          {subtitle && <p className="text-muted mt-3">{subtitle}</p>}
        </AnimatedSection>

        {variant === 'grid' ? (
          // Simple logo grid
          <div className={`grid gap-6 md:gap-8 ${gridCols}`}>
            {items.map((p, i) => {
              const logoUrl = `${resolveAssetUrl(p.logoUrl?p.logoUrl:'')}`;
              return (
              <AnimatedSection delay={i * 0.08} key={`${p.name}-${i}`} className={`card ${radius} p-6 text-center card-outline`}>                
                {logoUrl ? (
                  <div className="mx-auto mb-3" >
                    <Image
                      src={logoUrl}
                      alt={p.name}
                      width={120}
                      height={120}
                      className="mx-auto object-contain"
                    />
                  </div>
                ) : (
                  <div className="mx-auto mb-3 w-20 h-20 rounded-full flex items-center justify-center bg-[color-mix(in_srgb,var(--bg-2)_40%,transparent)] text-lg font-bold">
                    {initials(p.name)}
                  </div>
                )}
                <div className="font-semibold text-lg">{p.name}</div>

                {p.links && p.links.length > 0 && (
                  <div className="mt-3 flex items-center justify-center gap-3">
                    {p.links.map((l, idx) => (
                      <a key={idx} href={l.href} target="_blank" rel="noreferrer" className="btn btn-inverted px-3 py-2 text-sm">
                        <FontAwesomeIcon icon={iconFor(l.type)} />
                        <span className="sr-only">{l.customLabel?l.customLabel:l.type}</span>
                      </a>
                    ))}
                  </div>
                )}
              </AnimatedSection>
            )})}
          </div>
        ) : (
          // Detailed cards variant
          <div className={`grid gap-6 md:gap-8 ${gridCols}`}>
            {items.map((p, i) => (
              <AnimatedSection delay={i * 0.08} key={`${p.name}-${i}`} className={`card card-outline w-full ${radius} p-6 md:p-7`}>                
                <div className="flex items-center gap-4">
                  {`${resolveAssetUrl(p.logoUrl?p.logoUrl:'')}` ? (
                    <Image
                      src={`${resolveAssetUrl(p.logoUrl?p.logoUrl:'')}`}
                      alt={p.name}
                      width={64}
                      height={64}
                      className="rounded-xl object-contain"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-[color-mix(in_srgb,var(--bg-2)_40%,transparent)] text-base font-bold">
                      {initials(p.name)}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-lg leading-tight">{p.name}</div>
                    {p.description && <p className="text-sm text-muted mt-1">{p.description}</p>}
                  </div>
                </div>

                {p.links && p.links.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.links.map((l, idx) => (
                      <a key={idx} href={l.href} target="_blank" rel="noreferrer" className="btn btn-inverted">
                        <FontAwesomeIcon icon={iconFor(l.type)} />
                        <span className="ml-1 capitalize">{l.customLabel?l.customLabel:l.type}</span>
                      </a>
                    ))}
                  </div>
                )}
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

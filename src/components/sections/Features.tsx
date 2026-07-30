'use client';
import type { FeaturesSection } from '@/types/site';
import AnimatedSection from '@/components/AnimatedSection';
import Image from 'next/image';
import { resolveAssetUrl } from '@/lib/assetUrl';
import {SeperatorWave} from '@/components/SeperatorWave';

export function Features({ id, title, items, backgroundClass, topWaveType, bottomWaveType }: FeaturesSection) {
  return (
  <div className='relative'>
    <SeperatorWave type={topWaveType} flip={false} color={'var(--bg)'} />
    <section id={id} className={`section ${backgroundClass}`}>
      <div className="mx-auto max-w-6xl">
        {title ? <AnimatedSection><h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12">{title}</h2></AnimatedSection> : null}
    
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2">
          {items.map((f, i) => {
            const fimgUrl = resolveAssetUrl(f.imageUrl);
            const ink = i % 2 === 0; // alternate deep “ink” panels like your screenshots
            return (
              <AnimatedSection key={i} delay={i * 0.08}>
                <div className={`overflow-hidden !max-w-none !mx-0 ${ink ? 'card-ink' : 'card'}`}>
                  {fimgUrl ? (
                    <div className="relative w-full min-h-[300px]">
                      <Image
                        src={fimgUrl}
                        alt={f.title || ''}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover feature-image"
                        loading="eager"
                      />
                    </div>
                  ) : null}
                  <div className="p-7">
                    <div className={`text-2xl font-bold mb-2 ${ink ? 'text-[var(--text-2)]' : 'text-[var(--text-1)]'}`}>{f.title}</div>
                    {f.body ? <p className={`${ink ? 'text-[var(--text-2)]/90' : 'text-[var(--text-1)]'}`}>{f.body}</p> : null}
                    <div className="mt-6">
                      {f.link ? (
                        <a href={f.link} className={ink ? 'btn-gradient-inverted' : 'btn-gradient'}>
                          Learn more
                          <span aria-hidden className="ml-2">↗</span>
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
    <SeperatorWave type={bottomWaveType} flip={true} color={'var(--bg)'} />
    </div>
  );
}

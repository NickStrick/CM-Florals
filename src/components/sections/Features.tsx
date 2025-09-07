'use client';
import type { FeaturesSection } from '@/types/site';
import AnimatedSection from '@/components/AnimatedSection';
import Image from 'next/image';

export function Features({ id, title, items }: FeaturesSection) {
  return (
    <section id={id} className="section">
      <div className="mx-auto max-w-6xl">
        {title ? <AnimatedSection><h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12">{title}</h2></AnimatedSection> : null}

        <div className="grid gap-8 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] place-content-center">
          {items.map((f, i) => {
            const ink = i % 2 === 0; // alternate deep “ink” panels like your screenshots
            return (
              <AnimatedSection key={i} delay={i * 0.08}>
                <div className={`p-7 ${ink ? 'card-ink' : 'card'}`}>
                  {f.imageUrl ? (
                    <div className={` rounded-[var(--round-xl)] aspect-square overflow-hidden mb-4 mx-auto ${f.imageSize === 'sm' ? 'w-16 h-16' : f.imageSize === 'md' ? 'w-24 h-24' : f.imageSize === 'lg' ? 'w-[100%] h-auto' : 'w-full h-full' }`}>
                      <Image src={f.imageUrl} alt="" width={980} height={740} className="w-full h-auto" loading='eager' />
                      </div>) : null}
                  <div className="text-2xl font-bold mb-2">{f.title}</div>
                  {f.body ? <p className={`${ink ? 'text-[var(--text-1)]/90' : 'text-muted'}`}>{f.body}</p> : null}
                  <div className="mt-6">
                    {f.link?<a href={f.link} className={`inline-flex items-center gap-2 ${ink ? 'text-white' : 'text-fg'} underline cursor-pointer`}>
                      Learn more
                      <span aria-hidden>↗</span>
                    </a>:null}
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}

'use client';
import type { FooterSection } from '@/types/site';
import Link from 'next/link';
import AnimatedSection from '@/components/AnimatedSection';

export function Footer({ columns = [], legal }: FooterSection) {
  return (
    <AnimatedSection className="section bg-gradient-2">
      <div className="mx-auto max-w-6xl grid md:grid-cols-4 gap-8">
        {columns.map((c, i) => (
          <div key={i}>
            {c.title ? <div className="font-semibold mb-3">{c.title}</div> : null}
            <ul className="space-y-2 text-muted">
              {c.links.map((l,i) => (
                <li key={l.label+i}>
                  <Link className="hover:text-fg transition-colors" href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {legal ? <p className="text-center text-sm text-muted mt-8">{legal}</p> : null}
    </AnimatedSection>
  );
}

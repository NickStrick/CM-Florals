'use client';

import AnimatedSection from '@/components/AnimatedSection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { SiteDisabledSection } from '@/types/site';
import { SOCIAL_ICONS } from './Socials';

// Rendered on its own (no header/footer) when Settings → General →
// "Toggle Site Unavailable" is on. See getSiteDisabledSection.
export default function SiteDisabled({ id, title, message, socials = [] }: SiteDisabledSection) {
  return (
    <section
      id={id}
      aria-label="Site unavailable"
      className="section bg-[var(--bg)] min-h-screen flex items-center justify-center"
    >
      <AnimatedSection className="mx-auto max-w-3xl text-center">
        {title && <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-1)]">{title}</h1>}
        {message && <p className="text-muted mt-4 text-lg whitespace-pre-line">{message}</p>}

        {socials.length > 0 && (
          <ul className="flex flex-wrap justify-center gap-5 mt-8">
            {socials.map((s, i) => (
              <li key={`${s.type}-${i}`}>
                <a
                  href={s.href}
                  target={s.type === 'email' ? undefined : '_blank'}
                  rel={s.type === 'email' ? undefined : 'noreferrer'}
                  className="group inline-flex flex-col items-center gap-5"
                >
                  <span
                    className="btn-gradient btn-gradient-icon !rounded-full w-14 h-14 text-[22px] inline-flex items-center justify-center !shadow-[var(--elev-2)] bg-[length:150%] transition-border duration-200 border-[2px] border-transparent hover:border-white"
                    aria-label={s.label ?? s.type}
                  >
                    <FontAwesomeIcon icon={SOCIAL_ICONS[s.type]} />
                  </span>
                  {s.label && <span className="text-sm text-muted mt-2 capitalize">{s.label}</span>}
                </a>
              </li>
            ))}
          </ul>
        )}
      </AnimatedSection>
    </section>
  );
}

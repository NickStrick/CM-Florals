'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useSite } from '@/context/SiteContext';
import type { HeaderSection } from '@/types/site';
import Image from 'next/image';
import { handleHashClick } from '@/lib/scrollToHash';

export default function Navbar() {
  const { config } = useSite();
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string>('');

  const header = useMemo<HeaderSection>(() => {
    const fromConfig = config?.sections.find(s => s.type === 'header') as HeaderSection | undefined;
    // defaults if nothing provided
    return (
      fromConfig ?? {
        id: 'hdr',
        type: 'header',
        logoText: 'Site-Crafter',
        logoImage: '',
        links: [
          { label: 'Features', href: '#features' },
          { label: 'Newsletter', href: '#newsletter' },
          { label: 'Contact', href: '#contact' },
        ],
        style: { sticky: true, blur: true, elevation: 'sm' },
      }
    );
  }, [config]);
  useEffect(() => {
    if (!activeHref && (header.links?.length ?? 0) > 0) {
      setActiveHref(header.links![0].href);
    }
  }, [activeHref, header.links]);

  useEffect(() => {
    const links = (header.links ?? []);
    if (links.length === 0) return;
    const homeHref =
      header.links?.find(l => l.href === '/' || l.href === '#home' || l.href === '#top')?.href ??
      links[0].href;

    const sections = links
      .map(l => {
        if(!l.href.includes('#')) l.href = '#top'
        return({ href: l.href, el: document.querySelector(l.href) as HTMLElement | null })
      })
      // .filter(s => s.el);

    if (sections.length === 0) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (window.scrollY <= 1) {
          if (homeHref !== activeHref) setActiveHref(homeHref);
          ticking = false;
          return;
        }
        const activeLine = sticky ? 64 : 0;
        const measured = sections.map(s => ({
          href: s.href,
          rect: s.el!.getBoundingClientRect(),
        }));

        const crossing = measured.filter(
          s => s.rect.top <= activeLine && s.rect.bottom > activeLine
        );

        const above = measured.filter(s => s.rect.top <= activeLine);

        const nextHref =
          (crossing.length > 0 ? crossing[crossing.length - 1].href
          : above.length > 0 ? above[above.length - 1].href
          : sections[0].href);

        if (nextHref !== activeHref) {
          setActiveHref(nextHref);
        }
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [activeHref, header.links]);

  const { sticky = true, blur = true, elevation = 'sm', transparent = false } = header.style ?? {};

  // computed classes
  const positionCls = sticky ? 'fixed top-0 inset-x-0' : 'relative'; // 👈 sticky toggle
  const bgCls = transparent
    ? 'bg-transparent'
    : 'bg-[color-mix(in_srgb,var(--bg)_80%,transparent)]';
  const blurCls = blur ? 'backdrop-blur supports-[backdrop-filter]:backdrop-blur' : '';
  const shadowCls =
    elevation === 'md' ? 'shadow-md/50 shadow'
    : elevation === 'sm' ? 'shadow-sm'
    : 'shadow-none';

  // Close menu on nav click (mobile)
  const onNav = () => setOpen(false);
  const handleAnchorClick = (href: string, closeMenu: boolean) =>
    handleHashClick(href, {
      setActiveHref,
      onAfterScroll: closeMenu ? onNav : undefined,
    });

  return (
    <>
      <header
        className={[
          positionCls,
          'z-50 border-b border-[color-mix(in_srgb,var(--fg)_10%,transparent)]',
          bgCls,
          blurCls,
          shadowCls,
        ].join(' ')}
      >
        <nav className="mx-auto max-w-6xl h-[4rem] px-4 md:px-6 flex items-center">
          {/* Left: Logo */}
          <div className="min-w-0 flex-1 relative">
            <Link href="/" className="absolute left-[-70px] top-[-15px] rounded-full overflow-hidden w-[60px] h-[60px]">
            {header.logoImage&&header.logoImage.length?
              <Image src={header.logoImage} alt="logo" width={140} height={60}  />
              :<></>}</Link>
            <Link href="/" className="text-lg font-semibold hover:opacity-90 text-[var(--text-1)] gradient-text ">
              
              {header.logoText ?? 'Site-Crafter'}
            </Link>
          </div>

          {/* Center: Links (desktop) */}
          <ul className="hidden md:flex flex-1 justify-center gap-6 text-muted">
            {(header.links ?? []).map(l => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="relative inline-flex flex-col items-center gap-2 hover:text-fg transition-colors text-nowrap"
                  onClick={handleAnchorClick(l.href, false)}
                >
                  <span>{l.label}</span>
                  <div
                    className={[
                      'h-[4px] w-full rounded-full',
                      'bg-gradient-to-r from-amber-400 via-[var(--primary)] to-[var(--accent)]',
                      'transition-transform duration-300 ease-out origin-left',
                      activeHref === l.href ? 'scale-x-100' : 'scale-x-0',
                    ].join(' ')}
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* Right: CTA (optional) & Mobile toggle */}
          <div className="min-w-0 flex-1 flex justify-end items-center gap-3">
            {header.cta ? (
              <Link href={header.cta.href} className="btn-small text-nowrap btn-gradient hidden md:inline-flex">
                {header.cta.label}
              </Link>
            ) : null}

            {/* Mobile menu button */}
            <button
              className="md:hidden inline-flex items-center justify-center min-w-9 w-9 h-9 rounded-md
                         border border-[color-mix(in_srgb,var(--fg)_12%,transparent)] text-[var(--text-1)]"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen(v => !v)}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile dropdown */}
        <div
          id="mobile-nav"
          className={`
            md:hidden overflow-hidden transition-[max-height] text-[var(--text-1)]
            border-t border-[color-mix(in_srgb,var(--fg)_10%,transparent)]
            ${open ? 'max-h-96' : 'max-h-0'}
          `}
        >
          <ul className="px-4 py-3 flex flex-col gap-2 bg-[color-mix(in_srgb,var(--bg)_92%,transparent)]">
            {(header.links ?? []).map(l => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block py-2 text-fg/80 hover:text-fg text-nowrap"
                  onClick={handleAnchorClick(l.href, true)}
                >
                  <span className="inline-flex flex-col items-start gap-2">
                    {l.label}
                    <div
                      className={[
                        'h-[2px] w-full rounded-full',
                        'bg-gradient-to-r from-amber-400 via-[var(--primary)] to-[var(--accent)]',
                        'transition-transform duration-300 ease-out origin-left',
                        activeHref === l.href ? 'scale-x-100' : 'scale-x-0',
                      ].join(' ')}
                    />
                  </span>
                </Link>
              </li>
            ))}
            {/* {header.cta ? (
              <li className="pt-2">
                <Link href={header.cta.href} className="btn-gradient w-full" onClick={onNav}>
                  {header.cta.label}
                </Link>
              </li>
            ) : null} */}
          </ul>
        </div>
      </header>

      {/* Spacer so content isn't hidden when sticky */}
      {sticky && <div aria-hidden className="h-[4rem]" />}
    </>
  );
}

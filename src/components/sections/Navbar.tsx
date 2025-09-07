'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useSite } from '@/context/SiteContext';
import type { HeaderSection } from '@/types/site';

export default function Navbar() {
  const { config } = useSite();
  const [open, setOpen] = useState(false);

  const header = useMemo<HeaderSection>(() => {
    const fromConfig = config?.sections.find(s => s.type === 'header') as HeaderSection | undefined;
    // defaults if nothing provided
    return (
      fromConfig ?? {
        id: 'hdr',
        type: 'header',
        logoText: 'Site-Crafter',
        links: [
          { label: 'Features', href: '#features' },
          { label: 'Newsletter', href: '#newsletter' },
          { label: 'Contact', href: '#contact' },
        ],
        style: { sticky: true, blur: true, elevation: 'sm' },
      }
    );
  }, [config]);

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
          <div className="min-w-0 flex-1">
            <Link href="/" className="text-lg font-semibold hover:opacity-90 text-[var(--text-1)]">
              {header.logoText ?? 'Site-Crafter'}
            </Link>
          </div>

          {/* Center: Links (desktop) */}
          <ul className="hidden md:flex flex-1 justify-center gap-6 text-muted">
            {(header.links ?? []).map(l => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-fg transition-colors">
                  {l.label}
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
                  className="block py-2 text-fg/80 hover:text-fg"
                  onClick={onNav}
                >
                  {l.label}
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

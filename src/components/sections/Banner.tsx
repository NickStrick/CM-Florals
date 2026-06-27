'use client';

import { useEffect, useState } from 'react';
import type { BannerSection } from '@/types/site';
import Link from 'next/link';
import Image from 'next/image';
import { resolveAssetUrl } from '@/lib/assetUrl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const BAR_CLASS: Record<BannerVariantKey, string> = {
  announcement: 'bg-[var(--bg-2)] text-[var(--text-1)]',
  promo: 'text-white',
  alert: 'bg-amber-400 text-black',
};

const CTA_CLASS: Record<BannerVariantKey, string> = {
  announcement: 'bg-[var(--primary)] text-white hover:opacity-90',
  promo: 'bg-white text-[var(--primary)] hover:opacity-90',
  alert: 'bg-black text-white hover:opacity-90',
};

type BannerVariantKey = NonNullable<BannerSection['variant']>;

export default function Banner({
  id,
  variant = 'announcement',
  title,
  body,
  imageUrl,
  cta,
  dismissible,
}: BannerSection) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!dismissible) return;
    if (sessionStorage.getItem(`banner-dismissed-${id}`) === '1') setDismissed(true);
  }, [dismissible, id]);

  if (dismissed) return null;
  if (!title && !body && !imageUrl) return null;

  const imgUrl = resolveAssetUrl(imageUrl);
  const promoStyle =
    variant === 'promo'
      ? { backgroundImage: 'linear-gradient(to right, var(--primary), var(--accent))' }
      : undefined;

  const handleDismiss = () => {
    if (dismissible) sessionStorage.setItem(`banner-dismissed-${id}`, '1');
    setDismissed(true);
  };

  return (
    <section id={id} className={`relative w-full ${BAR_CLASS[variant]}`} style={promoStyle}>
      <div className="container mx-auto px-4 py-3 flex items-center gap-4 flex-wrap justify-center sm:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-md object-cover flex-shrink-0"
            />
          ) : null}
          <div className="min-w-0 text-sm sm:text-base text-center sm:text-left">
            {title ? <span className="font-bold mr-2">{title}</span> : null}
            {body ? <span className="opacity-90">{body}</span> : null}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {cta?.href ? (
            <Link
              href={cta.href}
              className={`text-sm font-semibold rounded-full px-4 py-1.5 transition ${CTA_CLASS[variant]}`}
            >
              {cta.label}
            </Link>
          ) : null}
          {dismissible ? (
            <button
              type="button"
              aria-label="Dismiss"
              onClick={handleDismiss}
              className="opacity-70 hover:opacity-100"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

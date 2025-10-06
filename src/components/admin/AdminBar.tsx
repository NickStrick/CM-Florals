'use client';

import { useMemo, useState } from 'react';
import { useSite } from '@/context/SiteContext';
import MediaPicker from './MediaPicker';
import { getSiteId } from '@/lib/siteId';

type PickerKind = 'generic' | 'video-files' | 'video-posters';

export default function AdminBar() {
  const { config } = useSite();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<PickerKind>('generic');

  const siteId = getSiteId();
  const bucket = process.env.NEXT_PUBLIC_S3_DEFAULT_BUCKET;

  // Does config include a video section?
  const hasVideo = useMemo(
    () => !!config?.sections?.some(s => s.type === 'video' && s.visible !== false),
    [config?.sections]
  );

  // compute prefix by kind
  const prefix = useMemo(() => {
    switch (kind) {
      case 'video-files':
        return `configs/${siteId}/videos/`;
      case 'video-posters':
        return `configs/${siteId}/assets/`;
      default:
        return `configs/${siteId}/assets/`;
    }
  }, [kind, siteId]);

  return (
    <>
      <div className="fixed right-4 top-4 z-[1000]">
        <div className="card px-4 py-3 flex items-center gap-3">
          <span className="font-semibold">Admin Mode</span>

          {/* Generic picker (kept from earlier) */}
          <button
            className="btn btn-inverted"
            onClick={() => { setKind('generic'); setOpen(true); }}
          >
            Media Picker
          </button>

          {/* Show these only if a video section exists */}
          {hasVideo && (
            <>
              <button
                className="btn btn-primary"
                onClick={() => { setKind('video-files'); setOpen(true); }}
                title="Upload/select MP4 files for Video sections"
              >
                Manage Video Files
              </button>
              <button
                className="btn btn-primary"
                onClick={() => { setKind('video-posters'); setOpen(true); }}
                title="Upload/select poster images for Video sections"
              >
                Manage Video Posters
              </button>
            </>
          )}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[1100] bg-black/50 flex items-center justify-center p-4">
          <div className="card p-4 relative w-fit !max-w-full pr-[70px]">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 btn btn-ghost"
              aria-label="Close"
            >
              ✕
            </button>

            <MediaPicker
              bucket={bucket}
              prefix={prefix}
              onPick={(key) => {
                // For now: just log. In the config editor, this would set field values (source.key or posterUrl).
                console.log(`[${kind}] picked:`, key);
                setOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

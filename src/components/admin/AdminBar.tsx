'use client';

import { useMemo, useState } from 'react';
import { useSite } from '@/context/SiteContext';
import MediaPicker from './MediaPicker';
import { getSiteId } from '@/lib/siteId';
import ConfigModal from './ConfigModal';

type PickerKind = 'generic' | 'video-files' | 'video-posters';

export default function AdminBar() {
  const { config } = useSite();
  const [openPicker, setOpenPicker] = useState(false);
  const [kind, setKind] = useState<PickerKind>('generic');
  const [showConfig, setShowConfig] = useState(false);

  const siteId = getSiteId();
  const bucket = process.env.NEXT_PUBLIC_S3_DEFAULT_BUCKET;

  const hasVideo = useMemo(
    () => !!config?.sections?.some(s => s.type === 'video' && s.visible !== false),
    [config?.sections]
  );

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
      <div className="fixed right-4 top-4 z-[10000]">
        <div className="card px-4 py-3 flex flex-wrap items-center gap-3">
          <span className="font-semibold">Admin Mode</span>

          <button
            className="btn btn-primary"
            onClick={() => setShowConfig(true)}
            title="Edit site config (sections, fields, media links)"
          >
            Edit Sections
          </button>

          <button
            className="btn btn-inverted"
            onClick={() => { setKind('generic'); setOpenPicker(true); }}
          >
            Media Files
          </button>

          {hasVideo && (
            <>
              <button
                className="btn btn-primary"
                onClick={() => { setKind('video-files'); setOpenPicker(true); }}
                title="Upload/select MP4 files for Video sections"
              >
                Manage Video Files
              </button>
              <button
                className="btn btn-primary"
                onClick={() => { setKind('video-posters'); setOpenPicker(true); }}
                title="Upload/select poster images for Video sections"
              >
                Manage Video Posters
              </button>
            </>
          )}
        </div>
      </div>

      {/* Media Picker modal */}
      {openPicker && (
        <div className="fixed inset-0 z-[1100] bg-black/50 flex items-center justify-center p-4">
          <div className="card p-4 relative w-fit !max-w-full pr-[70px] max-h-[100vh] overflow-auto">
            <button
              onClick={() => setOpenPicker(false)}
              className="absolute right-3 top-3 btn btn-ghost"
              aria-label="Close"
            >
              ✕
            </button>

            <MediaPicker
              bucket={bucket}
              prefix={prefix}
              onPick={(key) => {
                console.log(`[${kind}] picked:`, key);
                setOpenPicker(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Config editor modal */}
      {showConfig && <ConfigModal onClose={() => setShowConfig(false)} />}
    </>
  );
}

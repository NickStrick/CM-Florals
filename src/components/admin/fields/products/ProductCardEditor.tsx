'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import type { Product, ProductListingsSection } from '@/types/site';
import { resolveAssetUrl } from '@/lib/assetUrl';
import ProductImagesEditor from './ProductImagesEditor';
import ProductFeaturesEditor from './ProductFeaturesEditor';
import ProductSpecsEditor from './ProductSpecsEditor';
import ProductBadgesTagsEditor from './ProductBadgesTagsEditor';

type VariantColor = { _id: string; name: string; hex?: string; imageUrl?: string };
type VariantSize  = { _id: string; label: string; value?: string };

type LocalProduct = Omit<Product, 'colors' | 'sizes'> & {
  _id: string; // stable editor-only key for the card
  images: Array<{ _id: string; url: string; alt?: string }>;
  specs: Array<{ _id: string; label: string; value: string }>;
  features: string[];
  badges: string[];
  tags: string[];
  // variant editors (editor-only ids)
  colors?: VariantColor[];
  sizes?: VariantSize[];
};

function rid() {
  return (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

export default function ProductCardEditor({
  product,
  index,
  total,
  section,
  onUpdate,
  onRemove,
  onMove,
  openMediaPicker,
  siteId,
}: {
  product: LocalProduct;
  index: number;
  total: number;
  section: ProductListingsSection;
  onUpdate: (patch: Partial<LocalProduct>) => void;
  onRemove: () => void;
  onMove: (to: number) => void;
  openMediaPicker: (prefix: string) => Promise<string | null>;
  siteId: string;
}) {
  // ---------- Variant helpers ----------
  const ensureColors = () => product.colors ?? [];
  const ensureSizes  = () => product.sizes  ?? [];

  const addColor = () => {
    const next = [...ensureColors(), { _id: rid(), name: '', hex: '', imageUrl: '' }];
    onUpdate({ colors: next });
  };

  const updateColor = (i: number, patch: Partial<VariantColor>) => {
    const arr = [...ensureColors()];
    const cur = arr[i];
    if (!cur) return;
    arr[i] = { ...cur, ...patch };
    onUpdate({ colors: arr });
  };

  const removeColor = (i: number) => {
    const arr = ensureColors().filter((_, idx) => idx !== i);
    onUpdate({ colors: arr });
  };

  const addSize = () => {
    const next = [...ensureSizes(), { _id: rid(), label: '', value: '' }];
    onUpdate({ sizes: next });
  };

  const updateSize = (i: number, patch: Partial<VariantSize>) => {
    const arr = [...ensureSizes()];
    const cur = arr[i];
    if (!cur) return;
    arr[i] = { ...cur, ...patch };
    onUpdate({ sizes: arr });
  };

  const removeSize = (i: number) => {
    const arr = ensureSizes().filter((_, idx) => idx !== i);
    onUpdate({ sizes: arr });
  };

  return (
    <div className="card card-solid p-4 space-y-4">
      <div className="flex items-center gap-2">
        <div className="font-semibold">{product.name || 'Untitled Product'}</div>
        <div className="text-xs opacity-70">({product.id})</div>
        <div className="ml-auto flex gap-1">
          <button
            className="btn btn-ghost px-2"
            onClick={() => onMove(index - 1)}
            disabled={index === 0}
            title="Move up"
          >
            <FontAwesomeIcon icon={faChevronUp} className="text-xs" />
          </button>
          <button
            className="btn btn-ghost px-2"
            onClick={() => onMove(index + 1)}
            disabled={index === total - 1}
            title="Move down"
          >
            <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
          </button>
          <button className="btn btn-ghost text-red-600" onClick={onRemove} title="Remove">
            Remove
          </button>
        </div>
      </div>

      {/* Basics */}
      <div className="grid md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium">Product ID (slug)</label>
          <input
            className="input w-full"
            value={product.id}
            onChange={(e) => onUpdate({ id: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            className="input w-full"
            value={product.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Subtitle</label>
          <input
            className="input w-full"
            value={product.subtitle ?? ''}
            onChange={(e) => onUpdate({ subtitle: e.target.value })}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-3">
        <div>
          <label className="block text-sm font-medium">SKU</label>
          <input
            className="input w-full"
            value={product.sku ?? ''}
            onChange={(e) => onUpdate({ sku: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Price (cents)</label>
          <input
            type="number"
            className="input w-full"
            value={product.price}
            onChange={(e) => onUpdate({ price: Math.max(0, Number(e.target.value) || 0) })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Compare at (cents)</label>
          <input
            type="number"
            className="input w-full"
            value={product.compareAtPrice ?? 0}
            onChange={(e) => onUpdate({ compareAtPrice: Math.max(0, Number(e.target.value) || 0) })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Currency</label>
          <input
            className="input w-full"
            value={product.currency ?? 'USD'}
            onChange={(e) => onUpdate({ currency: e.target.value })}
            placeholder="USD"
          />
        </div>
      </div>

      {/* Thumbnail */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Thumbnail URL</label>
        <div className="h-28 w-28 aspect-square overflow-hidden rounded-md border border-gray-200 bg-gray-50">
          {product.thumbnailUrl ? (
            <img
              src={resolveAssetUrl(product.thumbnailUrl) ?? product.thumbnailUrl}
              alt="Image preview"
              className="admin-image-preview"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-xs text-muted">
              No image selected
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <input
            className="input flex-1"
            value={product.thumbnailUrl ?? ''}
            onChange={(e) => onUpdate({ thumbnailUrl: e.target.value })}
            placeholder="configs/{siteId}/assets/product-thumb.jpg or https://…"
          />
          <button
            type="button"
            className="btn btn-inverted"
            onClick={async () => {
              const picked = await openMediaPicker(`configs/${siteId}/assets/`);
              if (picked) onUpdate({ thumbnailUrl: picked });
            }}
          >
            Pick…
          </button>
        </div>
      </div>

      {/* Images */}
      <ProductImagesEditor
        product={product}
        onUpdate={onUpdate}
        openMediaPicker={openMediaPicker}
        siteId={siteId}
      />

      {/* Copy */}
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Summary</label>
          <textarea
            className="textarea w-full"
            value={product.summary ?? ''}
            onChange={(e) => onUpdate({ summary: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            className="textarea w-full"
            value={product.description ?? ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
          />
        </div>
      </div>

      {/* Features */}
      <ProductFeaturesEditor product={product} onUpdate={onUpdate} />

      {/* Specs */}
      <ProductSpecsEditor product={product} onUpdate={onUpdate} />

      {/* Badges / Tags */}
      <ProductBadgesTagsEditor product={product} onUpdate={onUpdate} />

      {/* ---------- Variants: Colors ---------- */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Colors</label>
          <button className="btn btn-ghost" onClick={addColor}>Add color</button>
        </div>

        {(ensureColors()).length === 0 && (
          <div className="text-sm text-muted">No colors yet.</div>
        )}

        <div className="space-y-2">
          {ensureColors().map((c, i) => (
            <div key={c._id} className="grid md:grid-cols-[1fr_140px_1fr_auto] gap-2 items-center">
              <input
                className="input"
                placeholder="Color name (e.g., Red)"
                value={c.name}
                onChange={(e) => updateColor(i, { name: e.target.value })}
              />
              <input
                className="input"
                placeholder="#hex"
                value={c.hex ?? ''}
                onChange={(e) => updateColor(i, { hex: e.target.value })}
              />
              <input
                className="input"
                placeholder="Swatch / image URL (optional)"
                value={c.imageUrl ?? ''}
                onChange={(e) => updateColor(i, { imageUrl: e.target.value })}
              />
              <button className="btn btn-ghost text-red-600" onClick={() => removeColor(i)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Variants: Sizes ---------- */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Sizes</label>
          <button className="btn btn-ghost" onClick={addSize}>Add size</button>
        </div>

        {(ensureSizes()).length === 0 && (
          <div className="text-sm text-muted">No sizes yet.</div>
        )}

        <div className="space-y-2">
          {ensureSizes().map((s, i) => (
            <div key={s._id} className="grid md:grid-cols-[1fr_1fr_auto] gap-2 items-center">
              <input
                className="input"
                placeholder="Label (e.g., S, M, L)"
                value={s.label}
                onChange={(e) => updateSize(i, { label: e.target.value })}
              />
              <input
                className="input"
                placeholder="Value (optional)"
                value={s.value ?? ''}
                onChange={(e) => updateSize(i, { value: e.target.value })}
              />
              <button className="btn btn-ghost text-red-600" onClick={() => removeSize(i)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Inventory / Purchase */}
      <div className="grid md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium">Stock</label>
          <select
            className="select w-full"
            value={product.stock ?? 'in_stock'}
            onChange={(e) => onUpdate({ stock: e.target.value as Product['stock'] })}
          >
            <option value="in_stock">in_stock</option>
            <option value="low_stock">low_stock</option>
            <option value="out_of_stock">out_of_stock</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Qty Available</label>
          <input
            type="number"
            className="input w-full"
            value={product.quantityAvailable ?? 0}
            onChange={(e) => onUpdate({ quantityAvailable: Math.max(0, Number(e.target.value) || 0) })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Digital</label>
          <select
            className="select w-full"
            value={String(!!product.digital)}
            onChange={(e) => onUpdate({ digital: e.target.value === 'true' })}
          >
            <option value="false">false</option>
            <option value="true">true</option>
          </select>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <label className="flex items-end gap-2">
          <input
            type="checkbox"
            checked={product.taxable === true}
            onChange={(e) => onUpdate({ taxable: e.target.checked })}
          />
          <span>Taxable</span>
        </label>
      </div>

      <div className="grid md:grid-cols-4 gap-3">
        <div>
          <label className="block text-sm font-medium">Weight (kg)</label>
          <input
            type="number"
            className="input w-full"
            value={product.weightKg ?? 0}
            onChange={(e) => onUpdate({ weightKg: Number(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Width (cm)</label>
          <input
            type="number"
            className="input w-full"
            value={product.widthCm ?? 0}
            onChange={(e) => onUpdate({ widthCm: Number(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Height (cm)</label>
          <input
            type="number"
            className="input w-full"
            value={product.heightCm ?? 0}
            onChange={(e) => onUpdate({ heightCm: Number(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Depth (cm)</label>
          <input
            type="number"
            className="input w-full"
            value={product.depthCm ?? 0}
            onChange={(e) => onUpdate({ depthCm: Number(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Shipping Class</label>
        <input
            className="input w-full"
            value={product.shippingClass ?? ''}
            onChange={(e) => onUpdate({ shippingClass: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Purchase URL</label>
          <input
            className="input w-full"
            value={product.purchaseUrl ?? ''}
            onChange={(e) => onUpdate({ purchaseUrl: e.target.value })}
            placeholder="https://… (checkout or external link)"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Button Label</label>
        <input
          className="input w-full"
          value={product.ctaLabel ?? ''}
          onChange={(e) => onUpdate({ ctaLabel: e.target.value })}
          placeholder={`Defaults to: ${section.buyCtaFallback ?? 'Buy Now'}`}
        />
      </div>
    </div>
  );
}

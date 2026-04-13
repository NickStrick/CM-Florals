'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pencil, Plus, Star, Trash2, X } from 'lucide-react';
import type { SiteConfig, SiteProduct, SiteProductsConfig } from '@/types/site';
import { useSite } from '@/context/SiteContext';
import { getSiteId } from '@/lib/siteId';
import { resolveAssetUrl } from '@/lib/assetUrl';

// ─── Utilities ────────────────────────────────────────────────────────────────

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

function rid() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

function formatPrice(cents: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100);
}

function blankProduct(): SiteProduct & { _localId: string } {
  return {
    _localId: rid(),
    id: `product-${rid().slice(0, 8)}`,
    name: '',
    category: '',
    subtitle: '',
    price: 0,
    compareAtPrice: undefined,
    currency: 'USD',
    thumbnailUrl: '',
    summary: '',
    featured: false,
    stock: 'in_stock',
    ctaLabel: '',
  };
}

// ─── Product Edit Form ────────────────────────────────────────────────────────

type LocalProduct = SiteProduct & { _localId: string };

function ProductEditForm({
  product,
  onChange,
  onRemove,
  onDone,
}: {
  product: LocalProduct;
  onChange: (patch: Partial<LocalProduct>) => void;
  onRemove: () => void;
  onDone: () => void;
}) {
  const field = (
    label: string,
    key: keyof SiteProduct,
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  ) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        className="input w-full"
        value={(product[key] as string | number | undefined) ?? ''}
        onChange={(e) => onChange({ [key]: e.target.value } as Partial<LocalProduct>)}
        {...inputProps}
      />
    </div>
  );

  return (
    <div className="card admin-card card-solid p-4 space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        {field('Name *', 'name', { placeholder: 'Product name' })}
        {field('Category / Occasion', 'category', { placeholder: 'e.g. Birthday' })}
      </div>
      {field('Subtitle', 'subtitle', { placeholder: 'Short descriptor' })}
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Price ($)</label>
          <input
            type="number"
            min={0}
            step={0.01}
            className="input w-full"
            value={product.price > 0 ? (product.price / 100).toFixed(2) : ''}
            onChange={(e) => onChange({ price: Math.round(Number(e.target.value) * 100) || 0 })}
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Compare-at Price ($)</label>
          <input
            type="number"
            min={0}
            step={0.01}
            className="input w-full"
            value={product.compareAtPrice ? (product.compareAtPrice / 100).toFixed(2) : ''}
            onChange={(e) => {
              const v = Math.round(Number(e.target.value) * 100) || 0;
              onChange({ compareAtPrice: v > 0 ? v : undefined });
            }}
            placeholder="0.00"
          />
        </div>
      </div>
      {field('Thumbnail URL', 'thumbnailUrl', { placeholder: 'https://...' })}
      <div>
        <label className="block text-sm font-medium mb-1">Summary</label>
        <textarea
          className="input w-full"
          rows={2}
          value={product.summary ?? ''}
          onChange={(e) => onChange({ summary: e.target.value })}
          placeholder="Short product blurb"
        />
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Stock</label>
          <select
            className="select w-full"
            value={product.stock ?? 'in_stock'}
            onChange={(e) => onChange({ stock: e.target.value as SiteProduct['stock'] })}
          >
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
        {field('CTA Label', 'ctaLabel', { placeholder: 'Buy Now' })}
        <label className="flex items-end gap-2 pb-2">
          <input
            type="checkbox"
            checked={product.featured === true}
            onChange={(e) => onChange({ featured: e.target.checked })}
            className="accent-[var(--admin-primary)]"
          />
          <span className="text-sm">Best Seller</span>
        </label>
      </div>
      <div className="flex justify-between pt-1">
        <button className="btn btn-ghost text-red-500 text-sm" onClick={onRemove}>
          <Trash2 className="w-4 h-4 mr-1 inline" /> Remove
        </button>
        <button className="btn btn-primary text-sm" onClick={onDone}>
          Done
        </button>
      </div>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  onEdit,
  onRemove,
}: {
  product: LocalProduct;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const thumb = resolveAssetUrl(product.thumbnailUrl);
  return (
    <div className="card admin-card card-solid flex gap-3 p-3">
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-black/10">
        {thumb ? (
          <img src={thumb} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-1 flex-wrap">
          <span className="font-semibold text-sm truncate">{product.name || <em className="opacity-40">Unnamed</em>}</span>
          {product.featured && (
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0 mt-0.5" />
          )}
        </div>
        {product.category && (
          <span className="text-xs opacity-50">{product.category}</span>
        )}
        <div className="text-sm font-medium mt-0.5">
          {product.price > 0 ? formatPrice(product.price, product.currency) : <span className="opacity-30">No price</span>}
        </div>
      </div>
      <div className="flex flex-col gap-1 flex-shrink-0">
        <button className="btn btn-ghost p-1" onClick={onEdit} aria-label="Edit product">
          <Pencil className="w-4 h-4" />
        </button>
        <button className="btn btn-ghost p-1 text-red-500" onClick={onRemove} aria-label="Remove product">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── ProductsModal ─────────────────────────────────────────────────────────────

export type ProductsModalProps = { onClose: () => void };

export default function ProductsModal({ onClose }: ProductsModalProps) {
  const { config, setConfig } = useSite();
  const siteId = getSiteId();

  const [draft, setDraft] = useState<SiteConfig | null>(null);
  const originalRef = useRef<SiteConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Local product list with _localId for React keys
  const [localProducts, setLocalProducts] = useState<LocalProduct[]>([]);

  useEffect(() => {
    if (config) {
      const copy = deepClone(config);
      setDraft(copy);
      originalRef.current = copy;
      setLocalProducts(
        (copy.products?.items ?? []).map((p) => ({ ...p, _localId: rid() }))
      );
    }
  }, [config]);

  const shopConfig = useMemo<SiteProductsConfig>(
    () => draft?.products ?? { items: [] },
    [draft?.products]
  );

  const categories = useMemo(() => {
    const seen = new Set<string>();
    for (const p of localProducts) if (p.category) seen.add(p.category);
    return Array.from(seen);
  }, [localProducts]);

  const tabProducts = useMemo(
    () =>
      activeTab === 'all'
        ? localProducts
        : localProducts.filter((p) => p.category === activeTab),
    [localProducts, activeTab]
  );

  // Sync localProducts → draft.products.items
  const commitProducts = useCallback(
    (next: LocalProduct[]) => {
      setLocalProducts(next);
      setDraft((prev) => {
        if (!prev) return prev;
        const items: SiteProduct[] = next.map(({ _localId: _, ...p }) => p);
        return { ...prev, products: { ...(prev.products ?? {}), items } };
      });
    },
    []
  );

  const updateShowFilters = useCallback((val: boolean) => {
    setDraft((prev) => {
      if (!prev) return prev;
      return { ...prev, products: { ...(prev.products ?? { items: [] }), showFilters: val } };
    });
  }, []);

  const addProduct = useCallback(() => {
    const p = blankProduct();
    const next = [...localProducts, p];
    commitProducts(next);
    setEditingId(p._localId);
  }, [commitProducts, localProducts]);

  const updateProduct = useCallback(
    (localId: string, patch: Partial<LocalProduct>) => {
      commitProducts(localProducts.map((p) => (p._localId === localId ? { ...p, ...patch } : p)));
    },
    [commitProducts, localProducts]
  );

  const removeProduct = useCallback(
    (localId: string) => {
      commitProducts(localProducts.filter((p) => p._localId !== localId));
      if (editingId === localId) setEditingId(null);
    },
    [commitProducts, editingId, localProducts]
  );

  const isDirty = useMemo(() => {
    if (!draft || !originalRef.current) return false;
    return JSON.stringify(draft) !== JSON.stringify(originalRef.current);
  }, [draft]);

  const onSave = useCallback(async () => {
    if (!draft) return;
    setSaving(true);
    setError(null);
    try {
      const variant = (process.env.NEXT_PUBLIC_CONFIG_VARIANT ?? 'draft') as 'draft' | 'published';
      const res = await fetch(
        `/api/admin/config/${encodeURIComponent(siteId)}?variant=${variant}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-local-admin': '1' },
          body: JSON.stringify(draft),
        }
      );
      if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`);
      const saved: SiteConfig = await res.json();
      setConfig(saved);
      originalRef.current = deepClone(saved);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save.');
    } finally {
      setSaving(false);
    }
  }, [draft, onClose, setConfig, siteId]);

  const onRestore = useCallback(() => {
    if (!originalRef.current) return;
    const restored = deepClone(originalRef.current);
    setDraft(restored);
    setLocalProducts((restored.products?.items ?? []).map((p) => ({ ...p, _localId: rid() })));
    setEditingId(null);
  }, []);

  if (!draft) {
    return (
      <div className="fixed inset-0 z-[12000] bg-black/50 flex items-center justify-center p-4">
        <div className="card admin-card p-6 text-sm text-muted">
          Loading...
          <div className="mt-4 text-right">
            <button className="btn btn-ghost" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed edit-modal inset-0 z-[12000] bg-black/50 flex items-center justify-center p-4">
      <div className="card admin-card card-solid p-4 relative w-full max-w-5xl !max-w-full overflow-hidden card-screen-height flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <div className="font-semibold text-lg">Products</div>
          <div className="flex items-center gap-2">
            {error && <div className="text-red-500 text-sm mr-2">{error}</div>}
            {isDirty && (
              <button className="btn btn-ghost" onClick={onRestore}>Restore</button>
            )}
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={onSave} disabled={!draft || saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Show filters toggle */}
        <div className="px-4 pt-4 flex-shrink-0">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={shopConfig.showFilters !== false}
              onChange={(e) => updateShowFilters(e.target.checked)}
              className="accent-[var(--admin-primary)]"
            />
            Show filters sidebar in shop
          </label>
        </div>

        {/* Tabs */}
        <div className="px-4 pt-4 flex-shrink-0">
          <div className="flex items-center justify-between border-b pb-0">
            <div className="flex gap-4 flex-wrap">
              {['all', ...categories].map((tab) => (
                <button
                  key={tab}
                  className={[
                    'px-3 py-2 -mb-px text-sm font-semibold border-b-4 transition-colors admin-tab',
                    activeTab === tab
                      ? 'border-transparent text-white active'
                      : 'border-transparent text-gray-300 hover:text-[var(--admin-primary)]',
                  ].join(' ')}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'all' ? `All (${localProducts.length})` : `${tab} (${localProducts.filter((p) => p.category === tab).length})`}
                </button>
              ))}
            </div>
            <button className="btn btn-primary mb-2 flex items-center gap-1 text-sm" onClick={addProduct}>
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>
        </div>

        {/* Products body */}
        <div className="flex-1 overflow-auto p-4">
          {tabProducts.length === 0 ? (
            <div className="text-sm text-muted py-8 text-center">
              {activeTab === 'all'
                ? 'No products yet. Click "Add Product" to get started.'
                : `No products in "${activeTab}".`}
            </div>
          ) : (
            <div className="space-y-3">
              {tabProducts.map((p) =>
                editingId === p._localId ? (
                  <ProductEditForm
                    key={p._localId}
                    product={p}
                    onChange={(patch) => updateProduct(p._localId, patch)}
                    onRemove={() => removeProduct(p._localId)}
                    onDone={() => setEditingId(null)}
                  />
                ) : (
                  <ProductCard
                    key={p._localId}
                    product={p}
                    onEdit={() => setEditingId(p._localId)}
                    onRemove={() => removeProduct(p._localId)}
                  />
                )
              )}
            </div>
          )}
        </div>

        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white md:hidden"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}

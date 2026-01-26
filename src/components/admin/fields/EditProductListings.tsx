'use client';

import { useCallback, useEffect, useState, useMemo } from 'react';
import type {
  ProductListingsSection,
  Product,
  ProductImage,
  ProductSpec,
} from '@/types/site';
import type { EditorProps } from './types';
import ProductCardEditor from './products/ProductCardEditor';

// ---------- Helper types ----------
type LocalSpec  = ProductSpec  & { _id: string };
type LocalImage = ProductImage & { _id: string };

// Editor-only row ids for variants
type LocalColor = { _id: string; name: string; hex?: string; imageUrl?: string };
type LocalSize  = { _id: string; label: string; value?: string };

type LocalProduct = Product & {
  _id: string;                 // stable key for React list
  images: LocalImage[];
  features: string[];
  specs: LocalSpec[];
  badges: string[];
  tags: string[];
  // variants (editor-only ids)
  colors?: LocalColor[];
  sizes?: LocalSize[];
};

// ---------- Utilities ----------
function rid() {
  return (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

function withLocalIds(p: Product): LocalProduct {
  return {
    ...p,
    _id: rid(),
    images: (p.images ?? []).map((im) => ({ ...im, _id: rid() })),
    specs:  (p.specs  ?? []).map((sp) => ({ ...sp, _id: rid() })),
    features: p.features ?? [],
    badges:   p.badges   ?? [],
    tags:     p.tags     ?? [],
    // add editor ids for variants
      // --- safe variant mapping ---
    colors: Array.isArray(p.colors)
      ? p.colors.map((c) =>
          typeof c === 'object' && c !== null
            ? { ...c, _id: rid() }
            : { _id: rid(), name: String(c), hex: '', imageUrl: '' }
        )
      : [],
    sizes: Array.isArray(p.sizes)
      ? p.sizes.map((s) =>
          typeof s === 'object' && s !== null
            ? { ...s, _id: rid() }
            : { _id: rid(), label: String(s), value: '' }
        )
      : [],
  };
}

function stripLocalIds(p: LocalProduct): Product {
  const { images, specs, colors, sizes, ...rest } = p;
  return {
    ...rest,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    images: images?.map(({ _id, ...img }: LocalImage) => img) ?? [],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    specs: specs?.map(({ _id, ...sp }: LocalSpec) => sp) ?? [],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    colors: colors?.map(({ _id, ...c }: LocalColor) => c) ?? [],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sizes: sizes?.map(({ _id, ...s }: LocalSize) => s) ?? [],
  };
}

function productsToLocal(xs: Product[]): LocalProduct[] {
  return (xs ?? []).map(withLocalIds);
}
function productsFromLocal(xs: LocalProduct[]): Product[] {
  return xs.map(stripLocalIds);
}

// ---------- Main Component ----------
export default function EditProductListings({
  section,
  onChange,
  openMediaPicker,
  siteId,
}: EditorProps<ProductListingsSection>) {
  const [localProducts, setLocalProducts] = useState<LocalProduct[]>(
    () => productsToLocal(section.products ?? [])
  );

  // keep local state in sync if section.products ref truly changes
  useEffect(() => {
    setLocalProducts(productsToLocal(section.products ?? []));
  }, [section.products]);

  // commit local -> section
  const commitProducts = useCallback(
    (next: LocalProduct[]) => {
      setLocalProducts(next);
      onChange({ ...section, products: productsFromLocal(next) });
    },
    [onChange, section]
  );

  // section fields
  const style = useMemo(() => section.style ?? { columns: 3 as const, cardVariant: 'default' as const, showBadges: true }, [section.style]);

  const setSectionField = useCallback(
    <K extends keyof ProductListingsSection>(key: K, value: ProductListingsSection[K]) => {
      onChange({ ...section, [key]: value });
    },
    [onChange, section]
  );

  const setStyle = useCallback(
    (patch: Partial<NonNullable<ProductListingsSection['style']>>) => {
      setSectionField('style', { ...style, ...patch } as NonNullable<ProductListingsSection['style']>);
    },
    [setSectionField, style]
  );

  // product CRUD
  const addProduct = useCallback(() => {
    const next = withLocalIds({
      id: `prod-${rid().slice(0, 6)}`,
      name: 'New Product',
      price: 1999,
      currency: 'USD',
      thumbnailUrl: '',
      summary: '',
      description: '',
      purchaseUrl: '',
      ctaLabel: 'Buy Now',
      stock: 'in_stock',
      images: [],
      features: [],
      specs: [],
      badges: [],
      tags: [],
      // variants start empty
      colors: [],
      sizes: [],
    });
    commitProducts([...localProducts, next]);
  }, [commitProducts, localProducts]);

  const updateProduct = useCallback(
    (id: string, patch: Partial<LocalProduct>) => {
      commitProducts(localProducts.map((p) => (p._id === id ? { ...p, ...patch } : p)));
    },
    [commitProducts, localProducts]
  );

  const removeProduct = useCallback(
    (id: string) => {
      commitProducts(localProducts.filter((p) => p._id !== id));
    },
    [commitProducts, localProducts]
  );

  const moveProduct = useCallback(
    (from: number, to: number) => {
      if (to < 0 || to >= localProducts.length) return;
      const copy = localProducts.slice();
      const [sp] = copy.splice(from, 1);
      copy.splice(to, 0, sp);
      commitProducts(copy);
    },
    [commitProducts, localProducts]
  );

  return (
    <div className="space-y-6">
      {/* ---- Section Heading ---- */}
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            className="input w-full"
            value={section.title ?? ''}
            onChange={(e) => setSectionField('title', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Subtitle</label>
          <input
            className="input w-full"
            value={section.subtitle ?? ''}
            onChange={(e) => setSectionField('subtitle', e.target.value)}
          />
        </div>
      </div>

      {/* ---- Layout and Style ---- */}
      <div className="grid md:grid-cols-4 gap-3">
        <div>
          <label className="block text-sm font-medium">Columns</label>
          <select
            className="select w-full"
            value={style.columns ?? 3}
            onChange={(e) => setStyle({ columns: Number(e.target.value) as 1 | 2 | 3 })}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Card Variant</label>
          <select
            className="select w-full"
            value={style.cardVariant ?? 'default'}
            onChange={(e) =>
              setStyle({ cardVariant: e.target.value as 'default' | 'ink' })
            }
          >
            <option value="default">default</option>
            <option value="ink">ink</option>
          </select>
        </div>

        <label className="flex items-end gap-2">
          <input
            type="checkbox"
            checked={style.showBadges !== false}
            onChange={(e) => setStyle({ showBadges: e.target.checked })}
          />
          <span>Show badges</span>
        </label>

        <div>
          <label className="block text-sm font-medium">Show-all threshold</label>
          <input
            type="number"
            min={1}
            className="input w-full"
            value={section.showAllThreshold ?? 3}
            onChange={(e) =>
              setSectionField(
                'showAllThreshold',
                Math.max(1, Number(e.target.value) || 1)
              )
            }
          />
        </div>
      </div>

      {/* ---- CTA label ---- */}
      <div>
        <label className="block text-sm font-medium">Default Buy CTA Label</label>
        <input
          className="input w-full"
          value={section.buyCtaFallback ?? 'Buy Now'}
          onChange={(e) => setSectionField('buyCtaFallback', e.target.value)}
        />
      </div>

      {/* ---- Product List ---- */}
      <div className="flex items-center justify-between mt-2">
        <div className="text-sm font-medium">
          Products ({localProducts.length})
        </div>
        <button className="btn btn-ghost" onClick={addProduct}>
          Add product
        </button>
      </div>

      <div className="space-y-4">
        {localProducts.map((p, i) => (
          <ProductCardEditor
            key={p._id}                          // ← stable, prevents blur
            product={p}
            index={i}
            total={localProducts.length}
            section={section}
            onUpdate={(patch) => updateProduct(p._id, patch)}
            onRemove={() => removeProduct(p._id)}
            onMove={(to) => moveProduct(i, to)}
            openMediaPicker={openMediaPicker}
            siteId={siteId}
          />
        ))}

        {localProducts.length === 0 && (
          <div className="text-sm text-muted">
            No products yet. Click “Add product”.
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useCallback, useEffect, useState, useMemo } from 'react';
import type {
  ProductListingsSection,
  Product,
  ProductImage,
  ProductSpec,
  CheckoutInput,
  CheckoutInputOption,
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

type LocalCheckoutInput = CheckoutInput & {
  _id: string;
  optionsText?: string;
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

function optionsToText(options?: CheckoutInputOption[]) {
  if (!options || options.length === 0) return '';
  return options
    .map((opt) => (opt.label === opt.value ? opt.value : `${opt.label}:${opt.value}`))
    .join(', ');
}

function textToOptions(text?: string): CheckoutInputOption[] {
  if (!text) return [];
  return text
    .split(',')
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((entry) => {
      const [label, value] = entry.includes(':')
        ? entry.split(':').map((s) => s.trim())
        : [entry, entry];
      return { label, value };
    })
    .filter((opt) => opt.label && opt.value);
}

function checkoutInputsToLocal(xs: CheckoutInput[]): LocalCheckoutInput[] {
  return (xs ?? []).map((f) => ({
    ...f,
    _id: rid(),
    optionsText: optionsToText(f.options),
  }));
}

function checkoutInputsFromLocal(xs: LocalCheckoutInput[]): CheckoutInput[] {
  return xs.map(({ _id, optionsText, ...rest }) => {
    const options = rest.type === 'select' ? textToOptions(optionsText) : undefined;
    return { ...rest, options };
  });
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
  const [localCheckoutInputs, setLocalCheckoutInputs] = useState<LocalCheckoutInput[]>(
    () => checkoutInputsToLocal(section.checkoutInputs ?? [])
  );

  // keep local state in sync if section.products ref truly changes
  useEffect(() => {
    setLocalProducts(productsToLocal(section.products ?? []));
  }, [section.products]);

  useEffect(() => {
    setLocalCheckoutInputs(checkoutInputsToLocal(section.checkoutInputs ?? []));
  }, [section.checkoutInputs]);

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

  const commitCheckoutInputs = useCallback(
    (next: LocalCheckoutInput[]) => {
      setLocalCheckoutInputs(next);
      onChange({ ...section, checkoutInputs: checkoutInputsFromLocal(next) });
    },
    [onChange, section]
  );

  const addCheckoutInput = useCallback(() => {
    const next: LocalCheckoutInput = {
      _id: rid(),
      id: `field-${rid().slice(0, 6)}`,
      label: 'New Field',
      type: 'text',
      required: false,
      placeholder: '',
      description: '',
      googleFormEntryId: '',
      optionsText: '',
    };
    commitCheckoutInputs([...localCheckoutInputs, next]);
  }, [commitCheckoutInputs, localCheckoutInputs]);

  const updateCheckoutInput = useCallback(
    (id: string, patch: Partial<LocalCheckoutInput>) => {
      commitCheckoutInputs(localCheckoutInputs.map((f) => (f._id === id ? { ...f, ...patch } : f)));
    },
    [commitCheckoutInputs, localCheckoutInputs]
  );

  const removeCheckoutInput = useCallback(
    (id: string) => {
      commitCheckoutInputs(localCheckoutInputs.filter((f) => f._id !== id));
    },
    [commitCheckoutInputs, localCheckoutInputs]
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

      {/* ---- Checkout Settings ---- */}
      <div className="rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="text-sm font-semibold">Checkout Settings</div>

        <div className="grid md:grid-cols-3 gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={section.cartActive === true}
              onChange={(e) => setSectionField('cartActive', e.target.checked)}
            />
            <span>Enable cart + checkout</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={section.detailsEnabled === true}
              onChange={(e) => setSectionField('detailsEnabled', e.target.checked)}
            />
            <span>Enable product details modal</span>
          </label>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">Payment Type</label>
            <select
              className="select w-full"
              value={section.paymentType ?? 'converge'}
              onChange={(e) => setSectionField('paymentType', e.target.value as 'converge' | 'clover' | 'externalLink')}
            >
              <option value="converge">converge</option>
              <option value="clover">clover</option>
              <option value="externalLink">externalLink</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">External Payment URL</label>
            <input
              className="input w-full"
              value={section.externalPaymentUrl ?? ''}
              onChange={(e) => setSectionField('externalPaymentUrl', e.target.value)}
              placeholder="https://venmo.com/..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Google Form URL</label>
          <input
            className="input w-full"
            value={section.googleFormUrl ?? ''}
            onChange={(e) => setSectionField('googleFormUrl', e.target.value)}
            placeholder="https://docs.google.com/forms/d/e/.../formResponse"
          />
        </div>

        <div className="rounded-lg border border-gray-200 p-4 space-y-3">
          <div className="text-sm font-semibold">Taxes</div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={section.taxes?.enabled === true}
              onChange={(e) =>
                setSectionField('taxes', {
                  ...section.taxes,
                  enabled: e.target.checked,
                })
              }
            />
            <span>Enable taxes</span>
          </label>
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium">Tax rate %</label>
              <input
                type="number"
                className="input w-full"
                value={section.taxes?.ratePercent ?? 0}
                onChange={(e) =>
                  setSectionField('taxes', {
                    ...section.taxes,
                    ratePercent: Number(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
            </div>
            <label className="flex items-end gap-2">
              <input
                type="checkbox"
                checked={section.taxes?.taxShipping === true}
                onChange={(e) =>
                  setSectionField('taxes', {
                    ...section.taxes,
                    taxShipping: e.target.checked,
                  })
                }
              />
              <span>Tax shipping/delivery fee</span>
            </label>
            <label className="flex items-end gap-2">
              <input
                type="checkbox"
                checked={section.taxes?.defaultProductTaxable === true}
                onChange={(e) =>
                  setSectionField('taxes', {
                    ...section.taxes,
                    defaultProductTaxable: e.target.checked,
                  })
                }
              />
              <span>Default product taxable</span>
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 p-4 space-y-3">
          <div className="text-sm font-semibold">Delivery</div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={section.delivery?.enabled === true}
              onChange={(e) =>
                setSectionField('delivery', {
                  ...section.delivery,
                  enabled: e.target.checked,
                })
              }
            />
            <span>Enable merchant delivery</span>
          </label>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">Delivery Type</label>
              <select
                className="select w-full"
                value={section.delivery?.type ?? 'flat'}
                onChange={(e) =>
                  setSectionField('delivery', {
                    ...section.delivery,
                    type: e.target.value as 'flat' | 'uber' | 'doordash',
                  })
                }
              >
                <option value="flat">Flat</option>
                <option value="uber">Uber</option>
                <option value="doordash">DoorDash</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Delivery Mode</label>
              <select
                className="select w-full"
                value={section.delivery?.mode ?? 'both'}
                onChange={(e) =>
                  setSectionField('delivery', {
                    ...section.delivery,
                    mode: e.target.value as 'pickup' | 'delivery' | 'both',
                  })
                }
              >
                <option value="both">Pickup + Delivery</option>
                <option value="pickup">Pickup only</option>
                <option value="delivery">Delivery only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Apps Script Web App URL</label>
              <input
                className="input w-full"
                value={section.delivery?.appsScriptUrl ?? ''}
                onChange={(e) =>
                  setSectionField('delivery', {
                    ...section.delivery,
                    appsScriptUrl: e.target.value,
                  })
                }
                placeholder="https://script.google.com/macros/s/..."
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Delivery fee (cents)</label>
            <input
              type="number"
              className="input w-full"
              value={section.delivery?.flatFeeCents ?? 0}
              onChange={(e) =>
                setSectionField('delivery', {
                  ...section.delivery,
                  flatFeeCents: Math.max(0, Number(e.target.value) || 0),
                })
              }
              placeholder="0"
            />
          </div>

          <div className="rounded-lg border border-gray-200 p-3 space-y-3">
            <div className="text-sm font-semibold">Delivery Address</div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={section.delivery?.addressCapture?.enabled === true}
                onChange={(e) =>
                  setSectionField('delivery', {
                    ...section.delivery,
                    addressCapture: {
                      ...section.delivery?.addressCapture,
                      enabled: e.target.checked,
                    },
                  })
                }
              />
              <span>Enable delivery address</span>
            </label>
            <div className="grid md:grid-cols-3 gap-3">
              <label className="flex items-end gap-2">
                <input
                  type="checkbox"
                  checked={section.delivery?.addressCapture?.required === true}
                  onChange={(e) =>
                    setSectionField('delivery', {
                      ...section.delivery,
                      addressCapture: {
                        ...section.delivery?.addressCapture,
                        required: e.target.checked,
                      },
                    })
                  }
                />
                <span>Required</span>
              </label>
              <div>
                <label className="block text-sm font-medium">Save Method</label>
                <select
                  className="select w-full"
                  value={section.delivery?.addressCapture?.method ?? 'googleForm'}
                  onChange={(e) =>
                    setSectionField('delivery', {
                      ...section.delivery,
                      addressCapture: {
                        ...section.delivery?.addressCapture,
                        method: e.target.value as 'googleForm' | 's3',
                      },
                    })
                  }
                >
                  <option value="googleForm">Google Form</option>
                  <option value="s3">S3</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Google Form Entry ID</label>
                <input
                  className="input w-full"
                  value={section.delivery?.addressCapture?.googleFormEntryId ?? ''}
                  onChange={(e) =>
                    setSectionField('delivery', {
                      ...section.delivery,
                      addressCapture: {
                        ...section.delivery?.addressCapture,
                        googleFormEntryId: e.target.value,
                      },
                    })
                  }
                  placeholder="entry.123456"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">S3 Prefix (optional)</label>
              <input
                className="input w-full"
                value={section.delivery?.addressCapture?.s3Prefix ?? ''}
                onChange={(e) =>
                  setSectionField('delivery', {
                    ...section.delivery,
                    addressCapture: {
                      ...section.delivery?.addressCapture,
                      s3Prefix: e.target.value,
                    },
                  })
                }
                placeholder="orders/{siteId}/delivery/"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={section.googleFormOptions?.addItemToGForm === true}
              onChange={(e) =>
                setSectionField('googleFormOptions', {
                  ...section.googleFormOptions,
                  addItemToGForm: e.target.checked,
                })
              }
            />
            <span>Send cart items + total</span>
          </label>
          <div>
            <label className="block text-sm font-medium">Items Entry ID</label>
            <input
              className="input w-full"
              value={section.googleFormOptions?.itemsEntryId ?? ''}
              onChange={(e) =>
                setSectionField('googleFormOptions', {
                  ...section.googleFormOptions,
                  itemsEntryId: e.target.value,
                })
              }
              placeholder="entry.123456"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Total Entry ID</label>
            <input
              className="input w-full"
              value={section.googleFormOptions?.totalEntryId ?? ''}
              onChange={(e) =>
                setSectionField('googleFormOptions', {
                  ...section.googleFormOptions,
                  totalEntryId: e.target.value,
                })
              }
              placeholder="entry.654321"
            />
          </div>
        </div>
      </div>

      {/* ---- Checkout Inputs ---- */}
      <div className="rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Checkout Inputs</div>
          <button className="btn btn-ghost" onClick={addCheckoutInput}>
            Add input
          </button>
        </div>

        {localCheckoutInputs.length === 0 && (
          <div className="text-sm text-muted">No checkout inputs configured.</div>
        )}

        <div className="space-y-4">
          {localCheckoutInputs.map((field) => (
            <div key={field._id} className="rounded-lg border border-gray-200 p-4 space-y-3">
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium">Label</label>
                  <input
                    className="input w-full"
                    value={field.label ?? ''}
                    onChange={(e) => updateCheckoutInput(field._id, { label: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Field ID</label>
                  <input
                    className="input w-full"
                    value={field.id ?? ''}
                    onChange={(e) => updateCheckoutInput(field._id, { id: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Type</label>
                  <select
                    className="select w-full"
                    value={field.type}
                    onChange={(e) => updateCheckoutInput(field._id, { type: e.target.value as CheckoutInput['type'] })}
                  >
                    <option value="text">text</option>
                    <option value="tel">tel</option>
                    <option value="email">email</option>
                    <option value="date">date</option>
                    <option value="time">time</option>
                    <option value="datetime-local">datetime-local</option>
                    <option value="textarea">textarea</option>
                    <option value="select">select</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Placeholder</label>
                  <input
                    className="input w-full"
                    value={field.placeholder ?? ''}
                    onChange={(e) => updateCheckoutInput(field._id, { placeholder: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Description</label>
                  <input
                    className="input w-full"
                    value={field.description ?? ''}
                    onChange={(e) => updateCheckoutInput(field._id, { description: e.target.value })}
                  />
                </div>
              </div>

              {field.type === 'select' && (
                <div>
                  <label className="block text-sm font-medium">Options</label>
                  <input
                    className="input w-full"
                    value={field.optionsText ?? ''}
                    onChange={(e) => updateCheckoutInput(field._id, { optionsText: e.target.value })}
                    placeholder="Value1, Value2 or Label:Value"
                  />
                  <p className="text-xs text-muted mt-1">
                    Use comma-separated values. For custom labels, use Label:Value.
                  </p>
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={field.required === true}
                    onChange={(e) => updateCheckoutInput(field._id, { required: e.target.checked })}
                  />
                  <span>Required</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={field.hidden === true}
                    onChange={(e) => updateCheckoutInput(field._id, { hidden: e.target.checked })}
                  />
                  <span>Hidden</span>
                </label>

                <div>
                  <label className="block text-sm font-medium">Google Form Entry ID</label>
                  <input
                    className="input w-full"
                    value={field.googleFormEntryId ?? ''}
                    onChange={(e) => updateCheckoutInput(field._id, { googleFormEntryId: e.target.value })}
                    placeholder="entry.123456"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button className="btn btn-ghost text-red-600" onClick={() => removeCheckoutInput(field._id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
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

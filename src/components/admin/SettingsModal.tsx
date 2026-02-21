'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CheckoutInput, CheckoutInputOption, PaymentsSettings, SiteConfig } from '@/types/site';
import { useSite } from '@/context/SiteContext';
import { getSiteId } from '@/lib/siteId';
import AdminAIChatPanel from './AdminAIChatPanel';
import { applySiteConfigPatch } from '@/lib/siteConfigPatch';

// -----------------------------
// Utilities
// -----------------------------
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

function rid() {
  return (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

type LocalCheckoutInput = CheckoutInput & {
  _id: string;
  optionsText?: string;
};

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

// -----------------------------
// Props
// -----------------------------
export type SettingsModalProps = {
  onClose: () => void;
};

// -----------------------------
// Component
// -----------------------------
export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { config, setConfig } = useSite();
  const siteId = getSiteId();

  const [draft, setDraft] = useState<SiteConfig | null>(null);
  const originalRef = useRef<SiteConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'payments'>('payments');
  const [testEmailSending, setTestEmailSending] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    if (config) {
      const copy = deepClone(config);
      setDraft(copy);
      originalRef.current = copy;
    }
  }, [config]);

  const payments = useMemo<PaymentsSettings>(
    () => draft?.settings?.payments ?? {},
    [draft?.settings?.payments]
  );

  const general = useMemo<Record<string, unknown>>(
    () => draft?.settings?.general ?? {},
    [draft?.settings?.general]
  );

  const businessDisplayName = useMemo(
    () => (typeof general.businessDisplayName === 'string' ? general.businessDisplayName : ''),
    [general.businessDisplayName]
  );

  const businessNotificationEmail = useMemo(
    () => (typeof general.businessNotificationEmail === 'string' ? general.businessNotificationEmail : ''),
    [general.businessNotificationEmail]
  );

  const updateGeneral = useCallback((patch: Record<string, unknown>) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const nextGeneral = { ...(prev.settings?.general ?? {}), ...patch };
      return { ...prev, settings: { ...(prev.settings ?? {}), general: nextGeneral } };
    });
  }, []);

  const [localCheckoutInputs, setLocalCheckoutInputs] = useState<LocalCheckoutInput[]>([]);

  useEffect(() => {
    setLocalCheckoutInputs(checkoutInputsToLocal(payments.checkoutInputs ?? []));
  }, [payments.checkoutInputs]);

  const updatePayments = useCallback(
    <K extends keyof PaymentsSettings>(key: K, value: PaymentsSettings[K]) => {
      setDraft((prev) => {
        if (!prev) return prev;
        const nextPayments = { ...(prev.settings?.payments ?? {}), [key]: value };
        return { ...prev, settings: { ...(prev.settings ?? {}), payments: nextPayments } };
      });
    },
    []
  );

  const commitCheckoutInputs = useCallback(
    (next: LocalCheckoutInput[]) => {
      setLocalCheckoutInputs(next);
      updatePayments('checkoutInputs', checkoutInputsFromLocal(next));
    },
    [updatePayments]
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

  const isDirty = useMemo(() => {
    if (!draft || !originalRef.current) return false;
    return JSON.stringify(draft) !== JSON.stringify(originalRef.current);
  }, [draft]);

  const canSave = useMemo(() => !!draft, [draft]);

  const onSave = useCallback(async () => {
    if (!draft) return;
    setSaving(true);
    setError(null);

    try {
      const variant = (process.env.NEXT_PUBLIC_CONFIG_VARIANT ?? 'draft') as 'draft' | 'published';
      const url = `/api/admin/config/${encodeURIComponent(siteId)}?variant=${variant}`;

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-local-admin': '1',
        },
        body: JSON.stringify(draft),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Save failed with HTTP ${res.status}`);
      }

      const saved: SiteConfig = await res.json();
      setConfig(saved);
      originalRef.current = deepClone(saved);
      onClose();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to save.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  }, [draft, onClose, setConfig, siteId]);

  const onRestore = useCallback(() => {
    if (!originalRef.current) return;
    const restored = deepClone(originalRef.current);
    setDraft(restored);
  }, []);

  const sendTestOrderEmail = useCallback(async () => {
    setTestEmailSending(true);
    setTestEmailResult(null);
    try {
      const res = await fetch('/api/admin/orders/email-test', {
        method: 'POST',
        headers: { 'x-local-admin': '1', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessDisplayName,
          businessNotificationEmail,
        }),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text || `HTTP ${res.status}`);

      let orderId = '';
      try {
        const json = JSON.parse(text) as { order?: { orderId?: string } };
        orderId = json?.order?.orderId ?? '';
      } catch {
        // ignore
      }

      setTestEmailResult({
        ok: true,
        message: orderId ? `Created test order: ${orderId}` : 'Created test order.',
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to create test order.';
      setTestEmailResult({ ok: false, message: msg });
    } finally {
      setTestEmailSending(false);
    }
  }, [businessDisplayName, businessNotificationEmail]);

  if (!draft) {
    return (
      <div className="fixed inset-0 z-[1200] bg-black/50 flex items-center justify-center p-4">
        <div className="card admin-card p-6">
          <div className="text-sm text-muted">Loading settings...</div>
          <div className="mt-4 text-right">
            <button className="btn btn-ghost" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed edit-modal inset-0 z-[12000] bg-black/50 flex items-center justify-center p-4">
      <div className="card admin-card card-solid p-4 relative w-full max-w-5xl !max-w-full overflow-hidden card-screen-height">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="font-semibold text-lg">Edit Site Settings</div>
          <div className="flex items-center gap-2 save-config-btns">
            {error && <div className="text-red-600 text-sm mr-3">{error}</div>}
            {isDirty && (
              <button className="btn btn-ghost" onClick={onRestore}>
                Restore
              </button>
            )}
            <button className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={onSave} disabled={!canSave || saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <div className="p-4 border-b">
          <AdminAIChatPanel
            mode="inline"
            title="AI (Settings)"
              placeholder="Ask AI to update payments, checkout fields, or other settings..."
              config={draft}
              onApplyPatch={(patch) => {
                setDraft((prev) => (prev ? applySiteConfigPatch(prev, patch) : prev));
              }}
            />
          </div>

        {/* Tabs */}
        <div className="px-4 pt-4">
          <div className="flex justify-center gap-6 border-b">
            <button
              className={[
                'px-4 py-2 -mb-px text-sm font-semibold transition-colors border-b-4 admin-tab',
                activeTab === 'general'
                  ? 'border-transparent text-white active'
                  : 'border-transparent text-gray-200  hover:text-[var(--admin-primary)]',
              ].join(' ')}
              onClick={() => setActiveTab('general')}
            >
              General
            </button>
            <button
              className={[
                'px-4 py-2 -mb-px text-sm font-semibold transition-colors border-b-4 admin-tab',
                activeTab === 'payments'
                  ? ' border-transparent text-white active'
                  : 'border-transparent text-gray-200  hover:text-[var(--admin-primary)]',
              ].join(' ')}
              onClick={() => setActiveTab('payments')}
            >
              Payments
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 overflow-auto">
          {activeTab === 'general' && (
            <div className="card admin-card card-solid card-full p-4 space-y-3 w-full">
              <div className="font-semibold">General</div>

              <div className="card admin-card card-solid card-full p-4 space-y-3">
                <div className="font-semibold">Emailing</div>
                <div className="text-sm text-muted">
                  Used for order confirmation + notification emails (DynamoDB Streams → Lambda → Resend).
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium">Business Display Name</label>
                    <input
                      className="input w-full"
                      value={businessDisplayName}
                      onChange={(e) => updateGeneral({ businessDisplayName: e.target.value })}
                      placeholder="Sapling Sites"
                    />
                    <div className="text-xs text-muted mt-1">
                      Shows in the customer email “From” name.
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Business Notification Email</label>
                    <input
                      className="input w-full"
                      value={businessNotificationEmail}
                      onChange={(e) => updateGeneral({ businessNotificationEmail: e.target.value })}
                      placeholder="orders@yourbusiness.com"
                    />
                    <div className="text-xs text-muted mt-1">
                      Receives new order notifications and becomes Reply-To.
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    className="btn btn-primary"
                    onClick={sendTestOrderEmail}
                    disabled={testEmailSending}
                    aria-disabled={testEmailSending}
                    title="Creates a 1¢ test order using Business Notification Email as both customer + business email."
                  >
                    {testEmailSending ? 'Sending...' : 'Send Test Email'}
                  </button>
                  <div className="text-xs text-muted">
                    Creates a 1¢ test order with the business email as both To addresses.
                  </div>
                </div>

                {testEmailResult && (
                  <div
                    className={[
                      'text-sm rounded-lg px-3 py-2 border',
                      testEmailResult.ok
                        ? 'border-emerald-700/40 bg-emerald-900/20 text-emerald-200'
                        : 'border-red-700/40 bg-red-900/20 text-red-200',
                    ].join(' ')}
                  >
                    {testEmailResult.message}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="card admin-card card-solid card-full p-4 space-y-4 w-full">
              <div className="font-semibold">Payments</div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={payments.cartActive === true}
                onChange={(e) => updatePayments('cartActive', e.target.checked)}
              />
              <span>Enable cart + checkout</span>
            </label>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium">Payment Type</label>
                <select
                  className="select w-full"
                  value={payments.paymentType ?? 'converge'}
                  onChange={(e) => updatePayments('paymentType', e.target.value as PaymentsSettings['paymentType'])}
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
                  value={payments.externalPaymentUrl ?? ''}
                  onChange={(e) => updatePayments('externalPaymentUrl', e.target.value)}
                  placeholder="https://venmo.com/..."
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium">Support Email</label>
                <input
                  className="input w-full"
                  value={payments.supportEmail ?? ''}
                  onChange={(e) => updatePayments('supportEmail', e.target.value)}
                  placeholder="help@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Support Phone Label</label>
                <input
                  className="input w-full"
                  value={payments.supportPhone?.label ?? ''}
                  onChange={(e) =>
                    updatePayments('supportPhone', {
                      label: e.target.value,
                      href: payments.supportPhone?.href ?? '',
                    })
                  }
                  placeholder="Call us at 555-555-5555"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Support Phone Href</label>
                <input
                  className="input w-full"
                  value={payments.supportPhone?.href ?? ''}
                  onChange={(e) =>
                    updatePayments('supportPhone', {
                      label: payments.supportPhone?.label ?? '',
                      href: e.target.value,
                    })
                  }
                  placeholder="tel:+15555555555"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Google Form URL</label>
              <input
                className="input w-full"
                value={payments.googleFormUrl ?? ''}
                onChange={(e) => updatePayments('googleFormUrl', e.target.value)}
                placeholder="https://docs.google.com/forms/d/e/.../formResponse"
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={payments.googleFormSubmitBeforePayment === true}
                onChange={(e) => updatePayments('googleFormSubmitBeforePayment', e.target.checked)}
              />
              <span>Submit Google Form before payment step</span>
            </label>

            <div className="rounded-lg border border-gray-200 p-4 space-y-3">
              <div className="text-sm font-semibold">Taxes</div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={payments.taxes?.enabled === true}
                  onChange={(e) =>
                    updatePayments('taxes', {
                      ...payments.taxes,
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
                    value={payments.taxes?.ratePercent ?? 0}
                    onChange={(e) =>
                      updatePayments('taxes', {
                        ...payments.taxes,
                        ratePercent: Number(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                  />
                </div>
                <label className="flex items-end gap-2">
                  <input
                    type="checkbox"
                    checked={payments.taxes?.taxShipping === true}
                    onChange={(e) =>
                      updatePayments('taxes', {
                        ...payments.taxes,
                        taxShipping: e.target.checked,
                      })
                    }
                  />
                  <span>Tax shipping/delivery fee</span>
                </label>
                <label className="flex items-end gap-2">
                  <input
                    type="checkbox"
                    checked={payments.taxes?.defaultProductTaxable === true}
                    onChange={(e) =>
                      updatePayments('taxes', {
                        ...payments.taxes,
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
                  checked={payments.delivery?.enabled === true}
                  onChange={(e) =>
                    updatePayments('delivery', {
                      ...payments.delivery,
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
                    value={payments.delivery?.type ?? 'flat'}
                    onChange={(e) =>
                      updatePayments('delivery', {
                        ...payments.delivery,
                        type: e.target.value as NonNullable<PaymentsSettings['delivery']>['type'],
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
                    value={payments.delivery?.mode ?? 'both'}
                    onChange={(e) =>
                      updatePayments('delivery', {
                        ...payments.delivery,
                        mode: e.target.value as NonNullable<PaymentsSettings['delivery']>['mode'],
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
                    value={payments.delivery?.appsScriptUrl ?? ''}
                    onChange={(e) =>
                      updatePayments('delivery', {
                        ...payments.delivery,
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
                  value={payments.delivery?.flatFeeCents ?? 0}
                  onChange={(e) =>
                    updatePayments('delivery', {
                      ...payments.delivery,
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
                    checked={payments.delivery?.addressCapture?.enabled === true}
                    onChange={(e) =>
                      updatePayments('delivery', {
                        ...payments.delivery,
                        addressCapture: {
                          ...payments.delivery?.addressCapture,
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
                      checked={payments.delivery?.addressCapture?.required === true}
                      onChange={(e) =>
                        updatePayments('delivery', {
                          ...payments.delivery,
                          addressCapture: {
                            ...payments.delivery?.addressCapture,
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
                      value={payments.delivery?.addressCapture?.method ?? 'googleForm'}
                      onChange={(e) =>
                        updatePayments('delivery', {
                          ...payments.delivery,
                          addressCapture: {
                            ...payments.delivery?.addressCapture,
                            method: e.target.value as NonNullable<
                              NonNullable<PaymentsSettings['delivery']>['addressCapture']
                            >['method'],
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
                      value={payments.delivery?.addressCapture?.googleFormEntryId ?? ''}
                      onChange={(e) =>
                        updatePayments('delivery', {
                          ...payments.delivery,
                          addressCapture: {
                            ...payments.delivery?.addressCapture,
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
                    value={payments.delivery?.addressCapture?.s3Prefix ?? ''}
                    onChange={(e) =>
                      updatePayments('delivery', {
                        ...payments.delivery,
                        addressCapture: {
                          ...payments.delivery?.addressCapture,
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
                  checked={payments.googleFormOptions?.addItemToGForm === true}
                  onChange={(e) =>
                    updatePayments('googleFormOptions', {
                      ...payments.googleFormOptions,
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
                  value={payments.googleFormOptions?.itemsEntryId ?? ''}
                  onChange={(e) =>
                    updatePayments('googleFormOptions', {
                      ...payments.googleFormOptions,
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
                  value={payments.googleFormOptions?.totalEntryId ?? ''}
                  onChange={(e) =>
                    updatePayments('googleFormOptions', {
                      ...payments.googleFormOptions,
                      totalEntryId: e.target.value,
                    })
                  }
                  placeholder="entry.654321"
                />
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
                          onChange={(e) =>
                            updateCheckoutInput(field._id, { type: e.target.value as CheckoutInput['type'] })
                          }
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

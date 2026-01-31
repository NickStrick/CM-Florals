// src/components/payments/PaymentPage.tsx
'use client';

import { useState, type ChangeEvent } from 'react';
import PaymentForm from './PaymentForm';
import { X, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { CheckoutInput, GoogleFormOptions } from '@/types/site';

function formatPrice(cents: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}

export default function PaymentPage({
  token,
  checkoutInputs,
  googleFormUrl,
  googleFormOptions,
  paymentType = 'converge',
  externalPaymentUrl,
}: {
  token?: string;
  checkoutInputs?: CheckoutInput[];
  googleFormUrl?: string;
  googleFormOptions?: GoogleFormOptions;
  paymentType?: 'converge' | 'externalLink';
  externalPaymentUrl?: string;
}) {
  const { items, totalCents, currency, isCheckoutOpen, closeCheckout, addItem, removeItem } = useCart();
  const convergeToken = token ?? process.env.NEXT_PUBLIC_CONVERGE_TOKEN ?? '';
  const [customValues, setCustomValues] = useState<Record<string, string>>({});
  const requiredFields = (checkoutInputs ?? []).filter((f) => f.required);
  const missingRequired = requiredFields.some((f) => {
    const value = (customValues[f.id] ?? '').trim();
    return value.length === 0;
  });

  if (!isCheckoutOpen) return null;

  const submitToGoogleForm = async () => {
    if (!googleFormUrl) return;

    const formData = new FormData();
    const fields = checkoutInputs?.filter((f) => f.googleFormEntryId) ?? [];
    fields.forEach((f) => {
      const value = customValues[f.id];
      if (typeof value === 'string' && value.length > 0) {
        formData.append(f.googleFormEntryId as string, value);
      }
    });

    if (googleFormOptions?.addItemToGForm) {
      if (googleFormOptions.itemsEntryId) {
        const itemsPayload = items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          currency: item.currency ?? currency,
          quantity: item.quantity,
        }));
        formData.append(googleFormOptions.itemsEntryId, JSON.stringify(itemsPayload));
      }
      if (googleFormOptions.totalEntryId) {
        formData.append(googleFormOptions.totalEntryId, (totalCents / 100).toFixed(2));
      }
    }

    try {
      await fetch(googleFormUrl, { method: 'POST', mode: 'no-cors', body: formData });
    } catch {
      // no-op: form submission is best-effort in no-cors mode
    }
  };

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl mx-4 bg-white rounded-3xl shadow-2xl p-1 md:p-10 max-h-[100vh] overflow-y-auto checkout-container">
        <button
          onClick={closeCheckout}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
          aria-label="Close checkout"
        >
          <X size={24} />
        </button>

        <div className="grid gap-8 md:grid-cols-[1fr_1.2fr]">
          <section className="rounded-2xl border border-gray-100 p-5 md:p-6 max-w-[100%]">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            {items.length === 0 ? (
              <p className="text-gray-600">Your cart is empty.</p>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm items-center gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0 flex-wrap">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-[100px] w-[100px] rounded-md object-cover border border-gray-100"
                        />
                      )}
                      <span className="">
                        {item.name} {item.quantity > 1 && <span className="opacity-70">x{item.quantity}</span>}
                      </span>
                    </div>
                    <span className="font-medium">
                      {formatPrice(item.price * item.quantity, item.currency ?? currency)}
                    </span>
                    <button
                      onClick={() => addItem({ id: item.id, name: item.name, price: item.price, currency: item.currency, imageUrl: item.imageUrl })}
                      className="text-gray-400 hover:text-emerald-600 transition-colors"
                      aria-label={`Add one more ${item.name}`}
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <div className="flex justify-between border-t pt-3 text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(totalCents, currency)}</span>
                </div>
              </div>
            )}
          </section>

          <section className="max-w-[100%]">
            {checkoutInputs && checkoutInputs.length > 0 && (
              <div className="mb-8 rounded-2xl border border-gray-100 p-6">
                <h2 className="text-2xl font-bold mb-4">Order Details</h2>
                <div className="grid gap-4">
                  {checkoutInputs.map((field) => {
                    const commonProps = {
                      id: field.id,
                      name: field.id,
                      required: field.required,
                      placeholder: field.placeholder,
                      className: "w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all",
                      value: customValues[field.id] ?? '',
                      onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
                        setCustomValues((prev) => ({ ...prev, [field.id]: e.target.value })),
                    };

                    return (
                      <label key={field.id} className="block">
                        <span className="block text-sm font-medium text-gray-700 mb-1">
                          {field.label}{field.required && <span className="text-red-500"> *</span>}
                        </span>
                        {field.description && (
                          <span className="block text-xs text-gray-500 mb-2">{field.description}</span>
                        )}
                        {field.type === 'textarea' ? (
                          <textarea {...commonProps} rows={4} />
                        ) : field.type === 'select' ? (
                          <select {...commonProps}>
                            <option value="">Select an option</option>
                            {field.options?.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        ) : (
                          <input {...commonProps} type={field.type} />
                        )}
                      </label>
                    );
                  })}
                </div>

                {/* {googleFormUrl && (
                  <div className="mt-4 text-sm text-gray-600">
                    Optional: also submit these details via Google Form.
                    <a
                      href={googleFormUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-emerald-700 hover:text-emerald-800 font-medium"
                    >
                      Open Form
                    </a>
                  </div>
                )} */}
              </div>
            )}

            <h2 className="text-2xl font-bold mb-4 ml-4 md:ml-1">Payment</h2>
            {paymentType === 'externalLink' ? (
              <button
                type="button"
                onClick={async () => {
                  await submitToGoogleForm();
                  if (externalPaymentUrl) {
                    window.open(externalPaymentUrl, '_blank', 'noopener,noreferrer');
                  }
                }}
                disabled={missingRequired}
                aria-disabled={missingRequired}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all"
              >
                Continue to Payment
              </button>
            ) : (
              <PaymentForm token={convergeToken} onPay={submitToGoogleForm} disabled={missingRequired} />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

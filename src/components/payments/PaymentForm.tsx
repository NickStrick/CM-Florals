// components/PaymentForm.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import Cards, { Focused } from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

export default function PaymentForm({
  token,
  onPay,
  disabled,
}: {
  token: string;
  onPay?: () => void;
  disabled?: boolean;
}) {
  const [state, setState] = useState({
    number: '', // We use these for the visual card preview only
    expiry: '',
    cvc: '',
    name: '',
    focus: '' as Focused,
  });

  const handleInputFocus = (evt: React.FocusEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, focus: evt.target.name as Focused }));
  };

  // This initializes the secure Elavon Iframes once the script loads
  const initHostedFields = () => {
    if (typeof window !== 'undefined' && (window as any).ConvergeEmbedded) {
      const converge = (window as any).ConvergeEmbedded({
        token: token,
        callback: (response: any) => console.log('Payment Response:', response),
        error: (err: any) => console.error('Payment Error:', err),
      });

      // Mount secure fields into our Tailwind-styled divs
      converge.mount('#card-number', 'cardNumber');
      converge.mount('#card-expiry', 'cardExpiration');
      converge.mount('#card-cvv', 'cardCvv');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-5 md:p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
      <Script 
        src="https://api.demo.convergepay.com" 
        onLoad={initHostedFields}
      />

      <div className="mb-8">
        <Cards
          number={state.number}
          expiry={state.expiry}
          cvc={state.cvc}
          name={state.name}
          focused={state.focus}
        />
      </div>

      <form className="space-y-4">
        {/* Full Name (Custom Field) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
          <input
            type="text"
            name="name"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="John Doe"
            onChange={(e) => setState({ ...state, name: e.target.value })}
            onFocus={handleInputFocus}
          />
        </div>

        {/* Card Number (Elavon Secure Iframe Container) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
          <div id="card-number" className="h-[50px] w-full p-3 border rounded-xl bg-gray-50" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Expiry (Elavon Secure Iframe Container) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
            <div id="card-expiry" className="h-[50px] w-full p-3 border rounded-xl bg-gray-50" />
          </div>

          {/* CVV (Elavon Secure Iframe Container) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
            <div id="card-cvv" className="h-[50px] w-full p-3 border rounded-xl bg-gray-50" />
          </div>
        </div>

        <button
          type="button"
          onClick={onPay}
          disabled={disabled}
          aria-disabled={disabled}
          className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all"
        >
          Place Your Order
        </button>
      </form>
    </div>
  );
}
// Key Integration Steps
// Styling the Iframe: You cannot use Tailwind on the content inside the iframe. You must pass a CSS object to the Elavon Hosted Fields initialization to match your site's fonts and colors.
// Card Preview Sync: Since the card number is inside an Elavon iframe, react-credit-cards-2 won't "see" the digits. To fix this, use Elavon's onChange event listeners to update your local state with "masked" digits (e.g., **** **** **** 1234).
// Endpoint: Ensure your Next.js Route Handlers are using the correct Converge Merchant Credentials.

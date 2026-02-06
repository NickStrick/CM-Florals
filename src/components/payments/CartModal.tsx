// components/CartModal.tsx
'use client';
import { ShoppingCart, X, Trash2, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';

function formatPrice(cents: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}

export default function CartModal() {
  const { items, totalCents, currency, openCheckout, removeItem, addItem, isCartOpen, openCart, closeCart } = useCart();
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  if (!isCartOpen) return (
    <button onClick={openCart} className="flex flex-row fixed z-[5000] top-[6px] right-4 !p-2 !pr-6 !pl-[25px] btn-gradient text-white rounded-full cart-icon w-[120px]">
      <ShoppingCart size={24} className="inline-block " /> <span className="ml-1 text-[14px]">Cart</span>
      {totalQuantity > 0 && <span className="absolute top-3 left-2 white text-[var(--primary)] rounded-full w-5 h-5 text-xs flex items-center justify-center cart-items-count" >{totalQuantity}</span>}
    </button>
  );

  return (<>
    <button onClick={openCart} className="flex flex-row fixed z-[5000] top-[6px] right-4 !p-2 !pr-6 !pl-[25px] btn-gradient text-white rounded-full cart-icon w-[120px]">
      <ShoppingCart size={24} className="inline-block " /> <span className="ml-1 text-[14px]">Cart</span>
      {totalQuantity > 0 && <span className="absolute top-3 left-2 white text-[var(--primary)] rounded-full w-5 h-5 text-xs flex items-center justify-center cart-items-count" >{totalQuantity}</span>}
    </button>
    <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/50 backdrop-blur-sm cart-modal-container">
      <div className="bg-white w-full max-w-md  p-6 shadow-2xl relative cart-modal-content">
        <button onClick={closeCart} className="absolute z-[5000] top-4 right-4 text-gray-400 hover:text-black">
          <X size={20} />
        </button>
        
        <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
        
        <div className="space-y-4 mb-8">
          {items.length === 0 ? (
            <div className="text-gray-600 text-center">Your cart is empty.</div>
          ) : (
            <>
              {items.map(item => (
                <div key={item.id} className="flex justify-between border-b pb-2 items-center gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0 flex-wrap">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-[100px] w-[100px] rounded-lg object-cover border border-gray-100"
                      />
                    )}
                    <span className="">
                      {item.name} {item.quantity > 1 && <span className="opacity-70">x{item.quantity}</span>}
                    </span>
                  </div>
                  <span className="font-semibold">
                    {formatPrice(item.price * item.quantity, item.currency ?? currency)}
                  </span>
                  <button
                    onClick={() => addItem({ id: item.id, name: item.name, price: item.price, currency: item.currency, imageUrl: item.imageUrl, taxable: item.taxable })}
                    className="text-gray-400 hover:text-emerald-600 transition-colors"
                    aria-label={`Add one more ${item.name}`}
                  >
                    <Plus size={18} />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <div className="flex justify-between text-xl font-bold pt-2">
                <span>Total</span>
                <span>{formatPrice(totalCents, currency)}</span>
              </div>
            </>
          )}
        </div>
          <button className="w-full mb-4 btn-gradient text-white py-4 rounded-xl font-bold transition-all" onClick={() => { closeCart(); window.location.href = '#products'; }}>{items.length !== 0 ? "View More Products" : "View Our Products"}</button>
          {items.length !== 0 ? (
        <button 
          onClick={() => { closeCart(); openCheckout(); }}
          className="w-full btn-gradient text-white py-4 rounded-xl font-bold transition-all"
          disabled={items.length === 0}
        >
          Proceed to Secure Checkout
        </button>)
        : (<><div className="text-center text-gray-600">Add items to your cart to proceed to checkout.</div>
          
        </>)}
        </div>
    </div></>
  );
}
// Next Steps
// Environment Setup: Add your Elavon Merchant ID, User ID, and PIN to your .env.local file.
// Server Action: Write the function to call Elavon's transaction_token endpoint.
// Payment Form: Create the checkout component that initializes window.ElavonHostedFields and connects it to the react-credit-cards-2 UI.

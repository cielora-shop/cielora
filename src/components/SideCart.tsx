"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function SideCart() {
  const { isCartOpen, closeCart, cartItems, removeFromCart, updateQuantity, cartTotal, taxPercentage } = useCart();
  const [itemToRemove, setItemToRemove] = useState<any | null>(null);
  const [isClosingModal, setIsClosingModal] = useState(false);

  const confirmRemove = () => {
    if (itemToRemove) {
      setIsClosingModal(true);
      setTimeout(() => {
        removeFromCart(itemToRemove.id);
        setItemToRemove(null);
        setIsClosingModal(false);
      }, 300);
    }
  };

  const cancelRemove = () => {
    setIsClosingModal(true);
    setTimeout(() => {
      setItemToRemove(null);
      setIsClosingModal(false);
    }, 300);
  };

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  const tax = cartTotal * (taxPercentage / 100);
  const finalTotal = cartTotal + tax;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 ${isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={closeCart}
      />
      
      {/* Slide Panel */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[600px] bg-[#fffbf7] z-[101] flex flex-col shadow-xl transition-transform duration-300 transform ${isCartOpen ? "translate-x-0" : "translate-x-full"} overflow-y-auto overflow-x-hidden`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#8ce0c9] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span className="text-[13px] font-semibold text-gray-900 underline underline-offset-4 decoration-1">Added to cart</span>
          </div>
          <button onClick={closeCart} className="text-gray-500 hover:text-black">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="px-6 pb-[12px]">
          <h2 className="text-[16px] font-semibold text-gray-900">
            Cart <span className="font-normal text-black">({cartItems.length} {cartItems.length === 1 ? "Item" : "Items"})</span>
          </h2>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 px-6 overflow-y-auto custom-scrollbar">
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-sm mt-4">Your cart is empty.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {cartItems.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="flex gap-4">
                  <div className="w-[100px] h-[100px] relative bg-[#f9f9f9] flex-shrink-0 flex items-center justify-center">
                    <Image src={item.image} alt={item.title} fill className="object-cover p-2" />
                  </div>
                  <div className="flex flex-col flex-1 py-1">
                    <h3 className="text-[14px] font-medium text-gray-900 leading-tight mb-1">{item.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      {item.originalPrice && (
                        <span className="text-[13px] text-gray-500 line-through">{item.originalPrice}</span>
                      )}
                      <span className="text-[14px] font-semibold text-[#b44131]">{item.price}</span>
                    </div>
                    <p className="text-[12px] text-gray-600 mb-3">Colour: <span className="capitalize">{item.color}</span></p>
                    
                    <div className="flex items-center gap-4 mt-auto">
                      {item.quantity > 1 ? (
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-400 hover:text-black">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                      ) : (
                        <button onClick={() => setItemToRemove(item)} className="text-gray-400 hover:text-red-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                        </button>
                      )}
                      <span className="text-[13px] w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-400 hover:text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}


        </div>

        {/* Footer */}
        <div className="p-6 bg-[#fffbf7] border-t border-gray-100">
          <div className="flex justify-between text-[13px] text-gray-900 mb-2">
            <span>Subtotal</span>
            <span>£{cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[13px] text-gray-900 mb-2">
            <span>Shipping cost</span>
            <span>£0.00</span>
          </div>
          <div className="flex justify-between text-[13px] text-gray-900 mb-4">
            <span>Tax</span>
            <span>£{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-[15px] text-gray-900 mb-6">
            <span>Total (Tax included)</span>
            <span>£{finalTotal.toFixed(2)}</span>
          </div>

          <div className="flex gap-3">
            <Link href="/cart" className="flex-1 border border-black bg-[#fffbf7] text-black py-3 px-4 text-center text-[14px] font-medium hover:bg-black hover:text-white transition-colors" onClick={closeCart}>
              View Cart ({cartItems.length})
            </Link>
            <Link href="/checkout" className="flex-1 bg-[#221f1f] text-white border border-[#221f1f] py-3 px-4 text-center text-[14px] font-medium hover:bg-[#fffbf7] hover:text-black hover:border-black transition-colors" onClick={closeCart}>
              Go to checkout (£{finalTotal.toFixed(2)})
            </Link>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {itemToRemove && (
        <div className={`fixed inset-0 bg-black/50 z-[105] flex items-start justify-center px-4 transition-opacity duration-300 ${isClosingModal ? "opacity-0" : "opacity-100"}`}>
          <div className={`bg-[#fffbf7] w-full max-w-[500px] shadow-2xl flex flex-col ${isClosingModal ? "animate-slideUp" : "animate-slideDown"}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-[16px] font-medium text-gray-900">Remove Product?</h3>
              <button onClick={cancelRemove} className="text-gray-500 hover:text-black transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            {/* Body */}
            <div className="p-4 py-6 border-b border-gray-200">
              <p className="text-[14px] text-gray-800 mb-1">Are you sure you want to remove the following product from the cart?</p>
              <p className="text-[14px] text-gray-600">{itemToRemove.title}</p>
            </div>
            {/* Footer */}
            <div className="p-4 flex justify-end gap-4">
              <button onClick={cancelRemove} className="w-[120px] py-2 border border-black text-gray-800 text-[14px] font-medium hover:bg-black hover:text-white transition-colors bg-[#fffbf7] flex justify-center items-center">
                Cancel
              </button>
              <button onClick={confirmRemove} className="w-[120px] py-2 bg-[#221f1f] text-white text-[14px] font-medium hover:bg-[#fffbf7] hover:text-black border border-[#221f1f] hover:border-black transition-colors flex justify-center items-center">
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

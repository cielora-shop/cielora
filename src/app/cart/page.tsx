"use client";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, taxPercentage } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [itemToRemove, setItemToRemove] = useState<any | null>(null);
  const [isClosingModal, setIsClosingModal] = useState(false);

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const tax = cartTotal * (taxPercentage / 100);
  const finalTotal = cartTotal + tax;

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

  return (
    <div className="w-full px-[48px] pb-12 min-h-screen font-sans">
      <h1 className="pt-8 text-[16px] font-semibold text-gray-900 mb-8">
        Cart <span className="font-normal text-gray-400 text-[12px]">({cartItemsCount} items)</span>
      </h1>

      <div className="flex flex-col md:flex-row gap-12 xl:gap-24">
        {/* Left Column: Cart Items */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Items List */}
          {cartItems.length === 0 ? (
            <div className="text-center py-12 border border-gray-100 bg-[#f9f9f9]">
              <p className="text-gray-500 mb-6">Your cart is currently empty.</p>
              <Link href="/shop-by" className="bg-[#221f1f] text-white py-3 px-8 text-[14px] font-medium hover:bg-black transition-colors inline-block">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap gap-10">
              {cartItems.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="w-full sm:w-[380px] flex flex-col gap-4 group relative">
                  {/* Image Box */}
                  <div className="w-full aspect-square relative bg-[#f9f9f9] flex items-center justify-center p-8 group-hover:bg-[#f4f4f4] transition-colors overflow-hidden">
                    <Link href={`/products/${item.id}`} className="absolute inset-0 z-0 cursor-pointer">
                      <Image src={item.image} alt={item.title} fill className="object-contain p-12 transition-transform duration-500 group-hover:scale-[1.2]" />
                    </Link>
                    <button 
                      onClick={() => setItemToRemove(item)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors p-2 z-10"
                      aria-label="Remove item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                  
                  {/* Info Box */}
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <Link href={`/products/${item.id}`} className="hover:underline">
                        <h3 className="text-[15px] font-medium text-gray-900 leading-tight mb-2">{item.title}</h3>
                      </Link>
                      <div className="flex items-center gap-2 mb-2">
                        {item.originalPrice && (
                          <span className="text-[14px] text-gray-500 line-through">{item.originalPrice}</span>
                        )}
                        <span className="text-[14px] font-semibold text-[#b44131]">{item.price}</span>
                      </div>
                      <p className="text-[13px] text-gray-600">Colour: <span className="capitalize text-gray-900">{item.color}</span></p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-6 justify-between h-full min-h-[90px]">
                      <button 
                        onClick={() => {
                          if (isInWishlist(item.id)) {
                            removeFromWishlist(item.id);
                          } else {
                            addToWishlist(item);
                          }
                        }}
                        className="text-gray-400 hover:text-[#ac2505] transition-all duration-300 active:scale-75" 
                        aria-label="Add to wishlist"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isInWishlist(item.id) ? "#ac2505" : "none"} stroke={isInWishlist(item.id) ? "#ac2505" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300 ease-in-out"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                      </button>
                      
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
                        <span className="text-[14px] w-4 text-center text-gray-900">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-400 hover:text-black">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="md:w-[350px] lg:w-[400px] xl:w-[480px] flex-shrink-0 pt-2 md:pt-0">
          <div className="flex flex-col gap-3 text-[14px] text-gray-900 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>£{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping cost</span>
              <span>£0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>£{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-[15px] text-black mt-2">
              <span className="uppercase tracking-wide text-[13px]">Total (Tax included)</span>
              <span>£{finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[13px] text-gray-900 mb-8 border border-gray-100 p-4 bg-[#f9f9f9] shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            <span>Estimated delivery: <strong>20 June - 23 June</strong></span>
          </div>

          <Link 
            href="/checkout" 
            className={`w-full block bg-[#221f1f] text-white py-4 text-center text-[15px] font-medium hover:bg-[#fffbf7] hover:text-black border border-[#221f1f] hover:border-black transition-colors ${cartItems.length === 0 ? "opacity-50 pointer-events-none" : ""}`}
          >
            Go To Checkout
          </Link>
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
    </div>
  );
}

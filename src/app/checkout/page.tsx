"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Check, Home, CreditCard, Pencil } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckout from "@/components/StripeCheckout";

// Make sure to call `loadStripe` outside of a component’s render to avoid recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

export default function CheckoutPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null);
  const [newsChecked, setNewsChecked] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [addressData, setAddressData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address1: "",
    additionalInfo: "",
    postalCode: "",
    phoneCode: "+91",
    phoneNumber: "",
    city: "",
    state: "",
    country: ""
  });
  const [formError, setFormError] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [orderId, setOrderId] = useState("");
  const [isInitializingStripe, setIsInitializingStripe] = useState(false);
  const { cartItems, cartTotal, taxPercentage, calculatedShippingCost: shippingCost } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset to step 1 if cart is empty after mounting
  useEffect(() => {
    if (mounted && cartItems.length === 0) {
      setStep(1);
      // Optional: you could also clear addressData here if you wanted a full reset
    }
  }, [mounted, cartItems.length]);

  const taxAmount = (cartTotal * taxPercentage) / 100;
  const finalTotal = cartTotal + taxAmount + shippingCost;

  useEffect(() => {
    if (step === 3 && finalTotal > 0 && !clientSecret) {
      setIsInitializingStripe(true);
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: finalTotal,
          cartItems,
          addressData,
          taxAmount,
          shippingCost,
          subtotal: cartTotal
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
            setOrderId(data.orderId);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setIsInitializingStripe(false));
    }
  }, [step, finalTotal, clientSecret]);

  return (
    <div className="min-h-screen bg-white text-black py-8">
      {/* Header Logo */}
      <div className="flex justify-center mb-[12px]">
        <Link href="/">
          <span
            className="text-[48px] font-normal leading-none tracking-[0.02em] text-[#a66a53]"
            style={{ fontFamily: "var(--font-style-script)" }}
          >
            Cielora
          </span>
        </Link>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 mb-16">
        <div className="flex items-center justify-between">
          
          {/* Step 1: Details */}
          <div className="flex items-center gap-2 flex-1 relative">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 ${step > 1 ? 'bg-[#a66a53] text-white' : 'bg-[#a66a53] text-white'}`}>
              {step > 1 ? <Check size={16} strokeWidth={3} /> : 1}
            </div>
            <span className={`font-semibold text-sm relative z-10 pr-4 bg-white ${step >= 1 ? 'text-black' : 'text-gray-400'}`}>Details</span>
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[2px] bg-gray-200">
              <div className={`h-full bg-[#a66a53] transition-all duration-300 ${step > 1 ? 'w-full' : 'w-1/3'}`}></div>
            </div>
          </div>
          
          {/* Step 2: Shipping */}
          <div className="flex items-center gap-2 flex-1 relative pl-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 ${step >= 2 ? 'bg-[#a66a53] text-white' : 'border-2 border-gray-300 bg-white text-gray-400'}`}>
              {step > 2 ? <Check size={16} strokeWidth={3} /> : 2}
            </div>
            <span className={`font-semibold text-sm relative z-10 pr-4 bg-white ${step >= 2 ? 'text-black' : 'text-gray-400'}`}>Shipping</span>
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[2px] bg-gray-200">
              <div className={`h-full bg-[#a66a53] transition-all duration-300 ${step > 2 ? 'w-full' : (step === 2 ? 'w-1/3' : 'w-0')}`}></div>
            </div>
          </div>
          
          {/* Step 3: Payment */}
          <div className="flex items-center gap-2 flex-1 relative pl-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 ${step >= 3 ? 'bg-[#a66a53] text-white' : 'border-2 border-gray-300 bg-white text-gray-400'}`}>
              3
            </div>
            <span className={`font-semibold text-sm relative z-10 pr-4 bg-white ${step >= 3 ? 'text-black' : 'text-gray-400'}`}>Payment</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-20 flex flex-col lg:flex-row gap-12">
        
        {/* Left Column: Flow Steps */}
        <div className="flex-1 max-w-2xl">
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Sign In Section */}
              <div className="mb-12">
                <h2 className="text-xl font-bold mb-1">Sign in</h2>
                <p className="text-gray-500 mb-6 text-sm">Sign in to continue</p>
                
                <div className="space-y-4">
                  <div>
                    <input 
                      type="email" 
                      placeholder="Email" 
                      className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Password" 
                      className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black pr-12"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="w-5 h-5 border border-black flex items-center justify-center group-hover:bg-gray-50">
                        {/* Empty checkbox */}
                      </div>
                      <span className="text-sm font-medium">Remember me</span>
                    </label>
                    <Link href="#" className="text-sm hover:underline">
                      forgot password?
                    </Link>
                  </div>
                  
                  <button 
                    onClick={() => setStep(2)}
                    className="w-full bg-[#221f1f] text-white py-4 font-medium text-[15px] hover:bg-black transition-colors mt-4"
                  >
                    Login
                  </button>
                </div>
              </div>

              {/* Guest Section */}
              <div>
                <h2 className="text-xl font-bold mb-1">Continue as guest</h2>
                <p className="text-gray-500 mb-6 text-sm">You will have a chance to create an account later.</p>
                
                <button 
                  onClick={() => setStep(2)}
                  className="w-full border border-black text-black py-4 font-medium text-[15px] hover:bg-gray-50 transition-colors"
                >
                  Checkout as Guest
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              {!selectedShipping ? (
                <>
                  <h2 className="text-xl font-bold mb-6">Shipping Options</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Shipping Option Card */}
                    <div 
                      onClick={() => setSelectedShipping('home')}
                      className="border border-gray-200 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-black transition-colors bg-gray-50"
                    >
                      <div className="mb-4 text-gray-700">
                        <Home size={32} strokeWidth={1.5} />
                      </div>
                      <h3 className="font-bold text-[15px] mb-1">Home Delivery</h3>
                      <p className="text-gray-600 text-sm mb-3">5-7 Business Days</p>
                      <p className="font-medium">{shippingCost === 0 ? "Free" : `€${shippingCost.toFixed(2)}`}</p>
                    </div>
                  </div>

                  <div className="mt-12 flex justify-start items-center">
                    <button 
                      onClick={() => setStep(1)}
                      className="text-gray-500 hover:text-black hover:underline text-sm font-medium"
                    >
                      Back to Details
                    </button>
                  </div>
                </>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-xl font-bold mb-6">Personal information</h2>
                  
                  <form 
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newsChecked) {
                        setFormError("You must agree to receive news and exclusive promotions to continue.");
                        return;
                      }
                      setStep(3);
                    }}
                  >
                    <input type="text" value={addressData.firstName} onChange={e => setAddressData({...addressData, firstName: e.target.value})} required pattern="^[a-zA-Z\s]+$" title="Only letters are allowed" placeholder="First Name*" className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black" />
                    <input type="text" value={addressData.lastName} onChange={e => setAddressData({...addressData, lastName: e.target.value})} required pattern="^[a-zA-Z\s]+$" title="Only letters are allowed" placeholder="Last Name*" className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black" />
                    <input type="email" value={addressData.email} onChange={e => setAddressData({...addressData, email: e.target.value})} required placeholder="Email*" className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black" />
                    <input type="text" value={addressData.address1} onChange={e => setAddressData({...addressData, address1: e.target.value})} required placeholder="Address 1*" className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black" />
                    <input type="text" value={addressData.additionalInfo} onChange={e => setAddressData({...addressData, additionalInfo: e.target.value})} placeholder="Additional information" className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black" />
                    <input type="text" value={addressData.postalCode} onChange={e => setAddressData({...addressData, postalCode: e.target.value})} required pattern="^[a-zA-Z0-9\s]+$" title="Only letters and numbers are allowed" placeholder="Postal Code*" className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black" />
                    
                    <div className="flex gap-4">
                      <select value={addressData.phoneCode} onChange={e => setAddressData({...addressData, phoneCode: e.target.value})} required className="border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black bg-white w-28 shrink-0 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_12px_center]">
                        <option>+91</option>
                        <option>+1</option>
                        <option>+44</option>
                        <option>+34</option>
                      </select>
                      <input 
                        type="tel" 
                        value={addressData.phoneNumber}
                        onChange={e => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          setAddressData({...addressData, phoneNumber: val});
                        }}
                        required 
                        pattern="^[0-9]+$" 
                        title="Only numbers are allowed" 
                        placeholder="Phone Number*" 
                        className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black" 
                      />
                    </div>
                    
                    <input type="text" value={addressData.city} onChange={e => setAddressData({...addressData, city: e.target.value})} required placeholder="City*" className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black" />
                    
                    <input type="text" value={addressData.state} onChange={e => setAddressData({...addressData, state: e.target.value})} required placeholder="State*" className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black" />

                    <input type="text" value={addressData.country} onChange={e => setAddressData({...addressData, country: e.target.value})} required placeholder="Country*" className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black" />
                    
                    <div className="pt-4">
                      <label 
                        className="flex items-start gap-3 cursor-pointer group mb-4"
                        onClick={(e) => {
                          e.preventDefault();
                          setNewsChecked(!newsChecked);
                          if (formError) setFormError("");
                        }}
                      >
                        <div className="w-5 h-5 border border-black flex shrink-0 mt-0.5 items-center justify-center group-hover:bg-gray-50">
                          {newsChecked && <Check size={16} strokeWidth={3} />}
                        </div>
                        <span className="text-sm font-medium text-black">Yes, I want to stay up to date with news and exclusive promotions by email.</span>
                      </label>
                      <p className="text-sm text-black mb-4">
                        By continuing, I declare that I have read and accept the Cielora <Link href="#" className="underline">Privacy Policy</Link>.
                      </p>
                      {formError && (
                        <p className="text-red-600 text-sm mb-4 font-medium">{formError}</p>
                      )}
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#221f1f] text-white py-4 font-medium text-[15px] hover:bg-black transition-colors"
                    >
                      Go to payment
                    </button>
                    
                    <div className="mt-6 flex justify-start items-center">
                      <button 
                        type="button"
                        onClick={() => setSelectedShipping(null)}
                        className="text-gray-500 hover:text-black hover:underline text-sm font-medium"
                      >
                        Back to Shipping Options
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-bold mb-6">Shipping to</h2>
                
                <div className="border border-gray-200 p-6 bg-white mb-6 flex justify-between items-start">
                  <div>
                    <div className="mb-4 text-gray-500">
                      <Home size={28} strokeWidth={1} />
                    </div>
                    <p className="font-bold text-[15px] mb-1">{(addressData.firstName + " " + addressData.lastName).toUpperCase() || "ASHUTOSH SINGH"}</p>
                    <p className="text-gray-400 text-[15px]">{addressData.address1 || "29, PHASE-3, ROAD NO. 8, CENTRAL COLONY,"}</p>
                    <p className="text-gray-400 text-[15px]">{(addressData.postalCode || "302013") + " " + (addressData.city || "JAIPUR") + " " + (addressData.state || "Rajasthan")}</p>
                    <p className="text-gray-400 text-[15px]">Phone:{addressData.phoneNumber || "8769359925"}</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setStep(2)}
                    className="p-2 border border-gray-300 hover:border-black transition-colors"
                  >
                    <Pencil size={18} strokeWidth={1.5} color="#666" />
                  </button>
                </div>

                <label 
                  className="flex items-center gap-3 cursor-pointer group mb-8"
                  onClick={(e) => {
                    e.preventDefault();
                    setBillingSameAsShipping(!billingSameAsShipping);
                  }}
                >
                  <div className="w-5 h-5 border border-black flex shrink-0 items-center justify-center group-hover:bg-gray-50">
                    {billingSameAsShipping && <Check size={16} strokeWidth={3} />}
                  </div>
                  <span className="text-[15px] font-medium text-black">Billing address same as shipping</span>
                </label>

                <div className="mt-8">
                  <h2 className="text-xl font-bold mb-6">Payment</h2>
                  {isInitializingStripe ? (
                    <div className="py-12 flex justify-center items-center">
                      <p className="text-gray-500">Loading secure payment...</p>
                    </div>
                  ) : clientSecret ? (
                    <Elements 
                      stripe={stripePromise} 
                      options={{ 
                        clientSecret, 
                        appearance: { 
                          theme: 'stripe',
                          variables: { colorPrimary: '#a66a53' }
                        } 
                      }}
                    >
                      <StripeCheckout 
                        amount={finalTotal} 
                        orderId={orderId}
                        onSuccess={() => {
                          window.location.href = `/checkout/success?orderId=${orderId}`;
                        }}
                        onCancel={() => setStep(2)} 
                      />
                    </Elements>
                  ) : (
                    <p className="text-red-500 py-4">Failed to initialize payment.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="bg-gray-50 p-6 rounded-sm sticky top-8">
            <h2 className="text-lg font-bold mb-6">Order Summary</h2>
            
            {mounted && cartItems.length > 0 ? (
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.color}`} className="flex gap-4 border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                    <div className="w-20 h-24 bg-white relative flex-shrink-0">
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-sm line-clamp-2 pr-4">{item.title}</h3>
                        <span className="font-semibold text-sm">{item.price}</span>
                      </div>
                      <p className="text-gray-500 text-xs mb-1">Color: {item.color}</p>
                      {item.size && (
                        <p className="text-gray-500 text-xs mb-1">Size: {item.size}</p>
                      )}
                      <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm mb-6">Your cart is empty.</p>
            )}

            <div className="border-t border-gray-200 pt-4 space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>€{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{step >= 2 ? (shippingCost === 0 ? 'Free' : `€${shippingCost.toFixed(2)}`) : 'Calculated at next step'}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Estimated Tax ({taxPercentage}%)</span>
                <span>€{taxAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg">
                €{(cartTotal + taxAmount + (step >= 2 ? shippingCost : 0)).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

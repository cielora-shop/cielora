"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { CheckCircle } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the cart when reaching the success page
    clearCart();
  }, [clearCart]);

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-md w-full mx-4">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
      <h1 className="text-3xl font-light mb-4">Payment Successful!</h1>
      <p className="text-gray-600 mb-6">
        Thank you for your purchase. We are processing your order and will send you an email confirmation shortly.
      </p>
      
      {orderId && (
        <div className="bg-gray-100 p-4 rounded text-left mb-6">
          <p className="text-sm text-gray-500 mb-1">Order Number</p>
          <p className="font-medium text-lg">{orderId}</p>
        </div>
      )}

      <div className="flex flex-col space-y-3">
        <Link href="/shop-by" className="bg-black text-white py-3 px-6 text-sm hover:bg-gray-800 transition">
          CONTINUE SHOPPING
        </Link>
        <Link href="/" className="text-sm underline underline-offset-4 text-gray-600 hover:text-black">
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[70vh] bg-gray-50 flex flex-col items-center justify-center py-12">
      <Suspense fallback={<div className="p-8">Loading order details...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

export default function StripeCheckout({ amount, onSuccess, onCancel }: { amount: number, onSuccess: () => void, onCancel: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message || "An unexpected error occurred.");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess();
    } else {
      setMessage("Something went wrong.");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement options={{ layout: "tabs" }} />
      
      {message && (
        <div className="text-red-600 text-sm font-medium mt-4">
          {message}
        </div>
      )}

      <div className="flex gap-4 mt-8">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 border border-gray-300 bg-white text-black py-4 font-medium text-[16px] hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || !stripe || !elements}
          className="flex-1 bg-[#221f1f] text-white py-4 font-medium text-[16px] hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "Processing..." : `Pay €${amount.toFixed(2)}`}
        </button>
      </div>
    </form>
  );
}

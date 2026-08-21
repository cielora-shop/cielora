"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Order } from "@/lib/db";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/search?orderId=${params.id}`);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          setOrder(data.results[0]);
        } else {
          setError("Order not found");
        }
      } catch (err) {
        setError("Error fetching order");
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  if (loading) {
    return <div className="max-w-[1000px] mx-auto px-4 py-8 md:py-12 mt-10 md:mt-[80px]">Loading order...</div>;
  }

  if (error || !order) {
    return <div className="max-w-[1000px] mx-auto px-4 py-8 md:py-12 mt-10 md:mt-[80px]">{error || "Order not found"}</div>;
  }

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-8 md:py-12 mt-10 md:mt-[80px]">
      <button 
        onClick={() => router.back()} 
        className="text-[13px] underline mb-6 text-left hover:text-[#b44131]"
      >
        &larr; Back to orders
      </button>
      
      <div className="border border-gray-200 p-6 bg-gray-50">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-[18px] font-semibold text-gray-900">{order.id}</h2>
            <p className="text-[13px] text-gray-500">{new Date(order.date).toLocaleString()}</p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="mb-8 mt-2">
          {order.status === "Cancelled" ? (
            <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-md border border-red-100">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <X size={16} className="text-red-600" />
              </div>
              <div>
                <p className="text-[14px] font-medium">Order Cancelled</p>
                <p className="text-[12px] text-red-500">This order has been cancelled and will not be fulfilled.</p>
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Line */}
              <div className="absolute top-4 left-0 w-full h-[2px] bg-gray-200">
                <div 
                  className="absolute top-0 left-0 h-full bg-black transition-all duration-500"
                  style={{
                    width: order.status === "Pending" ? "0%" :
                           order.status === "Processing" ? "33%" :
                           order.status === "Shipped" ? "66%" :
                           order.status === "Delivered" ? "100%" : "0%"
                  }}
                ></div>
              </div>
              
              {/* Steps */}
              <div className="relative flex justify-between">
                {[
                  { label: "Pending", active: true },
                  { label: "Processing", active: ["Paid", "Processing", "Shipped", "Delivered"].includes(order.status) },
                  { label: "Shipped", active: ["Shipped", "Delivered"].includes(order.status) },
                  { label: "Delivered", active: order.status === "Delivered" }
                ].map((step) => (
                  <div key={step.label} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-colors duration-500 ${step.active ? 'bg-black border-black text-white' : 'bg-white border-gray-300 text-gray-300'}`}>
                      {step.active ? <Check size={14} strokeWidth={3} /> : <div className="w-2 h-2 rounded-full bg-gray-200" />}
                    </div>
                    <span className={`text-[11px] md:text-[12px] font-medium mt-2 ${step.active ? 'text-black' : 'text-gray-400'}`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <h3 className="text-[14px] font-semibold mb-3 border-b border-gray-200 pb-2">Order Items</h3>
          <div className="flex flex-col gap-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-3 border border-gray-100 rounded-sm">
                <div className="w-[70px] h-[70px] relative bg-gray-50 shrink-0">
                  <Image src={item.image} alt={item.title} fill className="object-cover p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-gray-900 truncate">{item.title}</p>
                  {item.description && (
                    <p className="text-[12px] text-gray-500 line-clamp-2 mt-1 leading-snug">{item.description}</p>
                  )}
                  <div className="flex gap-3 mt-1.5">
                    <p className="text-[12px] text-gray-600 bg-gray-50 px-2 py-0.5 rounded-sm">Color: {item.color}</p>
                    {item.size && <p className="text-[12px] text-gray-600 bg-gray-50 px-2 py-0.5 rounded-sm">Size: {item.size}</p>}
                  </div>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto flex sm:flex-col justify-between sm:justify-start mt-2 sm:mt-0 border-t sm:border-t-0 border-gray-100 pt-2 sm:pt-0">
                  <div className="flex items-center gap-1 sm:justify-end">
                    <span className="text-[11px] text-gray-500 uppercase tracking-wider">Rate:</span>
                    <span className="text-[14px] font-medium">{item.price}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:justify-end mt-0.5">
                    <span className="text-[11px] text-gray-500 uppercase tracking-wider">Qty:</span>
                    <span className="text-[13px] font-medium text-gray-700">{item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mt-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[13px] text-gray-600">Subtotal</span>
            <span className="text-[13px] text-gray-900 font-medium">€{order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[13px] text-gray-600">Shipping</span>
            <span className="text-[13px] text-gray-900 font-medium">{order.total - order.subtotal - order.tax > 0 ? `€${(order.total - order.subtotal - order.tax).toFixed(2)}` : "Free"}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-[13px] text-gray-600">Tax</span>
            <span className="text-[13px] text-gray-900 font-medium">€{order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <span className="text-[15px] font-bold text-gray-900">Total</span>
            <span className="text-[16px] font-bold text-gray-900">€{order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

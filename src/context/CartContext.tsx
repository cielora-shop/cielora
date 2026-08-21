"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { ShippingRule } from "@/lib/db";

export interface CartItem {
  cartItemId?: string; // Unique identifier for the cart item (id + color + size)
  id: string | number;
  title: string;
  price: string;
  originalPrice?: string;
  color: string;
  size?: string;
  description?: string;
  quantity: number;
  image: string;
}

interface CartContextType {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  taxPercentage: number;
  shippingRules: ShippingRule[];
  calculatedShippingCost: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [taxPercentage, setTaxPercentage] = useState<number>(17.35);
  const [shippingRules, setShippingRules] = useState<ShippingRule[]>([{ id: "default", minOrderValue: 0, maxOrderValue: null, shippingCost: 8.99 }]);
  const [isMounted, setIsMounted] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem("cielora_cart");
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Error accessing/parsing cart from local storage", e);
    }
    
    // Fetch tax percentage from global settings
    fetch("/api/db")
      .then(res => res.json())
      .then(data => {
        if (data?.settings?.taxPercentage !== undefined) {
          setTaxPercentage(data.settings.taxPercentage);
        }
        if (data?.settings?.shippingRules) {
          setShippingRules(data.settings.shippingRules);
        }
      })
      .catch(err => console.error("Error fetching db settings", err));
  }, []);

  // Save to local storage whenever cart changes
  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem("cielora_cart", JSON.stringify(cartItems));
      } catch (e) {
        console.error("Error saving cart to local storage", e);
      }
    }
  }, [cartItems, isMounted]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (item: CartItem) => {
    const generatedCartItemId = `${item.id}-${item.color}-${item.size || 'default'}`;
    
    setCartItems((prev) => {
      const existing = prev.find((i) => i.cartItemId === generatedCartItemId);
      if (existing) {
        return prev.map((i) =>
          i.cartItemId === generatedCartItemId ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
        );
      }
      return [...prev, { ...item, cartItemId: generatedCartItemId }];
    });
    openCart();
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) => prev.map((i) => (i.cartItemId === cartItemId ? { ...i, quantity } : i)));
  };

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartTotal = cartItems.reduce((total, item) => {
    const priceValue = parseFloat(item.price.replace(/[^0-9.]/g, ""));
    return total + priceValue * item.quantity;
  }, 0);

  const calculatedShippingCost = React.useMemo(() => {
    if (!shippingRules || shippingRules.length === 0) return 8.99;
    
    // Sort rules by minOrderValue descending so higher thresholds match first
    const sortedRules = [...shippingRules].sort((a, b) => b.minOrderValue - a.minOrderValue);

    // Find the applicable rule
    const matchingRule = sortedRules.find(rule => {
      const meetsMin = cartTotal >= rule.minOrderValue;
      const meetsMax = rule.maxOrderValue === null || cartTotal < rule.maxOrderValue;
      return meetsMin && meetsMax;
    });

    return matchingRule ? matchingRule.shippingCost : 8.99;
  }, [cartTotal, shippingRules]);

  return (
    <CartContext.Provider
      value={{
        isCartOpen,
        openCart,
        closeCart,
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        taxPercentage,
        shippingRules,
        calculatedShippingCost,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

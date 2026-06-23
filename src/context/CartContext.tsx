"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface CartItem {
  id: string | number;
  title: string;
  price: string;
  originalPrice?: string;
  color: string;
  quantity: number;
  image: string;
}

interface CartContextType {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
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
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.color === item.color);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.color === item.color ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, item];
    });
    openCart();
  };

  const removeFromCart = (id: string | number) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string | number, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const priceValue = parseFloat(item.price.replace(/[^0-9.]/g, ""));
    return total + priceValue * item.quantity;
  }, 0);

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
        cartTotal,
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

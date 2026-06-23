"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface WishlistItem {
  id: string | number;
  title: string;
  price: string;
  originalPrice?: string;
  color: string;
  image: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string | number) => void;
  isInWishlist: (id: string | number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem("cielora_wishlist");
      if (saved) {
        setWishlistItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Error accessing/parsing wishlist from local storage", e);
    }
  }, []);

  // Save to local storage whenever wishlist changes
  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem("cielora_wishlist", JSON.stringify(wishlistItems));
      } catch (e) {
        console.error("Error saving wishlist to local storage", e);
      }
    }
  }, [wishlistItems, isMounted]);

  const addToWishlist = (item: WishlistItem) => {
    setWishlistItems((prev) => {
      // Avoid duplicates
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromWishlist = (id: string | number) => {
    setWishlistItems((prev) => prev.filter((i) => i.id !== id));
  };

  const isInWishlist = (id: string | number) => {
    return wishlistItems.some((i) => i.id === id);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}

"use client";

import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";

interface AddToCartButtonProps {
  product: {
    id: string | number;
    title: string;
    price: string;
    image: string;
  };
  selectedColor: string;
}

export default function AddToCartButton({ product, selectedColor }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [isEs, setIsEs] = useState(true);

  useEffect(() => {
    setIsEs(!document.cookie.includes("cielora_lang=en"));
  }, []);

  const handleAddToCart = () => {
    // Generate a mock original price for demo purposes like in the design (£140.00 £98.00)
    const priceValue = parseFloat(product.price.replace(/[^0-9.]/g, ""));
    const originalPrice = priceValue < 100 ? `£${(priceValue * 1.4).toFixed(2)}` : undefined;

    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      originalPrice,
      color: selectedColor || "golden",
      quantity: 1,
      image: product.image,
    });
  };

  return (
    <button 
      onClick={handleAddToCart}
      className="flex-1 bg-[#221f1f] text-white font-medium text-[16px] py-3 px-4 flex items-center justify-center transition-colors hover:bg-black"
    >
      <span>{isEs ? "Añadir al carrito" : "Add to Cart"}</span>
    </button>
  );
}

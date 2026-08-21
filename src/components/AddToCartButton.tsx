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
  size?: string;
  description?: string;
  disabled?: boolean;
}

export default function AddToCartButton({ product, selectedColor, size, description, disabled }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [isEs, setIsEs] = useState(true);

  useEffect(() => {
    setIsEs(!document.cookie.includes("cielora_lang=en"));
  }, []);

  const handleAddToCart = () => {
    // Generate a mock original price for demo purposes like in the design (€140.00 €98.00)
    const priceValue = parseFloat(product.price.replace(/[^0-9.]/g, ""));
    const originalPrice = priceValue < 100 ? `€${(priceValue * 1.4).toFixed(2)}` : undefined;

    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      originalPrice,
      color: selectedColor || "golden",
      size,
      description,
      quantity: 1,
      image: product.image,
    });
  };

  return (
    <button 
      onClick={handleAddToCart}
      disabled={disabled}
      className={`flex-1 font-medium text-[16px] py-3 px-4 flex items-center justify-center transition-colors ${
        disabled 
          ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
          : "bg-[#221f1f] text-white hover:bg-black"
      }`}
    >
      <span>{isEs ? "Añadir al carrito" : "Add to Cart"}</span>
    </button>
  );
}

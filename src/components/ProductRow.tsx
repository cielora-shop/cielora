"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import ProductCard from "@/components/ProductCard";
import { products as defaultProducts } from "@/data/products";

interface ProductRowProps {
  collectionName: string;
  price?: string;
  label?: string;
  className?: string;
  products?: any[];
}

export default function ProductRow({ collectionName, className = "", products }: ProductRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollRef.current.clientWidth / 2, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollRef.current.clientWidth / 2, behavior: "smooth" });
    }
  };

  // Assign different products based on collection for variety
  const isArcadia = collectionName === "Arcadia";
  const rowProducts = products && products.length > 0 
    ? products 
    : (isArcadia ? defaultProducts.slice(0, 8) : defaultProducts.slice(8, 16));

  return (
    <section className={`${className} px-4 sm:px-6 lg:px-8 w-full`}>
      <div className="flex justify-end mb-4 gap-4 pr-4">
        <button 
          onClick={scrollLeft} 
          aria-label="Scroll left" 
          disabled={!canScrollLeft}
          className={`flex items-center justify-center transition-colors ${
            canScrollLeft ? "text-gray-800 hover:text-gray-500 cursor-pointer" : "text-gray-300 cursor-default"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="8" viewBox="0 0 28 12" fill="none" stroke="currentColor" strokeWidth="1"><path d="M28 6H0M6 0L0 6l6 6"/></svg>
        </button>
        <button 
          onClick={scrollRight} 
          aria-label="Scroll right" 
          disabled={!canScrollRight}
          className={`flex items-center justify-center transition-colors ${
            canScrollRight ? "text-gray-800 hover:text-gray-500 cursor-pointer" : "text-gray-300 cursor-default"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="8" viewBox="0 0 28 12" fill="none" stroke="currentColor" strokeWidth="1"><path d="M0 6h28M22 0l6 6-6 6"/></svg>
        </button>
      </div>
      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] space-x-1"
      >
        {rowProducts.map((product) => (
          <div key={product.id} className="w-[50%] md:w-[25%] flex-shrink-0 pr-1">
            <ProductCard 
              id={product.id}
              title={product.title}
              price={product.price}
              label={product.label}
              labelColor={product.labelColor}
              bottomLabel={product.bottomLabel}
              colors={product.colors}
              images={product.images}
              galleryImages={product.galleryImages}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

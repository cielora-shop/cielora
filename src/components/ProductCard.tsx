"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface ProductCardProps {
  title: string;
  price: string;
  label?: string; // "New in", "Best seller"
  labelColor?: string; // "#cde6ec", "#e1bbff"
  bottomLabel?: string;
  colors: ("silver" | "gold")[]; 
  images: {
    silver?: { img1: string, img2: string };
    gold?: { img1: string, img2: string };
  };
}

export default function ProductCard({ title, price, label, labelColor, bottomLabel, colors, images }: ProductCardProps) {
  const [selectedColor, setSelectedColor] = useState<"silver" | "gold">(colors[0] || "silver");
  const router = useRouter();

  const currentImages = images[selectedColor] || Object.values(images)[0] || { img1: "/images/product 1.jpg", img2: "/images/product 1.1.jpg" };

  return (
    <div onClick={() => router.push('/products/1')} className="cursor-pointer flex flex-col items-start w-full flex-shrink-0">
      <div className="group relative aspect-[13/15] w-full mb-3 bg-gray-50 flex items-center justify-center overflow-hidden">
        {label && (
          <div 
            className="absolute top-2 left-2 z-10 px-2 py-1 text-black" 
            style={{ backgroundColor: labelColor || "#cde6ec", fontSize: "10px", fontWeight: 400 }}
          >
            {label}
          </div>
        )}
        <img src={currentImages.img1} alt={title} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-0 group-hover:duration-700" />
        <img src={currentImages.img2} alt={`${title} Hover`} className="absolute inset-0 w-full h-full object-cover opacity-0 scale-100 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:scale-110 group-hover:duration-700" />
      </div>
      <div className="flex justify-between items-center w-full mb-2 px-1">
        <div className="flex gap-2">
          {colors.includes("silver") && (
            <div 
              onClick={(e) => { e.stopPropagation(); setSelectedColor("silver"); }}
              className={`w-[16px] h-[16px] rounded-full bg-white border ${selectedColor === "silver" ? "border-gray-800" : "border-gray-400"} flex items-center justify-center cursor-pointer`}
            >
              <div className="w-[10px] h-[10px] rounded-full" style={{ backgroundColor: "#C0C0C0" }}></div>
            </div>
          )}
          {colors.includes("gold") && (
            <div 
              onClick={(e) => { e.stopPropagation(); setSelectedColor("gold"); }}
              className={`w-[16px] h-[16px] rounded-full bg-white border ${selectedColor === "gold" ? "border-gray-800" : "border-gray-400"} flex items-center justify-center cursor-pointer`}
            >
              <div className="w-[10px] h-[10px] rounded-full" style={{ backgroundColor: "#ffc107" }}></div>
            </div>
          )}
        </div>
        <button aria-label="Add to wishlist" className="text-gray-500 hover:text-black transition-colors" onClick={(e) => e.stopPropagation()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
      </div>
      <div className="px-1 w-full flex flex-col items-start">
        <h3 className="text-[12px] font-normal text-gray-900 leading-none mb-1">
          {title}
        </h3>
        <p className="text-[12px] font-medium text-gray-700 leading-none">{price}</p>
        {bottomLabel && (
          <span className="bg-[#7ce5bf] text-[10px] text-black px-1.5 py-0.5 font-medium tracking-wide mt-[4px] inline-block leading-none">
            {bottomLabel}
          </span>
        )}
      </div>
    </div>
  );
}

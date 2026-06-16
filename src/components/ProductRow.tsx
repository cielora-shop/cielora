"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface ProductRowProps {
  collectionName: string;
  price: string;
  label: string;
  className?: string;
}

function ProductCard({ index, collectionName, price, defaultLabel }: { index: number, collectionName: string, price: string, defaultLabel: string }) {
  const [selectedColor, setSelectedColor] = useState<"gray" | "yellow">("gray");
  const router = useRouter();

  const isArcadia = collectionName === "Arcadia";
  const isFirstArcadia = isArcadia && index === 0;
  const isFourthClassic = collectionName === "Classic" && index === 3;

  let img1, img2;
  if (isFirstArcadia) {
    if (selectedColor === "gray") {
      img1 = "/images/product%206%20gray.1.jpg";
      img2 = "/images/product%206%20gray.2.jpg";
    } else {
      img1 = "/images/product%206%20yellow.1.jpg";
      img2 = "/images/product%206%20yellow.2.jpg";
    }
  } else {
    img1 = index === 0 ? "/images/1 product.jpg" : `/images/product ${index + 1}.jpg`;
    img2 = index === 0 ? "/images/1.2 product.jpg" : `/images/product ${index + 1}.1.jpg`;
  }

  return (
    <div onClick={() => router.push('/products/1')} className="cursor-pointer flex flex-col items-start w-[50%] md:w-[25%] flex-shrink-0 snap-start pr-1">
      <div className="group relative aspect-[13/15] w-full mb-3 bg-gray-50 flex items-center justify-center overflow-hidden">
        {isFirstArcadia && (
          <div 
            className="absolute top-2 left-2 z-10 px-2 py-1 text-black" 
            style={{ backgroundColor: "#cde6ec", fontSize: "10px", fontWeight: 400 }}
          >
            New in
          </div>
        )}
        {isFourthClassic && (
          <div 
            className="absolute top-2 left-2 z-10 px-2 py-1 text-black" 
            style={{ backgroundColor: "#e1bbff", fontSize: "10px", fontWeight: 400 }}
          >
            Best seller
          </div>
        )}
        <img src={img1} alt="Product" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-0 group-hover:duration-700" />
        <img src={img2} alt="Product Hover" className="absolute inset-0 w-full h-full object-cover opacity-0 scale-100 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:scale-110 group-hover:duration-700" />
      </div>
      <div className="flex justify-between items-center w-full mb-2 px-1">
        <div className="flex gap-2">
          {isFirstArcadia ? (
            <>
              <div 
                onClick={(e) => { e.stopPropagation(); setSelectedColor("gray"); }}
                className={`w-[16px] h-[16px] rounded-full bg-white border ${selectedColor === "gray" ? "border-gray-800" : "border-gray-400"} flex items-center justify-center cursor-pointer`}
              >
                <div className="w-[10px] h-[10px] rounded-full" style={{ backgroundColor: "#C0C0C0" }}></div>
              </div>
              <div 
                onClick={(e) => { e.stopPropagation(); setSelectedColor("yellow"); }}
                className={`w-[16px] h-[16px] rounded-full bg-white border ${selectedColor === "yellow" ? "border-gray-800" : "border-gray-400"} flex items-center justify-center cursor-pointer`}
              >
                <div className="w-[10px] h-[10px] rounded-full" style={{ backgroundColor: "#ffc107" }}></div>
              </div>
            </>
          ) : (
            <div className="w-[16px] h-[16px] rounded-full bg-white border border-gray-400 flex items-center justify-center cursor-pointer">
              <div className="w-[10px] h-[10px] rounded-full" style={{ backgroundColor: "#C0C0C0" }}></div>
            </div>
          )}
        </div>
        <button aria-label="Add to wishlist" className="text-gray-500 hover:text-black transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
      </div>
      <div className="px-1 w-full flex flex-col items-start">
        <h3 className="text-[12px] font-normal text-gray-900 leading-none mb-1">
          {isFirstArcadia ? "Bracelate" : collectionName}
        </h3>
        <p className="text-[12px] font-medium text-gray-700 leading-none">{price}</p>
        <span className="bg-[#7ce5bf] text-[10px] text-black px-1.5 py-0.5 font-medium tracking-wide mt-[4px] inline-block leading-none">{defaultLabel}</span>
      </div>
    </div>
  );
}

export default function ProductRow({ collectionName, price, label, className = "py-16" }: ProductRowProps) {
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
        className="flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
          <ProductCard 
            key={item} 
            index={index} 
            collectionName={collectionName} 
            price={price} 
            defaultLabel={label} 
          />
        ))}
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import ZoomableImage from "@/components/ZoomableImage";
import SizeSelector from "@/components/SizeSelector";
import DetailsAccordion from "@/components/DetailsAccordion";
import AddToCartButton from "@/components/AddToCartButton";
import WishlistButton from "@/components/WishlistButton";
import { Product, GlobalSettings } from "@/lib/db";

export default function ProductInteractiveView({ 
  product, 
  settings 
}: { 
  product: Product; 
  settings: GlobalSettings;
}) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "silver");
  
  const [isEs, setIsEs] = useState(true);
  useEffect(() => {
    setIsEs(!document.cookie.includes("cielora_lang=en"));
  }, []);

  const t = (key: string) => {
    if (!isEs) return key;
    return settings.translations?.[key] || key;
  };

  const installmentsCount = settings.installmentsCount || 3;
  const installmentValue = (product.priceValue / installmentsCount).toFixed(2);

  // Collect images to show: Priority is the selected color's images, then the gallery images
  const colorImages = product.images[selectedColor as keyof typeof product.images] || { img1: "", img2: "" };
  
  // Create an array of valid image URLs
  const displayImages = [
    colorImages.img1,
    colorImages.img2,
    ...((colorImages as any).galleryImages || product.galleryImages || [])
  ].filter(Boolean); // removes empty strings/nulls

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== activeImageIndex) {
      setActiveImageIndex(newIndex);
    }
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16 pb-0">
      {/* Left Side - Image Gallery */}
      <div className="w-full lg:w-[60%] xl:w-[65%] flex flex-col relative">
        <div 
          className="flex lg:grid lg:grid-cols-2 gap-1 overflow-x-auto snap-x snap-mandatory lg:overflow-visible no-scrollbar"
          onScroll={handleScroll}
        >
          {displayImages.length > 0 ? (
            displayImages.map((src, idx) => (
              <div key={idx} className="w-full min-w-full lg:min-w-0 snap-center">
                <ZoomableImage src={src} alt={`${product.title} Image ${idx + 1}`} />
              </div>
            ))
          ) : (
            <div className="w-full min-w-full lg:min-w-0 snap-center">
              <ZoomableImage src="/placeholder.jpg" alt={product.title} />
            </div>
          )}
        </div>
        
        {/* Mobile Pagination Lines */}
        {displayImages.length > 1 && (
          <div className="flex lg:hidden justify-center items-center gap-2 mt-4 mb-2">
            {displayImages.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-[2px] w-6 transition-colors ${
                  idx === activeImageIndex ? 'bg-[#a34b31]' : 'bg-[#e5e7eb]'
                }`} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Right Side - Product Info */}
      <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col relative px-4 sm:px-6 lg:px-0 lg:pr-8 xl:pr-16">
        <div className="pt-4 pb-24">
          {/* Breadcrumbs */}
          <nav className="text-[12px] text-gray-500 mb-6 font-normal">
            <span className="hover:text-black cursor-pointer">Home</span> <span className="mx-1">&gt;</span>
            <span className="hover:text-black cursor-pointer">{product.categoryEs && isEs ? product.categoryEs : (product.category || 'Shop')}</span> <span className="mx-1">&gt;</span>
            <span className="hover:text-black cursor-pointer">{isEs && product.titleEs ? product.titleEs : product.title}</span>
          </nav>

          {/* Title & Price */}
          <h1 className="text-[20px] font-semibold leading-tight text-gray-900 mb-1 pr-8">
            {isEs && product.titleEs ? product.titleEs : product.title}
          </h1>
          <p className="text-[16px] font-semibold text-gray-900 mb-[20px]">
            {product.price}
          </p>

          {/* Color Picker */}
          <div className="flex justify-between items-center w-full mb-6">
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <div
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-[24px] h-[24px] rounded-full bg-white cursor-pointer border flex items-center justify-center transition-all ${
                    selectedColor === color ? 'border-gray-900' : 'border-gray-300'
                  }`}
                  aria-label={`${color} color option`}
                >
                  <div 
                    className="w-[14px] h-[14px] rounded-full" 
                    style={{ backgroundColor: color === 'silver' ? "#C0C0C0" : "#FFD700" }}
                  ></div>
                </div>
              ))}
            </div>
            <span className="text-[10px] text-gray-900 capitalize">{selectedColor}</span>
          </div>

          {/* Size Selector */}
          <SizeSelector sizes={product.sizes} />

          {/* Promo Banner */}
          <div className="w-full bg-[#f2f4f6] text-gray-800 text-[12px] py-2.5 px-3 mb-4">
            FATHER'S DAY | Free key ring with purchases over €90
          </div>

          {/* Add to Cart & Wishlist */}
          <div className="w-full flex items-center gap-4 mb-6">
            <AddToCartButton 
              product={{
                id: product.id,
                title: product.title,
                price: product.price,
                image: displayImages[0] || "/placeholder.jpg"
              }}
              selectedColor={selectedColor}
            />
            <WishlistButton 
              product={{
                id: product.id,
                title: product.title,
                price: product.price,
                image: displayImages[0] || "/placeholder.jpg",
                color: selectedColor
              }}
              className="flex-shrink-0" 
              iconWidth={24} 
              iconHeight={24} 
            />
          </div>

          {/* Klarna Box */}
          {settings.klarnaEnabled && (
            <div className="w-full border border-gray-100 p-4 flex gap-4 mb-6 items-start">
              <div className="bg-[#ffb3c7] text-black font-extrabold text-[15px] px-3 py-1 rounded-[6px] mt-1 tracking-tight">
                Klarna
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] text-gray-900 mb-1">
                  {isEs ? (
                    <>
                      {installmentsCount} pagos de <span className="font-bold">€{installmentValue}</span> con 0% de interés con Klarna
                    </>
                  ) : (
                    <>
                      {installmentsCount} payments of <span className="font-bold">€{installmentValue}</span> at 0% interest with Klarna
                    </>
                  )}
                </span>
                <a href="#" className="text-[14px] text-gray-900 underline decoration-1 underline-offset-2 mb-2 hover:text-gray-600 transition-colors w-fit">
                  {isEs ? "Saber más" : "Learn more"}
                </a>
                <span className="text-[13px] text-gray-500">
                  {isEs && settings.legalDisclaimer === "18+, T&C apply, Credit subject to status." 
                    ? "Mayores de 18, aplican T&C, Crédito sujeto a estado." 
                    : settings.legalDisclaimer}
                </span>
              </div>
            </div>
          )}

          {/* PayPal */}
          {settings.paypalEnabled && (
            <div className="w-full flex items-center gap-2 mb-8 text-[13px] text-gray-800">
              <span className="italic font-bold text-[15px] text-[#003087]">PayPal</span>
              <span>
                {isEs ? (
                  <>Paga en {installmentsCount} plazos sin intereses de €{installmentValue}.</>
                ) : (
                  <>Pay in {installmentsCount} interest-free payments of €{installmentValue}.</>
                )}{" "}
                <a href="#" className="underline text-[#0070ba] hover:text-[#003087]">
                  {isEs ? "Saber más" : "Learn more"}
                </a>
              </span>
            </div>
          )}

          {/* Description */}
          <div className="mt-8 mb-6">
            <h3 className="text-[12px] font-semibold text-gray-900 mb-3">{isEs ? "Descripción" : "Description"}</h3>
            <p className="text-[12px] text-gray-600 leading-[1.6]">
              {isEs && product.descriptionEs ? product.descriptionEs : product.description}
            </p>
          </div>

          {/* Details Accordion */}
          <DetailsAccordion specs={isEs && product.specsEs ? product.specsEs : product.specs} shippingReturns={settings.shippingReturns} isEs={isEs} />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

interface DetailsAccordionProps {
  specs?: {
    itemCode?: string;
    gender?: string;
    plating?: string;
    material?: string;
    color?: string;
    minLength?: string;
    [key: string]: string | undefined;
  };
  shippingReturns?: {
    freeReturnsDays?: number;
    freeDeliveryText?: string;
    helpLink?: string;
    handcraftedText?: string;
  };
  isEs?: boolean;
}

export default function DetailsAccordion({ specs, shippingReturns, isEs }: DetailsAccordionProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isShippingOpen, setIsShippingOpen] = useState(false);

  // Default specs if none are provided
  const displaySpecs = specs || {
    itemCode: "LLA0008",
    gender: "Female",
    plating: "Sterling Silver",
    material: "Metal",
    color: "Silver",
    minLength: "4 cm"
  };

  const formattedSpecs = [
    { label: "Item code", value: displaySpecs.itemCode },
    { label: "Gender", value: displaySpecs.gender },
    { label: "Plating", value: displaySpecs.plating },
    { label: "Material", value: displaySpecs.material },
    { label: "Color", value: displaySpecs.color },
    { label: "Minimum Length", value: displaySpecs.minLength },
    // Include any custom fields
    ...Object.entries(displaySpecs)
      .filter(([key]) => !["itemCode", "gender", "plating", "material", "color", "minLength"].includes(key))
      .map(([key, val]) => ({ label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), value: val }))
  ].filter(item => item.value);

  const returnsDays = shippingReturns?.freeReturnsDays ?? 30;
  const deliveryText = shippingReturns?.freeDeliveryText ?? "Free standard delivery";
  const helpLink = shippingReturns?.helpLink ?? "#";
  const handcraftedText = shippingReturns?.handcraftedText ?? "Our jewelry is made in Spain and 100% handcrafted.";

  return (
    <div className="border-t border-gray-200 mt-2">
      {/* Details */}
      <div className="border-b border-gray-200">
        <div 
          className="py-4 flex justify-between items-center cursor-pointer"
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
        >
          <span className="text-[12px] font-medium text-gray-900">{isEs ? "Detalles" : "Details"}</span>
          {isDetailsOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
          )}
        </div>
        {isDetailsOpen && (
          <div className="pb-5 pt-1 text-[12px] text-gray-600 flex flex-col gap-[14px]">
            {formattedSpecs.map((spec, i) => (
              <p key={i}>{spec.label}: {spec.value}</p>
            ))}
          </div>
        )}
      </div>

      {/* Shipping & Returns */}
      <div className="border-b border-gray-200">
        <div 
          className="py-4 flex justify-between items-center cursor-pointer"
          onClick={() => setIsShippingOpen(!isShippingOpen)}
        >
          <span className="text-[12px] font-medium text-gray-900">{isEs ? "Envíos y devoluciones" : "Shipping & Returns"}</span>
          {isShippingOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
          )}
        </div>
        {isShippingOpen && (
          <div className="pb-5 pt-1 text-[12px] text-gray-600 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
              <span>{isEs ? `Devoluciones gratuitas en un plazo de ${returnsDays} días` : `Free returns within ${returnsDays} days`}</span>
            </div>
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
              <span>{deliveryText}</span>
            </div>
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <span>{isEs ? "¿Necesitas ayuda?" : "Need help?"} <a href={helpLink} className="underline underline-offset-2 text-black">{isEs ? "Contáctanos" : "Contact us"}</a></span>
            </div>
            {handcraftedText && (
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 8l9 14 9-14-3-6H6z"></path><path d="M3 8h18"></path><path d="M12 2v20"></path></svg>
                <span>{handcraftedText}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import SizeGuideModal from './SizeGuideModal';
interface SizeSelectorProps {
  sizes?: string[];
  value?: string | null;
  onChange?: (size: string | null) => void;
}

export default function SizeSelector({ sizes = ['M', 'L', 'XL'], value = null, onChange }: SizeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEs, setIsEs] = useState(true);
  useEffect(() => {
    setIsEs(!document.cookie.includes("cielora_lang=en"));
  }, []);

  const handleSelect = (size: string) => {
    if (value === size) {
      if (onChange) onChange(null);
    } else {
      if (onChange) onChange(size);
    }
  };

  return (
    <div className="mb-6 w-full">
      <div className="flex justify-between items-end mb-[4px]">
        <div className="text-[12px] font-semibold text-gray-900">{isEs ? "Seleccionar Talla" : "Select Size"}</div>
        {value && (
          <button 
            onClick={() => {
              if (onChange) onChange(null);
            }}
            className="text-[10px] text-gray-400 hover:text-gray-900 flex items-center gap-1 transition-colors"
          >
            <span>{isEs ? "Borrar" : "Clear"}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        )}
      </div>
      
      <div className="border-t border-gray-200"></div>
      
      <div className="flex flex-col py-1">
        {sizes.map((size) => (
          <div 
            key={size}
            onClick={() => handleSelect(size)}
            className={`h-[36px] px-2 cursor-pointer text-[13px] flex items-center justify-between hover:bg-gray-50 ${value === size ? 'font-bold text-black' : 'text-black'}`}
          >
            <span>{size}</span>
            {value === size && (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
            )}
          </div>
        ))}
      </div>
      
      <div className="border-b border-gray-200 mb-3"></div>
      
      <div 
        onClick={() => setIsModalOpen(true)}
        className="text-[10px] text-gray-900 underline cursor-pointer inline-block decoration-1 underline-offset-2 hover:text-[#ad4431] transition-colors"
      >
        {isEs ? "Guía de tallas y ajuste" : "Size & Fit Guide"}
      </div>
      
      <SizeGuideModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

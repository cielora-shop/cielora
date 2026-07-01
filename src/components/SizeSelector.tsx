"use client";

import React, { useState } from 'react';
import SizeGuideModal from './SizeGuideModal';
interface SizeSelectorProps {
  sizes?: string[];
}

export default function SizeSelector({ sizes = ['M', 'L', 'XL'] }: SizeSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelect = (size: string) => {
    setSelectedSize(size);
    setIsOpen(false);
  };

  return (
    <div className="mb-6 w-full">
      <div className="text-[12px] font-semibold text-gray-900 mb-[4px]">Select Size</div>
      
      <div className="border-t border-gray-200"></div>
      
      {!selectedSize || isOpen ? (
        <div className="flex flex-col py-1">
          {sizes.map((size) => (
            <div 
              key={size}
              onClick={() => handleSelect(size)}
              className="h-[36px] px-2 cursor-pointer text-[13px] text-black hover:bg-gray-50 flex items-center"
            >
              {size}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-1">
          <div 
            onClick={() => setIsOpen(true)}
            className="flex justify-between items-center cursor-pointer h-[36px] px-2 hover:bg-gray-50"
          >
            <span className="text-[13px] text-black flex items-center h-full">{selectedSize}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          </div>
        </div>
      )}
      
      <div className="border-b border-gray-200 mb-3"></div>
      
      <div 
        onClick={() => setIsModalOpen(true)}
        className="text-[10px] text-gray-900 underline cursor-pointer inline-block decoration-1 underline-offset-2 hover:text-[#ad4431] transition-colors"
      >
        Size & Fit Guide
      </div>
      
      <SizeGuideModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

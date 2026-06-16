"use client";

import { useState } from "react";

export default function DetailsAccordion() {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isShippingOpen, setIsShippingOpen] = useState(false);

  return (
    <div className="border-t border-gray-200 mt-2">
      {/* Details */}
      <div className="border-b border-gray-200">
        <div 
          className="py-4 flex justify-between items-center cursor-pointer"
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
        >
          <span className="text-[12px] font-medium text-gray-900">Details</span>
          {isDetailsOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
          )}
        </div>
        {isDetailsOpen && (
          <div className="pb-5 pt-1 text-[12px] text-gray-600 flex flex-col gap-[14px]">
            <p>Item code: LLA0008</p>
            <p>Gender: Female</p>
            <p>Plating: Sterling Silver</p>
            <p>Material: Metal</p>
            <p>Color: Silver</p>
            <p>Minimum Length: 4 cm</p>
          </div>
        )}
      </div>

      {/* Shipping & Returns */}
      <div className="border-b border-gray-200">
        <div 
          className="py-4 flex justify-between items-center cursor-pointer"
          onClick={() => setIsShippingOpen(!isShippingOpen)}
        >
          <span className="text-[12px] font-medium text-gray-900">Shipping & Returns</span>
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
              <span>Free returns within 30 days</span>
            </div>
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
              <span>Free standard delivery</span>
            </div>
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <span>Need help? <a href="#" className="underline underline-offset-2 text-black">Contact us</a></span>
            </div>
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 8l9 14 9-14-3-6H6z"></path><path d="M3 8h18"></path><path d="M12 2v20"></path></svg>
              <span>Our jewelry is made in Spain and 100% handcrafted.</span>
            </div>
          </div>
        )}
      </div>


    </div>
  );
}

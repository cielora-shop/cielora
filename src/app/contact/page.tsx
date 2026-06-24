"use client";

import { FormEvent } from "react";

export default function ContactPage() {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    alert("Form submitted successfully!");
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:pt-32 md:pb-16 bg-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-[24px] font-sans font-semibold mb-6 md:mb-8 text-center">Contact Us</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-6 max-w-2xl mx-auto text-[12px] text-gray-700">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <input 
              type="text" 
              required
              placeholder="First Name" 
              className="w-full h-[32px] border border-[#ced4da] py-[6px] px-[12px] rounded-sm focus:outline-none focus:ring-1 focus:ring-black bg-[#FFFBF7] focus:bg-white" 
            />
            <input 
              type="text" 
              required
              placeholder="Last Name" 
              className="w-full h-[32px] border border-[#ced4da] py-[6px] px-[12px] rounded-sm focus:outline-none focus:ring-1 focus:ring-black bg-[#FFFBF7] focus:bg-white" 
            />
          </div>
          
          <input 
            type="tel" 
            required
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(/[^\d\s\-\+\(\)]/g, '');
            }}
            pattern="^\+?[0-9\s\-()]{7,20}$"
            title="Please enter a valid phone number (only numbers, spaces, +, -, or parenthesis allowed)"
            placeholder="Phone Number" 
            className="w-full h-[32px] border border-[#ced4da] py-[6px] px-[12px] rounded-sm focus:outline-none focus:ring-1 focus:ring-black bg-[#FFFBF7] focus:bg-white" 
          />
          
          <input 
            type="email" 
            required
            placeholder="Email" 
            className="w-full h-[32px] border border-[#ced4da] py-[6px] px-[12px] rounded-sm focus:outline-none focus:ring-1 focus:ring-black bg-[#FFFBF7] focus:bg-white" 
          />
          
          <div className="relative">
            <select 
              required
              className="w-full h-[32px] border border-[#ced4da] py-[6px] px-[12px] rounded-sm focus:outline-none focus:ring-1 focus:ring-black bg-[#FFFBF7] focus:bg-white appearance-none cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled hidden>Reason for inquiry</option>
              <option value="general-information">General Information</option>
              <option value="order-status">Order Status</option>
              <option value="my-account">My Account</option>
              <option value="returns-and-exchanges">Returns and Exchanges</option>
              <option value="refund-status">Refund Status</option>
              <option value="issues-online-store">Issues Online/Store</option>
              <option value="issues-other-jewelry-stores-distributors">Issues other jewelry stores/distributors</option>
              <option value="limited-editions">Limited Editions</option>
              <option value="website-questions">Website Questions</option>
              <option value="other">Other</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          
          <textarea 
            required
            placeholder="Description" 
            rows={5}
            className="w-full border border-[#ced4da] py-[6px] px-[12px] rounded-sm focus:outline-none focus:ring-1 focus:ring-black bg-[#FFFBF7] focus:bg-white resize-y" 
          ></textarea>
          
          <div className="flex items-center gap-2 mt-2">
            <input 
              type="checkbox" 
              required
              id="terms" 
              className="w-4 h-4 border border-[#ced4da] rounded-sm focus:ring-0 checked:bg-black checked:border-black cursor-pointer accent-black shrink-0" 
            />
            <label htmlFor="terms" className="text-gray-600 cursor-pointer">
              I accept the terms and conditions
            </label>
          </div>
          
          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              className="bg-[#2a1e1e] hover:bg-black text-white w-full md:w-auto px-12 md:px-24 py-3 text-[12px] transition-colors rounded-sm"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

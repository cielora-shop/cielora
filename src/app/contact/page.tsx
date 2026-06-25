"use client";

import { FormEvent, useState, useRef } from "react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState<{ isOpen: boolean, title: string, message: string }>({ isOpen: false, title: '', message: '' });
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      reason: formData.get("reason"),
      description: formData.get("description"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setModalState({ isOpen: true, title: 'Message Sent', message: 'Message sent successfully! We will get back to you soon.' });
        if (formRef.current) {
          formRef.current.reset();
        }
      } else {
        const errorData = await res.json().catch(() => ({}));
        setModalState({ isOpen: true, title: 'Error', message: `Failed to send message: ${errorData.message || 'Please try again.'}` });
      }
    } catch (error) {
      setModalState({ isOpen: true, title: 'Error', message: 'An error occurred. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen pt-24 pb-12 px-4 md:pt-32 md:pb-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-[24px] font-sans font-semibold mb-6 md:mb-8 text-center">Contact Us</h1>
          
          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-6 max-w-2xl mx-auto text-[12px] text-gray-700">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <input 
                type="text" 
                name="firstName"
                required
                placeholder="First Name" 
                className="w-full h-[32px] border border-[#ced4da] py-[6px] px-[12px] rounded-sm focus:outline-none focus:ring-1 focus:ring-black bg-[#FFFBF7] focus:bg-white" 
              />
              <input 
                type="text" 
                name="lastName"
                required
                placeholder="Last Name" 
                className="w-full h-[32px] border border-[#ced4da] py-[6px] px-[12px] rounded-sm focus:outline-none focus:ring-1 focus:ring-black bg-[#FFFBF7] focus:bg-white" 
              />
            </div>
            
            <input 
              type="tel" 
              name="phone"
              required
              minLength={7}
              maxLength={20}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(/[^\d\s()+-]/g, '');
              }}
              title="Please enter a valid phone number"
              placeholder="Phone Number" 
              className="w-full h-[32px] border border-[#ced4da] py-[6px] px-[12px] rounded-sm focus:outline-none focus:ring-1 focus:ring-black bg-[#FFFBF7] focus:bg-white" 
            />
            
            <input 
              type="email" 
              name="email"
              required
              placeholder="Email" 
              className="w-full h-[32px] border border-[#ced4da] py-[6px] px-[12px] rounded-sm focus:outline-none focus:ring-1 focus:ring-black bg-[#FFFBF7] focus:bg-white" 
            />
            
            <div className="relative">
              <select 
                name="reason"
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
              name="description"
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
                disabled={loading}
                className="bg-[#2a1e1e] hover:bg-black text-white w-full md:w-auto px-12 md:px-24 py-3 text-[12px] transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {modalState.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-[105] flex items-center justify-center px-4 transition-opacity duration-300 opacity-100">
          <div className="bg-[#fffbf7] w-full max-w-[500px] shadow-2xl flex flex-col animate-slideDown">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-[16px] font-medium text-gray-900">{modalState.title}</h3>
              <button onClick={() => setModalState({ ...modalState, isOpen: false })} className="text-gray-500 hover:text-black transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            {/* Body */}
            <div className="p-4 py-6 border-b border-gray-200">
              <p className="text-[14px] text-gray-800">{modalState.message}</p>
            </div>
            {/* Footer */}
            <div className="p-4 flex justify-end gap-4">
              <button onClick={() => setModalState({ ...modalState, isOpen: false })} className="w-[120px] py-2 bg-[#221f1f] text-white text-[14px] font-medium hover:bg-[#fffbf7] hover:text-black border border-[#221f1f] hover:border-black transition-colors flex justify-center items-center">
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

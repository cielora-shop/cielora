"use client";

import Image from "next/image";
import Link from "next/link";
import { Globe, MessageCircle, Accessibility } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SocialLink } from "@/lib/db";

export default function Footer() {
  const pathname = usePathname();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    fetch("/api/db")
      .then(res => res.json())
      .then(data => {
        if (data.socialLinks) {
          setSocialLinks(data.socialLinks);
        }
      })
      .catch(err => console.error("Error fetching social links:", err));
  }, []);

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#211d1d] text-white w-full flex flex-col relative overflow-hidden">
      {/* Main Content */}
      <div className="w-full flex flex-col justify-center min-h-[550px] py-10 px-8 lg:px-16 relative z-0">
        {/* Social Icons (Top Right) */}
        <div className="absolute top-10 right-8 lg:right-16 flex items-center gap-6 text-white">
          {socialLinks.filter(sl => !sl.isHidden).map(sl => (
            <a key={sl.id} href={sl.url} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: sl.iconSvg }} />
            </a>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="flex flex-col items-center mt-12 mb-8 text-center max-w-lg mx-auto w-full">
           <h3 className="text-2xl font-sans mb-4">Join our newsletter</h3>
           <p className="text-sm text-gray-200 mb-8">Don't miss our latest collections, lookbooks and promotions</p>
           
           <form className="w-full flex flex-col items-start space-y-4">
             <div className="flex w-full items-end">
               <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="bg-transparent border-b border-gray-400 py-2 px-0 text-sm w-full focus:outline-none focus:border-white transition-colors" 
               />
               <button 
                  type="submit" 
                  className="bg-white text-black px-8 py-2.5 text-sm font-medium hover:bg-gray-200 transition-colors ml-4 whitespace-nowrap"
               >
                  Sign up
               </button>
             </div>
             <label className="flex items-start text-[13px] text-gray-300 gap-2 cursor-pointer mt-4">
                <input type="checkbox" className="mt-1" />
                <span>I have read and understand the <Link href="#" className="underline hover:text-white">Privacy Policy</Link></span>
             </label>
           </form>

           {/* Country/Language */}
           <div className="mt-16 w-full flex flex-col items-center">
             <div className="flex items-center gap-2 text-sm mb-4">
                <Globe className="w-4 h-4" />
                <span>Country/Language:</span>
             </div>
             <div className="flex gap-4 w-full justify-center">
                <select className="bg-transparent border border-gray-500 rounded px-4 py-1.5 text-sm appearance-none cursor-pointer hover:border-white w-48 focus:outline-none">
                  <option className="bg-[#211d1d] text-white">United Kingdom</option>
                  <option className="bg-[#211d1d] text-white">United States</option>
                </select>
                <select className="bg-transparent border border-gray-500 rounded px-4 py-1.5 text-sm appearance-none cursor-pointer hover:border-white w-24 focus:outline-none">
                  <option className="bg-[#211d1d] text-white">English</option>
                  <option className="bg-[#211d1d] text-white">Español</option>
                </select>
             </div>
           </div>
        </div>

        {/* Links Section */}
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pt-4 pb-16">
          {/* Column 1 (was Information) */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-[13px] font-bold tracking-wider text-white border-b border-white pb-3 mb-1 uppercase">INFORMATION</h4>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">About us</Link>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">Exchanges and returns</Link>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">Care for your jewelry</Link>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">Warranty</Link>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">International expansion</Link>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">Declaration of Accessibility</Link>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-[13px] font-bold tracking-wider text-white border-b border-white pb-3 mb-1 uppercase">CONTACT US</h4>
            <Link href="/contact" className="text-[13px] text-gray-200 hover:text-white transition-colors">Contact us</Link>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">Legal notice</Link>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">Privacy policy</Link>
          </div>

          {/* Column 3 (was CIELORA) */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-[13px] font-bold tracking-wider text-white border-b border-white pb-3 mb-1 uppercase">CIELORA</h4>
            <Link href="/bracelets" className="text-[13px] text-gray-200 hover:text-white transition-colors">Bracelets</Link>
            <Link href="/earrings" className="text-[13px] text-gray-200 hover:text-white transition-colors">Earrings</Link>
            <Link href="/rings" className="text-[13px] text-gray-200 hover:text-white transition-colors">Rings</Link>
            <Link href="/shop-by?filter=Women's jewelry" className="text-[13px] text-gray-200 hover:text-white transition-colors">Women's jewelry</Link>
          </div>
        </div>
      </div>


    </footer>
  );
}

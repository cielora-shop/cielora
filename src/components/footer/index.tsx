import Image from "next/image";
import Link from "next/link";
import { Globe, MessageCircle, Accessibility } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#211d1d] text-white w-full flex flex-col relative overflow-hidden">
      {/* Main Content */}
      <div className="w-full flex flex-col justify-center min-h-[550px] py-10 px-8 lg:px-16 relative z-0">
        {/* Social Icons (Top Right) */}
        <div className="absolute top-10 right-8 lg:right-16 flex items-center gap-6 text-white">
           <svg className="w-5 h-5 hover:text-gray-300 cursor-pointer fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.181a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/></svg>
           <svg className="w-5 h-5 hover:text-gray-300 cursor-pointer fill-current" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.324V1.325C24 .597 23.403 0 22.675 0z"/></svg>
           {/* TikTok SVG */}
           <svg className="w-5 h-5 hover:text-gray-300 cursor-pointer fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68a6.34 6.34 0 0 0 6.27 6.36 6.34 6.34 0 0 0 6.27-6.36V11.53a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-2.72-.96z"/></svg>
           <svg className="w-5 h-5 hover:text-gray-300 cursor-pointer fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
           {/* Pinterest SVG */}
           <svg className="w-5 h-5 hover:text-gray-300 cursor-pointer fill-current" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.182 0 7.439 2.981 7.439 6.96 0 4.156-2.618 7.502-6.257 7.502-1.222 0-2.372-.635-2.766-1.385l-.754 2.875c-.272 1.041-1.01 2.34-1.506 3.136 1.171.362 2.417.558 3.705.558 6.621 0 11.988-5.368 11.988-11.988C24 5.367 18.638 0 12.017 0z"/></svg>
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
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pt-4 pb-16">
          {/* Column 1 */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-[13px] font-bold tracking-wider text-white border-b border-white pb-3 mb-1 uppercase">UNODE50</h4>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">Bracelets</Link>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">Necklaces</Link>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">Earrings</Link>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">Rings</Link>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">Women's jewelry</Link>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">Gift Guide</Link>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">Blog</Link>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-[13px] font-bold tracking-wider text-white border-b border-white pb-3 mb-1 uppercase">CONTACT US</h4>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">Join MUNDO UNO</Link>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">Contact us</Link>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">Store locator</Link>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">Distribution</Link>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">Legal notice</Link>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">Privacy policy</Link>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-[13px] font-bold tracking-wider text-white border-b border-white pb-3 mb-1 uppercase">BUYING GUIDE</h4>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">How to buy</Link>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">Promotional Conditions</Link>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">Size guide</Link>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">Shipments</Link>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">Payments</Link>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">Cookie Policy</Link>
          </div>

          {/* Column 4 */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-[13px] font-bold tracking-wider text-white border-b border-white pb-3 mb-1 uppercase">INFORMATION</h4>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">About us</Link>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">Exchanges and returns</Link>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">Care for your jewelry</Link>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">Warranty</Link>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">International expansion</Link>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">How to buy with Klarna?</Link>
            <Link href="#" className="text-[13px] text-gray-200 hover:text-white transition-colors">Declaration of Accessibility</Link>
          </div>
        </div>
      </div>


    </footer>
  );
}

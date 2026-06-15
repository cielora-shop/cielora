"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { name: "Limited Edition", href: "/limited-edition" },
    { name: "Shop by", href: "/shop-by" },
    { name: "Collections", href: "/collections" },
    { name: "Bracelets", href: "/bracelets" },
    { name: "Earrings", href: "/earrings" },
    { name: "Necklaces", href: "/necklaces" },
    { name: "Rings", href: "/rings" },
    { name: "Charms", href: "/charms" },
    { name: "For him", href: "/for-him" },
    { name: "Outlet", href: "/outlet" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#fffbf7] flex flex-col">
      <div className="w-full pr-4">
        <div className="flex h-[70px] items-center justify-between">

          {/* Logo (Left) */}
          <div className="flex items-center pl-[72px] pr-6">
            <Link href="/" className="text-[40px] tracking-tighter" style={{ fontFamily: 'var(--font-style-script), cursive', color: '#D4AF37' }}>
              Cielora
            </Link>
          </div>

          <nav className="hidden lg:flex items-center justify-between flex-1 mx-12 xl:mx-24 h-[70px]">
            {tabs.map((tab) => {
              if (tab.name === "Shop by") {
                return (
                  <div key={tab.name} className="flex-1 flex justify-center h-full group">
                    <Link
                      href={tab.href}
                      className="flex-1 flex justify-center items-center h-full text-[13px] xl:text-[14px] text-gray-600 group-hover:text-black font-medium px-1 xl:px-2 whitespace-nowrap transition-colors border-b-[3px] border-transparent group-hover:border-black text-center"
                    >
                      {tab.name}
                    </Link>

                    {/* Mega Menu Dropdown */}
                    <div className="absolute top-[70px] left-0 w-full bg-[#fffbf7] hidden group-hover:flex shadow-md z-50 pt-[32px] pb-[64px] px-[64px]">
                      <div className="flex w-full max-w-[1400px] mx-auto gap-8">
                        {/* Links Columns */}
                        <div className="flex-1 grid grid-cols-3 gap-8 text-left">
                          {/* Column 1 */}
                          <div className="flex flex-col gap-4">
                            <h4 className="text-[11px] font-normal text-gray-500 uppercase tracking-wider">Type</h4>
                            <Link href="#" className="text-[14px] text-gray-800 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">Women's jewelry</Link>
                            <Link href="#" className="text-[14px] text-gray-800 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">Men's jewelry</Link>
                            <Link href="#" className="text-[14px] text-gray-800 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">Accessories</Link>
                            <Link href="#" className="text-[14px] text-gray-800 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">Heart Jewelry</Link>
                            <Link href="#" className="text-[14px] text-gray-800 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">Dragonfly Jewelry</Link>
                          </div>
                          {/* Column 2 */}
                          <div className="flex flex-col gap-4">
                            <h4 className="text-[11px] font-normal text-gray-500 uppercase tracking-wider">Material</h4>
                            <Link href="#" className="text-[14px] text-gray-800 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">Silver Jewelry</Link>
                            <Link href="#" className="text-[14px] text-gray-800 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">Gold Jewelry</Link>
                            <Link href="#" className="text-[14px] text-gray-800 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">Leather Jewelry</Link>
                            <Link href="#" className="text-[14px] text-gray-800 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">Crystal Jewelry</Link>
                          </div>
                          {/* Column 3 */}
                          <div className="flex flex-col gap-4">
                            <h4 className="text-[11px] font-normal text-gray-500 uppercase tracking-wider">Featured</h4>
                            <Link href="#" className="text-[14px] text-gray-800 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">Limited Edition</Link>
                            <Link href="#" className="text-[14px] text-gray-800 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">Best Sellers</Link>
                            <Link href="#" className="text-[14px] text-gray-800 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">Special events jewelry</Link>
                            <Link href="#" className="text-[14px] text-gray-800 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">Everyday Jewelry</Link>
                            <Link href="#" className="text-[14px] text-gray-800 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">UNOde50 Icons</Link>
                          </div>
                        </div>

                        {/* Feature Image */}
                        <div className="w-[450px] xl:w-[600px] shrink-0">
                          <Image src="/images/1 product.jpg" alt="Featured Jewelry" width={600} height={260} className="w-full h-[260px] object-cover" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              if (tab.name === "Collections") {
                const linkClass = "text-[14px] text-gray-800 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100";
                return (
                  <div key={tab.name} className="flex-1 flex justify-center h-full group">
                    <Link
                      href={tab.href}
                      className="flex-1 flex justify-center items-center h-full text-[13px] xl:text-[14px] text-gray-600 group-hover:text-black font-medium px-1 xl:px-2 whitespace-nowrap transition-colors border-b-[3px] border-transparent group-hover:border-black text-center"
                    >
                      {tab.name}
                    </Link>

                    {/* Mega Menu Dropdown */}
                    <div className="absolute top-[70px] left-0 w-full bg-[#fffbf7] hidden group-hover:flex shadow-md z-50 pt-[32px] pb-[64px] px-[64px]">
                      <div className="flex w-full max-w-[1400px] mx-auto gap-8">
                        {/* Links Columns */}
                        <div className="flex-1 grid grid-cols-3 gap-8 text-left">
                          {/* Column 1 */}
                          <div className="flex flex-col gap-4">
                            <h4 className="text-[11px] font-normal text-gray-500 uppercase tracking-wider">New in</h4>
                            <Link href="#" className={`${linkClass} flex items-center gap-2`}>
                              Arcadia
                              <span className="bg-[#e6f4f1] text-[14px] px-1 py-0.5 font-normal">New in</span>
                            </Link>
                            <Link href="#" className={linkClass}>Flutter</Link>
                            <Link href="#" className={linkClass}>Core</Link>
                            <Link href="#" className={linkClass}>Gravity</Link>
                            <Link href="#" className={linkClass}>Beat</Link>
                            <Link href="#" className={linkClass}>Roots</Link>
                          </div>
                          {/* Column 2 */}
                          <div className="flex flex-col gap-4">
                            <h4 className="text-[11px] font-normal text-gray-500 uppercase tracking-wider">Featured</h4>
                            <Link href="#" className={linkClass}>Ser Unode50</Link>
                            <Link href="#" className={linkClass}>Hazte UNO</Link>
                          </div>
                          {/* Column 3 */}
                          <div className="flex flex-col gap-4">
                            <h4 className="text-[11px] font-normal text-gray-500 uppercase tracking-wider">Always UNO</h4>
                            <Link href="#" className={linkClass}>Empowerment Collections</Link>
                            <Link href="#" className={linkClass}>Soulcrafted Collections</Link>
                            <Link href="#" className={linkClass}>Feelings Collections</Link>
                          </div>
                        </div>

                        {/* Feature Image */}
                        <div className="w-[450px] xl:w-[600px] shrink-0 flex flex-col gap-4">
                          <h4 className="text-[18px] font-normal text-black">UNOde50 Collections</h4>
                          <Image src="/images/1 product.jpg" alt="UNOde50 Collections" width={600} height={260} className="w-full h-[260px] object-cover" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className="flex-1 flex justify-center items-center h-full text-[13px] xl:text-[14px] text-gray-600 hover:text-black font-medium px-1 xl:px-2 whitespace-nowrap transition-colors border-b-[3px] border-transparent hover:border-black text-center"
                >
                  {tab.name}
                </Link>
              );
            })}
          </nav>

          {/* Icons on Right Side */}
          <div className="flex items-center gap-4 text-gray-700">
            {/* Search */}
            <button aria-label="Search" className="hover:text-black">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
            </button>
            {/* Store */}
            <button aria-label="Store" className="hidden sm:block hover:text-black">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path><path d="M12 3v6"></path></svg>
            </button>
            {/* User */}
            <button aria-label="User" className="hidden sm:block hover:text-black">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </button>
            {/* Heart */}
            <button aria-label="Wishlist" className="hover:text-black">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
            </button>
            {/* Bag */}
            <button aria-label="Cart" className="hover:text-black">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            </button>

            {/* Mobile menu button */}
            <button onClick={() => setIsOpen(!isOpen)} aria-label="Menu" className="lg:hidden text-gray-700 hover:text-black ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t py-4 px-4 bg-white">
          <nav className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className="text-[14px] text-gray-600 hover:text-black font-medium px-4 py-2"
                onClick={() => setIsOpen(false)}
              >
                {tab.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isCartOpen, openCart, closeCart, cartItems } = useCart();
  const { wishlistItems } = useWishlist();

  const changeLanguage = (lang: string) => {
    if (typeof window !== "undefined") {
      if (lang === "es") {
        document.cookie = "googtrans=/en/es; path=/";
        document.cookie = "googtrans=/en/es; domain=" + window.location.hostname + "; path=/";
      } else {
        const hostname = window.location.hostname;
        const parts = hostname.split('.');
        
        // Clear standard path
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
        // Loop through all domain combinations (e.g. www.domain.com, .domain.com, domain.com)
        while (parts.length > 0) {
          const domainStr = parts.join('.');
          document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=" + domainStr + "; path=/;";
          document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=." + domainStr + "; path=/;";
          parts.shift();
        }
      }
      window.location.reload();
    }
  };

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistItemsCount = wishlistItems.length;

  const [tabs, setTabs] = useState<any[]>([
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
  ]);
  const [dbProducts, setDbProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/db")
      .then((res) => res.json())
      .then((data) => {
        if (data.navbarTabs) {
          setTabs(data.navbarTabs);
        }
        if (data.products) {
          setDbProducts(data.products);
        }
      })
      .catch((err) => {
        console.error("Error loading dynamic navbar config:", err);
      });
  }, []);

  useEffect(() => {
    setIsSearchOpen(false);
    setIsOpen(false);
    setIsLanguageOpen(false);
  }, [pathname]);

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[#fffbf7] flex flex-col">
      <div className="w-full">
        <div className="flex h-[70px] items-center justify-between">

          {/* Logo (Left) */}
          <div className="flex items-center pl-4 md:pl-[72px] pr-2 md:pr-6">
            <Link
              href="/"
              className="flex items-center text-[44px] font-normal leading-none tracking-[0.02em] select-none"
              style={{ fontFamily: "var(--font-style-script)", color: "#d2977aff" }}
            >
              Cielora
            </Link>
          </div>

          <nav className="hidden lg:flex items-center justify-between flex-1 mx-12 xl:mx-24 h-[70px]">
            {tabs.map((tab) => {
              const linkClass = "text-[14px] font-medium text-gray-900 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100";

              if (tab.megaMenu && tab.megaMenu.columns && tab.megaMenu.columns.length > 0) {
                const isOutlet = tab.name === "Outlet";
                return (
                  <div key={tab.name} className="flex-1 flex justify-center h-full group">
                    <Link
                      href={tab.href}
                      className={`flex-1 flex justify-center items-center h-full text-[13px] xl:text-[14px] ${isOutlet ? "text-[#ac2505] group-hover:border-[#ac2505]" : "text-gray-600 group-hover:text-black group-hover:border-black"} font-medium px-1 xl:px-2 whitespace-nowrap transition-colors border-b-[3px] border-transparent text-center`}
                    >
                      {tab.name}
                    </Link>

                    {/* Mega Menu Dropdown */}
                    <div className="absolute top-[70px] left-0 w-full bg-[#fffbf7] hidden group-hover:flex shadow-md z-50 pt-[32px] pb-[64px] px-[72px]">
                      <div className="flex w-full gap-16">
                        {/* Links Columns */}
                        <div className={`flex-1 grid gap-8 text-left ${tab.megaMenu.columns.length === 1 ? 'grid-cols-1 max-w-xs' : 'grid-cols-3'}`}>
                          {tab.megaMenu.columns.map((col: any, cIdx: number) => (
                            <div key={cIdx} className="flex flex-col gap-4">
                              {col.title && (
                                <h4 className="text-[11px] font-normal text-gray-500 uppercase tracking-wider">{col.title}</h4>
                              )}
                              {col.links.map((link: any, lIdx: number) => (
                                <Link key={lIdx} href={link.href} className={linkClass + (link.badge ? " flex items-center gap-2" : "")}>
                                  {link.name}
                                  {link.badge && (
                                    <span className="bg-[#e6f4f1] text-[14px] px-1 py-0.5 font-normal">{link.badge}</span>
                                  )}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>

                        {/* Feature Image */}
                        {tab.megaMenu.featureImage && (
                          <div className="w-[450px] xl:w-[600px] shrink-0 flex flex-col gap-4">
                            {tab.megaMenu.featureTitle && (
                              <h4 className="text-[20px] font-normal text-black">{tab.megaMenu.featureTitle}</h4>
                            )}
                            <Image src={tab.megaMenu.featureImage} alt={tab.megaMenu.featureTitle || tab.name} width={600} height={260} className="w-full h-[260px] object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }

              const isOutlet = tab.name === "Outlet";
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`flex-1 flex justify-center items-center h-full text-[13px] xl:text-[14px] ${isOutlet ? "text-[#ac2505] hover:border-[#ac2505]" : "text-gray-600 hover:text-black hover:border-black"} font-medium px-1 xl:px-2 whitespace-nowrap transition-colors border-b-[3px] border-transparent text-center`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </nav>

          {/* Icons on Right Side */}
          <div className="flex items-center gap-3 md:gap-5 text-gray-800 pr-4 md:pr-8">
            {/* Search */}
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} aria-label="Search" title="Search" className="hover:text-[#ac2505] transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
            </button>
            {/* Store */}
            <Link href="/stores" aria-label="Store" title="Store" className="hidden sm:block hover:text-[#ac2505] transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path><path d="M12 3v6"></path></svg>
            </Link>
            {/* User */}
            <Link href="/profile" aria-label="User" title="Profile" className="hidden sm:block hover:text-[#ac2505] transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </Link>
            {/* Heart */}
            <Link href="/wishlist" aria-label="Wishlist" title="Wishlist" className="hover:text-[#ac2505] transition-colors cursor-pointer relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
              {wishlistItemsCount > 0 && (
                <span className="absolute -top-[5px] -right-[6px] bg-[#ac2505] text-white text-[10px] font-bold h-[18px] w-[18px] flex items-center justify-center rounded-full leading-none">
                  {wishlistItemsCount}
                </span>
              )}
            </Link>
            {/* Bag */}
            <button
              onClick={() => isCartOpen ? closeCart() : openCart()}
              aria-label="Cart"
              title="Cart"
              className="hover:text-[#ac2505] transition-colors relative cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 7V5a4 4 0 0 1 8 0v2"></path>
                <rect x="4" y="7" width="16" height="14" rx="2" ry="2"></rect>
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-[5px] -right-[6px] bg-[#ac2505] text-white text-[10px] font-bold h-[18px] w-[18px] flex items-center justify-center rounded-full leading-none">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Language */}
            <div 
              className="relative cursor-pointer" 
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              onMouseEnter={() => setIsLanguageOpen(true)}
              onMouseLeave={() => setIsLanguageOpen(false)}
            >
              <div className="hover:text-[#ac2505] transition-colors flex items-center" aria-label="Language" title="Language">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 8 6 6" />
                  <path d="m4 14 6-6 2-3" />
                  <path d="M2 5h12" />
                  <path d="M7 2h1" />
                  <path d="m22 22-5-10-5 10" />
                  <path d="M14 18h6" />
                </svg>
              </div>
              
              <div className={`absolute right-[-10px] top-[100%] pt-5 w-32 transition-all duration-200 z-50 ${isLanguageOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <div className="bg-white shadow-md border border-gray-100 overflow-hidden">
                  <div className="flex flex-col text-[14px] text-gray-700 font-medium">
                    <div onClick={(e) => { e.stopPropagation(); changeLanguage('en'); setIsLanguageOpen(false); }} className="notranslate px-4 py-3 hover:bg-gray-50 hover:text-[#ac2505] transition-colors text-center border-b border-gray-50">English</div>
                    <div onClick={(e) => { e.stopPropagation(); changeLanguage('es'); setIsLanguageOpen(false); }} className="notranslate px-4 py-3 hover:bg-gray-50 hover:text-[#ac2505] transition-colors text-center">Español</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <button onClick={() => setIsOpen(!isOpen)} aria-label="Menu" title="Menu" className="lg:hidden text-gray-700 hover:text-[#ac2505] transition-colors ml-2">
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

      {/* Search Overlay Backdrop (closes search on outside click) */}
      {isSearchOpen && (
        <div
          className="fixed top-[70px] left-0 w-full h-[calc(100vh-70px)] z-30"
          onClick={() => setIsSearchOpen(false)}
        />
      )}

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 w-full min-h-[50vh] max-h-[85vh] overflow-y-auto bg-[#fffbf7] border-t border-gray-200 z-40 flex flex-col pt-12 pb-12 px-4 md:px-12 items-center shadow-lg">
          <div className="w-full max-w-3xl relative flex items-center bg-white/60 hover:bg-white/90 transition-colors rounded-full py-3 px-6 border border-gray-200 shadow-sm backdrop-blur-md flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 mr-3"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
            <input
              type="text"
              placeholder="Search (keywords, etc)"
              className="flex-1 bg-transparent border-none outline-none text-gray-800 text-[15px] placeholder:text-gray-400 font-light"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-black ml-3 p-1 rounded-full transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          {searchQuery.trim().length > 0 && (
            <div className="w-full max-w-7xl mt-12">
              <h3 className="text-[14px] text-gray-500 mb-6 uppercase tracking-wider font-medium">Search Results</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-1 gap-y-10">
                {dbProducts.filter(p => (p.title + " " + p.description).toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8).map(product => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    label={product.label}
                    labelColor={product.labelColor}
                    bottomLabel={product.bottomLabel}
                    colors={product.colors}
                    images={product.images}
                  />
                ))}
              </div>
              {dbProducts.filter(p => (p.title + " " + p.description).toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                <p className="text-gray-500 text-center py-10">No products found for "{searchQuery}".</p>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}

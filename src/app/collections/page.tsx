"use client";

import Link from 'next/link';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';

function CollectionsContent() {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("NEW IN");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedTopFilter, setSelectedTopFilter] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(16);
  
  const searchParams = useSearchParams();
  const filterParam = searchParams.get('filter');

  useEffect(() => {
    if (filterParam) {
      setSelectedTopFilter(filterParam);
    }
  }, [filterParam]);

  type FilterState = {
    CATEGORY: string[];
    PRICE: string[];
    SIZE: string[];
    PLATING: string[];
    COMPONENT: string[];
    LEATHER: string[];
    COLOR: string[];
  };

  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    CATEGORY: [], PRICE: [], SIZE: [], PLATING: [], COMPONENT: [], LEATHER: [], COLOR: []
  });

  const toggleFilter = (category: keyof FilterState, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[category];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };

  const dropdownRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setActiveFilter(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const categories = [
    { name: "Bracelets", count: 0 },
    { name: "Charm", count: 0 },
    { name: "Necklaces", count: 0 },
    { name: "Earrings", count: 0 },
    { name: "Rings", count: 0 },
    { name: "Piercing", count: 0 },
    { name: "Charm Piercing", count: 0 },
    { name: "Keyrings", count: 0 },
    { name: "Pendant", count: 0 },
    { name: "Watches", count: 0 },
    { name: "Ankle", count: 0 }
  ];
  const prices = [
    { name: "£0 - £20", count: 0 },
    { name: "£20 - £50", count: 0 },
    { name: "£50 - £100", count: 0 },
    { name: "£100 - £200", count: 0 },
    { name: "£200 - £300", count: 0 },
    { name: "£300 - £500", count: 0 },
    { name: "More than £500", count: 0 }
  ];
  const sizes = [
    { name: "9", count: 0 },
    { name: "12", count: 0 },
    { name: "15", count: 0 },
    { name: "18", count: 0 },
    { name: "21", count: 0 },
    { name: "23", count: 0 },
    { name: "25", count: 0 },
    { name: "U", count: 0 },
    { name: "S", count: 0 },
    { name: "M", count: 0 },
    { name: "L", count: 0 },
    { name: "XL", count: 0 },
    { name: "XXL", count: 0 }
  ];
  const platings = [
    { name: "18K gold-plated", count: 0 },
    { name: "Sterling silver-plated", count: 0 }
  ];
  const components = [
    { name: "Crafted Crystal", count: 0 },
    { name: "Faceted Crystal", count: 0 },
    { name: "Shell Pearl", count: 0 },
    { name: "Natural Stone", count: 0 },
    { name: "Murano Glass", count: 0 },
    { name: "Topazes", count: 0 },
    { name: "Circonite", count: 0 },
    { name: "Wood", count: 0 }
  ];
  const leathers = [
    { name: "Yes", count: 0 },
    { name: "No", count: 0 }
  ];
  const colors = [
    { name: "Silver", count: 0 },
    { name: "Gold", count: 0 },
    { name: "White", count: 0 },
    { name: "Black", count: 0 },
    { name: "Blue", count: 0 },
    { name: "Green", count: 0 },
    { name: "Multicolor", count: 0 },
    { name: "Red", count: 0 },
    { name: "Pink", count: 0 },
    { name: "Brown", count: 0 },
    { name: "Gray", count: 0 },
    { name: "Turquoise", count: 0 },
    { name: "Camel", count: 0 }
  ];
  const { products: dbProducts, navbarTabs, loading } = useProducts();
  const topFilters = navbarTabs.find(t => t.href === '/collections')?.groupFilters || [];

  const bottomFilters = [
    "CATEGORY", "PRICE", "SIZE", "PLATING", "COMPONENT", "LEATHER", "COLOR"
  ];

  const categoryProducts = dbProducts;

  const filteredProducts = categoryProducts.filter(p => {
    const textToSearch = (p.title + " " + p.description + " " + (p.collectionName || "")).toLowerCase();
    
    if (selectedFilters.CATEGORY.length > 0 && !selectedFilters.CATEGORY.some(cat => textToSearch.includes(cat.toLowerCase()))) return false;
    if (selectedFilters.SIZE.length > 0 && !selectedFilters.SIZE.some(size => textToSearch.includes(size.toLowerCase()))) return false;
    if (selectedFilters.PLATING.length > 0 && !selectedFilters.PLATING.some(plating => textToSearch.includes(plating.toLowerCase()))) return false;
    if (selectedFilters.COMPONENT.length > 0 && !selectedFilters.COMPONENT.some(comp => textToSearch.includes(comp.toLowerCase()))) return false;
    if (selectedFilters.LEATHER.length > 0) {
      const hasLeather = (p.description || '').toLowerCase().includes('leather');
      const wantsLeather = selectedFilters.LEATHER.includes('Yes');
      const wantsNoLeather = selectedFilters.LEATHER.includes('No');
      if (wantsLeather && !wantsNoLeather && !hasLeather) return false;
      if (wantsNoLeather && !wantsLeather && hasLeather) return false;
    }
    if (selectedFilters.COLOR.length > 0 && !selectedFilters.COLOR.some(color => textToSearch.includes(color.toLowerCase()))) return false;
    
    if (selectedFilters.PRICE.length > 0) {
      const priceMatch = selectedFilters.PRICE.some(rangeStr => {
        if (rangeStr === "More than £500") return p.priceValue >= 500;
        const match = rangeStr.match(/£(\d+)\s*-\s*£(\d+)/);
        if (match) {
           return p.priceValue >= parseInt(match[1]) && p.priceValue <= parseInt(match[2]);
        }
        return false;
      });
      if (!priceMatch) return false;
    }
    
    if (selectedTopFilter) {
      const filterWords = selectedTopFilter.toLowerCase().replace(/jewelry/g, "").replace(/jewerly/g, "").trim().split(/\s+/).filter(Boolean);
      
      const matchesAllWords = filterWords.every(word => {
        let forms = [word];
        if (word === "accesories" || word === "accessories") forms = ["accessory", "accessories", "accesory"];
        else if (word === "women's") forms = ["women", "woman"];
        else if (word === "men's") forms = ["men", "man"];
        else if (word === "dragonfly") forms = ["dragonfly", "dragonflies"];
        else if (word === "best" || word === "selling" || word === "sellers") forms = ["best seller", "best sellers", "selling", "sell", "seller", "best"];
        else {
           if (word.endsWith('ies')) forms.push(word.slice(0, -3) + 'y');
           else if (word.endsWith('s')) forms.push(word.slice(0, -1));
           else forms.push(word + 's');
        }
        return forms.some(form => textToSearch.includes(form));
      });
      
      if (!matchesAllWords) return false;
    }
    
    return true;
  }).sort((a, b) => {
    if (sortBy === "NEW IN") {
      if (a.label === "New in" && b.label !== "New in") return -1;
      if (b.label === "New in" && a.label !== "New in") return 1;
    } else if (sortBy === "BEST SELLERS") {
      if (a.label === "Best seller" && b.label !== "Best seller") return -1;
      if (b.label === "Best seller" && a.label !== "Best seller") return 1;
    } else if (sortBy === "PRICE LOW TO HIGH") {
      return a.priceValue - b.priceValue;
    } else if (sortBy === "PRICE HIGH TO LOW") {
      return b.priceValue - a.priceValue;
    }
    return 0;
  });

  const getCount = (keyword: string, type: "PRICE" | "TEXT") => {
    return categoryProducts.filter(p => {
      if (type === "PRICE") {
        if (keyword === "More than £500") return p.priceValue >= 500;
        const match = keyword.match(/£(\d+)\s*-\s*£(\d+)/);
        if (match) return p.priceValue >= parseInt(match[1]) && p.priceValue <= parseInt(match[2]);
        return false;
      }
      return (p.title + " " + p.description + " " + (p.collectionName || "")).toLowerCase().includes(keyword.toLowerCase());
    }).length;
  };

  if (loading) {
    return (
      <div className="w-full bg-white min-h-screen flex items-center justify-center text-gray-500 font-medium">
        Loading collections...
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-screen">
      <div className="px-4 md:px-12 xl:px-24 pt-4 md:pt-8 pb-12">
        {/* Breadcrumb */}
        <div className="text-[10px] text-gray-500 mb-[12px]">
          <Link href="/" className="hover:underline">Home</Link> / <span className="text-black">Collections</span>
        </div>

        {/* Title */}
        <h1 className="text-[24px] font-semibold text-black pb-[4px] mb-4">
          Jewellery Collections
        </h1>

        {/* Top Filter Buttons */}
        <div className="flex flex-wrap gap-[6px] mb-0">
          {topFilters.map((filter: string, index: number) => (
            <button
              key={index}
              onClick={() => setSelectedTopFilter(selectedTopFilter === filter ? null : filter)}
              className={`border border-gray-400 px-3 py-1.5 text-[11px] hover:border-black hover:bg-black hover:text-white transition-colors ${selectedTopFilter === filter ? 'bg-black text-white' : 'text-gray-800 bg-white'}`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Bottom Filters Bar */}
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 md:gap-8" ref={filterRef}>
            {bottomFilters.map((filter, index) => (
              <div key={index} className="relative">
                <button
                  onClick={() => setActiveFilter(activeFilter === filter ? null : filter)}
                  className="flex items-center gap-1 text-[12px] font-semibold text-gray-900 hover:text-black py-[5px]"
                >
                  {filter}
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-500 transition-transform ${activeFilter === filter ? 'rotate-180' : ''}`}>
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>

                {filter === "CATEGORY" && activeFilter === "CATEGORY" && (
                  <div className="absolute top-full left-0 mt-2 w-[200px] bg-white border border-gray-300 shadow-md z-50 flex flex-col p-4 max-h-[350px] overflow-y-auto">
                    {categories.map((cat, i) => (
                      <label key={i} className="flex items-center gap-3 py-1.5 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={selectedFilters.CATEGORY.includes(cat.name)}
                          onChange={() => toggleFilter("CATEGORY", cat.name)}
                          className="w-4 h-4 border-gray-400 rounded-sm text-black focus:ring-black cursor-pointer" 
                        />
                        <span className="text-[11px] text-gray-700 group-hover:text-black">{cat.name} ({getCount(cat.name, "TEXT")})</span>
                      </label>
                    ))}
                  </div>
                )}

                {filter === "PRICE" && activeFilter === "PRICE" && (
                  <div className="absolute top-full left-0 mt-2 w-[200px] bg-white border border-gray-300 shadow-md z-50 flex flex-col p-4 max-h-[350px] overflow-y-auto">
                    {prices.map((price, i) => (
                      <label key={i} className="flex items-center gap-3 py-1.5 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={selectedFilters.PRICE.includes(price.name)}
                          onChange={() => toggleFilter("PRICE", price.name)}
                          className="w-4 h-4 border-gray-400 rounded-sm text-black focus:ring-black cursor-pointer" 
                        />
                        <span className="text-[11px] text-gray-700 group-hover:text-black">{price.name} ({getCount(price.name, "PRICE")})</span>
                      </label>
                    ))}
                  </div>
                )}

                {filter === "SIZE" && activeFilter === "SIZE" && (
                  <div className="absolute top-full left-0 mt-2 w-[200px] bg-white border border-gray-300 shadow-md z-50 flex flex-col p-4 max-h-[350px] overflow-y-auto">
                    {sizes.map((size, i) => (
                      <label key={i} className="flex items-center gap-3 py-1.5 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={selectedFilters.SIZE.includes(size.name)}
                          onChange={() => toggleFilter("SIZE", size.name)}
                          className="w-4 h-4 border-gray-400 rounded-sm text-black focus:ring-black cursor-pointer" 
                        />
                        <span className="text-[11px] text-gray-700 group-hover:text-black">{size.name} ({getCount(size.name, "TEXT")})</span>
                      </label>
                    ))}
                  </div>
                )}

                {filter === "PLATING" && activeFilter === "PLATING" && (
                  <div className="absolute top-full left-0 mt-2 w-[220px] bg-white border border-gray-300 shadow-md z-50 flex flex-col p-4 max-h-[350px] overflow-y-auto">
                    {platings.map((plating, i) => (
                      <label key={i} className="flex items-center gap-3 py-1.5 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={selectedFilters.PLATING.includes(plating.name)}
                          onChange={() => toggleFilter("PLATING", plating.name)}
                          className="w-4 h-4 border-gray-400 rounded-sm text-black focus:ring-black cursor-pointer" 
                        />
                        <span className="text-[11px] text-gray-700 group-hover:text-black">{plating.name} ({getCount(plating.name, "TEXT")})</span>
                      </label>
                    ))}
                  </div>
                )}

                {filter === "COMPONENT" && activeFilter === "COMPONENT" && (
                  <div className="absolute top-full left-0 mt-2 w-[220px] bg-white border border-gray-300 shadow-md z-50 flex flex-col p-4 max-h-[350px] overflow-y-auto">
                    {components.map((comp, i) => (
                      <label key={i} className="flex items-center gap-3 py-1.5 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={selectedFilters.COMPONENT.includes(comp.name)}
                          onChange={() => toggleFilter("COMPONENT", comp.name)}
                          className="w-4 h-4 border-gray-400 rounded-sm text-black focus:ring-black cursor-pointer" 
                        />
                        <span className="text-[11px] text-gray-700 group-hover:text-black">{comp.name} ({getCount(comp.name, "TEXT")})</span>
                      </label>
                    ))}
                  </div>
                )}

                {filter === "LEATHER" && activeFilter === "LEATHER" && (
                  <div className="absolute top-full left-0 mt-2 w-[200px] bg-white border border-gray-300 shadow-md z-50 flex flex-col p-4 max-h-[350px] overflow-y-auto">
                    {leathers.map((leather, i) => (
                      <label key={i} className="flex items-center gap-3 py-1.5 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={selectedFilters.LEATHER.includes(leather.name)}
                          onChange={() => toggleFilter("LEATHER", leather.name)}
                          className="w-4 h-4 border-gray-400 rounded-sm text-black focus:ring-black cursor-pointer" 
                        />
                        <span className="text-[11px] text-gray-700 group-hover:text-black">{leather.name} ({getCount(leather.name, "TEXT")})</span>
                      </label>
                    ))}
                  </div>
                )}

                {filter === "COLOR" && activeFilter === "COLOR" && (
                  <div className="absolute top-full left-0 mt-2 w-[200px] bg-white border border-gray-300 shadow-md z-50 flex flex-col p-4 max-h-[350px] overflow-y-auto">
                    {colors.map((color, i) => (
                      <label key={i} className="flex items-center gap-3 py-1.5 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={selectedFilters.COLOR.includes(color.name)}
                          onChange={() => toggleFilter("COLOR", color.name)}
                          className="w-4 h-4 border-gray-400 rounded-sm text-black focus:ring-black cursor-pointer" 
                        />
                        <span className="text-[11px] text-gray-700 group-hover:text-black">{color.name} ({getCount(color.name, "TEXT")})</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 text-[10px] text-gray-800">
            <span>{filteredProducts.length} Results</span>
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-1 font-medium hover:text-black py-[5px]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
                {sortBy}
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`ml-1 text-gray-500 transition-transform ${isSortOpen ? 'rotate-180' : ''}`}>
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>

              {isSortOpen && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-400 z-50 flex flex-col shadow-sm">
                  {["NEW IN", "BEST SELLERS", "MOST POPULAR", "PRICE LOW TO HIGH", "PRICE HIGH TO LOW"].map((option) => (
                    <button 
                      key={option}
                      onClick={() => { setSortBy(option); setIsSortOpen(false); }}
                      className={`text-left px-3 py-2 text-[10px] hover:bg-gray-100 ${sortBy === option ? "font-semibold bg-[#2563eb] text-white hover:bg-[#2563eb]" : "text-gray-900"}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


        {/* Active Filters */}
        {Object.entries(selectedFilters).some(([_, vals]) => vals.length > 0) && (
          <div className="flex flex-wrap gap-2 mt-4 items-center">
            <span className="text-[12px] text-gray-500 mr-2">Applied Filters:</span>
            {Object.entries(selectedFilters).map(([category, values]) => 
              values.map(val => (
                <button
                  key={`${category}-${val}`}
                  onClick={() => toggleFilter(category as keyof FilterState, val)}
                  className="flex items-center gap-1 border border-gray-300 px-2 py-1 text-[11px] text-gray-700 hover:bg-gray-100 rounded-sm transition-colors"
                >
                  {val}
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                  </svg>
                </button>
              ))
            )}
            <button
              onClick={() => setSelectedFilters({ CATEGORY: [], PRICE: [], SIZE: [], PLATING: [], COMPONENT: [], LEATHER: [], COLOR: [] })}
              className="text-[11px] text-gray-500 hover:text-black underline ml-2 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

      {/* Product Grid */}
      <div className="w-full pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-1 gap-y-10 mt-6 px-1">
          {filteredProducts.slice(0, visibleCount).map((product) => (
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

        {/* Load More Section */}
        <div className="flex flex-col items-center justify-center mt-20 mb-8 w-full max-w-[420px] mx-auto px-4">
          <p className="text-[12px] text-gray-600 mb-3">You've viewed {Math.min(visibleCount, filteredProducts.length)} of {filteredProducts.length} products</p>
          <div className="w-full bg-[#e5e5e5] h-[6px] mb-6">
            <div className="bg-[#b44131] h-full" style={{ width: `${filteredProducts.length > 0 ? (Math.min(visibleCount, filteredProducts.length)/filteredProducts.length)*100 : 0}%` }}></div>
          </div>
          {visibleCount < filteredProducts.length && (
            <button 
              onClick={() => setVisibleCount(prev => Math.min(prev + 16, filteredProducts.length))}
              className="w-full bg-[#221f1f] text-white font-medium py-[14px] text-[12px] hover:bg-black transition-colors"
            >
              Load more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white"></div>}>
      <CollectionsContent />
    </Suspense>
  );
}

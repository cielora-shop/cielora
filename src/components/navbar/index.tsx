"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";

import { products as dummyProducts } from "@/data/products";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
            <Link href="/" className="flex items-center">
              <Image src="/images/logo site.svg" alt="Cielora Logo" width={140} height={40} className="w-auto h-[40px] object-contain" priority />
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
                    <div className="absolute top-[70px] left-0 w-full bg-[#fffbf7] hidden group-hover:flex shadow-md z-50 pt-[32px] pb-[64px] px-[72px]">
                      <div className="flex w-full gap-16">
                        {/* Links Columns */}
                        <div className="flex-1 grid grid-cols-3 gap-8 text-left">
                          {/* Column 1 */}
                          <div className="flex flex-col gap-4">
                            <h4 className="text-[11px] font-normal text-gray-500 uppercase tracking-wider">Type</h4>
                            <Link href={`/shop-by?filter='%5D%20before%3Aabsolute%20before%3Aleft-%5B-20px%5D%20before%3Aopacity-0%20hover%3Abefore%3Aopacity-100%20before%3Atransition-opacity%20before%3Aduration-300%20before%3Afont-light%20after%3Acontent-%5B''%5D%20after%3Aabsolute%20after%3A-bottom-%5B2px%5D%20after%3Aleft-0%20after%3Ah-%5B2px%5D%20after%3Aw-full%20after%3Aorigin-left%20after%3Ascale-x-0%20after%3Abg-black%20after%3Atransition-transform%20after%3Aduration-300%20hover%3Aafter%3Ascale-x-100%22%3EWomen's%20jewelry`} className="text-[14px] font-medium text-gray-900 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">Women's jewelry</Link>
                            <Link href={`/shop-by?filter='%5D%20before%3Aabsolute%20before%3Aleft-%5B-20px%5D%20before%3Aopacity-0%20hover%3Abefore%3Aopacity-100%20before%3Atransition-opacity%20before%3Aduration-300%20before%3Afont-light%20after%3Acontent-%5B''%5D%20after%3Aabsolute%20after%3A-bottom-%5B2px%5D%20after%3Aleft-0%20after%3Ah-%5B2px%5D%20after%3Aw-full%20after%3Aorigin-left%20after%3Ascale-x-0%20after%3Abg-black%20after%3Atransition-transform%20after%3Aduration-300%20hover%3Aafter%3Ascale-x-100%22%3EMen's%20jewelry`} className="text-[14px] font-medium text-gray-900 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">Men's jewelry</Link>
                            <Link href={`/shop-by?filter='%5D%20before%3Aabsolute%20before%3Aleft-%5B-20px%5D%20before%3Aopacity-0%20hover%3Abefore%3Aopacity-100%20before%3Atransition-opacity%20before%3Aduration-300%20before%3Afont-light%20after%3Acontent-%5B''%5D%20after%3Aabsolute%20after%3A-bottom-%5B2px%5D%20after%3Aleft-0%20after%3Ah-%5B2px%5D%20after%3Aw-full%20after%3Aorigin-left%20after%3Ascale-x-0%20after%3Abg-black%20after%3Atransition-transform%20after%3Aduration-300%20hover%3Aafter%3Ascale-x-100%22%3EAccessories`} className="text-[14px] font-medium text-gray-900 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">Accessories</Link>
                            <Link href={`/shop-by?filter='%5D%20before%3Aabsolute%20before%3Aleft-%5B-20px%5D%20before%3Aopacity-0%20hover%3Abefore%3Aopacity-100%20before%3Atransition-opacity%20before%3Aduration-300%20before%3Afont-light%20after%3Acontent-%5B''%5D%20after%3Aabsolute%20after%3A-bottom-%5B2px%5D%20after%3Aleft-0%20after%3Ah-%5B2px%5D%20after%3Aw-full%20after%3Aorigin-left%20after%3Ascale-x-0%20after%3Abg-black%20after%3Atransition-transform%20after%3Aduration-300%20hover%3Aafter%3Ascale-x-100%22%3EHeart%20Jewelry`} className="text-[14px] font-medium text-gray-900 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">Heart Jewelry</Link>
                            <Link href={`/shop-by?filter='%5D%20before%3Aabsolute%20before%3Aleft-%5B-20px%5D%20before%3Aopacity-0%20hover%3Abefore%3Aopacity-100%20before%3Atransition-opacity%20before%3Aduration-300%20before%3Afont-light%20after%3Acontent-%5B''%5D%20after%3Aabsolute%20after%3A-bottom-%5B2px%5D%20after%3Aleft-0%20after%3Ah-%5B2px%5D%20after%3Aw-full%20after%3Aorigin-left%20after%3Ascale-x-0%20after%3Abg-black%20after%3Atransition-transform%20after%3Aduration-300%20hover%3Aafter%3Ascale-x-100%22%3EDragonfly%20Jewelry`} className="text-[14px] font-medium text-gray-900 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">Dragonfly Jewelry</Link>
                          </div>
                          {/* Column 2 */}
                          <div className="flex flex-col gap-4">
                            <h4 className="text-[11px] font-normal text-gray-500 uppercase tracking-wider">Material</h4>
                            <Link href={`/shop-by?filter='%5D%20before%3Aabsolute%20before%3Aleft-%5B-20px%5D%20before%3Aopacity-0%20hover%3Abefore%3Aopacity-100%20before%3Atransition-opacity%20before%3Aduration-300%20before%3Afont-light%20after%3Acontent-%5B''%5D%20after%3Aabsolute%20after%3A-bottom-%5B2px%5D%20after%3Aleft-0%20after%3Ah-%5B2px%5D%20after%3Aw-full%20after%3Aorigin-left%20after%3Ascale-x-0%20after%3Abg-black%20after%3Atransition-transform%20after%3Aduration-300%20hover%3Aafter%3Ascale-x-100%22%3ESilver%20Jewelry`} className="text-[14px] font-medium text-gray-900 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">Silver Jewelry</Link>
                            <Link href={`/shop-by?filter='%5D%20before%3Aabsolute%20before%3Aleft-%5B-20px%5D%20before%3Aopacity-0%20hover%3Abefore%3Aopacity-100%20before%3Atransition-opacity%20before%3Aduration-300%20before%3Afont-light%20after%3Acontent-%5B''%5D%20after%3Aabsolute%20after%3A-bottom-%5B2px%5D%20after%3Aleft-0%20after%3Ah-%5B2px%5D%20after%3Aw-full%20after%3Aorigin-left%20after%3Ascale-x-0%20after%3Abg-black%20after%3Atransition-transform%20after%3Aduration-300%20hover%3Aafter%3Ascale-x-100%22%3EGold%20Jewelry`} className="text-[14px] font-medium text-gray-900 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">Gold Jewelry</Link>
                            <Link href={`/shop-by?filter='%5D%20before%3Aabsolute%20before%3Aleft-%5B-20px%5D%20before%3Aopacity-0%20hover%3Abefore%3Aopacity-100%20before%3Atransition-opacity%20before%3Aduration-300%20before%3Afont-light%20after%3Acontent-%5B''%5D%20after%3Aabsolute%20after%3A-bottom-%5B2px%5D%20after%3Aleft-0%20after%3Ah-%5B2px%5D%20after%3Aw-full%20after%3Aorigin-left%20after%3Ascale-x-0%20after%3Abg-black%20after%3Atransition-transform%20after%3Aduration-300%20hover%3Aafter%3Ascale-x-100%22%3ELeather%20Jewelry`} className="text-[14px] font-medium text-gray-900 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">Leather Jewelry</Link>
                            <Link href={`/shop-by?filter='%5D%20before%3Aabsolute%20before%3Aleft-%5B-20px%5D%20before%3Aopacity-0%20hover%3Abefore%3Aopacity-100%20before%3Atransition-opacity%20before%3Aduration-300%20before%3Afont-light%20after%3Acontent-%5B''%5D%20after%3Aabsolute%20after%3A-bottom-%5B2px%5D%20after%3Aleft-0%20after%3Ah-%5B2px%5D%20after%3Aw-full%20after%3Aorigin-left%20after%3Ascale-x-0%20after%3Abg-black%20after%3Atransition-transform%20after%3Aduration-300%20hover%3Aafter%3Ascale-x-100%22%3ECrystal%20Jewelry`} className="text-[14px] font-medium text-gray-900 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">Crystal Jewelry</Link>
                          </div>
                          {/* Column 3 */}
                          <div className="flex flex-col gap-4">
                            <h4 className="text-[11px] font-normal text-gray-500 uppercase tracking-wider">Featured</h4>
                            <Link href={`/shop-by?filter='%5D%20before%3Aabsolute%20before%3Aleft-%5B-20px%5D%20before%3Aopacity-0%20hover%3Abefore%3Aopacity-100%20before%3Atransition-opacity%20before%3Aduration-300%20before%3Afont-light%20after%3Acontent-%5B''%5D%20after%3Aabsolute%20after%3A-bottom-%5B2px%5D%20after%3Aleft-0%20after%3Ah-%5B2px%5D%20after%3Aw-full%20after%3Aorigin-left%20after%3Ascale-x-0%20after%3Abg-black%20after%3Atransition-transform%20after%3Aduration-300%20hover%3Aafter%3Ascale-x-100%22%3ELimited%20Edition`} className="text-[14px] font-medium text-gray-900 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">Limited Edition</Link>
                            <Link href={`/shop-by?filter='%5D%20before%3Aabsolute%20before%3Aleft-%5B-20px%5D%20before%3Aopacity-0%20hover%3Abefore%3Aopacity-100%20before%3Atransition-opacity%20before%3Aduration-300%20before%3Afont-light%20after%3Acontent-%5B''%5D%20after%3Aabsolute%20after%3A-bottom-%5B2px%5D%20after%3Aleft-0%20after%3Ah-%5B2px%5D%20after%3Aw-full%20after%3Aorigin-left%20after%3Ascale-x-0%20after%3Abg-black%20after%3Atransition-transform%20after%3Aduration-300%20hover%3Aafter%3Ascale-x-100%22%3EBest%20Sellers`} className="text-[14px] font-medium text-gray-900 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">Best Sellers</Link>
                            <Link href={`/shop-by?filter='%5D%20before%3Aabsolute%20before%3Aleft-%5B-20px%5D%20before%3Aopacity-0%20hover%3Abefore%3Aopacity-100%20before%3Atransition-opacity%20before%3Aduration-300%20before%3Afont-light%20after%3Acontent-%5B''%5D%20after%3Aabsolute%20after%3A-bottom-%5B2px%5D%20after%3Aleft-0%20after%3Ah-%5B2px%5D%20after%3Aw-full%20after%3Aorigin-left%20after%3Ascale-x-0%20after%3Abg-black%20after%3Atransition-transform%20after%3Aduration-300%20hover%3Aafter%3Ascale-x-100%22%3ESpecial%20events%20jewelry`} className="text-[14px] font-medium text-gray-900 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">Special events jewelry</Link>
                            <Link href={`/shop-by?filter='%5D%20before%3Aabsolute%20before%3Aleft-%5B-20px%5D%20before%3Aopacity-0%20hover%3Abefore%3Aopacity-100%20before%3Atransition-opacity%20before%3Aduration-300%20before%3Afont-light%20after%3Acontent-%5B''%5D%20after%3Aabsolute%20after%3A-bottom-%5B2px%5D%20after%3Aleft-0%20after%3Ah-%5B2px%5D%20after%3Aw-full%20after%3Aorigin-left%20after%3Ascale-x-0%20after%3Abg-black%20after%3Atransition-transform%20after%3Aduration-300%20hover%3Aafter%3Ascale-x-100%22%3EEveryday%20Jewelry`} className="text-[14px] font-medium text-gray-900 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">Everyday Jewelry</Link>
                            <Link href={`/shop-by?filter='%5D%20before%3Aabsolute%20before%3Aleft-%5B-20px%5D%20before%3Aopacity-0%20hover%3Abefore%3Aopacity-100%20before%3Atransition-opacity%20before%3Aduration-300%20before%3Afont-light%20after%3Acontent-%5B''%5D%20after%3Aabsolute%20after%3A-bottom-%5B2px%5D%20after%3Aleft-0%20after%3Ah-%5B2px%5D%20after%3Aw-full%20after%3Aorigin-left%20after%3Ascale-x-0%20after%3Abg-black%20after%3Atransition-transform%20after%3Aduration-300%20hover%3Aafter%3Ascale-x-100%22%3EUNOde50%20Icons`} className="text-[14px] font-medium text-gray-900 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100">UNOde50 Icons</Link>
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
                const linkClass = "text-[14px] font-medium text-gray-900 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100";
                return (
                  <div key={tab.name} className="flex-1 flex justify-center h-full group">
                    <Link
                      href={tab.href}
                      className="flex-1 flex justify-center items-center h-full text-[13px] xl:text-[14px] text-gray-600 group-hover:text-black font-medium px-1 xl:px-2 whitespace-nowrap transition-colors border-b-[3px] border-transparent group-hover:border-black text-center"
                    >
                      {tab.name}
                    </Link>

                    {/* Mega Menu Dropdown */}
                    <div className="absolute top-[70px] left-0 w-full bg-[#fffbf7] hidden group-hover:flex shadow-md z-50 pt-[32px] pb-[64px] px-[72px]">
                      <div className="flex w-full gap-16">
                        {/* Links Columns */}
                        <div className="flex-1 grid grid-cols-3 gap-8 text-left">
                          {/* Column 1 */}
                          <div className="flex flex-col gap-4">
                            <h4 className="text-[11px] font-normal text-gray-500 uppercase tracking-wider">New in</h4>
                            <Link href="#" className={`${linkClass} flex items-center gap-2`}>
                              Arcadia
                              <span className="bg-[#e6f4f1] text-[14px] px-1 py-0.5 font-normal">New in</span>
                            </Link>
                            <Link href={`/collections?filter=Flutter`} className={linkClass}>Flutter</Link>
                            <Link href={`/collections?filter=Core`} className={linkClass}>Core</Link>
                            <Link href={`/collections?filter=Gravity`} className={linkClass}>Gravity</Link>
                            <Link href={`/collections?filter=Beat`} className={linkClass}>Beat</Link>
                            <Link href={`/collections?filter=Roots`} className={linkClass}>Roots</Link>
                          </div>
                          {/* Column 2 */}
                          <div className="flex flex-col gap-4">
                            <h4 className="text-[11px] font-normal text-gray-500 uppercase tracking-wider">Featured</h4>
                            <Link href={`/collections?filter=Ser%20Unode50`} className={linkClass}>Ser Unode50</Link>
                            <Link href={`/collections?filter=Hazte%20UNO`} className={linkClass}>Hazte UNO</Link>
                          </div>
                          {/* Column 3 */}
                          <div className="flex flex-col gap-4">
                            <h4 className="text-[11px] font-normal text-gray-500 uppercase tracking-wider">Always UNO</h4>
                            <Link href={`/collections?filter=Empowerment%20Collections`} className={linkClass}>Empowerment Collections</Link>
                            <Link href={`/collections?filter=Soulcrafted%20Collections`} className={linkClass}>Soulcrafted Collections</Link>
                            <Link href={`/collections?filter=Feelings%20Collections`} className={linkClass}>Feelings Collections</Link>
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

              if (tab.name === "Bracelets") {
                const linkClass = "text-[14px] font-medium text-gray-900 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100";
                return (
                  <div key={tab.name} className="flex-1 flex justify-center h-full group">
                    <Link
                      href={tab.href}
                      className="flex-1 flex justify-center items-center h-full text-[13px] xl:text-[14px] text-gray-600 group-hover:text-black font-medium px-1 xl:px-2 whitespace-nowrap transition-colors border-b-[3px] border-transparent group-hover:border-black text-center"
                    >
                      {tab.name}
                    </Link>

                    {/* Mega Menu Dropdown */}
                    <div className="absolute top-[70px] left-0 w-full bg-[#fffbf7] hidden group-hover:flex shadow-md z-50 pt-[32px] pb-[64px] px-[72px]">
                      <div className="flex w-full gap-16">
                        {/* Links Columns */}
                        <div className="flex-1 grid grid-cols-3 gap-8 text-left">
                          {/* Column 1 */}
                          <div className="flex flex-col gap-6">
                            <Link href={`/bracelets?filter=Silver%20Bracelets`} className={linkClass}>Silver Bracelets</Link>
                            <Link href={`/bracelets?filter=Gold%20Bracelets`} className={linkClass}>Gold Bracelets</Link>
                            <Link href={`/bracelets?filter=Leather%20Bracelets`} className={linkClass}>Leather Bracelets</Link>
                            <Link href={`/bracelets?filter=Pearl%20Bracelets`} className={linkClass}>Pearl Bracelets</Link>
                            <Link href={`/bracelets?filter=Cord%20Bracelets`} className={linkClass}>Cord Bracelets</Link>
                          </div>
                          {/* Column 2 */}
                          <div className="flex flex-col gap-6">
                            <Link href={`/bracelets?filter=Bangle%20Bracelets`} className={linkClass}>Bangle Bracelets</Link>
                            <Link href={`/bracelets?filter=Cuff%20Bracelets`} className={linkClass}>Cuff Bracelets</Link>
                            <Link href={`/bracelets?filter=Link%20Bracelets`} className={linkClass}>Link Bracelets</Link>
                            <Link href={`/bracelets?filter=Beaded%20Bracelets`} className={linkClass}>Beaded Bracelets</Link>
                          </div>
                          {/* Column 3 */}
                          <div className="flex flex-col gap-6">
                            <Link href={`/bracelets?filter=Bracelets%20for%20Men`} className={linkClass}>Bracelets for Men</Link>
                            <Link href={`/bracelets?filter=Birthstone%20Bracelets`} className={linkClass}>Birthstone Bracelets</Link>
                            <Link href={`/bracelets?filter=Charm%20Bracelets`} className={linkClass}>Charm Bracelets</Link>
                            <Link href={`/bracelets?filter=Best%20Selling%20Bracelets`} className={linkClass}>Best Selling Bracelets</Link>
                          </div>
                        </div>

                        {/* Feature Image */}
                        <div className="w-[450px] xl:w-[600px] shrink-0 flex flex-col gap-4">
                          <h4 className="text-[20px] font-normal text-black">Bracelets</h4>
                          <Image src="/images/1 product.jpg" alt="Bracelets" width={600} height={260} className="w-full h-[260px] object-cover" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              if (tab.name === "Earrings") {
                const linkClass = "text-[14px] font-medium text-gray-900 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100";
                return (
                  <div key={tab.name} className="flex-1 flex justify-center h-full group">
                    <Link
                      href={tab.href}
                      className="flex-1 flex justify-center items-center h-full text-[13px] xl:text-[14px] text-gray-600 group-hover:text-black font-medium px-1 xl:px-2 whitespace-nowrap transition-colors border-b-[3px] border-transparent group-hover:border-black text-center"
                    >
                      {tab.name}
                    </Link>

                    {/* Mega Menu Dropdown */}
                    <div className="absolute top-[70px] left-0 w-full bg-[#fffbf7] hidden group-hover:flex shadow-md z-50 pt-[32px] pb-[64px] px-[72px]">
                      <div className="flex w-full gap-16">
                        {/* Links Columns */}
                        <div className="flex-1 grid grid-cols-3 gap-8 text-left">
                          {/* Column 1 */}
                          <div className="flex flex-col gap-6">
                            <Link href={`/earrings?filter=Silver%20Earrings`} className={linkClass}>Silver Earrings</Link>
                            <Link href={`/earrings?filter=Gold%20Earrings`} className={linkClass}>Gold Earrings</Link>
                            <Link href={`/earrings?filter=Pearl%20Earrings`} className={linkClass}>Pearl Earrings</Link>
                          </div>
                          {/* Column 2 */}
                          <div className="flex flex-col gap-6">
                            <Link href={`/earrings?filter=Hoop%20Earrings`} className={linkClass}>Hoop Earrings</Link>
                            <Link href={`/earrings?filter=Drop%20Earrings`} className={linkClass}>Drop Earrings</Link>
                            <Link href={`/earrings?filter=Stud%20Earrings`} className={linkClass}>Stud Earrings</Link>
                            <Link href={`/earrings?filter=Single%20Earrings`} className={linkClass}>Single Earrings</Link>
                          </div>
                          {/* Column 3 */}
                          <div className="flex flex-col gap-6">
                            <Link href={`/earrings?filter=Heart-Shaped%20Earrings`} className={linkClass}>Heart-Shaped Earrings</Link>
                            <Link href={`/earrings?filter=Best%20selling%20earrings`} className={linkClass}>Best selling earrings</Link>
                            <Link href={`/earrings?filter=Earrings%20for%20Special%20Occasions`} className={linkClass}>Earrings for Special Occasions</Link>
                          </div>
                        </div>

                        {/* Feature Image */}
                        <div className="w-[450px] xl:w-[600px] shrink-0 flex flex-col gap-4">
                          <h4 className="text-[20px] font-normal text-black">Earrings</h4>
                          <Image src="/images/1 product.jpg" alt="Earrings" width={600} height={260} className="w-full h-[260px] object-cover" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              if (tab.name === "Necklaces") {
                const linkClass = "text-[14px] font-medium text-gray-900 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100";
                return (
                  <div key={tab.name} className="flex-1 flex justify-center h-full group">
                    <Link
                      href={tab.href}
                      className="flex-1 flex justify-center items-center h-full text-[13px] xl:text-[14px] text-gray-600 group-hover:text-black font-medium px-1 xl:px-2 whitespace-nowrap transition-colors border-b-[3px] border-transparent group-hover:border-black text-center"
                    >
                      {tab.name}
                    </Link>

                    {/* Mega Menu Dropdown */}
                    <div className="absolute top-[70px] left-0 w-full bg-[#fffbf7] hidden group-hover:flex shadow-md z-50 pt-[32px] pb-[64px] px-[72px]">
                      <div className="flex w-full gap-16">
                        {/* Links Columns */}
                        <div className="flex-1 grid grid-cols-3 gap-8 text-left">
                          {/* Column 1 */}
                          <div className="flex flex-col gap-6">
                            <Link href={`/necklaces?filter=Silver%20Necklaces`} className={linkClass}>Silver Necklaces</Link>
                            <Link href={`/necklaces?filter=Gold%20Necklaces`} className={linkClass}>Gold Necklaces</Link>
                            <Link href={`/necklaces?filter=Leather%20Necklaces`} className={linkClass}>Leather Necklaces</Link>
                            <Link href={`/necklaces?filter=Pearl%20Necklaces`} className={linkClass}>Pearl Necklaces</Link>
                          </div>
                          {/* Column 2 */}
                          <div className="flex flex-col gap-6">
                            <Link href={`/necklaces?filter=Chain%20Necklaces`} className={linkClass}>Chain Necklaces</Link>
                            <Link href={`/necklaces?filter=Multi%20Strand%20Necklaces`} className={linkClass}>Multi Strand Necklaces</Link>
                            <Link href={`/necklaces?filter=Long%20Necklaces`} className={linkClass}>Long Necklaces</Link>
                            <Link href={`/necklaces?filter=Short%20Necklaces`} className={linkClass}>Short Necklaces</Link>
                            <Link href={`/necklaces?filter=Beaded%20Necklaces`} className={linkClass}>Beaded Necklaces</Link>
                          </div>
                          {/* Column 3 */}
                          <div className="flex flex-col gap-6">
                            <Link href={`/necklaces?filter=Pendant%20Necklaces`} className={linkClass}>Pendant Necklaces</Link>
                            <Link href={`/necklaces?filter=Heart-Shaped%20Necklaces`} className={linkClass}>Heart-Shaped Necklaces</Link>
                            <Link href={`/necklaces?filter=Charm%20Necklaces`} className={linkClass}>Charm Necklaces</Link>
                            <Link href={`/necklaces?filter=Necklaces%20for%20Special%20Occasions`} className={linkClass}>Necklaces for Special Occasions</Link>
                            <Link href={`/necklaces?filter=Best%20Selling%20Necklaces`} className={linkClass}>Best Selling Necklaces</Link>
                          </div>
                        </div>

                        {/* Feature Image */}
                        <div className="w-[450px] xl:w-[600px] shrink-0 flex flex-col gap-4">
                          <h4 className="text-[20px] font-normal text-black">Necklaces</h4>
                          <Image src="/images/1 product.jpg" alt="Necklaces" width={600} height={260} className="w-full h-[260px] object-cover" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              if (tab.name === "Rings") {
                const linkClass = "text-[14px] font-medium text-gray-900 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100";
                return (
                  <div key={tab.name} className="flex-1 flex justify-center h-full group">
                    <Link
                      href={tab.href}
                      className="flex-1 flex justify-center items-center h-full text-[13px] xl:text-[14px] text-gray-600 group-hover:text-black font-medium px-1 xl:px-2 whitespace-nowrap transition-colors border-b-[3px] border-transparent group-hover:border-black text-center"
                    >
                      {tab.name}
                    </Link>

                    {/* Mega Menu Dropdown */}
                    <div className="absolute top-[70px] left-0 w-full bg-[#fffbf7] hidden group-hover:flex shadow-md z-50 pt-[32px] pb-[64px] px-[72px]">
                      <div className="flex w-full gap-16">
                        {/* Links Columns */}
                        <div className="flex-1 grid grid-cols-3 gap-8 text-left">
                          {/* Column 1 */}
                          <div className="flex flex-col gap-6">
                            <Link href={`/rings?filter=Silver%20Rings`} className={linkClass}>Silver Rings</Link>
                            <Link href={`/rings?filter=Gold%20Rings`} className={linkClass}>Gold Rings</Link>
                            <Link href={`/rings?filter=Crystal%20Rings`} className={linkClass}>Crystal Rings</Link>
                          </div>
                          {/* Column 2 */}
                          <div className="flex flex-col gap-6">
                            <Link href={`/rings?filter=Minimal%20Rings`} className={linkClass}>Minimal Rings</Link>
                            <Link href={`/rings?filter=Rings%20for%20Special%20Occasions`} className={linkClass}>Rings for Special Occasions</Link>
                            <Link href={`/rings?filter=Best%20Selling%20Rings`} className={linkClass}>Best Selling Rings</Link>
                          </div>
                        </div>

                        {/* Feature Image */}
                        <div className="w-[450px] xl:w-[600px] shrink-0 flex flex-col gap-4">
                          <h4 className="text-[20px] font-normal text-black">Rings</h4>
                          <Image src="/images/1 product.jpg" alt="Rings" width={600} height={260} className="w-full h-[260px] object-cover" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              if (tab.name === "Charms") {
                const linkClass = "text-[14px] font-medium text-gray-900 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100";
                return (
                  <div key={tab.name} className="flex-1 flex justify-center h-full group">
                    <Link
                      href={tab.href}
                      className="flex-1 flex justify-center items-center h-full text-[13px] xl:text-[14px] text-gray-600 group-hover:text-black font-medium px-1 xl:px-2 whitespace-nowrap transition-colors border-b-[3px] border-transparent group-hover:border-black text-center"
                    >
                      {tab.name}
                    </Link>

                    {/* Mega Menu Dropdown */}
                    <div className="absolute top-[70px] left-0 w-full bg-[#fffbf7] hidden group-hover:flex shadow-md z-50 pt-[32px] pb-[64px] px-[72px]">
                      <div className="flex w-full gap-16">
                        {/* Links Columns */}
                        <div className="flex-1 grid grid-cols-3 gap-8 text-left">
                          {/* Column 1 */}
                          <div className="flex flex-col gap-6">
                            <Link href={`/charms?filter=Silver%20Charms`} className={linkClass}>Silver Charms</Link>
                            <Link href={`/charms?filter=Gold%20Charms`} className={linkClass}>Gold Charms</Link>
                            <Link href={`/charms?filter=Gemstone%20Charms`} className={linkClass}>Gemstone Charms</Link>
                          </div>
                          {/* Column 2 */}
                          <div className="flex flex-col gap-6">
                            <Link href={`/charms?filter=Zodiac%20Charms`} className={linkClass}>Zodiac Charms</Link>
                            <Link href={`/charms?filter=Initial%20Charms`} className={linkClass}>Initial Charms</Link>
                            <Link href={`/charms?filter=Hoop%20Charms`} className={linkClass}>Hoop Charms</Link>
                            <Link href={`/charms?filter=Heart-shaped%20charms`} className={linkClass}>Heart-shaped charms</Link>
                          </div>
                        </div>

                        {/* Feature Image */}
                        <div className="w-[450px] xl:w-[600px] shrink-0 flex flex-col gap-4">
                          <h4 className="text-[20px] font-normal text-black">Charms</h4>
                          <Image src="/images/1 product.jpg" alt="Charms" width={600} height={260} className="w-full h-[260px] object-cover" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              if (tab.name === "For him") {
                const linkClass = "text-[14px] font-medium text-gray-900 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100";
                return (
                  <div key={tab.name} className="flex-1 flex justify-center h-full group">
                    <Link
                      href={tab.href}
                      className="flex-1 flex justify-center items-center h-full text-[13px] xl:text-[14px] text-gray-600 group-hover:text-black font-medium px-1 xl:px-2 whitespace-nowrap transition-colors border-b-[3px] border-transparent group-hover:border-black text-center"
                    >
                      {tab.name}
                    </Link>

                    {/* Mega Menu Dropdown */}
                    <div className="absolute top-[70px] left-0 w-full bg-[#fffbf7] hidden group-hover:flex shadow-md z-50 pt-[32px] pb-[64px] px-[72px]">
                      <div className="flex w-full gap-16">
                        {/* Links Columns */}
                        <div className="flex-1 grid grid-cols-3 gap-8 text-left">
                          {/* Column 1 */}
                          <div className="flex flex-col gap-6">
                            <Link href={`/for-him?filter=Bracelets%20for%20men`} className={linkClass}>Bracelets for men</Link>
                            <Link href={`/for-him?filter=Silver%20bracelets%20for%20men`} className={linkClass}>Silver bracelets for men</Link>
                            <Link href={`/for-him?filter=Leather%20bracelets%20for%20men`} className={linkClass}>Leather bracelets for men</Link>
                            <Link href={`/for-him?filter=Chain%20and%20Link%20bracelets`} className={linkClass}>Chain and Link bracelets</Link>
                          </div>
                          {/* Column 2 */}
                          <div className="flex flex-col gap-6">
                            <Link href={`/for-him?filter=Rings%20for%20men`} className={linkClass}>Rings for men</Link>
                            <Link href={`/for-him?filter=Necklaces%20for%20men`} className={linkClass}>Necklaces for men</Link>
                            <Link href={`/for-him?filter=Watches`} className={linkClass}>Watches</Link>
                          </div>
                          {/* Column 3 */}
                          <div className="flex flex-col gap-6">
                            <Link href={`/for-him?filter=Keychains`} className={linkClass}>Keychains</Link>
                            <Link href={`/for-him?filter=Men's%20Best%20Sellers`} className={linkClass}>Men's Best Sellers</Link>
                          </div>
                        </div>

                        {/* Feature Image */}
                        <div className="w-[450px] xl:w-[600px] shrink-0 flex flex-col gap-4">
                          <h4 className="text-[20px] font-normal text-black">For him</h4>
                          <Image src="/images/1 product.jpg" alt="For him" width={600} height={260} className="w-full h-[260px] object-cover" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              if (tab.name === "Outlet") {
                const linkClass = "text-[14px] font-medium text-gray-900 hover:text-black hover:font-semibold w-fit relative transition-transform duration-300 hover:translate-x-[20px] before:content-['>'] before:absolute before:left-[-20px] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:font-light after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 hover:after:scale-x-100";
                return (
                  <div key={tab.name} className="flex-1 flex justify-center h-full group">
                    <Link
                      href={tab.href}
                      className="flex-1 flex justify-center items-center h-full text-[13px] xl:text-[14px] text-[#ac2505] font-medium px-1 xl:px-2 whitespace-nowrap transition-colors border-b-[3px] border-transparent group-hover:border-[#ac2505] text-center"
                    >
                      {tab.name}
                    </Link>

                    {/* Mega Menu Dropdown */}
                    <div className="absolute top-[70px] left-0 w-full bg-[#fffbf7] hidden group-hover:flex shadow-md z-50 pt-[32px] pb-[64px] px-[72px]">
                      <div className="flex w-full gap-16">
                        {/* Links Columns */}
                        <div className="flex-1 grid grid-cols-1 gap-8 text-left max-w-xs">
                          {/* Column 1 */}
                          <div className="flex flex-col gap-6">
                            <Link href={`/outlet?filter=Outlet%20Bracelets`} className={linkClass}>Outlet Bracelets</Link>
                            <Link href={`/outlet?filter=Outlet%20Rings`} className={linkClass}>Outlet Rings</Link>
                            <Link href={`/outlet?filter=Outlet%20Earrings`} className={linkClass}>Outlet Earrings</Link>
                            <Link href={`/outlet?filter=Outlet%20Necklaces`} className={linkClass}>Outlet Necklaces</Link>
                            <Link href={`/outlet?filter=Outlet%20Charms`} className={linkClass}>Outlet Charms</Link>
                          </div>
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
          <div className="flex items-center gap-5 text-gray-800">
            {/* Search */}
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} aria-label="Search" title="Search" className="hover:text-[#ac2505] transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
            </button>
            {/* Store */}
            <button aria-label="Store" title="Store" className="hidden sm:block hover:text-[#ac2505] transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path><path d="M12 3v6"></path></svg>
            </button>
            {/* User */}
            <button aria-label="User" title="Profile" className="hidden sm:block hover:text-[#ac2505] transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </button>
            {/* Heart */}
            <button aria-label="Wishlist" title="Wishlist" className="hover:text-[#ac2505] transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
            </button>
            {/* Bag */}
            <button aria-label="Cart" title="Cart" className="hover:text-[#ac2505] transition-colors relative cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 7V5a4 4 0 0 1 8 0v2"></path>
                <rect x="4" y="7" width="16" height="14" rx="2" ry="2"></rect>
              </svg>
              <span className="absolute -top-[5px] -right-[6px] bg-[#ac2505] text-white text-[10px] font-bold h-[18px] w-[18px] flex items-center justify-center rounded-full leading-none">
                0
              </span>
            </button>

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
                {dummyProducts.filter(p => (p.title + " " + p.description).toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8).map(product => (
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
              {dummyProducts.filter(p => (p.title + " " + p.description).toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                <p className="text-gray-500 text-center py-10">No products found for "{searchQuery}".</p>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}

import Image from "next/image";
import Link from "next/link";

import ProductRow from "@/components/ProductRow";
import { getDb } from "@/lib/db";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("cielora_lang")?.value || "es";
  const isEs = lang === "es";

  const db = await getDb();
  const products = db.products;
  const banners = db.banners;
  const homeCards = db.homeCards || [];
  
  const getBanner = (id: string) => banners.find(b => b.id === id);
  
  const topHero = getBanner("topHero");
  const arcadiaBanner = getBanner("arcadia");
  const midBanner = getBanner("midBanner");
  const flutterBanner = getBanner("flutter");
  const luminisBanner = getBanner("luminis");
  
  const getProductsForBanner = (banner: any) => {
    if (!banner?.linkedProductIds) return [];
    return banner.linkedProductIds
      .map((id: string) => products.find((p: any) => p.id === id))
      .filter(Boolean);
  };
  return (
    <main className="flex min-h-screen flex-col bg-white relative">


      {/* Top Hero Section */}
      {topHero && topHero.visible && (
        <Link href={topHero.link || "#"} className="block w-full group">
          <section className="relative w-full h-[65vh] md:h-[800px] bg-stone-200 cursor-pointer">
            <div className="absolute inset-0 flex items-center justify-end overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img
                  src={topHero.image}
                  alt={topHero.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="z-10 text-right w-full px-4 sm:px-8 lg:px-16 xl:px-24 flex flex-col items-end">
                <h1 className="text-[30px] font-medium text-white drop-shadow-lg uppercase tracking-wider">{isEs && topHero.titleEs ? topHero.titleEs : topHero.title}</h1>
                <span className="text-[16px] font-medium text-white mt-2 group-hover:text-gray-300 transition-colors uppercase tracking-wider">
                  {isEs && topHero.linkLabelEs ? topHero.linkLabelEs : topHero.linkLabel}
                </span>
              </div>
            </div>
          </section>
        </Link>
      )}

      {/* Top Hero Product Row */}
      {topHero && topHero.linkedProductIds && getProductsForBanner(topHero).length > 0 && (
        <ProductRow products={getProductsForBanner(topHero)} collectionName={isEs && topHero.linkedProductsTitleEs ? topHero.linkedProductsTitleEs : (topHero.linkedProductsTitle || "")} className="py-5" />
      )}

      {/* Arcadia Hero Banner */}
      {arcadiaBanner && arcadiaBanner.visible && (
        <Link href={arcadiaBanner.link || "#"} className="block w-full group">
          <section className="relative w-full h-[60vh] md:h-[700px] bg-stone-100 flex items-center overflow-hidden cursor-pointer">
            <div className="absolute inset-0 z-0">
              <img
                src={arcadiaBanner.image}
                alt={arcadiaBanner.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-24 flex flex-col items-end justify-center h-full z-10 relative">
              <h2 className="text-[40px] font-medium text-white leading-none text-right uppercase tracking-wider">
                {isEs && arcadiaBanner.titleEs ? arcadiaBanner.titleEs : arcadiaBanner.title}
              </h2>
              <span className="text-[16px] font-medium text-white group-hover:text-gray-300 transition-colors text-right flex items-center gap-1 mt-2 uppercase tracking-wider">
                {isEs && arcadiaBanner.linkLabelEs ? arcadiaBanner.linkLabelEs : arcadiaBanner.linkLabel}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
              </span>
            </div>
          </section>
        </Link>
      )}

      {/* Arcadia Product Row */}
      {arcadiaBanner && arcadiaBanner.visible && arcadiaBanner.linkedProductIds && getProductsForBanner(arcadiaBanner).length > 0 && (
        <ProductRow products={getProductsForBanner(arcadiaBanner)} collectionName={isEs && arcadiaBanner.linkedProductsTitleEs ? arcadiaBanner.linkedProductsTitleEs : (arcadiaBanner.linkedProductsTitle || "")} className="py-5" />
      )}

      {/* Mid Banner */}
      {midBanner && midBanner.visible && (
        <Link href={midBanner.link || "#"} className="block w-full group z-0">
          <section className="sticky top-0 w-full h-screen bg-stone-800 flex items-center overflow-hidden cursor-pointer">
            <div className="absolute inset-0 z-0">
              <img
                src={midBanner.image}
                alt={midBanner.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-24 flex flex-col items-end justify-center h-full z-10 relative">
              <h2 className="text-[32px] font-medium text-white max-w-md text-right leading-tight uppercase tracking-wider">
                {isEs && midBanner.titleEs ? midBanner.titleEs : midBanner.title}
              </h2>
              <span className="text-[16px] font-medium text-white mt-4 flex items-center gap-1 group-hover:text-gray-300 transition-colors uppercase tracking-wider">
                {isEs && midBanner.linkLabelEs ? midBanner.linkLabelEs : midBanner.linkLabel}
              </span>
            </div>
          </section>
        </Link>
      )}

      <div className="relative z-10 bg-white pt-8">
        {/* Unique Pieces Row */}
        <section className="py-6 px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {homeCards.map((card, index) => (
              <Link key={card.id} href={card.link} className="flex flex-col cursor-pointer group p-2">
                <div className={`aspect-[3/4] ${index % 2 === 0 ? "bg-gray-100 group-hover:bg-gray-200" : "bg-stone-200 group-hover:bg-stone-300"} transition-colors w-full overflow-hidden relative`}>
                  <img src={card.image} alt={card.title} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <p className="text-[20px] font-semibold pt-4 text-gray-900">{isEs && card.titleEs ? card.titleEs : card.title}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Full Face Model Banner */}
        {flutterBanner && flutterBanner.visible && (
          <Link href={flutterBanner.link || "#"} className="block w-full group mt-8">
            <section className="relative w-full h-screen bg-stone-800 flex items-center overflow-hidden cursor-pointer">
              <div className="absolute inset-0 z-0">
                <img
                  src={flutterBanner.image}
                  alt={flutterBanner.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-24 flex flex-col items-end justify-center h-full z-10 relative">
                <span className="text-[16px] font-normal text-white group-hover:text-gray-300 transition-colors uppercase tracking-wider">
                  {isEs && flutterBanner.linkLabelEs ? flutterBanner.linkLabelEs : flutterBanner.linkLabel}
                </span>
              </div>
            </section>
          </Link>
        )}

        {/* Flutter Product Row */}
        {flutterBanner && flutterBanner.visible && flutterBanner.linkedProductIds && getProductsForBanner(flutterBanner).length > 0 && (
          <ProductRow products={getProductsForBanner(flutterBanner)} collectionName={isEs && flutterBanner.linkedProductsTitleEs ? flutterBanner.linkedProductsTitleEs : (flutterBanner.linkedProductsTitle || "")} className="py-5" />
        )}

        {/* Luminis Edition */}
        {luminisBanner && luminisBanner.visible && (
          <Link href={luminisBanner.link || "#"} className="block w-full group">
            <section className="relative w-full h-[60vh] md:h-[700px] bg-stone-900 flex items-center overflow-hidden cursor-pointer">
              <div className="absolute inset-0 z-0">
                <img
                  src={luminisBanner.image}
                  alt={luminisBanner.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-24 flex flex-col items-end justify-center h-full z-10 relative">
                <span className="text-[16px] font-normal text-white group-hover:text-gray-300 transition-colors uppercase tracking-wider">
                  {isEs && luminisBanner.linkLabelEs ? luminisBanner.linkLabelEs : luminisBanner.linkLabel}
                </span>
              </div>
            </section>
          </Link>
        )}
      </div>
    </main>
  );
}

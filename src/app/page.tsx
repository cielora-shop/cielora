import Image from "next/image";
import ProductRow from "@/components/ProductRow";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Top Hero Section (from image) - Partial face and shoulder wearing jewelry */}
      <section className="relative w-full h-[65vh] md:h-[800px] bg-stone-200">
        <div className="absolute inset-0 flex items-center justify-end overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="/images/Banner_GWP_LlaveroDAD_desktop.webp"
              alt="New Arrivals Banner"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="z-10 text-right w-full px-4 sm:px-8 lg:px-16 xl:px-24 flex flex-col items-end">
            <h1 className="text-[30px] font-medium text-white drop-shadow-lg">For dad</h1>
            <a href="#" className="text-[16px] font-medium text-white mt-2 hover:text-gray-300 transition-colors">
              VIEW MEN'S JEWELRY &gt;
            </a>
          </div>
        </div>
      </section>

      {/* First Product Row */}
      <ProductRow collectionName="Silver Collection" price="£ 12,000" label="FREE KEYRING" />

      {/* Arcadia Hero Banner */}
      <section className="relative w-full h-[60vh] md:h-[700px] bg-stone-100 flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/HEADER_NEW-IN_ARCADIA_desktop.jpg"
            alt="Arcadia Banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-24 flex flex-col items-end justify-center h-full z-10 relative">
          <h2 className="text-[40px] font-medium text-white leading-none text-right">
            New in
          </h2>
          <button className="text-[16px] font-medium text-white hover:text-gray-300 transition-colors text-right flex items-center gap-1">
            Discover
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      </section>

      {/* Arcadia Product Row */}
      <ProductRow collectionName="Arcadia" price="£ 14,500" label="BEST SELLER" />

      {/* Mid Banner - Model looking down */}
      <section className="sticky top-0 w-full h-screen bg-stone-800 flex items-center overflow-hidden z-0">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/banner%203.jpg"
            alt="Icons Banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-24 flex flex-col items-end justify-center h-full z-10 relative">
          <h2 className="text-[32px] font-medium text-white max-w-md text-right leading-tight">
            Icons that always <br /> come back
          </h2>
          <button className="text-[16px] font-medium text-white mt-4 flex items-center gap-1 hover:text-gray-300 transition-colors">
            DISCOVER
          </button>
        </div>
      </section>

      <div className="relative z-10 bg-white">
        {/* Unique Pieces Row */}
        <section className="py-6 px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col cursor-pointer group p-2">
            <div className="aspect-[3/4] bg-gray-100 group-hover:bg-gray-200 transition-colors w-full overflow-hidden relative">
              <img src="/images/CATEGORIAS_1.webp" alt="BRACELETS" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <p className="text-[20px] font-semibold pt-4 text-gray-900">BRACELETS</p>
          </div>
          <div className="flex flex-col cursor-pointer group p-2">
            <div className="aspect-[3/4] bg-stone-200 group-hover:bg-stone-300 transition-colors w-full overflow-hidden relative">
              <img src="/images/CATEGORIAS_2.webp" alt="RINGS" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <p className="text-[20px] font-semibold pt-4 text-gray-900">RINGS</p>
          </div>
          <div className="flex flex-col cursor-pointer group p-2">
            <div className="aspect-[3/4] bg-gray-100 group-hover:bg-gray-200 transition-colors w-full overflow-hidden relative">
              <img src="/images/CATEGORIAS_3.webp" alt="NECKLACES" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <p className="text-[20px] font-semibold pt-4 text-gray-900">NECKLACES</p>
          </div>
          <div className="flex flex-col cursor-pointer group p-2">
            <div className="aspect-[3/4] bg-stone-200 group-hover:bg-stone-300 transition-colors w-full overflow-hidden relative">
              <img src="/images/CATEGORIAS_4.webp" alt="EARRINGS" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <p className="text-[20px] font-semibold pt-4 text-gray-900">EARRINGS</p>
          </div>
        </div>
      </section>

      {/* Full Face Model Banner */}
      <section className="relative w-full h-screen bg-stone-800 flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/banner%204.jpg"
            alt="Full Face Model Banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-24 flex flex-col items-end justify-center h-full z-10 relative">
          <a href="#" className="text-[16px] font-normal text-white hover:text-gray-300 transition-colors">
            DISCOVER FLUTTER &gt;
          </a>
        </div>
      </section>

      {/* Last Product Row */}
      <ProductRow collectionName="Classic" price="£ 8,500" label="FREE SHIPPING" />

      {/* Luminis Edition */}
      <section className="relative w-full h-[60vh] md:h-[700px] bg-stone-900 flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/banner%205.webp"
            alt="Luminis Edition Banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-24 flex flex-col items-end justify-center h-full z-10 relative">
          <a href="#" className="text-[16px] font-normal text-white hover:text-gray-300 transition-colors">
            DISCOVER THE COLLECTION &gt;
          </a>
        </div>
      </section>


      </div>
    </main>
  );
}

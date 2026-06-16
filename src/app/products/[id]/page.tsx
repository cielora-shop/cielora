import Image from "next/image";
import ProductRow from "@/components/ProductRow";
import ZoomableImage from "@/components/ZoomableImage";
import SizeSelector from "@/components/SizeSelector";
import DetailsAccordion from "@/components/DetailsAccordion";

export default function ProductDetailPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white pt-16">
      <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16 pb-0">

        {/* Left Side - Image Gallery */}
        <div className="w-full lg:w-[60%] xl:w-[65%] flex flex-col">
          <div className="grid grid-cols-2 gap-1">
            <ZoomableImage src="/images/1 product.jpg" alt="Product Studio 1" />
            <ZoomableImage src="/images/1.2 product.jpg" alt="Product Studio 2" />
            <ZoomableImage src="/images/banner 4.jpg" alt="Model 1" />
            <ZoomableImage src="/images/banner 3.jpg" alt="Model 2" />
            <ZoomableImage src="/images/product 2.jpg" alt="Product Studio 3" />
            <ZoomableImage src="/images/product 2.1.jpg" alt="Model 3" />
          </div>
        </div>

        {/* Right Side - Product Info */}
        <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col relative px-4 sm:px-6 lg:px-0 lg:pr-8 xl:pr-16">
          <div className="pt-4 pb-24">
            {/* Breadcrumbs */}
            <nav className="text-[12px] text-gray-500 mb-6 font-normal">
              <span className="hover:text-black cursor-pointer">Home</span> <span className="mx-1">&gt;</span>
              <span className="hover:text-black cursor-pointer">Bracelets</span> <span className="mx-1">&gt;</span>
              <span className="hover:text-black cursor-pointer">Silver collection</span>
            </nav>

            {/* Title & Price & Ref */}
            <h1 className="text-[20px] font-semibold leading-tight text-gray-900 mb-1 pr-8">
              Margin bracelet with two tubes in silver
            </h1>
            <p className="text-[16px] font-semibold text-gray-900 mb-[20px]">
              £ 165.00
            </p>

            {/* Color Picker */}
            <div className="flex justify-between items-center w-full mb-6">
              <div
                className="w-[24px] h-[24px] rounded-full bg-white cursor-pointer border border-gray-400 flex items-center justify-center"
                aria-label="Silver color option"
              >
                <div className="w-[14px] h-[14px] rounded-full" style={{ backgroundColor: "#C0C0C0" }}></div>
              </div>
              <span className="text-[10px] text-gray-900">Silver</span>
            </div>

            <button className="text-gray-500 hover:text-black absolute right-0 top-[60px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            </button>

            {/* Size Selector */}
            <SizeSelector />

            {/* Promo Banner */}
            <div className="w-full bg-[#f2f4f6] text-gray-800 text-[12px] py-2.5 px-3 mb-4">
              FATHER'S DAY | Free key ring with purchases over £90
            </div>

            {/* Add to Cart & Wishlist */}
            <div className="w-full flex items-center gap-4 mb-6">
              <button className="flex-1 bg-[#8c8888] text-white font-medium text-[16px] py-3 px-4 flex items-center justify-center transition-colors hover:bg-gray-600">
                <span>Add to Cart</span>
              </button>
              <button className="flex-shrink-0 text-gray-500 hover:text-black">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              </button>
            </div>

            {/* Klarna Box */}
            <div className="w-full border border-gray-100 p-4 flex gap-4 mb-6 items-start">
              <div className="bg-[#ffb3c7] text-black font-extrabold text-[15px] px-3 py-1 rounded-[6px] mt-1 tracking-tight">
                Klarna
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] text-gray-900 mb-1">
                  3 payments of <span className="font-bold">£36.66</span> at 0% interest with Klarna
                </span>
                <a href="#" className="text-[14px] text-gray-900 underline decoration-1 underline-offset-2 mb-2 hover:text-gray-600 transition-colors w-fit">Learn more</a>
                <span className="text-[13px] text-gray-500">18+, T&C apply, Credit subject to status.</span>
              </div>
            </div>

            {/* PayPal */}
            <div className="w-full flex items-center gap-2 mb-8 text-[13px] text-gray-800">
              <span className="italic font-bold text-[15px] text-[#003087]">PayPal</span>
              <span>Pay in 3 interest-free payments of £36.67. <a href="#" className="underline text-[#0070ba] hover:text-[#003087]">Learn more</a></span>
            </div>

            {/* Description */}
            <div className="mt-8 mb-6">
              <h3 className="text-[12px] font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-[12px] text-gray-600 leading-[1.6]">
                Original silver-plated metal boy and girl-shaped keychain. 100% handcrafted in Spain with the unique and unmistakable style of UNOde50. Get it and take it with you on any occasion or make a gift to a special person.
              </p>
            </div>

            {/* Details Accordion */}
            <DetailsAccordion />
          </div>
        </div>
      </div>

      <div className="mt-12 pb-6">
        <h2 className="text-[16px] font-medium px-4 sm:px-6 lg:px-8 mb-0">You may also like</h2>
        <div className="w-full">
          <ProductRow collectionName="Silver Collection" price="£ 165.00" label="NEW IN" className="pt-[20px] pb-0" />
        </div>
      </div>

      <div className="pt-6 pb-16">
        <h2 className="text-[16px] font-medium px-4 sm:px-6 lg:px-8 mb-0">Others also bought</h2>
        <div className="w-full">
          <ProductRow collectionName="Silver Collection" price="£ 165.00" label="BEST SELLER" className="pt-[20px] pb-16" />
        </div>
      </div>
    </main>
  );
}

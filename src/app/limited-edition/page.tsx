import Image from 'next/image';
import Link from 'next/link';

export default function LimitedEditionPage() {
  return (
    <div className="relative w-full min-h-screen">
      {/* Fixed full screen image container */}
      <div className="fixed top-0 left-0 w-full h-screen -z-10">
        <Image
          src="/images/HEADER_NEW-IN_ARCADIA_desktop.jpg"
          alt="Limited Edition Arcadia"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Transparent spacer to allow scrolling past the fixed image */}
      <div className="h-screen w-full bg-transparent"></div>

      {/* Content that slides over the image */}
      <div className="relative z-10 bg-white w-full flex flex-col items-center">
        {/* Intro Section */}
        <div className="w-full max-w-5xl px-8 pt-20 pb-[36px] text-center">
          <h1 className="text-[20px] font-bold tracking-widest mb-6 uppercase">LIMITED EDITIONS</h1>
          <div className="flex flex-col gap-[4px]">
            <p className="text-gray-700 text-[14px]">
              Imagine a collectible object transformed into a piece of jewelry. A memory, a decision, a work of art.
            </p>
            <p className="text-gray-700 text-[14px]">
              Each design is produced in a <span className="font-semibold">limited edition of 50 units</span>, numbered, handcrafted in Spain, and selectively distributed around the world.
            </p>
          </div>
        </div>

        {/* ONLY YOU Section */}
        <div className="sticky top-[80px] w-full flex justify-center bg-white z-10 pb-24 pt-4">
          <div className="w-full">
            <Link href="/products/1" className="grid grid-cols-1 md:grid-cols-2 gap-0 items-center group cursor-pointer">
              {/* Left side: Image */}
              <div className="relative w-full aspect-square bg-gray-100">
                <Image
                  src="/images/product 2.jpg" 
                  alt="Only You Necklace"
                  fill
                  className="object-cover object-center"
                />
              </div>

              {/* Right side: Text */}
              <div className="flex flex-col items-center justify-center text-center px-4 md:px-12 py-12 md:py-0 md:aspect-square">
                <h2 className="text-[20px] font-bold tracking-widest mb-[16px]">ONLY YOU</h2>
                <p className="text-gray-600 text-[14px] leading-relaxed mb-8">
                  Like a chain of decisions that need no explanation, each metal bead acts as an independent artistic object, with irregular textures that ensure no two elements will ever be identical. A sculptural ensemble designed to be showcased as a piece of handcrafted luxury.
                </p>
                <span className="text-black font-semibold uppercase tracking-wider text-sm group-hover:underline underline-offset-4">
                  Discover Only You &gt;&gt;
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Second Product Section */}
        <div className="sticky top-[80px] w-full flex justify-center bg-white z-20 pb-24">
          <div className="w-full">
            <Link href="/products/2" className="grid grid-cols-1 md:grid-cols-2 gap-0 items-center group cursor-pointer">
              {/* Left side: Text */}
              <div className="flex flex-col items-center justify-center text-center px-4 md:px-12 py-12 md:py-0 order-2 md:order-1 md:aspect-square">
                <h2 className="text-[20px] font-bold tracking-widest mb-[16px]">ARCADIA</h2>
                <p className="text-gray-600 text-[14px] leading-relaxed mb-8">
                  Another stunning piece of handcrafted jewelry, reflecting the perfect blend of tradition and modernity. Each element tells a unique story, carefully designed to highlight the beauty and elegance of its wearer.
                </p>
                <span className="text-black font-semibold uppercase tracking-wider text-sm group-hover:underline underline-offset-4">
                  Discover Arcadia &gt;&gt;
                </span>
              </div>

              {/* Right side: Image */}
              <div className="relative w-full aspect-square bg-gray-100 order-1 md:order-2">
                <Image
                  src="/images/product 3.jpg" 
                  alt="Arcadia Necklace"
                  fill
                  className="object-cover object-center"
                />
              </div>
            </Link>
          </div>
        </div>

        {/* Third Product Section */}
        <div className="relative w-full flex justify-center bg-white z-30 pb-24">
          <div className="w-full">
            <Link href="/products/3" className="grid grid-cols-1 md:grid-cols-2 gap-0 items-center group cursor-pointer">
              {/* Left side: Image */}
              <div className="relative w-full aspect-square bg-gray-100">
                <Image
                  src="/images/product 4.jpg" 
                  alt="Eternity Collection"
                  fill
                  className="object-cover object-center"
                />
              </div>

              {/* Right side: Text */}
              <div className="flex flex-col items-center justify-center text-center px-4 md:px-12 py-12 md:py-0 md:aspect-square">
                <h2 className="text-[20px] font-bold tracking-widest mb-[16px]">ETERNITY</h2>
                <p className="text-gray-600 text-[14px] leading-relaxed mb-8">
                  A timeless piece crafted to capture the essence of forever. This elegant design combines classic beauty with modern sophistication, making it the perfect statement of enduring style.
                </p>
                <span className="text-black font-semibold uppercase tracking-wider text-sm group-hover:underline underline-offset-4">
                  Discover Eternity &gt;&gt;
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

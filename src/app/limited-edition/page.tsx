import Image from 'next/image';
import Link from 'next/link';
import { getDb } from "@/lib/db";
import { cookies } from "next/headers";

export default async function LimitedEditionPage() {
  const cookieStore = await cookies();
  const isEs = cookieStore.get('cielora_lang')?.value !== 'en';
  const db = await getDb();
  const settings = db.limitedEditionSettings;
  const limitedProducts = db.products.filter(p => p.isLimitedEdition);

  return (
    <div className="relative w-full min-h-screen">
      {/* Fixed full screen image container */}
      <div className="fixed top-0 left-0 w-full h-screen -z-10 bg-gray-100">
        {(settings?.bannerImage || "").match(/\.(mp4|webm|ogg)$/i) ? (
          <video
            src={settings?.bannerImage}
            autoPlay
            loop
            muted
            playsInline
            className="object-cover object-center w-full h-full"
          />
        ) : (
          <Image
            src={settings?.bannerImage || "/images/HEADER_NEW-IN_ARCADIA_desktop.jpg"}
            alt="Limited Edition"
            fill
            className="object-cover object-center"
            priority
          />
        )}
      </div>

      {/* Transparent spacer to allow scrolling past the fixed image */}
      <div className="h-screen w-full bg-transparent"></div>

      {/* Content that slides over the image */}
      <div className="relative z-10 bg-white w-full flex flex-col items-center">
        {/* Intro Section */}
        <div className="w-full max-w-5xl px-8 pt-20 pb-[36px] text-center">
          <h1 className="text-[20px] font-bold tracking-widest mb-6 uppercase">{isEs ? (settings?.introTitleEs || "EDICIONES LIMITADAS") : (settings?.introTitle || "LIMITED EDITIONS")}</h1>
          <div className="flex flex-col gap-[4px]">
            <p className="text-gray-700 text-[14px]">
              {isEs && settings?.introText1Es ? settings.introText1Es : settings?.introText1}
            </p>
            <p className="text-gray-700 text-[14px]">
              {isEs && settings?.introText2Es ? settings.introText2Es : settings?.introText2}
            </p>
          </div>
        </div>

        {/* Dynamic Products Sections */}
        {limitedProducts.map((prod, index) => {
          const isImageLeft = index % 2 === 0;

          return (
            <div key={prod.id} className={`w-full flex justify-center bg-white ${index === limitedProducts.length - 1 ? 'relative z-30 pb-24' : 'sticky top-[80px] z-10 pb-24'}${index === 0 ? ' pt-4' : ''}`}>
              <div className="w-full">
                <Link href={`/products/${prod.id}`} className="grid grid-cols-1 md:grid-cols-2 gap-0 items-center group cursor-pointer">
                  {isImageLeft ? (
                    <div className="relative w-full aspect-square bg-gray-100">
                      <Image
                        src={prod.images?.silver?.img1 || "/placeholder.jpg"} 
                        alt={prod.title}
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center px-4 md:px-12 py-12 md:py-0 order-2 md:order-1 md:aspect-square">
                      <h2 className="text-[20px] font-bold tracking-widest mb-[16px] uppercase">{isEs && prod.showcaseTitleEs ? prod.showcaseTitleEs : (prod.showcaseTitle || (isEs && prod.titleEs ? prod.titleEs : prod.title))}</h2>
                      <p className="text-gray-600 text-[14px] leading-relaxed mb-8">
                        {isEs && prod.showcaseTextEs ? prod.showcaseTextEs : (prod.showcaseText || (isEs && prod.descriptionEs ? prod.descriptionEs : prod.description))}
                      </p>
                      <span className="text-black font-semibold uppercase tracking-wider text-sm group-hover:underline underline-offset-4">
                        {isEs ? "Descubrir" : "Discover"} {isEs && prod.showcaseTitleEs ? prod.showcaseTitleEs : (prod.showcaseTitle || (isEs && prod.titleEs ? prod.titleEs : prod.title))} &gt;&gt;
                      </span>
                    </div>
                  )}

                  {isImageLeft ? (
                    <div className="flex flex-col items-center justify-center text-center px-4 md:px-12 py-12 md:py-0 md:aspect-square">
                      <h2 className="text-[20px] font-bold tracking-widest mb-[16px] uppercase">{isEs && prod.showcaseTitleEs ? prod.showcaseTitleEs : (prod.showcaseTitle || (isEs && prod.titleEs ? prod.titleEs : prod.title))}</h2>
                      <p className="text-gray-600 text-[14px] leading-relaxed mb-8">
                        {isEs && prod.showcaseTextEs ? prod.showcaseTextEs : (prod.showcaseText || (isEs && prod.descriptionEs ? prod.descriptionEs : prod.description))}
                      </p>
                      <span className="text-black font-semibold uppercase tracking-wider text-sm group-hover:underline underline-offset-4">
                        {isEs ? "Descubrir" : "Discover"} {isEs && prod.showcaseTitleEs ? prod.showcaseTitleEs : (prod.showcaseTitle || (isEs && prod.titleEs ? prod.titleEs : prod.title))} &gt;&gt;
                      </span>
                    </div>
                  ) : (
                    <div className="relative w-full aspect-square bg-gray-100 order-1 md:order-2">
                      <Image
                        src={prod.images?.silver?.img1 || "/placeholder.jpg"} 
                        alt={prod.title}
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                  )}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

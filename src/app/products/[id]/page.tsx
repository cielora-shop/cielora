import Image from "next/image";
import ProductRow from "@/components/ProductRow";
import ZoomableImage from "@/components/ZoomableImage";
import SizeSelector from "@/components/SizeSelector";
import DetailsAccordion from "@/components/DetailsAccordion";
import AddToCartButton from "@/components/AddToCartButton";
import WishlistButton from "@/components/WishlistButton";
import ProductInteractiveView from "@/components/ProductInteractiveView";
import { getDb } from "@/lib/db";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const db = await getDb();
  const product = db.products.find(p => String(p.id) === resolvedParams.id);
  const settings = db.settings;
  
  if (!product) {
    notFound();
  }

  // Calculate installments
  const installmentsCount = settings.installmentsCount || 3;
  const installmentValue = (product.priceValue / installmentsCount).toFixed(2);

  return (
    <main className="flex flex-col min-h-screen bg-white pt-16">
      <ProductInteractiveView product={product} settings={settings} />

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

export interface Product {
  id: string | number;
  title: string;
  description: string;
  price: string;
  priceValue: number;
  label?: string;
  labelColor?: string;
  bottomLabel?: string;
  colors: ("silver" | "gold")[];
  images: {
    silver?: { img1: string, img2: string };
    gold?: { img1: string, img2: string };
  };
  galleryImages: string[];
  collectionName?: string;
  category?: string;
}

// Generate the bulk of the products dynamically, but we'll override specific ones.
const generatedProducts: Product[] = Array.from({ length: 48 }).map((_, i) => {
  const isSilver = i % 3 === 0;
  const isGold = i % 3 === 1;
  const isBoth = i % 3 === 2;
  
  const colors: ("silver" | "gold")[] = isBoth ? ["silver", "gold"] : isSilver ? ["silver"] : ["gold"];
  const productColors: string[] = colors.map(c => c === "silver" ? "Silver" : "Gold");
  if (i % 4 === 0) productColors.push("Black");
  
  let label = undefined;
  let labelColor = undefined;
  let bottomLabel = undefined;
  
  if (i === 0 || i === 5) {
    label = "New in";
    labelColor = "#cde6ec";
  } else if (i === 3 || i === 8) {
    label = "Best seller";
    labelColor = "#e1bbff";
  } 
  
  if (i === 1 || i === 6) {
    bottomLabel = "Free Keyring";
  }

  const priceValue = 100 + i * 15;
  
  const categoryOptions = ["Bracelets", "Charm", "Necklaces", "Earrings", "Rings"];
  const sizeOptions = ["9", "12", "U", "S", "M"];
  const platingOptions = ["18K gold-plated", "Sterling silver-plated"];
  const componentOptions = ["Crafted Crystal", "Natural Stone", "Shell Pearl"];
  const leatherOptions = ["Yes", "No"];
  
  const category = categoryOptions[i % categoryOptions.length];
  const size = sizeOptions[i % sizeOptions.length];
  const plating = platingOptions[i % platingOptions.length];
  const component = componentOptions[i % componentOptions.length];
  const leather = leatherOptions[i % leatherOptions.length];
  
  const extras = i % 5 === 0 ? "accessory for women" : i % 5 === 1 ? "men's dragonfly" : i % 5 === 2 ? "heart best seller" : "";

  return {
    id: String(i + 1), // use 1-based indexing
    title: category,
    description: `Beautiful ${category} made of ${component} with ${plating}. Leather: ${leather}. Size: ${size}. Colors: ${productColors.join(', ')}. ${extras}`,
    price: `£ ${priceValue.toFixed(2)}`,
    priceValue,
    label,
    labelColor,
    bottomLabel,
    colors,
    category,
    images: {
      silver: { 
        img1: i === 0 ? "/images/1 product.jpg" : `/images/product ${i + 1}.jpg`, 
        img2: i === 0 ? "/images/1.2 product.jpg" : `/images/product ${i + 1}.1.jpg` 
      },
      gold: { 
        img1: i === 0 ? "/images/1 product.jpg" : `/images/product ${i + 1}.jpg`, 
        img2: i === 0 ? "/images/1.2 product.jpg" : `/images/product ${i + 1}.1.jpg` 
      }
    },
    galleryImages: [
      i === 0 ? "/images/1 product.jpg" : `/images/product ${i + 1}.jpg`,
      i === 0 ? "/images/1.2 product.jpg" : `/images/product ${i + 1}.1.jpg`,
      "/images/banner 4.jpg",
      "/images/banner 3.jpg"
    ]
  };
});

// Now we override the first two products which were customized in previous steps
const allProducts = [...generatedProducts];

// 1. "Silver Earring" Customization (ID "1")
allProducts[0] = {
  ...allProducts[0],
  title: "Silver Earring",
  category: "Earrings",
  price: "£ 165.00",
  priceValue: 165,
  images: {
    ...allProducts[0].images,
    silver: {
      img1: "/images/product 1.2.PNG",
      img2: "/images/product 1.PNG",
    }
  },
  galleryImages: [
    "/images/product 1.2.PNG",
    "/images/product 1.PNG",
    "/images/product 1.3.png"
  ]
};

// 2. Second Arcadia Card Customization (ID "2")
allProducts[1] = {
  ...allProducts[1],
  title: "Silver Fish shape earings",
  category: "Earrings",
  images: {
    ...allProducts[1].images,
    silver: {
      img1: "/images/product 7.PNG",
      img2: "/images/product 7.2.PNG",
    }
  },
  galleryImages: [
    "/images/product 7.PNG",
    "/images/product 7.2.PNG",
    "/images/product 7.3.PNG"
  ]
};

export const products = allProducts;

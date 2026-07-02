import clientPromise from "./mongodb";
import { products as initialProducts } from "../data/products";

// Define TypeScript interfaces for our DB models
export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  priceValue: number;
  label?: string;
  labelColor?: string;
  bottomLabel?: string;
  colors: ("silver" | "gold")[];
  images: {
    silver?: { img1: string; img2: string; galleryImages?: string[] };
    gold?: { img1: string; img2: string; galleryImages?: string[] };
  };
  galleryImages?: string[];
  collectionName?: string;
  category?: string;
  sizes: string[]; // customizable sizes
  specs: {         // accordion specs
    itemCode: string;
    gender: string;
    plating: string;
    material: string;
    color: string;
    minLength: string;
    [key: string]: string;
  };
  inventory: number; // For low stock alerts
  isLimitedEdition?: boolean;
  showcaseTitle?: string;
  showcaseText?: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
  phone: string;
  email: string;
  googleMapsUrl: string;
  hideDirectionsButton?: boolean;
}

export interface Banner {
  id: string;
  name: string; // Identifier e.g. "topHero", "arcadia", "midBanner", "flutter", "luminis"
  image: string;
  title: string;
  subtitle?: string;
  link: string;
  linkLabel: string;
  visible: boolean;
  linkedProductsTitle?: string;
  linkedProductIds?: (string | null)[];
}

export interface HomeCard {
  id: string;
  title: string;
  image: string;
  link: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface OrderItem {
  id: string;
  title: string;
  price: string;
  priceValue: number;
  quantity: number;
  color: string;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  courier: string;
  trackingCode: string;
  date: string;
}

export interface MegaMenuLink {
  name: string;
  href: string;
  badge?: string;
}

export interface MegaMenuColumn {
  title: string;
  links: MegaMenuLink[];
}

export interface MegaMenu {
  columns: MegaMenuColumn[];
  featureTitle?: string;
  featureImage?: string;
}

export interface NavbarTab {
  name: string;
  href: string;
  megaMenu?: MegaMenu;
  groupFilters?: string[];
  isHidden?: boolean;
}

export interface GlobalSettings {
  klarnaEnabled: boolean;
  paypalEnabled: boolean;
  installmentsCount: number;
  taxPercentage: number;
  legalDisclaimer: string;
  shippingReturns: {
    freeReturnsDays: number;
    freeDeliveryText: string;
    helpLink: string;
    handcraftedText: string;
  };
}

export interface LimitedEditionSettings {
  bannerImage: string;
  introTitle: string;
  introText1: string;
  introText2: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  isHidden: boolean;
  iconSvg: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: "owner" | "admin";
}

export interface DbSchema {
  products: Product[];
  stores: Store[];
  banners: Banner[];
  homeCards: HomeCard[];
  labels: Label[];
  orders: Order[];
  navbarTabs: NavbarTab[];
  settings: GlobalSettings;
  limitedEditionSettings: LimitedEditionSettings;
  admins: AdminUser[];
  socialLinks: SocialLink[];
}



// Default initial state
function getInitialDbState(): DbSchema {
  const formattedProducts: Product[] = initialProducts.map((p, index) => {
    // Add default sizes
    const sizes = p.category === "Rings" ? ["5", "6", "7", "8", "9"] : ["S", "M", "L"];
    
    // Add default specs
    const plating = p.description.includes("18K gold-plated") ? "18K Gold Plated" : "Sterling Silver";
    const specs = {
      itemCode: `LLA${String(1000 + Number(p.id)).padStart(4, "0")}`,
      gender: p.description.includes("men's") ? "Male" : "Female",
      plating: plating,
      material: p.description.includes("Leather") ? "Leather & Metal" : "Metal",
      color: p.colors.join(" / "),
      minLength: "4 cm",
    };

    return {
      id: String(p.id),
      title: p.title,
      description: p.description,
      price: p.price,
      priceValue: p.priceValue,
      label: p.label,
      labelColor: p.labelColor,
      bottomLabel: p.bottomLabel,
      colors: p.colors,
      images: p.images as any,
      galleryImages: p.galleryImages,
      collectionName: p.collectionName || (index < 8 ? "Arcadia" : index < 16 ? "Silver Collection" : "Classic"),
      category: p.category || "Jewelry",
      sizes,
      specs,
      inventory: 10 + (index % 5), // default stock
    };
  });

  // Inject Limited Edition Products
  formattedProducts.push(
    {
      id: "le-1",
      title: "Only You Necklace",
      description: "Like a chain of decisions that need no explanation, each metal bead acts as an independent artistic object, with irregular textures that ensure no two elements will ever be identical. A sculptural ensemble designed to be showcased as a piece of handcrafted luxury.",
      price: "£ 215.00",
      priceValue: 215,
      colors: ["silver"],
      images: { silver: { img1: "/images/product 2.jpg", img2: "/images/product 2.jpg" } },
      collectionName: "Limited Edition",
      category: "Necklaces",
      sizes: ["S", "M", "L"],
      specs: { itemCode: "LE1001", gender: "Female", plating: "Sterling Silver", material: "Metal", color: "Silver", minLength: "4 cm" },
      inventory: 50,
      isLimitedEdition: true,
      showcaseTitle: "ONLY YOU",
      showcaseText: "Like a chain of decisions that need no explanation, each metal bead acts as an independent artistic object, with irregular textures that ensure no two elements will ever be identical. A sculptural ensemble designed to be showcased as a piece of handcrafted luxury."
    },
    {
      id: "le-2",
      title: "Arcadia Necklace",
      description: "Another stunning piece of handcrafted jewelry, reflecting the perfect blend of tradition and modernity. Each element tells a unique story, carefully designed to highlight the beauty and elegance of its wearer.",
      price: "£ 195.00",
      priceValue: 195,
      colors: ["silver"],
      images: { silver: { img1: "/images/product 3.jpg", img2: "/images/product 3.jpg" } },
      collectionName: "Limited Edition",
      category: "Necklaces",
      sizes: ["S", "M", "L"],
      specs: { itemCode: "LE1002", gender: "Female", plating: "Sterling Silver", material: "Metal", color: "Silver", minLength: "4 cm" },
      inventory: 50,
      isLimitedEdition: true,
      showcaseTitle: "ARCADIA",
      showcaseText: "Another stunning piece of handcrafted jewelry, reflecting the perfect blend of tradition and modernity. Each element tells a unique story, carefully designed to highlight the beauty and elegance of its wearer."
    },
    {
      id: "le-3",
      title: "Eternity Collection",
      description: "A timeless piece crafted to capture the essence of forever. This elegant design combines classic beauty with modern sophistication, making it the perfect statement of enduring style.",
      price: "£ 250.00",
      priceValue: 250,
      colors: ["silver"],
      images: { silver: { img1: "/images/product 4.jpg", img2: "/images/product 4.jpg" } },
      collectionName: "Limited Edition",
      category: "Necklaces",
      sizes: ["S", "M", "L"],
      specs: { itemCode: "LE1003", gender: "Female", plating: "Sterling Silver", material: "Metal", color: "Silver", minLength: "4 cm" },
      inventory: 50,
      isLimitedEdition: true,
      showcaseTitle: "ETERNITY",
      showcaseText: "A timeless piece crafted to capture the essence of forever. This elegant design combines classic beauty with modern sophistication, making it the perfect statement of enduring style."
    }
  );

  const stores: Store[] = [
    {
      id: "1",
      name: "Cielora Flagship Store",
      address: "123 Fashion Avenue",
      city: "Amsterdam",
      postcode: "1012 AB",
      country: "The Netherlands",
      phone: "+31 20 123 4567",
      email: "store@cielora.com",
      googleMapsUrl: "https://maps.google.com/maps?q=52.37307,4.89264+(Cielora+Flagship+Store)&t=&z=16&ie=UTF8&iwloc=B&output=embed"
    },
    {
      id: "2",
      name: "Cielora London Boutique",
      address: "45 Regent St",
      city: "London",
      postcode: "W1B 4DY",
      country: "United Kingdom",
      phone: "+44 20 7946 0958",
      email: "london@cielora.com",
      googleMapsUrl: "https://maps.google.com/maps?q=51.509865,-0.134882+(Cielora+London+Boutique)&t=&z=16&ie=UTF8&iwloc=B&output=embed"
    }
  ];

  const getPaddedIds = (coll: string) => {
    const ids = formattedProducts.filter(p => p.collectionName === coll).map(p => p.id).slice(0, 8);
    return Array.from({ length: 8 }, (_, i) => ids[i] || null);
  };

  const banners: Banner[] = [
    {
      id: "topHero",
      name: "Top Hero Section",
      image: "/images/Banner_GWP_LlaveroDAD_desktop.webp",
      title: "For dad",
      subtitle: "",
      link: "/for-him",
      linkLabel: "VIEW MEN'S JEWELRY >",
      visible: true,
      linkedProductsTitle: "Silver Collection",
      linkedProductIds: getPaddedIds("Silver Collection")
    },
    {
      id: "arcadia",
      name: "Arcadia Section",
      image: "/images/HEADER_NEW-IN_ARCADIA_desktop.jpg",
      title: "New in",
      subtitle: "",
      link: "/collections?filter=Arcadia",
      linkLabel: "Discover",
      visible: true,
      linkedProductsTitle: "Arcadia",
      linkedProductIds: getPaddedIds("Arcadia")
    },
    {
      id: "midBanner",
      name: "Sticky Icons Section",
      image: "/images/banner 3.jpg",
      title: "Icons that always come back",
      subtitle: "",
      link: "/shop-by?filter=Cielora+Icons",
      linkLabel: "DISCOVER",
      visible: true
    },
    {
      id: "flutter",
      name: "Flutter Section",
      image: "/images/banner 4.jpg",
      title: "Discover Flutter",
      subtitle: "",
      link: "/collections?filter=Flutter",
      linkLabel: "DISCOVER FLUTTER >",
      visible: true,
      linkedProductsTitle: "Classic",
      linkedProductIds: getPaddedIds("Classic")
    },
    {
      id: "luminis",
      name: "Luminis Edition Section",
      image: "/images/banner 5.webp",
      title: "Luminis Edition",
      subtitle: "",
      link: "/collections?filter=Luminis+Edition",
      linkLabel: "DISCOVER THE COLLECTION >",
      visible: true
    }
  ];

  const homeCards: HomeCard[] = [
    { id: "card1", title: "BRACELETS", image: "/images/CATEGORIAS_1.webp", link: "/bracelets" },
    { id: "card2", title: "RINGS", image: "/images/CATEGORIAS_2.webp", link: "/rings" },
    { id: "card3", title: "NECKLACES", image: "/images/CATEGORIAS_3.webp", link: "/necklaces" },
    { id: "card4", title: "EARRINGS", image: "/images/CATEGORIAS_4.webp", link: "/earrings" }
  ];

  const labels: Label[] = [
    { id: "1", name: "New in", color: "#cde6ec" },
    { id: "2", name: "Best seller", color: "#e1bbff" },
    { id: "3", name: "Free Keyring", color: "#7ce5bf" },
    { id: "4", name: "Free Shipping", color: "#ffb3c7" }
  ];

  const navbarTabs: NavbarTab[] = [
    { name: "Limited Edition", href: "/limited-edition" },
    { 
      name: "Shop by", 
      href: "/shop-by",
      groupFilters: ["Women's jewelry", "Men's jewelry", "Accesories", "Heart Jewelry", "Dragonfly Jewelry", "Silver Jewelry", "Gold Jewelry", "Leather Jewelry", "Crystal Jewelry", "Limited Edition", "Best Sellers", "Special events jewerly", "Everyday Jewelry", "Genderless jewelry", "Cielora Icons", "Gold and silver jewelry"],
      megaMenu: {
        featureImage: "/images/1 product.jpg",
        columns: [
          {
            title: "Type",
            links: [
              { name: "Women's jewelry", href: "/shop-by?filter=Women's jewelry" },
              { name: "Men's jewelry", href: "/shop-by?filter=Men's jewelry" },
              { name: "Accessories", href: "/shop-by?filter=Accessories" },
              { name: "Heart Jewelry", href: "/shop-by?filter=Heart Jewelry" },
              { name: "Dragonfly Jewelry", href: "/shop-by?filter=Dragonfly Jewelry" }
            ]
          },
          {
            title: "Material",
            links: [
              { name: "Silver Jewelry", href: "/shop-by?filter=Silver Jewelry" },
              { name: "Gold Jewelry", href: "/shop-by?filter=Gold Jewelry" },
              { name: "Leather Jewelry", href: "/shop-by?filter=Leather Jewelry" },
              { name: "Crystal Jewelry", href: "/shop-by?filter=Crystal Jewelry" }
            ]
          },
          {
            title: "Featured",
            links: [
              { name: "Limited Edition", href: "/shop-by?filter=Limited Edition" },
              { name: "Best Sellers", href: "/shop-by?filter=Best Sellers" },
              { name: "Special events jewelry", href: "/shop-by?filter=Special events jewelry" },
              { name: "Everyday Jewelry", href: "/shop-by?filter=Everyday Jewelry" },
              { name: "Cielora Icons", href: "/shop-by?filter=Cielora Icons" }
            ]
          }
        ]
      }
    },
    { 
      name: "Collections", 
      href: "/collections",
      groupFilters: ["Arcadia", "Flutter", "Core", "Gravity", "Beat", "Roots", "Empowerment Collections", "Soulcrafted Collections"],
      megaMenu: {
        featureTitle: "Cielora Collections",
        featureImage: "/images/1 product.jpg",
        columns: [
          {
            title: "New in",
            links: [
              { name: "Arcadia", href: "#", badge: "New in" },
              { name: "Flutter", href: "/collections?filter=Flutter" },
              { name: "Core", href: "/collections?filter=Core" },
              { name: "Gravity", href: "/collections?filter=Gravity" },
              { name: "Beat", href: "/collections?filter=Beat" },
              { name: "Roots", href: "/collections?filter=Roots" }
            ]
          },
          {
            title: "Featured",
            links: [
              { name: "Discover Cielora", href: "/collections?filter=Discover Cielora" },
              { name: "Join Cielora", href: "/collections?filter=Join Cielora" }
            ]
          },
          {
            title: "Always Cielora",
            links: [
              { name: "Empowerment Collections", href: "/collections?filter=Empowerment Collections" },
              { name: "Soulcrafted Collections", href: "/collections?filter=Soulcrafted Collections" },
              { name: "Feelings Collections", href: "/collections?filter=Feelings Collections" }
            ]
          }
        ]
      }
    },
    { 
      name: "Bracelets", 
      href: "/bracelets",
      groupFilters: ["Silver Bracelets", "Gold Bracelets", "Leather Bracelets", "Pearl Bracelets", "Cord Bracelets", "Bangle Bracelets", "Cuff Bracelets", "Link Bracelets", "Beaded Bracelets", "Bracelets for Men", "Charm Bracelets", "Best Selling Bracelets"],
      megaMenu: {
        featureTitle: "Bracelets",
        featureImage: "/images/1 product.jpg",
        columns: [
          {
            title: "",
            links: [
              { name: "Silver Bracelets", href: "/bracelets?filter=Silver Bracelets" },
              { name: "Gold Bracelets", href: "/bracelets?filter=Gold Bracelets" },
              { name: "Leather Bracelets", href: "/bracelets?filter=Leather Bracelets" },
              { name: "Pearl Bracelets", href: "/bracelets?filter=Pearl Bracelets" },
              { name: "Cord Bracelets", href: "/bracelets?filter=Cord Bracelets" }
            ]
          },
          {
            title: "",
            links: [
              { name: "Bangle Bracelets", href: "/bracelets?filter=Bangle Bracelets" },
              { name: "Cuff Bracelets", href: "/bracelets?filter=Cuff Bracelets" },
              { name: "Link Bracelets", href: "/bracelets?filter=Link Bracelets" },
              { name: "Beaded Bracelets", href: "/bracelets?filter=Beaded Bracelets" }
            ]
          },
          {
            title: "",
            links: [
              { name: "Bracelets for Men", href: "/bracelets?filter=Bracelets for Men" },
              { name: "Birthstone Bracelets", href: "/bracelets?filter=Birthstone Bracelets" },
              { name: "Charm Bracelets", href: "/bracelets?filter=Charm Bracelets" },
              { name: "Best Selling Bracelets", href: "/bracelets?filter=Best Selling Bracelets" }
            ]
          }
        ]
      }
    },
    { 
      name: "Earrings", 
      href: "/earrings",
      groupFilters: ["Silver Earrings", "Gold Earrings", "Pearl Earrings", "Hoop Earrings", "Drop Earrings", "Stud Earrings", "Single Earrings", "Heart-Shaped Earrings"],
      megaMenu: {
        featureTitle: "Earrings",
        featureImage: "/images/1 product.jpg",
        columns: [
          {
            title: "",
            links: [
              { name: "Silver Earrings", href: "/earrings?filter=Silver Earrings" },
              { name: "Gold Earrings", href: "/earrings?filter=Gold Earrings" },
              { name: "Pearl Earrings", href: "/earrings?filter=Pearl Earrings" }
            ]
          },
          {
            title: "",
            links: [
              { name: "Hoop Earrings", href: "/earrings?filter=Hoop Earrings" },
              { name: "Drop Earrings", href: "/earrings?filter=Drop Earrings" },
              { name: "Stud Earrings", href: "/earrings?filter=Stud Earrings" },
              { name: "Single Earrings", href: "/earrings?filter=Single Earrings" }
            ]
          },
          {
            title: "",
            links: [
              { name: "Heart-Shaped Earrings", href: "/earrings?filter=Heart-Shaped Earrings" },
              { name: "Best selling earrings", href: "/earrings?filter=Best selling earrings" },
              { name: "Earrings for Special Occasions", href: "/earrings?filter=Earrings for Special Occasions" }
            ]
          }
        ]
      }
    },
    { 
      name: "Necklaces", 
      href: "/necklaces",
      groupFilters: ["Silver Necklaces", "Gold Necklaces", "Leather Necklaces", "Pearl Necklaces", "Chain Necklaces", "Multi Strand Necklaces", "Long Necklaces", "Short Necklaces", "Beaded Necklaces", "Pendant Necklaces", "Heart-Shaped Necklaces", "Charm Necklaces"],
      megaMenu: {
        featureTitle: "Necklaces",
        featureImage: "/images/1 product.jpg",
        columns: [
          {
            title: "",
            links: [
              { name: "Silver Necklaces", href: "/necklaces?filter=Silver Necklaces" },
              { name: "Gold Necklaces", href: "/necklaces?filter=Gold Necklaces" },
              { name: "Leather Necklaces", href: "/necklaces?filter=Leather Necklaces" },
              { name: "Pearl Necklaces", href: "/necklaces?filter=Pearl Necklaces" }
            ]
          },
          {
            title: "",
            links: [
              { name: "Chain Necklaces", href: "/necklaces?filter=Chain Necklaces" },
              { name: "Multi Strand Necklaces", href: "/necklaces?filter=Multi Strand Necklaces" },
              { name: "Long Necklaces", href: "/necklaces?filter=Long Necklaces" },
              { name: "Short Necklaces", href: "/necklaces?filter=Short Necklaces" },
              { name: "Beaded Necklaces", href: "/necklaces?filter=Beaded Necklaces" }
            ]
          },
          {
            title: "",
            links: [
              { name: "Pendant Necklaces", href: "/necklaces?filter=Pendant Necklaces" },
              { name: "Heart-Shaped Necklaces", href: "/necklaces?filter=Heart-Shaped Necklaces" },
              { name: "Charm Necklaces", href: "/necklaces?filter=Charm Necklaces" },
              { name: "Necklaces for Special Occasions", href: "/necklaces?filter=Necklaces for Special Occasions" },
              { name: "Best Selling Necklaces", href: "/necklaces?filter=Best Selling Necklaces" }
            ]
          }
        ]
      }
    },
    { 
      name: "Rings", 
      href: "/rings",
      groupFilters: ["Silver Rings", "Gold Rings", "Crystal Rings", "Minimal Rings", "Best Selling Rings"],
      megaMenu: {
        featureTitle: "Rings",
        featureImage: "/images/1 product.jpg",
        columns: [
          {
            title: "",
            links: [
              { name: "Silver Rings", href: "/rings?filter=Silver Rings" },
              { name: "Gold Rings", href: "/rings?filter=Gold Rings" },
              { name: "Crystal Rings", href: "/rings?filter=Crystal Rings" }
            ]
          },
          {
            title: "",
            links: [
              { name: "Minimal Rings", href: "/rings?filter=Minimal Rings" },
              { name: "Rings for Special Occasions", href: "/rings?filter=Rings for Special Occasions" },
              { name: "Best Selling Rings", href: "/rings?filter=Best Selling Rings" }
            ]
          }
        ]
      }
    },
    { 
      name: "Charms", 
      href: "/charms",
      groupFilters: ["Silver Charms", "Gold Charms", "Gemstone Charms", "Zodiac Charms", "Initial Charms", "Hoop Charms", "Heart-shaped charms"],
      megaMenu: {
        featureTitle: "Charms",
        featureImage: "/images/1 product.jpg",
        columns: [
          {
            title: "",
            links: [
              { name: "Silver Charms", href: "/charms?filter=Silver Charms" },
              { name: "Gold Charms", href: "/charms?filter=Gold Charms" },
              { name: "Gemstone Charms", href: "/charms?filter=Gemstone Charms" }
            ]
          },
          {
            title: "",
            links: [
              { name: "Zodiac Charms", href: "/charms?filter=Zodiac Charms" },
              { name: "Initial Charms", href: "/charms?filter=Initial Charms" },
              { name: "Hoop Charms", href: "/charms?filter=Hoop Charms" },
              { name: "Heart-shaped charms", href: "/charms?filter=Heart-shaped charms" }
            ]
          }
        ]
      }
    },
    { 
      name: "For him", 
      href: "/for-him",
      groupFilters: ["Bracelets for men", "Silver bracelets for men", "Leather bracelets for men", "Chain and Link bracelets", "Rings for men", "Necklaces for men", "Watches", "Keychains", "Men's Best Sellers"],
      megaMenu: {
        featureTitle: "For him",
        featureImage: "/images/1 product.jpg",
        columns: [
          {
            title: "",
            links: [
              { name: "Bracelets for men", href: "/for-him?filter=Bracelets for men" },
              { name: "Silver bracelets for men", href: "/for-him?filter=Silver bracelets for men" },
              { name: "Leather bracelets for men", href: "/for-him?filter=Leather bracelets for men" },
              { name: "Chain and Link bracelets", href: "/for-him?filter=Chain and Link bracelets" }
            ]
          },
          {
            title: "",
            links: [
              { name: "Rings for men", href: "/for-him?filter=Rings for men" },
              { name: "Necklaces for men", href: "/for-him?filter=Necklaces for men" },
              { name: "Watches", href: "/for-him?filter=Watches" }
            ]
          },
          {
            title: "",
            links: [
              { name: "Keychains", href: "/for-him?filter=Keychains" },
              { name: "Men's Best Sellers", href: "/for-him?filter=Men's Best Sellers" }
            ]
          }
        ]
      }
    },
    { name: "Outlet", href: "/outlet" }
  ];

  const orders: Order[] = [
    {
      id: "ORD-2026-9871",
      customerName: "John Doe",
      customerEmail: "john.doe@example.com",
      customerPhone: "+44 7911 123456",
      shippingAddress: "45 Regent St, London, W1B 4DY, UK",
      items: [
        { id: "1", title: "Silver Earring", price: "£ 165.00", priceValue: 165, quantity: 1, color: "silver", image: "/images/product 1.2.PNG" }
      ],
      subtotal: 165.00,
      tax: 28.63,
      total: 193.63,
      status: "Delivered",
      courier: "Royal Mail",
      trackingCode: "GB123456789RM",
      date: "2026-06-15T10:30:00.000Z"
    },
    {
      id: "ORD-2026-9872",
      customerName: "Emma Watson",
      customerEmail: "emma.w@example.com",
      customerPhone: "+31 6 1234 5678",
      shippingAddress: "Keizersgracht 456, 1016 GD Amsterdam, NL",
      items: [
        { id: "2", title: "Silver Fish shape earings", price: "£ 115.00", priceValue: 115, quantity: 2, color: "silver", image: "/images/product 7.PNG" }
      ],
      subtotal: 230.00,
      tax: 39.91,
      total: 269.91,
      status: "Processing",
      courier: "",
      trackingCode: "",
      date: "2026-06-16T15:45:00.000Z"
    }
  ];

  const settings: GlobalSettings = {
    klarnaEnabled: true,
    paypalEnabled: true,
    installmentsCount: 3,
    taxPercentage: 17.35,
    legalDisclaimer: "18+, T&C apply, Credit subject to status.",
    shippingReturns: {
      freeReturnsDays: 30,
      freeDeliveryText: "Free standard delivery",
      helpLink: "#",
      handcraftedText: "Our jewelry is made in Spain and 100% handcrafted."
    }
  };

  const limitedEditionSettings: LimitedEditionSettings = {
    bannerImage: "/images/HEADER_NEW-IN_ARCADIA_desktop.jpg",
    introTitle: "LIMITED EDITIONS",
    introText1: "Imagine a collectible object transformed into a piece of jewelry. A memory, a decision, a work of art.",
    introText2: "Each design is produced in a limited edition of 50 units, numbered, handcrafted in Spain, and selectively distributed around the world."
  };

  const admins: AdminUser[] = [
    {
      id: "1",
      email: "cielorashop@gmail.com",
      role: "owner"
    }
  ];

  const socialLinks: SocialLink[] = [
    {
      id: "sl1",
      platform: "Instagram",
      url: "#",
      isHidden: false,
      iconSvg: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.181a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/>'
    },
    {
      id: "sl2",
      platform: "Facebook",
      url: "#",
      isHidden: false,
      iconSvg: '<path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.324V1.325C24 .597 23.403 0 22.675 0z"/>'
    },
    {
      id: "sl3",
      platform: "TikTok",
      url: "#",
      isHidden: false,
      iconSvg: '<path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68a6.34 6.34 0 0 0 6.27 6.36 6.34 6.34 0 0 0 6.27-6.36V11.53a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-2.72-.96z"/>'
    },
    {
      id: "sl4",
      platform: "Youtube",
      url: "#",
      isHidden: false,
      iconSvg: '<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>'
    },
    {
      id: "sl5",
      platform: "Pinterest",
      url: "#",
      isHidden: false,
      iconSvg: '<path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.182 0 7.439 2.981 7.439 6.96 0 4.156-2.618 7.502-6.257 7.502-1.222 0-2.372-.635-2.766-1.385l-.754 2.875c-.272 1.041-1.01 2.34-1.506 3.136 1.171.362 2.417.558 3.705.558 6.621 0 11.988-5.368 11.988-11.988C24 5.367 18.638 0 12.017 0z"/>'
    }
  ];

  return {
    products: formattedProducts,
    stores,
    banners,
    homeCards,
    labels,
    orders,
    navbarTabs,
    settings,
    limitedEditionSettings,
    admins,
    socialLinks
  };
}

// Read and write operations
export async function getDb(): Promise<DbSchema> {
  if (!process.env.MONGODB_URI) {
    console.warn("MONGODB_URI is missing, falling back to initial state.");
    return getInitialDbState();
  }

  try {
    const client = await clientPromise;
    const db = client.db("cielora");
    const collection = db.collection("storeData");
    
    const data = await collection.findOne({ _id: "main_db" as any });
    
    if (!data) {
      const initialState = getInitialDbState();
      await collection.insertOne({ _id: "main_db" as any, ...initialState });
      return initialState;
    }
    
    const { _id, ...parsedData } = data;
    const parsed = parsedData as unknown as DbSchema;

    if (!parsed.homeCards) {
      const initialState = getInitialDbState();
      parsed.homeCards = initialState.homeCards;
    }
    // Backward compat for linkedProductIds in banners
    if (parsed.banners && parsed.banners.length > 0 && parsed.banners[0].linkedProductIds === undefined) {
      const initialState = getInitialDbState();
      parsed.banners = parsed.banners.map(b => {
        const initialBanner = initialState.banners.find(ib => ib.id === b.id);
        if (initialBanner && initialBanner.linkedProductIds) {
          return { ...b, linkedProductsTitle: initialBanner.linkedProductsTitle, linkedProductIds: initialBanner.linkedProductIds };
        }
        return b;
      });
    }
    // Backward compat for admins
    if (!parsed.admins) {
      const initialState = getInitialDbState();
      parsed.admins = initialState.admins;
    }
    // Backward compat for groupFilters
    if (parsed.navbarTabs && parsed.navbarTabs.length > 0 && !parsed.navbarTabs[1].groupFilters) {
      const initialState = getInitialDbState();
      parsed.navbarTabs = parsed.navbarTabs.map(t => {
        const initialTab = initialState.navbarTabs.find(it => it.href === t.href);
        if (initialTab && initialTab.groupFilters) {
          return { ...t, groupFilters: initialTab.groupFilters };
        }
        return t;
      });
    }
    // Backward compat for socialLinks
    if (!parsed.socialLinks) {
      const initialState = getInitialDbState();
      parsed.socialLinks = initialState.socialLinks;
    } else {
      // Fix platform names if they were incorrectly saved in DB
      const sl1 = parsed.socialLinks.find(sl => sl.id === "sl1");
      if (sl1 && sl1.platform === "Facebook") sl1.platform = "Instagram";
      const sl2 = parsed.socialLinks.find(sl => sl.id === "sl2");
      if (sl2 && sl2.platform === "Twitter") sl2.platform = "Facebook";
    }

    return parsed;
  } catch (error) {
    console.error("Error reading database from MongoDB:", error);
    throw error;
  }
}

export async function saveDb(data: DbSchema): Promise<void> {
  if (!process.env.MONGODB_URI) {
    console.error("Cannot save: MONGODB_URI is missing.");
    return;
  }

  const client = await clientPromise;
  const db = client.db("cielora");
  const collection = db.collection("storeData");
  
  await collection.updateOne(
    { _id: "main_db" as any },
    { $set: data },
    { upsert: true }
  );
}

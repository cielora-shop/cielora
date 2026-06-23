"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Product, Store, Banner, HomeCard, Label, Order, NavbarTab, GlobalSettings, DbSchema } from "@/lib/db";
import ImageUploader from "@/components/ImageUploader";

export default function AdminPage() {
  // DB States
  const [db, setDb] = useState<DbSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "stores" | "banners" | "labels" | "orders" | "navbar" | "settings" | "admins">("dashboard");

  useEffect(() => {
    const savedTab = localStorage.getItem("cielora_admin_tab");
    if (savedTab) {
      setActiveTab(savedTab as any);
    }
  }, []);

  // Notifications
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Form States (for adding/editing)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    id: "",
    title: "",
    description: "",
    price: "£ ",
    priceValue: 0,
    label: "",
    labelColor: "#cde6ec",
    bottomLabel: "",
    colors: ["silver"],
    images: {
      silver: { img1: "/images/product 1.jpg", img2: "/images/product 1.1.jpg" },
      gold: { img1: "/images/product 6 yellow.1.jpg", img2: "/images/product 6 yellow.2.jpg" }
    },
    galleryImages: [],
    collectionName: "Silver Collection",
    category: "Bracelets",
    sizes: ["S", "M", "L"],
    specs: {
      itemCode: "LLA1000",
      gender: "Female",
      plating: "Sterling Silver",
      material: "Metal",
      color: "Silver",
      minLength: "4 cm"
    },
    inventory: 10
  });

  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [isAddingStore, setIsAddingStore] = useState(false);
  const [storeForm, setStoreForm] = useState<Partial<Store>>({
    id: "",
    name: "",
    address: "",
    city: "",
    postcode: "",
    country: "",
    phone: "",
    email: "",
    googleMapsUrl: ""
  });

  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [selectingSlotIndex, setSelectingSlotIndex] = useState<number | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [editingHomeCard, setEditingHomeCard] = useState<HomeCard | null>(null);
  const [editingLabel, setEditingLabel] = useState<Label | null>(null);
  const [isAddingLabel, setIsAddingLabel] = useState(false);
  const [labelForm, setLabelForm] = useState<Partial<Label>>({ id: "", name: "", color: "#ffffff" });

  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isAddingNavbarTab, setIsAddingNavbarTab] = useState(false);
  const [navbarTabForm, setNavbarTabForm] = useState<Partial<NavbarTab>>({ name: "", href: "" });
  const [editingNavbarTab, setEditingNavbarTab] = useState<{oldName: string, name: string, href: string} | null>(null);
  const [editingNavbarTabFull, setEditingNavbarTabFull] = useState<NavbarTab | null>(null);
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isClosingDeleteModal, setIsClosingDeleteModal] = useState(false);

  const { data: session, status } = useSession();

  // Load database
  useEffect(() => {
    if (status === "authenticated") {
      fetchDb();
    }
  }, [status]);

  const fetchDb = () => {
    setLoading(true);
    fetch("/api/db")
      .then((res) => res.json())
      .then((data) => {
        setDb(data);
        setLoading(false);
      })
      .catch((err) => {
        showToast("Error reading filesystem database.", "error");
        setLoading(false);
      });
  };

  // Handle browser back button for inner pages
  useEffect(() => {
    const hasInnerPageOpen = !!(
      editingNavbarTabFull ||
      isAddingNavbarTab ||
      editingProduct ||
      isAddingProduct ||
      editingOrder ||
      editingBanner ||
      editingStore ||
      isAddingStore ||
      editingLabel ||
      isAddingLabel
    );

    if (hasInnerPageOpen) {
      window.history.pushState({ innerPage: true }, "", window.location.href);
    }

    const handlePopState = (e: PopStateEvent) => {
      if (hasInnerPageOpen) {
        setEditingNavbarTabFull(null);
        setIsAddingNavbarTab(false);
        setEditingProduct(null);
        setIsAddingProduct(false);
        setEditingOrder(null);
        setEditingBanner(null);
        setEditingHomeCard(null);
        setEditingStore(null);
        setIsAddingStore(false);
        setEditingLabel(null);
        setIsAddingLabel(false);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [
    editingNavbarTabFull, isAddingNavbarTab, editingProduct, isAddingProduct,
    editingOrder, editingBanner, editingHomeCard, editingStore, isAddingStore, editingLabel, isAddingLabel
  ]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/admin/login" });
  };

  // Sync state to local db
  const saveDatabase = (updatedDb: DbSchema) => {
    setDb(updatedDb);
    fetch("/api/db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedDb)
    })
      .then((res) => {
        if (res.ok) {
          showToast("Changes saved to database.json successfully!");
        } else {
          showToast("Failed to save changes.", "error");
        }
      })
      .catch((err) => {
        showToast("Server communication error.", "error");
      });
  };

  // PRODUCT CRUD
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    let updatedProducts = [...db.products];
    const newPrice = `£ ${Number(productForm.priceValue).toFixed(2)}`;

    // Parse image values
    const imagesVal = {
      silver: {
        img1: (productForm as any).img1_silver || "/images/product 1.jpg",
        img2: (productForm as any).img2_silver || "/images/product 1.1.jpg",
        galleryImages: ((productForm as any).gallery_silver || []).filter(Boolean)
      },
      gold: {
        img1: (productForm as any).img1_gold || "/images/product 6 yellow.1.jpg",
        img2: (productForm as any).img2_gold || "/images/product 6 yellow.2.jpg",
        galleryImages: ((productForm as any).gallery_gold || []).filter(Boolean)
      }
    };

    // Parse gallery images (Deprecated fallback)
    const gallery: string[] = [];

    // Dynamic sizes from input text
    const sizeString = (productForm as any).sizesInput || "S, M, L";
    const parsedSizes = sizeString.split(",").map((s: string) => s.trim()).filter(Boolean);

    const fullProduct: Product = {
      id: productForm.id || String(db.products.length + 1),
      title: productForm.title || "Untitled Product",
      description: productForm.description || "",
      price: newPrice,
      priceValue: Number(productForm.priceValue) || 0,
      label: productForm.label || undefined,
      labelColor: productForm.labelColor || undefined,
      bottomLabel: productForm.bottomLabel || undefined,
      colors: productForm.colors || ["silver"],
      images: imagesVal,
      galleryImages: gallery,
      collectionName: productForm.collectionName || "Silver Collection",
      category: productForm.category || "Bracelets",
      sizes: parsedSizes,
      specs: {
        itemCode: productForm.specs?.itemCode || `LLA${String(1000 + db.products.length).padStart(4, "0")}`,
        gender: productForm.specs?.gender || "Female",
        plating: productForm.specs?.plating || "Sterling Silver",
        material: productForm.specs?.material || "Metal",
        color: productForm.specs?.color || "Silver",
        minLength: productForm.specs?.minLength || "4 cm"
      },
      inventory: Number(productForm.inventory) || 10
    };

    if (isAddingProduct) {
      updatedProducts.push(fullProduct);
      setIsAddingProduct(false);
    } else if (editingProduct) {
      updatedProducts = updatedProducts.map((p) => (p.id === editingProduct.id ? fullProduct : p));
      setEditingProduct(null);
    }

    saveDatabase({ ...db, products: updatedProducts });
  };

  const editProduct = (product: Product) => {
    setEditingProduct(product);
    setIsAddingProduct(false);
    setProductForm({
      ...product,
      // Helper fields for forms
      ...({
        img1_silver: product.images?.silver?.img1 || "",
        img2_silver: product.images?.silver?.img2 || "",
        gallery_silver: product.images?.silver?.galleryImages?.length 
          ? product.images.silver.galleryImages 
          : product.galleryImages?.slice(2) || [],
        img1_gold: product.images?.gold?.img1 || "",
        img2_gold: product.images?.gold?.img2 || "",
        gallery_gold: product.images?.gold?.galleryImages?.length 
          ? product.images.gold.galleryImages 
          : product.galleryImages?.slice(2) || [],
        sizesInput: product.sizes.join(", ")
      } as any)
    });
  };

  const confirmDeleteProduct = () => {
    if (!db || !productToDelete) return;
    setIsClosingDeleteModal(true);
    setTimeout(() => {
      const updated = db.products.filter((p) => p.id !== productToDelete.id);
      saveDatabase({ ...db, products: updated });
      setProductToDelete(null);
      setIsClosingDeleteModal(false);
    }, 300);
  };

  const cancelDeleteProduct = () => {
    setIsClosingDeleteModal(true);
    setTimeout(() => {
      setProductToDelete(null);
      setIsClosingDeleteModal(false);
    }, 300);
  };

  const startAddProduct = () => {
    setIsAddingProduct(true);
    setEditingProduct(null);
    setProductForm({
      id: String(db?.products.length ? Math.max(...db.products.map(p => Number(p.id) || 0)) + 1 : 1),
      title: "",
      description: "",
      price: "£ ",
      priceValue: 0,
      label: "",
      labelColor: "#cde6ec",
      bottomLabel: "",
      colors: ["silver"],
      images: {
        silver: { img1: "/images/product 1.jpg", img2: "/images/product 1.1.jpg" },
        gold: { img1: "/images/product 6 yellow.1.jpg", img2: "/images/product 6 yellow.2.jpg" }
      },
      galleryImages: [],
      collectionName: "Silver Collection",
      category: "Bracelets",
      sizes: ["S", "M", "L"],
      specs: {
        itemCode: `LLA${String(1001 + (db?.products.length || 0))}`,
        gender: "Female",
        plating: "Sterling Silver",
        material: "Metal",
        color: "Silver",
        minLength: "4 cm"
      },
      inventory: 15,
      ...({
        img1_silver: "/images/product 1.jpg",
        img2_silver: "/images/product 1.1.jpg",
        gallery_silver: [],
        img1_gold: "",
        img2_gold: "",
        gallery3: "/images/banner 4.jpg",
        gallery4: "/images/banner 3.jpg",
        sizesInput: "S, M, L"
      } as any)
    });
  };

  // STORE CRUD
  const handleStoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    let updatedStores = [...db.stores];
    const fullStore: Store = {
      id: storeForm.id || String(db.stores.length + 1),
      name: storeForm.name || "New Store",
      address: storeForm.address || "",
      city: storeForm.city || "",
      postcode: storeForm.postcode || "",
      country: storeForm.country || "",
      phone: storeForm.phone || "",
      email: storeForm.email || "",
      googleMapsUrl: storeForm.googleMapsUrl || ""
    };

    if (isAddingStore) {
      updatedStores.push(fullStore);
      setIsAddingStore(false);
    } else if (editingStore) {
      updatedStores = updatedStores.map((s) => (s.id === editingStore.id ? fullStore : s));
      setEditingStore(null);
    }

    saveDatabase({ ...db, stores: updatedStores });
  };

  const deleteStore = (id: string) => {
    if (!db) return;
    if (confirm("Are you sure you want to delete this store branch?")) {
      const updated = db.stores.filter((s) => s.id !== id);
      saveDatabase({ ...db, stores: updated });
    }
  };

  // BANNER SUBMIT
  const handleBannerSubmit = (e: React.FormEvent, bannerId: string) => {
    e.preventDefault();
    if (!db || !editingBanner) return;

    const updated = db.banners.map((b) => (b.id === bannerId ? editingBanner : b));
    saveDatabase({ ...db, banners: updated });
    setEditingBanner(null);
  };

  // HOMECARD SUBMIT
  const handleHomeCardSubmit = (e: React.FormEvent, cardId: string) => {
    e.preventDefault();
    if (!db || !editingHomeCard) return;

    const updated = db.homeCards.map((c) => (c.id === cardId ? editingHomeCard : c));
    saveDatabase({ ...db, homeCards: updated });
    setEditingHomeCard(null);
  };

  // LABELS CRUD
  const handleLabelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    let updatedLabels = [...db.labels];
    const fullLabel: Label = {
      id: labelForm.id || String(db.labels.length + 1),
      name: labelForm.name || "Label",
      color: labelForm.color || "#ffffff"
    };

    if (isAddingLabel) {
      updatedLabels.push(fullLabel);
      setIsAddingLabel(false);
    } else if (editingLabel) {
      updatedLabels = updatedLabels.map((l) => (l.id === editingLabel.id ? fullLabel : l));
      setEditingLabel(null);
    }

    saveDatabase({ ...db, labels: updatedLabels });
  };

  const deleteLabel = (id: string) => {
    if (!db) return;
    if (confirm("Delete this product label?")) {
      const updated = db.labels.filter((l) => l.id !== id);
      saveDatabase({ ...db, labels: updated });
    }
  };

  // ORDER UPDATE
  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !editingOrder) return;

    const updated = db.orders.map((o) => (o.id === editingOrder.id ? editingOrder : o));
    saveDatabase({ ...db, orders: updated });
    setEditingOrder(null);
  };

  // NAVBAR CUSTOMIZER
  const handleNavbarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    const updated = [...db.navbarTabs];
    updated.push({
      name: navbarTabForm.name || "New Tab",
      href: navbarTabForm.href || "/shop"
    });

    saveDatabase({ ...db, navbarTabs: updated });
    setIsAddingNavbarTab(false);
    setNavbarTabForm({ name: "", href: "" });
  };

  const deleteNavbarTab = (name: string) => {
    if (!db) return;
    if (confirm(`Remove "${name}" tab from navigation bar?`)) {
      const updated = db.navbarTabs.filter((t) => t.name !== name);
      saveDatabase({ ...db, navbarTabs: updated });
    }
  };

  // ADMINS SUBMIT
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    if (!newAdminEmail.includes("@")) {
      showToast("Invalid email address.", "error");
      return;
    }

    const updated = [...db.admins];
    if (updated.some(a => a.email === newAdminEmail)) {
      showToast("Email already has access.", "error");
      return;
    }

    updated.push({
      id: String(Date.now()),
      email: newAdminEmail.toLowerCase().trim(),
      role: "admin"
    });

    saveDatabase({ ...db, admins: updated });
    setIsAddingAdmin(false);
    setNewAdminEmail("");
  };

  const deleteAdmin = (id: string) => {
    if (!db) return;
    if (confirm("Remove admin access for this email?")) {
      const updated = db.admins.filter((a) => a.id !== id);
      saveDatabase({ ...db, admins: updated });
    }
  };

  // SETTINGS SUBMIT
  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    saveDatabase(db);
  };



  if (loading || !db) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500 font-semibold uppercase tracking-wider text-sm">
        Opening Control Center...
      </div>
    );
  }

  // Dashboard calculations
  const totalProducts = db.products.length;
  const totalStores = db.stores.length;
  const activeBanners = db.banners.filter((b) => b.visible).length;
  const lowStock = db.products.filter((p) => p.inventory < 5);
  const totalRevenue = db.orders
    .filter((o) => o.status === "Delivered")
    .reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex text-gray-900 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-[4px] shadow-lg text-[13px] font-medium border flex items-center gap-3 transition-all duration-300 animate-slide-up ${
            toast.type === "success"
              ? "bg-[#eefcf7] border-[#7ce5bf] text-[#126442]"
              : "bg-[#fdf3f2] border-[#f5b8b2] text-[#9c1811]"
          }`}
        >
          {toast.type === "success" ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
          )}
          {toast.message}
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-[260px] bg-stone-900 text-stone-300 flex flex-col shrink-0 border-r border-stone-800 sticky top-0 h-screen overflow-y-auto">
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <span
            className="text-[28px] font-normal leading-none tracking-[0.02em] select-none text-[#d2977aff]"
            style={{ fontFamily: "var(--font-style-script)" }}
          >
            Cielora Control
          </span>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {[
            { id: "dashboard", label: "Dashboard Overview", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg> },
            { id: "products", label: "Manage Products", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg> },
            { id: "banners", label: "Home page", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg> },
            { id: "navbar", label: "Navbar Customizer", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg> },
            { id: "stores", label: "Store Locations", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> },
            { id: "labels", label: "Product Card Labels", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path></svg> },
            { id: "orders", label: "Orders & Fulfillment", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg> },
            { id: "admins", label: "Team & Access", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg> },
            { id: "settings", label: "Global Store Settings", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                localStorage.setItem("cielora_admin_tab", tab.id);
                setEditingProduct(null);
                setIsAddingProduct(false);
                setEditingStore(null);
                setIsAddingStore(false);
                setEditingBanner(null);
                setEditingHomeCard(null);
                setEditingLabel(null);
                setIsAddingLabel(false);
                setEditingOrder(null);
                setIsAddingNavbarTab(false);
                setIsAddingAdmin(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-[3px] text-[13px] font-medium tracking-wide transition-all ${
                activeTab === tab.id
                  ? "bg-stone-800 text-white border-l-[3px] border-[#d2977a]"
                  : "text-stone-400 hover:text-white hover:bg-stone-800/50"
              } ${tab.id === "admins" ? "mt-auto" : ""}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-800 flex flex-col gap-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 border border-stone-700 hover:border-stone-500 rounded-[3px] py-2.5 text-[11px] uppercase tracking-wider font-semibold text-stone-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            View Shop
          </Link>
          <button
            onClick={handleLogout}
            className="bg-stone-800 hover:bg-stone-900 border border-transparent rounded-[3px] py-2.5 text-[11px] uppercase tracking-wider font-semibold text-stone-400 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 pb-24 overflow-y-auto max-w-[1200px] mx-auto w-full">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-[26px] font-semibold text-gray-900 capitalize tracking-wide">{activeTab} Manager</h1>
            <p className="text-[12px] text-gray-500 mt-1">Configure and manage Cielora content and checkout configuration.</p>
          </div>
        </header>

        {/* TAB: ADMINS (TEAM ACCESS) */}
        {activeTab === "admins" && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center bg-white p-4 border border-gray-200 rounded-[4px] shadow-sm">
              <span className="text-[13px] text-gray-500 font-medium">Authorized Personnel: {db.admins.length} Users</span>
              {session?.user?.email === "cielorashop@gmail.com" && (
                <button
                  onClick={() => setIsAddingAdmin(!isAddingAdmin)}
                  className="bg-black hover:bg-stone-900 border border-black text-white text-[12px] font-bold uppercase tracking-wider px-4 py-2 rounded-[2px]"
                >
                  {isAddingAdmin ? "Cancel" : "Add Admin"}
                </button>
              )}
            </div>

            {isAddingAdmin && session?.user?.email === "cielorashop@gmail.com" && (
              <form onSubmit={handleAdminSubmit} className="bg-white p-6 rounded-[6px] border border-gray-200 shadow-sm flex items-end gap-4 animate-slide-up">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-[11px] font-bold text-gray-800 uppercase tracking-wider">New Admin Email Address</label>
                  <input
                    type="email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="partner@example.com"
                    className="border border-gray-300 px-4 py-2.5 rounded-[3px] focus:outline-none focus:border-black text-[13px] w-full"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#d2977a] hover:bg-[#c18669] text-white border border-[#d2977a] text-[12px] font-bold uppercase tracking-wider px-6 py-3 rounded-[2px]"
                >
                  Grant Access
                </button>
              </form>
            )}

            <div className="bg-white rounded-[6px] border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-[12px] border-collapse">
                <thead>
                  <tr className="bg-stone-100 text-gray-700 font-bold border-b border-gray-200">
                    <th className="p-4">Email Address</th>
                    <th className="p-4">Role</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {db.admins.map((admin) => (
                    <tr key={admin.id} className="border-b border-gray-100 hover:bg-stone-50">
                      <td className="p-4 font-semibold text-gray-900">{admin.email}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                            admin.role === "owner"
                              ? "bg-stone-800 text-stone-100"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {admin.role}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {admin.role !== "owner" && session?.user?.email === "cielorashop@gmail.com" ? (
                          <button
                            onClick={() => deleteAdmin(admin.id)}
                            className="border border-red-200 hover:border-red-600 text-red-600 text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded transition-colors"
                          >
                            Revoke Access
                          </button>
                        ) : (
                          <span className="text-gray-400 italic">Protected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 1: DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="flex flex-col gap-8">
            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: "Revenue (Delivered)", value: `£ ${totalRevenue.toFixed(2)}`, bg: "bg-white", border: "border-gray-200" },
                { title: "Product Catalog", value: totalProducts, bg: "bg-white", border: "border-gray-200" },
                { title: "Physical Branches", value: totalStores, bg: "bg-white", border: "border-gray-200" },
                { title: "Active Banners", value: activeBanners, bg: "bg-white", border: "border-gray-200" }
              ].map((card, i) => (
                <div key={i} className={`p-6 rounded-[6px] shadow-sm border ${card.bg} ${card.border} flex flex-col justify-between`}>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{card.title}</span>
                  <span className="text-[28px] font-semibold text-gray-900 mt-2">{card.value}</span>
                </div>
              ))}
            </div>

            {/* Notifications & Warning Center */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Low stock alerts */}
              <div className="bg-white p-6 rounded-[6px] border border-gray-200 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                  <h3 className="text-[14px] font-bold text-red-700 uppercase tracking-wider flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                    Low Stock Alerts
                  </h3>
                  <span className="bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded text-[11px]">{lowStock.length} Items</span>
                </div>
                <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-2">
                  {lowStock.length === 0 ? (
                    <p className="text-gray-500 text-[12px] py-4 text-center">All product inventory limits are safe.</p>
                  ) : (
                    lowStock.map((prod) => (
                      <div key={prod.id} className="flex justify-between items-center text-[12px] py-2 border-b border-gray-50">
                        <span className="font-medium text-gray-900">{prod.title} <span className="text-gray-400 font-normal">({prod.category})</span></span>
                        <span className="bg-red-100 text-red-800 font-semibold px-2 py-0.5 rounded text-[10px]">Only {prod.inventory} left</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Order Status Overview */}
              <div className="bg-white p-6 rounded-[6px] border border-gray-200 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                  <h3 className="text-[14px] font-bold text-gray-950 uppercase tracking-wider flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><circle cx="5.5" cy="18.5" r="2.5"></circle></svg>
                    Fulfillment Status
                  </h3>
                  <span className="bg-gray-100 text-gray-800 font-bold px-2 py-0.5 rounded text-[11px]">{db.orders.length} Total</span>
                </div>
                <div className="flex flex-col gap-3">
                  {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => {
                    const count = db.orders.filter((o) => o.status === status).length;
                    return (
                      <div key={status} className="flex justify-between items-center text-[12px]">
                        <span className="text-gray-600 font-medium">{status}</span>
                        <span className="bg-stone-100 text-stone-800 px-3 py-0.5 rounded-full font-bold text-[10px]">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === "products" && (
          <div className="flex flex-col gap-6">
            {!isAddingProduct && !editingProduct ? (
              <>
                <div className="flex justify-between items-center bg-white p-4 border border-gray-200 rounded-[4px] shadow-sm">
                  <span className="text-[13px] text-gray-500 font-medium">Catalog List: {db.products.filter(p => !p.isLimitedEdition).length} Products</span>
                  <button
                    onClick={startAddProduct}
                    className="bg-black hover:bg-stone-900 border border-black text-white text-[12px] font-bold uppercase tracking-wider px-4 py-2 rounded-[2px]"
                  >
                    Add Product
                  </button>
                </div>

                <div className="bg-white rounded-[6px] border border-gray-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left text-[12px] border-collapse">
                    <thead>
                      <tr className="bg-stone-100 text-gray-700 font-bold border-b border-gray-200">
                        <th className="p-4">Image</th>
                        <th className="p-4">ID</th>
                        <th className="p-4">Title</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Collection</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.products.filter(p => !p.isLimitedEdition).map((prod) => (
                        <tr key={prod.id} className="border-b border-gray-100 hover:bg-stone-50">
                          <td className="p-4">
                            <img
                              src={prod.images?.silver?.img1 || prod.galleryImages?.[0] || "/placeholder.jpg"}
                              alt={prod.title}
                              className="w-12 h-14 object-cover border border-gray-200 rounded"
                            />
                          </td>
                          <td className="p-4 text-gray-500 font-medium">#{prod.id}</td>
                          <td className="p-4 font-semibold text-gray-900">{prod.title}</td>
                          <td className="p-4 text-gray-600">{prod.category}</td>
                          <td className="p-4 text-gray-600">{prod.collectionName || "-"}</td>
                          <td className="p-4 font-semibold text-gray-900">{prod.price}</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                prod.inventory < 5
                                  ? "bg-red-50 text-red-700"
                                  : "bg-green-50 text-green-700"
                              }`}
                            >
                              {prod.inventory} units
                            </span>
                          </td>
                          <td className="p-4 text-right flex items-center justify-end gap-2 h-20">
                            <button
                              onClick={() => editProduct(prod)}
                              className="border border-gray-300 hover:border-black text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setProductToDelete(prod)}
                              className="border border-red-200 hover:border-red-600 text-red-600 text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              // Add/Edit Product Form Layout
              <div className="bg-white p-8 rounded-[6px] border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center border-b pb-4 mb-6 border-gray-100">
                  <h3 className="text-[16px] font-bold text-gray-900 uppercase tracking-widest">
                    {isAddingProduct ? "Add New Product" : `Edit Product #${editingProduct?.id}`}
                  </h3>
                  <button
                    onClick={() => {
                      setIsAddingProduct(false);
                      setEditingProduct(null);
                    }}
                    className="text-gray-400 hover:text-black border border-gray-300 hover:border-black px-3 py-1 rounded text-[11px] uppercase tracking-wider font-semibold"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleProductSubmit} className="flex flex-col gap-6 text-[12px] text-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-800 uppercase tracking-wider">Product Title</label>
                      <input
                        type="text"
                        value={productForm.title || ""}
                        onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                        className="border border-gray-300 px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-black text-[13px]"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-800 uppercase tracking-wider">Category</label>
                      <select
                        value={productForm.category || "Bracelets"}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="border border-gray-300 px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-black text-[13px] bg-white"
                      >
                        {["Bracelets", "Charm", "Necklaces", "Earrings", "Rings"].map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-800 uppercase tracking-wider">Collection</label>
                      <select
                        value={productForm.collectionName || "Silver Collection"}
                        onChange={(e) => setProductForm({ ...productForm, collectionName: e.target.value })}
                        className="border border-gray-300 px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-black text-[13px] bg-white"
                      >
                        {["Silver Collection", "Arcadia", "Classic", "Flutter", "Luminis Edition", "Roots"].map((col) => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-800 uppercase tracking-wider">Price (Numerical Value, e.g. 165)</label>
                      <input
                        type="number"
                        value={productForm.priceValue || 0}
                        onChange={(e) => setProductForm({ ...productForm, priceValue: Number(e.target.value) })}
                        className="border border-gray-300 px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-black text-[13px]"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-800 uppercase tracking-wider">Inventory Stock</label>
                      <input
                        type="number"
                        value={productForm.inventory || 0}
                        onChange={(e) => setProductForm({ ...productForm, inventory: Number(e.target.value) })}
                        className="border border-gray-300 px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-black text-[13px]"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-800 uppercase tracking-wider">Sizes (Comma-separated, e.g. S, M, L)</label>
                      <input
                        type="text"
                        value={(productForm as any).sizesInput || ""}
                        onChange={(e) => setProductForm({ ...productForm, ...({ sizesInput: e.target.value } as any) })}
                        className="border border-gray-300 px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-black text-[13px]"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-800 uppercase tracking-wider">Product Description</label>
                    <textarea
                      value={productForm.description || ""}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="border border-gray-300 px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-black text-[13px] h-[100px]"
                      required
                    />
                  </div>

                  {/* Accordion Specs */}
                  <div className="bg-stone-50 p-6 rounded border border-gray-200 flex flex-col gap-4">
                    <h4 className="font-bold text-gray-900 uppercase tracking-wider border-b pb-2 mb-2">Technical Specifications (Product Details Accordion)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-gray-700">Item Code</label>
                        <input
                          type="text"
                          value={productForm.specs?.itemCode || ""}
                          onChange={(e) => setProductForm({
                            ...productForm,
                            specs: { ...productForm.specs, itemCode: e.target.value } as any
                          })}
                          className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-black text-[12px] bg-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-gray-700">Gender</label>
                        <input
                          type="text"
                          value={productForm.specs?.gender || ""}
                          onChange={(e) => setProductForm({
                            ...productForm,
                            specs: { ...productForm.specs, gender: e.target.value } as any
                          })}
                          className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-black text-[12px] bg-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-gray-700">Plating</label>
                        <input
                          type="text"
                          value={productForm.specs?.plating || ""}
                          onChange={(e) => setProductForm({
                            ...productForm,
                            specs: { ...productForm.specs, plating: e.target.value } as any
                          })}
                          className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-black text-[12px] bg-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-gray-700">Material</label>
                        <input
                          type="text"
                          value={productForm.specs?.material || ""}
                          onChange={(e) => setProductForm({
                            ...productForm,
                            specs: { ...productForm.specs, material: e.target.value } as any
                          })}
                          className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-black text-[12px] bg-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-gray-700">Color</label>
                        <input
                          type="text"
                          value={productForm.specs?.color || ""}
                          onChange={(e) => setProductForm({
                            ...productForm,
                            specs: { ...productForm.specs, color: e.target.value } as any
                          })}
                          className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-black text-[12px] bg-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-gray-700">Minimum Length</label>
                        <input
                          type="text"
                          value={productForm.specs?.minLength || ""}
                          onChange={(e) => setProductForm({
                            ...productForm,
                            specs: { ...productForm.specs, minLength: e.target.value } as any
                          })}
                          className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-black text-[12px] bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Colors & Image URLs */}
                  <div className="bg-stone-50 p-6 rounded border border-gray-200 flex flex-col gap-4">
                    <h4 className="font-bold text-gray-900 uppercase tracking-wider border-b pb-2 mb-2">Image Management & Colors</h4>
                    <div className="flex items-center gap-6 mb-2">
                      <span className="font-bold text-gray-800">Available Metal Colors:</span>
                      <label className="flex items-center gap-2 cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={productForm.colors?.includes("silver")}
                          onChange={(e) => {
                            const newCols = e.target.checked
                              ? [...(productForm.colors || []), "silver"]
                              : (productForm.colors || []).filter(c => c !== "silver");
                            setProductForm({ ...productForm, colors: newCols as any });
                          }}
                        />
                        Silver
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={productForm.colors?.includes("gold")}
                          onChange={(e) => {
                            const newCols = e.target.checked
                              ? [...(productForm.colors || []), "gold"]
                              : (productForm.colors || []).filter(c => c !== "gold");
                            setProductForm({ ...productForm, colors: newCols as any });
                          }}
                        />
                        Gold
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-4 bg-white p-4 border border-gray-200 rounded">
                        <span className="font-bold text-[#d2977a] uppercase tracking-wider text-[11px]">Silver Images</span>
                        <ImageUploader 
                          label="Primary Image" 
                          value={(productForm as any).img1_silver || ""} 
                          onChange={(url) => setProductForm({ ...productForm, ...({ img1_silver: url } as any) })} 
                        />
                        <ImageUploader 
                          label="Hover Image" 
                          value={(productForm as any).img2_silver || ""} 
                          onChange={(url) => setProductForm({ ...productForm, ...({ img2_silver: url } as any) })} 
                        />
                        {((productForm as any).gallery_silver || []).map((imgUrl: string, idx: number) => (
                          <ImageUploader 
                            key={`silver-gallery-${idx}`}
                            label={`Gallery Image ${idx + 1}`} 
                            value={imgUrl} 
                            acceptVideo={true}
                            onChange={(url) => {
                              const newGallery = [...((productForm as any).gallery_silver || [])];
                              newGallery[idx] = url;
                              setProductForm({ ...productForm, ...({ gallery_silver: newGallery } as any) });
                            }} 
                            onRemove={() => {
                              const newGallery = [...((productForm as any).gallery_silver || [])];
                              newGallery.splice(idx, 1);
                              setProductForm({ ...productForm, ...({ gallery_silver: newGallery } as any) });
                            }}
                          />
                        ))}
                        {((productForm as any).gallery_silver || []).length < 6 && (
                          <button 
                            type="button" 
                            onClick={() => {
                              const newGallery = [...((productForm as any).gallery_silver || []), ""];
                              setProductForm({ ...productForm, ...({ gallery_silver: newGallery } as any) });
                            }}
                            className="w-full border border-dashed border-gray-400 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider hover:bg-stone-50 hover:text-gray-800 transition-colors rounded"
                          >
                            + Add Silver Gallery Image
                          </button>
                        )}
                      </div>

                      <div className="flex flex-col gap-4 bg-white p-4 border border-gray-200 rounded">
                        <span className="font-bold text-[#d2977a] uppercase tracking-wider text-[11px]">Gold Images</span>
                        <ImageUploader 
                          label="Primary Image" 
                          value={(productForm as any).img1_gold || ""} 
                          onChange={(url) => setProductForm({ ...productForm, ...({ img1_gold: url } as any) })} 
                        />
                        <ImageUploader 
                          label="Hover Image" 
                          value={(productForm as any).img2_gold || ""} 
                          onChange={(url) => setProductForm({ ...productForm, ...({ img2_gold: url } as any) })} 
                        />
                        {((productForm as any).gallery_gold || []).map((imgUrl: string, idx: number) => (
                          <ImageUploader 
                            key={`gold-gallery-${idx}`}
                            label={`Gallery Image ${idx + 1}`} 
                            value={imgUrl} 
                            acceptVideo={true}
                            onChange={(url) => {
                              const newGallery = [...((productForm as any).gallery_gold || [])];
                              newGallery[idx] = url;
                              setProductForm({ ...productForm, ...({ gallery_gold: newGallery } as any) });
                            }} 
                            onRemove={() => {
                              const newGallery = [...((productForm as any).gallery_gold || [])];
                              newGallery.splice(idx, 1);
                              setProductForm({ ...productForm, ...({ gallery_gold: newGallery } as any) });
                            }}
                          />
                        ))}
                        {((productForm as any).gallery_gold || []).length < 6 && (
                          <button 
                            type="button" 
                            onClick={() => {
                              const newGallery = [...((productForm as any).gallery_gold || []), ""];
                              setProductForm({ ...productForm, ...({ gallery_gold: newGallery } as any) });
                            }}
                            className="w-full border border-dashed border-gray-400 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider hover:bg-stone-50 hover:text-gray-800 transition-colors rounded"
                          >
                            + Add Gold Gallery Image
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Labels selection */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-800 uppercase tracking-wider">Overlay Top Label (e.g. New in)</label>
                      <select
                        value={productForm.label || ""}
                        onChange={(e) => {
                          const matchedLabel = db.labels.find(l => l.name === e.target.value);
                          setProductForm({
                            ...productForm,
                            label: e.target.value || undefined,
                            labelColor: matchedLabel ? matchedLabel.color : undefined
                          });
                        }}
                        className="border border-gray-300 px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-black text-[13px] bg-white"
                      >
                        <option value="">-- No Overlay Badge --</option>
                        {db.labels.map((lbl) => (
                          <option key={lbl.id} value={lbl.name}>{lbl.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-800 uppercase tracking-wider">Bottom Overlay Label (e.g. Free Keyring)</label>
                      <input
                        type="text"
                        value={productForm.bottomLabel || ""}
                        onChange={(e) => setProductForm({ ...productForm, bottomLabel: e.target.value })}
                        className="border border-gray-300 px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-black text-[13px]"
                        placeholder="Leave blank if none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-black hover:bg-stone-900 border border-black text-white text-[13px] font-bold uppercase tracking-wider py-4 rounded-[2px] transition-colors mt-4"
                  >
                    {isAddingProduct ? "Save New Product to Catalog" : "Commit Product Modifications"}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: STORES */}
        {activeTab === "stores" && (
          <div className="flex flex-col gap-6">
            {!isAddingStore && !editingStore ? (
              <>
                <div className="flex justify-between items-center bg-white p-4 border border-gray-200 rounded-[4px] shadow-sm">
                  <span className="text-[13px] text-gray-500 font-medium">Boutique Listing: {totalStores} active branches</span>
                  <button
                    onClick={() => {
                      setIsAddingStore(true);
                      setEditingStore(null);
                      setStoreForm({ id: String(db.stores.length + 1), name: "", address: "", city: "", postcode: "", country: "", phone: "", email: "", googleMapsUrl: "" });
                    }}
                    className="bg-black hover:bg-stone-900 border border-black text-white text-[12px] font-bold uppercase tracking-wider px-4 py-2 rounded-[2px]"
                  >
                    Add Store Location
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {db.stores.map((store) => (
                    <div key={store.id} className="bg-white p-6 rounded-[6px] border border-gray-200 shadow-sm flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-[15px] text-gray-900">{store.name}</h3>
                          <span className="text-[10px] text-gray-400 font-mono">ID: {store.id}</span>
                        </div>
                        <div className="text-[12px] text-gray-600 mt-3 leading-relaxed">
                          <p>{store.address}</p>
                          <p>{store.postcode} {store.city}</p>
                          <p>{store.country}</p>
                          {store.phone && <p className="mt-2 font-medium text-gray-800">Tel: {store.phone}</p>}
                          {store.email && <p className="font-medium text-gray-800">Email: {store.email}</p>}
                        </div>
                        <div className="mt-4 text-[10px] text-gray-400 max-w-full truncate">
                          Maps Link: <a href={store.googleMapsUrl} target="_blank" className="underline text-[#d2977a]">{store.googleMapsUrl}</a>
                        </div>
                      </div>
                      <div className="flex gap-2 border-t pt-4 border-gray-100 mt-2">
                        <button
                          onClick={() => {
                            setEditingStore(store);
                            setStoreForm(store);
                            setIsAddingStore(false);
                          }}
                          className="border border-gray-300 hover:border-black text-[11px] font-semibold uppercase tracking-wider px-4 py-2 rounded-[2px] transition-colors flex-1"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteStore(store.id)}
                          className="border border-red-200 hover:border-red-600 text-red-600 text-[11px] font-semibold uppercase tracking-wider px-4 py-2 rounded-[2px] transition-colors flex-1"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              // Store edit form
              <div className="bg-white p-8 rounded-[6px] border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center border-b pb-4 mb-6 border-gray-100">
                  <h3 className="text-[16px] font-bold text-gray-900 uppercase tracking-widest">
                    {isAddingStore ? "Create Store Branch" : `Edit Store Branch #${editingStore?.id}`}
                  </h3>
                  <button
                    onClick={() => {
                      setIsAddingStore(false);
                      setEditingStore(null);
                    }}
                    className="text-gray-400 hover:text-black border border-gray-300 hover:border-black px-3 py-1 rounded text-[11px] uppercase tracking-wider font-semibold"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleStoreSubmit} className="flex flex-col gap-6 text-[12px] text-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-800 uppercase tracking-wider">Branch Name</label>
                      <input
                        type="text"
                        value={storeForm.name || ""}
                        onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                        className="border border-gray-300 px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-black text-[13px]"
                        placeholder="e.g. Cielora London Boutique"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-800 uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        value={storeForm.email || ""}
                        onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
                        className="border border-gray-300 px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-black text-[13px]"
                        placeholder="london@cielora.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-800 uppercase tracking-wider">Street Address</label>
                      <input
                        type="text"
                        value={storeForm.address || ""}
                        onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                        className="border border-gray-300 px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-black text-[13px]"
                        placeholder="45 Regent St"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-800 uppercase tracking-wider">City</label>
                      <input
                        type="text"
                        value={storeForm.city || ""}
                        onChange={(e) => setStoreForm({ ...storeForm, city: e.target.value })}
                        className="border border-gray-300 px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-black text-[13px]"
                        placeholder="London"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-800 uppercase tracking-wider">Postcode</label>
                      <input
                        type="text"
                        value={storeForm.postcode || ""}
                        onChange={(e) => setStoreForm({ ...storeForm, postcode: e.target.value })}
                        className="border border-gray-300 px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-black text-[13px]"
                        placeholder="W1B 4DY"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-800 uppercase tracking-wider">Country</label>
                      <input
                        type="text"
                        value={storeForm.country || ""}
                        onChange={(e) => setStoreForm({ ...storeForm, country: e.target.value })}
                        className="border border-gray-300 px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-black text-[13px]"
                        placeholder="United Kingdom"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-800 uppercase tracking-wider">Phone number</label>
                      <input
                        type="text"
                        value={storeForm.phone || ""}
                        onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                        className="border border-gray-300 px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-black text-[13px]"
                        placeholder="+44 20 7946 0958"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-800 uppercase tracking-wider flex items-center justify-between">
                      <span>Google Maps Embed URL</span>
                      <span className="text-[10px] text-gray-400 lowercase">Must contain &output=embed at the end</span>
                    </label>
                    <input
                      type="text"
                      value={storeForm.googleMapsUrl || ""}
                      onChange={(e) => setStoreForm({ ...storeForm, googleMapsUrl: e.target.value })}
                      className="border border-gray-300 px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-black text-[13px]"
                      placeholder="https://maps.google.com/maps?q=london&output=embed"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-black hover:bg-stone-900 border border-black text-white text-[13px] font-bold uppercase tracking-wider py-4 rounded-[2px] transition-colors mt-4"
                  >
                    {isAddingStore ? "Create Store Branch" : "Commit Store Modifications"}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: HOME PAGE (BANNERS AND CARDS) */}
        {activeTab === "banners" && (
          <div className="flex flex-col gap-10">
            {/* Category Cards Section */}
            {!editingHomeCard && !editingBanner && (
              <div>
                <h2 className="text-[18px] font-semibold text-gray-900 uppercase tracking-widest mb-4">Category Cards</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  {db.homeCards.map((card) => (
                    <div key={card.id} className="bg-white p-4 rounded-[6px] border border-gray-200 shadow-sm flex flex-col gap-3">
                      <div className="w-full aspect-[3/4] bg-stone-100 border rounded overflow-hidden relative">
                        <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col gap-1">
                        <h3 className="font-bold text-[14px] text-gray-900 uppercase tracking-wide">{card.title}</h3>
                      </div>
                      <button
                        onClick={() => setEditingHomeCard(card)}
                        className="border border-gray-300 hover:border-black text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-[2px] transition-colors w-full mt-2"
                      >
                        Edit Card
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Editing Home Card Form */}
            {editingHomeCard && (
              <div className="bg-white p-8 rounded-[6px] border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center border-b pb-4 mb-6 border-gray-100">
                  <h3 className="text-[16px] font-bold text-gray-900 uppercase tracking-widest">
                    Edit Card: {editingHomeCard.title}
                  </h3>
                  <button
                    onClick={() => setEditingHomeCard(null)}
                    className="text-gray-400 hover:text-black border border-gray-300 hover:border-black px-3 py-1 rounded text-[11px] uppercase tracking-wider font-semibold"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={(e) => handleHomeCardSubmit(e, editingHomeCard.id)} className="flex flex-col gap-6 text-[12px] text-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-800 uppercase tracking-wider">Card Title</label>
                      <input
                        type="text"
                        value={editingHomeCard.title}
                        onChange={(e) => setEditingHomeCard({ ...editingHomeCard, title: e.target.value })}
                        className="border border-gray-300 px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-black text-[13px]"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <ImageUploader 
                      label="Card Image" 
                      value={editingHomeCard.image || ""} 
                      onChange={(url) => setEditingHomeCard({ ...editingHomeCard, image: url })} 
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-black hover:bg-stone-900 border border-black text-white text-[13px] font-bold uppercase tracking-wider py-4 rounded-[2px] transition-colors mt-4"
                  >
                    Save Card
                  </button>
                </form>
              </div>
            )}

            {/* Banners Section */}
            {!editingBanner && !editingHomeCard && (
              <div>
                <h2 className="text-[18px] font-semibold text-gray-900 uppercase tracking-widest mb-4">Hero Banners</h2>
                <div className="grid grid-cols-1 gap-6">
                  {db.banners.map((banner) => (
                  <div key={banner.id} className="bg-white p-6 rounded-[6px] border border-gray-200 shadow-sm flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-[240px] shrink-0 aspect-[16/9] bg-stone-100 border rounded overflow-hidden relative">
                      <img src={banner.image} alt={banner.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-[14px] text-gray-900 uppercase tracking-wide">{banner.name}</h3>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              banner.visible
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-gray-50 text-gray-500 border border-gray-200"
                            }`}
                          >
                            {banner.visible ? "Active Slide" : "Disabled Slide"}
                          </span>
                        </div>
                        <div className="text-[12px] text-gray-600 mt-3 flex flex-col gap-1">
                          <p><span className="font-bold">Text Heading:</span> {banner.title}</p>
                          <p><span className="font-bold">Redirect Path:</span> <code className="bg-stone-50 px-1 py-0.5 border text-stone-700 rounded font-mono">{banner.link}</code></p>
                          <p><span className="font-bold">Link Title:</span> {banner.linkLabel}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingBanner(banner)}
                          className="border border-gray-300 hover:border-black text-[11px] font-semibold uppercase tracking-wider px-4 py-2 rounded-[2px] transition-colors"
                        >
                          Customize Layout
                        </button>
                        <button
                          onClick={() => {
                            const updated = db.banners.map((b) =>
                              b.id === banner.id ? { ...b, visible: !b.visible } : b
                            );
                            saveDatabase({ ...db, banners: updated });
                          }}
                          className={`border text-[11px] font-semibold uppercase tracking-wider px-4 py-2 rounded-[2px] transition-colors ${
                            banner.visible
                              ? "border-red-200 text-red-600 hover:border-red-600"
                              : "border-green-200 text-green-600 hover:border-green-600"
                          }`}
                        >
                          {banner.visible ? "Turn Section Off" : "Turn Section On"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              </div>
            )}
            {editingBanner && (
              // Editing Banner Form Layout
              <div className="bg-white p-8 rounded-[6px] border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center border-b pb-4 mb-6 border-gray-100">
                  <h3 className="text-[16px] font-bold text-gray-900 uppercase tracking-widest">
                    Customize layout: {editingBanner.name}
                  </h3>
                  <button
                    onClick={() => setEditingBanner(null)}
                    className="text-gray-400 hover:text-black border border-gray-300 hover:border-black px-3 py-1 rounded text-[11px] uppercase tracking-wider font-semibold"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={(e) => handleBannerSubmit(e, editingBanner.id)} className="flex flex-col gap-6 text-[12px] text-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-800 uppercase tracking-wider">Promotional Heading</label>
                      <input
                        type="text"
                        value={editingBanner.title}
                        onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                        className="border border-gray-300 px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-black text-[13px]"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-800 uppercase tracking-wider">Link/Button Text</label>
                      <input
                        type="text"
                        value={editingBanner.linkLabel}
                        onChange={(e) => setEditingBanner({ ...editingBanner, linkLabel: e.target.value })}
                        className="border border-gray-300 px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-black text-[13px]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-800 uppercase tracking-wider">Redirect Target (URL path)</label>
                      <input
                        type="text"
                        value={editingBanner.link}
                        onChange={(e) => setEditingBanner({ ...editingBanner, link: e.target.value })}
                        className="border border-gray-300 px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-black text-[13px]"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <ImageUploader 
                        label="Banner Image" 
                        value={editingBanner.image || ""} 
                        onChange={(url) => setEditingBanner({ ...editingBanner, image: url })} 
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="banner-vis"
                      checked={editingBanner.visible}
                      onChange={(e) => setEditingBanner({ ...editingBanner, visible: e.target.checked })}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="banner-vis" className="font-bold text-gray-800 uppercase tracking-wider cursor-pointer">
                      Show this banner section on homepage
                    </label>
                  </div>

                  <div className="mt-8 border-t pt-8 border-gray-100">
                    <h4 className="text-[14px] font-bold text-gray-900 uppercase tracking-wider mb-4">Linked Products (Carousel)</h4>
                    <div className="flex flex-col gap-1.5 mb-6">
                      <label className="font-bold text-gray-800 uppercase tracking-wider">Row Title</label>
                      <input
                        type="text"
                        value={editingBanner.linkedProductsTitle || ""}
                        onChange={(e) => setEditingBanner({ ...editingBanner, linkedProductsTitle: e.target.value })}
                        className="border border-gray-300 px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-black text-[13px]"
                        placeholder="e.g. Silver Collection"
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {Array.from({ length: 8 }).map((_, i) => {
                        const productId = editingBanner.linkedProductIds?.[i];
                        const product = productId ? db.products.find(p => p.id === productId) : null;
                        return (
                          <div 
                            key={i} 
                            onClick={() => setSelectingSlotIndex(i)}
                            className="border border-dashed border-gray-300 rounded-[4px] p-2 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-black transition-colors aspect-[3/4] bg-gray-50 relative group"
                          >
                            <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-1.5 rounded z-10">Rank {i + 1}</span>
                            {product ? (
                              <>
                                <img src={product.images?.silver?.img1 || product.galleryImages?.[0] || "/placeholder.jpg"} className="absolute inset-0 w-full h-full object-cover rounded-[2px]" />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-[10px] p-1.5 text-center truncate">
                                  {product.title}
                                </div>
                              </>
                            ) : (
                              <span className="text-gray-400 font-semibold text-[11px] uppercase tracking-wider">Empty Slot</span>
                            )}
                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                              <span className="bg-white text-black text-[10px] font-bold px-2 py-1 rounded shadow">Change</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-black hover:bg-stone-900 border border-black text-white text-[13px] font-bold uppercase tracking-wider py-4 rounded-[2px] transition-colors mt-4"
                  >
                    Commit Layout Settings
                  </button>
                </form>
              </div>
            )}

            {/* Product Selection Modal */}
            {selectingSlotIndex !== null && editingBanner && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-[6px] w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl">
                  <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-[6px]">
                    <h3 className="font-bold text-[16px] text-gray-900 uppercase tracking-wider">Select Product for Rank {selectingSlotIndex + 1}</h3>
                    <button onClick={() => setSelectingSlotIndex(null)} className="text-gray-500 hover:text-black transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                  <div className="p-5 border-b border-gray-100 bg-white">
                    <input 
                      type="text" 
                      placeholder="Search catalog by product title or category..." 
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full border border-gray-300 rounded-[3px] px-4 py-3 text-[14px] focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div className="flex-1 overflow-y-auto p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 bg-gray-50">
                    <div 
                      onClick={() => {
                        const newIds = [...(editingBanner.linkedProductIds || Array(8).fill(null))];
                        newIds[selectingSlotIndex] = null;
                        setEditingBanner({ ...editingBanner, linkedProductIds: newIds });
                        setSelectingSlotIndex(null);
                        setProductSearch("");
                      }}
                      className="border-2 border-dashed border-red-300 bg-red-50 text-red-600 rounded-[4px] p-2 flex flex-col items-center justify-center cursor-pointer hover:bg-red-100 hover:border-red-400 transition-colors h-[200px]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      <span className="font-bold text-[12px] uppercase text-center tracking-wide">Clear Slot</span>
                    </div>
                    {db.products.filter(p => !p.isLimitedEdition && (p.title.toLowerCase().includes(productSearch.toLowerCase()) || p.category?.toLowerCase().includes(productSearch.toLowerCase()))).map(p => (
                      <div 
                        key={p.id}
                        onClick={() => {
                          const newIds = [...(editingBanner.linkedProductIds || Array(8).fill(null))];
                          newIds[selectingSlotIndex] = p.id;
                          setEditingBanner({ ...editingBanner, linkedProductIds: newIds });
                          setSelectingSlotIndex(null);
                          setProductSearch("");
                        }}
                        className="border border-gray-200 bg-white rounded-[4px] overflow-hidden cursor-pointer hover:border-black hover:shadow-md transition-all flex flex-col group relative h-[200px]"
                      >
                        <img src={p.images?.silver?.img1 || p.galleryImages?.[0] || "/placeholder.jpg"} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 bg-white/90 text-gray-800 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                          {p.price}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-[11px] p-2 text-center truncate font-medium">
                          {p.title}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: LABELS */}
        {activeTab === "labels" && (
          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-[6px] border border-gray-200 shadow-sm flex flex-col gap-4">
              <h3 className="text-[14px] font-bold text-gray-900 uppercase tracking-wider border-b pb-2">Create Product Overlays & Badges</h3>
              <form onSubmit={handleLabelSubmit} className="flex gap-4 items-end">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-800 uppercase tracking-wider">Badge Tag Name</label>
                  <input
                    type="text"
                    value={labelForm.name || ""}
                    onChange={(e) => setLabelForm({ ...labelForm, name: e.target.value })}
                    className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-black text-[12px] bg-white h-[38px]"
                    placeholder="e.g. Best seller, Limited Edition"
                    required
                  />
                </div>
                <div className="w-[120px] flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-800 uppercase tracking-wider">Badge Color</label>
                  <input
                    type="color"
                    value={labelForm.color || "#ffffff"}
                    onChange={(e) => setLabelForm({ ...labelForm, color: e.target.value })}
                    className="border border-gray-300 rounded focus:outline-none focus:border-black w-full h-[38px] p-0.5 cursor-pointer"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-black hover:bg-stone-900 border border-black text-white text-[12px] font-bold uppercase tracking-wider px-6 h-[38px] rounded-[2px] transition-colors"
                >
                  {editingLabel ? "Modify Badge" : "Create Badge"}
                </button>
                {editingLabel && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingLabel(null);
                      setLabelForm({ id: "", name: "", color: "#ffffff" });
                    }}
                    className="border border-gray-300 hover:border-black text-gray-600 hover:text-black text-[12px] font-bold uppercase tracking-wider px-4 h-[38px] rounded-[2px]"
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {db.labels.map((lbl) => (
                <div key={lbl.id} className="bg-white p-5 rounded-[6px] border border-gray-200 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0" style={{ backgroundColor: lbl.color }}></div>
                    <span className="font-semibold text-[13px] text-gray-900">{lbl.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingLabel(lbl);
                        setLabelForm(lbl);
                        setIsAddingLabel(false);
                      }}
                      className="text-stone-500 hover:text-black font-semibold uppercase text-[11px] tracking-wide"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteLabel(lbl.id)}
                      className="text-red-500 hover:text-red-700 font-semibold uppercase text-[11px] tracking-wide ml-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: ORDERS */}
        {activeTab === "orders" && (
          <div className="flex flex-col gap-6">
            {!editingOrder ? (
              <div className="bg-white rounded-[6px] border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-[12px] border-collapse">
                  <thead>
                    <tr className="bg-stone-100 text-gray-700 font-bold border-b border-gray-200">
                      <th className="p-4">Date</th>
                      <th className="p-4">Order Code</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Fulfillment Status</th>
                      <th className="p-4">Tracking Number</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {db.orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-stone-50">
                        <td className="p-4 text-gray-500 font-medium">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="p-4 font-bold text-gray-950">{order.id}</td>
                        <td className="p-4 font-medium text-gray-900">
                          {order.customerName}
                          <div className="text-[10px] text-gray-400 font-normal mt-0.5">{order.customerEmail}</div>
                        </td>
                        <td className="p-4 font-semibold text-gray-950">£ {order.total.toFixed(2)}</td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-semibold border ${
                              order.status === "Delivered"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : order.status === "Shipped"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : order.status === "Processing"
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                : order.status === "Cancelled"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-gray-50 text-gray-600 border-gray-200"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600 font-mono">
                          {order.trackingCode || <span className="text-gray-300">Unassigned</span>}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setEditingOrder(order)}
                            className="border border-gray-300 hover:border-black text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded transition-colors"
                          >
                            Track & Fulfill
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              // Order Edit and Tracking code Form Layout
              <div className="bg-white p-8 rounded-[6px] border border-gray-200 shadow-sm flex flex-col gap-6">
                <div className="flex justify-between items-center border-b pb-4 mb-2 border-gray-100">
                  <h3 className="text-[16px] font-bold text-gray-900 uppercase tracking-widest">
                    Manage Order {editingOrder.id}
                  </h3>
                  <button
                    onClick={() => setEditingOrder(null)}
                    className="text-gray-400 hover:text-black border border-gray-300 hover:border-black px-3 py-1 rounded text-[11px] uppercase tracking-wider font-semibold"
                  >
                    Back to List
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[12px]">
                  <div className="flex flex-col gap-4">
                    <h4 className="font-bold text-gray-900 uppercase tracking-wider border-b pb-2">Customer & Shipment Details</h4>
                    <p><span className="font-bold text-gray-600">Client Name:</span> {editingOrder.customerName}</p>
                    <p><span className="font-bold text-gray-600">Email Address:</span> {editingOrder.customerEmail}</p>
                    {editingOrder.customerPhone && <p><span className="font-bold text-gray-600">Phone:</span> {editingOrder.customerPhone}</p>}
                    <p><span className="font-bold text-gray-600">Delivery Address:</span> {editingOrder.shippingAddress}</p>
                    <p><span className="font-bold text-gray-600">Order Subtotal:</span> £ {editingOrder.subtotal.toFixed(2)}</p>
                    <p><span className="font-bold text-gray-600">Filing Date:</span> {new Date(editingOrder.date).toLocaleString()}</p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <h4 className="font-bold text-gray-900 uppercase tracking-wider border-b pb-2">Cart Purchase List</h4>
                    <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-2">
                      {editingOrder.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center border-b pb-2 last:border-b-0 border-gray-100">
                          <img src={item.image} alt={item.title} className="w-12 h-14 object-cover border rounded" />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{item.title}</p>
                            <p className="text-gray-500 font-normal uppercase text-[10px]">Metal: {item.color} | Qty: {item.quantity}</p>
                          </div>
                          <span className="font-semibold text-gray-900">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fulfillment Actions */}
                <form onSubmit={handleOrderSubmit} className="bg-stone-50 p-6 rounded border border-gray-200 mt-4 flex flex-col gap-4 text-[12px]">
                  <h4 className="font-bold text-gray-950 uppercase tracking-wider">Courier Dispatch & Shipment Status</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-700 uppercase tracking-wider">Fulfillment Status</label>
                      <select
                        value={editingOrder.status}
                        onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value as any })}
                        className="border border-gray-300 px-3 py-2.5 rounded focus:outline-none focus:border-black bg-white"
                      >
                        {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-700 uppercase tracking-wider">Delivery Carrier</label>
                      <input
                        type="text"
                        value={editingOrder.courier || ""}
                        onChange={(e) => setEditingOrder({ ...editingOrder, courier: e.target.value })}
                        className="border border-gray-300 px-3 py-2.5 rounded focus:outline-none focus:border-black bg-white"
                        placeholder="e.g. Royal Mail, DPD"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-700 uppercase tracking-wider">Courier Tracking Reference</label>
                      <input
                        type="text"
                        value={editingOrder.trackingCode || ""}
                        onChange={(e) => setEditingOrder({ ...editingOrder, trackingCode: e.target.value })}
                        className="border border-gray-300 px-3 py-2.5 rounded focus:outline-none focus:border-black bg-white"
                        placeholder="e.g. GB123456789RM"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-black hover:bg-stone-900 border border-black text-white text-[13px] font-bold uppercase tracking-wider py-4 rounded-[2px] transition-colors mt-2"
                  >
                    Save Fulfillment Details
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: NAVBAR CUSTOMIZER */}
        {activeTab === "navbar" && (
          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-[6px] border border-gray-200 shadow-sm flex flex-col gap-4">
              <h3 className="text-[14px] font-bold text-gray-900 uppercase tracking-wider border-b pb-2">Add Tab to Header Navigation Menu</h3>
              <form onSubmit={handleNavbarSubmit} className="flex gap-4 items-end">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-800 uppercase tracking-wider">Tab Name</label>
                  <input
                    type="text"
                    value={navbarTabForm.name || ""}
                    onChange={(e) => setNavbarTabForm({ ...navbarTabForm, name: e.target.value })}
                    className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-black text-[12px] bg-white h-[38px]"
                    placeholder="e.g. Sale, New Releases"
                    required
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-800 uppercase tracking-wider">Tab URL Link Path</label>
                  <input
                    type="text"
                    value={navbarTabForm.href || ""}
                    onChange={(e) => setNavbarTabForm({ ...navbarTabForm, href: e.target.value })}
                    className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-black text-[12px] bg-white h-[38px]"
                    placeholder="e.g. /outlet, /shop-by"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-black hover:bg-stone-900 border border-black text-white text-[12px] font-bold uppercase tracking-wider px-6 h-[38px] rounded-[2px] transition-colors"
                >
                  Add Tab
                </button>
              </form>
            </div>

            {editingNavbarTabFull ? (
              <div className="bg-white rounded-[6px] border border-gray-200 shadow-sm p-6 flex flex-col gap-6">
                <div className="flex justify-between items-center border-b pb-4">
                  <h3 className="text-[18px] font-bold text-gray-800">Edit Tab: {editingNavbarTabFull.name}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        // We also need to back out of history so it doesn't get messed up
                        if (window.history.state?.innerPage) window.history.back();
                        else setEditingNavbarTabFull(null);
                      }}
                      className="border border-gray-300 px-4 py-2 rounded text-[12px] font-bold uppercase text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-1"
                    >
                      <span>&larr;</span> Go Back
                    </button>
                    <button
                      onClick={() => {
                        const updated = db.navbarTabs.map(t => t.name === editingNavbarTabFull.name ? editingNavbarTabFull : t);
                        saveDatabase({ ...db, navbarTabs: updated });
                        if (window.history.state?.innerPage) window.history.back();
                        else setEditingNavbarTabFull(null);
                      }}
                      className="bg-black text-white px-4 py-2 rounded text-[12px] font-semibold uppercase transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>

                {editingNavbarTabFull.name === "Limited Edition" ? (
                  <div className="flex flex-col gap-8 w-full">
                    <div className="flex flex-col gap-4 border-b pb-6">
                      <h4 className="text-[16px] font-bold text-gray-800">Page Header & Intro Settings</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                          <ImageUploader
                            label="Top Banner Image"
                            value={db?.limitedEditionSettings?.bannerImage || ""}
                            acceptVideo={true}
                            onChange={(url) => db && saveDatabase({ ...db, limitedEditionSettings: { ...db.limitedEditionSettings, bannerImage: url } })}
                            onRemove={() => db && saveDatabase({ ...db, limitedEditionSettings: { ...db.limitedEditionSettings, bannerImage: "" } })}
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[12px] font-bold text-gray-700">Intro Title</label>
                          <input
                            type="text"
                            value={db?.limitedEditionSettings?.introTitle || ""}
                            onChange={(e) => db && saveDatabase({ ...db, limitedEditionSettings: { ...db.limitedEditionSettings, introTitle: e.target.value } })}
                            className="border border-gray-300 px-3 py-2 rounded text-[13px]"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[12px] font-bold text-gray-700">Intro Text Paragraph 1</label>
                        <textarea
                          value={db?.limitedEditionSettings?.introText1 || ""}
                          onChange={(e) => db && saveDatabase({ ...db, limitedEditionSettings: { ...db.limitedEditionSettings, introText1: e.target.value } })}
                          className="border border-gray-300 px-3 py-2 rounded text-[13px] h-20"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[12px] font-bold text-gray-700">Intro Text Paragraph 2</label>
                        <textarea
                          value={db?.limitedEditionSettings?.introText2 || ""}
                          onChange={(e) => db && saveDatabase({ ...db, limitedEditionSettings: { ...db.limitedEditionSettings, introText2: e.target.value } })}
                          className="border border-gray-300 px-3 py-2 rounded text-[13px] h-20"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-[16px] font-bold text-gray-800">Limited Edition Products</h4>
                        <button
                          onClick={() => {
                            startAddProduct();
                            setProductForm(prev => ({ ...prev, isLimitedEdition: true, collectionName: "Limited Edition" }));
                          }}
                          className="bg-black text-white text-[11px] uppercase tracking-wider px-4 py-2 rounded font-bold"
                        >
                          + Add Limited Product
                        </button>
                      </div>
                      <p className="text-[12px] text-gray-500">These products are excluded from the main catalog and are displayed in the alternating left/right layout on the Limited Edition page.</p>

                      {isAddingProduct || editingProduct?.isLimitedEdition ? (
                        <div className="border border-gray-200 rounded p-6 bg-stone-50 mt-4">
                          <h5 className="font-bold uppercase tracking-wider mb-4 border-b pb-2">{isAddingProduct ? "New Limited Product" : "Edit Limited Product"}</h5>
                          <form onSubmit={handleProductSubmit} className="flex flex-col gap-4 text-[12px]">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex flex-col gap-1">
                                <label className="font-bold">Product Title (Inner Page)</label>
                                <input required type="text" value={productForm.title || ""} onChange={(e) => setProductForm({ ...productForm, title: e.target.value })} className="border p-2 rounded" />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="font-bold">Price Value (£)</label>
                                <input required type="number" value={productForm.priceValue || 0} onChange={(e) => setProductForm({ ...productForm, priceValue: Number(e.target.value) })} className="border p-2 rounded" />
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="font-bold">Inner Page Description</label>
                              <textarea required value={productForm.description || ""} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} className="border p-2 rounded h-20" />
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-t pt-4 border-gray-200">
                              <div className="flex flex-col gap-1">
                                <label className="font-bold text-[#d2977a]">Showcase Title (Outer Layout)</label>
                                <input type="text" value={productForm.showcaseTitle || ""} onChange={(e) => setProductForm({ ...productForm, showcaseTitle: e.target.value })} className="border p-2 rounded" placeholder="e.g. ONLY YOU" />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="font-bold text-[#d2977a]">Showcase Text (Outer Layout)</label>
                                <textarea value={productForm.showcaseText || ""} onChange={(e) => setProductForm({ ...productForm, showcaseText: e.target.value })} className="border p-2 rounded h-20" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-t pt-4 border-gray-200">
                              <div className="flex flex-col gap-1">
                                <ImageUploader
                                  label="Primary Image"
                                  value={(productForm as any).img1_silver || ""}
                                  onChange={(url) => setProductForm({ ...productForm, img1_silver: url } as any)}
                                  onRemove={() => setProductForm({ ...productForm, img1_silver: "" } as any)}
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <ImageUploader
                                  label="Hover Image"
                                  value={(productForm as any).img2_silver || ""}
                                  onChange={(url) => setProductForm({ ...productForm, img2_silver: url } as any)}
                                  onRemove={() => setProductForm({ ...productForm, img2_silver: "" } as any)}
                                />
                              </div>
                            </div>
                            <div className="flex flex-col gap-4 border-t pt-4 border-gray-200 mt-2">
                              <span className="font-bold">Gallery Images</span>
                              <div className="grid grid-cols-2 gap-4">
                                {((productForm as any).gallery_silver || []).map((imgUrl: string, idx: number) => (
                                  <div key={`limited-gallery-${idx}`} className="flex flex-col gap-1">
                                    <ImageUploader 
                                      label={`Gallery Image ${idx + 1}`} 
                                      value={imgUrl} 
                                      acceptVideo={true}
                                      onChange={(url) => {
                                        const newGallery = [...((productForm as any).gallery_silver || [])];
                                        newGallery[idx] = url;
                                        setProductForm({ ...productForm, ...({ gallery_silver: newGallery } as any) });
                                      }} 
                                      onRemove={() => {
                                        const newGallery = [...((productForm as any).gallery_silver || [])];
                                        newGallery.splice(idx, 1);
                                        setProductForm({ ...productForm, ...({ gallery_silver: newGallery } as any) });
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                              {((productForm as any).gallery_silver || []).length < 6 && (
                                <button 
                                  type="button" 
                                  onClick={() => {
                                    const newGallery = [...((productForm as any).gallery_silver || []), ""];
                                    setProductForm({ ...productForm, ...({ gallery_silver: newGallery } as any) });
                                  }}
                                  className="w-full border border-dashed border-gray-400 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider hover:bg-stone-50 hover:text-gray-800 transition-colors rounded"
                                >
                                  + Add Gallery Image
                                </button>
                              )}
                            </div>
                            <div className="flex gap-2 justify-end mt-4">
                              <button type="button" onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }} className="border px-4 py-2 rounded font-bold uppercase text-gray-500 hover:text-black">Cancel</button>
                              <button type="submit" className="bg-black text-white px-4 py-2 rounded font-bold uppercase">Save Limited Product</button>
                            </div>
                          </form>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4 mt-2">
                          {db?.products.filter(p => p.isLimitedEdition).map((prod) => (
                            <div key={prod.id} className="border rounded p-4 flex justify-between items-center bg-white shadow-sm">
                              <div className="flex items-center gap-4">
                                <img src={prod.images?.silver?.img1} alt={prod.title} className="w-16 h-16 object-cover rounded border" />
                                <div>
                                  <h5 className="font-bold text-[14px]">{prod.title} <span className="text-gray-400 font-normal ml-2">{prod.price}</span></h5>
                                  <p className="text-[11px] text-gray-500 font-mono mt-1">Showcase: {prod.showcaseTitle}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => editProduct(prod)} className="border px-3 py-1 text-[11px] font-bold uppercase rounded hover:border-black">Edit</button>
                                <button onClick={() => setProductToDelete(prod)} className="border border-red-200 text-red-600 px-3 py-1 text-[11px] font-bold uppercase rounded hover:border-red-600">Delete</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-[12px] font-bold text-gray-700">Tab Name</label>
                      <input
                        type="text"
                        value={editingNavbarTabFull.name}
                        onChange={(e) => setEditingNavbarTabFull({ ...editingNavbarTabFull, name: e.target.value })}
                        className="border border-gray-300 px-3 py-2 rounded text-[14px]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] font-bold text-gray-700">Href / Path</label>
                      <input
                        type="text"
                        value={editingNavbarTabFull.href}
                        onChange={(e) => setEditingNavbarTabFull({ ...editingNavbarTabFull, href: e.target.value })}
                        className="border border-gray-300 px-3 py-2 rounded text-[14px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[14px] font-bold text-gray-800">Group Filters (Top Filters)</h4>
                    <button
                      onClick={() => {
                        const newFilters = [...(editingNavbarTabFull.groupFilters || []), "New Filter"];
                        setEditingNavbarTabFull({ ...editingNavbarTabFull, groupFilters: newFilters });
                      }}
                      className="text-[11px] bg-gray-100 px-3 py-1 rounded font-semibold border"
                    >
                      + Add Filter
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {(editingNavbarTabFull.groupFilters || []).map((filter, fIdx) => (
                      <div key={fIdx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={filter}
                          onChange={(e) => {
                            const newFilters = [...(editingNavbarTabFull.groupFilters || [])];
                            newFilters[fIdx] = e.target.value;
                            setEditingNavbarTabFull({ ...editingNavbarTabFull, groupFilters: newFilters });
                          }}
                          className="border border-gray-300 px-2 py-1.5 rounded text-[12px] flex-1"
                        />
                        <button
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this filter?")) {
                              const newFilters = [...(editingNavbarTabFull.groupFilters || [])];
                              newFilters.splice(fIdx, 1);
                              setEditingNavbarTabFull({ ...editingNavbarTabFull, groupFilters: newFilters });
                            }
                          }}
                          className="text-red-500 font-bold px-2 py-1 text-[12px]"
                        >
                          x
                        </button>
                      </div>
                    ))}
                    {(!editingNavbarTabFull.groupFilters || editingNavbarTabFull.groupFilters.length === 0) && (
                      <p className="text-[12px] text-gray-500 italic">No group filters added yet.</p>
                    )}
                  </div>
                </div>


                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[14px] font-bold text-gray-800">Mega Menu Details</h4>
                    <button
                      onClick={() => {
                        const megaMenu = editingNavbarTabFull.megaMenu || { columns: [] };
                        setEditingNavbarTabFull({ ...editingNavbarTabFull, megaMenu: { ...megaMenu, columns: [...megaMenu.columns, { title: "New Column", links: [] }] } });
                      }}
                      className="text-[11px] bg-gray-100 px-3 py-1 rounded font-semibold border"
                    >
                      + Add Column
                    </button>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <ImageUploader
                        label="Feature Image"
                        value={editingNavbarTabFull.megaMenu?.featureImage || ""}
                        onChange={(url) => setEditingNavbarTabFull({ ...editingNavbarTabFull, megaMenu: { ...(editingNavbarTabFull.megaMenu || { columns: [] }), featureImage: url } })}
                        onRemove={() => setEditingNavbarTabFull({ ...editingNavbarTabFull, megaMenu: { ...(editingNavbarTabFull.megaMenu || { columns: [] }), featureImage: "" } })}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] font-bold text-gray-700">Feature Title</label>
                      <input
                        type="text"
                        value={editingNavbarTabFull.megaMenu?.featureTitle || ""}
                        onChange={(e) => setEditingNavbarTabFull({ ...editingNavbarTabFull, megaMenu: { ...(editingNavbarTabFull.megaMenu || { columns: [] }), featureTitle: e.target.value } })}
                        className="border border-gray-300 px-3 py-2 rounded text-[14px]"
                        placeholder="e.g. Featured Items"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mt-6">
                    {(editingNavbarTabFull.megaMenu?.columns || []).map((col, cIdx) => (
                      <div key={cIdx} className="border rounded p-4 flex flex-col gap-4 bg-gray-50">
                        <div className="flex justify-between items-center">
                          <input
                            type="text"
                            value={col.title}
                            onChange={(e) => {
                              const newCols = [...editingNavbarTabFull.megaMenu!.columns];
                              newCols[cIdx].title = e.target.value;
                              setEditingNavbarTabFull({ ...editingNavbarTabFull, megaMenu: { ...editingNavbarTabFull.megaMenu!, columns: newCols } });
                            }}
                            className="border border-gray-300 px-2 py-1 rounded text-[12px] font-bold uppercase w-2/3"
                            placeholder="Column Title"
                          />
                          <button
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this column?")) {
                                const newCols = [...editingNavbarTabFull.megaMenu!.columns];
                                newCols.splice(cIdx, 1);
                                setEditingNavbarTabFull({ ...editingNavbarTabFull, megaMenu: { ...editingNavbarTabFull.megaMenu!, columns: newCols } });
                              }
                            }}
                            className="text-red-500 text-[10px] font-bold uppercase"
                          >
                            Delete Col
                          </button>
                        </div>

                        <div className="flex flex-col gap-2">
                          {col.links.map((link, lIdx) => (
                            <div key={lIdx} className="flex flex-col gap-1 border-b pb-2 mb-1">
                              <div className="flex justify-between">
                                <input
                                  type="text"
                                  value={link.name}
                                  onChange={(e) => {
                                    const newCols = [...editingNavbarTabFull.megaMenu!.columns];
                                    const newName = e.target.value;
                                    newCols[cIdx].links[lIdx].name = newName;
                                    // Auto-update the href based on the new name
                                    newCols[cIdx].links[lIdx].href = `${editingNavbarTabFull.href}?filter=${newName}`;
                                    setEditingNavbarTabFull({ ...editingNavbarTabFull, megaMenu: { ...editingNavbarTabFull.megaMenu!, columns: newCols } });
                                  }}
                                  className="border border-gray-300 px-2 py-1 rounded text-[12px] w-full"
                                  placeholder="Link Name"
                                />
                                <button
                                  onClick={() => {
                                    if (confirm("Are you sure you want to delete this link?")) {
                                      const newCols = [...editingNavbarTabFull.megaMenu!.columns];
                                      newCols[cIdx].links.splice(lIdx, 1);
                                      setEditingNavbarTabFull({ ...editingNavbarTabFull, megaMenu: { ...editingNavbarTabFull.megaMenu!, columns: newCols } });
                                    }
                                  }}
                                  className="text-red-500 font-bold px-2"
                                >
                                  x
                                </button>
                              </div>
                              <input
                                type="text"
                                value={link.href}
                                onChange={(e) => {
                                  const newCols = [...editingNavbarTabFull.megaMenu!.columns];
                                  newCols[cIdx].links[lIdx].href = e.target.value;
                                  setEditingNavbarTabFull({ ...editingNavbarTabFull, megaMenu: { ...editingNavbarTabFull.megaMenu!, columns: newCols } });
                                }}
                                className="border border-gray-300 px-2 py-1 rounded text-[10px] text-gray-500 font-mono w-full"
                                placeholder="/path?filter=..."
                              />
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              const newCols = [...editingNavbarTabFull.megaMenu!.columns];
                              newCols[cIdx].links.push({ name: "New Link", href: "#" });
                              setEditingNavbarTabFull({ ...editingNavbarTabFull, megaMenu: { ...editingNavbarTabFull.megaMenu!, columns: newCols } });
                            }}
                            className="text-[10px] text-[#ac2505] font-bold text-left mt-2"
                          >
                            + Add Link
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-red-100 flex justify-between items-center">
                  <span className="text-[12px] text-gray-500">Danger Zone</span>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete the entire tab "${editingNavbarTabFull.name}"?`)) {
                        deleteNavbarTab(editingNavbarTabFull.name);
                        setEditingNavbarTabFull(null);
                      }
                    }}
                    className="border border-red-200 bg-red-50 hover:bg-red-500 hover:text-white text-red-600 px-4 py-2 rounded text-[12px] font-semibold uppercase transition-colors"
                  >
                    Delete Tab Completely
                  </button>
                </div>
                  </>
                )}
              </div>
            ) : (
            <div className="bg-white rounded-[6px] border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-stone-100 flex justify-between items-center text-[12px] font-bold text-gray-700">
                <span>Active Navbar Menu Tabs</span>
                <span>Actions</span>
              </div>
              <div className="flex flex-col">
                {db.navbarTabs.map((tab, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border-b last:border-b-0 border-gray-100 text-[12px]">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#d2977a]">{idx + 1}.</span>
                      <span className="font-semibold text-gray-900 text-[13px]">{tab.name}</span>
                      <code className="bg-stone-50 px-1 py-0.5 border text-stone-600 rounded font-mono text-[10px]">{tab.href}</code>
                      {tab.megaMenu && tab.megaMenu.columns && tab.megaMenu.columns.length > 0 && (
                        <span className="bg-[#e6f4f1] text-[#2c786c] px-2 py-0.5 rounded text-[10px] font-bold">Has Mega Menu</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const updated = [...db.navbarTabs];
                          updated[idx] = { ...tab, isHidden: !tab.isHidden };
                          saveDatabase({ ...db, navbarTabs: updated });
                        }}
                        className={`border ${tab.isHidden ? 'border-green-300 hover:border-green-600 text-green-700 bg-green-50' : 'border-gray-300 hover:border-black text-gray-700 hover:text-black'} text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded transition-colors`}
                      >
                        {tab.isHidden ? 'Show Tab' : 'Hide Tab'}
                      </button>
                      <button
                        onClick={() => setEditingNavbarTabFull(JSON.parse(JSON.stringify(tab)))}
                        className="border border-gray-300 hover:border-black text-gray-700 hover:text-black text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded transition-colors"
                      >
                        Edit Tab & Menu
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}
          </div>
        )}

        {/* TAB 8: GLOBAL SETTINGS */}
        {activeTab === "settings" && (
          <div className="bg-white p-8 rounded-[6px] border border-gray-200 shadow-sm">
            <form onSubmit={handleSettingsSubmit} className="flex flex-col gap-6 text-[12px] text-gray-700">
              <h3 className="text-[16px] font-bold text-gray-900 uppercase tracking-widest border-b pb-4 mb-2">Checkout & Accordions Settings</h3>

              <div className="flex flex-col gap-4 bg-stone-50 p-6 rounded border border-gray-200">
                <h4 className="font-bold text-gray-950 uppercase tracking-wider border-b pb-2 mb-2">Checkout Instalment Badges</h4>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={db.settings.klarnaEnabled}
                      onChange={(e) => setDb({
                        ...db,
                        settings: { ...db.settings, klarnaEnabled: e.target.checked }
                      })}
                    />
                    Klarna Badge Visible
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={db.settings.paypalEnabled}
                      onChange={(e) => setDb({
                        ...db,
                        settings: { ...db.settings, paypalEnabled: e.target.checked }
                      })}
                    />
                    PayPal Badge Visible
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-800 uppercase tracking-wider">Number of Installment Payments</label>
                    <input
                      type="number"
                      value={db.settings.installmentsCount || 3}
                      onChange={(e) => setDb({
                        ...db,
                        settings: { ...db.settings, installmentsCount: Number(e.target.value) }
                      })}
                      className="border border-gray-300 px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-black text-[13px] bg-white"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-800 uppercase tracking-wider">Klarna Financing Legal Disclaimer</label>
                    <input
                      type="text"
                      value={db.settings.legalDisclaimer || ""}
                      onChange={(e) => setDb({
                        ...db,
                        settings: { ...db.settings, legalDisclaimer: e.target.value }
                      })}
                      className="border border-gray-300 px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-black text-[13px] bg-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Global Shipping Policy settings */}
              <div className="flex flex-col gap-4 bg-stone-50 p-6 rounded border border-gray-200">
                <h4 className="font-bold text-gray-950 uppercase tracking-wider border-b pb-2 mb-2">Global Shipping & Returns Policy Accordion</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-800 uppercase tracking-wider">Free Returns Days Threshold</label>
                    <input
                      type="number"
                      value={db.settings.shippingReturns.freeReturnsDays || 30}
                      onChange={(e) => setDb({
                        ...db,
                        settings: {
                          ...db.settings,
                          shippingReturns: {
                            ...db.settings.shippingReturns,
                            freeReturnsDays: Number(e.target.value)
                          }
                        }
                      })}
                      className="border border-gray-300 px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-black text-[13px] bg-white"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-800 uppercase tracking-wider">Delivery Terms Title</label>
                    <input
                      type="text"
                      value={db.settings.shippingReturns.freeDeliveryText || ""}
                      onChange={(e) => setDb({
                        ...db,
                        settings: {
                          ...db.settings,
                          shippingReturns: {
                            ...db.settings.shippingReturns,
                            freeDeliveryText: e.target.value
                          }
                        }
                      })}
                      className="border border-gray-300 px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-black text-[13px] bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-800 uppercase tracking-wider">Handcrafted Origin Copy</label>
                    <input
                      type="text"
                      value={db.settings.shippingReturns.handcraftedText || ""}
                      onChange={(e) => setDb({
                        ...db,
                        settings: {
                          ...db.settings,
                          shippingReturns: {
                            ...db.settings.shippingReturns,
                            handcraftedText: e.target.value
                          }
                        }
                      })}
                      className="border border-gray-300 px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-black text-[13px] bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-800 uppercase tracking-wider">Contact Link Path</label>
                    <input
                      type="text"
                      value={db.settings.shippingReturns.helpLink || ""}
                      onChange={(e) => setDb({
                        ...db,
                        settings: {
                          ...db.settings,
                          shippingReturns: {
                            ...db.settings.shippingReturns,
                            helpLink: e.target.value
                          }
                        }
                      })}
                      className="border border-gray-300 px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-black text-[13px] bg-white"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="bg-black hover:bg-stone-900 border border-black text-white text-[13px] font-bold uppercase tracking-wider py-4 rounded-[2px] transition-colors mt-4"
              >
                Save Global Configuration Settings
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Delete Product Confirmation Modal */}
      {productToDelete && (
        <div className={`fixed inset-0 bg-black/50 z-[105] flex items-start justify-center px-4 transition-opacity duration-300 ${isClosingDeleteModal ? "opacity-0" : "opacity-100"}`}>
          <div className={`bg-[#fffbf7] w-full max-w-[500px] shadow-2xl flex flex-col ${isClosingDeleteModal ? "animate-slideUp" : "animate-slideDown"}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-[16px] font-medium text-gray-900">Remove Product?</h3>
              <button onClick={cancelDeleteProduct} className="text-gray-500 hover:text-black transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            {/* Body */}
            <div className="p-4 py-6 border-b border-gray-200">
              <p className="text-[14px] text-gray-800 mb-1">Are you sure you want to remove the following product from the store?</p>
              <p className="text-[14px] text-gray-600">{productToDelete.title}</p>
            </div>
            {/* Footer */}
            <div className="p-4 flex justify-end gap-4">
              <button onClick={cancelDeleteProduct} className="w-[120px] py-2 border border-black text-gray-800 text-[14px] font-medium hover:bg-black hover:text-white transition-colors bg-[#fffbf7] flex justify-center items-center">
                Cancel
              </button>
              <button onClick={confirmDeleteProduct} className="w-[120px] py-2 bg-[#221f1f] text-white text-[14px] font-medium hover:bg-[#fffbf7] hover:text-black border border-[#221f1f] hover:border-black transition-colors flex justify-center items-center">
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

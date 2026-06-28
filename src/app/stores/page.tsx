"use client";

import { useState, useEffect } from "react";

interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
  phone: string;
  email: string;
  googleMapsUrl: string;
}

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/db")
      .then((res) => res.json())
      .then((data) => {
        if (data.stores && data.stores.length > 0) {
          setStores(data.stores);
          setSelectedStore(data.stores[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading stores:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-70px)] bg-white text-gray-500 font-medium">
        Loading store locations...
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-70px)] bg-white text-gray-500 font-medium">
        No store locations configured.
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-70px)] bg-white">
      {/* Left Panel */}
      <div className="w-full md:w-[380px] lg:w-[450px] p-6 md:p-8 flex-shrink-0 bg-white z-10 shadow-md md:shadow-none overflow-y-auto border-r border-gray-100 flex flex-col gap-6">
        <h1 className="text-[22px] font-medium text-[#c43e27]">Stores</h1>
        
        <div className="flex flex-col gap-5">
          {stores.map((store) => {
            // Smart URL handling: if they paste an entire iframe, extract the src.
            let buttonLink = store.googleMapsUrl;
            let mapEmbedLink = store.googleMapsUrl;
            
            const iframeMatch = store.googleMapsUrl?.match(/src="([^"]+)"/);
            if (iframeMatch && iframeMatch[1]) {
              mapEmbedLink = iframeMatch[1];
              
              // Smart coordinate extraction: grab exact Latitude and Longitude from the embed code
              const latMatch = mapEmbedLink.match(/!3d(-?\d+(\.\d+)?)/);
              const lngMatch = mapEmbedLink.match(/!2d(-?\d+(\.\d+)?)/);
              
              if (latMatch && lngMatch) {
                buttonLink = `https://www.google.com/maps/dir/?api=1&destination=${latMatch[1]},${lngMatch[1]}`;
              } else {
                buttonLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${store.name}, ${store.address}, ${store.city}, ${store.postcode}, ${store.country}`)}`;
              }
            } else if (!store.googleMapsUrl || store.googleMapsUrl.includes('/maps/embed')) {
              // It's already an embed link or empty
              buttonLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${store.name}, ${store.address}, ${store.city}, ${store.postcode}, ${store.country}`)}`;
            } else {
               // Normal shortened link (e.g. maps.app.goo.gl) - map can't embed it, fallback to dynamic address
               mapEmbedLink = `https://maps.google.com/maps?q=${encodeURIComponent(`${store.name}, ${store.address}, ${store.city}, ${store.country}`)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
            }

            return (
              <div
                key={store.id}
                onClick={() => setSelectedStore(store)}
                className={`p-5 cursor-pointer border transition-all rounded-[3px] ${
                  selectedStore?.id === store.id
                    ? "border-[#d2977a] bg-[#fffbf7]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <p className="font-semibold text-[15px] text-gray-900 mb-2">{store.name}</p>
                <div className="text-gray-600 leading-relaxed text-[13px]">
                  <p>{store.address}</p>
                  <p>{store.postcode} {store.city}</p>
                  <p>{store.country}</p>
                  {store.phone && <p className="mt-3 font-medium text-gray-800">Phone: {store.phone}</p>}
                  {store.email && <p className="font-medium text-gray-800">Email: {store.email}</p>}
                  
                  <a 
                    href={buttonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block bg-[#c43e27] text-white px-4 py-2 rounded text-[13px] font-medium hover:bg-[#a93320] transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Map Panel */}
      <div className="flex-1 min-h-[400px] md:min-h-auto relative bg-[#e5e3df]">
        {selectedStore && (() => {
          let mapEmbedLink = selectedStore.googleMapsUrl;
          const iframeMatch = selectedStore.googleMapsUrl?.match(/src="([^"]+)"/);
          if (iframeMatch && iframeMatch[1]) {
            mapEmbedLink = iframeMatch[1];
          } else if (selectedStore.googleMapsUrl && !selectedStore.googleMapsUrl.includes('/maps/embed')) {
            mapEmbedLink = `https://maps.google.com/maps?q=${encodeURIComponent(`${selectedStore.name}, ${selectedStore.address}, ${selectedStore.city}, ${selectedStore.country}`)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
          }

          return (
            <iframe 
              src={mapEmbedLink || `https://maps.google.com/maps?q=${encodeURIComponent(`${selectedStore.name}, ${selectedStore.address}, ${selectedStore.city}, ${selectedStore.country}`)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              className="absolute inset-0 w-full h-full border-0" 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title={`${selectedStore.name} Map`}
            ></iframe>
          );
        })()}
      </div>
    </div>
  );
}


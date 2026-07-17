"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Search, MapPin, Phone, Mail } from "lucide-react";
import type { Reseller } from "./map-view";

interface ResellerSectionProps {
  translations: {
    title: string;
    searchPlaceholder: string;
    noResults: string;
    loading: string;
  };
}

// Dynamically import MapView with no SSR
const MapView = dynamic(() => import("./map-view"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  ),
});

// Initial data
const INITIAL_RESELLERS: Reseller[] = [
  {
    id: "1",
    name: "PAPEX - PAPETERIE EXPRESS",
    address: "56, Rue Abdou Karim BOURGI",
    city: "Dakar",
    country: "Sénégal",
    phone: "+221 33 849 63 63",
    fax: "+221 33 821 21 02",
    email: "contact@papex.sn",
    lat: 14.6715,
    lng: -17.4370,
  },
  {
    id: "2",
    name: "PAPICI - TOP BURO",
    address: "1 Bd Valéry Giscard d'Estaing",
    city: "Abidjan",
    country: "Côte d'Ivoire",
    phone: "+225 27 21 28 20 78",
    lat: 5.3000,
    lng: -3.9960,
  },
  {
    id: "4",
    name: "Bureau Vallée Sainte Marie",
    address: "Gillot Est - Retail Park",
    city: "Sainte-Marie (La Réunion)",
    country: "France",
    lat: -20.8930,
    lng: 55.5250,
  },
  {
    id: "5",
    name: "Hachette Pacifique",
    address: "FC2C+7XJ, Vallée de Tipaerui",
    city: "Papeete",
    country: "Polynésie française",
    phone: "+689 40 46 17 00",
    lat: -17.5410,
    lng: -149.5760,
  },
];

export function ResellerSection({ translations }: ResellerSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReseller, setSelectedReseller] = useState<Reseller | null>(INITIAL_RESELLERS[0]);

  const filteredResellers = useMemo(() => {
    return INITIAL_RESELLERS.filter((reseller) =>
      reseller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reseller.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reseller.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const mapCenter: [number, number] = selectedReseller
    ? [selectedReseller.lat, selectedReseller.lng]
    : [14.6928, -17.4467]; // Default to Dakar center if none selected
  const mapZoom = selectedReseller ? 16 : 12;

  return (
    <section className="py-12 bg-white w-full overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
        <h2 className="text-3xl font-bold text-center mb-8">{translations.title}</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:h-[600px]">
          {/* Left Column: Search & List */}
          <div className="lg:col-span-1 flex flex-col gap-4 h-[400px] lg:h-auto lg:max-h-[600px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={translations.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto border rounded-lg p-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {filteredResellers.map((reseller) => (
                <div
                  key={reseller.id}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedReseller?.id === reseller.id
                      ? "bg-blue-50 border-blue-200 border"
                      : "hover:bg-gray-50 border border-transparent"
                  }`}
                  onClick={() => setSelectedReseller(reseller)}
                >
                  <h3 className="font-semibold text-lg">{reseller.name}</h3>
                  <div className="text-sm text-gray-600 space-y-1 mt-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>{reseller.address}<br/>{reseller.city}, {reseller.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 shrink-0" />
                      <span>{reseller.phone || "N/A"}</span>
                    </div>
                    {reseller.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 shrink-0" />
                        <a href={`mailto:${reseller.email}`} className="text-blue-600 hover:underline">
                          {reseller.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {filteredResellers.length === 0 && (
                <p className="text-center text-gray-500 py-4">{translations.noResults}</p>
              )}
            </div>
          </div>

          {/* Right Column: Map */}
          <div className="lg:col-span-2 h-[300px] lg:h-full rounded-lg overflow-hidden border shadow-sm relative z-0">
             <MapView
               center={mapCenter}
               zoom={mapZoom}
               resellers={INITIAL_RESELLERS}
               selectedReseller={selectedReseller}
               onSelectReseller={setSelectedReseller}
             />
          </div>
        </div>
      </div>
    </section>
  );
}

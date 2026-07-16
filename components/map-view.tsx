"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix for default marker icon
// @ts-expect-error - _getIconUrl est une propriété interne non typée de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export interface Reseller {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone?: string;
  fax?: string;
  email?: string;
  lat: number;
  lng: number;
}

interface MapViewProps {
  center: [number, number];
  zoom: number;
  resellers: Reseller[];
  selectedReseller: Reseller | null;
  onSelectReseller: (reseller: Reseller) => void;
}

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function MapView({ center, zoom, resellers, onSelectReseller }: MapViewProps) {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
      <ChangeView center={center} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {resellers.map((reseller) => (
        <Marker
          key={reseller.id}
          position={[reseller.lat, reseller.lng]}
          eventHandlers={{
            click: () => onSelectReseller(reseller),
          }}
        >
          <Popup>
            <div className="text-sm">
              <h3 className="font-bold">{reseller.name}</h3>
              <p>{reseller.address}</p>
              <p>{reseller.city}, {reseller.country}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

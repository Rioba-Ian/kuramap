
"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { RegistrationCenter } from "@/lib/data";

// Fix for default Leaflet marker icons in Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

const UserIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface InteractiveMapProps {
  centers: RegistrationCenter[];
  onSelectCenter?: (center: RegistrationCenter) => void;
  userLocation: { lat: number; lng: number } | null;
}

function MapUpdater({ center }: { center: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], 13);
    }
  }, [center, map]);
  return null;
}

export function InteractiveMap({ centers, onSelectCenter, userLocation }: InteractiveMapProps) {
  const defaultCenter = { lat: -1.2921, lng: 36.8219 }; // Nairobi CBD

  return (
    <div className="h-full w-full rounded-3xl overflow-hidden border-2 border-white shadow-inner bg-muted">
      <MapContainer
        center={[defaultCenter.lat, defaultCenter.lng]}
        zoom={12}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater center={userLocation} />

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={UserIcon}>
            <Popup>
              <div className="font-bold">Your Location</div>
            </Popup>
          </Marker>
        )}

        {centers.map((center) => (
          <Marker
            key={center.id}
            position={[center.coordinates.lat, center.coordinates.lng]}
            eventHandlers={{
              click: () => onSelectCenter?.(center),
            }}
          >
            <Popup>
              <div className="p-1">
                <h4 className="font-bold text-primary">{center.name}</h4>
                <p className="text-xs text-muted-foreground">{center.address}</p>
                <button 
                  className="mt-2 text-xs font-bold text-secondary hover:underline"
                  onClick={() => onSelectCenter?.(center)}
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

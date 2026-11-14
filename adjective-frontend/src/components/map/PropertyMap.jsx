"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";

// Fix default marker
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function PropertyMap({
  latitude,
  longitude,
  propertyName,
}) {
  if (
    latitude === null ||
    longitude === null ||
    latitude === undefined ||
    longitude === undefined
  ) {
    return null;
  }

  const lat = Number(latitude);
  const lng = Number(longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  const googleMapUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <section className="bg-white rounded-2xl p-6 md:p-8 border border-outline-variant/10 premium-shadow space-y-5">
      <div>
        <h3 className="font-display text-xl text-[#1b1b1d] flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#5E6623]" />
          Exact Property Location
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Explore the exact location of this property.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border h-[420px]">
        <MapContainer
          center={[lat, lng]}
          zoom={16}
          scrollWheelZoom={true}
          attributionControl={false}
          className="h-full w-full"
        >
          <TileLayer
            url="/api/tiles/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={19}
          />

          <Marker position={[lat, lng]}>
            <Popup>{propertyName}</Popup>
          </Marker>
        </MapContainer>
      </div>

      <a
        href={googleMapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-5 py-3 rounded-lg bg-[#5E6623] text-white font-semibold hover:bg-[#4E541E] transition"
      >
        Open in Google Maps
      </a>
    </section>
  );
}
"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  Polygon,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";
import { AREAS } from "./areaConfig";

/* =====================================================
   PROPERTY RED MARKER
===================================================== */

const redIcon =
  typeof window !== "undefined"
    ? L.divIcon({
        className: "property-red-marker",
        html: `
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="42"
            viewBox="0 0 32 42"
          >
            <path
              d="M16 0C7.163 0 0 7.163 0 16c0 10.667 16 26 16 26s16-15.333 16-26C32 7.163 24.837 0 16 0z"
              fill="#E53935"
            />

            <circle
              cx="16"
              cy="16"
              r="7"
              fill="white"
            />

            <circle
              cx="16"
              cy="16"
              r="3"
              fill="#E53935"
            />
          </svg>
        `,
        iconSize: [32, 42],
        iconAnchor: [16, 42],
        popupAnchor: [0, -42],
      })
    : null;

const createPropertyIcon = (property) => {
  if (typeof window === "undefined") return null;

  const isReraRegistered = Boolean(
    property.isRERAApproved ||
      property.reraNumber ||
      property.reraId
  );
  const color = isReraRegistered ? "#5E6623" : "#E53935";

  return L.divIcon({
    className: "property-location-marker",
    html: `
      <div
        aria-label="${isReraRegistered ? "WB RERA registered property" : "Property location"}"
        style="
          position: relative;
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 50% 50% 50% 8px;
          transform: rotate(-45deg);
          background: ${color};
          border: 3px solid #ffffff;
          box-shadow: 0 5px 14px rgba(27, 27, 29, 0.28);
        "
      >
        <svg
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          style="transform: rotate(45deg)"
        >
          <path d="M4 20V9.5L12 4l8 5.5V20" stroke="#ffffff" stroke-width="2" stroke-linejoin="round" />
          <path d="M9 20v-5h6v5" stroke="#ffffff" stroke-width="2" />
          ${isReraRegistered ? `
            <circle cx="18" cy="6" r="4" fill="#D3A62E" stroke="#ffffff" stroke-width="1.5" />
            <path d="m16.3 6 1.1 1.1 2.3-2.3" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
          ` : ""}
        </svg>
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 39],
    popupAnchor: [0, -39],
  });
};

/* =====================================================
   AREA LABEL MARKER
===================================================== */

const createAreaLabelIcon = (label) => {
  if (typeof window === "undefined") return null;

  return L.divIcon({
    className: "area-label-badge",
    html: `
      <div style="
        background: rgba(27, 27, 29, 0.88);
        backdrop-filter: blur(8px);
        color: #ffffff;
        padding: 7px 14px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 1.2px;
        text-transform: uppercase;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        border: 1px solid rgba(255,255,255,0.25);
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        gap: 7px;
        pointer-events: none;
      ">
        <span style="
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #4CAF50;
          display: inline-block;
          box-shadow: 0 0 8px #4CAF50;
        "></span>

        ${label}
      </div>
    `,
    iconSize: [160, 34],
    iconAnchor: [80, 17],
  });
};

/* 
   UPDATE MAP WHEN AREA CHANGES
 */

function MapUpdater({ selectedArea }) {
  const map = useMap();

  useEffect(() => {
    const area = AREAS[selectedArea];

    if (!area) return;

    if (area.polygon && area.polygon.length > 2) {
      map.flyToBounds(area.polygon, {
        padding: [30, 30],
        duration: 1.2,
        maxZoom: area.zoom,
      });
    } else {
      map.flyTo(area.center, area.zoom, {
        duration: 1.2,
      });
    }
  }, [selectedArea, map]);

  return null;
}

/* =====================================================
   NORMALIZE PROPERTY COORDINATES
===================================================== */

function normalizeProperty(property) {
  const latitude = Number(
    property.latitude ??
      property.lat ??
      property.locationLatitude
  );

  const longitude = Number(
    property.longitude ??
      property.lng ??
      property.lon ??
      property.locationLongitude
  );

  return {
    ...property,
    latitude,
    longitude,
  };
}

/* =====================================================
   MAIN MAP COMPONENT
===================================================== */

export default function ExploreMap({
  selectedArea,
  properties = [],
}) {
  const router = useRouter();

  const validProperties = useMemo(() => {
    return properties
      .map(normalizeProperty)
      .filter((property) => {
        const validLatitude =
          Number.isFinite(property.latitude) &&
          property.latitude >= -90 &&
          property.latitude <= 90;

        const validLongitude =
          Number.isFinite(property.longitude) &&
          property.longitude >= -180 &&
          property.longitude <= 180;

        return validLatitude && validLongitude;
      });
  }, [properties]);

  const selectedAreaConfig = AREAS[selectedArea];

  const mapCenter =
    selectedAreaConfig?.center || [22.5867, 88.4636];

  const mapZoom =
    selectedAreaConfig?.zoom || 12;

  return (
    <div className="relative w-full h-[420px] sm:h-[520px] lg:h-[600px] rounded-3xl overflow-hidden border border-gray-200 shadow-lg bg-white">

      {/* =====================================================
          MAP
      ====================================================== */}

       <MapContainer
    key="explore-property-map"
    center={mapCenter}
    zoom={mapZoom}
    scrollWheelZoom={true}
    attributionControl={true}
    className="w-full h-full z-0"
  >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="/api/tiles/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <MapUpdater selectedArea={selectedArea} />

        {/* =====================================================
            SELECTED AREA POLYGON
        ====================================================== */}

        {selectedAreaConfig?.polygon && (
          <Polygon
            positions={selectedAreaConfig.polygon}
            pathOptions={{
              color: "#388E3C",
              weight: 2.5,
              dashArray: "3, 8",
              fillColor: "#4CAF50",
              fillOpacity: 0.22,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        )}

        {/* =====================================================
            AREA LABEL
        ====================================================== */}

        {selectedAreaConfig?.center && (
          <Marker
            position={selectedAreaConfig.center}
            icon={createAreaLabelIcon(selectedArea)}
            interactive={false}
          />
        )}

        {/* =====================================================
            PROPERTY MARKERS
        ====================================================== */}

        {validProperties.map((property, index) => {
          const propertyId =
            property.id ||
            property._id ||
            `property-${index}`;

          return (
            <Marker
              key={propertyId}
              position={[
                property.latitude,
                property.longitude,
              ]}
              icon={createPropertyIcon(property) || redIcon}
            >
              <Popup>
                <div className="w-56 p-1 text-gray-800 space-y-3 font-sans">

                  {/* Property Image */}
                  {property.image && (
                    <div className="relative h-28 w-full rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={property.image}
                        alt={property.name || "Property"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Property Details */}
                  <div className="space-y-1">

                    <h4 className="font-bold text-sm text-gray-900 leading-tight">
                      {property.name ||
                        property.title ||
                        "Property"}
                    </h4>

                    {(property.location ||
                      property.area ||
                      property.locationArea) && (
                      <p className="text-xs text-gray-500 font-medium">
                        {property.location ||
                          property.area ||
                          property.locationArea}
                      </p>
                    )}

                    {property.price && (
                      <div className="text-xs font-bold text-[#5E6623]">
                        {property.price}
                      </div>
                    )}

                    {(property.reraNumber || property.reraId) && (
                      <div className="inline-flex items-center gap-1 rounded-full bg-[#EEF1DD] px-2 py-1 text-[10px] font-bold text-[#4E541E]">
                        <span aria-hidden="true">✓</span>
                        WB RERA: {property.reraNumber || property.reraId}
                      </div>
                    )}

                    {property.propertyType && (
                      <p className="text-xs text-gray-500">
                        {property.propertyType}
                      </p>
                    )}

                  </div>

                  {/* View Property Button */}
                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/property/${propertyId}`)
                    }
                    className="
                      w-full
                      text-center
                      py-2
                      px-3
                      rounded-lg
                      bg-[#5E6623]
                      hover:bg-[#4E541E]
                      text-white
                      text-xs
                      font-semibold
                      transition
                      cursor-pointer
                    "
                  >
                    View Property
                  </button>

                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* =====================================================
          PROPERTY COUNT
      ====================================================== */}

      {validProperties.length > 0 && (
        <div className="absolute top-4 right-4 z-[400] bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-md border border-gray-100">
          <span className="text-xs sm:text-sm font-semibold text-gray-800">
            {validProperties.length}{" "}
            {validProperties.length === 1
              ? "Property"
              : "Properties"}
          </span>
        </div>
      )}

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}

      {validProperties.length === 0 && (
        <div className="absolute inset-0 z-[300] bg-white/30 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
          <div className="bg-white/95 p-7 rounded-2xl max-w-sm text-center shadow-xl border border-gray-100 mx-4 space-y-3">

            <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">ⓘ</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900">
                No Properties Available
              </h3>

              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                We couldn&apos;t find any properties listed in{" "}
                <span className="font-semibold text-gray-700">
                  {selectedArea}
                </span>{" "}
                at the moment. Please select another location.
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

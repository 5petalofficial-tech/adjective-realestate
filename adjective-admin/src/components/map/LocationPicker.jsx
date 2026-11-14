"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents
} from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

const DEFAULT_POSITION = {
  latitude: 22.5726,
  longitude: 88.3639
};

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapClickHandler({ onLocationChange }) {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;

      onLocationChange({
        latitude: lat,
        longitude: lng
      });
    }
  });

  return null;
}

function MapPositionUpdater({ latitude, longitude }) {
  const map = useMap();

  useEffect(() => {
    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);

    if (
      Number.isFinite(parsedLatitude) &&
      Number.isFinite(parsedLongitude)
    ) {
      map.flyTo([parsedLatitude, parsedLongitude], 16, {
        duration: 1
      });
    }
  }, [latitude, longitude, map]);

  return null;
}

export default function LocationPicker({
  latitude,
  longitude,
  address,
  onLocationChange
}) {
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const parsedLatitude = Number(latitude);
  const parsedLongitude = Number(longitude);

  const hasValidLocation =
    latitude !== "" &&
    longitude !== "" &&
    Number.isFinite(parsedLatitude) &&
    Number.isFinite(parsedLongitude);

  const currentPosition = hasValidLocation
    ? [parsedLatitude, parsedLongitude]
    : [DEFAULT_POSITION.latitude, DEFAULT_POSITION.longitude];

  useEffect(() => {
    if (address && !searchText) {
      setSearchText(address.replace(/^,\s*|,\s*$/g, ""));
    }
  }, [address]);

  const handleSearch = async () => {
    const query = searchText.trim();

    if (!query) {
      setSearchError("Please enter an address or location.");
      return;
    }

    try {
      setIsSearching(true);
      setSearchError("");

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
          query
        )}`,
        {
          headers: {
            Accept: "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error("Location search failed.");
      }

      const results = await response.json();

      if (!Array.isArray(results) || results.length === 0) {
        setSearchError(
          "Location not found. Try entering a more complete address."
        );
        return;
      }

      const foundLatitude = Number(results[0].lat);
      const foundLongitude = Number(results[0].lon);

      if (
        !Number.isFinite(foundLatitude) ||
        !Number.isFinite(foundLongitude)
      ) {
        throw new Error("Invalid location coordinates received.");
      }

      onLocationChange({
        latitude: foundLatitude,
        longitude: foundLongitude
      });
    } catch (error) {
      console.error("Location search error:", error);

      setSearchError(
        error.message || "Could not search for this location."
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setSearchError(
        "Location access is not supported by this browser."
      );
      return;
    }

    setSearchError("");

    navigator.geolocation.getCurrentPosition(
      position => {
        onLocationChange({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      error => {
        console.error("Geolocation error:", error);

        setSearchError(
          "Could not access your current location. Please allow location permission."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSearchKeyDown = event => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-gray-400">
            location_on
          </span>

          <input
            type="text"
            value={searchText}
            onChange={event => setSearchText(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search address, locality or landmark"
            className="w-full rounded-lg border border-gray-250 bg-gray-50/30 py-2.5 pl-10 pr-4 text-sm text-gray-800 outline-none transition focus:border-[#5E6623] focus:ring-2 focus:ring-[#5E6623]"
          />
        </div>

        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#5E6623] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#4E541E] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-lg">
            search
          </span>

          <span>{isSearching ? "Searching..." : "Search"}</span>
        </button>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#5E6623] bg-white px-4 py-2.5 text-sm font-bold text-[#5E6623] transition hover:bg-[#F1F3EA]"
        >
          <span className="material-symbols-outlined text-lg">
            my_location
          </span>

          <span>Current</span>
        </button>
      </div>

      {searchError && (
        <p className="text-xs font-semibold text-red-500">
          {searchError}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <MapContainer
          center={currentPosition}
          zoom={hasValidLocation ? 16 : 12}
          scrollWheelZoom
          className="h-[350px] w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="/api/tiles/{z}/{x}/{y}.png"
            maxZoom={19}
          />

          <MapClickHandler
            onLocationChange={onLocationChange}
          />

          <MapPositionUpdater
            latitude={latitude}
            longitude={longitude}
          />

          {hasValidLocation && (
            <Marker
              position={currentPosition}
              icon={markerIcon}
              draggable
              eventHandlers={{
                dragend(event) {
                  const marker = event.target;
                  const position = marker.getLatLng();

                  onLocationChange({
                    latitude: position.lat,
                    longitude: position.lng
                  });
                }
              }}
            >
              <Popup>
                <div className="space-y-1">
                  <p className="font-bold">
                    Selected property location
                  </p>

                  {address && (
                    <p className="text-xs">
                      {address}
                    </p>
                  )}

                  <p className="text-xs">
                    {parsedLatitude.toFixed(6)},{" "}
                    {parsedLongitude.toFixed(6)}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-[#E2E5D5] bg-[#F7F8F2] px-3 py-2.5">
        <span className="material-symbols-outlined mt-0.5 text-base text-[#5E6623]">
          info
        </span>

        <p className="text-[11px] font-medium leading-relaxed text-gray-500">
          Search for the property address, click anywhere on the
          map, or drag the marker to choose the exact location.
        </p>
      </div>
    </div>
  );
}
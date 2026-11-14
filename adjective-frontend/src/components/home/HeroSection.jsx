"use client";

import { useRef, useState, useEffect } from "react";
import { BedDouble, ChevronDown } from "lucide-react";

const PRICE_OPTIONS = [
  "₹5Lac",
  "₹10 Lac",
  "₹20 Lac",
  "₹30 Lac",
  "₹40 Lac",
  "₹50 Lac",
  "₹75 Lac",
  "₹1 Cr",
  "₹2 Cr",
  "₹5 Cr",
  "₹6 Cr",
  "₹8 Cr",
  "₹10 Cr",
];

const LOCATION_OPTIONS = [
  "New Town",
  "Rajarhat",
  "Salt Lake",
  "Ballygunge",
  "Alipore",
  "Park Street",
  "Tollygunge",
  "EM Bypass",
  "New Alipore",
  "Joka",
  "Garia",
  "Dum Dum",
  "Madhyamgram",
  "Barasat",
  "B T Road",
  "Hooghly",
  "Howrah",
];

function PriceRangeFilter({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [minValue, setMinValue] = useState(value?.min ?? null);
  const [maxValue, setMaxValue] = useState(value?.max ?? null);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

useEffect(() => {
  setMinValue(value?.min ?? null);
  setMaxValue(value?.max ?? null);
}, [value]);

  const updateMin = (val) => {
    setMinValue(val);
    onChange?.({ min: val, max: maxValue });
  };

  const updateMax = (val) => {
    setMaxValue(val);
    onChange?.({ min: minValue, max: val });
  };

  const hasSelection = minValue || maxValue;
  const label = hasSelection
    ? `${minValue ?? "Min"} - ${maxValue ?? "Max"}`
    : "Price Range";

  return (
    <div className="text-left relative" ref={containerRef}>
      <label className="block text-xs font-label-sm-uppercase text-white/80 mb-2 uppercase tracking-widest">
        Price Range
      </label>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md rounded-lg px-3 h-12 text-sm font-body-md flex items-center justify-between text-white transition-all focus:outline-none focus:border-white/40"
      >
        <span className="flex items-center gap-2 text-white">
          <span className="text-white/70 font-semibold text-base">₹</span>
          {label}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-white/70 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full min-w-[320px] bg-white border border-outline-variant rounded-xl shadow-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Minimum column */}
            <div>
              <span className="block text-xs uppercase tracking-widest text-outline mb-2">
                Minimum
              </span>
              <div className="border border-outline-variant rounded-lg px-3 h-10 flex items-center text-sm text-on-surface mb-2">
                {minValue ?? "Minimum"}
              </div>
              <div className="max-h-48 overflow-y-auto pr-1 space-y-1">
                {PRICE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => updateMin(opt)}
                    className={`w-full text-left text-sm px-2 py-1.5 rounded-md transition-colors ${
                      minValue === opt
                        ? "bg-primary/10 text-primary"
                        : "text-on-surface hover:bg-surface-variant"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Maximum column */}
            <div>
              <span className="block text-xs uppercase tracking-widest text-outline mb-2">
                Maximum
              </span>
              <div className="border border-outline-variant rounded-lg px-3 h-10 flex items-center text-sm text-on-surface mb-2">
                {maxValue ?? "Maximum"}
              </div>
              <div className="max-h-48 overflow-y-auto pr-1 space-y-1">
                {PRICE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => updateMax(opt)}
                    className={`w-full text-left text-sm px-2 py-1.5 rounded-md transition-colors ${
                      maxValue === opt
                        ? "bg-primary/10 text-primary"
                        : "text-on-surface hover:bg-surface-variant"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4 pt-3 border-t border-outline-variant">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-primary px-4 py-2 rounded-lg hover:bg-primary/10"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HeroSection() {
  const [propertyTypeOpen, setPropertyTypeOpen] = useState(false);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);
  const propertyTypeRef = useRef(null);
  const heroRef = useRef(null);
  const locationRef = useRef(null);

  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const statusRef = useRef(null);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Close property type dropdown
  useEffect(() => {
    const handler = (e) => {
      if (
        propertyTypeRef.current &&
        !propertyTypeRef.current.contains(e.target)
      ) {
        setPropertyTypeOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  // Close status dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setStatusOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setLocationOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Hero Grid Parallax
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const grid = hero.querySelector(".hero-grid");
    if (!grid) return;

    const move = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;

      grid.style.transform = `translate(${x}px, ${y}px)`;
    };

    hero.addEventListener("mousemove", move);

    return () => {
      hero.removeEventListener("mousemove", move);
    };
  }, []);

  const carouselRef = useRef(null);
  const [priceRange, setPriceRange] = useState({ min: null, max: null });
  // const filteredLocations = LOCATION_OPTIONS.filter((location) =>
  //   location.toLowerCase().includes(locationQuery.toLowerCase()),
  // );
const filteredLocations = LOCATION_OPTIONS
  .filter((location) =>
    location.toLowerCase().startsWith(locationQuery.trim().toLowerCase())
  )
  .sort((a, b) => a.localeCompare(b));
  const handleCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

      try {
        // Convert latitude & longitude into a real location name
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          {
            headers: {
              Accept: "application/json",
              "Accept-Language": "en",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to get location details");
        }

        const data = await response.json();

        console.log("Current Location Data:", data);

        const address = data.address || {};

        // Pick the most relevant area name
        const currentLocation =
          address.neighbourhood ||
          address.suburb ||
          address.city_district ||
          address.town ||
          address.city ||
          address.state ||
          "Current Location";

        setLocationQuery(currentLocation);
        setLocationOpen(false);
        setSearchError("");

      } catch (error) {
        console.error("Reverse geocoding error:", error);

        alert(
          "Your location was detected, but we could not find the area name."
        );
      }
    },

    (error) => {
      console.log("Location Error Code:", error.code);
      console.log("Location Error Message:", error.message);

      if (error.code === 1) {
        alert(
          "Location permission denied. Please allow location access from your browser."
        );
      } else if (error.code === 2) {
        alert("Your location could not be determined.");
      } else if (error.code === 3) {
        alert("Location request timed out. Please try again.");
      } else {
        alert("Unable to get your current location.");
      }
    },

    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
};
const priceToNumber = (price) => {
  if (!price) return 0;

  const value = parseFloat(
    price.replace("₹", "").replace("Lac", "").replace("Cr", "").trim()
  );

  if (price.includes("Cr")) {
    return value * 100;
  }

  return value;
};

const handleSearch = () => {
  // 1. Location check
  if (!locationQuery.trim()) {
    setSearchError("Please select a location.");
    return;
  }

  // 2. Property Type check
  if (selectedPropertyTypes.length === 0) {
    setSearchError("Please select a property type.");
    return;
  }

  // 3. Price Range check
  if (!priceRange.min || !priceRange.max) {
    setSearchError("Please select both minimum and maximum price.");
    return;
  }
const minPrice = priceToNumber(priceRange.min);
const maxPrice = priceToNumber(priceRange.max);

if (minPrice > maxPrice) {
  setSearchError("Minimum price cannot be greater than maximum price.");
  return;
}
  // 4. Project Status check
  if (!selectedStatus || selectedStatus === "All Status") {
    setSearchError("Please select a project status.");
    return;
  }
  // all fill are done
  setSearchError("");

  // Search data URL-send
  const params = new URLSearchParams();

  params.set("location", locationQuery.trim());
  params.set("propertyType", selectedPropertyTypes.join(","));
  params.set("minPrice", priceRange.min);
  params.set("maxPrice", priceRange.max);
  params.set("status", selectedStatus);

  window.location.href = `/projects?${params.toString()}`;
};
  const handleMouseDown = (e) => {
    const el = carouselRef.current;
    if (!el) return;
    let startX = e.pageX - el.offsetLeft;
    let scrollLeft = el.scrollLeft;
    let isDown = true;

    const onMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      el.scrollLeft = scrollLeft - (x - startX) * 2;
    };

    const onUp = () => {
      isDown = false;
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseup", onUp);
    el.addEventListener("mouseleave", onUp);
  };

  return (
    <section
      ref={heroRef}
      className="hero relative mt-24 h-screen w-full overflow-hidden"
    >
      <div
        ref={carouselRef}
        className="hero-carousel flex h-full w-full overflow-x-auto cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <div className="hero-slide relative">
          {/* Video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
            <source src="/videos/hero_pic.mov" type="video/quicktime" />
          </video>

          {/* Dark Overlay */}
          <div className="absolute inset-0 z-10 hero-overlay" />

          {/* Grid Overlay */}
          <div className="absolute inset-0 z-[11] pointer-events-none hero-grid" />
        </div>
      </div>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-margin-mobile text-center">
        <h1 className="hero-title font-display-lg text-4xl md:text-5xl text-white max-w-3xl mb-stack-lg drop-shadow-lg">
          Find a space that defines &apos;YOU&apos;
        </h1>

        {/* <div className="hero-search w-full max-w-4xl bg-white/15 border border-white/20 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,.35)] p-gutter rounded-xl premium-shadow grid grid-cols-1 md:grid-cols-5 gap-4 items-end"> */}
        <div className="hero-search w-full max-w-[1100px] mx-auto bg-white/15 border border-white/20 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,.35)] p-4 sm:p-5 rounded-xl premium-shadow grid grid-cols-1 sm:grid-cols-2 lg-grid-cols-4 xl-grid-cols-5 gap-3 sm:gap-4 items-end">
          {/* Column 1 — Location input */}
          <div className="text-left relative" ref={locationRef}>
            <label className="block text-xs font-label-sm-uppercase text-white/80 mb-2 uppercase tracking-widest">
              Location
            </label>
            {/* Icon + text input side-by-side inside a bordered container */}
            <div className="flex items-center border border-white/20 bg-white/10 backdrop-blur-md rounded-lg px-3 h-12 hover:bg-white/15 focus-within:border-white/40 transition-all">

  {/* Location icon */}
  <span className="material-symbols-outlined text-white/70 text-sm mr-2">
    location_on
  </span>

  {/* Location input */}
  <input
    type="text"
    placeholder="Location"
    value={locationQuery}
    onChange={(e) => {
      setLocationQuery(e.target.value);
      setLocationOpen(true);
      setSearchError("");
    }}
    onFocus={() => setLocationOpen(true)}
    className="w-full bg-transparent border-none focus:ring-0 text-sm font-body-md outline-none text-white placeholder:text-white/60"
  />

  {/* Current Location */}
  <button
    type="button"
    onClick={handleCurrentLocation}
    aria-label="Use Current Location"
    className="group relative flex items-center justify-center shrink-0 ml-2 w-8 h-8 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
  >
    <span className="material-symbols-outlined text-[20px]">
      my_location
    </span>
    {/* Tooltip */}
  <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block whitespace-nowrap rounded-md bg-black/90 px-3 py-1.5 text-xs text-white shadow-lg">
    Use Current Location
  </span>
  </button>

</div>
            {locationOpen && (
  <div className="absolute z-50 mt-2 w-full max-h-56 overflow-y-auto rounded-xl border border-white/20 bg-[#111111] shadow-lg backdrop-blur-xl">

    {/* Current Location */}
    <button
      type="button"
      onClick={handleCurrentLocation}
      className="block w-full px-4 py-3 text-left text-sm text-white hover:bg-white/10 transition-colors border-b border-white/10"
    >
      <span className="material-symbols-outlined text-sm mr-2 align-middle">
        my_location
      </span>
      Use Current Location
    </button>

    {/* Location List */}
    {filteredLocations.map((location) => (
      <button
        key={location}
        type="button"
        onClick={() => {
          setLocationQuery(location);
          setLocationOpen(false);
        }}
        className="block w-full px-4 py-3 text-left text-sm text-white/90 hover:bg-white/10 transition-colors"
      >
        {location}
      </button>
    ))}
  </div>
)}
          </div>

          {/* Column 2 — Property Type dropdown */}
          <div className="text-left relative" ref={propertyTypeRef}>
            <label className="block text-xs font-label-sm-uppercase text-white/80 mb-2 uppercase tracking-widest">
              Property Type
            </label>

            {/* Trigger button */}
            <button
              type="button"
              onClick={() => setPropertyTypeOpen((prev) => !prev)}
              className="w-full flex items-center gap-2 border border-white/20 bg-white/10 backdrop-blur-md rounded-lg px-3 h-12 text-sm font-body-md text-white hover:bg-white/15 transition-all focus:outline-none focus:border-white/40"
            >
              <BedDouble className="w-4 h-4 text-white/70 shrink-0" />
              <span className="flex-1 text-left">Property Type</span>
              <ChevronDown
                className={`w-4 h-4 text-white/70 shrink-0 transition-transform ${propertyTypeOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown panel */}
            {propertyTypeOpen && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-outline-variant rounded-xl shadow-md py-2">
                {[
                  "Apartments",
                  "Villa",
                  "Penthouse",
                  "Commercial",
                  "Duplex",
                  "Plots",
                  "Row House",
                ].map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-surface-variant transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPropertyTypes.includes(type)}
                      onChange={() => {
  setSelectedPropertyTypes((prev) =>
    prev.includes(type)
      ? prev.filter((t) => t !== type)
      : [...prev, type],
  );

  setSearchError("");
  setPropertyTypeOpen(false);
}}
                      className="w-4 h-4 rounded border-outline-variant accent-primary"
                    />
                    <span className="text-sm font-body-md text-on-surface">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Column 3 — Price Range dropdown */}
          <PriceRangeFilter
  value={priceRange}
  onChange={(value) => {
    setPriceRange(value);
    setSearchError("");
  }}
/>

          {/* Column 4 — Property Status dropdown */}
          <div className="text-left relative" ref={statusRef}>
            <label className="block text-xs font-label-sm-uppercase text-white/80 mb-2 uppercase tracking-widest">
              Project Status
            </label>
            <button
              type="button"
              onClick={() => setStatusOpen((prev) => !prev)}
              className="w-full flex items-center gap-2 border border-white/20 bg-white/10 backdrop-blur-md rounded-lg px-3 h-12 text-sm font-body-md text-white hover:bg-white/15 transition-all focus:outline-none focus:border-white/40"
            >
              <span className="flex-1 text-left">{selectedStatus}</span>
              <ChevronDown
                className={`w-4 h-4 text-white/70 shrink-0 transition-transform ${statusOpen ? "rotate-180" : ""}`}
              />
            </button>

            {statusOpen && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-outline-variant rounded-xl shadow-md py-2">
                {[
                  "Ready to Move",
                  "Under Construction",
                  "New Launch",
                  "Pre-Launch",
                ].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      setSelectedStatus(status);
                      setStatusOpen(false);
                      setSearchError("");
                    }}
                    className={`w-full text-left text-sm px-4 py-2.5 transition-colors ${
                      selectedStatus === status
                        ? "bg-primary/10 text-primary"
                        : "text-on-surface hover:bg-surface-variant"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Column 5 — Search submit button */}
          {/* <button className="bg-[#D99B2B] text-white h-12 rounded-lg font-label-md text-l hover:opacity-90 transition-all flex items-center justify-center gap-2"> */}
          <div className="col-span-full flex flex-col items-center gap-2 mt-1">

  {searchError && (
    <div className="px-4 py-2.5 rounded-lg bg-red-500/90 text-white text-sm font-medium shadow-md text-center">
      {searchError}
    </div>
  )}

  <button
    type="button"
    onClick={handleSearch}
    className="w-[150px] h-11 bg-[#D99B2B] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#c88d24] transition-all duration-200 shadow-md cursor-pointer"
  >
    <span className="material-symbols-outlined text-[20px]">
      search
    </span>
    <span>Search</span>
  </button>

</div>
        </div>
      </div>
    </section>
  );
}

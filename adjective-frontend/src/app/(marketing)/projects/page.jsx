"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookVisitModal from "@/components/common/BookVisitModal";
import { fetchAndNormalizeProperties } from "@/utils/api";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "@/redux/wishlistSlice";
import { 
  Search, 
  MapPin, 
  ArrowUpRight, 
  BedDouble, 
  Bath, 
  Maximize2, 
  Heart, 
  Filter, 
  SlidersHorizontal,
  Building2,
  ShieldCheck,
  Compass,
  Coins
} from "lucide-react";

export default function ProjectsPage() {
  const [mounted, setMounted] = useState(false);
  const [properties, setProperties] = useState([]);
  const [filteredProps, setFilteredProps] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  // Modal state
  const [selectedProperty, setSelectedProperty] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const allProps = await fetchAndNormalizeProperties();
        setProperties(allProps);
        setFilteredProps(allProps);
      } catch (err) {
        console.error("Error loading all properties:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const [selectedGoal, setSelectedGoal] = useState(null);

  useEffect(() => {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);

    const goalParam = params.get("goal");
    const locationParam = params.get("location");

    if (goalParam) {
      setSelectedGoal(goalParam);
    }

    if (locationParam) {
      setSearchQuery(locationParam);
    }
  }
}, []);

  // Filter & Search Logic
  useEffect(() => {
    let result = [...properties];

    // Goal filter
    if (selectedGoal) {
      if (selectedGoal === "first-home") {
        result = result.filter(
          (p) => (p.rawPrice && p.rawPrice <= 5500000) || p.isPMAYApproved || p.isRERAApproved
        );
      } else if (selectedGoal === "investment") {
        result = result.filter(
          (p) => p.isFeatured || p.isFinest || p.isProjectOfTheMonth
        );
      } else if (selectedGoal === "retirement") {
        result = result.filter(
          (p) => p.isVastuCompliant || p.location?.toLowerCase().includes("rajarhat")
        );
      } else if (selectedGoal === "rental-income") {
        result = result.filter(
          (p) => p.isSolo || (p.rawPrice && p.rawPrice <= 7500000)
        );
      } else if (selectedGoal === "vacation-home") {
        result = result.filter(
          (p) => p.isFinest || (p.rawPrice && p.rawPrice >= 8000000)
        );
      }
    }

    // Search filter (name or location)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.location?.toLowerCase().includes(query) ||
          p.fullAddress?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (activeCategory === "featured") {
      result = result.filter((p) => p.isFeatured);
    } else if (activeCategory === "finest") {
      result = result.filter((p) => p.isFinest);
    } else if (activeCategory === "rera") {
      result = result.filter((p) => p.isRERAApproved);
    } else if (activeCategory === "pmay") {
      result = result.filter((p) => p.isPMAYApproved);
    } else if (activeCategory === "vastu") {
      result = result.filter((p) => p.isVastuCompliant);
    } else if (activeCategory === "resale") {
      result = result.filter((p) => p.isSolo);
    } else if (activeCategory === "new_projects") {
      result = result.filter((p) => !p.isSolo);
    }

    // Sorting
    if (sortBy === "price_asc") {
      result.sort((a, b) => (a.rawPrice || 0) - (b.rawPrice || 0));
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => (b.rawPrice || 0) - (a.rawPrice || 0));
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProps(result);
  }, [searchQuery, activeCategory, sortBy, properties, selectedGoal]);

  const handleBookVisit = (propertyName) => {
    setSelectedProperty(propertyName);
    setIsModalOpen(true);
  };

  const categories = [
    { id: "all", label: "All Properties", icon: Building2 },
    { id: "featured", label: "Featured", icon: SparklesIcon },
    { id: "finest", label: "Premium Finest", icon: Building2 },
    { id: "rera", label: "RERA Approved", icon: ShieldCheck },
    { id: "pmay", label: "PMAY Approved", icon: Coins },
    { id: "vastu", label: "Vastu Compliant", icon: Compass },
    { id: "resale", label: "Resale", icon: Filter },
    { id: "new_projects", label: "New Projects", icon: SlidersHorizontal },
  ];

  function SparklesIcon(props) {
    return (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>
      </svg>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F2]">
      <Navbar />
      <div className="h-24"></div>

      {/* Hero Header */}
      <section className="py-12 md:py-16 bg-[#5E6623] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto relative z-10 text-center">
          <span className="text-xs uppercase tracking-widest text-[#FFC85C] font-bold px-3 py-1 rounded-full bg-white/10 inline-flex items-center gap-1.5 mb-3">
            <Building2 className="w-3.5 h-3.5" />
            Complete Real Estate Catalog
          </span>
          <h1 className="font-display text-3xl md:text-5xl text-white leading-tight">
            Explore All Projects & Residences
          </h1>
          <p className="mt-3 text-sm md:text-base text-white/80 max-w-2xl mx-auto font-medium">
            Browse our complete portfolio of luxury homes, resale residences, RERA verified developments, and Vastu-compliant projects across Kolkata.
          </p>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="py-6 bg-white border-b border-black/5 sticky top-24 z-40 shadow-xs">
        <div className="px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto space-y-4">
          
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by project name, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAF8F2] border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5E6623]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Dropdown & Results Counter */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <span className="text-xs font-bold text-gray-500 whitespace-nowrap">
                Showing {filteredProps.length} of {properties.length} Properties
              </span>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-gray-500 font-medium hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#FAF8F2] border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#5E6623]"
                >
                  <option value="default">Default</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 cursor-pointer border ${
                    isActive
                      ? "bg-[#5E6623] text-white border-[#5E6623] shadow-sm"
                      : "bg-[#FAF8F2] text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* Property Showcase Grid */}
      <main className="flex-1 py-10">
        <div className="px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto">
          
          {/* Active Goal Alert */}
          {selectedGoal && (
            <div className="mb-6 bg-white border border-[#5E6623]/20 rounded-xl px-5 py-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#5E6623]/15 text-[#5E6623]">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Goal Filter Active: {
                      selectedGoal === "first-home" ? "First Home" :
                      selectedGoal === "investment" ? "Investment Properties" :
                      selectedGoal === "retirement" ? "Retirement Properties" :
                      selectedGoal === "rental-income" ? "Rental Income Opportunities" :
                      selectedGoal === "vacation-home" ? "Vacation Getaways" : selectedGoal
                    }
                  </h3>
                  <p className="text-[10px] text-gray-500 font-medium">Showing properties curated for this specific objective.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedGoal(null);
                  if (typeof window !== "undefined") {
                    const url = new URL(window.location.href);
                    url.searchParams.delete("goal");
                    window.history.pushState({}, "", url.toString());
                  }
                }}
                className="text-xs text-[#5E6623] hover:underline font-bold bg-transparent border-none cursor-pointer"
              >
                Clear Goal Filter
              </button>
            </div>
          )}

          {loading ? (
            <div className="text-center py-20 text-[#5E6623] font-medium">Loading property collection...</div>
          ) : filteredProps.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-black/5 shadow-xs max-w-md mx-auto my-8">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">No matching properties found</h3>
              <p className="text-xs text-gray-500 mb-6">
                Try clearing your search query or switching category filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                  setSortBy("default");
                  setSelectedGoal(null);
                  if (typeof window !== "undefined") {
                    const url = new URL(window.location.href);
                    url.searchParams.delete("goal");
                    window.history.pushState({}, "", url.toString());
                  }
                }}
                className="px-4 py-2 rounded-lg bg-[#5E6623] text-white text-xs font-bold uppercase tracking-wider cursor-pointer border-none"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredProps.map((p) => {
                const isLiked = mounted && wishlistItems.some((item) => item.id === p.id);

                return (
                  <div
                    key={p.id || p.name}
                    className="bg-white rounded-xl overflow-hidden border border-outline-variant/10 shadow-md flex flex-col justify-between group hover:-translate-y-1 transition duration-300"
                  >
                    {/* Image */}
                    <div className="relative h-56 w-full overflow-hidden">
                      <Image
                        src={p.image || p.img || "/Projects/One10.webp"}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-500"
                        unoptimized
                      />

                      {/* Badge */}
                      <div className="absolute top-4 left-4 bg-[#5E6623] text-white px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider shadow-md">
                        {p.isSolo ? "Resale" : "Project"}
                      </div>

                      {/* Heart Wishlist Button */}
                      <button
                        onClick={() => dispatch(toggleWishlist(p))}
                        aria-label="Wishlist"
                        className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition duration-200 cursor-pointer border-none ${
                          isLiked ? "bg-red-500 text-white" : "bg-white/80 hover:bg-white text-gray-700"
                        }`}
                      >
                        <Heart className={`w-4.5 h-4.5 ${isLiked ? "fill-white text-white" : ""}`} />
                      </button>
                    </div>

                    {/* Details */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-outline font-bold uppercase tracking-widest mb-2">
                          <MapPin className="w-3.5 h-3.5 text-[#5E6623]" />
                          <span>{p.location}</span>
                        </div>
                        <h3 className="font-title-lg text-lg text-gray-900 font-bold mb-2 hover:text-[#5E6623] transition-colors">
                          <Link href={`/property/${p.id}`}>{p.name}</Link>
                        </h3>

                        {/* Specs */}
                        <div className="flex items-center gap-4 text-gray-500 text-xs py-3 border-t border-b border-gray-100 my-4">
                          {p.beds && (
                            <div className="flex items-center gap-1">
                              <BedDouble className="w-4 h-4 text-[#5E6623]" />
                              <span>{p.beds} Beds</span>
                            </div>
                          )}
                          {p.baths && (
                            <div className="flex items-center gap-1">
                              <Bath className="w-4 h-4 text-[#5E6623]" />
                              <span>{p.baths} Baths</span>
                            </div>
                          )}
                          {(p.sqft || p.area) && (
                            <div className="flex items-center gap-1">
                              <Maximize2 className="w-4 h-4 text-[#5E6623]" />
                              <span>{p.sqft || p.area}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="pt-2 flex items-center justify-between gap-2">
                        <span className="text-lg font-extrabold text-[#5E6623]">{p.price}</span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleBookVisit(p.name)}
                            className="px-3 py-2 rounded bg-[#5E6623] hover:bg-[#4E541E] text-white text-xs font-bold uppercase tracking-wider transition shadow-xs cursor-pointer"
                          >
                            Book Visit
                          </button>
                          <Link
                            href={`/property/${p.id}`}
                            className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition flex items-center justify-center"
                            title="View Details"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <BookVisitModal
        propertyName={selectedProperty}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

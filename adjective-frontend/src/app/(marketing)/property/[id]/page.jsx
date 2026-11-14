"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, 
  ArrowLeft, 
  Compass, 
  ShieldCheck, 
  BedDouble, 
  Bath, 
  Maximize2, 
  CheckCircle2, 
  Building, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Phone,
  Mail,
  User,
  MessageSquare,
  Heart,
  Hospital,
  Bus,
  School,
  Landmark,
  UtensilsCrossed,
  Fuel,
  Navigation,
  Clock,
  Download,
  Lock,
  FileText,
  TrendingUp
} from "lucide-react";
import { apiRequest, fetchPropertyById } from "@/utils/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";

const PropertyMap = dynamic(() => import("@/components/map/PropertyMap"), {
  ssr: false,
});

const generateAppreciationData = (location) => {
  const loc = (location || "").toLowerCase();
  
  let basePricePerSqft = 6500; 
  let growthTrend = [0.45, 0.52, 0.60, 0.68, 0.78, 0.88, 1.0]; 
  let totalGrowth = "122%";
  let cagr = "8.3%";

  if (loc.includes("new town") || loc.includes("action area")) {
    basePricePerSqft = 8200;
    growthTrend = [0.42, 0.48, 0.55, 0.65, 0.78, 0.90, 1.0];
    totalGrowth = "138%";
    cagr = "9.1%";
  } else if (loc.includes("rajarhat")) {
    basePricePerSqft = 5800;
    growthTrend = [0.48, 0.55, 0.62, 0.70, 0.80, 0.90, 1.0];
    totalGrowth = "108%";
    cagr = "7.6%";
  } else if (loc.includes("salt lake") || loc.includes("saltlake")) {
    basePricePerSqft = 12500;
    growthTrend = [0.55, 0.62, 0.70, 0.78, 0.88, 0.95, 1.0];
    totalGrowth = "81%";
    cagr = "6.1%";
  } else if (loc.includes("tollygunge")) {
    basePricePerSqft = 9200;
    growthTrend = [0.45, 0.52, 0.60, 0.70, 0.82, 0.92, 1.0];
    totalGrowth = "122%";
    cagr = "8.3%";
  } else if (loc.includes("bypass") || loc.includes("em bypass")) {
    basePricePerSqft = 11000;
    growthTrend = [0.46, 0.53, 0.62, 0.72, 0.84, 0.94, 1.0];
    totalGrowth = "117%";
    cagr = "8.1%";
  }

  const years = [2016, 2018, 2020, 2022, 2024, 2025, 2026];
  
  return {
    totalGrowth,
    cagr,
    points: years.map((year, index) => {
      const multiplier = growthTrend[index] || 1.0;
      const val = Math.round(basePricePerSqft * multiplier);
      return {
        year,
        value: val,
        percentage: Math.round(multiplier * 100)
      };
    })
  };
};

function ProductPageDetails({ property }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const isLiked = wishlistItems.some((item) => item?.id === property?.id);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const appreciation = generateAppreciationData(property.location);
  
  // Inquiry form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [enquiryType, setEnquiryType] = useState("Book Visit");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(!!localStorage.getItem("token"));
    }
  }, []);

  useEffect(() => {
    if (!property?.latitude || !property?.longitude) return;

    async function loadNearbyPlaces() {
      try {
        setNearbyLoading(true);
        const res = await apiRequest(
          `/location/nearby?lat=${property.latitude}&lng=${property.longitude}`
        );
        setNearbyPlaces(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setNearbyLoading(false);
      }
    }

    loadNearbyPlaces();
  }, [property?.latitude, property?.longitude]);

  // Gallery images array
  const images = property.images && property.images.length > 0 
    ? property.images 
    : [property.image];

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest("/enquiry", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          phone,
          propertyName: property.name,
          enquiryType,
          message: message || `Hi, I am interested in ${property.name} located in ${property.location}. Please get back to me.`
        })
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
      }, 3000);
    } catch (err) {
      alert("Failed to submit inquiry: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const neighborhoodData = [
    { name: "Transit / Metro Station", dist: "0.8 km", duration: "3 mins drive" },
    { name: "Apollo Multispeciality Hospital", dist: "1.5 km", duration: "5 mins drive" },
    { name: "Heritage Institute of Technology", dist: "3.2 km", duration: "10 mins drive" },
    { name: "South City Mall", dist: "4.5 km", duration: "12 mins drive" },
    { name: "Kolkata International Airport", dist: "14.2 km", duration: "25 mins drive" },
  ];

  const isVideoUrl = (url) => {
    if (!url) return false;
    const lower = url.split("?")[0].toLowerCase();
    return (
      lower.endsWith(".mp4") ||
      lower.endsWith(".webm") ||
      lower.endsWith(".mov") ||
      lower.endsWith(".avi") ||
      lower.endsWith(".mkv") ||
      lower.includes("video/")
    );
  };

  const currentMedia = images[activeImageIndex];
  const isCurrentVideo = isVideoUrl(currentMedia);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F2] font-sans">
      <Navbar />
      
      {/* Spacer to push content below fixed header */}
      <div className="h-24"></div>

      {/* ── BREADCRUMBS & BACK BUTTON ────────────────────────── */}
      <div className="w-full py-4 border-b border-black/5 bg-[#FAF8F2]">
        <div className="px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto flex items-center justify-between">
          <Link 
            href="/projects"
            onClick={(e) => {
              if (typeof window !== "undefined" && window.history.length > 2) {
                e.preventDefault();
                router.back();
              }
            }}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#5E6623] hover:text-[#4E541E] transition-all group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Properties
          </Link>
          
          <div className="hidden md:flex items-center gap-1.5 text-xs text-outline font-medium">
            <Link href="/" className="hover:text-[#5E6623]">Home</Link>
            <span>/</span>
            <Link href="/projects" className="hover:text-[#5E6623]">Projects</Link>
            <span>/</span>
            <span className="text-gray-900 font-bold truncate max-w-[200px]">{property.name}</span>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT AREA ────────────────────────────────── */}
      <main className="flex-1 py-10">
        <div className="px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto">
          
          {/* ── GALLERY & TITLE GRID ────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left/Center Column: Images & Property details */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Media Gallery Showcase */}
              <div className="relative bg-black rounded-2xl overflow-hidden aspect-[16/9] premium-shadow group">
                {isCurrentVideo ? (
                  <video 
                    src={currentMedia} 
                    controls 
                    autoPlay 
                    muted 
                    loop 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image 
                    src={currentMedia} 
                    alt={`${property.name} Gallery ${activeImageIndex + 1}`}
                    fill
                    className="object-cover transition-all duration-300"
                    unoptimized
                  />
                )}
                
                {images.length > 1 && (
                  <>
                    <button 
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center shadow-lg transition duration-200 cursor-pointer z-10 border-none"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center shadow-lg transition duration-200 cursor-pointer z-10 border-none"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/60 text-white text-[10px] tracking-wider uppercase font-bold z-10">
                      {activeImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}

                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="bg-[#5E6623] text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md">
                    {property.isSolo ? "Resale" : "Project"}
                  </div>
                  {property.isRERAApproved && (
                    <div className="bg-[#FFC85C] text-[#1b1b1d] font-bold px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider shadow-md flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      RERA Verified
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                  {images.map((item, idx) => {
                    const itemIsVideo = isVideoUrl(item);
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-24 h-16 rounded-lg overflow-hidden shrink-0 transition border-2 bg-black ${
                          activeImageIndex === idx ? "border-[#5E6623]" : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        {itemIsVideo ? (
                          <div className="relative w-full h-full flex items-center justify-center bg-gray-900 text-white">
                            <video src={item} className="w-full h-full object-cover opacity-60" muted />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <span className="w-6 h-6 rounded-full bg-[#5E6623] flex items-center justify-center text-white text-xs font-bold shadow-md">▶</span>
                            </div>
                          </div>
                        ) : (
                          <Image 
                            src={item} 
                            alt={`Thumbnail ${idx + 1}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Property Header Info */}
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-outline-variant/10 premium-shadow">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 pb-6 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-1.5 text-outline text-xs uppercase tracking-widest font-bold mb-2">
                      <MapPin className="w-4 h-4 text-[#5E6623] shrink-0" />
                      <span>{property.location}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <h1 className="font-display text-2xl md:text-4xl text-[#1b1b1d] leading-tight">
                        {property.name}
                      </h1>
                      <button
                        onClick={() => dispatch(toggleWishlist(property))}
                        className={`p-2.5 rounded-full border transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0 ${
                          isLiked ? "bg-red-50 border-red-500 text-red-500" : "bg-white border-gray-200 text-gray-600 hover:text-red-500"
                        }`}
                        title={isLiked ? "Remove from Wishlist" : "Save to Wishlist"}
                      >
                        <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                      </button>
                    </div>
                    {property.fullAddress && (
                      <p className="text-xs text-outline mt-2 font-medium">
                        {property.fullAddress}
                      </p>
                    )}
                  </div>
                  <div className="text-left md:text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#5E6623] block mb-1">Asking Price</span>
                    <span className="text-2xl md:text-3xl font-extrabold text-[#5E6623]">
                      {property.price}
                    </span>
                    <span className="text-[10px] text-outline block mt-1 font-medium">
                      All Inclusive Quote
                    </span>
                  </div>
                </div>

                {/* Key Specifications Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 text-[#1b1b1d]">
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FAF8F2] flex items-center justify-center text-[#5E6623]">
                      <BedDouble className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-outline block uppercase font-bold tracking-wider">Bedrooms</span>
                      <span className="text-sm font-bold">{property.beds || "N/A"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FAF8F2] flex items-center justify-center text-[#5E6623]">
                      <Bath className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-outline block uppercase font-bold tracking-wider">Bathrooms</span>
                      <span className="text-sm font-bold">{property.baths || "N/A"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FAF8F2] flex items-center justify-center text-[#5E6623]">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-outline block uppercase font-bold tracking-wider">Super Area</span>
                      <span className="text-sm font-bold">{property.sqft || "N/A"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FAF8F2] flex items-center justify-center text-[#5E6623]">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-outline block uppercase font-bold tracking-wider">Facing</span>
                      <span className="text-sm font-bold truncate max-w-[110px]">
                        {property.facing || (property.isVastuCompliant ? "Vastu Compliant" : "N/A")}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Extended Quick Specs - Solo Only */}
                {property.isSolo && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-50">
                    {property.furnishingStatus && (
                      <div className="text-center py-2 px-3 bg-[#FAF8F2] rounded-lg">
                        <span className="text-[10px] text-outline block uppercase font-bold tracking-wider">Furnishing</span>
                        <span className="text-xs font-bold text-[#1b1b1d]">{property.furnishingStatus}</span>
                      </div>
                    )}
                    {property.parkingType && (
                      <div className="text-center py-2 px-3 bg-[#FAF8F2] rounded-lg">
                        <span className="text-[10px] text-outline block uppercase font-bold tracking-wider">Parking</span>
                        <span className="text-xs font-bold text-[#1b1b1d]">{property.parkingType}</span>
                      </div>
                    )}
                    {property.noOfBalconies > 0 && (
                      <div className="text-center py-2 px-3 bg-[#FAF8F2] rounded-lg">
                        <span className="text-[10px] text-outline block uppercase font-bold tracking-wider">Balconies</span>
                        <span className="text-xs font-bold text-[#1b1b1d]">{property.noOfBalconies}</span>
                      </div>
                    )}
                    {property.ageOfProperty !== undefined && (
                      <div className="text-center py-2 px-3 bg-[#FAF8F2] rounded-lg">
                        <span className="text-[10px] text-outline block uppercase font-bold tracking-wider">Age</span>
                        <span className="text-xs font-bold text-[#1b1b1d]">{property.ageOfProperty} years</span>
                      </div>
                    )}
                    {property.isNegotiable && (
                      <div className="text-center py-2 px-3 bg-green-50 rounded-lg border border-green-200">
                        <span className="text-[10px] text-green-700 block uppercase font-bold tracking-wider">Price</span>
                        <span className="text-xs font-bold text-green-800">Negotiable ✓</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Description / Overview Section */}
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-outline-variant/10 premium-shadow space-y-4">
                <h3 className="font-display text-xl text-[#1b1b1d] border-b border-gray-100 pb-3 flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#5E6623]" />
                  Property Overview
                </h3>
                <p className="text-sm md:text-base text-on-surface-variant leading-relaxed font-body-lg whitespace-pre-line">
                  {property.description || 
                    `This premium property, ${property.name}, represents an exceptional real estate opportunity in the highly sought-after area of ${property.location}. Carefully designed with modern architecture and premium fixtures, this residence balances everyday convenience with aesthetic sophistication.`
                  }
                </p>
              </div>

              <PropertyMap
                latitude={property.latitude}
                longitude={property.longitude}
                propertyName={property.name}
              />

              {/* Valuation & Appreciation Trends Section */}
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-outline-variant/10 premium-shadow space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h3 className="font-display text-xl text-[#1b1b1d] flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#5E6623]" />
                    Area Price Appreciation (Last 10 Years)
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-[#FAF8F2] text-[#5E6623] rounded-md">
                    {property.location || "Kolkata"}
                  </span>
                </div>

                {/* Stat Box Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#FAF8F2] rounded-xl p-4 border border-[#5E6623]/5">
                    <span className="text-[10px] text-outline block uppercase font-bold tracking-wider">10-Year Growth</span>
                    <span className="text-xl font-extrabold text-[#5E6623]">{appreciation.totalGrowth}</span>
                  </div>
                  <div className="bg-[#FAF8F2] rounded-xl p-4 border border-[#5E6623]/5">
                    <span className="text-[10px] text-outline block uppercase font-bold tracking-wider">CAGR (Annual Growth)</span>
                    <span className="text-xl font-extrabold text-[#5E6623]">{appreciation.cagr}</span>
                  </div>
                </div>

                {/* Pure CSS Bar Chart */}
                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-end h-48 px-2 md:px-6 pt-4 border-b border-gray-100">
                    {appreciation.points.map((point) => (
                      <div key={point.year} className="flex flex-col items-center group w-1/7 relative">
                        {/* Tooltip on Hover */}
                        <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#1b1b1d] text-white text-[10px] font-bold py-1 px-2 rounded-md whitespace-nowrap z-20 pointer-events-none shadow-md">
                          ₹{point.value.toLocaleString('en-IN')}/sqft
                        </div>
                        {/* Bar */}
                        <div 
                          className="w-8 sm:w-10 bg-[#5E6623]/10 hover:bg-[#5E6623] transition-colors duration-300 rounded-t-md relative flex items-end justify-center cursor-pointer"
                          style={{ height: `${point.percentage * 1.3}px` }}
                        >
                          <span className="text-[9px] font-bold text-[#5E6623] group-hover:text-white pb-2 transition-colors duration-200">
                            {point.percentage}%
                          </span>
                        </div>
                        {/* Year Label */}
                        <span className="text-[10px] font-bold text-gray-500 mt-2">{point.year}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-outline text-center italic">
                    * Hover over bars to view estimated average price per sq.ft. for that year.
                  </p>
                </div>
              </div>

              {/* Highlights & Specific Technical Details */}
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-outline-variant/10 premium-shadow space-y-6">
                <h3 className="font-display text-xl text-[#1b1b1d] border-b border-gray-100 pb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#5E6623]" />
                  Amenities & Highlights
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.highlights && property.highlights.length > 0 ? (
                    property.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-2.5 text-sm text-[#45464d] leading-relaxed">
                        <CheckCircle2 className="w-5 h-5 text-[#5E6623] shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-start gap-2.5 text-sm text-[#45464d] leading-relaxed">
                        <CheckCircle2 className="w-5 h-5 text-[#5E6623] shrink-0 mt-0.5" />
                        <span>24/7 Gated Security Patrols</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-sm text-[#45464d] leading-relaxed">
                        <CheckCircle2 className="w-5 h-5 text-[#5E6623] shrink-0 mt-0.5" />
                        <span>100% Dedicated Power Backup</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-sm text-[#45464d] leading-relaxed">
                        <CheckCircle2 className="w-5 h-5 text-[#5E6623] shrink-0 mt-0.5" />
                        <span>Landscaped Parks & Gated Community</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-sm text-[#45464d] leading-relaxed">
                        <CheckCircle2 className="w-5 h-5 text-[#5E6623] shrink-0 mt-0.5" />
                        <span>Covered Dedicated Car Parking Slots</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Detailed Property Specifications */}
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-outline-variant/10 premium-shadow space-y-6">
                <h3 className="font-display text-xl text-[#1b1b1d] border-b border-gray-100 pb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#5E6623]" />
                  Detailed Specifications
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500 font-medium">Property Type</span>
                    <span className="font-bold text-gray-900">{property.propertyType || "Flat"}</span>
                  </div>
                  {property.isSolo && property.superBuiltUpAreaSize && (
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-500 font-medium">Super Built-Up Area</span>
                      <span className="font-bold text-gray-900">{property.superBuiltUpAreaSize} sqft</span>
                    </div>
                  )}
                  {property.isSolo && property.builtUpAreaSize && (
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-500 font-medium">Built-Up Area</span>
                      <span className="font-bold text-gray-900">{property.builtUpAreaSize} sqft</span>
                    </div>
                  )}
                  {property.isSolo && property.carpetAreaSize && (
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-500 font-medium">Carpet Area</span>
                      <span className="font-bold text-gray-900">{property.carpetAreaSize} sqft</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500 font-medium">Floor</span>
                    <span className="font-bold text-gray-900">{property.floor || "N/A"}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500 font-medium">Configuration</span>
                    <span className="font-bold text-gray-900">{property.buildingConfiguration || "N/A"}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500 font-medium">Handover Date</span>
                    <span className="font-bold text-gray-900">{property.handoverDate ? new Date(property.handoverDate).toLocaleDateString() : "N/A"}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500 font-medium">Road Width</span>
                    <span className="font-bold text-gray-900">{property.roadWidth || "N/A"}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500 font-medium">Ownership Type</span>
                    <span className="font-bold text-gray-900">{property.leaseOrFreehold || "N/A"}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500 font-medium">Property Title</span>
                    <span className="font-bold text-gray-900">{property.propertyTitle || "N/A"}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500 font-medium">Tax / Mutation</span>
                    <span className="font-bold text-gray-900">{property.taxMutation ? "Done" : "Pending"}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500 font-medium">Loan Possible</span>
                    <span className="font-bold text-gray-900">{property.loanPossible ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500 font-medium">Liabilities</span>
                    <span className="font-bold text-gray-900">{property.liabilities || "None"}</span>
                  </div>
                  {property.landArea && (
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-500 font-medium">Land Area</span>
                      <span className="font-bold text-gray-900">{property.landArea}</span>
                    </div>
                  )}
                  {property.carParkingDetails && property.carParkingDetails.available && (
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-500 font-medium">Car Parking</span>
                      <span className="font-bold text-gray-900">
                        {property.carParkingDetails.parkingType}{property.carParkingDetails.count ? ` × ${property.carParkingDetails.count}` : ""}{property.carParkingDetails.area ? ` (${property.carParkingDetails.area})` : ""}
                      </span>
                    </div>
                  )}
                  {property.projectHeight && (
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-500 font-medium">Building Height</span>
                      <span className="font-bold text-gray-900">{property.projectHeight}</span>
                    </div>
                  )}
                  {property.constructionDetails && (
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-500 font-medium">Construction Material</span>
                      <span className="font-bold text-gray-900">{property.constructionDetails}</span>
                    </div>
                  )}
                  {property.liftDetails && property.liftDetails.numberOfLifts > 0 && (
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-500 font-medium">Lifts</span>
                      <span className="font-bold text-gray-900">
                        {property.liftDetails.numberOfLifts} Lift{property.liftDetails.numberOfLifts > 1 ? "s" : ""}
                        {property.liftDetails.liftSize ? ` (${property.liftDetails.liftSize})` : ""}
                        {property.liftDetails.liftCompany ? ` — ${property.liftDetails.liftCompany}` : ""}
                      </span>
                    </div>
                  )}
                  {property.liftDetails && property.liftDetails.serviceLiftAvailable && (
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-500 font-medium">Service Lift</span>
                      <span className="font-bold text-green-700">Available ✓</span>
                    </div>
                  )}
                  {property.servantQuarter && property.servantQuarter.available && (
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-500 font-medium">Servant Quarter</span>
                      <span className="font-bold text-gray-900">
                        Available{property.servantQuarter.location ? ` — ${property.servantQuarter.location}` : ""}
                      </span>
                    </div>
                  )}
                  {property.pmayCategory && property.pmayCategory !== "Not Applicable" && (
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-500 font-medium">PMAY Category</span>
                      <span className="font-bold text-gray-900">{property.pmayCategory}</span>
                    </div>
                  )}
                </div>

                {/* Documents */}
                <div className="pt-4 flex flex-wrap gap-4">
                  {property.sitePlanUrl && (
                    <a href={property.sitePlanUrl} target="_blank" className="text-[#5E6623] text-sm font-bold flex items-center gap-1 hover:underline">
                      <Sparkles className="w-4 h-4" /> Site Plan
                    </a>
                  )}
                  {property.buildingPlanUrl && (
                    <a href={property.buildingPlanUrl} target="_blank" className="text-[#5E6623] text-sm font-bold flex items-center gap-1 hover:underline">
                      <Sparkles className="w-4 h-4" /> Building Plan
                    </a>
                  )}
                  {property.completionCertificateUrl && (
                    <a href={property.completionCertificateUrl} target="_blank" className="text-[#5E6623] text-sm font-bold flex items-center gap-1 hover:underline">
                      <Sparkles className="w-4 h-4" /> Completion Certificate
                    </a>
                  )}
                </div>
              </div>

              {!property.isSolo && (
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-outline-variant/10 premium-shadow space-y-6">
                  <h3 className="font-display text-xl text-[#1b1b1d] border-b border-gray-100 pb-3 flex items-center gap-2">
                    <Building className="w-5 h-5 text-[#5E6623]" />
                    Project Specifics
                  </h3>
                  <div className="space-y-4">
                    {property.possessionTime && (
                      <p className="text-sm"><span className="font-bold">Possession By:</span> {new Date(property.possessionTime).toLocaleDateString()}</p>
                    )}
                    {property.walkthroughUrl && (
                      <a href={property.walkthroughUrl} target="_blank" className="text-[#5E6623] text-sm font-bold block hover:underline">
                        ▶ Watch Project Walkthrough
                      </a>
                    )}
                    {property.specifications && property.specifications.length > 0 && (
                      <div>
                        <span className="font-bold text-sm">Specifications:</span>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-gray-700">
                          {property.specifications.map((spec, i) => <li key={i}>{spec}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── NEARBY LANDMARKS ─────────────────────────────── */}
              {(nearbyPlaces.length > 0 || nearbyLoading) && (
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-outline-variant/10 premium-shadow space-y-5">
                  <h3 className="font-display text-xl text-[#1b1b1d] border-b border-gray-100 pb-3 flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-[#5E6623]" />
                    Nearby Landmarks
                  </h3>

                  {nearbyLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="animate-pulse flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                          <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
                          <div className="flex-1 space-y-1.5">
                            <div className="h-2.5 bg-gray-200 rounded w-3/4" />
                            <div className="h-2 bg-gray-100 rounded w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {nearbyPlaces.map((place) => {
                        const iconMap = {
                          hospital:    <Hospital className="w-4 h-4" />,
                          bus_station: <Bus className="w-4 h-4" />,
                          school:      <School className="w-4 h-4" />,
                          bank:        <Landmark className="w-4 h-4" />,
                          restaurant:  <UtensilsCrossed className="w-4 h-4" />,
                          petrol_pump: <Fuel className="w-4 h-4" />,
                        };
                        return (
                          <div
                            key={place.category}
                            className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF8F2] border border-[#EAE9E2] hover:border-[#5E6623]/30 transition-colors"
                          >
                            <div className="w-9 h-9 rounded-full bg-[#EFF3EB] text-[#5E6623] flex items-center justify-center shrink-0">
                              {iconMap[place.category] ?? <MapPin className="w-4 h-4" />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-[#5E6623]">{place.label}</p>
                              <p className="text-xs font-semibold text-[#1b1b1d] truncate">{place.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                {place.distance && (
                                  <span className="text-[10px] text-gray-500 font-medium flex items-center gap-0.5">
                                    <MapPin className="w-2.5 h-2.5" />
                                    {place.distance}
                                  </span>
                                )}
                                {place.duration && (
                                  <span className="text-[10px] text-gray-500 font-medium flex items-center gap-0.5">
                                    <Clock className="w-2.5 h-2.5" />
                                    {place.duration}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Right Column: Enquiry Form Sidebar */}
            <div className="lg:col-span-1 lg:sticky lg:top-28 space-y-6">
              
              {/* Brochure Download Card */}
              {property.brochureUrl && (
                <div className="bg-[#FAF8F2] rounded-2xl p-6 border border-[#5E6623]/10 premium-shadow text-center space-y-4">
                  <div className="flex items-center gap-3 justify-center">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#5E6623] shadow-sm animate-pulse">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-display text-sm font-bold text-gray-950">Project Brochure</h4>
                      <p className="text-[10px] text-outline font-medium">Download complete specifications & details PDF</p>
                    </div>
                  </div>
                  {isLoggedIn ? (
                    <a
                      href={property.brochureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#5E6623] text-white py-2.5 rounded-lg font-bold hover:bg-[#4E541E] transition shadow-md flex items-center justify-center space-x-2 text-xs uppercase tracking-widest cursor-pointer no-underline border-none"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Brochure</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => router.push("/signup")}
                      className="w-full bg-amber-500 text-white py-2.5 rounded-lg font-bold hover:bg-amber-600 transition shadow-md flex items-center justify-center space-x-2 text-xs uppercase tracking-widest cursor-pointer border-none"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Unlock to Download</span>
                    </button>
                  )}
                </div>
              )}

              <div className="bg-white rounded-2xl p-6 md:p-8 border border-outline-variant/10 premium-shadow">
                
                {success ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#EFF3EB] text-[#5E6623] flex items-center justify-center animate-bounce">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 font-display">Inquiry Registered!</h3>
                      <p className="text-xs text-outline mt-2 font-medium leading-relaxed max-w-xs mx-auto">
                        Thank you, {name}. Our dedicated real estate advisory team will contact you shortly.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitInquiry} className="space-y-5">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#5E6623]">Premium Services</span>
                      <h3 className="text-lg font-bold text-gray-950 font-display leading-tight">Request Details & Booking</h3>
                      <p className="text-xs text-outline font-medium">
                        Schedule a private tour or request pricing details.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Name */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                          <User className="w-3 h-3 text-[#5E6623]" />
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Arnab Sengupta"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623] text-gray-800"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                          <Mail className="w-3 h-3 text-[#5E6623]" />
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
    type="email"
    required
    placeholder="name@example.com"
    value={email}
    onChange={(e) => {
      const value = e.target.value;
      setEmail(value);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (value && !emailRegex.test(value)) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
      }
    }}
    className={`w-full bg-gray-50 px-3.5 py-2 rounded-lg text-xs focus:outline-none transition text-gray-800 ${
      emailError
        ? "border border-red-500 focus:ring-2 focus:ring-red-200"
        : "border border-gray-200 focus:ring-2 focus:ring-[#5E6623] focus:border-[#5E6623]"
    }`}
  />
  {emailError && (
    <p className="text-[10px] text-red-500 font-medium">
      {emailError}
    </p>
  )}
                      </div>

                      {/* Phone */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#5E6623]" />
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            required
                            maxLength={10}
                            placeholder="9876543210"
                            value={phone}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "").slice(0, 10);

                              setPhone(value);

                              if (value.length > 0 && value.length < 10) {
                                setPhoneError("Phone number must be exactly 10 digits");
                              } else {
                                setPhoneError("");
                              }
                            }}
                            className={`w-full bg-gray-50 px-3.5 py-2 rounded-lg text-xs focus:outline-none transition text-gray-800 font-semibold ${
                              phoneError
                                ? "border border-red-500 focus:ring-2 focus:ring-red-200"
                                : "border border-gray-200 focus:ring-2 focus:ring-[#5E6623] focus:border-[#5E6623]"
                            }`}
                          />
     {phoneError && (
      <p className="text-[10px] text-red-500 font-medium">
        {phoneError}
      </p>
    )}
                      </div>

                      {/* Request type */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                          <Building className="w-3 h-3 text-[#5E6623]" />
                          Request Type
                        </label>
                        <select
                          value={enquiryType}
                          onChange={e => setEnquiryType(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623] text-gray-800 font-medium"
                        >
                          <option value="Book Visit">Schedule Site Visit</option>
                          <option value="Call Back">Request a Call Back</option>
                          <option value="General Inquiry">Request Pricing Brochure</option>
                        </select>
                      </div>

                      {/* Message */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-[#5E6623]" />
                          Additional Notes
                        </label>
                        <textarea 
                          placeholder="Introduce your preferences or schedule request..."
                          value={message}
                          onChange={e => setMessage(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623] text-gray-800 h-20 resize-none"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-[#5E6623] text-white py-3 rounded-lg font-bold hover:bg-[#4E541E] transition shadow-md flex items-center justify-center space-x-2 text-xs cursor-pointer disabled:opacity-60 border-none uppercase tracking-widest"
                    >
                      <span>{loading ? "Registering..." : "Submit Inquiry"}</span>
                    </button>

                    <div className="pt-4 border-t border-black/5 flex items-center gap-2 justify-center text-[10px] text-outline font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#5E6623]" />
                      Data Encryption Secured
                    </div>
                  </form>
                )}

              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PropertyDetailPage() {
  const { id } = useParams();
  console.log("URL ID:", id);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function loadProperty() {
      try {
        const prop = await fetchPropertyById(id);
        console.log("Fetched Property:", prop);
        setProperty(prop);
      } catch (err) {
        console.error("Error loading property:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F2]">
        <Navbar />
        <div className="h-24"></div>
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-[#5E6623]">
          <div className="w-12 h-12 border-4 border-[#5E6623] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xs font-bold tracking-widest uppercase text-[#76777d]">Loading property details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F2]">
        <Navbar />
        <div className="h-24"></div>
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-margin-mobile">
          <span className="material-symbols-outlined text-6xl text-outline mb-4">gpp_maybe</span>
          <h2 className="text-2xl font-bold text-[#1b1b1d] mb-2 font-display">Property Not Found</h2>
          <p className="text-sm text-outline max-w-md leading-relaxed mb-6 font-body-md">
            The property you are looking for might have been sold, removed, or the link is incorrect.
          </p>
          <Link href="/" className="px-6 py-3 rounded-lg bg-[#5E6623] text-white text-xs font-bold hover:bg-[#4E541E] transition shadow-md uppercase tracking-widest">
            Return to Homepage
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return <ProductPageDetails property={property} />;
}

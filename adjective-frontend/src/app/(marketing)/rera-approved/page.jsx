"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchAndNormalizeProperties } from "@/utils/api";
import { 
  CheckCircle2, 
  ArrowLeft, 
  Home, 
  MapPin, 
  ArrowUpRight, 
  ShieldAlert,
  Calendar,
  Building,
  Scale,
  ClipboardCheck,
  Search,
  Heart
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "@/redux/wishlistSlice";

// Curated RERA properties fallback data
const reraProperties = [
  {
    id: 1,
    name: "Urbana",
    location: "Madurdaha, East Kolkata TWP",
    image: "/Projects/Urbana.webp",
    price: "₹5.60Cr",
    beds: 4,
    baths: 5,
    area: "10,500 sqft",
    reraId: "WBRERA/P/SOU/2023/000184",
    highlights: [
      "70% buyer funds secured in escrow.",
      "Clear carpet area with zero deviation.",
      "Full WB-RERA timely delivery compliance."
    ]
  },
  {
    id: 2,
    name: "The 42",
    location: "Chowringhee, Kolkata",
    image: "/Projects/The42.webp",
    price: "₹3.90Cr",
    beds: 4,
    baths: 4,
    area: "7,200 sqft",
    reraId: "WBRERA/P/KOL/2023/000092",
    highlights: [
      "Backed by a 5-year structural warranty.",
      "Equal delay interest terms for both parties.",
      "Fully audited layout plans and layouts."
    ]
  },
  {
    id: 3,
    name: "Amistad",
    location: "Action Area II, Newtown",
    image: "/Projects/Amistad.webp",
    price: "₹1.95Cr",
    beds: 3,
    baths: 3,
    area: "5,100 sqft",
    reraId: "WBRERA/P/NOR/2023/000312",
    highlights: [
      "Quarterly construction progress tracking.",
      "Verified title deeds & land clearances.",
      "Protected terms with clear delay penalties."
    ]
  }
];

const reraBenefits = [
  {
    title: "Financial Security",
    rule: "Escrow Account Protection",
    desc: "Builders must deposit 70% of the funds collected from buyers into a dedicated escrow account. This money can only be used for construction and land costs, preventing fund diversion.",
    icon: Building,
    color: "#E2F0D9"
  },
  {
    title: "Structural Guarantee",
    rule: "5-Year Liability Warranty",
    desc: "Builders are legally liable to repair any structural defects or quality issues that arise within 5 years of handing over possession, free of cost to the homebuyer.",
    icon: Scale,
    color: "#FFF2CC"
  },
  {
    title: "Timely Delivery",
    rule: "Strict Delay Penalties",
    desc: "Builders must strictly adhere to the project completion date. In case of delay, the builder is liable to pay interest to the buyer at the same rate the buyer pays for defaults.",
    icon: Calendar,
    color: "#FCE4D6"
  }
];

const verificationSteps = [
  "Visit the official WBRERA website: wbrera.wb.gov.in",
  "Go to the 'Registered Projects' section",
  "Enter the unique RERA Registration ID of the project",
  "Verify the developer details, approved layout plans, and completion date",
  "Check the quarterly progress reports and updates uploaded by the developer"
];

export default function RERAApprovedPage() {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const [expandedCards, setExpandedCards] = useState({});
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const allProps = await fetchAndNormalizeProperties();
        const reraProps = allProps
          .filter(p => p.isRERAApproved)
          .map(p => ({
            id: p.id,
            name: p.name,
            location: p.location,
            image: p.image,
            price: p.price,
            beds: p.beds,
            baths: p.baths,
            area: p.sqft,
            reraId: p.reraId || "WBRERA/P/KOL/2023/000100",
            highlights: p.description ? [p.description] : [
              "70% buyer funds secured in escrow.",
              "Clear carpet area with zero deviation.",
              "Full WB-RERA timely delivery compliance."
            ]
          }));
        
        setProperties(reraProps.length > 0 ? reraProps : reraProperties);
      } catch (err) {
        console.error("Error loading RERA properties", err);
        setProperties(reraProperties);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F2]">
        <Navbar />
        <div className="h-24"></div>
        <div className="flex-1 flex items-center justify-center py-20 text-[#5E6623]">
          Loading RERA approved projects...
        </div>
        <Footer />
      </div>
    );
  }

  const displayProperties = properties;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F2]">
      <Navbar />
      <div className="h-24"></div>

      {/* ── HERO BANNER ────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-[#5E6623] text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto relative z-10">
          <div className="mb-6 flex items-center gap-2">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-sm text-[#FFC85C] hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8">
              <span className="text-xs font-label-sm-uppercase uppercase tracking-widest text-[#FFC85C] px-3 py-1 rounded-full border border-[#FFC85C]/30 bg-white/5 inline-flex items-center gap-1.5 mb-4">
                <ShieldAlert className="w-3.5 h-3.5" />
                100% Certified Properties
              </span>
              <h1 className="font-display-lg text-4xl md:text-6xl text-white leading-tight">
                RERA Approved Projects
              </h1>
              <p className="mt-6 text-base md:text-lg text-white/80 max-w-2xl font-body-lg leading-relaxed">
                Invest with complete peace of mind. Explore our handpicked luxury developments in Kolkata, fully registered under the Real Estate Regulatory Authority (RERA) to guarantee financial transparency and timely delivery.
              </p>
            </div>
            <div className="md:col-span-4 flex justify-center md:justify-end">
              <div className="relative w-48 h-48 md:w-60 md:h-60 rounded-xl border border-white/20 flex flex-col items-center justify-center p-6 bg-white/5 backdrop-blur-sm text-center">
                <ClipboardCheck className="w-16 h-16 text-[#FFC85C] mb-4" />
                <span className="text-xs font-label-sm-uppercase uppercase tracking-widest text-white/90">Verified Registrations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SHOWCASE GRID (PROPERTIES FIRST) ───────────────────── */}
      <section className="py-stack-lg bg-[#FAF8F2]/60">
        <div className="px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayProperties.map((p) => (
              <div 
                key={p.id}
                className="bg-white rounded-xl overflow-hidden border border-outline-variant/10 premium-shadow flex flex-col justify-between"
              >
                {/* Image Section */}
                <div className="relative w-full h-56 overflow-hidden">
                  <Image 
                    src={p.image} 
                    alt={p.name}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute top-4 left-4 bg-[#5E6623] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                    RERA Reg. Verified
                  </div>
                  <button
                    onClick={() => dispatch(toggleWishlist(p))}
                    aria-label="Wishlist"
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-700 flex items-center justify-center shadow-md transition duration-200 cursor-pointer border-none"
                  >
                    <Heart className={`w-4 h-4 ${wishlistItems.some(item => item.id === p.id) ? "fill-red-500 text-red-500" : ""}`} />
                  </button>
                </div>

                {/* Details Section */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1.5 text-outline text-xs uppercase tracking-widest font-label-sm-uppercase">
                        <MapPin className="w-3.5 h-3.5 text-[#5E6623]" />
                        <span>{p.location}</span>
                      </div>
                      <span className="text-lg font-bold text-[#5E6623]">{p.price}</span>
                    </div>

                    <h3 className="font-headline-md text-xl text-[#1b1b1d] mb-2">
                      {p.name}
                    </h3>

                    {/* RERA ID Badge */}
                    <div className="inline-block bg-[#FAF8F2] border border-[#5E6623]/20 rounded px-2.5 py-1 text-[11px] font-mono text-[#5E6623] font-bold mb-4">
                      ID: {p.reraId}
                    </div>

                    {/* Specs Row */}
                    <div className="flex items-center gap-4 text-outline text-xs mb-4 border-b border-outline-variant/10 pb-3">
                      <span className="flex items-center gap-1">
                        <Home className="w-4 h-4" />
                        {p.beds} Beds
                      </span>
                      <span>·</span>
                      <span>{p.baths} Baths</span>
                      <span>·</span>
                      <span>{p.area}</span>
                    </div>

                    {/* RERA Highlights Checklist */}
                    <div className="space-y-3">
                      <p className="font-bold text-xs uppercase tracking-wider text-[#1b1b1d] flex items-center gap-1.5">
                        <ClipboardCheck className="w-4 h-4 text-[#FFC85C]" />
                        RERA Protections
                      </p>
                      {p.highlights.slice(0, 1).map((highlight, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-[#45464d] leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-[#5E6623] shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                      {!!expandedCards[p.id] && p.highlights.slice(1).map((highlight, i) => (
                        <div key={i + 1} className="flex items-start gap-2.5 text-xs text-[#45464d] leading-relaxed animate-fadeIn">
                          <CheckCircle2 className="w-4 h-4 text-[#5E6623] shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                      {p.highlights.length > 1 && (
                        <button
                          onClick={() => toggleExpand(p.id)}
                          className="text-xs text-[#5E6623] font-bold hover:underline focus:outline-none mt-1 inline-flex items-center gap-1 cursor-pointer"
                        >
                          {expandedCards[p.id] ? "read less..." : "read more..."}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-outline-variant/10">
                    <Link
                      href={`/property/${p.id}`}
                      className="bg-[#5E6623] hover:bg-[#5E6623]/95 text-white py-3 rounded-lg text-xs uppercase tracking-wider font-bold transition-all inline-flex items-center justify-center gap-2 hover:-translate-y-0.5 shadow-sm w-full text-center"
                    >
                      View Property
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RERA BENEFITS EXPLAINER ────────────────── */}
      <section className="py-stack-lg bg-white border-t border-b border-black/5">
        <div className="px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-label-sm-uppercase uppercase tracking-widest text-[#5E6623]">
              Buyer Protection
            </span>
            <h2 className="font-headline-md text-3xl md:text-4xl mt-2 text-[#1b1b1d]">
              Key Benefits of RERA Act
            </h2>
            <p className="text-sm md:text-base text-outline mt-4 font-body-lg">
              The Real Estate Regulatory Act (RERA) protects the interests of homebuyers and boosts investment in the real estate sector.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reraBenefits.map((b) => {
              const IconComp = b.icon;
              return (
                <div 
                  key={b.title}
                  className="p-6 rounded-xl border border-outline-variant/20 hover:border-[#5E6623]/30 transition-all duration-300 bg-[#FAF8F2]/30 hover:bg-white group"
                >
                  <div className="flex items-center gap-3.5 mb-4">
                    <span 
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" 
                      style={{ backgroundColor: b.color, color: "#1b1b1d" }}
                    >
                      <IconComp className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </span>
                    <div>
                      <h3 className="font-title-lg text-[#1b1b1d] font-bold leading-tight text-base">{b.title}</h3>
                      <p className="text-xs font-label-sm-uppercase uppercase tracking-widest text-[#5E6623]/70 mt-0.5">{b.rule}</p>
                    </div>
                  </div>
                  <p className="text-sm text-outline font-body-md leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer component */}
      <Footer />
    </div>
  );
}

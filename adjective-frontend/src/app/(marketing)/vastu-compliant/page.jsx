"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchAndNormalizeProperties } from "@/utils/api";
import { 
  Compass, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles, 
  Home, 
  MapPin, 
  ArrowUpRight, 
  Layers,
  Sun,
  Flame,
  Shield,
  Coins,
  Heart
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "@/redux/wishlistSlice";

// Curated Vastu properties fallback data
const vastuProperties = [
  {
    id: 1,
    name: "Vinayak Atlantis",
    location: "Action Area I, Newtown",
    image: "/Projects/Vinayak_Atlantis.webp",
    price: "₹2.90Cr",
    beds: 5,
    baths: 5,
    area: "8,200 sqft",
    direction: "East Facing",
    highlights: [
      "East-facing main entrance to invite solar energy.",
      "Kitchen in the South-East (Agni) health zone.",
      "Master bedroom in the South-West corner for stability."
    ]
  },
  {
    id: 2,
    name: "Orbit Dakshini",
    location: "Baranagar, Kolkata",
    image: "/Projects/Orbit_Dakshini.webp",
    price: "₹4.75Cr",
    beds: 4,
    baths: 5,
    area: "9,800 sqft",
    direction: "North Facing",
    highlights: [
      "North-facing entrance for career growth & wealth.",
      "Brahmasthan (central zone) kept open and clean.",
      "Puja room correctly in the North-East (Ishan) zone."
    ]
  },
  {
    id: 3,
    name: "Sansara",
    location: "Salkia, Howrah",
    image: "/Projects/Sansara.webp",
    price: "₹3.10Cr",
    beds: 4,
    baths: 4,
    area: "5,400 sqft",
    direction: "North-East Facing",
    highlights: [
      "Water elements situated in the North-East corner.",
      "Optimal bedroom alignments for harmony.",
      "Extended East balconies for maximum sunlight."
    ]
  },
  {
    id: 4,
    name: "Anassa",
    location: "EM Bypass, Kolkata",
    image: "/Projects/Anassa.webp",
    price: "₹3.50Cr",
    beds: 3,
    baths: 3,
    area: "4,800 sqft",
    direction: "East Facing",
    highlights: [
      "Proportional grid alignment for positive Prana flow.",
      "Toilets and utility zones placed in the North-West.",
      "Heavy load/structures built on the South & West sides."
    ]
  }
];

const directions = [
  {
    image: "/Adjective/North-East.png",
    icon: Sparkles,
  },
  {
    dir: "East (Aditya)",
    rule: "HEALTH & PROGRESS",
    desc: "Governed by Surya (Sun). Best for main entrances, living rooms, and large windows. Captures the healing rays of morning sun for vitality.",
    paragraphs: [
      "Governed by Surya (Sun).",
      "Best for main entrances, living rooms, and large windows.",
      "Captures the healing rays of morning sun for vitality."
    ],
    icon: Sun,
    color: "#FFF2CC"
  },
  {
    dir: "South-East (Agni)",
    rule: "HEALTH & COOKING",
    desc: "Governed by Fire (Agni). The perfect location for the kitchen and electrical appliances. Fosters positive chemical energy for nutrition.",
    paragraphs: [
      "Governed by Fire (Agni).",
      "The perfect location for the kitchen and electrical appliances.",
      "Fosters positive chemical energy for nutrition."
    ],
    icon: Flame,
    color: "#FCE4D6"
  },
  {
    dir: "South-West (Nairutya)",
    rule: "STABILITY & STRENGTH",
    desc: "Governed by Earth element. Ideal for the master bedroom. Provides stability, decision-making power, and leadership strength to the head of the house.",
    paragraphs: [
      "Governed by Earth element. Ideal for master bedroom.",
      "Provides stability, decision-making power, and leadership strength.",
      "Ensures grounded growth for the head of the house."
    ],
    icon: Shield,
    color: "#E8E8E8"
  },
  {
    dir: "North-West (Vayu)",
    rule: "RELATIONS & SUPPORT",
    desc: "Governed by Wind (Vayu). Perfect for guest bedrooms, children's rooms, pantry, or bathrooms. Keeps energy moving and encourages good social support.",
    paragraphs: [
      "Governed by Wind (Vayu).",
      "Perfect for guest bedrooms, children's rooms, pantry, or bathrooms.",
      "Keeps energy moving and encourages good social support."
    ],
    icon: Layers,
    color: "#D9E1F2"
  },
  {
    dir: "North (Kubera)",
    rule: "WEALTH & CAREERS",
    desc: "Governed by Lord Kubera (Wealth). Perfect for study rooms, lockers, or offices. Keep this area open and ventilated to invite career opportunities.",
    paragraphs: [
      "Governed by Lord Kubera (Wealth).",
      "Perfect for study rooms, lockers, or offices.",
      "Keep open and ventilated to invite financial opportunities."
    ],
    icon: Coins,
    color: "#E1F5FE"
  }
];

export default function VastuCompliantPage() {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const [expandedCards, setExpandedCards] = useState({});
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const allProps = await fetchAndNormalizeProperties();
        const vastuProps = allProps
          .filter(p => p.isVastuCompliant)
          .map(p => ({
            id: p.id,
            name: p.name,
            location: p.location,
            image: p.image,
            price: p.price,
            beds: p.beds,
            baths: p.baths,
            area: p.sqft,
            direction: p.isSolo ? "Vastu Verified" : "Vastu Compliant Layout",
            highlights: p.description ? [p.description] : [
              "East-facing main entrance to invite solar energy.",
              "Kitchen in the South-East (Agni) health zone.",
              "Master bedroom in the South-West corner for stability."
            ]
          }));
        
        setProperties(vastuProps.length > 0 ? vastuProps : vastuProperties);
      } catch (err) {
        console.error("Error loading vastu properties", err);
        setProperties(vastuProperties);
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
          Loading Vastu compliant properties...
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
                <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "12s" }} />
                Vedic Architecture
              </span>
              <h1 className="font-display-lg text-4xl md:text-6xl text-white leading-tight">
                Vastu Compliant Projects
              </h1>
              <p className="mt-6 text-base md:text-lg text-white/80 max-w-2xl font-body-lg leading-relaxed">
                Unlock the flow of positive energy, peace, and abundance. Explore our handpicked collection of premium Kolkata residences meticulously audited for complete alignment with Vastu Shastra principles.
              </p>
            </div>
            <div className="md:col-span-4 flex justify-center md:justify-end">
              <div className="relative w-48 h-48 md:w-60 md:h-60 rounded-full border border-white/20 flex items-center justify-center p-6 bg-white/5 backdrop-blur-sm">
                <Compass className="w-32 h-32 md:w-40 md:h-40 text-[#FFC85C] opacity-90" strokeWidth={1} />
                <div className="absolute font-bold text-xs text-white top-2">N</div>
                <div className="absolute font-bold text-xs text-white bottom-2">S</div>
                <div className="absolute font-bold text-xs text-white left-2">W</div>
                <div className="absolute font-bold text-xs text-white right-2">E</div>
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
                  <div className="absolute top-4 left-4 bg-[#5E6623] text-white px-3 py-1 rounded-full text-xs font-label-sm-uppercase uppercase tracking-widest shadow-md">
                    {p.direction}
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

                    <h3 className="font-headline-md text-xl text-[#1b1b1d] mb-4">
                      {p.name}
                    </h3>

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

                    {/* Vastu Checklist */}
                    <div className="space-y-3">
                      <p className="font-bold text-xs uppercase tracking-wider text-[#1b1b1d] flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-[#FFC85C]" />
                        Vastu Highlights
                      </p>
                      {p.highlights.slice(0, 1).map((h, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-[#45464d] leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-[#5E6623] shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                      {!!expandedCards[p.id] && p.highlights.slice(1).map((h, i) => (
                        <div key={i + 1} className="flex items-start gap-2.5 text-xs text-[#45464d] leading-relaxed animate-fadeIn">
                          <CheckCircle2 className="w-4 h-4 text-[#5E6623] shrink-0 mt-0.5" />
                          <span>{h}</span>
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

      {/* ── VASTU PRINCIPLES EXPLAINER ── */}
      <section className="py-stack-lg bg-white border-t border-b border-black/5">
        <div className="px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-label-sm-uppercase uppercase tracking-widest text-[#5E6623]">
              The Science of Directions
            </span>
            <h2 className="font-headline-md text-3xl md:text-4xl mt-2 text-[#1b1b1d]">
              Understanding Key Vastu Zones
            </h2>
            <p className="text-sm md:text-base text-outline mt-4 font-body-lg">
              Vastu Shastra balances five elements—Earth, Water, Fire, Air, and Space. A home aligned correctly welcomes health, financial growth, and mental peace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {directions.map((d) => {
              const IconComp = d.icon;
              const isPhotoOnly = !d.dir; // North-East entry has no dir/rule/desc — photo only

              if (isPhotoOnly) {
                return (
                  <div
                    key={d.image}
                    className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 min-h-[220px]"
                  >
                    <Image
                      src={d.image}
                      alt="North-East"
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      priority
                    />
                  </div>
                );
              }

              return (
                <div 
                  key={d.dir}
                  className="relative bg-[#FAF8F3] border border-[#EBE8DE] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  {d.image && (
                    <>
                      <Image
                        src={d.image}
                        alt={d.dir}
                        fill
                        className="object-cover object-right pointer-events-none transition-transform duration-700 group-hover:scale-105"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F3] via-[#FAF8F3]/90 to-transparent w-[80%] pointer-events-none" />
                    </>
                  )}

                  <div className="relative z-10">
                    <div className="flex items-center gap-3.5 mb-3">
                      <span 
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm" 
                        style={{ backgroundColor: d.color, color: "#1b1b1d" }}
                      >
                        <IconComp className="w-5 h-5 text-[#2B3E1F]" />
                      </span>
                      <div>
                        <h3 className="font-serif text-lg text-[#1b1b1d] font-bold">{d.dir}</h3>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-[#9C8B56]">{d.rule}</p>
                      </div>
                    </div>

                    <div className="h-px bg-[#E0E0D6] w-full mb-3" />

                    <div className="space-y-2 text-xs sm:text-sm text-[#3A3D2A] font-body leading-relaxed font-medium">
                      {d.paragraphs ? (
                        d.paragraphs.map((p, i) => <p key={i}>{p}</p>)
                      ) : (
                        <p>{d.desc}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
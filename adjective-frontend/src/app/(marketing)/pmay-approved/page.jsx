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
  Percent,
  Coins,
  ShieldCheck,
  FileText,
  UserCheck,
  Heart,
  ExternalLink,
  Globe
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "@/redux/wishlistSlice";

// Curated PMAY properties fallback
const pmayProperties = [
  {
    id: 1,
    name: "PS One10",
    location: "Action Area I, Newtown",
    image: "/Projects/One10.webp",
    price: "₹1.30Cr",
    beds: 2,
    baths: 3,
    area: "5,400 sqft",
    category: "MIG Approved",
    benefits: [
      "Credit-Linked Subsidy (CLSS) up to ₹2.67L.",
      "Eligible for MIG category home loans.",
      "Fast-track PMAY bank processing tie-ups."
    ]
  },
  {
    id: 2,
    name: "One Estate",
    location: "Satragachi, Howrah",
    image: "/Projects/One_Estate.webp",
    price: "₹95 Lakhs",
    beds: 3,
    baths: 3,
    area: "1,650 sqft",
    category: "LIG & MIG Approved",
    benefits: [
      "Max interest subsidy of 6.5% for LIG.",
      "100% RERA compliant & state approved.",
      "Eligible for lower home buyer stamp duty."
    ]
  },
  {
    id: 3,
    name: "Merlin F Residences",
    location: "Rajarhat, Kolkata",
    image: "/Projects/Merlin_F_Residences.webp",
    price: "₹1.40Cr",
    beds: 4,
    baths: 4,
    area: "15,400 sqft",
    category: "MIG Approved",
    benefits: [
      "Subsidy applicable for first-time home buyers.",
      "Interest subvention benefits for women co-owners.",
      "Pre-approved projects by major banking partners."
    ]
  }
];

const subsidySchemes = [
  {
    category: "Economically Weaker Section (EWS) / LIG",
    income: "Household Income up to ₹6 Lakhs",
    subsidy: "6.5% Interest Subsidy",
    amount: "Max Subsidy: ₹2.67 Lakhs",
    desc: "Applicable on a loan amount up to ₹6 Lakhs. Carpet area limit is 30 sq. mt. for EWS and 60 sq. mt. for LIG.",
    icon: Coins,
    color: "#E2F0D9"
  },
  {
    category: "Middle Income Group I (MIG-I)",
    income: "Household Income ₹6L - ₹12 Lakhs",
    subsidy: "4.0% Interest Subsidy",
    amount: "Max Subsidy: ₹2.35 Lakhs",
    desc: "Applicable on a loan amount up to ₹9 Lakhs. Carpet area limit of the dwelling unit is up to 160 sq. mt.",
    icon: Percent,
    color: "#FFF2CC"
  },
  {
    category: "Middle Income Group II (MIG-II)",
    income: "Household Income ₹12L - ₹18 Lakhs",
    subsidy: "3.0% Interest Subsidy",
    amount: "Max Subsidy: ₹2.30 Lakhs",
    desc: "Applicable on a loan amount up to ₹12 Lakhs. Carpet area limit of the dwelling unit is up to 200 sq. mt.",
    icon: ShieldCheck,
    color: "#FCE4D6"
  }
];

const requiredDocuments = [
  "Aadhar Card & PAN Card of all family members",
  "Proof of household income (Salary Slip, Form 16, or ITR)",
  "Affidavit declaring that no family member owns a pucca house in India",
  "NOC from housing society / builder certificate",
  "Home loan sanction letter from Bank / HFC"
];

export default function PmayApprovedPage() {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const [expandedCards, setExpandedCards] = useState({});
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const allProps = await fetchAndNormalizeProperties();
        const pmayProps = allProps
          .filter(p => p.isPMAYApproved)
          .map(p => ({
            id: p.id,
            name: p.name,
            location: p.location,
            image: p.image,
            price: p.price,
            beds: p.beds,
            baths: p.baths,
            area: p.sqft,
            category: p.isSolo ? "MIG Approved" : "LIG & MIG Approved",
            benefits: p.description ? [p.description] : [
              "Credit-Linked Subsidy (CLSS) up to ₹2.67L.",
              "Eligible for MIG category home loans.",
              "Fast-track PMAY bank processing tie-ups."
            ]
          }));
        
        setProperties(pmayProps.length > 0 ? pmayProps : pmayProperties);
      } catch (err) {
        console.error("Error loading PMAY properties", err);
        setProperties(pmayProperties);
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
          Loading PMAY approved projects...
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
                <ShieldCheck className="w-3.5 h-3.5" />
                Govt. Subsidized Housing
              </span>
              <h1 className="font-display-lg text-4xl md:text-6xl text-white leading-tight">
                PMAY Approved Projects
              </h1>
              <p className="mt-6 text-base md:text-lg text-white/80 max-w-2xl font-body-lg leading-relaxed">
                Make your dream home affordable. Explore our vetted selection of residential projects in Kolkata eligible for Pradhan Mantri Awas Yojana (PMAY) Credit Linked Subsidy Scheme (CLSS) benefits.
              </p>
            </div>
            <div className="md:col-span-4 flex justify-center md:justify-end">
              <div className="relative w-48 h-48 md:w-60 md:h-60 rounded-xl border border-white/20 flex flex-col items-center justify-center p-6 bg-white/5 backdrop-blur-sm text-center">
                <span className="font-display-lg text-5xl md:text-6xl text-[#FFC85C] font-bold">₹2.67L</span>
                <span className="text-xs font-label-sm-uppercase uppercase tracking-widest text-white/80 mt-2">Maximum Subsidy Benefit</span>
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
                    {p.category}
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

                    {/* Benefits Checklist */}
                    <div className="space-y-3">
                      <p className="font-bold text-xs uppercase tracking-wider text-[#1b1b1d] flex items-center gap-1.5">
                        <Percent className="w-4 h-4 text-[#FFC85C]" />
                        PMAY Benefits
                      </p>
                      {p.benefits.slice(0, 1).map((benefit, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-[#45464d] leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-[#5E6623] shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                      {!!expandedCards[p.id] && p.benefits.slice(1).map((benefit, i) => (
                        <div key={i + 1} className="flex items-start gap-2.5 text-xs text-[#45464d] leading-relaxed animate-fadeIn">
                          <CheckCircle2 className="w-4 h-4 text-[#5E6623] shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                      {p.benefits.length > 1 && (
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

      {/* ── SUBSIDY SCHEMES EXPLAINER (DOWN SIDE) ────────────────── */}
      <section className="py-stack-lg bg-white border-t border-b border-black/5">
        <div className="px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-label-sm-uppercase uppercase tracking-widest text-[#5E6623]">
              Subsidy Structure
            </span>
            <h2 className="font-headline-md text-3xl md:text-4xl mt-2 text-[#1b1b1d]">
              Understanding PMAY Categories
            </h2>
            <p className="text-sm md:text-base text-outline mt-4 font-body-lg">
              Check your eligibility category based on annual household income to calculate potential savings under the CLSS interest subvention scheme.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subsidySchemes.map((s) => {
              const IconComp = s.icon;
              return (
                <div 
                  key={s.category}
                  className="p-6 rounded-xl border border-outline-variant/20 hover:border-[#5E6623]/30 transition-all duration-300 bg-[#FAF8F2]/30 hover:bg-white group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3.5 mb-4">
                      <span 
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" 
                        style={{ backgroundColor: s.color, color: "#1b1b1d" }}
                      >
                        <IconComp className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </span>
                      <div>
                        <h3 className="font-title-lg text-sm text-[#1b1b1d] font-bold leading-tight">{s.category}</h3>
                        <p className="text-xs font-label-sm-uppercase uppercase tracking-widest text-[#5E6623]/70 mt-0.5">{s.income}</p>
                      </div>
                    </div>
                    <p className="text-sm text-outline font-body-md leading-relaxed mb-6">
                      {s.desc}
                    </p>
                  </div>
                  <div className="bg-[#FAF8F2] p-4 rounded-lg border border-black/5 text-center">
                    <p className="text-sm font-bold text-[#5E6623]">{s.subsidy}</p>
                    <p className="text-xs text-[#1b1b1d] font-semibold mt-1">{s.amount}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── DOCUMENTS & CLAIM PROCESS SECTION ──────────────────── */}
      <section className="py-stack-lg bg-[#FAF8F2]/30 border-b border-black/5">
        <div className="px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Left: Documents checklist */}
            <div>
              <span className="text-xs font-label-sm-uppercase uppercase tracking-widest text-[#5E6623] px-3 py-1 rounded-full border border-[#5E6623]/20 bg-white inline-flex items-center gap-1.5 mb-4">
                <FileText className="w-3.5 h-3.5" />
                Required Checklist
              </span>
              <h2 className="font-headline-md text-3xl md:text-4xl text-[#1b1b1d] leading-tight mb-6">
                Documents Needed to File PMAY Subsidy Claims
              </h2>
              <p className="text-sm md:text-base text-outline font-body-lg leading-relaxed mb-8">
                To initiate your PMAY CLSS interest subvention application, your lending bank or housing finance company will require verification of the following documents:
              </p>
              
              <div className="space-y-3">
                {requiredDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-[#45464d] leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-[#5E6623] shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>

              {/* PMAY Official Portal Link */}
              <div className="mt-8 pt-6 border-t border-outline-variant/10">
                <a
                  href="https://pmaymis.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#5E6623] hover:bg-[#4E541E] text-white text-xs font-bold uppercase tracking-wider transition shadow-md hover:-translate-y-0.5 cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-[#FFC85C]" />
                  <span>Visit PMAY Official Portal (pmaymis.gov.in)</span>
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </a>
              </div>
            </div>

            {/* Right: Claim Process Steps */}
            <div className="bg-white p-8 md:p-12 rounded-xl border border-outline-variant/10 shadow-lg">
              <h3 className="font-headline-md text-2xl text-[#1b1b1d] mb-6 flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-[#5E6623]" />
                How to Claim Subsidy
              </h3>
              
              <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#5E6623]/10">
                <div className="flex gap-4 relative">
                  <span className="w-8 h-8 rounded-full bg-[#5E6623] text-white flex items-center justify-center font-bold text-sm shrink-0 z-10 shadow-sm">1</span>
                  <div>
                    <h4 className="font-bold text-sm text-[#1b1b1d]">Select a PMAY Approved Project</h4>
                    <p className="text-xs text-outline mt-1 font-body-md">Choose a property from our list of pre-approved projects matching your carpet area limits.</p>
                  </div>
                </div>

                <div className="flex gap-4 relative">
                  <span className="w-8 h-8 rounded-full bg-[#5E6623] text-white flex items-center justify-center font-bold text-sm shrink-0 z-10 shadow-sm">2</span>
                  <div>
                    <h4 className="font-bold text-sm text-[#1b1b1d]">Apply for Home Loan</h4>
                    <p className="text-xs text-outline mt-1 font-body-md">Submit loan application along with PMAY subsidy declarations to a primary lending institution.</p>
                  </div>
                </div>

                <div className="flex gap-4 relative">
                  <span className="w-8 h-8 rounded-full bg-[#5E6623] text-white flex items-center justify-center font-bold text-sm shrink-0 z-10 shadow-sm">3</span>
                  <div>
                    <h4 className="font-bold text-sm text-[#1b1b1d]">Subsidy Processing</h4>
                    <p className="text-xs text-outline mt-1 font-body-md">The bank submits details to Central Nodal Agencies (CNAs) like NHB or HUDCO for verification.</p>
                  </div>
                </div>

                <div className="flex gap-4 relative">
                  <span className="w-8 h-8 rounded-full bg-[#5E6623] text-white flex items-center justify-center font-bold text-sm shrink-0 z-10 shadow-sm">4</span>
                  <div>
                    <h4 className="font-bold text-sm text-[#1b1b1d]">Amount Credit</h4>
                    <p className="text-xs text-outline mt-1 font-body-md">Once approved, the subsidy amount is credited directly to your loan account, reducing your outstanding principal.</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant/10">
                  <a
                    href="https://pmay-urban.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5E6623] hover:text-[#4E541E] hover:underline cursor-pointer"
                  >
                    <span>Check PMAY Subsidy Claim Guidelines (pmay-urban.gov.in)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

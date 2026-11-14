"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  MapPin,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Home,
  Ruler,
  Leaf,
  TrainFront,
  Waves,
} from "lucide-react";
import { fetchAndNormalizeProperties } from "@/utils/api";
import BookVisitModal from "@/components/common/BookVisitModal";
import BrochureModal from "../common/BrochureModel";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/redux/authSlice";
import { Italianno } from "next/font/google";

const italianno = Italianno({
  weight: "400",
  subsets: ["latin"],
});

export default function ProjectOfTheWeek() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBrochure, setIsBrochure] = useState(false);

  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleBrochureClick = () => {
    if (isAuthenticated) {
      const link = document.createElement("a");
      link.href = displayProject.brochureUrl || "/sample-brochure.pdf";
      link.download = `${displayProject.name}_Brochure.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setIsBrochure(true);
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const allProps = await fetchAndNormalizeProperties();

        const spotlight = allProps.find(
          (p) =>
            !p.isSolo &&
            (p.isProjectOfTheWeek || p.isProjectOfTheMonth || p.isFeatured),
        );
        if (spotlight) {
          console.log("Spontlightproperty from DB:", spotlight);

          setProject(spotlight);
        }
      } catch (err) {
        console.error("Error loading project of the Week", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading)
    return (
      <div className="text-center py-20 bg-white">
        Loading spotlight project...
      </div>
    );

  // Fallback static project if none is selected in DB
  const displayProject = project || {
    name: "Emerald Bay Residences",
    location: "New Town, Action Area II",
    image: "/Projects/enclave.jpg",
    price: "₹1.65 Cr – ₹3.80 Cr",
    description:
      "Sprawling across 4.5 acres in New Town's premier corridor, Emerald Bay offers 240 residences with panoramic lake views, a sky lounge, and LEED Gold-certified green architecture.",
  };

  const imageSrc =
  !displayProject.image ||
  displayProject.image.includes("placehold.co")
    ? "/Projects/enclave.jpg"
    : displayProject.image;

  const cleanDescription = (displayProject.description || "")
    .split("===")[0]
    .trim();

  const specs = [
    { icon: Home, value: displayProject.beds || "N/A", label: "BHK Type" },
    { icon: Waves, value: displayProject.baths || "N/A", label: "Bathrooms" },
    { icon: Ruler, value: displayProject.sqft || "N/A", label: "Area" },
    {
      icon: Leaf,
      value: displayProject.isVastuCompliant ? "Yes" : "No",
      label: "Vastu",
    },
    {
      icon: ShieldCheck,
      value: displayProject.isRERAApproved ? "Approved" : "N/A",
      label: "RERA",
    },
    {
      icon: Building2,
      value: displayProject.isFinest ? "Premium" : "Standard",
      label: "Category",
    },
  ];

  return (
    <section className="py-stack-lg bg-white overflow-hidden border-b border-black/5">
      <div className="px-margin-mobile md:px-margin-desktop max-w-[2280px] mx-auto">
        {/* Section Title */}
       <div className="text-center mb-12">
 <h2
  className={`${italianno.className} text-5xl md:text-6xl tracking-wide text-[#2F7D32] 
  [text-shadow:1px_0_0_#2F7D32,-1px_0_0_#2F7D32,0_1px_0_#2F7D32]`}
>
  Project of the Week: Buyers' Favourite
</h2>

 <div className="flex items-center justify-center gap-4 mt-6">
  <div className="w-24 md:w-40 h-[2px] bg-[#2F7D32]"></div>

  <span className="text-[#2F7D32] text-2xl font-bold">♥</span>

  <div className="w-24 md:w-40 h-[2px] bg-[#2F7D32]"></div>
</div>
</div>
        {/* Highlight Card Layout */}
        <div className="bg-[#5E6623] rounded-2xl overflow-hidden premium-shadow flex flex-col lg:flex-row items-stretch min-h-[500px]">
          {/* Image Section */}
          <div className="w-full lg:w-1/2 relative h-80 lg:h-auto min-h-[350px]">
            <Image
               src={imageSrc}
              alt={displayProject.name || "Emerald Enclave"}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {/* Overlay badge */}
            <div className="absolute top-6 left-6 bg-[#FFC85C] text-[#1b1b1d] font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider shadow-md">
              Featured
            </div>
          </div>

          {/* Details Section */}
          <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-between text-white relative">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

            <div className="relative z-10">
              {/* Location Tag */}
              <div className="flex items-center gap-1.5 text-[#FFC85C] text-xs uppercase tracking-widest font-label-sm-uppercase mb-4">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{displayProject.location}</span>
              </div>

              {/* Title */}
              <h3 className="font-display-lg text-4xl md:text-5xl text-white leading-tight mb-4">
                {displayProject.name}
              </h3>

              {/* Sub-details */}
              <p className="text-[#FFC85C] font-semibold text-lg mb-6">
                {displayProject.price}
              </p>

              {/* Description */}
              <p className="text-white/80 text-sm md:text-base font-body-lg leading-relaxed mb-8">
                {cleanDescription || displayProject.description}
              </p>

              {/* 6-Card Specs Grid */}
              <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
                {specs.map((spec, i) => {
                  const IconComp = spec.icon;
                  return (
                    <div
                      key={i}
                      className="bg-[#FAF8F2] rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-black/5 shadow-xs transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      <IconComp className="w-5 h-5 md:w-6 md:h-6 text-[#5E6623] mb-1.5" />
                      <span className="font-serif text-lg md:text-xl font-bold text-[#1b1b1d] leading-tight">
                        {spec.value}
                      </span>
                      <span className="text-[11px] md:text-xs text-gray-500 font-medium mt-0.5">
                        {spec.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA Button */}
           <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col md:flex-row gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-white hover:bg-[#FFC85C] hover:text-[#1b1b1d] text-[#5E6623] px-8 py-4 rounded-lg text-xs uppercase tracking-wider font-bold transition-all duration-300 inline-flex items-center justify-center gap-2 hover:-translate-y-0.5 shadow-md w-full md:flex-1 text-center cursor-pointer border-none"
              >
                Schedule Private Tour
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleBrochureClick}
                className="bg-white text-[#5E6623] px-8 py-4 rounded-lg text-xs uppercase tracking-wider font-bold transition-all duration-300 inline-flex items-center justify-center gap-2 hover:-translate-y-0.5 shadow-md w-full md:flex-1 text-center cursor-pointer border-none hover:bg-[#FFC85C] hover:text-[#1b1b1d]"
              >
                Brochure
              </button>
            </div>
          </div>
        </div>
      </div>
      <BookVisitModal
        propertyName={displayProject.name}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <BrochureModal
        propertyName={displayProject.name} propertyId={displayProject.id}
        brochureUrl={displayProject.brochureUrl || null}
        isOpen={isBrochure}
        onClose={() => setIsBrochure(false)}
      />
    </section>
  );
}

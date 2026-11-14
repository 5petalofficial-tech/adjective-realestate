"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  MapPin, 
  ArrowUpRight, 
  Compass, 
  ShieldCheck, 
  Droplet,
  Sparkles,
  TreePine
} from "lucide-react";
import { fetchAndNormalizeProperties } from "@/utils/api";
import BookVisitModal from "@/components/common/BookVisitModal";
import { Italianno } from "next/font/google";

const italianno = Italianno({
  weight: "400",
  subsets: ["latin"],
});

const highlightIcons = [Compass, ShieldCheck, Droplet, TreePine];

export default function ProjectOfTheMonth() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const allProps = await fetchAndNormalizeProperties();
        const spotlight = allProps.find(p => p.isProjectOfTheMonth);
        if (spotlight) {
          setProject(spotlight);
        }
      } catch (err) {
        console.error("Error loading project of the month", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="text-center py-20 bg-white">Loading spotlight project...</div>;

  // Fallback static project if none is selected in DB
  const displayProject = project || {
    name: "The Reserve",
    location: "Alipore, Kolkata",
    image: "/Projects/The42.webp",
    price: "₹8.50 Cr onwards",
    description: "Designed by internationally acclaimed architects, The Reserve is Alipore's most exclusive address. Spanning 3 acres of curated landscaped gardens, it features only 40 residences, each occupying an entire floor with private elevator access and 360-degree views of the Alipore green canopy.",
    highlights: [
      "100% Vastu Compliant Layouts",
      "Certified Gold Green Rating",
      "Infinity Sky Pool & Wellness Club",
      "90% Landscaped Open Spaces"
    ]
  };

  return (
    <section className="py-stack-lg bg-white overflow-hidden border-b border-black/5">
      <div className="px-margin-mobile md:px-margin-desktop max-w-[2280px] mx-auto">
        
        {/* Section Title */}
        <div className="text-center mb-12">
          <span className="text-xs font-label-sm-uppercase uppercase tracking-widest text-[#5E6623] px-3 py-1 rounded-full border border-[#5E6623]/20 bg-[#FAF8F2] inline-flex items-center gap-1.5 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#FFC85C] animate-pulse" />
            Spotlight Feature
          </span>
          <h2
            className={`${italianno.className} text-5xl md:text-6xl tracking-wide text-[#2F7D32] 
            [text-shadow:1px_0_0_#2F7D32,-1px_0_0_#2F7D32,0_1px_0_#2F7D32]`}
          >
            Project of the Month
          </h2>
        </div>

        {/* Highlight Card Layout */}
        <div className="bg-[#5E6623] rounded-2xl overflow-hidden premium-shadow flex flex-col lg:flex-row items-stretch min-h-[500px]">
          
          {/* Image Section */}
          <div className="w-full lg:w-1/2 relative h-80 lg:h-auto min-h-[350px]">
            <Image 
              src={displayProject.image} 
              alt={displayProject.name}
              fill
              className="object-cover"
              unoptimized
            />
            {/* Overlay badge */}
            <div className="absolute top-6 left-6 bg-[#FFC85C] text-[#1b1b1d] font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider shadow-md">
              Exclusive Launch
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
                {displayProject.description}
              </p>

              {/* Highlights list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {displayProject.highlights.slice(0, 4).map((text, i) => {
                  const IconComp = highlightIcons[i % highlightIcons.length];
                  return (
                    <div key={i} className="flex items-center gap-3 text-xs text-white/90">
                      <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#FFC85C]">
                        <IconComp className="w-4 h-4" />
                      </span>
                      <span>{text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA Button */}
            <div className="relative z-10 pt-4 border-t border-white/10">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-white hover:bg-[#FFC85C] hover:text-[#1b1b1d] text-[#5E6623] px-8 py-4 rounded-lg text-xs uppercase tracking-wider font-bold transition-all duration-300 inline-flex items-center justify-center gap-2 hover:-translate-y-0.5 shadow-md w-full md:w-auto text-center cursor-pointer border-none"
              >
                Schedule Private Tour
                <ArrowUpRight className="w-4 h-4" />
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
    </section>
  );
}

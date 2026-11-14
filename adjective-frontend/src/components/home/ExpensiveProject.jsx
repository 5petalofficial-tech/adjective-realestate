"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { fetchAndNormalizeProperties } from "@/utils/api";
import BookVisitModal from "@/components/common/BookVisitModal";
import BrochureModal from "@/components/common/BrochureModel";
import { Italianno } from "next/font/google";
import { Lora } from "next/font/google";

const lora = Lora({
  weight: ["400", "500"],
  subsets: ["latin"],
});

const italianno = Italianno({
  weight: "400",
  subsets: ["latin"],
});

const fallbackResidence = {
  id: "premium-residence",
  name: "Your Signature Residence",
  location: "Kolkata",
  image: "/Projects/premium.jpg",
  price: "Price on Request",
  description: "A private residence defined by generous spaces, considered details, and an elevated lifestyle.",
  highlights: ["Private residences", "Premium location", "Smart home ready", "Concierge service", "Curated amenities", "Exclusive living"],
};

export default function ExpensiveProject() {
  const [residence, setResidence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVisitOpen, setIsVisitOpen] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);

  useEffect(() => {
    async function loadResidence() {
      try {
        const properties = await fetchAndNormalizeProperties();
        setResidence(properties.find((property) => property.isFinest) || properties[0] || null);
      } catch (error) {
        console.error("Error loading premium residence", error);
      } finally {
        setLoading(false);
      }
    }

    loadResidence();
  }, []);

  const project = residence || fallbackResidence;
  const projectImage =
    !project.image ||
    project.image.includes("placehold.co") ||
    project.image.includes("No+Image")
      ? "/Projects/premium.jpg"
      : project.image;
  const amenities = project.highlights?.filter(Boolean).slice(0, 6) || fallbackResidence.highlights;

  return (
    <section className="bg-[#f7f3e9] py-16 md:py-24 overflow-hidden">
  <div className="px-4 sm:px-6 lg:px-8 xl:px-10 max-w-[1470px] mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <h2 className={`${italianno.className} text-5xl md:text-6xl tracking-wide text-[#2F7D32] 
  [text-shadow:1px_0_0_#2F7D32,-1px_0_0_#2F7D32,0_1px_0_#2F7D32]`}
>
  Most Premium Residence
</h2>
          <h2
  className={`${lora.className} text-center text-[#5E6623] text-lg mt-4 max-w-2xl mx-auto leading-relaxed`}>
            An Address Above All Others
          </h2>
        </div>

        <div className="rounded-[28px] overflow-hidden border border-[#c9a63b]/25 bg-[#141d10] shadow-2xl grid lg:grid-cols-2 min-h-[620px]">
          <div className="relative min-h-[380px] lg:min-h-full">
            <Image
              src={projectImage}
              alt={project.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061323]/75 via-[#061323]/10 to-transparent" />
            <span className="absolute top-7 left-7 rounded-full bg-[#cfad43] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#18200f]">
              Exclusive Residence
            </span>
          </div>

          <div className="px-7 py-10 sm:p-12 lg:p-16 flex flex-col justify-center text-[#f7f3e9]">
            <div className="flex items-center gap-2 text-[#c9a63b] text-[11px] font-bold uppercase tracking-[0.2em] mb-6">
              <MapPin className="w-4 h-4" />
              {project.location}
            </div>

            <h3 className="font-display text-4xl sm:text-5xl md:text-6xl leading-none mb-3">{project.name}</h3>
            <p className="text-sm text-[#f7f3e9]/50 mb-1">Starting from</p>
            <p className="font-display text-3xl md:text-4xl text-[#cfad43] mb-7">{project.price}</p>
            <div className="w-14 border-t-2 border-[#c9a63b]/50 mb-7" />

            <p className="text-sm md:text-base leading-7 text-[#f7f3e9]/65 max-w-xl mb-8">{project.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-10">
              {amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-3 text-sm text-[#f7f3e9]/70">
                  <span className="h-1.5 w-1.5 rotate-45 bg-[#cfad43] shrink-0" />
                  {amenity}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsVisitOpen(true)}
                className="flex-1 rounded-xl bg-[#cfad43] px-6 py-4 text-sm font-bold text-[#17200f] hover:bg-[#e2c15c] transition cursor-pointer border-none"
              >
                Request Private Preview
              </button>
              <button
                onClick={() => setIsBrochureOpen(true)}
                className="rounded-xl border border-[#cfad43]/60 px-6 py-4 text-sm font-bold text-[#cfad43] hover:bg-[#cfad43] hover:text-[#17200f] transition cursor-pointer bg-transparent"
              >
                View Brochure
              </button>
            </div>
          </div>
        </div>

        {loading && <p className="mt-4 text-center text-xs text-[#f7f3e9]/45">Loading premium residence...</p>}
      </div>

      <BookVisitModal propertyName={project.name} isOpen={isVisitOpen} onClose={() => setIsVisitOpen(false)} />
      <BrochureModal
        propertyName={project.name}
        propertyId={project.id}
        brochureUrl={project.brochureUrl || null}
        isOpen={isBrochureOpen}
        onClose={() => setIsBrochureOpen(false)}
      />
    </section>
  );
}

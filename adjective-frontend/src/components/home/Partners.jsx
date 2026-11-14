"use client";

import React from "react";
import { Building2 } from "lucide-react";

export default function Partners() {
  const partners = [
    { name: "Srijan Group" },
    { name: "Prestige Residences" },
    { name: "Vinayak Amara" },
    { name: "Merlin Avana" },
    { name: "PS Group" },
  ];

  return (
    <section className="relative overflow-hidden bg-[#FBF6EF] py-8 border-y border-[#E8DCC8]">
      <div className="relative px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        {/* Eyebrow heading with ornamental line */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="h-px w-16 md:w-32 bg-gradient-to-r from-transparent to-[#C9A14A]" />
          <span className="text-[#C9A14A] text-xs">✦</span>
          <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.3em] text-[#B68D40] whitespace-nowrap">
            Trusted by Kolkata&apos;s Finest Developers
          </p>
          <span className="text-[#C9A14A] text-xs">✦</span>
          <span className="h-px w-16 md:w-32 bg-gradient-to-l from-transparent to-[#C9A14A]" />
        </div>

        {/* Partner brand cards */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
          {partners.map((p) => (
            <div
              key={p.name}
              className="flex items-center gap-3 px-5 py-2.5 bg-white/80 backdrop-blur-xs rounded-xl border border-[#E8DCC8] shadow-xs hover:border-[#C9A14A] transition"
            >
              <div className="w-8 h-8 rounded-lg bg-[#5E6623]/10 text-[#5E6623] flex items-center justify-center shrink-0 font-bold text-xs">
                <Building2 size={16} />
              </div>
              <span className="text-xs md:text-sm font-bold text-[#1b1b1d] tracking-wide whitespace-nowrap">
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

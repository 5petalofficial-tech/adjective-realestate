"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function SellPropertyPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F2] flex flex-col">

      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= MAIN CONTENT ================= */}
      <section className="flex-1 relative overflow-hidden">

        {/* Subtle decorative background */}
        <div className="absolute top-20 right-0 w-72 h-72 bg-[#EEF0DF] rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#FFF3D6] rounded-full blur-3xl opacity-40 pointer-events-none" />

        <div className="relative w-full max-w-6xl mx-auto px-6 md:px-8 py-16 md:py-20">

          {/* ================= HEADING ================= */}
          <div className="text-center mb-12 md:mb-14">

            <div className="flex items-center justify-center gap-5 mb-4">
              
              <span className="hidden sm:block w-12 h-px bg-[#C9CCAE]" />

              <p className="text-[#5E6623] uppercase tracking-[4px] text-xs md:text-sm font-semibold">
                Sell Property
              </p>

              <span className="hidden sm:block w-12 h-px bg-[#C9CCAE]" />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[56px] leading-tight font-serif text-[#2F3A18] mb-5">
              What would you like to do?
            </h1>

            <p className="text-[#5C6470] max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              Choose an option below to continue with your property listing.
            </p>
          </div>

          {/* ================= OPTIONS ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 lg:gap-8 max-w-[1080px] mx-auto">

            {/* ================================================= */}
            {/* SELL MY PROPERTY */}
            {/* ================================================= */}
            <Link
              href="/sell-property/sell-my-property"
              className="group block"
            >
              <div className="h-full overflow-hidden rounded-2xl bg-white border border-[#DDDCCA] shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">

                {/* Image */}
                <div className="relative h-[280px] sm:h-[300px] md:h-[320px] lg:h-[340px] overflow-hidden">
  <img
    src="/Sell-Property/resell-property.jpg"
    alt="Sell My Property"
    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
  />

  <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
</div>
                {/* Content */}
                <div className="px-7 md:px-8 pt-8 pb-8">

                  <h2 className="text-2xl md:text-[28px] font-serif text-[#2F3A18] mb-3">
                    Sell My Property
                  </h2>

                  <p className="text-[#5C6470] leading-7 text-[15px] md:text-base max-w-[500px] mb-7">
                    Already own a property and want to sell it?
                    Submit your property details and connect with interested buyers.
                  </p>

                  {/* Continue */}
                  <div className="inline-flex items-center gap-2 text-[#5E6623] font-semibold text-sm uppercase tracking-wide">
                    Continue

                    <ArrowRight
                      size={19}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </div>
            </Link>


            {/* ================================================= */}
            {/* LIST NEW PROPERTY */}
            {/* ================================================= */}
            <Link
              href="/sell-property/list-new-property"
              className="group block"
            >
              <div className="h-full overflow-hidden rounded-2xl bg-white border border-[#DDDCCA] shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">

              <div className="relative h-[280px] sm:h-[300px] md:h-[320px] lg:h-[340px] overflow-hidden">
  <img
    src="/Sell-Property/new-property.avif"
    alt="List New Property"
    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
  />

  <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
</div>
                {/* Content */}
                <div className="px-7 md:px-8 pt-8 pb-8">

                  <h2 className="text-2xl md:text-[28px] font-serif text-[#2F3A18] mb-3">
                    List New Property
                  </h2>

                  <p className="text-[#5C6470] leading-7 text-[15px] md:text-base max-w-[500px] mb-7">
                    Are you a builder, developer or property owner
                    looking to list a new project or property?
                  </p>

                  {/* Continue */}
                  <div className="inline-flex items-center gap-2 text-[#5E6623] font-semibold text-sm uppercase tracking-wide">
                    Continue

                    <ArrowRight
                      size={19}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <Footer />

    </main>
  );
}
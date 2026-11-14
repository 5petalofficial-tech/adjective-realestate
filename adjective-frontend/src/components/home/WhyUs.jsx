import Image from "next/image";
import Link from "next/link";
import { Globe, UserRound } from "lucide-react";


export default function WhyUs() {
  return (
    <section
  id="why-us"
  className="py-stack-lg px-4 sm:px-6 lg:px-8 xl:px-10 max-w-[1470px] mx-auto"
>

      {/* ── 2-COLUMN GRID ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg items-center">

        <div className="relative">

          <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary-container/50 -z-10 rounded-full blur-3xl" />

          {/* Image wrapper — rounded card with hover color effect */}
          <div className="relative rounded-xl shadow-2xl overflow-hidden group">
            
            <Image
              src="/Adjective/Adjective_Office.webp"
              alt="Adjective office"
              width={600}
              height={450}
              className="w-full transition-all duration-700"
              unoptimized
            />
          </div>

          <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-xl premium-shadow hidden md:block">
            <p className="font-display-lg text-5xl text-primary font-bold">10+</p>
            <p className="text-xs font-label-sm-uppercase uppercase tracking-widest text-outline">Years of Heritage</p>
          </div>
        </div>

        {/* ══ RIGHT COLUMN: Text content ═══════════════════════ */}
        <div className="md:pl-12">

          {/* Section heading — Playfair Display serif */}
          <h2 className="font-headline-md text-3xl md:text-4xl mt-4 mb-2 text-[#2F7D32]">
          Welcome to Adjective
          </h2>

          {/* Small eyebrow label */}
          <span className="block text-xs font-label-sm-uppercase uppercase tracking-widest text-outline mb-4">DEFINING THE NOUN</span>

          {/* Body paragraph */}
          <p className="text-base font-body-lg text-on-surface-variant mb-stack-md ">
            At Adjective, we believe a home is much more than bricks, mortar, and concrete. It is an emotional sanctuary — a space filled with love, affection, peace (sukun), family bonds, aspirations, and lifelong memories. Understanding this deep human connection, we act as a thoughtful bridge between home buyers and property sellers.
            We are a real estate marketing and consultancy company dedicated to making the journey of buying or selling a home more meaningful, transparent, and emotionally fulfilling.

          </p>

          {/* ── FEATURE LIST ──────────────────────────────────── */}
          <ul className="space-y-5 mb-8">

            <li className="flex items-start gap-4">
              {/* Gold outlined circle icon badge — matches reference mockup */}
              <span className="flex items-center justify-center w-11 h-11 shrink-0 rounded-full border border-[#FFC85C] text-[#FFC85C]">
                <Globe className="w-5 h-5" strokeWidth={1.75} />
              </span>
              <div>
                <p className="font-title-lg text-sm text-on-surface">Global Network</p>
                <p className="text-sm font-body-md text-outline">Access to exclusive partnerships in whole kolkata.</p>
              </div>
            </li>

            {/* Feature item 2 — Concierge Service */}
            <li className="flex items-start gap-4">
              <span className="flex items-center justify-center w-11 h-11 shrink-0 rounded-full border border-[#FFC85C] text-[#FFC85C]">
                <UserRound className="w-5 h-5" strokeWidth={1.75} />
              </span>
              <div>
                <p className="font-title-lg text-sm text-on-surface">Concierge Service</p>
                <p className="text-sm font-body-md text-outline">Dedicated agents providing 24/7 personalized support.</p>
              </div>
            </li>
          </ul>

          {/* CTA Button */}
          <Link
            href="/why-us"
            className="inline-block bg-[#5E6623] text-[#FAF8F2] px-8 py-4 rounded-lg text-sm font-label-md font-bold hover:-translate-y-0.5 transition-all shadow-md hover:bg-[#4E541E]"
          >
            Learn Our Story
          </Link>
        </div>

      </div>
    </section>
  );
}

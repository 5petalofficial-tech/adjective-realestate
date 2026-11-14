"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactUsModal from "@/components/common/ContactUsModal";
import {
  Sparkles,
  Heart,
  ShieldCheck,
  Compass,
  CheckCircle2,
  ArrowRight,
  Users,
  Target,
  Eye,
  Building2,
  Home,
  MessageSquare,
  PhoneCall,
  Scale,
  Award
} from "lucide-react";

export default function OurStoryPage() {
  const [contactModalOpen, setContactModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F2] text-[#1b1b1d] selection:bg-[#5E6623]/20">
      <Navbar />

      <div className="h-24"></div>

      {/* ── HERO BANNER ────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-[#1F2818] via-[#2F3A25] to-[#5E6623] text-white py-20 px-6 sm:px-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFC85C_1px,transparent_1px)] [background-size:20px_20px]"></div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFC85C] text-xs font-semibold uppercase tracking-widest mb-6 block mx-auto w-fit">
            <Sparkles className="w-4 h-4" />
            <span>Defining the Noun</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Our Story & <span className="text-[#FFC85C] italic">Philosophy</span>
          </h1>

          <p className="text-white/90 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed mb-10 font-body">
            “Home” is a noun. We are the <strong className="text-[#FFC85C]">Adjective</strong> that defines it beautifully — adding emotion, character, and soul to every property we touch. We don’t just market properties; we help people find a place that truly feels like home.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setContactModalOpen(true)}
              className="px-8 py-4 rounded-xl bg-[#FFC85C] hover:bg-[#f0b746] text-[#1b2316] font-bold text-xs uppercase tracking-widest transition shadow-xl flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Book a Free Consultation
            </button>
            <Link
              href="/projects"
              className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs uppercase tracking-widest transition flex items-center gap-2"
            >
              Explore Residences
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ───────────────────────────────────────── */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-16 space-y-20">

        {/* 1. WHO WE ARE */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-[#5E6623]/15 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#5E6623]/5 rounded-bl-full pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#5E6623] mb-3">
            <Users className="w-4 h-4" />
            <span>Who We Are</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl text-[#1b1b1d] font-bold mb-6 leading-tight">
            Consultants First. <span className="text-[#5E6623] italic">Not Brokers.</span>
          </h2>

          <div className="space-y-4 text-[#4a4d35] text-base leading-relaxed font-body">
            <p>
              Adjective is not a real estate developer, nor are we traditional brokers. We are trusted consultants who prioritize knowledge, empathy, and genuine guidance over aggressive selling.
            </p>
            <p>
              Our primary focus is on serving home buyers by deeply understanding their desires, needs, lifestyle, values, and aspirations. We then offer practical, amicable solutions that align with their purpose. We believe in sharing complete facts — never forcing or insisting — so our clients can make confident, well-informed decisions.
            </p>
          </div>
        </section>

        {/* 2. MISSION & VISION GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="bg-gradient-to-br from-white to-[#FAF8F2] rounded-3xl p-8 sm:p-10 border border-[#5E6623]/20 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#5E6623] text-white flex items-center justify-center mb-6 shadow-md">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1b1b1d] mb-4">Our Mission</h3>
              <p className="text-[#4a4d35] text-sm sm:text-base leading-relaxed">
                To redefine the real estate experience by delivering knowledgeable, transparent, and emotionally intelligent consultancy that helps every individual find their perfect home while supporting sellers in reaching the right buyers.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="bg-gradient-to-br from-[#2D3823] to-[#5E6623] text-white rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFC85C]/10 rounded-bl-full pointer-events-none" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFC85C] text-[#1b2316] flex items-center justify-center mb-6 shadow-md">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed">
                To become the most trusted and appreciated real estate consultancy platform in India, where buyers feel genuinely supported and sellers receive ethical, effective marketing support — creating win-win outcomes rooted in trust and satisfaction.
              </p>
            </div>
          </div>
        </section>

        {/* 3. WHY WE ARE DIFFERENT */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5E6623]">Pillars of Excellence</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1b1b1d] mt-2">
              Why We Are <span className="text-[#5E6623] italic">Different</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#76777d] mt-2">
              We stand apart through our commitment to transparency, empathy, and holistic guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Consultants, Not Brokers",
                desc: "Our goal is not just to close deals but to become a valuable partner in your journey. We focus on providing expert guidance rather than pushing properties."
              },
              {
                icon: Heart,
                title: "Deep Understanding of Needs",
                desc: "We take time to understand your desires, family requirements, future aspirations, and personal values before suggesting any options."
              },
              {
                icon: Scale,
                title: "Transparent & Honest Approach",
                desc: "We share complete facts — both positive and negative — so you can make decisions with confidence and peace of mind."
              },
              {
                icon: Compass,
                title: "Holistic Guidance",
                desc: "We provide insights on Vastu principles, government schemes (like PMAY), RERA-approved projects, legal aspects, and other important details."
              },
              {
                icon: Award,
                title: "Value-Driven Service",
                desc: "Our ultimate aim is to earn your appreciation as a trusted advisor who adds real value to your most important purchase — your home."
              },
              {
                icon: Sparkles,
                title: "Emotional + Practical Balance",
                desc: "We combine emotional understanding of “home” with practical knowledge of specifications, amenities, location advantages, and documentation."
              }
            ].map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-[#5E6623]/15 hover:border-[#5E6623] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#FAF8F2] text-[#5E6623] flex items-center justify-center mb-4 border border-[#5E6623]/20">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#1b1b1d] mb-2">{pillar.title}</h3>
                    <p className="text-xs sm:text-sm text-[#4a4d35] leading-relaxed">{pillar.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. WHAT WE DO */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-[#5E6623]/20 shadow-sm space-y-10">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5E6623]">Our Offerings</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1b1b1d] mt-2">What We Do</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Buyers */}
            <div className="bg-[#FAF8F2] rounded-2xl p-6 sm:p-8 border border-[#5E6623]/15 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#5E6623] text-white flex items-center justify-center shrink-0">
                  <Home className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#1b1b1d]">For Home Buyers</h3>
              </div>
              <p className="text-xs text-[#76777d]">We offer personalized consultancy services that include:</p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#4a4d35]">
                {[
                  "Understanding your requirements and aspirations",
                  "Curated property recommendations based on your needs",
                  "Expert guidance on Vastu, legal aspects, and government benefits (PMAY, RERA, etc.)",
                  "Transparent information about approved projects",
                  "Support throughout your decision-making process"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5E6623] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Sellers */}
            <div className="bg-[#FAF8F2] rounded-2xl p-6 sm:p-8 border border-[#5E6623]/15 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#5E6623] text-white flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#1b1b1d]">For Builders & Property Sellers</h3>
              </div>
              <p className="text-xs text-[#76777d]">We provide complete marketing solutions including:</p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#4a4d35]">
                {[
                  "Professional website design and development",
                  "Strategic property promotion on our platform",
                  "Emotional brand storytelling that attracts the right buyers"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5E6623] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 5. OUR CORE VALUES */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5E6623]">Guiding Principles</span>
            <h2 className="font-serif text-3xl font-bold text-[#1b1b1d] mt-2">Our Core Values</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Empathy & Emotional Intelligence",
              "Transparency & Honesty",
              "Knowledge & Expertise",
              "Ethical Consultancy",
              "Client Appreciation & Relationships",
              "Holistic Guidance (Vastu, PMAY, Legal)"
            ].map((val, idx) => (
              <div
                key={idx}
                className="px-5 py-3 rounded-full bg-white border border-[#5E6623]/20 shadow-sm text-xs sm:text-sm font-semibold text-[#5E6623] flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#FFC85C]" />
                <span>{val}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 6. CLOSING STATEMENT */}
        <section className="bg-gradient-to-br from-[#121810] via-[#212C1A] to-[#141A12] text-white rounded-[32px] p-8 sm:p-14 lg:p-16 shadow-2xl border border-[#FFC85C]/25 relative overflow-hidden text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#FFC85C]/40 bg-[#FFC85C]/10 text-[#FFC85C] text-[11px] font-bold uppercase tracking-[0.2em] shadow-sm">
            <Heart className="w-3.5 h-3.5 text-[#FFC85C]" />
            <span>Why Choose Adjective?</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold max-w-4xl mx-auto leading-tight">
            When you partner with <span className="text-[#FFC85C] italic">Adjective</span>, you’re gaining a knowledgeable companion who genuinely cares.
          </h2>

          <div className="relative max-w-2xl mx-auto bg-white/[0.04] backdrop-blur-sm border border-[#FFC85C]/25 rounded-2xl p-6 sm:p-8">
            <p className="font-serif text-xl sm:text-2xl text-[#FFC85C] italic font-semibold tracking-wide">
              “At Adjective, we don’t sell homes — we define them.”
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-2">
            <button
              onClick={() => setContactModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#FFC85C] to-[#e8b548] text-[#1b2316] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 group"
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>Get Free Consultation</span>
              <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </section>
      </main>

      <Footer />

      <ContactUsModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactUsModal from "@/components/common/ContactUsModal";
import { 
  Search, 
  ChevronDown, 
  HelpCircle, 
  MessageSquare, 
  ArrowLeft, 
  PhoneCall, 
  Sparkles
} from "lucide-react";

const faqData = [
  {
    id: 1,
    category: "about",
    question: "What is Adjective?",
    answer:
      "Adjective is a real estate consultancy and marketing company that acts as a trusted bridge between home buyers and property sellers (developers, builders, and individual owners). We specialize in emotional and practical real estate solutions, helping buyers find their perfect home and assisting sellers in marketing their properties effectively."
  },
  {
    id: 2,
    category: "about",
    question: "Are you a real estate developer or broker?",
    answer:
      "No. We are neither developers nor traditional brokers. We are professional real estate consultants. Our focus is on providing genuine guidance, knowledge, and personalized solutions rather than pushing sales."
  },
  {
    id: 3,
    category: "about",
    question: "What does “Defining the Noun” mean?",
    answer:
      "“Home” or “House” is a noun. As an adjective, we define and enhance it with emotion, character, and soul. We believe a home is not just concrete — it represents love, peace (sukun), family, aspirations, and memories. Our job is to help people find and present homes that truly feel like “home.”"
  },
  {
    id: 4,
    category: "buyers",
    question: "How do you help home buyers?",
    answer:
      "We act as consultants who deeply understand your needs, desires, lifestyle, budget, and aspirations. We provide personalized recommendations, complete information about properties, Vastu guidance, government schemes (like PMAY), RERA-approved projects, and help you make informed, stress-free decisions without any pressure."
  },
  {
    id: 5,
    category: "sellers",
    question: "How do you help builders and property sellers?",
    answer:
      "We offer comprehensive marketing services including website design & development, social media marketing, content creation, property listing on our platform, and emotional brand storytelling to help them reach genuine buyers and sell faster."
  },
  {
    id: 6,
    category: "about",
    question: "What makes Adjective different from other real estate companies?",
    answer:
      "What sets us apart:\n• We are consultants, not brokers — our priority is your satisfaction, not just closing deals.\n• We focus on emotional understanding along with practical knowledge.\n• We provide holistic guidance including Vastu, legal clarity, government benefits, and transparent facts.\n• We aim to become a valuable partner in your journey and earn your appreciation."
  },
  {
    id: 7,
    category: "services",
    question: "Do you provide Vastu consultancy?",
    answer:
      "Yes. We offer Vastu guidance to help buyers choose properties that align with their beliefs and bring positive energy to their future home."
  },
  {
    id: 8,
    category: "services",
    question: "Do you help with government schemes and approvals?",
    answer:
      "Absolutely. We guide buyers about various government benefits such as PMAY (Pradhan Mantri Awas Yojana) and other schemes. We also provide information about RERA-approved projects and help you understand important legal and regulatory aspects."
  },
  {
    id: 9,
    category: "services",
    question: "What services do you offer?",
    answer:
      "Our core services include:\n• Personalized home buying consultancy\n• Property matchmaking based on your requirements\n• Real estate marketing for builders & sellers\n• Website design and development\n• Vastu consultancy\n• Guidance on RERA, PMAY & other government benefits"
  },
  {
    id: 10,
    category: "sellers",
    question: "Can individual property owners list their homes with you?",
    answer:
      "Yes. Both developers and individual sellers can promote their properties through our platform and benefit from our marketing expertise."
  },
  {
    id: 11,
    category: "about",
    question: "How do you ensure transparency?",
    answer:
      "We believe in complete honesty. We share both the strengths and limitations of every property so you can make confident and informed decisions. We never insist or pressure clients — we only suggest suitable options."
  },
  {
    id: 12,
    category: "about",
    question: "How can I get started with Adjective?",
    answer:
      "You can reach out to us through our website, WhatsApp, or email. Whether you are looking for your dream home or want to market your property, we begin with a free consultation to understand your needs and goals."
  }
];

const categories = [
  { id: "all", label: "All Questions" },
  { id: "about", label: "About Adjective" },
  { id: "buyers", label: "For Buyers" },
  { id: "sellers", label: "For Sellers" },
  { id: "services", label: "Services & Guidance" },
];

export default function FAQsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openFaq, setOpenFaq] = useState(1);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const toggleFaq = (id) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  const filteredFaqs = faqData.filter((faq) => {
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F2] text-[#1b1b1d] selection:bg-[#5E6623]/20">
      <Navbar />

      <div className="h-24"></div>

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#1b2316] via-[#2D3823] to-[#5E6623] text-white py-16 px-6 sm:px-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFC85C_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFC85C] text-xs font-semibold uppercase tracking-widest mb-6">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions? We Have Answers</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight mb-4 leading-tight">
            Frequently Asked <span className="text-[#FFC85C] italic">Questions</span>
          </h1>

          <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            Learn more about how Adjective Real Estate defines homes with emotion, practical wisdom, complete transparency, and expert consultancy.
          </p>

          {/* Search Box */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5E6623]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search any question or keyword..."
              className="w-full bg-white text-[#1b1b1d] placeholder:text-[#76777d] rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-[#FFC85C]/40 shadow-xl transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#76777d] hover:text-[#1b1b1d] uppercase font-bold"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar justify-start sm:justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                activeCategory === cat.id
                  ? "bg-[#5E6623] text-white shadow-md scale-105"
                  : "bg-white text-[#5E6623] hover:bg-[#5E6623]/10 border border-[#5E6623]/20"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQs Count indicator */}
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#5E6623]/15 text-xs text-[#76777d]">
          <span>Showing <strong>{filteredFaqs.length}</strong> of {faqData.length} questions</span>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[#5E6623] font-semibold hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Homepage
          </Link>
        </div>

        {/* Accordions List */}
        {filteredFaqs.length > 0 ? (
          <div className="space-y-4">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "bg-white border-[#5E6623] shadow-md ring-1 ring-[#5E6623]/30"
                      : "bg-white/80 hover:bg-white border-[#5E6623]/15 hover:border-[#5E6623]/40 shadow-sm"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-semibold text-base sm:text-lg text-[#1b1b1d] transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-start gap-3">
                      <span className="text-[#5E6623] font-serif font-bold text-sm sm:text-base mt-0.5 shrink-0">
                        {String(faq.id).padStart(2, "0")}.
                      </span>
                      <span>{faq.question}</span>
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? "bg-[#5E6623] text-white rotate-180"
                          : "bg-[#FAF8F2] text-[#5E6623]"
                      }`}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 border-t border-dashed border-[#5E6623]/10 text-sm sm:text-base text-[#4a4d35] leading-relaxed animate-fadeIn">
                      {faq.answer.includes("\n") ? (
                        <div className="space-y-2 whitespace-pre-line font-body">
                          {faq.answer}
                        </div>
                      ) : (
                        <p className="font-body">{faq.answer}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-[#5E6623]/30 px-6">
            <HelpCircle className="w-12 h-12 text-[#5E6623]/40 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#1b1b1d] mb-2 font-serif">
              No matching questions found
            </h3>
            <p className="text-xs text-[#76777d] max-w-md mx-auto mb-6">
              We couldn't find any FAQs matching your search term "{searchTerm}". Feel free to reach out directly to our team!
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="px-6 py-2.5 rounded-full bg-[#5E6623] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#4a511c] transition"
            >
              Reset Search Filter
            </button>
          </div>
        )}

        {/* CTA Banner at Bottom */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-[#2D3823] to-[#5E6623] text-white p-8 sm:p-12 relative overflow-hidden shadow-xl flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-[#FFC85C]/10 blur-2xl pointer-events-none"></div>
          
          <div className="space-y-2 text-center sm:text-left relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#FFC85C]">
              <Sparkles className="w-4 h-4" /> Still Need Clarity?
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold">
              Have a custom property requirement?
            </h3>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
              Our real estate consultants are always available for a free, no-obligation conversation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 relative z-10 w-full sm:w-auto">
            <button
              onClick={() => setContactModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#FFC85C] hover:bg-[#f0b746] text-[#1b2316] font-bold text-xs uppercase tracking-widest transition shadow-lg flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Contact Us Now
            </button>
            <a
              href="https://wa.me/916294374584"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs uppercase tracking-widest transition flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              WhatsApp Support
            </a>
          </div>
        </div>
      </main>

      <Footer />

      {/* Contact Us Modal */}
      <ContactUsModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </div>
  );
}

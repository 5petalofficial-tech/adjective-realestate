"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { apiRequest } from "@/utils/api";
import { 
  HeartHandshake, 
  Star, 
  MessageSquarePlus, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  UserCheck, 
  Lightbulb, 
  Paperclip, 
  AlertCircle,
  ThumbsUp,
  MessageCircle,
  Mail,
  ArrowRight
} from "lucide-react";

// Website Brand Colors
const BRAND_OLIVE = "#5E6623";
const BRAND_DARK_OLIVE = "#3D4316";

const feedbackCategories = [
  { id: "general", label: "General Feedback", icon: MessageSquarePlus },
  { id: "listings", label: "Property Search & Listings", icon: Sparkles },
  { id: "experience", label: "Website Experience & Usability", icon: HeartHandshake },
  { id: "consultant", label: "Consultant Service Quality", icon: UserCheck },
  { id: "feature", label: "Feature Request & Ideas", icon: Lightbulb },
];

const ratingLabels = {
  1: "Needs Significant Improvement 😞",
  2: "Below Expectations 🙁",
  3: "Good & Acceptable 🙂",
  4: "Very Good & Helpful 😀",
  5: "Exceptional Experience! 🌟",
};

export default function HelpUsToImprovePage() {
  const [category, setCategory] = useState("general");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  // Form Fields
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [positiveNotes, setPositiveNotes] = useState("");
  const [improvementNotes, setImprovementNotes] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);

  // State
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Handle File Upload Simulation
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  // Form Submit Handler
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!improvementNotes.trim()) return;

  // Email validation
  if (!isAnonymous && email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
  }

  // Phone validation
  if (!isAnonymous && phone) {
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(phone)) {
      setPhoneError("Please enter a valid 10-digit mobile number");
      return;
    }
  }

  // Clear errors before submitting
  setEmailError("");
  setPhoneError("");

  setSubmitting(true);

  try {
    const payloadName = isAnonymous
      ? "Anonymous User"
      : (name || "Valued Visitor");

    const categoryLabel =
      feedbackCategories.find((c) => c.id === category)?.label || category;

    await apiRequest("/enquiry", {
      method: "POST",
      body: JSON.stringify({
        name: payloadName,
        email: isAnonymous ? "anonymous@5petal.in" : (email || "N/A"),
        phone: isAnonymous ? "N/A" : (phone || "N/A"),
        enquiryType: `HELP US TO IMPROVE - ${categoryLabel.toUpperCase()}`,
        propertyName: `Rating: ${rating}/5 stars (${ratingLabels[rating]})`,
        message: `Category: ${categoryLabel}
Rating: ${rating}/5 Stars
User Status: ${
          isAnonymous
            ? "Submitted Anonymously"
            : "Contact details provided"
        }

What User Liked: ${positiveNotes || "N/A"}

What To Improve / Feedback: ${improvementNotes}

Attached File: ${attachedFile ? attachedFile.name : "None"}`,
      }),
    });

    setSubmitting(false);
    setSubmitted(true);
  } catch (err) {
    setSubmitting(false);

    alert(
      "Something went wrong while sending feedback. Please try again or email us directly at hello@5petal.in"
    );
  }
};
  const resetForm = () => {
  setSubmitted(false);

  setName("");
  setEmail("");
  setPhone("");

  setEmailError("");
  setPhoneError("");

  setPositiveNotes("");
  setImprovementNotes("");
  setAttachedFile(null);

  setRating(5);
  setCategory("general");
};

  return (
    <div className="min-h-screen bg-[#F9FAF6] text-slate-800 font-sans selection:bg-[#5E6623] selection:text-white">
      <Navbar />

      {/* ── HERO BANNER ────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 bg-[#5E6623] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white/90 text-xs font-semibold uppercase tracking-widest backdrop-blur-md mb-4 border border-white/20">
            <HeartHandshake className="w-3.5 h-3.5" /> Your Voice Matters
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Help Us To Improve
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-white/85 font-light leading-relaxed">
            Every home buying journey is unique. Share your suggestions, report issues, or tell us how we can refine Adjective Real Estate to serve you better.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT ───────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16 relative z-20">
        <div className="bg-white rounded-2xl shadow-[0_15px_45px_rgba(94,102,35,0.08)] border border-black/5 p-6 sm:p-10">

          {submitted ? (
            /* ── SUCCESS STATE CARD ──────────────────────────────── */
            <div className="text-center py-12 px-4 space-y-6 animate-fadeIn">
              <div className="w-20 h-20 bg-[#5E6623]/10 text-[#5E6623] rounded-full flex items-center justify-center mx-auto border-2 border-[#5E6623]/20 shadow-inner">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Thank You For Your Feedback!
                </h2>
                <p className="max-w-lg mx-auto text-sm sm:text-base text-gray-600 leading-relaxed">
                  Your response has been delivered directly to our core leadership team. We review every suggestion to continuously elevate our services.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F8F4] border border-[#5E6623]/20 max-w-md mx-auto text-xs text-gray-700 flex items-center gap-3 text-left">
                <ShieldCheck className="w-6 h-6 text-[#5E6623] flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">Direct Impact:</strong> Your input shapes verified property guidelines, consultant training, and app features.
                </div>
              </div>

              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <button
                  onClick={resetForm}
                  className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-bold text-xs uppercase tracking-wider hover:bg-gray-50 transition-colors"
                >
                  Submit Another Feedback
                </button>
                <a
                  href="/projects"
                  className="px-6 py-3 rounded-lg bg-[#5E6623] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#4A521A] transition-colors inline-flex items-center gap-2"
                >
                  <span>Explore Properties</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ) : (
            /* ── FEEDBACK FORM ───────────────────────────────────── */
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* 1. CATEGORY SELECTION */}
              <div>
                <label className="block text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
                  1. What would you like to share feedback about?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {feedbackCategories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`p-3.5 rounded-xl border text-center flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
                          isSelected
                            ? "bg-[#5E6623] text-white border-[#5E6623] shadow-md shadow-[#5E6623]/20 ring-2 ring-[#5E6623]"
                            : "bg-gray-50/80 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-[#5E6623]"}`} />
                        <span className="text-xs font-bold leading-tight">
                          {cat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. STAR RATING */}
              <div className="bg-[#F7F8F4] rounded-xl p-6 border border-gray-200/80 text-center space-y-3">
                <label className="block text-sm font-bold text-gray-800 uppercase tracking-wider">
                  2. Overall rating of your experience with Adjective
                </label>

                {/* Stars */}
                <div className="flex justify-center items-center gap-2 sm:gap-3 py-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const activeStar = hoverRating ? star <= hoverRating : star <= rating;
                    return (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-125 focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors duration-200 ${
                            activeStar
                              ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                              : "text-gray-300 fill-gray-100"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="text-xs sm:text-sm font-bold text-[#5E6623]">
                  {ratingLabels[hoverRating || rating]}
                </div>
              </div>

              {/* 3. DETAILED COMMENTS */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    What did you like about Adjective? <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Clean interface, helpful consultation, accurate pricing..."
                    value={positiveNotes}
                    onChange={(e) => setPositiveNotes(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#5E6623] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    How can we improve or what needs fixing? *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Please describe your suggestions, feature ideas, or any issues you encountered..."
                    value={improvementNotes}
                    onChange={(e) => setImprovementNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#5E6623] focus:border-transparent transition-all"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                    <span>Be as specific as possible to help us address it quickly.</span>
                    <span>{improvementNotes.length} characters</span>
                  </div>
                </div>

                {/* File Attachment Upload Box */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Attach Screenshot / Document <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex flex-col items-center justify-center gap-1.5 text-gray-500">
                      <Paperclip className="w-5 h-5 text-[#5E6623]" />
                      {attachedFile ? (
                        <span className="text-xs font-bold text-[#5E6623]">{attachedFile.name}</span>
                      ) : (
                        <span className="text-xs">
                          Click to attach screenshot or file <span className="text-gray-400">(JPG, PNG, PDF up to 5MB)</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. CONTACT / ANONYMOUS TOGGLE */}
              <div className="pt-4 border-t border-gray-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                    Contact Details for Follow-up
                  </label>

                  {/* Anonymous Toggle switch */}
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-600">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="sr-only peer"
                    />
                    <span>Submit Anonymously</span>
                    <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5E6623] relative" />
                  </label>
                </div>

                {!isAnonymous ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Your Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#5E6623]"
                      />
                    </div>
                    <div>
 <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
  Email Address <span className="text-red-500">*</span>
</label>

  <input
    type="email"
    placeholder="john@example.com"
    value={email}
    onChange={(e) => {
      setEmail(e.target.value);

      // Clear error while typing a valid email
      if (emailError) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailRegex.test(e.target.value)) {
          setEmailError("");
        }
      }
    }}
    onBlur={() => {
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
          setEmailError("Please enter a valid email address");
        } else {
          setEmailError("");
        }
      } else {
        setEmailError("");
      }
    }}
    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#5E6623] ${
      emailError ? "border-red-500" : "border-gray-300"
    }`}
  />

  {emailError && (
    <p className="text-red-500 text-xs mt-1">
      {emailError}
    </p>
  )}
</div>
                   <div>
  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
  Phone Number <span className="text-red-500">*</span>
</label>

  <input
    type="tel"
    inputMode="numeric"
    maxLength={10}
    placeholder="10-digit mobile"
    value={phone}
    onChange={(e) => {
      // Only allow numbers
      const value = e.target.value.replace(/\D/g, "");

      setPhone(value);

      // Clear error when valid
      if (/^[6-9]\d{9}$/.test(value)) {
        setPhoneError("");
      } else if (value.length === 10) {
        setPhoneError("Please enter a valid 10-digit mobile number");
      } else {
        setPhoneError("");
      }
    }}
    onBlur={() => {
      if (phone && !/^[6-9]\d{9}$/.test(phone)) {
        setPhoneError("Please enter a valid 10-digit mobile number");
      } else {
        setPhoneError("");
      }
    }}
    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#5E6623] ${
      phoneError ? "border-red-500" : "border-gray-300"
    }`}
  />

  {phoneError && (
    <p className="text-red-500 text-xs mt-1">
      {phoneError}
    </p>
  )}
</div>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-100 rounded-lg text-xs text-gray-500 font-medium">
                    🔒 Anonymous Mode Enabled: Your contact details will not be recorded with this feedback.
                  </div>
                )}
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={submitting || !improvementNotes.trim()}
                className="w-full py-3.5 bg-[#5E6623] hover:bg-[#4A521A] text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all uppercase text-xs tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <span>Sending Feedback...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>

            </form>
          )}

        </div>
      </section>

      {/* ── WHY YOUR FEEDBACK MATTERS SECTION ──────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            How Your Feedback Drives Excellence
          </h2>
          <p className="text-sm text-gray-500 max-w-xl mx-auto mt-1">
            At Adjective Real Estate, we are committed to defining homes with transparency, integrity, and user-driven continuous improvement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#5E6623]/10 text-[#5E6623] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">3-Tier Verification</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Based on buyer feedback, every project undergoes strict legal check, RERA compliance audit, and site location inspection before listing.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#5E6623]/10 text-[#5E6623] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">Simplified Tools</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Our Vastu checks, PMAY guidance, and Home Loan EMI Visualizers were created directly from user feature suggestions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#5E6623]/10 text-[#5E6623] flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">Consultant Accountability</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Your service ratings directly ensure our consultants remain focused on genuine guidance without aggressive sales pressure.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

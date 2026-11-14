"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { apiRequest } from "@/utils/api";
import { 
  Building2, 
  Home, 
  MapPin, 
  IndianRupee, 
  User, 
  Phone, 
  Mail, 
  Upload, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  FileText,
  Compass,
  Car,
  Layers,
  FileCheck,
  AlertCircle
} from "lucide-react";

export default function SellPropertyPage() {
  // Category state: 'flat' or 'house'
  const [category, setCategory] = useState("flat");

  // Form Fields State
  const [formData, setFormData] = useState({
    // General / Basic
    propertyTitle: "",
    locality: "",
    fullAddress: "",
    frontRoadWidth: "",

    // Flat Specific
    bua: "",
    sbua: "",
    carpetArea: "",
    floorNo: "",
    totalFloors: "",
    buildingConfig: "", // e.g. B+G+12
    noOfTowers: "1",
    balconyCount: "1",
    balconyDetails: "", // Size & Facing
    parkingAvailable: "Yes",
    parkingType: "Covered",
    parkingArea: "",
    parkingSlots: "1",
    flatFacing: "East",
    handoverDate: "",

    // Individual Building / House Specific
    landArea: "",
    houseBua: "",
    noOfFloors: "G+1",
    houseAge: "",
    houseParkingDetails: "",
    buildingPlanType: "Blueprint Plan",

    // Common Legal & Docs
    registrationStatus: "Registered",
    liabilities: "No Liabilities",
    liabilitiesDetails: "",
    mutationStatus: "Done",
    ownershipType: "Freehold",
    loanPossible: "Yes",
    completionCertificate: "Yes",
    bedrooms: "3 BHK",
    bathrooms: "2",

    // Price & Negotiation
    price: "",
    isNegotiable: "Yes",

    // Owner Contact
    ownerName: "",
    phone: "",
    email: "",
    additionalNotes: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
//   const validatePhone = (phone) => {
//   return /^[6-9]\d{9}$/.test(phone);
// };

const [email, setEmail] = useState("");
const [emailError, setEmailError] = useState("");

const [phone, setPhone] = useState("");
const [phoneError, setPhoneError] = useState("");

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  
const handleSubmit = async (e) => {
  e.preventDefault();

  const phone = formData.phone.trim();
  const email = formData.email.trim();

  if (!validatePhone(phone)) {
    alert("Please enter a valid 10-digit Indian mobile number.");
    return;
  }

  if (!validateEmail(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  setLoading(true);

  try {
    const technicalSummary =
      category === "flat"
        ? `
=== FLAT / APARTMENT SPECIFICATIONS ===
- Category: Flat / Apartment
- Sizes: SBUA: ${formData.sbua || "N/A"} sqft | BUA: ${
            formData.bua || "N/A"
          } sqft | Carpet: ${formData.carpetArea || "N/A"} sqft
- Floor: ${formData.floorNo || "N/A"} of ${
            formData.totalFloors || "N/A"
          }
- Building Configuration: ${formData.buildingConfig || "N/A"}
- Towers in Complex: ${formData.noOfTowers}
- Balconies: ${formData.balconyCount} (${
            formData.balconyDetails || "Standard size"
          })
- Parking: ${
            formData.parkingAvailable === "Yes"
              ? `${formData.parkingSlots} slot(s) (${formData.parkingType}, ${
                  formData.parkingArea || "Standard"
                } sqft)`
              : "No Parking"
          }
- Flat Facing: ${formData.flatFacing}
- Handover Date / Building Age: ${formData.handoverDate || "N/A"}
- Front Road Width: ${
            formData.frontRoadWidth
              ? `${formData.frontRoadWidth} ft`
              : "N/A"
          }
`
        : `
=== INDIVIDUAL BUILDING / LAND SPECIFICATIONS ===
- Category: Individual House / Land with Building
- Land Area: ${formData.landArea || "N/A"}
- Built-up Area (BUA): ${formData.houseBua || "N/A"} sqft
- Number of Floors: ${formData.noOfFloors}
- Property Age: ${
            formData.houseAge ? `${formData.houseAge} years` : "N/A"
          }
- Front Road Width: ${
            formData.frontRoadWidth
              ? `${formData.frontRoadWidth} ft`
              : "N/A"
          }
- Car Parking Space: ${
            formData.houseParkingDetails || "Available"
          }
- Building Plan: ${formData.buildingPlanType}
`;

    const legalSummary = `
=== LEGAL & DOCUMENTATION ===
- Property Title Registered: ${formData.registrationStatus}
- Tax Update / Mutation: ${formData.mutationStatus}
- Ownership: ${formData.ownershipType}
- Liabilities / Encumbrances: ${formData.liabilities}${
      formData.liabilitiesDetails
        ? ` (${formData.liabilitiesDetails})`
        : ""
    }
- Bank Loan Possible: ${formData.loanPossible}
- Completion Certificate: ${formData.completionCertificate}
- Selling Price: ₹${
      formData.price
        ? Number(formData.price).toLocaleString("en-IN")
        : "Price on Request"
    }
- Negotiable: ${formData.isNegotiable}
`;

    const ownerSummary = `
=== OWNER CONTACT DETAILS ===
- Owner Name: ${formData.ownerName}
- Phone: ${phone}
- Email: ${email}
${formData.additionalNotes ? `- Notes: ${formData.additionalNotes}` : ""}
`;

    const fullOverview = `
${formData.propertyTitle || "Resale Property Listing"}

${technicalSummary}

${legalSummary}

${ownerSummary}
`;

    await apiRequest("/solo/add", {
      method: "POST",
      body: JSON.stringify({
        ...formData,

        category,

        name:
          formData.propertyTitle ||
          `${formData.bedrooms} in ${formData.locality}`,

        address: formData.fullAddress || formData.locality,

        area: formData.locality,

        price: Number(formData.price) || 0,

        noOfBedrooms: parseInt(formData.bedrooms) || 3,

        noOfToilets: parseInt(formData.bathrooms) || 2,

        superBuiltUpAreaSize:
          Number(formData.sbua) ||
          Number(formData.landArea) ||
          Number(formData.houseBua) ||
          0,

        builtUpAreaSize:
          Number(formData.bua) ||
          Number(formData.houseBua) ||
          0,

        carpetAreaSize: Number(formData.carpetArea) || 0,

        overview: fullOverview,

        facing: formData.flatFacing || "East",

        contactName: formData.ownerName,

        contactPhone: phone,

        contactEmail: email,

        status: "On Hold",

        isVerifiedByAdmin: false,
      }),
    });

    setSubmitted(true);

    window.scrollTo({
      top: 250,
      behavior: "smooth",
    });
  } catch (err) {
    console.error("Sell property submission error:", err);

    alert(
      err?.message ||
        "Something went wrong while submitting the property."
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F2]">
      {/* Navbar */}
      <Navbar />

      {/* Header spacing offset */}
      <div className="h-24"></div>

      {/* ── HERO BANNER ────────────────────────────────────────── */}
      <section className="relative bg-[#5E6623] text-white py-8 md:py-10 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto relative z-10">
          <div className="max-w-2xl">
            <span className="text-[11px] font-label-sm-uppercase uppercase tracking-widest text-[#FFC85C] px-3 py-1 rounded-full border border-[#FFC85C]/30 bg-white/5 inline-flex items-center gap-1.5 mb-3">
              <Sparkles className="w-3 h-3" />
              Luxury Real Estate Listing
            </span>

            <h1 className="font-display-lg text-2xl md:text-4xl text-white leading-tight">
              Sell Your Property with Adjective.
            </h1>

            <p className="mt-2 text-xs md:text-sm text-white/80 font-body-md leading-relaxed">
              Fill in the technical & legal checklist below. Your property will be submitted directly to our Admin team for verification & valuation approval.
            </p>
          </div>
        </div>
      </section>

      {/* ── FORM SECTION ───────────────────────────────────────── */}
      <section className="py-stack-lg px-margin-mobile md:px-margin-desktop max-w-[1100px] mx-auto w-full -mt-6 relative z-20">
        <div className="bg-white rounded-2xl border border-outline-variant/15 shadow-2xl p-6 md:p-10">
          
          {submitted ? (
            <div className="py-12 text-center space-y-6 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#EFF3EB] text-[#5E6623] mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="font-headline-md text-2xl md:text-3xl text-gray-900 font-bold">
                Property Submitted for Approval!
              </h2>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-body-md">
                Thank you, <span className="font-semibold text-gray-900">{formData.ownerName}</span>. Your property details for <span className="font-semibold text-[#5E6623]">{formData.propertyTitle || formData.locality}</span> have been submitted.
              </p>
              
              <div className="bg-[#FAF8F2] p-4 rounded-xl border border-black/5 text-xs text-gray-700 text-left space-y-2">
                <p className="font-bold text-[#5E6623] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Next Steps:
                </p>
                <p>1. Our admin team will verify the property details & legal documents.</p>
                <p>2. Once verified, admin will approve and publish your listing on the live website.</p>
                <p>3. A relationship manager will contact you at <span className="font-semibold">{formData.phone}</span>.</p>
              </div>

              <button
                onClick={() => setSubmitted(false)}
                className="bg-[#5E6623] text-white px-6 py-2.5 rounded-xl text-xs uppercase font-bold tracking-wider hover:bg-[#4E541E] transition shadow-md cursor-pointer mt-4"
              >
                Submit Another Property
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Form Title & Category Selector */}
              <div className="border-b border-gray-100 pb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-[#5E6623]">
                  Resale Property Checklist
                </span>
                <h2 className="font-headline-md text-2xl md:text-3xl text-gray-900 mt-1">
                  Resale Property Details Form
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Select property category below to fill the relevant structural, area, and legal details.
                </p>

                {/* CATEGORY TOGGLE TABS */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setCategory("flat")}
                    className={`py-3.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                      category === "flat"
                        ? "bg-[#5E6623] text-white border-[#5E6623] shadow-md"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Flat / Apartment</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategory("house")}
                    className={`py-3.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                      category === "house"
                        ? "bg-[#5E6623] text-white border-[#5E6623] shadow-md"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>Individual Building / House / Land</span>
                  </button>
                </div>
              </div>

              {/* ── SECTION 1: BASIC INFORMATION ── */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#5E6623]" />
                  1. Basic & Location Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Property Title */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Property Name / Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="propertyTitle"
                      required
                      placeholder="e.g. 3BHK Luxury Flat in Action Area 1"
                      value={formData.propertyTitle}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623]"
                    />
                  </div>

                  {/* Locality */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Locality / Area <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="locality"
                      required
                      placeholder="e.g. Newtown, Kolkata"
                      value={formData.locality}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Full Address */}
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Full Address of Property / Flat <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullAddress"
                      required
                      placeholder="e.g. Flat 5B, Block 2, Greenwood Elements, Action Area 1"
                      value={formData.fullAddress}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623]"
                    />
                  </div>

                  {/* Front Road Width */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Front Road Width (ft) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="frontRoadWidth"
                      required
                      placeholder="e.g. 40 ft road"
                      value={formData.frontRoadWidth}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623]"
                    />
                  </div>
                </div>
              </div>

              {/* ── SECTION 2A: FOR FLAT / APARTMENT ── */}
              {category === "flat" && (
                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#5E6623]" />
                    2. Flat Specifications & Layout
                  </h3>

                  {/* Area Sizes */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Built-up Area (BUA in sqft) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="bua"
                        required
                        placeholder="e.g. 1400"
                        value={formData.bua}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Super Built-up Area (SBUA) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="sbua"
                        required
                        placeholder="e.g. 1650"
                        value={formData.sbua}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Carpet Area (sqft) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="carpetArea"
                        required
                        placeholder="e.g. 1150"
                        value={formData.carpetArea}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623]"
                      />
                    </div>
                  </div>

                  {/* Floor & Config */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Which Floor?
                      </label>
                      <input
                        type="text"
                        name="floorNo"
                        placeholder="e.g. 5th Floor"
                        value={formData.floorNo}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Total Floors
                      </label>
                      <input
                        type="text"
                        name="totalFloors"
                        placeholder="e.g. 12 Floors"
                        value={formData.totalFloors}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Building Config
                      </label>
                      <input
                        type="text"
                        name="buildingConfig"
                        placeholder="e.g. B+G+12 or G+4"
                        value={formData.buildingConfig}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Number of Towers
                      </label>
                      <input
                        type="number"
                        name="noOfTowers"
                        placeholder="e.g. 3"
                        value={formData.noOfTowers}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623]"
                      />
                    </div>
                  </div>

                  {/* Balcony & Facing */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        How Many Balconies?
                      </label>
                      <select
                        name="balconyCount"
                        value={formData.balconyCount}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623] font-medium"
                      >
                        <option value="1">1 Balcony</option>
                        <option value="2">2 Balconies</option>
                        <option value="3">3 Balconies</option>
                        <option value="4+">4+ Balconies</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Balcony Size & Facing
                      </label>
                      <input
                        type="text"
                        name="balconyDetails"
                        placeholder="e.g. 10x4 ft East facing"
                        value={formData.balconyDetails}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Facing of the Flat
                      </label>
                      <select
                        name="flatFacing"
                        value={formData.flatFacing}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623] font-medium"
                      >
                        <option value="East">East</option>
                        <option value="North">North</option>
                        <option value="South">South</option>
                        <option value="West">West</option>
                        <option value="North-East">North-East</option>
                        <option value="South-East">South-East</option>
                        <option value="North-West">North-West</option>
                        <option value="South-West">South-West</option>
                      </select>
                    </div>
                  </div>

                  {/* Car Parking */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Car Parking Available?
                      </label>
                      <select
                        name="parkingAvailable"
                        value={formData.parkingAvailable}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623] font-medium"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Parking Type
                      </label>
                      <select
                        name="parkingType"
                        value={formData.parkingType}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623] font-medium"
                      >
                        <option value="Covered">Covered</option>
                        <option value="Open">Open</option>
                        <option value="Stilt">Stilt</option>
                        <option value="Basement">Basement</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Parking Slots
                      </label>
                      <select
                        name="parkingSlots"
                        value={formData.parkingSlots}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623] font-medium"
                      >
                        <option value="1">1 Car Slot</option>
                        <option value="2">2 Car Slots</option>
                        <option value="3+">3+ Car Slots</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Parking Area (sqft)
                      </label>
                      <input
                        type="text"
                        name="parkingArea"
                        placeholder="e.g. 135 sqft"
                        value={formData.parkingArea}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623]"
                      />
                    </div>
                  </div>

                  {/* Age / Handover Date */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Handover Date / Building Age
                      </label>
                      <input
                        type="text"
                        name="handoverDate"
                        placeholder="e.g. 2021 (3 years old)"
                        value={formData.handoverDate}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Bedrooms (BHK)
                      </label>
                      <select
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623] font-medium"
                      >
                        <option value="1 BHK">1 BHK</option>
                        <option value="2 BHK">2 BHK</option>
                        <option value="3 BHK">3 BHK</option>
                        <option value="4 BHK">4 BHK</option>
                        <option value="5+ BHK">5+ BHK</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Bathrooms
                      </label>
                      <select
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623] font-medium"
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4+">4+</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ── SECTION 2B: FOR INDIVIDUAL BUILDING / HOUSE / LAND ── */}
              {category === "house" && (
                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                    <Home className="w-4 h-4 text-[#5E6623]" />
                    2. Building & Land Specifications
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Land Area */}
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Land Area (Katha / Sq. Ft.) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="landArea"
                        required
                        placeholder="e.g. 3.5 Katha (2520 sqft)"
                        value={formData.landArea}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623]"
                      />
                    </div>

                    {/* House BUA */}
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Built-up Area (BUA in sqft) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="houseBua"
                        required
                        placeholder="e.g. 2800"
                        value={formData.houseBua}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623]"
                      />
                    </div>

                    {/* No of Floors */}
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Floor Configuration
                      </label>
                      <select
                        name="noOfFloors"
                        value={formData.noOfFloors}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623] font-medium"
                      >
                        <option value="Single Story (Ground)">Single Story (Ground)</option>
                        <option value="G+1">G+1 (2 Floors)</option>
                        <option value="G+2">G+2 (3 Floors)</option>
                        <option value="G+3">G+3 (4 Floors)</option>
                        <option value="G+4+">G+4 or higher</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Age of Building */}
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Age of Building (Years)
                      </label>
                      <input
                        type="text"
                        name="houseAge"
                        placeholder="e.g. 5 Years old"
                        value={formData.houseAge}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623]"
                      />
                    </div>

                    {/* House Parking */}
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Car Parking Space Details
                      </label>
                      <input
                        type="text"
                        name="houseParkingDetails"
                        placeholder="e.g. Covered Garage for 2 Cars"
                        value={formData.houseParkingDetails}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623]"
                      />
                    </div>

                    {/* Building Plan */}
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Building Sanctioned Plan Type
                      </label>
                      <select
                        name="buildingPlanType"
                        value={formData.buildingPlanType}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623] font-medium"
                      >
                        <option value="Blueprint Plan Available">Blueprint Plan Available</option>
                        <option value="Jumbo Plan Available">Jumbo Plan Available</option>
                        <option value="Under Process">Under Process</option>
                        <option value="Not Applicable">Not Applicable</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ── SECTION 3: LEGAL, TITLES & DOCUMENTATION ── */}
              <div className="space-y-4 pt-6 border-t border-gray-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#5E6623]" />
                  3. Legal, Registration & Liabilities Checklist
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  {/* Property Title Registered */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Property Title Registered?
                    </label>
                    <select
                      name="registrationStatus"
                      value={formData.registrationStatus}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623] font-medium"
                    >
                      <option value="Registered">Registered</option>
                      <option value="Not Registered / Pending">Not Registered / Pending</option>
                    </select>
                  </div>

                  {/* Lease or Freehold */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Leasehold / Freehold?
                    </label>
                    <select
                      name="ownershipType"
                      value={formData.ownershipType}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623] font-medium"
                    >
                      <option value="Freehold">Freehold Property</option>
                      <option value="Leasehold">Leasehold Property</option>
                    </select>
                  </div>

                  {/* Tax Update / Mutation */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Tax & Mutation Done?
                    </label>
                    <select
                      name="mutationStatus"
                      value={formData.mutationStatus}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623] font-medium"
                    >
                      <option value="Done & Up to Date">Done & Up to Date</option>
                      <option value="Pending / In Progress">Pending / In Progress</option>
                      <option value="Not Done">Not Done</option>
                    </select>
                  </div>

                  {/* Completion Certificate (CC) */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Completion / Handover Cert (CC)?
                    </label>
                    <select
                      name="completionCertificate"
                      value={formData.completionCertificate}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623] font-medium"
                    >
                      <option value="Yes - CC Available">Yes - CC Available</option>
                      <option value="No - CC Pending">No - CC Pending</option>
                      <option value="Occupancy Cert (OC) Only">Occupancy Cert (OC) Only</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Bank Loan Possible */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Bank Loan Possible?
                    </label>
                    <select
                      name="loanPossible"
                      value={formData.loanPossible}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623] font-medium"
                    >
                      <option value="Yes - Pre-Approved by Banks">Yes - Pre-Approved by Banks</option>
                      <option value="Yes - General Loan Eligible">Yes - General Loan Eligible</option>
                      <option value="No Loan">No Loan Possible</option>
                    </select>
                  </div>

                  {/* Liabilities */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Any Liabilities Against Property?
                    </label>
                    <select
                      name="liabilities"
                      value={formData.liabilities}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623] font-medium"
                    >
                      <option value="No Liabilities">No Liabilities (Clear Title)</option>
                      <option value="Existing Home Loan Mortgage">Existing Home Loan Mortgage</option>
                      <option value="Other Encumbrance">Other Encumbrance / Dispute</option>
                    </select>
                  </div>

                  {/* Liability Details */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Liability / Loan Details (If Any)
                    </label>
                    <input
                      type="text"
                      name="liabilitiesDetails"
                      placeholder="e.g. SBI Home loan outstanding ₹25L"
                      value={formData.liabilitiesDetails}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623]"
                    />
                  </div>
                </div>
              </div>

              {/* ── SECTION 4: SELLING PRICE & NEGOTIATION ── */}
              <div className="space-y-4 pt-6 border-t border-gray-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-[#5E6623]" />
                  4. Selling Price & Negotiation
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Selling Price */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Selling Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      required
                      placeholder="e.g. 12500000"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623] font-bold"
                    />
                  </div>

                  {/* Negotiable? */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Is Price Negotiable? <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="isNegotiable"
                      value={formData.isNegotiable}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623] font-medium"
                    >
                      <option value="Yes - Slightly Negotiable">Yes - Slightly Negotiable</option>
                      <option value="Yes - Negotiable">Yes - Negotiable</option>
                      <option value="No - Fixed Price">No - Fixed Price</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ── SECTION 5: OWNER / CONTACT DETAILS ── */}
              <div className="space-y-4 pt-6 border-t border-gray-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#5E6623]" />
                  5. Owner Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Name */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="ownerName"
                      required
                      placeholder="e.g. Vikramaditya Roy"
                      value={formData.ownerName}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623]"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 10);

                            setPhone(value);

                            if (value.length > 0 && value.length < 10) {
                              setPhoneError("Phone number must be exactly 10 digits");
                            } else {
                              setPhoneError("");
                            }
                          }}
                        className={`w-full bg-gray-50 px-3.5 py-2 rounded-lg text-xs focus:outline-none transition text-gray-800 font-semibold ${
                          phoneError
                            ? "border border-red-500 focus:ring-2 focus:ring-red-200"
                            : "border border-gray-200 focus:ring-2 focus:ring-[#5E6623] focus:border-[#5E6623]"
                        }`}
                    />
                    {phoneError && (
                        <p className="text-[10px] text-red-500 font-medium">
                          {phoneError}
                        </p>
                      )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => {
                        const value = e.target.value;
                        setEmail(value);

                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                        if (value && !emailRegex.test(value)) {
                          setEmailError("Please enter a valid email address");
                        } else {
                          setEmailError("");
                        }
                      }}
                      className={`w-full bg-gray-50 px-3.5 py-2 rounded-lg text-xs focus:outline-none transition text-gray-800 ${
                        emailError
                          ? "border border-red-500 focus:ring-2 focus:ring-red-200"
                          : "border border-gray-200 focus:ring-2 focus:ring-[#5E6623] focus:border-[#5E6623]"
                      }`}
                    />
                    {emailError && (
                        <p className="text-[10px] text-red-500 font-medium">
                          {emailError}
                        </p>
                      )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Additional Comments / Property Highlights
                  </label>
                  <textarea
                    name="additionalNotes"
                    rows={2}
                    placeholder="Mention any extra details (e.g. Marble flooring, swimming pool view, 24x7 security)..."
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623] resize-none"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#5E6623] text-[#FAF8F2] py-3.5 rounded-xl text-xs uppercase font-bold tracking-widest hover:bg-[#4E541E] transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <ShieldCheck className="w-4 h-4 text-[#FFC85C]" />
                  <span>{loading ? "Submitting Property..." : "Submit Property for Admin Approval"}</span>
                </button>
              </div>

            </form>
          )}

        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

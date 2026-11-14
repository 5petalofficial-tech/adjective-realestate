"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { apiRequest } from "@/utils/api";
import {
  Building2,
  MapPin,
  IndianRupee,
  User,
  Phone,
  Mail,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  FileCheck,
  Layers,
  CalendarDays,
  Home,
  Car,
  Trees,
  Landmark,
} from "lucide-react";

const labelClass =
  "block text-[11px] font-bold text-gray-700 uppercase tracking-[0.05em] mb-1.5";

const inputClass =
  "w-full box-border bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs text-gray-800 outline-none transition focus:border-[#5E6623] focus:ring-2 focus:ring-[#5E6623]/15";

const selectClass =
  "w-full box-border bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-xs font-medium text-gray-800 outline-none transition focus:border-[#5E6623] focus:ring-2 focus:ring-[#5E6623]/15";

const textareaClass =
  "w-full box-border bg-gray-50 border border-gray-200 px-3 py-3 rounded-xl text-xs text-gray-800 outline-none resize-none transition focus:border-[#5E6623] focus:ring-2 focus:ring-[#5E6623]/15";

export default function ListNewPropertyPage() {
  const [propertyType, setPropertyType] = useState("Apartment / Flat");

  const [formData, setFormData] = useState({
    // Basic
    projectName: "",
    developerName: "",
    propertyType: "Apartment / Flat",
    locality: "",
    fullAddress: "",
    city: "Kolkata",

    // Project Configuration
    projectStatus: "Under Construction",
    totalTowers: "",
    totalFloors: "",
    totalUnits: "",
    landArea: "",
    projectArea: "",
    configuration: "",
    unitSizes: "",

    // Unit Details
    bedrooms: "2 BHK",
    bathrooms: "2",
    carpetArea: "",
    builtUpArea: "",
    facing: "East",
    parkingAvailable: "Yes",
    parkingType: "Covered",
    parkingSlots: "1",

    // Location
    roadWidth: "",
    nearbyLandmark: "",
    metroDistance: "",
    airportDistance: "",
    schoolDistance: "",
    hospitalDistance: "",

    // Legal
    reraStatus: "Registered",
    reraNumber: "",
    approvalStatus: "All Approvals Available",
    possessionDate: "",

    // Pricing
    startingPrice: "",
    maximumPrice: "",
    priceUnit: "Lakh",
    paymentPlan: "Construction Linked",
    negotiable: "No",

    // Amenities
    amenities: "",
    specialFeatures: "",

    // Contact
    contactName: "",
    phone: "",
    email: "",
    additionalNotes: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePhone = (value) => {
    return /^[6-9]\d{9}$/.test(value);
  };

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);

    setPhone(value);

    if (value.length > 0 && value.length < 10) {
      setPhoneError("Phone number must be exactly 10 digits");
    } else if (value.length === 10 && !validatePhone(value)) {
      setPhoneError("Please enter a valid Indian mobile number");
    } else {
      setPhoneError("");
    }

    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;

    setEmail(value);

    if (value && !validateEmail(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }

    setFormData((prev) => ({
      ...prev,
      email: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      const projectOverview = `
=== NEW PROPERTY / PROJECT DETAILS ===

Project Name: ${formData.projectName}
Developer / Builder: ${formData.developerName}
Property Type: ${formData.propertyType}
Location: ${formData.locality}, ${formData.city}
Full Address: ${formData.fullAddress}

=== PROJECT CONFIGURATION ===

Project Status: ${formData.projectStatus}
Land Area: ${formData.landArea}
Project Area: ${formData.projectArea}
Total Towers: ${formData.totalTowers}
Total Floors: ${formData.totalFloors}
Total Units: ${formData.totalUnits}
Configuration: ${formData.configuration}
Unit Sizes: ${formData.unitSizes}

=== UNIT DETAILS ===

Bedrooms: ${formData.bedrooms}
Bathrooms: ${formData.bathrooms}
Carpet Area: ${formData.carpetArea} sqft
Built-up Area: ${formData.builtUpArea} sqft
Facing: ${formData.facing}
Parking: ${formData.parkingAvailable}
Parking Type: ${formData.parkingType}
Parking Slots: ${formData.parkingSlots}

=== LOCATION & CONNECTIVITY ===

Front Road Width: ${formData.roadWidth}
Nearby Landmark: ${formData.nearbyLandmark}
Metro Distance: ${formData.metroDistance}
Airport Distance: ${formData.airportDistance}
School Distance: ${formData.schoolDistance}
Hospital Distance: ${formData.hospitalDistance}

=== LEGAL & RERA ===

RERA Status: ${formData.reraStatus}
RERA Number: ${formData.reraNumber}
Approval Status: ${formData.approvalStatus}

=== PRICING & POSSESSION ===

Starting Price: ₹${formData.startingPrice} ${formData.priceUnit}
Maximum Price: ₹${formData.maximumPrice} ${formData.priceUnit}
Payment Plan: ${formData.paymentPlan}
Negotiable: ${formData.negotiable}
Possession Date: ${formData.possessionDate}

=== AMENITIES ===

${formData.amenities}

=== SPECIAL FEATURES ===

${formData.specialFeatures}

=== CONTACT DETAILS ===

Name: ${formData.contactName}
Phone: ${phone}
Email: ${email}

Additional Notes:
${formData.additionalNotes}
`;

      await apiRequest("/solo/add", {
        method: "POST",
        body: JSON.stringify({
          ...formData,

          category: "new-property",

          name:
            formData.projectName ||
            `${formData.bedrooms} Project in ${formData.locality}`,

          address:
            formData.fullAddress ||
            `${formData.locality}, ${formData.city}`,

          area: formData.locality,

          price: Number(formData.startingPrice) || 0,

          noOfBedrooms: parseInt(formData.bedrooms) || 2,

          noOfToilets: parseInt(formData.bathrooms) || 2,

          superBuiltUpAreaSize:
            Number(formData.builtUpArea) || 0,

          builtUpAreaSize:
            Number(formData.builtUpArea) || 0,

          carpetAreaSize:
            Number(formData.carpetArea) || 0,

          overview: projectOverview,

          facing: formData.facing,

          contactName: formData.contactName,

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
      console.error(
        "New property submission error:",
        err
      );

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

      {/* Header spacing */}
      <div className="h-24"></div>

      {/* HERO */}
      <section className="relative bg-[#5E6623] text-white py-8 md:py-10 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto relative z-10">
          <div className="max-w-2xl">
            <span className="text-[11px] font-label-sm-uppercase uppercase tracking-widest text-[#FFC85C] px-3 py-1 rounded-full border border-[#FFC85C]/30 bg-white/5 inline-flex items-center gap-1.5 mb-3">
              <Sparkles className="w-3 h-3" />
              New Property Listing
            </span>

            <h1 className="font-display-lg text-2xl md:text-4xl text-white leading-tight">
              List Your New Property with Adjective.
            </h1>

            <p className="mt-2 text-xs md:text-sm text-white/80 font-body-md leading-relaxed">
              Share your project, developer, pricing, RERA and property
              details. Our Admin team will verify the information before
              publishing your listing.
            </p>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="py-stack-lg px-margin-mobile md:px-margin-desktop max-w-[1100px] mx-auto w-full -mt-6 relative z-20">
        <div className="bg-white rounded-2xl border border-outline-variant/15 shadow-2xl p-6 md:p-10">

          {submitted ? (
            <div className="py-12 text-center space-y-6 max-w-lg mx-auto">

              <div className="w-16 h-16 rounded-full bg-[#EFF3EB] text-[#5E6623] mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h2 className="font-headline-md text-2xl md:text-3xl text-gray-900 font-bold">
                New Property Submitted for Approval!
              </h2>

              <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-body-md">
                Thank you,{" "}
                <span className="font-semibold text-gray-900">
                  {formData.contactName}
                </span>
                . Your project{" "}
                <span className="font-semibold text-[#5E6623]">
                  {formData.projectName || formData.locality}
                </span>{" "}
                has been submitted successfully.
              </p>

              <div className="bg-[#FAF8F2] p-4 rounded-xl border border-black/5 text-xs text-gray-700 text-left space-y-2">

                <p className="font-bold text-[#5E6623] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Next Steps:
                </p>

                <p>
                  1. Our admin team will verify the project and legal details.
                </p>

                <p>
                  2. Once verified, admin will approve and publish the listing.
                </p>

                <p>
                  3. A relationship manager will contact you at{" "}
                  <span className="font-semibold">
                    {formData.phone}
                  </span>
                  .
                </p>

              </div>

              <button
                onClick={() => setSubmitted(false)}
                className="bg-[#5E6623] text-white px-6 py-2.5 rounded-xl text-xs uppercase font-bold tracking-wider hover:bg-[#4E541E] transition shadow-md cursor-pointer mt-4"
              >
                Submit Another Property
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-8"
            >

              {/* FORM HEADER */}
              <div className="border-b border-gray-100 pb-6">

                <span className="text-xs font-bold uppercase tracking-widest text-[#5E6623]">
                  New Property Checklist
                </span>

                <h2 className="font-headline-md text-2xl md:text-3xl text-gray-900 mt-1">
                  New Property Listing Form
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Provide complete project, developer, legal, pricing and
                  contact information for verification.
                </p>

                {/* PROPERTY TYPE */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">

                  {[
                    "Apartment / Flat",
                    "Villa",
                    "Plot / Land",
                    "Commercial",
                  ].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setPropertyType(type);
                        setFormData((prev) => ({
                          ...prev,
                          propertyType: type,
                        }));
                      }}
                      className={`py-3 px-3 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                        propertyType === type
                          ? "bg-[#5E6623] text-white border-[#5E6623] shadow-md"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {type === "Apartment / Flat" ? (
                        <Building2 className="w-4 h-4" />
                      ) : type === "Villa" ? (
                        <Home className="w-4 h-4" />
                      ) : type === "Plot / Land" ? (
                        <Landmark className="w-4 h-4" />
                      ) : (
                        <Building2 className="w-4 h-4" />
                      )}

                      {type}
                    </button>
                  ))}

                </div>
              </div>

              {/* SECTION 1 */}
              <div className="space-y-4">

                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#5E6623]" />
                  1. Basic & Location Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div>
                    <label className={labelClass}>
                      Project / Property Name{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="projectName"
                      required
                      placeholder="e.g. Adjective Green Heights"
                      value={formData.projectName}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Developer / Builder Name{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="developerName"
                      required
                      placeholder="e.g. ABC Developers Pvt. Ltd."
                      value={formData.developerName}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                  <div className="md:col-span-2">
                    <label className={labelClass}>
                      Full Project Address{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="fullAddress"
                      required
                      placeholder="Project address, street, landmark..."
                      value={formData.fullAddress}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Locality / Area{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="locality"
                      required
                      placeholder="e.g. New Town"
                      value={formData.locality}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div>
                    <label className={labelClass}>
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Front Road Width
                    </label>

                    <input
                      type="text"
                      name="roadWidth"
                      placeholder="e.g. 40 ft"
                      value={formData.roadWidth}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                </div>

              </div>

              {/* SECTION 2 */}
              <div className="space-y-4 pt-6 border-t border-gray-100">

                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#5E6623]" />
                  2. Project Configuration
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

                  <div>
                    <label className={labelClass}>
                      Project Status
                    </label>

                    <select
                      name="projectStatus"
                      value={formData.projectStatus}
                      onChange={handleChange}
                      className={selectClass}
                    >
                      <option>Under Construction</option>
                      <option>Ready to Move</option>
                      <option>Upcoming</option>
                      <option>New Launch</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Total Towers
                    </label>

                    <input
                      type="number"
                      name="totalTowers"
                      placeholder="e.g. 4"
                      value={formData.totalTowers}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Total Floors
                    </label>

                    <input
                      type="text"
                      name="totalFloors"
                      placeholder="e.g. G+20"
                      value={formData.totalFloors}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Total Units
                    </label>

                    <input
                      type="number"
                      name="totalUnits"
                      placeholder="e.g. 450"
                      value={formData.totalUnits}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                  <div>
                    <label className={labelClass}>
                      Land Area
                    </label>

                    <input
                      type="text"
                      name="landArea"
                      placeholder="e.g. 8 Acres"
                      value={formData.landArea}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Total Project Area
                    </label>

                    <input
                      type="text"
                      name="projectArea"
                      placeholder="e.g. 6,50,000 sqft"
                      value={formData.projectArea}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Available Configurations
                    </label>

                    <input
                      type="text"
                      name="configuration"
                      placeholder="e.g. 2, 3 & 4 BHK"
                      value={formData.configuration}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                </div>

                <div>
                  <label className={labelClass}>
                    Available Unit Sizes
                  </label>

                  <input
                    type="text"
                    name="unitSizes"
                    placeholder="e.g. 950 - 2200 sqft"
                    value={formData.unitSizes}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

              </div>

              {/* SECTION 3 */}
              <div className="space-y-4 pt-6 border-t border-gray-100">

                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#5E6623]" />
                  3. Unit / Property Specifications
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

                  <div>
                    <label className={labelClass}>
                      Bedrooms
                    </label>

                    <select
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      className={selectClass}
                    >
                      <option>1 BHK</option>
                      <option>2 BHK</option>
                      <option>3 BHK</option>
                      <option>4 BHK</option>
                      <option>5+ BHK</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Bathrooms
                    </label>

                    <select
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      className={selectClass}
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4+</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Carpet Area (sqft)
                    </label>

                    <input
                      type="number"
                      name="carpetArea"
                      placeholder="e.g. 1100"
                      value={formData.carpetArea}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Built-up Area (sqft)
                    </label>

                    <input
                      type="number"
                      name="builtUpArea"
                      placeholder="e.g. 1450"
                      value={formData.builtUpArea}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

                  <div>
                    <label className={labelClass}>
                      Facing
                    </label>

                    <select
                      name="facing"
                      value={formData.facing}
                      onChange={handleChange}
                      className={selectClass}
                    >
                      <option>East</option>
                      <option>North</option>
                      <option>South</option>
                      <option>West</option>
                      <option>North-East</option>
                      <option>North-West</option>
                      <option>South-East</option>
                      <option>South-West</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Parking Available?
                    </label>

                    <select
                      name="parkingAvailable"
                      value={formData.parkingAvailable}
                      onChange={handleChange}
                      className={selectClass}
                    >
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Parking Type
                    </label>

                    <select
                      name="parkingType"
                      value={formData.parkingType}
                      onChange={handleChange}
                      className={selectClass}
                    >
                      <option>Covered</option>
                      <option>Open</option>
                      <option>Basement</option>
                      <option>Stilt</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Parking Slots
                    </label>

                    <select
                      name="parkingSlots"
                      value={formData.parkingSlots}
                      onChange={handleChange}
                      className={selectClass}
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3+</option>
                    </select>
                  </div>

                </div>

              </div>

              {/* SECTION 4 */}
              <div className="space-y-4 pt-6 border-t border-gray-100">

                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#5E6623]" />
                  4. Location & Connectivity
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div>
                    <label className={labelClass}>
                      Nearby Landmark
                    </label>

                    <input
                      type="text"
                      name="nearbyLandmark"
                      placeholder="e.g. City Centre 2"
                      value={formData.nearbyLandmark}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Metro / Transport Distance
                    </label>

                    <input
                      type="text"
                      name="metroDistance"
                      placeholder="e.g. 1.5 km from Metro"
                      value={formData.metroDistance}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Airport Distance
                    </label>

                    <input
                      type="text"
                      name="airportDistance"
                      placeholder="e.g. 12 km"
                      value={formData.airportDistance}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      School / College Distance
                    </label>

                    <input
                      type="text"
                      name="schoolDistance"
                      placeholder="e.g. 2 km"
                      value={formData.schoolDistance}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Hospital Distance
                    </label>

                    <input
                      type="text"
                      name="hospitalDistance"
                      placeholder="e.g. 1 km"
                      value={formData.hospitalDistance}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                </div>

              </div>

              {/* SECTION 5 */}
              <div className="space-y-4 pt-6 border-t border-gray-100">

                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#5E6623]" />
                  5. RERA, Legal & Approval Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

                  <div>
                    <label className={labelClass}>
                      RERA Status
                    </label>

                    <select
                      name="reraStatus"
                      value={formData.reraStatus}
                      onChange={handleChange}
                      className={selectClass}
                    >
                      <option>Registered</option>
                      <option>Applied</option>
                      <option>Not Applicable</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClass}>
                      RERA Registration Number
                    </label>

                    <input
                      type="text"
                      name="reraNumber"
                      placeholder="e.g. WBRERA/P/KOL/..."
                      value={formData.reraNumber}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Approval Status
                    </label>

                    <select
                      name="approvalStatus"
                      value={formData.approvalStatus}
                      onChange={handleChange}
                      className={selectClass}
                    >
                      <option>All Approvals Available</option>
                      <option>Some Approvals Pending</option>
                      <option>Under Process</option>
                    </select>
                  </div>

                </div>

              </div>

              {/* SECTION 6 */}
              <div className="space-y-4 pt-6 border-t border-gray-100">

                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-[#5E6623]" />
                  6. Pricing & Possession
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

                  <div>
                    <label className={labelClass}>
                      Starting Price (₹)
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="number"
                      name="startingPrice"
                      required
                      placeholder="e.g. 7500000"
                      value={formData.startingPrice}
                      onChange={handleChange}
                      className={`${inputClass} font-bold`}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Maximum Price (₹)
                    </label>

                    <input
                      type="number"
                      name="maximumPrice"
                      placeholder="e.g. 15000000"
                      value={formData.maximumPrice}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Price Unit
                    </label>

                    <select
                      name="priceUnit"
                      value={formData.priceUnit}
                      onChange={handleChange}
                      className={selectClass}
                    >
                      <option>Lakh</option>
                      <option>Crore</option>
                      <option>Actual Price</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Possession Date
                    </label>

                    <input
                      type="text"
                      name="possessionDate"
                      placeholder="e.g. December 2028"
                      value={formData.possessionDate}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div>
                    <label className={labelClass}>
                      Payment Plan
                    </label>

                    <select
                      name="paymentPlan"
                      value={formData.paymentPlan}
                      onChange={handleChange}
                      className={selectClass}
                    >
                      <option>Construction Linked</option>
                      <option>Down Payment Plan</option>
                      <option>Flexible Payment Plan</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Price Negotiable?
                    </label>

                    <select
                      name="negotiable"
                      value={formData.negotiable}
                      onChange={handleChange}
                      className={selectClass}
                    >
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>

                </div>

              </div>

              {/* SECTION 7 */}
              <div className="space-y-4 pt-6 border-t border-gray-100">

                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                  <Trees className="w-4 h-4 text-[#5E6623]" />
                  7. Amenities & Special Features
                </h3>

                <div>
                  <label className={labelClass}>
                    Available Amenities
                  </label>

                  <textarea
                    name="amenities"
                    rows={3}
                    placeholder="e.g. Swimming Pool, Gym, Club House, Children's Play Area, Security, Garden..."
                    value={formData.amenities}
                    onChange={handleChange}
                    className={textareaClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Special Features / Highlights
                  </label>

                  <textarea
                    name="specialFeatures"
                    rows={3}
                    placeholder="e.g. Lake View, Vastu Compliant, Smart Home, Rooftop Garden..."
                    value={formData.specialFeatures}
                    onChange={handleChange}
                    className={textareaClass}
                  />
                </div>

              </div>

              {/* SECTION 8 */}
              <div className="space-y-4 pt-6 border-t border-gray-100">

                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#5E6623]" />
                  8. Developer / Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                  <div>
                    <label className={labelClass}>
                      Contact Person Name{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="contactName"
                      required
                      placeholder="e.g. Amit Sharma"
                      value={formData.contactName}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Phone Number{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={phone}
                      onChange={handlePhoneChange}
                      className={`w-full bg-gray-50 px-3.5 py-2 rounded-lg text-xs focus:outline-none transition text-gray-800 font-semibold ${
                        phoneError
                          ? "border border-red-500 focus:ring-2 focus:ring-red-200"
                          : "border border-gray-200 focus:ring-2 focus:ring-[#5E6623] focus:border-[#5E6623]"
                      }`}
                    />

                    {phoneError && (
                      <p className="text-[10px] text-red-500 font-medium mt-1">
                        {phoneError}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>
                      Email Address{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={handleEmailChange}
                      className={`w-full bg-gray-50 px-3.5 py-2 rounded-lg text-xs focus:outline-none transition text-gray-800 ${
                        emailError
                          ? "border border-red-500 focus:ring-2 focus:ring-red-200"
                          : "border border-gray-200 focus:ring-2 focus:ring-[#5E6623] focus:border-[#5E6623]"
                      }`}
                    />

                    {emailError && (
                      <p className="text-[10px] text-red-500 font-medium mt-1">
                        {emailError}
                      </p>
                    )}
                  </div>

                </div>

                <div>
                  <label className={labelClass}>
                    Additional Comments / Project Highlights
                  </label>

                  <textarea
                    name="additionalNotes"
                    rows={3}
                    placeholder="Mention any additional information about the project..."
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    className={textareaClass}
                  />
                </div>

              </div>

              {/* SUBMIT */}
              <div className="pt-4">

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#5E6623] text-[#FAF8F2] py-3.5 rounded-xl text-xs uppercase font-bold tracking-widest hover:bg-[#4E541E] transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <ShieldCheck className="w-4 h-4 text-[#FFC85C]" />

                  <span>
                    {loading
                      ? "Submitting Property..."
                      : "Submit Property for Admin Approval"}
                  </span>
                </button>

              </div>

            </form>
          )}

        </div>
      </section>

      <Footer />


    </div>
  );
}
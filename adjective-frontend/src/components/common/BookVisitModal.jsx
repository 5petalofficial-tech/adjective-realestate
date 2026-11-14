"use client";
import React, { useState } from "react";
import { apiRequest } from "@/utils/api";

export default function BookVisitModal({ propertyName, isOpen, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});



  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    // Name validation 
    if (!name.trim()) { 
      newErrors.name = "Please enter your full name."; } 
      else if (name.trim().length < 2) { 
        newErrors.name = "Name must be at least 2 characters."; 
      } 
      // Email validation 
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; 
      if (!email.trim()) { newErrors.email = "Please enter your email address."; 
      } else if (!emailRegex.test(email.trim())) {
         newErrors.email = "Please enter a valid email address."; }
         // Phone validation 
      const cleanPhone = phone.replace(/\D/g, ""); 
       if (!phone.trim()) { 
        newErrors.phone = "Please enter your phone number."; 
      } else if (cleanPhone.length !== 10) {
         newErrors.phone = "Phone number must be exactly 10 digits."; 
        } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) { 
          newErrors.phone = "Please enter a valid Indian mobile number."; }
         // Show errors 
        setErrors(newErrors); 
        // Stop API call if validation fails 
        if (Object.keys(newErrors).length > 0) { 
          return; }

    setLoading(true);
    try {
      await apiRequest("/enquiry", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          phone,
          propertyName,
          enquiryType: "Book Visit",
          message
        })
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
        onClose();
      }, 2500);
    } catch (err) {
      alert("Failed to book visit: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in font-sans">
      <div className="bg-white w-full max-w-md rounded-2xl border border-gray-100 shadow-2xl p-8 relative overflow-hidden transition-all transform scale-100 duration-300">
        
        {/* Header Close button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        {success ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-[#EFF3EB] text-[#5E6623] flex items-center justify-center animate-bounce">
              <span className="material-symbols-outlined text-4xl font-bold">check</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Visit Scheduled!</h3>
              <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">
                Thank you, {name}. Our sales advisory team will contact you shortly to confirm details.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#5E6623]">Schedule Booking</span>
              <h3 className="text-lg font-bold text-gray-950 leading-tight">Request Site Visiting</h3>
              {propertyName && (
                <p className="text-xs text-gray-500 font-semibold mt-1">
                  Property: <span className="text-gray-800 font-bold">{propertyName}</span>
                </p>
              )}
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider">Your Full Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623] focus:border-[#5E6623] transition text-gray-800"
                />
                {errors.name && ( 
                  <p className="text-[11px] text-red-500 font-medium mt-1"> 
                    {errors.name}
                  </p> 
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider">Email Address <span className="text-red-500">*</span></label>
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

              {/* Phone */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider">Phone Number <span className="text-red-500">*</span></label>
                <input
  type="tel"
  required
  maxLength={10}
  placeholder="9876543210"
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

              {/* Preferred Date/Comments */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider">Preferred Date / Comments (Optional)</label>
                <textarea 
                  placeholder="e.g. I would like to visit this Saturday around 11:00 AM."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623] focus:border-[#5E6623] transition text-gray-800 h-20 resize-none"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#5E6623] text-white py-3 rounded-lg font-bold hover:bg-[#4E541E] transition shadow-md flex items-center justify-center space-x-2 text-xs cursor-pointer disabled:opacity-60"
            >
              <span>{loading ? "Scheduling..." : "Confirm Book Site Visit"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

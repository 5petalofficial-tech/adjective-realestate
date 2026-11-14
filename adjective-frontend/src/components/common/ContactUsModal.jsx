"use client";

import React, { useState } from "react";
import { X, Mail, Phone, MapPin, Send, CheckCircle2, Building2 } from "lucide-react";
import { apiRequest } from "@/utils/api";

export default function ContactUsModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [subject, setSubject] = useState("General Inquiry");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest("/enquiry", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          phone,
          enquiryType: subject || "Contact Us Inquiry",
          propertyName: "Contact Us Form",
          message,
        }),
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setName("");
        setEmail("");
        setPhone("");
        setSubject("General Inquiry");
        setMessage("");
        onClose();
      }, 2500);
    } catch (err) {
      alert("Failed to submit contact request: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 backdrop-blur-md p-4 animate-fadeIn font-sans">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-outline-variant/20 shadow-2xl overflow-hidden relative transition-all transform scale-100 duration-300 my-auto max-h-[90vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Contact Modal"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 text-gray-600 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Brand & Quick Contact Banner */}
        <div className="bg-[#5E6623] text-white p-6 md:p-8 md:w-5/12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <span className="text-[10px] font-label-sm-uppercase uppercase tracking-widest text-[#FFC85C] px-2.5 py-1 rounded-full bg-white/10 inline-flex items-center gap-1 mb-4">
              <Building2 className="w-3 h-3" />
              Adjective Advisory
            </span>
            <h3 className="font-display text-2xl md:text-3xl text-white font-bold leading-tight">
              Get in Touch
            </h3>
            <p className="text-xs text-white/80 mt-2 font-body-md leading-relaxed">
              Have questions about buying, selling, or investing in luxury real estate? Our specialists are here to assist.
            </p>
          </div>

          <div className="space-y-4 my-6 text-xs">
            <div className="flex items-start gap-3 text-white/90">
              <Phone className="w-4 h-4 text-[#FFC85C] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Call Us</p>
                <p className="text-white/80">+91 62943 74584</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-white/90">
              <Mail className="w-4 h-4 text-[#FFC85C] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Email Us</p>
                <p className="text-white/80">contact@adjective.in</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-white/90">
              <MapPin className="w-4 h-4 text-[#FFC85C] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Head Office</p>
                <p className="text-white/80">133, Subhas Sarani Road, Kolkata 51, West Bengal</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/15">
            <p className="text-[10px] text-white/60">Mon - Sun: 9:30 AM - 9:00 PM IST</p>
          </div>
        </div>

        {/* Right Side: Form / Success State */}
        <div className="p-6 md:p-8 md:w-7/12 flex-1 overflow-y-auto bg-white">
          {success ? (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#EFF3EB] text-[#5E6623] flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">Message Sent!</h4>
                <p className="text-xs text-gray-500 mt-2 max-w-xs leading-relaxed">
                  Thank you, <span className="font-semibold text-gray-800">{name}</span>. Our relationship manager will connect with you shortly.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#5E6623]">Send a Message</span>
                <h4 className="text-lg font-bold text-gray-900 leading-tight">We&apos;d love to hear from you</h4>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623] focus:border-[#5E6623] transition text-gray-800"
                />
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider">
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

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
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
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                  Inquiry Purpose
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623] focus:border-[#5E6623] transition text-gray-800 font-medium"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Buy Property Advisory">Buy Property Advisory</option>
                  <option value="Sell Property Listing">Sell Property Listing</option>
                  <option value="Partnership & Advisory">Partnership & Advisory</option>
                </select>
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="How can we help you regarding your property goals?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-gray-50 border border-[#5E6623] p-3 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#5E6623] focus:border-[#5E6623] transition text-gray-800 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#5E6623] text-white py-2.5 rounded-lg text-xs font-bold hover:bg-[#4E541E] transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? "Sending Message..." : "Send Message"}</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

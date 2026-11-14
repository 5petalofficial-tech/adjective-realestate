"use client";

import React from "react";

export default function NotificationModal({
  isOpen,
  onClose,
  type = "success",
  title,
  message,
}) {
  if (!isOpen) return null;

  const isSuccess = type === "success";
  const isError = type === "error";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in font-sans">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 text-center relative overflow-hidden">
        
        {/* Top Decorative Color Accent Line */}
        <div 
          className={`absolute top-0 left-0 right-0 h-1.5 ${
            isSuccess ? "bg-[#5E6623]" : isError ? "bg-red-600" : "bg-blue-600"
          }`} 
        />

        {/* Icon Circle */}
        <div className="flex justify-center mb-4 pt-2">
          <div 
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-inner ${
              isSuccess 
                ? "bg-[#5E6623]/10 text-[#5E6623] border-2 border-[#5E6623]/20" 
                : isError 
                ? "bg-red-50 text-red-600 border-2 border-red-200" 
                : "bg-blue-50 text-blue-600 border-2 border-blue-200"
            }`}
          >
            <span className="material-symbols-outlined text-3xl font-bold">
              {isSuccess ? "check_circle" : isError ? "error" : "info"}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mb-2">
          {title || (isSuccess ? "Success!" : isError ? "Error Encountered" : "Notice")}
        </h3>

        {/* Message */}
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
          {message}
        </p>

        {/* Action Button */}
        <button
          onClick={onClose}
          className={`w-full py-3 rounded-xl text-xs uppercase font-bold tracking-wider text-white shadow-md hover:shadow-lg transition-all cursor-pointer ${
            isSuccess
              ? "bg-[#5E6623] hover:bg-[#4A521A]"
              : isError
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSuccess ? "Continue" : "OK"}
        </button>

      </div>
    </div>
  );
}

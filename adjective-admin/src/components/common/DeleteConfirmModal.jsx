"use client";

import React from "react";

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title = "Confirm Delete", message = "Are you sure you want to delete this item?" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in font-sans">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-100">
        <div className="flex items-center space-x-3 text-red-600 mb-4">
          <span className="material-symbols-outlined text-2xl">warning</span>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition cursor-pointer shadow-sm"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}

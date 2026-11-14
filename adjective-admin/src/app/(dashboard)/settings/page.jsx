"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/utils/api";

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch user details to prefill email via the /user/me endpoint
    apiRequest("/user/me")
      .then(res => {
        const user = res?.data?.user || res?.user;
        if (user?.email) {
          setEmail(user.email);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load user info", err);
        setLoading(false);
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    router.push("/login");
  };

  const handleScrollTo = (id) => (e) => {
    e.preventDefault();
    router.push(`/#${id}`);
  };

  const handleUnderDev = (e) => {
    e.preventDefault();
    alert("This section is currently under development.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await apiRequest("/user/admin/settings", {
        method: "PUT",
        body: {
          email,
          ...(password && { password })
        }
      });
      alert("Admin settings updated successfully! Please log in again with your new credentials.");
      handleLogout();
    } catch (err) {
      alert("Failed to update settings: " + err.message);
    }
  };

  return (
    <>
        {/* Content Body */}
        <div className="p-8 max-w-2xl w-full mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-950 font-sans tracking-tight">System Settings</h1>
            <p className="text-xs text-gray-500 font-medium mt-1">Configure credentials for administrative portal access.</p>
          </div>

          {loading ? (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-200/80 shadow-sm font-semibold text-gray-500">
              Loading settings parameters...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-xl border border-gray-200 shadow-sm space-y-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Admin User ID / Email</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-gray-50/30 border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] transition text-gray-800 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">New Password (Leave blank to keep current)</label>
                <input 
                  type="password" 
                  value={password}
                  placeholder="••••••••"
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-gray-50/30 border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] transition text-gray-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  placeholder="••••••••"
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-50/30 border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] transition text-gray-800"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#5E6623] text-white py-3 rounded-lg font-bold hover:bg-[#4E541E] transition shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">save</span>
                <span>Save Admin Configuration</span>
              </button>
            </form>
          )}
        </div>
    </>
  );
}

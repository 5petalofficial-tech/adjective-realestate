"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/utils/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await apiRequest("/auth/admin-login", {
        method: "POST",
        body: { email, password },
      });

      // ApiResponse shape: { success, statusCode, data: { user, accessToken }, message }
      const { accessToken, user } = res.data;

      // Store token and user details
      localStorage.setItem("token", accessToken);
      localStorage.setItem("userType", user.role);

      // Redirect to home dashboard
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-[url('/login-bg.png')] bg-cover bg-center bg-no-repeat px-4 py-8 font-sans animate-fade-in">
      {/* Spacer to push card to center vertically */}
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col items-center">
          {/* Logo Brand Header */}
          <div className="mb-6 flex justify-center">
            <img 
              src="/Adjective/Logo.png" 
              alt="Adjective Real Estate Logo" 
              className="h-16 object-contain"
            />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#5E6623]">Portal Login</h2>
            <p className="text-sm text-gray-400 mt-1 font-medium">Admin Panel for Adjective Real Estate</p>
          </div>

          {error && (
            <div className="w-full bg-red-50 text-red-500 text-xs p-3 rounded-xl mb-6 text-center border border-red-200 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="w-full space-y-5">
            {/* Email Address */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-3 text-gray-400 text-lg">mail</span>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                  placeholder="admin@adjective.com"
                  className="w-full bg-gray-50/50 border border-gray-200/80 pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] focus:border-[#5E6623] transition text-gray-800" 
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-3 text-gray-400 text-lg">lock</span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  placeholder="••••••••••••"
                  className="w-full bg-gray-50/50 border border-gray-200/80 pl-11 pr-11 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] focus:border-[#5E6623] transition text-gray-800" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-gray-400 hover:text-gray-600 focus:outline-none select-none"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs font-medium">
              <label className="flex items-center space-x-2 text-gray-600 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded text-[#5E6623] focus:ring-[#5E6623] w-4 h-4 border-gray-300" 
                />
                <span>Remember me</span>
              </label>
              <button 
                type="button" 
                onClick={() => alert("Please contact the system administrator to reset your password.")}
                className="text-[#5E6623] hover:underline focus:outline-none"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <button 
              type="submit" 
              className="w-full bg-[#5E6623] text-white py-3.5 rounded-xl font-bold hover:bg-[#4E541E] transition mt-2 shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">lock</span>
              <span>Sign In</span>
            </button>
          </form>

          {/* Separator OR */}
          <div className="w-full flex items-center justify-center my-6">
            <div className="flex-1 h-[1px] bg-gray-100"></div>
            <span className="text-[10px] font-bold text-gray-400 px-3 tracking-wider">OR</span>
            <div className="flex-1 h-[1px] bg-gray-100"></div>
          </div>

          {/* Secure access label */}
          <div className="flex items-center space-x-1.5 text-xs text-[#5E6623] font-bold">
            <span className="material-symbols-outlined text-base">shield</span>
            <span>Secure admin access</span>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <footer className="text-[10px] text-gray-400/80 font-medium tracking-wide">
        © 2026 Adjective Real Estate. All rights reserved.
      </footer>
    </div>
  );
}

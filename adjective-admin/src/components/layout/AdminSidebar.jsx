"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    router.push("/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/", icon: "dashboard" },
    { label: "Blogs", href: "/blogs", icon: "newspaper" },
    { label: "Resale Properties", href: "/add-solo", icon: "sell" },
    { label: "Builder Projects", href: "/add-project", icon: "corporate_fare" },
    { label: "Customers", href: "/customers", icon: "group" },
    { label: "Enquiries", href: "/enquiries", icon: "chat_bubble" },
    { label: "Feedback", href: "/feedback", icon: "rate_review" },
    { label: "Settings", href: "/settings", icon: "settings" },
  ];

  return (
    <aside className="w-64 bg-[#2D3319] text-[#A2AB8F] flex flex-col justify-between shrink-0 h-full">
      <div>
        {/* Logo Brand Header */}
        <div className="p-5 flex items-center justify-center border-b border-[#3D4523]/50">
          <img 
            src="/Adjective/Logo.png" 
            alt="Adjective Real Estate Logo" 
            className="h-20 object-contain brightness-0 invert" 
          />
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition duration-150 ${
                  isActive
                    ? "text-white bg-[#454D26]"
                    : "text-[#A2AB8F] hover:bg-[#3D4523] hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Bottom Tab */}
      <div className="p-4 border-t border-[#3D4523]/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-[#A2AB8F] hover:bg-red-900/20 hover:text-red-400 transition duration-150 cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
}

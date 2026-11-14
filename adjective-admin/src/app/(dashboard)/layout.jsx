"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="h-screen w-screen flex bg-[#FAF9F5] font-sans items-center justify-center text-sm font-semibold text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-[#FAF9F5] font-sans overflow-hidden animate-fade-in">
      {/* ── SIDEBAR ────────────────────────────────────────────── */}
      <AdminSidebar />

      {/* ── MAIN CONTENT ───────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

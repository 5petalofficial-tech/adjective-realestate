"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/utils/api";
export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    
    async function fetchCustomers() {
      try {
        const response = await apiRequest("/user");
        const rawUsers = response?.data?.users || response?.users || (Array.isArray(response) ? response : []);
        // Filter out admin users using backend role contract
        const filtered = rawUsers.filter(u => u?.role !== "admin" && u?.type !== "admin");
        setCustomers(filtered);
      } catch (err) {
        console.error("Failed to fetch customers", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
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

  const getCustomerName = (c) =>
    c.fullName || `${c.First_name || ""} ${c.Last_name || ""}`.trim() || "Customer";

  const filteredCustomers = customers.filter(c => {
    const name = getCustomerName(c).toLowerCase();
    const email = (c.email || "").toLowerCase();
    const phone = (c.phone || "").toLowerCase();
    const userRole = (c.role || c.type || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return name.includes(query) || email.includes(query) || phone.includes(query) || userRole.includes(query);
  });

  return (
    <>
        {/* Content Body */}
        <div className="p-8 max-w-7xl w-full mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-950 font-sans tracking-tight">Registered Customers</h1>
              <p className="text-xs text-gray-500 font-medium mt-1">Manage and view the users registered on the Adjective real estate platform.</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-200/80 shadow-sm font-semibold text-gray-500">
              Loading customer registry...
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-255 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                      <th className="py-4 px-6">Customer Name</th>
                      <th className="py-4 px-6">Email Address</th>
                      <th className="py-4 px-6">Phone Number</th>
                      <th className="py-4 px-6">Registry Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-gray-400 font-medium">
                          No registered customers found.
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((c, idx) => {
                        const name = getCustomerName(c);
                        const userRole = c.role || c.type || "user";
                        const typeLabel = userRole === "dealer" || userRole === "agent" ? "Dealer / Developer" 
                                        : userRole === "solo" ? "Individual Seller" 
                                        : "Regular Buyer";
                        const badgeColor = userRole === "dealer" || userRole === "agent" ? "bg-[#FFF9E6] text-[#B28900]" 
                                         : userRole === "solo" ? "bg-[#EFF3EB] text-[#4E541E]" 
                                         : "bg-blue-50 text-blue-700";
                        return (
                          <tr key={c._id || `cust-${idx}`} className="hover:bg-gray-50/50 transition">
                            <td className="py-4 px-6 font-semibold text-gray-900">
                              {name}
                            </td>
                            <td className="py-4 px-6 font-mono text-xs">
                              <a href={`mailto:${c.email}`} className="text-[#5E6623] hover:underline">
                                {c.email}
                              </a>
                            </td>
                            <td className="py-4 px-6 font-semibold text-gray-600">
                              <a href={`tel:${c.phone}`} className="hover:underline">
                                {c.phone}
                              </a>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>
                                {typeLabel}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
    </>
  );
}

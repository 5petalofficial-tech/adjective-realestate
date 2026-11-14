"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/utils/api";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";

export default function EnquiriesPage() {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchEnquiries() {
      try {
        const data = await apiRequest("/enquiry");
        setEnquiries(data);
      } catch (err) {
        console.error("Failed to fetch enquiries", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEnquiries();
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

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await apiRequest(`/enquiry/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus })
      });
      setEnquiries(enquiries.map(enq => enq._id === id ? { ...enq, status: res.enquiry.status } : enq));
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const handleDeleteEnquiry = (id) => {
    setEnquiryToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDeleteEnquiry = async () => {
    if (!enquiryToDelete) return;
    try {
      await apiRequest(`/enquiry/${enquiryToDelete}`, { method: "DELETE" });
      setEnquiries(enquiries.filter(enq => enq._id !== enquiryToDelete));
    } catch (err) {
      alert("Failed to delete enquiry: " + err.message);
    } finally {
      setIsModalOpen(false);
      setEnquiryToDelete(null);
    }
  };

  const filteredEnquiries = enquiries.filter(e => {
    const name = (e.name || "").toLowerCase();
    const email = (e.email || "").toLowerCase();
    const phone = (e.phone || "").toLowerCase();
    const propName = (e.propertyName || "").toLowerCase();
    const message = (e.message || "").toLowerCase();
    const type = (e.enquiryType || "").toLowerCase();
    const query = searchQuery.toLowerCase();

    return name.includes(query) || email.includes(query) || phone.includes(query) || propName.includes(query) || message.includes(query) || type.includes(query);
  });

  return (
    <>
        {/* Content Body */}
        <div className="p-8 max-w-7xl w-full mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-950 font-sans tracking-tight">Customer Enquiries</h1>
              <p className="text-xs text-gray-500 font-medium mt-1">Review visitor bookings, callback requests, and properties enquiries sent from the website.</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-200/80 shadow-sm font-semibold text-gray-500">
              Loading enquiries...
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-255 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                      <th className="py-4 px-6">Client Details</th>
                      <th className="py-4 px-6">Enquiry Details</th>
                      <th className="py-4 px-6">Date Sent</th>
                      <th className="py-4 px-6">Action / Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {filteredEnquiries.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-gray-400 font-medium">
                          No enquiries found.
                        </td>
                      </tr>
                    ) : (
                      filteredEnquiries.map(e => {
                        const statusClass = e.status === "Pending" ? "bg-red-50 text-red-700 border-red-200"
                                          : e.status === "Contacted" ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                          : "bg-green-50 text-green-700 border-green-200";

                        const formattedDate = new Date(e.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        });

                        return (
                          <tr key={e._id} className="hover:bg-gray-50/50 transition">
                            <td className="py-4 px-6 space-y-1">
                              <p className="font-bold text-gray-900 leading-tight">{e.name}</p>
                              <p className="text-xs text-gray-500">{e.email}</p>
                              <p className="text-xs text-gray-500 font-semibold">{e.phone}</p>
                            </td>
                            <td className="py-4 px-6 space-y-1.5 max-w-md">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8EAD8] text-[#5E6623]">
                                  {e.enquiryType}
                                </span>
                                {e.propertyName && (
                                  <span className="text-xs font-bold text-gray-800">
                                    @{e.propertyName}
                                  </span>
                                )}
                              </div>
                              {e.message && (
                                <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded border border-gray-100 italic leading-relaxed">
                                  "{e.message}"
                                </p>
                              )}
                            </td>
                            <td className="py-4 px-6 text-xs text-gray-500 font-semibold font-mono">
                              {formattedDate}
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <select
                                  value={e.status}
                                  onChange={(evt) => handleStatusChange(e._id, evt.target.value)}
                                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#5E6623] cursor-pointer ${statusClass}`}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Contacted">Contacted</option>
                                  <option value="Resolved">Resolved</option>
                                </select>
                                <button
                                  onClick={() => handleDeleteEnquiry(e._id)}
                                  className="w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-red-50 flex items-center justify-center text-red-500 hover:text-red-700 transition"
                                  title="Delete Enquiry"
                                >
                                  <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                              </div>
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
        {/* Custom Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEnquiryToDelete(null);
          }}
          onConfirm={confirmDeleteEnquiry}
          title="Delete Enquiry"
          message="Are you sure you want to delete this enquiry?"
        />
    </>
  );
}

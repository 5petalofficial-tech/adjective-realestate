"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/utils/api";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";

export default function AdminFeedbackPage() {
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchFeedback() {
      try {
        const data = await apiRequest("/enquiry");
        // Filter entries generated from Help Us To Improve or contains FEEDBACK
        const filtered = data.filter((item) =>
          (item.enquiryType || "").toUpperCase().includes("HELP US TO IMPROVE") ||
          (item.enquiryType || "").toUpperCase().includes("FEEDBACK")
        );
        setFeedbacks(filtered);
      } catch (err) {
        console.error("Failed to fetch feedback", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFeedback();
  }, [router]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await apiRequest(`/enquiry/${id}`, {
        method: "PUT",
        body: { status: newStatus },
      });
      setFeedbacks(
        feedbacks.map((item) =>
          item._id === id ? { ...item, status: res.enquiry.status } : item
        )
      );
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const handleDeleteFeedback = (id) => {
    setFeedbackToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDeleteFeedback = async () => {
    if (!feedbackToDelete) return;
    try {
      await apiRequest(`/enquiry/${feedbackToDelete}`, { method: "DELETE" });
      setFeedbacks(feedbacks.filter((item) => item._id !== feedbackToDelete));
    } catch (err) {
      alert("Failed to delete feedback: " + err.message);
    } finally {
      setIsModalOpen(false);
      setFeedbackToDelete(null);
    }
  };

  const filteredFeedbacks = feedbacks;

  return (
    <>
        <div className="p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-950 font-sans tracking-tight">
                Customer Feedback & Ratings
              </h1>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Review website suggestions, user ratings, bug reports, and service improvement feedback.
              </p>
            </div>

          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Feedback</p>
                <p className="text-2xl font-black text-gray-900 mt-1">{feedbacks.length}</p>
              </div>
              <span className="material-symbols-outlined text-3xl text-[#5E6623] bg-[#5E6623]/10 p-2.5 rounded-lg">
                rate_review
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending Action</p>
                <p className="text-2xl font-black text-amber-600 mt-1">
                  {feedbacks.filter(f => f.status === "Pending").length}
                </p>
              </div>
              <span className="material-symbols-outlined text-3xl text-amber-600 bg-amber-50 p-2.5 rounded-lg">
                pending_actions
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Resolved</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">
                  {feedbacks.filter(f => f.status === "Resolved").length}
                </p>
              </div>
              <span className="material-symbols-outlined text-3xl text-emerald-600 bg-emerald-50 p-2.5 rounded-lg">
                task_alt
              </span>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-200/80 shadow-sm font-semibold text-gray-500">
              Loading feedback data...
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                      <th className="py-4 px-6">User Info</th>
                      <th className="py-4 px-6">Feedback & Rating</th>
                      <th className="py-4 px-6">Date Sent</th>
                      <th className="py-4 px-6">Action / Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {filteredFeedbacks.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-gray-400 font-medium">
                          No customer feedback entries found.
                        </td>
                      </tr>
                    ) : (
                      filteredFeedbacks.map((f) => {
                        const statusClass =
                          f.status === "Pending"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : f.status === "Contacted"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-green-50 text-green-700 border-green-200";

                        const formattedDate = new Date(f.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        });

                        return (
                          <tr key={f._id} className="hover:bg-gray-50/50 transition">
                            <td className="py-4 px-6 space-y-1">
                              <p className="font-bold text-gray-900 leading-tight">{f.name}</p>
                              <p className="text-xs text-gray-500">{f.email}</p>
                              <p className="text-xs text-gray-500 font-semibold">{f.phone}</p>
                            </td>

                            <td className="py-4 px-6 space-y-1.5 max-w-md">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8EAD8] text-[#5E6623]">
                                  {f.enquiryType.replace("HELP US TO IMPROVE - ", "")}
                                </span>
                                {f.propertyName && (
                                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                                    ⭐ {f.propertyName}
                                  </span>
                                )}
                              </div>
                              {f.message && (
                                <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded border border-gray-100 whitespace-pre-wrap leading-relaxed">
                                  {f.message}
                                </p>
                              )}
                            </td>

                            <td className="py-4 px-6 text-xs text-gray-500 font-semibold font-mono">
                              {formattedDate}
                            </td>

                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <select
                                  value={f.status}
                                  onChange={(evt) => handleStatusChange(f._id, evt.target.value)}
                                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#5E6623] cursor-pointer ${statusClass}`}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Contacted">Contacted</option>
                                  <option value="Resolved">Resolved</option>
                                </select>

                                <button
                                  onClick={() => setSelectedFeedback(f)}
                                  className="w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 hover:text-gray-900 transition"
                                  title="View Full Details"
                                >
                                  <span className="material-symbols-outlined text-lg">visibility</span>
                                </button>

                                <button
                                  onClick={() => handleDeleteFeedback(f._id)}
                                  className="w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-red-50 flex items-center justify-center text-red-500 hover:text-red-700 transition"
                                  title="Delete Feedback"
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

        {/* Detail Modal */}
        {selectedFeedback && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-gray-100">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-bold text-lg text-gray-900">Feedback Details</h3>
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="text-gray-400 hover:text-gray-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-gray-500 uppercase">User Name:</span>
                  <p className="text-sm font-bold text-gray-900">{selectedFeedback.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-bold text-gray-500 uppercase">Email:</span>
                    <p className="text-gray-800">{selectedFeedback.email}</p>
                  </div>
                  <div>
                    <span className="font-bold text-gray-500 uppercase">Phone:</span>
                    <p className="text-gray-800">{selectedFeedback.phone}</p>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-gray-500 uppercase">Rating / Category:</span>
                  <p className="text-sm font-semibold text-[#5E6623]">
                    {selectedFeedback.enquiryType} — {selectedFeedback.propertyName}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-gray-500 uppercase">Message Content:</span>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-1 whitespace-pre-wrap text-gray-700 leading-relaxed max-h-60 overflow-y-auto">
                    {selectedFeedback.message}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end">
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="px-4 py-2 bg-[#5E6623] text-white font-bold rounded-lg text-xs uppercase"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setFeedbackToDelete(null);
          }}
          onConfirm={confirmDeleteFeedback}
          title="Delete Feedback"
          message="Are you sure you want to delete this feedback item?"
        />
    </>
  );
}
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/utils/api";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";

export default function AdminDashboard() {
  const [solos, setSolos] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteTitle, setDeleteTitle] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const router = useRouter();

  // Search & Filter States
  const [soloSearch, setSoloSearch] = useState("");
  const [soloType, setSoloType] = useState("All");
  const [soloStatus, setSoloStatus] = useState("All");

  const [dealerSearch, setDealerSearch] = useState("");
  const [dealerType, setDealerType] = useState("All");
  const [dealerStatus, setDealerStatus] = useState("All");

  useEffect(() => {
    async function loadData() {
      try {
        const soloRes = await apiRequest("/solo/all");
        const dealerRes = await apiRequest("/dealer/all");
        setSolos(soloRes.properties || []);
        setDealers(dealerRes.data || []);
      } catch (err) {
        console.error("Fetch failed", err);
        if (err.message.includes("Session expired") || err.message.includes("Token") || err.message.includes("authorized")) {
          localStorage.removeItem("token");
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const handleDeleteSolo = (id) => {
    setDeleteTarget({ id, type: 'solo' });
    setDeleteTitle("Delete Resale Property");
    setDeleteMessage("Are you sure you want to delete this resale property listing?");
    setIsDeleteModalOpen(true);
  };

  const handleDeleteDealer = (id) => {
    setDeleteTarget({ id, type: 'dealer' });
    setDeleteTitle("Delete Builder Project");
    setDeleteMessage("Are you sure you want to delete this builder project listing?");
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { id, type } = deleteTarget;
    try {
      if (type === 'solo') {
        await apiRequest(`/solo/${id}`, { method: "DELETE" });
        setSolos(solos.filter(item => item._id !== id));
      } else {
        await apiRequest(`/dealer/${id}`, { method: "DELETE" });
        setDealers(dealers.filter(item => item._id !== id));
      }
    } catch (err) {
      alert("Delete failed: " + err.message);
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleApproveSolo = async (id) => {
    try {
      await apiRequest(`/solo/${id}`, {
        method: "PUT",
        body: {
          status: "Available",
          isVerifiedByAdmin: true
        }
      });
      setSolos(prev => prev.map(item => item._id === id ? { ...item, status: "Available", isVerifiedByAdmin: true } : item));
      alert("Property approved! It is now live on the public website.");
    } catch (err) {
      alert("Approval failed: " + err.message);
    }
  };

  const handleScrollTo = (id) => (e) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#${id}`);
    } else {
      router.push(`/#${id}`);
    }
  };

  const handleUnderDev = (e) => {
    e.preventDefault();
    alert("This section is currently under development.");
  };

  const getImageUrl = (path) => {
    if (!path || typeof path !== "string") return "https://placehold.co/800x500/5E6623/white?text=No+Image";
    const cleanPath = path.replace(/\\/g, "/").trim();
    if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
      return cleanPath;
    }
    const uploadsIdx = cleanPath.toLowerCase().indexOf("uploads/");
    if (uploadsIdx !== -1) {
      const relativeUpload = cleanPath.slice(uploadsIdx);
      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const backendHost = rawApiUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");
      return `${backendHost}/${relativeUpload}`;
    }
    return cleanPath.startsWith("/") ? cleanPath : "/" + cleanPath;
  };

  const formatPrice = (num) => {
    if (!num) return "₹0";
    return `₹${num.toLocaleString("en-IN")}`;
  };

  const formatPriceRange = (min, max) => {
    const formatLakhsCr = (val) => {
      if (val >= 10000000) return `${(val / 10000000).toFixed(1)}Cr`;
      if (val >= 100000) return `${(val / 100000).toFixed(0)}L`;
      return val;
    };
    return `${formatLakhsCr(min)} – ${formatLakhsCr(max)}`;
  };

  // Filtered Lists
  const filteredSolos = solos.filter(p => {
    const matchesSearch = (p.name?.toLowerCase().includes(soloSearch.toLowerCase()) || 
                          (p.address && p.address.toLowerCase().includes(soloSearch.toLowerCase())) ||
                          (p.area && p.area.toLowerCase().includes(soloSearch.toLowerCase())));
    const type = p.noOfBedrooms > 3 ? "Villa" : "Apartment";
    const matchesType = soloType === "All" || type === soloType;
    
    // Status mapping: Available -> Active, On Hold -> Pending, Sold -> Sold, Inactive -> Inactive
    let displayStatus = "Active";
    if (p.isActive === false) displayStatus = "Inactive";
    else if (p.status === "On Hold" || !p.isVerifiedByAdmin) displayStatus = "Pending";
    else if (p.status === "Sold") displayStatus = "Sold";
    const matchesStatus = soloStatus === "All" || displayStatus === soloStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredDealers = dealers.filter(p => {
    const matchesSearch = (p.projectName?.toLowerCase().includes(dealerSearch.toLowerCase()) ||
                          (p.location?.locality && p.location.locality.toLowerCase().includes(dealerSearch.toLowerCase())) ||
                          (p.Area && p.Area.toLowerCase().includes(dealerSearch.toLowerCase())));
    const isCommercial = p.configurations?.some(c => c.bhkType === "Commercial Space");
    const type = isCommercial ? "Commercial" : "Residential";
    const matchesType = dealerType === "All" || type === dealerType;
    
    // Status mapping
    let displayStatus = p.isActive ? "Active" : "Inactive";
    const matchesStatus = dealerStatus === "All" || displayStatus === dealerStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Summary counts
  const totalProperties = solos.length + dealers.length;
  const activeListings = solos.filter(p => p.status === "Available" && p.isVerifiedByAdmin !== false).length + dealers.filter(p => p.isActive).length;
  const builderProjects = dealers.length;
  const pendingApprovals = solos.filter(p => p.status === "On Hold" || !p.isVerifiedByAdmin).length;

  // Monthly stats (dynamic calculation based on createdAt date)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const propertiesThisMonth = 
    solos.filter(p => {
      const d = new Date(p.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length +
    dealers.filter(p => {
      const d = new Date(p.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

  const builderProjectsThisMonth = dealers.filter(p => {
    const d = new Date(p.createdAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  const activePercentage = totalProperties > 0 ? ((activeListings / totalProperties) * 100).toFixed(1) : "0.0";

  if (loading) return <div className="text-center py-20 bg-[#FAF8F2] min-h-screen">Loading dashboard...</div>;

  return (
    <>
      {/* Dashboard Dashboard Body */}
      <div className="p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* Overview Title Row */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">Dashboard Overview</h2>
            <p className="text-sm text-gray-500 mt-1 font-medium">Manage and monitor all property listings and projects.</p>
          </div>
          <div className="relative group">
            <button className="bg-[#5E6623] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-2 shadow-sm hover:bg-[#4E541E] transition">
              <span>+ Add New</span>
              <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition duration-150 z-20">
              <Link href="/add-solo" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium">Add Resale Property</Link>
              <Link href="/add-project" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium">Add Builder Project</Link>
            </div>
          </div>
        </div>

        {/* ── METRICS SUMMARY CARDS ─────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Properties */}
          <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Properties</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{totalProperties}</h3>
              <span className="text-xs text-green-600 font-semibold flex items-center mt-2">
                +{propertiesThisMonth} this month <span className="material-symbols-outlined text-sm ml-0.5">arrow_outward</span>
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#E8EAD8] text-[#5E6623] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">home</span>
            </div>
          </div>

          {/* Active Listings */}
          <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Listings</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{activeListings}</h3>
              <span className="text-xs text-green-600 font-semibold flex items-center mt-2">
                {activePercentage}% of total
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#E8EAD8] text-[#5E6623] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">check_circle</span>
            </div>
          </div>

          {/* Builder Projects */}
          <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Builder Projects</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{builderProjects}</h3>
              <span className="text-xs text-green-600 font-semibold flex items-center mt-2">
                +{builderProjectsThisMonth} this month
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#E8EAD8] text-[#5E6623] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">business</span>
            </div>
          </div>

          {/* Pending Approval */}
          <div 
            onClick={() => setSoloStatus("Pending")}
            className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm flex items-center justify-between cursor-pointer hover:border-amber-400 transition"
          >
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Approval</p>
              <h3 className="text-3xl font-bold text-amber-600 mt-2">{pendingApprovals}</h3>
              <span className="text-xs text-amber-700 font-semibold flex items-center mt-2">
                {pendingApprovals > 0 ? `${pendingApprovals} awaiting approval` : "No pending submissions"}
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">pending_actions</span>
            </div>
          </div>
        </div>

        {/* Pending Approval Banner */}
        {pendingApprovals > 0 && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-amber-600 text-2xl shrink-0">mark_email_unread</span>
              <div>
                <p className="font-bold text-sm">
                  {pendingApprovals} User Property Submission(s) Awaiting Approval
                </p>
                <p className="text-xs text-amber-700 mt-0.5">
                  User submissions are held in pending status until reviewed. Click approve below to publish them live onto the website.
                </p>
              </div>
            </div>
            <button
              onClick={() => setSoloStatus("Pending")}
              className="px-4 py-2 rounded-lg bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition cursor-pointer shrink-0"
            >
              Filter Pending ({pendingApprovals})
            </button>
          </div>
        )}

        {/* ── RESALE PROPERTIES TABLE ───────────────────────────── */}
        <div id="resale-properties" className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Table Header Filter Row */}
          <div className="p-5 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center justify-between w-full md:w-auto">
              <h3 className="text-lg font-bold text-gray-950">Resale Properties (Solo)</h3>
              <Link href="/add-solo" className="md:hidden bg-[#5E6623] text-white px-3.5 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition">
                + Add Property
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-sm">search</span>
                <input 
                  type="text" 
                  placeholder="Search properties..." 
                  value={soloSearch}
                  onChange={e => setSoloSearch(e.target.value)}
                  className="w-full border border-gray-200 pl-9 pr-4 py-2 rounded-lg text-xs bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[#5E6623]"
                />
              </div>
              <select 
                value={soloType} 
                onChange={e => setSoloType(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5E6623] font-medium"
              >
                <option value="All">Property Type</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
              </select>
              <select 
                value={soloStatus} 
                onChange={e => setSoloStatus(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5E6623] font-medium"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active / Approved</option>
                <option value="Pending">Pending Approval</option>
                <option value="Inactive">Inactive</option>
                <option value="Sold">Sold</option>
              </select>
              <Link href="/add-solo" className="hidden md:inline-flex bg-[#5E6623] text-white px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-[#4E541E] transition shadow-sm">
                + Add Resale Property
              </Link>
            </div>
          </div>

          {/* Resale Table Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Property Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Listed On</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSolos.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-10 text-center text-sm text-gray-500">No properties match search criteria.</td>
                  </tr>
                ) : (
                  filteredSolos.map(property => {
                    const idShort = `RP-${property._id.slice(-4).toUpperCase()}`;
                    const type = property.noOfBedrooms > 3 ? "Villa" : "Apartment";
                    const isPending = property.status === "On Hold" || !property.isVerifiedByAdmin;

                    // Status Mapping
                    let badgeClass = "bg-green-50 text-green-700 border-green-200";
                    let displayStatus = "Active";
                    if (property.isActive === false) {
                      badgeClass = "bg-red-50 text-red-700 border-red-200";
                      displayStatus = "Inactive";
                    } else if (isPending) {
                      badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
                      displayStatus = "Pending Approval";
                    } else if (property.status === "Sold") {
                      badgeClass = "bg-gray-100 text-gray-600 border-gray-200";
                      displayStatus = "Sold";
                    }

                    const listedDate = new Date(property.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    });

                    return (
                      <tr key={property._id} className={`hover:bg-gray-50/50 text-sm transition ${isPending ? "bg-amber-50/20" : ""}`}>
                        {/* Image */}
                        <td className="px-6 py-4">
                          <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                            <img 
                              src={getImageUrl(property.images?.[0])} 
                              alt={property.name} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        </td>
                        {/* Name & ID */}
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900 leading-snug">{property.name}</div>
                          <span className="text-[11px] font-medium text-gray-500 font-mono">ID: {idShort}</span>
                        </td>
                        {/* Type */}
                        <td className="px-6 py-4 text-gray-600">{type}</td>
                        {/* Location */}
                        <td className="px-6 py-4">
                          <div className="flex items-center text-gray-600">
                            <span className="material-symbols-outlined text-gray-400 text-base mr-1.5 shrink-0">location_on</span>
                            <span className="truncate max-w-[150px]">{property.area || property.address}</span>
                          </div>
                        </td>
                        {/* Price */}
                        <td className="px-6 py-4 font-semibold text-gray-950">{formatPrice(property.price)}</td>
                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeClass}`}>
                            {displayStatus}
                          </span>
                        </td>
                        {/* Listed Date */}
                        <td className="px-6 py-4 text-gray-500 font-medium">{listedDate}</td>
                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {isPending && (
                              <button 
                                onClick={() => handleApproveSolo(property._id)}
                                title="Approve & Publish to Live Website"
                                className="px-3 py-1.5 rounded-lg bg-[#5E6623] hover:bg-[#4E541E] text-white text-xs font-bold transition shadow-sm flex items-center gap-1 cursor-pointer whitespace-nowrap"
                              >
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                Approve
                              </button>
                            )}
                            <Link href={`/add-solo?id=${property._id}`} className="w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 hover:text-gray-900 transition" title="Edit Details">
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </Link>
                            <button onClick={() => handleDeleteSolo(property._id)} className="w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-red-50 flex items-center justify-center text-red-500 hover:text-red-700 transition" title="Reject / Delete">
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

          {/* Pagination footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50/50 flex justify-between items-center text-xs text-gray-500">
            <span>Show 10 entries</span>
            <div className="flex items-center space-x-1">
              <button className="p-1 rounded hover:bg-gray-200">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="px-2.5 py-1 rounded bg-[#5E6623] text-white font-bold">1</button>
              <button className="px-2.5 py-1 rounded hover:bg-gray-200">2</button>
              <button className="px-2.5 py-1 rounded hover:bg-gray-200">3</button>
              <span className="px-1 text-gray-400">...</span>
              <button className="px-2.5 py-1 rounded hover:bg-gray-200">5</button>
              <button className="p-1 rounded hover:bg-gray-200">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── BUILDER PROJECTS TABLE ────────────────────────────── */}
        <div id="builder-projects" className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Table Header Filter Row */}
          <div className="p-5 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center justify-between w-full md:w-auto">
              <h3 className="text-lg font-bold text-gray-950">Builder Projects (Dealers)</h3>
              <Link href="/add-project" className="md:hidden bg-[#5E6623] text-white px-3.5 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition">
                + Add Project
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-sm">search</span>
                <input 
                  type="text" 
                  placeholder="Search projects..." 
                  value={dealerSearch}
                  onChange={e => setDealerSearch(e.target.value)}
                  className="w-full border border-gray-200 pl-9 pr-4 py-2 rounded-lg text-xs bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[#5E6623]"
                />
              </div>
              <select 
                value={dealerType} 
                onChange={e => setDealerType(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5E6623] font-medium"
              >
                <option value="All">Project Type</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
              <select 
                value={dealerStatus} 
                onChange={e => setDealerStatus(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5E6623] font-medium"
              >
                <option value="All">Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <Link href="/add-project" className="hidden md:inline-flex bg-[#5E6623] text-white px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-[#4E541E] transition shadow-sm">
                + Add Builder Project
              </Link>
            </div>
          </div>

          {/* Builder Table Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Project Name</th>
                  <th className="px-6 py-4">Builder</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Price Range</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDealers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-10 text-center text-sm text-gray-500">No projects match search criteria.</td>
                  </tr>
                ) : (
                  filteredDealers.map(project => {
                    const builderName = project.builderId 
                      ? `${project.builderId.First_name} ${project.builderId.Last_name || ""}` 
                      : "Skyline Developers";

                    const isCommercial = project.configurations?.some(c => c.bhkType === "Commercial Space");
                    const type = isCommercial ? "Commercial" : "Residential";

                    // Location locality formatted string
                    const localityStr = project.location?.locality || project.Area || "Kolkata";
                    
                    // Status Mapping: Active -> Active, Inactive -> Inactive
                    let badgeClass = "bg-green-50 text-green-700 border-green-200";
                    let displayStatus = "Active";
                    if (!project.isActive) {
                      badgeClass = "bg-red-50 text-red-700 border-red-200";
                      displayStatus = "Inactive";
                    }

                    return (
                      <tr key={project._id} className="hover:bg-gray-50/50 text-sm transition">
                        {/* Image */}
                        <td className="px-6 py-4">
                          <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                            <img 
                              src={getImageUrl(project.media?.bannerImage)} 
                              alt={project.projectName} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        </td>
                        {/* Project Name */}
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900 leading-snug">{project.projectName}</div>
                          <span className="text-[11px] font-medium text-gray-500 font-mono">RERA: {project.reraNumber}</span>
                        </td>
                        {/* Builder */}
                        <td className="px-6 py-4 text-gray-600">{builderName}</td>
                        {/* Location */}
                        <td className="px-6 py-4">
                          <div className="flex items-center text-gray-600">
                            <span className="material-symbols-outlined text-gray-400 text-base mr-1.5 shrink-0">location_on</span>
                            <span className="truncate max-w-[150px]">{localityStr}</span>
                          </div>
                        </td>
                        {/* Type */}
                        <td className="px-6 py-4 text-gray-600">{type}</td>
                        {/* Price Range */}
                        <td className="px-6 py-4 font-semibold text-gray-950">
                          {project.priceRange?.minPrice 
                            ? formatPriceRange(project.priceRange.minPrice, project.priceRange.maxPrice) 
                            : "₹45L – ₹1.2Cr"}
                        </td>
                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeClass}`}>
                            {displayStatus}
                          </span>
                        </td>
                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-1.5">
                            <Link href={`/add-project?id=${project._id}`} className="w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 hover:text-gray-900 transition">
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </Link>
                            <button onClick={() => handleDeleteDealer(project._id)} className="w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-red-50 flex items-center justify-center text-red-500 hover:text-red-700 transition">
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

          {/* Pagination footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50/50 flex justify-between items-center text-xs text-gray-500">
            <span>Show 10 entries</span>
            <div className="flex items-center space-x-1">
              <button className="p-1 rounded hover:bg-gray-200">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="px-2.5 py-1 rounded bg-[#5E6623] text-white font-bold">1</button>
              <button className="px-2.5 py-1 rounded hover:bg-gray-200">2</button>
              <button className="px-2.5 py-1 rounded hover:bg-gray-200">3</button>
              <span className="px-1 text-gray-400">...</span>
              <button className="px-2.5 py-1 rounded hover:bg-gray-200">5</button>
              <button className="p-1 rounded hover:bg-gray-200">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
        title={deleteTitle}
        message={deleteMessage}
      />
    </>
  );
}

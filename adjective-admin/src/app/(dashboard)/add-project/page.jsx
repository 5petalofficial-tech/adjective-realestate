"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/utils/api";
import dynamic from "next/dynamic";
import NotificationModal from "@/components/common/NotificationModal";

const LocationPicker = dynamic(() => import("@/components/map/LocationPicker"), {
  ssr: false,
});

function AddDealerProjectForm() {
  const router = useRouter();

  const [notification, setNotification] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
    redirect: false
  });

  // File Inputs Refs
  const bannerInputRef = useRef(null);
  const brochureInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  
  // Media Files
  const [banner, setBanner] = useState(null);
  const [brochure, setBrochure] = useState(null);
  const [gallery, setGallery] = useState([]);

  // Form Fields
  const [projectName, setProjectName] = useState("");
  const [reraNumber, setReraNumber] = useState("");
  const [constructionStatus, setConstructionStatus] = useState("Under Construction");
  const [areaSize, setAreaSize] = useState("");
  const [numberOfBalconies, setNumberOfBalconies] = useState("");
  const [sbuaSize, setSbuaSize] = useState("");
  const [buaSize, setBuaSize] = useState("");
  const [carpetSize, setCarpetSize] = useState("");
  const [description, setDescription] = useState("");
  
  // Location subdocument
  const [addressLine, setAddressLine] = useState("");
  const [locality, setLocality] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // Pricing Range
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  
  // New Dealer Fields
  const [possessionTime, setPossessionTime] = useState("");
  const [startingTiming, setStartingTiming] = useState("");
  const [specifications, setSpecifications] = useState(""); // Comma separated for demo
  const [unitPlans, setUnitPlans] = useState([]);
  const [neighborhoodSurroundings, setNeighborhoodSurroundings] = useState([]);
  const [customerReviews, setCustomerReviews] = useState([]);
  const [faq, setFaq] = useState([]);
  const [walkthroughUrl, setWalkthroughUrl] = useState("");
  const [paymentSchedule, setPaymentSchedule] = useState("");
  const [homeLoanOffers, setHomeLoanOffers] = useState(""); // Comma separated for demo
  const [growthInsights, setGrowthInsights] = useState("");
  const [floorPlanFile, setFloorPlanFile] = useState(null);
  // Additional Detail Fields
  const [projectHeight, setProjectHeight] = useState("");
  const [numberOfLifts, setNumberOfLifts] = useState("");
  const [liftSize, setLiftSize] = useState("");
  const [flatTypes, setFlatTypes] = useState([]);
  const [showFlatTypeDropdown, setShowFlatTypeDropdown] = useState(false);
  const [liftCompany, setLiftCompany] = useState("");
  const [numberOfFlats, setNumberOfFlats] = useState("");
  const [flatsPerFloor, setFlatsPerFloor] = useState("");
  const [serviceLiftAvailable, setServiceLiftAvailable] = useState("No");
  const [servantQuarterAvailable, setServantQuarterAvailable] = useState("No");
  const [servantQuarterLocation, setServantQuarterLocation] = useState("");
  const [constructionDetails, setConstructionDetails] = useState("");
  const [projectStatus, setProjectStatus] = useState("Under Construction");
  const [pmayCategory, setPmayCategory] = useState("Not Applicable");
  const [isActive, setIsActive] = useState("Yes");
  // ---

  // Display Section Booleans
  const [displaySections, setDisplaySections] = useState({
  isFeatured: false,
  isFinest: false,
  isProjectOfTheMonth: false,
  isProjectOfTheWeek: false,
  isVastuCompliant: false,
  isRERAApproved: false,
  isPMAYApproved: false
});

  const [locationArea, setLocationArea] = useState("");
  const [existingBanner, setExistingBanner] = useState("");
  const [existingBrochure, setExistingBrochure] = useState("");
  const [existingGallery, setExistingGallery] = useState([]);

  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  // User ID from token (stored in builderId)
  const [builderId, setBuilderId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setBuilderId(payload.sub || payload.id);
    } catch (e) {
      console.error("Token decoding failed", e);
      router.push("/login");
    }

    if (editId) {
      async function loadProject() {
        try {
          const res = await apiRequest(`/dealer/${editId}`);
          const p = res.data || res.project;
          setProjectName(p.projectName || "");
          setReraNumber(p.reraNumber || "");
          setConstructionStatus(p.constructionStatus || "");
          setAreaSize(p.Area || "");
          setDescription(p.description || "");
setNumberOfFlats(p.numberOfFlats || "");
setFlatsPerFloor(p.flatsPerFloor || "");
setFlatTypes(
  Array.isArray(p.flatTypes)
    ? p.flatTypes.map((item) => {
        if (typeof item === "string") {
          return {
            type: item,
            minArea: "",
            maxArea: ""
          };
        }

        return {
          type: item.type || item.bhkType || "",
          minArea: item.minArea || "",
          maxArea: item.maxArea || ""
        };
      })
    : []
);
setNumberOfBalconies(p.numberOfBalconies || "");
setProjectStatus(p.projectStatus || "Under Construction");
          if (p.location) {
            setAddressLine(p.location.addressLine || "");
            setLocality(p.location.locality || "");
            setCity(p.location.city || "");
            setState(p.location.state || "");
            setPincode(p.location.pincode || "");
            setLatitude(
              p.location.latitude !== undefined &&
              p.location.latitude !== null
                ? Number(p.location.latitude)
                : ""
            );
            setLongitude(
              p.location.longitude !== undefined &&
              p.location.longitude !== null
                ? Number(p.location.longitude)
                : ""
            );
          }
          if (p.priceRange) {
            setMinPrice(p.priceRange.minPrice || "");
            setMaxPrice(p.priceRange.maxPrice || "");
          }
          setDisplaySections({
  isFeatured: p.isFeatured || false,
  isFinest: p.isFinest || false,
  isProjectOfTheMonth: p.isProjectOfTheMonth || false,
  isProjectOfTheWeek: p.isProjectOfTheWeek || false,
  isVastuCompliant: p.isVastuCompliant || false,
  isRERAApproved: p.isRERAApproved || false,
  isPMAYApproved: p.isPMAYApproved || p.PMAY_Approved || false
});
          if (p.configurations && p.configurations.length > 0) {
            setSbuaSize(p.configurations[0].superBuiltUpAreaSize || "");
            setBuaSize(p.configurations[0].builtUpAreaSize || "");
            setCarpetSize(p.configurations[0].carpetAreaSize || "");
          }
          setPossessionTime(p.possessionTime ? p.possessionTime.substring(0, 10) : "");
          setStartingTiming(p.startingTiming ? p.startingTiming.substring(0, 10) : "");
          setSpecifications(Array.isArray(p.specifications) ? p.specifications.join(", ") : p.specifications || "");
          setWalkthroughUrl(p.walkthroughUrl || "");
          setPaymentSchedule(p.paymentSchedule || "");
          setHomeLoanOffers(Array.isArray(p.homeLoanOffers) ? p.homeLoanOffers.join(", ") : p.homeLoanOffers || "");
          setGrowthInsights(p.growthInsights || "");
          setProjectHeight(p.projectHeight || "");
          setConstructionDetails(p.constructionDetails || "");
          setPmayCategory(p.pmayCategory || "Not Applicable");
          if (p.liftDetails) {
            setNumberOfLifts(p.liftDetails.numberOfLifts || "");
            setLiftSize(p.liftDetails.liftSize || "");
            setLiftCompany(p.liftDetails.liftCompany || "");
            setServiceLiftAvailable(p.liftDetails.serviceLiftAvailable ? "Yes" : "No");
          }
          if (p.servantQuarter) {
            setServantQuarterAvailable(p.servantQuarter.available ? "Yes" : "No");
            setServantQuarterLocation(p.servantQuarter.location || "");
          }
          setIsActive(p.isActive !== false ? "Yes" : "No");
          if (p.media) {
            setExistingBanner(p.media.bannerImage || "");
            setExistingBrochure(p.media.brochureUrl || "");
            setExistingGallery(p.media.projectGallery || []);
          }
        } catch (err) {
          console.error("Failed to load project details for editing", err);
        }
      }
      loadProject();
    }
  }, [router, editId]);

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

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleBannerDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      setBanner(e.dataTransfer.files[0]);
    }
  };

  const handleGalleryDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setGallery(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const isVideoFile = (filenameOrType) => {
    if (!filenameOrType) return false;
    const lower = filenameOrType.toLowerCase();
    return (
      lower.startsWith("video/") ||
      lower.endsWith(".mp4") ||
      lower.endsWith(".webm") ||
      lower.endsWith(".mov") ||
      lower.endsWith(".avi") ||
      lower.endsWith(".mkv")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!builderId) {
      setNotification({
        isOpen: true,
        type: "error",
        title: "Session Required",
        message: "Your admin session is invalid. Please sign in again before submitting the project.",
        redirect: false
      });
      return;
    }

    if (
      latitude === "" ||
      longitude === "" ||
      !Number.isFinite(Number(latitude)) ||
      !Number.isFinite(Number(longitude))
    ) {
      setNotification({
        isOpen: true,
        type: "error",
        title: "Location Required",
        message: "Please select the exact project location on the map.",
        redirect: false
      });
      return;
    }

    const formData = new FormData();
    
    // Append standard fields
    formData.append("builderId", builderId);
    formData.append("projectName", projectName);
    formData.append("reraNumber", reraNumber);
    formData.append("constructionStatus", constructionStatus);
    formData.append("Area", areaSize);
    formData.append("description", description);
    
    // Append location details structured nested location block
    formData.append("location[addressLine]", addressLine);
    formData.append("location[locality]", locality);
    formData.append("location[city]", city);
    formData.append("location[state]", state);
    formData.append("location[pincode]", pincode);
    formData.append("location[latitude]", String(latitude));
    formData.append("location[longitude]", String(longitude));

    // Append price range
    formData.append("priceRange[minPrice]", minPrice);
    formData.append("priceRange[maxPrice]", maxPrice);

    // Section Booleans
    formData.append("isFeatured", displaySections.isFeatured);
    formData.append("isFinest", displaySections.isFinest);
    formData.append("isProjectOfTheMonth", displaySections.isProjectOfTheMonth);
    formData.append("isProjectOfTheWeek", displaySections.isProjectOfTheWeek);
    formData.append("isVastuCompliant", displaySections.isVastuCompliant);
    formData.append("isRERAApproved", displaySections.isRERAApproved);
    formData.append("isPMAYApproved", displaySections.isPMAYApproved);
    formData.append("PMAY_Approved", displaySections.isPMAYApproved); // schema fallback

    // Add default configurations and structural towers (required subdocuments)
    formData.append("configurations[0][bhkType]", "2BHK");
    formData.append("configurations[0][superBuiltUpAreaSize]", sbuaSize || "1200");
    formData.append("configurations[0][builtUpAreaSize]", buaSize || sbuaSize || "1000");
    formData.append("configurations[0][carpetAreaSize]", carpetSize || buaSize || sbuaSize || "850");
    formData.append("configurations[0][basePrice]", minPrice || "1000000");
    formData.append("locationArea", locationArea);
    formData.append("towers[0][towerName]", "Tower A");
    formData.append("towers[0][totalFloors]", "12");
    formData.append("towers[0][totalUnitsCount]", "48");
    // Existing assets
    if (existingBanner) formData.append("existingBanner", existingBanner);
    if (existingBrochure) formData.append("existingBrochure", existingBrochure);
    if (existingGallery.length > 0) {
      existingGallery.forEach(img => formData.append("existingGallery", img));
    } else {
      formData.append("existingGallery", "");
    }
    // Files
    if (banner) formData.append("bannerImage", banner);
    if (brochure) formData.append("brochureUrl", brochure);
    if (floorPlanFile) formData.append("floorPlanUrl", floorPlanFile);
    gallery.forEach(file => formData.append("projectGallery", file));

    // New Dealer Fields
    formData.append("possessionTime", possessionTime);
    formData.append("startingTiming", startingTiming);
    formData.append("walkthroughUrl", walkthroughUrl);
    formData.append("paymentSchedule", paymentSchedule);
    formData.append("growthInsights", growthInsights);

    // JSON Arrays
    formData.append("specifications", JSON.stringify(specifications.split(",").map(s => s.trim()).filter(Boolean)));
    formData.append("unitPlans", JSON.stringify(unitPlans));
    formData.append("neighborhoodSurroundings", JSON.stringify(neighborhoodSurroundings));
    formData.append("customerReviews", JSON.stringify(customerReviews));
    formData.append("faq", JSON.stringify(faq));
    formData.append("homeLoanOffers", JSON.stringify(homeLoanOffers.split(",").map(s => s.trim()).filter(Boolean)));

    // Additional Detail Fields
    formData.append("projectHeight", projectHeight);
    formData.append("projectStatus", projectStatus);
    formData.append("constructionDetails", constructionDetails);
    formData.append("pmayCategory", pmayCategory);
    formData.append("isActive", isActive === "Yes");
    formData.append("flatTypes", JSON.stringify(flatTypes));
    formData.append("liftDetails", JSON.stringify({
      numberOfLifts: Number(numberOfLifts) || 0,
      liftSize: liftSize,
      liftCompany: liftCompany,
      serviceLiftAvailable: serviceLiftAvailable === "Yes"
    }));
    formData.append("servantQuarter", JSON.stringify({
      available: servantQuarterAvailable === "Yes",
      location: servantQuarterLocation
    }));

    try {
      const endpoint = editId ? `/dealer/${editId}` : "/dealer/add";
      const method = editId ? "PATCH" : "POST";

      await apiRequest(endpoint, {
        method,
        body: formData
      });

      setNotification({
        isOpen: true,
        type: "success",
        title: editId ? "Project Updated!" : "Project Uploaded!",
        message: editId 
          ? "Builder project details updated successfully." 
          : "Builder project uploaded successfully.",
        redirect: true
      });
    } catch (err) {
      setNotification({
        isOpen: true,
        type: "error",
        title: "Submission Error",
        message: err.message || "Failed to submit builder project.",
        redirect: false
      });
    }
  };

  return (
    <>
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200/80 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-4">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-500 font-bold hover:text-gray-800 transition">
              <span className="material-symbols-outlined text-base">arrow_back</span>
              <span>Back to Dashboard</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
        <div className="p-4 border-t border-[#3D4523]/50">
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-[#A2AB8F] hover:bg-red-900/20 hover:text-red-400 transition duration-150">
            <span className="material-symbols-outlined text-xl">logout</span>
            <span className="text-sm font-semibold">Logout</span>
          </button>
        </div>
          </div>
        </header>

        {/* Form Body Container */}
        <div className="p-8 max-w-5xl w-full mx-auto">
          <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl border border-gray-200/85 shadow-[0_10px_35px_rgba(0,0,0,0.03)] space-y-8">
            
            {/* Header section with building icon */}
            <div className="flex items-center space-x-4 border-b border-gray-100 pb-6">
              <div className="w-12 h-12 rounded-full bg-[#F1F3EA] text-[#5E6623] flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">business</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 leading-tight">
                  {editId ? "Edit Builder Project" : "Publish Builder Project"}
                </h2>
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  {editId ? "Update details to modify this builder project listing." : "Add project details to publish a new builder project."}
                </p>
              </div>
            </div>

            {/* ROW 1: Project Name & RERA (Left) & Overview Description (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Name & RERA */}
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Project Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="e.g. Adjective SkyLiving" 
                    required 
                    value={projectName}
                    onChange={e => setProjectName(e.target.value)}
                    className="w-full bg-gray-50/30 border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] focus:border-[#5E6623] transition text-gray-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">RERA Registration Number <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="e.g. WBRERA/P/KOL/2023/000100" 
                    required 
                    value={reraNumber}
                    onChange={e => setReraNumber(e.target.value)}
                    className="w-full bg-gray-50/30 border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] focus:border-[#5E6623] transition text-gray-800"
                  />
                </div>
              </div>

              {/* Right Column: Description */}
              <div className="space-y-1.5 flex flex-col">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Overview Description <span className="text-red-500">*</span></label>
                <div className="relative flex-1 flex flex-col">
                  <textarea 
                    placeholder="Enter project description, key highlights, structural elements, configurations, developer credentials, etc." 
                    required 
                    maxLength={1000}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full flex-1 min-h-[140px] bg-gray-50/30 border border-gray-255 p-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] focus:border-[#5E6623] transition text-gray-800 resize-none"
                  />
                  <span className="absolute bottom-2.5 right-3.5 text-[10px] text-gray-400 font-bold">
                    {description.length} / 1000
                  </span>
                </div>
              </div>
            </div>

            {/* ROW 2:  & Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Construction Status <span className="text-red-500">*</span></label>
                <select 
                  value={constructionStatus}
                  onChange={e => setConstructionStatus(e.target.value)}
                  className="w-full bg-white border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] transition text-gray-700 font-medium"
                >
                  <option value="Soft Launch">soft Launch</option>
                  <option value="Launch">Launched</option>
                  <option value="Under Construction">Under Construction</option>
                  <option value="Ready to Move">Ready to Move / Completed</option>
                  <option value="Handover">Possession / Handover</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Total Project Land/Super Area <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g. 5 Acres" 
                  required
                  value={areaSize}
                  onChange={e => setAreaSize(e.target.value)}
                  className="w-full bg-gray-50/30 border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] transition text-gray-800 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Built-Up Area (BUA) (sq.ft)<span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  placeholder="e.g. 1000" 
                  value={buaSize}
                  onChange={e => setBuaSize(e.target.value)}
                  className="w-full bg-gray-50/30 border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] transition text-gray-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Super Built-Up Area (sq.ft)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 1200" 
                  required
                  value={sbuaSize}
                  onChange={e => setSbuaSize(e.target.value)}
                  className="w-full bg-gray-50/30 border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] transition text-gray-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Carpet Area (sq.ft)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 850" 
                  value={carpetSize}
                  onChange={e => setCarpetSize(e.target.value)}
                  className="w-full bg-gray-50/30 border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] transition text-gray-800"
                />
              </div>
            </div>

            {/* EXTENDED PROJECT SPECIFICS */}
            <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-200/60 space-y-6">
              <h3 className="text-sm font-bold text-gray-900 border-b pb-2 uppercase tracking-wider">Project Specifics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Possession Date</label>
                  <input type="date" value={possessionTime} onChange={e=>setPossessionTime(e.target.value)} className="w-full bg-white border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] text-gray-800"/>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Walkthrough Video URL</label>
                  <input type="url" value={walkthroughUrl} onChange={e=>setWalkthroughUrl(e.target.value)} placeholder="e.g. https://youtube.com/..." className="w-full bg-white border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] text-gray-800"/>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Specifications (Comma Separated)</label>
                <input type="text" value={specifications} onChange={e=>setSpecifications(e.target.value)} placeholder="e.g. Vitrified Tiles, Modular Kitchen, Premium Bath Fittings" className="w-full bg-white border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] text-gray-800"/>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Payment Schedule Info</label>
                  <input type="text" value={paymentSchedule} onChange={e=>setPaymentSchedule(e.target.value)} placeholder="e.g. 10% booking, 90% on handover" className="w-full bg-white border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] text-gray-800"/>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Home Loan Offers (Comma Separated)</label>
                  <input type="text" value={homeLoanOffers} onChange={e=>setHomeLoanOffers(e.target.value)} placeholder="e.g. SBI Approved, HDFC Approved" className="w-full bg-white border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] text-gray-800"/>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Project/Building Height</label>
                  <input type="text" value={projectHeight} onChange={e=>setProjectHeight(e.target.value)} placeholder="e.g. G+12 or 40m" className="w-full bg-white border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] text-gray-800"/>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Construction Material</label>
                  <select value={constructionDetails} onChange={e=>setConstructionDetails(e.target.value)} className="w-full bg-white border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623]">
                    <option value="">Select...</option>
                    <option value="Bricks">Bricks</option>
                    <option value="Ash Bricks">Ash Bricks</option>
                    <option value="Blocks">Blocks</option>
                    <option value="RCC">RCC</option>
                    <option value="AAC Blocks">AAC Blocks</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">PMAY Category</label>
                  <select value={pmayCategory} onChange={e=>setPmayCategory(e.target.value)} className="w-full bg-white border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623]">
                     <option value="Applicable">Applicable</option>
                     <option value="Not Applicable">Not Applicable</option>
                      <option value="HIG">HIG (High Income Group)</option>
                    <option value="EWS">EWS (Economically Weaker Section)</option>
                    <option value="LIG">LIG (Low Income Group)</option>
                    <option value="MIG-I">MIG-I (Middle Income Group I)</option>
                    <option value="MIG-II">MIG-II (Middle Income Group II)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Listing Status <span className="text-red-500">*</span></label>
                  <select value={isActive} onChange={e=>setIsActive(e.target.value)} className="w-full bg-white border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] font-semibold text-gray-800">
                    <option value="Yes">Active (Show on Site)</option>
                    <option value="No">Inactive (Hide / Saved draft)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">No. of Flats</label>
                  <input type="number" value={numberOfFlats} onChange={e=>setNumberOfFlats(e.target.value)} placeholder="e.g. 2" className="w-full bg-white border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] text-gray-800"/>
                </div>
                <div className="space-y-2">
  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
    Types of Flats
  </label>

  {/* Selected Flat Types */}
  {flatTypes.length > 0 && (
    <div className="flex flex-wrap gap-2">
      {flatTypes.map((flat, index) => (
        <div
          key={flat.type}
          className="flex items-center gap-2 bg-[#5E6623]/10 border border-[#5E6623]/30 rounded-lg px-3 py-2"
        >
          <span className="text-sm font-medium text-gray-700">
            {flat.type}
          </span>

          {/* Remove */}
          <button
            type="button"
            onClick={() => {
              setFlatTypes(prev =>
                prev.filter((_, i) => i !== index)
              );
            }}
            className="text-gray-500 hover:text-red-500 font-bold"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )}

  {/* Dropdown */}
  <div className="relative">
   <button
  type="button"
  onClick={() => setShowFlatTypeDropdown(prev => !prev)}
  className="w-full bg-white border bg-[#5E6623]/10 px-4 py-2.5 rounded-lg text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#5E6623]"
>
  <span className="text-gray-500">
    Select the types of flats
  </span>

  <span
    className={`inline-block w-2.5 h-2.5 border-r-2 border-b-2 border-gray-500 transition-transform duration-200 ${
      showFlatTypeDropdown
        ? "rotate-[225deg]"
        : "rotate-45"
    }`}
  />
</button>

    {showFlatTypeDropdown && (
      <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-2">
        {["2 BHK", "3 BHK", "4 BHK", "5 BHK", "5+ BHK"].map(type => {
          const selected = flatTypes.some(
            flat => flat.type === type
          );

          return (
            <button
              key={type}
              type="button"
              onClick={() => {
                if (selected) {
                  setFlatTypes(prev =>
                    prev.filter(flat => flat.type !== type)
                  );
                } else {
                  setFlatTypes(prev => [
                    ...prev,
                    {
                      type,
                      minArea: "",
                      maxArea: "",
                    },
                  ]);
                }
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 text-left"
            >
              <input
                type="checkbox"
                checked={selected}
                readOnly
                className="accent-[#5E6623]"
              />

              <span className="text-sm text-gray-700">
                {type}
              </span>
            </button>
          );
        })}
      </div>
    )}
  </div>

  {/* Area Range for Selected Flats */}
  {flatTypes.length > 0 && (
    <div className="space-y-2 mt-2">
      {flatTypes.map((flat, index) => (
        <div
          key={flat.type}
          className="flex items-center gap-2"
        >
          <span className="w-16 text-xs font-semibold text-gray-600">
            {flat.type}
          </span>

          <input
            type="number"
            placeholder="Min"
            value={flat.minArea}
            onChange={e => {
              const updated = [...flatTypes];
              updated[index].minArea = e.target.value;
              setFlatTypes(updated);
            }}
            className="w-24 bg-white border border-gray-300 px-2 py-2 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-[#5E6623]"
          />

          <span className="text-gray-400">-</span>

          <input
            type="number"
            placeholder="Max"
            value={flat.maxArea}
            onChange={e => {
              const updated = [...flatTypes];
              updated[index].maxArea = e.target.value;
              setFlatTypes(updated);
            }}
            className="w-24 bg-white border border-gray-300 px-2 py-2 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-[#5E6623]"
          />

          <span className="text-xs text-gray-500">
            sq.ft
          </span>
        </div>
      ))}
    </div>
  )}
</div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">How Many Flats in a floor</label>
                  <input type="number" value={flatsPerFloor} onChange={e=>setFlatsPerFloor(e.target.value)} placeholder="e.g. 2" className="w-full bg-white border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] text-gray-800"/>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">No.of Balconies</label>
                  <input type="text" value={numberOfBalconies} onChange={e=>setNumberOfBalconies(e.target.value)} placeholder="e.g. 2 (in a flat)" className="w-full bg-white border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] text-gray-800"/>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">No. of Lifts</label>
                  <input type="number" value={numberOfLifts} onChange={e=>setNumberOfLifts(e.target.value)} placeholder="e.g. 2" className="w-full bg-white border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] text-gray-800"/>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Lift Size</label>
                  <input type="text" value={liftSize} onChange={e=>setLiftSize(e.target.value)} placeholder="e.g. 8 Person" className="w-full bg-white border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] text-gray-800"/>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Lift Company</label>
                  <input type="text" value={liftCompany} onChange={e=>setLiftCompany(e.target.value)} placeholder="e.g. Otis, KONE" className="w-full bg-white border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] text-gray-800"/>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Service Lift?</label>
                  <select value={serviceLiftAvailable} onChange={e=>setServiceLiftAvailable(e.target.value)} className="w-full bg-white border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623]">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Servant Quarter Available?</label>
                  <select value={servantQuarterAvailable} onChange={e=>setServantQuarterAvailable(e.target.value)} className="w-full bg-white border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623]">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                {servantQuarterAvailable === "Yes" && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Servant Quarter Location</label>
                    <input type="text" value={servantQuarterLocation} onChange={e=>setServantQuarterLocation(e.target.value)} placeholder="e.g. Ground Floor, Terrace" className="w-full bg-white border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] text-gray-800"/>
                  </div>
                )}
              </div>
            </div>

            {/* LOCATION BLOCK: Address Line, Locality, City, State, Pincode */}
            <div className="border-t border-gray-100 pt-6 space-y-4">
              <h3 className="text-xs font-bold text-[#5E6623] uppercase tracking-wider">Project Location</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Street Address <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="Address Line" 
                    required 
                    value={addressLine}
                    onChange={e => setAddressLine(e.target.value)}
                    className="w-full bg-gray-50/30 border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] transition text-gray-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Locality / Area <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="e.g. Newtown" 
                    required 
                    value={locality}
                    onChange={e => setLocality(e.target.value)}
                    className="w-full bg-gray-50/30 border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] transition text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">City <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="City" 
                    required 
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full bg-gray-50/30 border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] transition text-gray-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">State <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="State" 
                    required 
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full bg-gray-50/30 border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] transition text-gray-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Pincode <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="Pincode" 
                    required 
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    className="w-full bg-gray-50/30 border border-gray-255 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] transition text-gray-800 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Exact Project Location
                    <span className="text-red-500"> *</span>
                  </label>
                  <p className="mt-1 text-[11px] font-medium text-gray-400">
                    Search, click on the map, or drag the marker to select the exact project location.
                  </p>
                </div>

                <LocationPicker
                  latitude={latitude}
                  longitude={longitude}
                  address={`${addressLine}, ${locality}, ${city}, ${state}, ${pincode}`}
                  onLocationChange={({ latitude, longitude }) => {
                      console.log("Selected:", latitude, longitude);

                    setLatitude(latitude);
                    setLongitude(longitude);
                  }}
                />

                {latitude !== "" && longitude !== "" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Latitude
                      </p>
                      <p className="mt-1 text-xs font-semibold text-gray-700">
                        {Number(latitude).toFixed(6)}
                      </p>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Longitude
                      </p>
                      <p className="mt-1 text-xs font-semibold text-gray-700">
                        {Number(longitude).toFixed(6)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ROW 3: Starting Price & Max Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Starting Price (INR) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-sm text-gray-500 font-semibold select-none">₹</span>
                  <input 
                    type="number" 
                    placeholder="Starting Price" 
                    required
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    className="w-full bg-gray-50/30 border border-gray-255 pl-8 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] transition text-gray-800 font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Max Price (INR) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-sm text-gray-500 font-semibold select-none">₹</span>
                  <input 
                    type="number" 
                    placeholder="Max Price" 
                    required
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    className="w-full bg-gray-50/30 border border-gray-255 pl-8 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] transition text-gray-800 font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* MEDIA SECTIONS: Banner Dropzone, Gallery Dropzone, Brochure Input */}
            <div className="border-t border-gray-100 pt-6 space-y-6">
              <h3 className="text-xs font-bold text-[#5E6623] uppercase tracking-wider">Project Assets & Media</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Banner Image */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Banner Image (Required) <span className="text-red-500">*</span></label>
                  <div 
                    onClick={() => bannerInputRef.current.click()}
                    onDragOver={handleDragOver}
                    onDrop={handleBannerDrop}
                    className="border-2 border-dashed border-gray-255 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50/20 cursor-pointer hover:bg-gray-50/50 transition h-40"
                  >
                    <span className="material-symbols-outlined text-3xl text-[#5E6623] mb-2">image</span>
                    <span className="text-xs font-bold text-gray-800">Click or drop banner photo</span>
                    <span className="text-[9px] text-gray-400 mt-1 font-semibold">PNG, JPG, JPEG only</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      required={!existingBanner && !banner} 
                      ref={bannerInputRef}
                      onChange={e => setBanner(e.target.files[0])}
                      className="hidden" 
                    />
                  </div>
                  {(banner || existingBanner) && (
                    <div className="mt-3 relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <img 
                        src={banner ? URL.createObjectURL(banner) : `http://localhost:5000/${existingBanner.replace(/\\/g, '/')}`} 
                        alt="Banner Preview" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setBanner(null);
                          setExistingBanner("");
                        }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 hover:bg-red-650 flex items-center justify-center text-white transition cursor-pointer"
                        title="Remove Banner"
                      >
                        <span className="material-symbols-outlined text-xs">close</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Gallery Images & Videos */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Project Gallery & Videos (Multiple)</label>
                  <div 
                    onClick={() => galleryInputRef.current.click()}
                    onDragOver={handleDragOver}
                    onDrop={handleGalleryDrop}
                    className="border-2 border-dashed border-gray-255 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50/20 cursor-pointer hover:bg-gray-50/50 transition h-40"
                  >
                    <span className="material-symbols-outlined text-3xl text-[#5E6623] mb-2">collections</span>
                    <span className="text-xs font-bold text-gray-800">Click or drop gallery photos & videos</span>
                    <span className="text-[9px] text-gray-400 mt-1 font-semibold">Multiple images & MP4/WEBM videos allowed</span>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*,video/*" 
                      ref={galleryInputRef}
                      onChange={e => {
                        if (e.target.files) {
                          setGallery(prev => [...prev, ...Array.from(e.target.files)]);
                        }
                      }}
                      className="hidden" 
                    />
                  </div>
                  {(existingGallery.length > 0 || gallery.length > 0) && (
                    <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {existingGallery.map((mediaUrl, idx) => {
                        const isVid = isVideoFile(mediaUrl);
                        const fullUrl = `http://localhost:5000/${mediaUrl.replace(/\\/g, '/')}`;
                        return (
                          <div key={`exist-gal-${idx}`} className="relative group w-full aspect-square bg-gray-900 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                            {isVid ? (
                              <video src={fullUrl} className="w-full h-full object-cover" muted />
                            ) : (
                              <img src={fullUrl} alt="Existing project gallery" className="w-full h-full object-cover" />
                            )}
                            {isVid && (
                              <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[8px] font-bold px-1 py-0.5 rounded flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[9px]">videocam</span> Video
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => setExistingGallery(existingGallery.filter((_, i) => i !== idx))}
                              className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/70 hover:bg-red-600 flex items-center justify-center text-white transition cursor-pointer z-10"
                              title="Remove Media"
                            >
                              <span className="material-symbols-outlined text-[10px]">close</span>
                            </button>
                          </div>
                        );
                      })}
                      {gallery.map((file, idx) => {
                        const isVid = isVideoFile(file.type) || isVideoFile(file.name);
                        const objectUrl = URL.createObjectURL(file);
                        return (
                          <div key={`new-gal-${idx}`} className="relative group w-full aspect-square bg-gray-900 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                            {isVid ? (
                              <video src={objectUrl} className="w-full h-full object-cover" muted />
                            ) : (
                              <img src={objectUrl} alt="Gallery Preview" className="w-full h-full object-cover" />
                            )}
                            {isVid && (
                              <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[8px] font-bold px-1 py-0.5 rounded flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[9px]">videocam</span> Video
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => setGallery(gallery.filter((_, i) => i !== idx))}
                              className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/70 hover:bg-red-600 flex items-center justify-center text-white transition cursor-pointer z-10"
                              title="Remove Media"
                            >
                              <span className="material-symbols-outlined text-[10px]">close</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Brochure File Input */}
              <div className="space-y-1.5 max-w-md">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Brochure PDF (Optional)</label>
                <div className="flex border border-gray-255 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#5E6623]">
                  <input 
                    type="file" 
                    accept="application/pdf"
                    ref={brochureInputRef}
                    onChange={e => setBrochure(e.target.files[0])}
                    className="hidden" 
                  />
                  <button 
                    type="button"
                    onClick={() => brochureInputRef.current.click()}
                    className="bg-gray-100 px-4 py-2 text-xs font-bold text-gray-700 border-r border-gray-255 hover:bg-gray-200 transition cursor-pointer shrink-0"
                  >
                    Choose PDF
                  </button>
                  <span className="px-4 py-2.5 text-xs text-gray-500 font-semibold truncate flex-1 bg-white select-none">
                    {brochure ? brochure.name : (existingBrochure ? existingBrochure.split(/[/\\]/).pop() : "No file chosen")}
                  </span>
                </div>
                {(brochure || existingBrochure) && (
                  <div className="flex items-center space-x-2 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200/80 p-2.5 rounded-lg mt-2">
                    <span className="material-symbols-outlined text-lg text-red-500">picture_as_pdf</span>
                    <span className="truncate max-w-[200px]">
                      {brochure ? brochure.name : existingBrochure.split(/[/\\]/).pop()}
                    </span>
                    {!brochure && existingBrochure && (
                      <a 
                        href={`http://localhost:5000/${existingBrochure.replace(/\\/g, '/')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 underline"
                      >
                        View
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setBrochure(null);
                        setExistingBrochure("");
                      }}
                      className="text-red-500 hover:text-red-700 font-bold ml-auto"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* WEBSITE DISPLAY SECTIONS */}
            <div className="border-t border-gray-100 pt-6 space-y-3">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Website Display Sections</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.keys(displaySections).map(key => {
                  const label = key === "isFeatured" ? "Featured Collections"
                              : key === "isFinest" ? "Finest Residences"
                              : key === "isProjectOfTheWeek" ? "Project of the Week"
                              : key === "isProjectOfTheMonth" ? "Project of the Month"
                              : key === "isVastuCompliant" ? "Vastu Compliant"
                              : key === "isRERAApproved" ? "RERA Approved"
                              : "PMAY Approved";
                  return (
                    <label key={key} className="flex items-center space-x-2 text-xs font-semibold text-gray-600 cursor-pointer hover:text-gray-800 select-none">
                      <input 
                        type="checkbox" 
                        checked={displaySections[key]}
                        onChange={e => setDisplaySections({...displaySections, [key]: e.target.checked})}
                        className="rounded text-[#5E6623] focus:ring-[#5E6623] w-4 h-4 border-gray-300" 
                      />
                      <span>{label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* PUBLISH PROJECT BUTTON */}
            <button 
              type="submit" 
              className="w-full bg-[#5E6623] text-white py-3 rounded-lg font-bold hover:bg-[#4E541E] transition shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">send</span>
              <span>{editId ? "Update Builder Project" : "Publish Builder Project"}</span>
            </button>

          </form>
        </div>
      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => {
          setNotification({ ...notification, isOpen: false });
          if (notification.redirect) {
            router.push("/");
          }
        }}
      />
    </>
  );
}

export default function AddDealerProject() {
  return (
    <Suspense fallback={<div className="text-center py-20 bg-[#FAF8F2] min-h-screen">Loading form...</div>}>
      <AddDealerProjectForm />
    </Suspense>
  );
}

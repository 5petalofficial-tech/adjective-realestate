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

function AddSoloPropertyForm() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  
  // Custom states matching mockup fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationArea, setLocationArea] = useState("");
  
  // New Resale Fields
  const [propertyType, setPropertyType] = useState("Flat");
  const [floor, setFloor] = useState("");
  const [buildingConfiguration, setBuildingConfiguration] = useState("");
  const [handoverDate, setHandoverDate] = useState("");
  const [loanPossible, setLoanPossible] = useState("Yes");
  const [numberOfTowers, setNumberOfTowers] = useState("");
  const [roadWidth, setRoadWidth] = useState("");
  const [propertyTitle, setPropertyTitle] = useState("Registered");
  const [liabilities, setLiabilities] = useState("");
  const [taxMutation, setTaxMutation] = useState("Yes");
  const [leaseOrFreehold, setLeaseOrFreehold] = useState("Freehold");
  const [landArea, setLandArea] = useState("");
  const [carParkingArea, setCarParkingArea] = useState("");
  const [carParkingType, setCarParkingType] = useState("");
  const [carParkingCount, setCarParkingCount] = useState("");
  // Additional Detail Fields
  const [projectHeight, setProjectHeight] = useState("");
  const [numberOfLifts, setNumberOfLifts] = useState("");
  const [liftSize, setLiftSize] = useState("");
  const [liftCompany, setLiftCompany] = useState("");
  const [serviceLiftAvailable, setServiceLiftAvailable] = useState("No");
  const [servantQuarterAvailable, setServantQuarterAvailable] = useState("No");
  const [servantQuarterLocation, setServantQuarterLocation] = useState("");
  const [constructionDetails, setConstructionDetails] = useState("");
  const [pmayCategory, setPmayCategory] = useState("Not Applicable");
  const [isActive, setIsActive] = useState("Yes");
  // ---

  const [ageOfProperty, setAgeOfProperty] = useState("");
  const [sbuaSize, setSbuaSize] = useState("");
  const [buaSize, setBuaSize] = useState("");
  const [carpetSize, setCarpetSize] = useState("");
  const [areaUnit, setAreaUnit] = useState("sq.ft");
  const [furnishing, setFurnishing] = useState("Unfurnished");
  const [possession, setPossession] = useState("Ready to Move");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [balconies, setBalconies] = useState("");
  const [price, setPrice] = useState("");
  const [negotiable, setNegotiable] = useState("Yes");
  const [additionalNotes, setAdditionalNotes] = useState("");
  
  // Amenities list matching mockup checkboxes
  const [amenities, setAmenities] = useState({
    water24x7: false,
    gatedCommunity: false,
    powerBackup: false,
    gym: false,
    lift: false,
    swimmingPool: false,
    parking: false,
    clubHouse: false,
    security: false,
    other: false
  });

  // Display Section Booleans
  const [displaySections, setDisplaySections] = useState({
    isFeatured: false,
    isFinest: false,
    isProjectOfTheMonth: false,
    isVastuCompliant: false,
    isRERAApproved: false,
    isPMAYApproved: false
  });

  const [existingImages, setExistingImages] = useState([]);

  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  // User ID from token
  const [listedBy, setListedBy] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setListedBy(payload.sub || payload.id);
    } catch (e) {
      console.error("Token decoding failed", e);
      router.push("/login");
    }

    if (editId) {
      async function loadProperty() {
        try {
          const res = await apiRequest(`/solo/${editId}`);
          const p = res.property;
          setTitle(p.name || "");
          setDescription(p.overview || "");
          setAddressLine1(p.address || "");
          setAddressLine2(p.area || "");
          setLatitude(
            p.latitude !== undefined && p.latitude !== null
              ? Number(p.latitude)
              : ""
          );

          setLongitude(
            p.longitude !== undefined && p.longitude !== null
              ? Number(p.longitude)
              : ""
          );
          setLocationArea(p.locationArea || "");
          setPropertyType(p.propertyType || "Flat");
          setAgeOfProperty(p.ageOfProperty || "");
          setSbuaSize(p.superBuiltUpAreaSize || "");
          setBuaSize(p.builtUpAreaSize || "");
          setCarpetSize(p.carpetAreaSize || "");
          setFurnishing(p.furnishingStatus || "Unfurnished");
          setBedrooms(p.noOfBedrooms || "");
          setBathrooms(p.noOfToilets || "");
          setBalconies(p.noOfBalconies || "");
          setPrice(p.price || "");
          // Loading new resale specific fields:
          setFloor(p.floor || "");
          setBuildingConfiguration(p.buildingConfiguration || "");
          setHandoverDate(p.handoverDate ? p.handoverDate.substring(0, 10) : "");
          setLoanPossible(p.loanPossible ? "Yes" : "No");
          setNumberOfTowers(p.numberOfTowers || "");
          setRoadWidth(p.roadWidth || "");
          setPropertyTitle(p.propertyTitle || "Registered");
          setLiabilities(p.liabilities || "");
          setTaxMutation(p.taxMutation ? "Yes" : "No");
          setLeaseOrFreehold(p.leaseOrFreehold || "Freehold");
          setLandArea(p.landArea || "");
          if (p.carParkingDetails) {
            setCarParkingType(p.carParkingDetails.parkingType || "");
            setCarParkingArea(p.carParkingDetails.area || "");
            setCarParkingCount(p.carParkingDetails.count || "");
          }
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
          setDisplaySections({
            isFeatured: p.isFeatured || false,
            isFinest: p.isFinest || false,
            isProjectOfTheMonth: p.isProjectOfTheMonth || false,
            isVastuCompliant: p.isVastuCompliant || false,
            isRERAApproved: p.isRERAApproved || false,
            isPMAYApproved: p.isPMAYApproved || false
          });
          setExistingImages(p.images || []);
        } catch (err) {
          console.error("Failed to load property details for editing", err);
        }
      }
      loadProperty();
    }
  }, [router, editId]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
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

  const [notification, setNotification] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
    redirect: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

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
          message: "Please select the exact property location on the map.",
          redirect: false
        });

        return;
      }
    
    // Combine amenities into notes or details
    const activeAmenities = Object.keys(amenities)
      .filter(key => amenities[key])
      .map(key => key.replace(/([A-Z])/g, ' $1').trim());

    const combinedNotes = [
      additionalNotes,
      activeAmenities.length > 0 ? `Amenities: ${activeAmenities.join(", ")}` : "",
      `Possession: ${possession}`,
      `Negotiable: ${negotiable}`
    ].filter(Boolean).join(" | ");

    const formData = new FormData();
    formData.append("listedBy", listedBy);
    formData.append("name", title);
    formData.append("overview", description);
    formData.append("address", addressLine1);
    formData.append("area", addressLine2); // city/locality
    formData.append("locationArea", locationArea);
    formData.append("latitude", String(latitude));
    formData.append("longitude", String(longitude));
    formData.append("price", price);

    if (existingImages.length > 0) {
      existingImages.forEach(img => {
        formData.append("existingImages", img);
      });
    } else {
      formData.append("existingImages", "");
    }
    formData.append("ageOfProperty", ageOfProperty || 0);
    formData.append("superBuiltUpAreaSize", sbuaSize);
    formData.append("builtUpAreaSize", buaSize || sbuaSize);
    formData.append("carpetAreaSize", carpetSize || buaSize || sbuaSize);
    formData.append("noOfBedrooms", bedrooms);
    formData.append("noOfToilets", bathrooms);
    formData.append("noOfBalconies", balconies || 0);
    formData.append("furnishingStatus", furnishing);
    
    // Fallback required fields
    formData.append("vastu", displaySections.isVastuCompliant ? "Vastu Compliant" : "Unknown");
    formData.append("facing", "East");
    formData.append("parkingType", amenities.parking ? "Open" : "None");
    formData.append("status", "Available");

    // Display section toggles
    Object.keys(displaySections).forEach(key => {
      formData.append(key, displaySections[key]);
    });

    // New Resale Fields
    formData.append("propertyType", propertyType);
    formData.append("floor", floor);
    formData.append("buildingConfiguration", buildingConfiguration);
    formData.append("handoverDate", handoverDate);
    formData.append("loanPossible", loanPossible === "Yes");
    formData.append("numberOfTowers", numberOfTowers);
    formData.append("roadWidth", roadWidth);
    formData.append("propertyTitle", propertyTitle);
    formData.append("liabilities", liabilities);
    formData.append("taxMutation", taxMutation === "Yes");
    formData.append("leaseOrFreehold", leaseOrFreehold);
    formData.append("isNegotiable", negotiable === "Yes");
    formData.append("landArea", landArea);
    formData.append("carParkingDetails", JSON.stringify({
      available: carParkingType !== "None" && carParkingType !== "",
      parkingType: carParkingType,
      area: carParkingArea,
      count: Number(carParkingCount) || 0
    }));

    // Additional Detail Fields
    formData.append("projectHeight", projectHeight);
    formData.append("constructionDetails", constructionDetails);
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
    formData.append("pmayCategory", pmayCategory);
    formData.append("isActive", isActive === "Yes");

    // Uploaded photos & videos
    files.forEach(file => {
      // For simplicity in this demo, all files go to 'images'. 
      // To support sitePlanUrl etc., we would need separate state for them.
      formData.append("images", file);
    });

    try {
      const endpoint = editId ? `/solo/${editId}` : "/solo/create";
      const method = editId ? "PUT" : "POST";

      await apiRequest(endpoint, {
        method,
        body: formData
      });

      setNotification({
        isOpen: true,
        type: "success",
        title: editId ? "Listing Updated!" : "Listing Published!",
        message: editId 
          ? "Solo property listing updated successfully." 
          : "Solo property listing published successfully.",
        redirect: true
      });
    } catch (err) {
      setNotification({
        isOpen: true,
        type: "error",
        title: "Submission Error",
        message: err.message || "Failed to submit property listing.",
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
            
            {/* Header section with Home Icon */}
            <div className="flex items-center space-x-4 border-b border-gray-100 pb-6">
              <div className="w-12 h-12 rounded-full bg-[#F1F3EA] text-[#5E6623] flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">home</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 leading-tight">
                  {editId ? "Edit Resale Property (Solo)" : "List a Resale Property (Solo)"}
                </h2>
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  {editId ? "Update property details to modify this resale listing." : "Add property details to publish a new resale listing."}
                </p>
              </div>
            </div>

            {/* ROW 1: Listing Title & Address (Left) & Property Description (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Title & Address */}
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Listing Title <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="e.g. Luxury 3 BHK Apartment in New Town" 
                      required 
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="w-full bg-gray-50/30 border border-gray-250 pr-10 pl-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] focus:border-[#5E6623] transition text-gray-800"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Address <span className="text-red-500">*</span></label>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      placeholder="Enter full address" 
                      required 
                      value={addressLine1}
                      onChange={e => setAddressLine1(e.target.value)}
                      className="w-full bg-gray-50/30 border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] focus:border-[#5E6623] transition text-gray-800"
                    />
                    <input 
                      type="text" 
                      placeholder="Kolkata, West Bengal, India" 
                      required 
                      value={addressLine2}
                      onChange={e => setAddressLine2(e.target.value)}
                      className="w-full bg-gray-50/30 border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] focus:border-[#5E6623] transition text-gray-800"
                    />
                  </div>

                  <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Exact Property Location
                      <span className="text-red-500"> *</span>
                    </label>

                    <p className="mt-1 text-[11px] font-medium text-gray-400">
                      Search or click on the map to mark the exact property location.
                    </p>
                  </div>

                  <div className="space-y-1.5 mb-4">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Location Area <span className="text-red-500">*</span>
                    </label>

                    <select
                      value={locationArea}
                      onChange={(e) => setLocationArea(e.target.value)}
                      required
                      className="w-full bg-white border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] focus:border-[#5E6623]"
                    >
                      <option value="">Select Location Area</option>

                      <option value="Action Area I">
                        New Town Action Area I
                      </option>

                      <option value="Action Area II">
                        New Town Action Area II
                      </option>

                      <option value="Action Area III">
                        New Town Action Area III
                      </option>

                      <option value="Rajarhat">
                        Rajarhat
                      </option>

                      <option value="Others">
                        Others
                      </option>
                    </select>
                  </div>

                  <LocationPicker
                    latitude={latitude}
                    longitude={longitude}
                    address={`${addressLine1}, ${addressLine2}`}
                    onLocationChange={({ latitude, longitude }) => {
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
              </div>

              {/* Right Column: Description */}
              <div className="space-y-1.5 flex flex-col">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Property Description <span className="text-red-500">*</span></label>
                <div className="relative flex-1 flex flex-col">
                  <textarea 
                    placeholder="Enter property description, key highlights, amenities, nearby places, etc." 
                    required 
                    maxLength={1000}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full flex-1 min-h-[140px] bg-gray-50/30 border border-gray-250 p-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] focus:border-[#5E6623] transition text-gray-800 resize-none"
                  />
                  <span className="absolute bottom-2.5 right-3.5 text-[10px] text-gray-400 font-bold">
                    {description.length} / 1000
                  </span>
                </div>
              </div>
            </div>

            {/* ROW 2: Property Type & Age */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Property Type <span className="text-red-500">*</span></label>
                <select 
                  value={propertyType}
                  onChange={e => setPropertyType(e.target.value)}
                  className="w-full bg-white border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] transition text-gray-700 font-medium"
                >
                  <option value="Flat">Flat</option>
                  <option value="Individual House">Individual House</option>
                  <option value="Land with Building">Land with Building</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Property Age (Years)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 5" 
                  required
                  value={ageOfProperty}
                  onChange={e => setAgeOfProperty(e.target.value)}
                  className="w-full bg-gray-50/30 border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] transition text-gray-800"
                />
              </div>
            </div>

            {/* NEW EXTENDED RESALE FIELDS */}
            <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-200/60 space-y-6">
              <h3 className="text-sm font-bold text-gray-900 border-b pb-2 uppercase tracking-wider">Detailed Specifications</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Floor</label>
                  <input type="text" value={floor} onChange={e=>setFloor(e.target.value)} placeholder="e.g. 2nd Floor" className="w-full bg-white border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] text-gray-800"/>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Building Configuration</label>
                  <input type="text" value={buildingConfiguration} onChange={e=>setBuildingConfiguration(e.target.value)} placeholder="e.g. B+G+4" className="w-full bg-white border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] text-gray-800"/>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Handover Date</label>
                  <input type="date" value={handoverDate} onChange={e=>setHandoverDate(e.target.value)} className="w-full bg-white border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] text-gray-800"/>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Loan Possible?</label>
                  <select value={loanPossible} onChange={e=>setLoanPossible(e.target.value)} className="w-full bg-white border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623]">
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Number of Towers</label>
                  <input type="number" value={numberOfTowers} onChange={e=>setNumberOfTowers(e.target.value)} placeholder="e.g. 2" className="w-full bg-white border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] text-gray-800"/>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Front Road Width</label>
                  <input type="text" value={roadWidth} onChange={e=>setRoadWidth(e.target.value)} placeholder="e.g. 30ft" className="w-full bg-white border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] text-gray-800"/>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Property Title</label>
                  <select value={propertyTitle} onChange={e=>setPropertyTitle(e.target.value)} className="w-full bg-white border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623]">
                    <option value="Registered">Registered</option>
                    <option value="Unregistered">Unregistered</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Liabilities (if any)</label>
                  <input type="text" value={liabilities} onChange={e=>setLiabilities(e.target.value)} placeholder="e.g. Bank Loan" className="w-full bg-white border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] text-gray-800"/>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Tax/Mutation Done?</label>
                  <select value={taxMutation} onChange={e=>setTaxMutation(e.target.value)} className="w-full bg-white border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623]">
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Lease or Freehold?</label>
                  <select value={leaseOrFreehold} onChange={e=>setLeaseOrFreehold(e.target.value)} className="w-full bg-white border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623]">
                    <option value="Freehold">Freehold</option>
                    <option value="Leasehold">Leasehold</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Land Area</label>
                  <input type="text" value={landArea} onChange={e=>setLandArea(e.target.value)} placeholder="e.g. 5 Kathas" className="w-full bg-white border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] text-gray-800"/>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Car Parking Type</label>
                  <select value={carParkingType} onChange={e=>setCarParkingType(e.target.value)} className="w-full bg-white border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623]">
                    <option value="">None</option>
                    <option value="Open">Open Parking</option>
                    <option value="Covered">Covered Parking</option>
                    <option value="Stilt">Stilt Parking</option>
                    <option value="Basement">Basement Parking</option>
                    <option value="Podium">Podium Parking</option>
                    <option value="Mechanical/Automated">Mechanical/Automated</option>
                    <option value="Multi-Level">Multi-Level Parking</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Car Parking Area</label>
                  <input type="text" value={carParkingArea} onChange={e=>setCarParkingArea(e.target.value)} placeholder="e.g. 150 sq.ft" className="w-full bg-white border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] text-gray-800"/>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Number of Parkings</label>
                  <input type="number" value={carParkingCount} onChange={e=>setCarParkingCount(e.target.value)} placeholder="e.g. 1" className="w-full bg-white border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] text-gray-800"/>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Project/Building Height</label>
                  <input type="text" value={projectHeight} onChange={e=>setProjectHeight(e.target.value)} placeholder="e.g. G+12 or 40m" className="w-full bg-white border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] text-gray-800"/>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Construction Material</label>
                  <select value={constructionDetails} onChange={e=>setConstructionDetails(e.target.value)} className="w-full bg-white border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623]">
                    <option value="">Select...</option>
                    <option value="Bricks">Bricks</option>
                    <option value="Ash Bricks">Ash Bricks</option>
                    <option value="Blocks">Blocks</option>
                    <option value="RCC">RCC</option>
                    <option value="AAC Blocks">AAC Blocks</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">No. of Lifts</label>
                  <input type="number" value={numberOfLifts} onChange={e=>setNumberOfLifts(e.target.value)} placeholder="e.g. 2" className="w-full bg-white border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] text-gray-800"/>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Lift Size</label>
                  <input type="text" value={liftSize} onChange={e=>setLiftSize(e.target.value)} placeholder="e.g. 8 Person" className="w-full bg-white border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] text-gray-800"/>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Lift Company</label>
                  <input type="text" value={liftCompany} onChange={e=>setLiftCompany(e.target.value)} placeholder="e.g. Otis, KONE" className="w-full bg-white border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] text-gray-800"/>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Service Lift?</label>
                  <select value={serviceLiftAvailable} onChange={e=>setServiceLiftAvailable(e.target.value)} className="w-full bg-white border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623]">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Servant Quarter Available?</label>
                  <select value={servantQuarterAvailable} onChange={e=>setServantQuarterAvailable(e.target.value)} className="w-full bg-white border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623]">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                {servantQuarterAvailable === "Yes" && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Servant Quarter Location</label>
                    <input type="text" value={servantQuarterLocation} onChange={e=>setServantQuarterLocation(e.target.value)} placeholder="e.g. Ground Floor, Terrace" className="w-full bg-white border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] text-gray-800"/>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">PMAY Category</label>
                  <select value={pmayCategory} onChange={e=>setPmayCategory(e.target.value)} className="w-full bg-white border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623]">
                    <option value="Applicable">Applicable</option>
                    <option value="Not Applicable">Not Applicable</option>
                    <option value="HIG">HIG (Higher Income Group) </option>
                    <option value="EWS">EWS (Economically Weaker Section)</option>
                    <option value="LIG">LIG (Low Income Group)</option>
                    <option value="MIG-I">MIG-I (Middle Income Group I)</option>
                    <option value="MIG-II">MIG-II (Middle Income Group II)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Listing Status <span className="text-red-500">*</span></label>
                  <select value={isActive} onChange={e=>setIsActive(e.target.value)} className="w-full bg-white border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] font-semibold text-gray-800">
                    <option value="Yes">Active (Show on Site)</option>
                    <option value="No">Inactive (Hide / Saved draft)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ROW 3: SBUA, BUA, Carpet Area */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Super Built-Up Area <span className="text-red-500">*</span></label>
                <div className="flex border border-gray-250 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#5E6623]">
                  <input 
                    type="number" 
                    placeholder="e.g. 1200" 
                    required 
                    value={sbuaSize}
                    onChange={e => setSbuaSize(e.target.value)}
                    className="flex-1 bg-gray-50/30 px-4 py-2.5 text-sm focus:outline-none text-gray-800"
                  />
                  <span className="bg-white border-l border-gray-200 px-3 text-xs text-gray-500 font-semibold flex items-center">{areaUnit}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Built-Up Area (BUA)</label>
                <div className="flex border border-gray-250 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#5E6623]">
                  <input 
                    type="number" 
                    placeholder="e.g. 1050" 
                    value={buaSize}
                    onChange={e => setBuaSize(e.target.value)}
                    className="flex-1 bg-gray-50/30 px-4 py-2.5 text-sm focus:outline-none text-gray-800"
                  />
                  <span className="bg-white border-l border-gray-200 px-3 text-xs text-gray-500 font-semibold flex items-center">{areaUnit}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Carpet Area</label>
                <div className="flex border border-gray-250 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#5E6623]">
                  <input 
                    type="number" 
                    placeholder="e.g. 850" 
                    value={carpetSize}
                    onChange={e => setCarpetSize(e.target.value)}
                    className="flex-1 bg-gray-50/30 px-4 py-2.5 text-sm focus:outline-none text-gray-800"
                  />
                  <select 
                    value={areaUnit}
                    onChange={e => setAreaUnit(e.target.value)}
                    className="bg-white border-l border-gray-200 px-3 text-xs text-gray-500 font-semibold focus:outline-none"
                  >
                    <option value="sq.ft">sq.ft</option>
                    <option value="sq.yard">sq.yard</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ROW 3b: Furnishing & Possession */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Furnishing <span className="text-red-500">*</span></label>
                <select 
                  value={furnishing}
                  onChange={e => setFurnishing(e.target.value)}
                  className="w-full bg-white border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] transition text-gray-700 font-medium"
                >
                  <option value="Unfurnished">Unfurnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Fully Furnished">Fully Furnished</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Possession <span className="text-red-500">*</span></label>
                <select 
                  value={possession}
                  onChange={e => setPossession(e.target.value)}
                  className="w-full bg-white border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] transition text-gray-700 font-medium"
                >
                  <option value="Ready to Move">Ready to Move</option>
                  <option value="Under Construction">Under Construction</option>
                </select>
              </div>
            </div>

            {/* ROW 4: Bedrooms & Bathrooms & Balconies */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Bedrooms <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  placeholder="e.g. 3" 
                  required
                  value={bedrooms}
                  onChange={e => setBedrooms(e.target.value)}
                  className="w-full bg-gray-50/30 border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] transition text-gray-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Bathrooms <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  placeholder="e.g. 2" 
                  required
                  value={bathrooms}
                  onChange={e => setBathrooms(e.target.value)}
                  className="w-full bg-gray-50/30 border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] transition text-gray-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Balconies</label>
                <input 
                  type="number" 
                  placeholder="e.g. 1" 
                  required
                  value={balconies}
                  onChange={e => setBalconies(e.target.value)}
                  className="w-full bg-gray-50/30 border border-gray-250 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] transition text-gray-800"
                />
              </div>
            </div>

            {/* ROW 5: Expected Price & Negotiable */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Expected Price <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-sm text-gray-500 font-semibold select-none">₹</span>
                  <input 
                    type="number" 
                    placeholder="e.g. 8500000" 
                    required
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="w-full bg-gray-50/30 border border-gray-250 pl-8 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] transition text-gray-800 font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Price Negotiable</label>
                <div className="flex items-center space-x-6 py-2.5">
                  <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer font-medium">
                    <input 
                      type="radio" 
                      name="negotiable" 
                      value="Yes"
                      checked={negotiable === "Yes"}
                      onChange={e => setNegotiable(e.target.value)}
                      className="text-[#5E6623] focus:ring-[#5E6623] w-4 h-4" 
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer font-medium">
                    <input 
                      type="radio" 
                      name="negotiable" 
                      value="No"
                      checked={negotiable === "No"}
                      onChange={e => setNegotiable(e.target.value)}
                      className="text-[#5E6623] focus:ring-[#5E6623] w-4 h-4" 
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
            </div>

            {/* ROW 6: File Upload Dropzone (Left) & Amenities Checkboxes (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upload Dropzone */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Upload Property Images & Videos</label>
                <p className="text-[10px] text-gray-400 font-semibold mb-1">Select multiple photos & property walk-through videos</p>
                <div 
                  onClick={() => fileInputRef.current.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-gray-250 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50/20 cursor-pointer hover:bg-gray-50/50 transition h-48"
                >
                  <span className="material-symbols-outlined text-4xl text-[#5E6623] mb-3">cloud_upload</span>
                  <span className="text-xs font-bold text-gray-800">Click to select multiple images & videos</span>
                  <span className="text-[10px] text-gray-400 mt-1 font-semibold">Images (JPG, PNG) & Videos (MP4, WEBM, MOV)</span>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*,video/*" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden" 
                  />
                </div>
                
                {/* Media Previews Grid */}
                {(existingImages.length > 0 || files.length > 0) && (
                  <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {/* Existing Images / Videos */}
                    {existingImages.map((mediaUrl, idx) => {
                      const isVid = isVideoFile(mediaUrl);
                      const fullUrl = `http://localhost:5000/${mediaUrl.replace(/\\/g, '/')}`;
                      return (
                        <div key={`exist-${idx}`} className="relative group w-full aspect-square bg-gray-900 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                          {isVid ? (
                            <video src={fullUrl} className="w-full h-full object-cover" muted />
                          ) : (
                            <img src={fullUrl} alt="Existing media" className="w-full h-full object-cover" />
                          )}
                          {isVid && (
                            <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[10px]">videocam</span> Video
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => setExistingImages(existingImages.filter((_, i) => i !== idx))}
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-red-600 flex items-center justify-center text-white transition cursor-pointer z-10"
                            title="Remove Media"
                          >
                            <span className="material-symbols-outlined text-xs font-bold">close</span>
                          </button>
                        </div>
                      );
                    })}
                    
                    {/* Newly Selected Local Media */}
                    {files.map((file, idx) => {
                      const isVid = isVideoFile(file.type) || isVideoFile(file.name);
                      const objectUrl = URL.createObjectURL(file);
                      return (
                        <div key={`new-${idx}`} className="relative group w-full aspect-square bg-gray-900 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                          {isVid ? (
                            <video src={objectUrl} className="w-full h-full object-cover" muted />
                          ) : (
                            <img src={objectUrl} alt="Local preview" className="w-full h-full object-cover" />
                          )}
                          {isVid && (
                            <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[10px]">videocam</span> Video
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-red-600 flex items-center justify-center text-white transition cursor-pointer z-10"
                            title="Remove Media"
                          >
                            <span className="material-symbols-outlined text-xs font-bold">close</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Amenities Grid */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Amenities / Highlights</label>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {Object.keys(amenities).map(key => {
                    const label = key === "water24x7" ? "Water 24x7" 
                                : key === "gatedCommunity" ? "Gated Community"
                                : key === "powerBackup" ? "Power Backup"
                                : key === "clubHouse" ? "Club House"
                                : key.charAt(0).toUpperCase() + key.slice(1);
                    return (
                      <label key={key} className="flex items-center space-x-2 text-xs font-semibold text-gray-600 cursor-pointer hover:text-gray-800 select-none">
                        <input 
                          type="checkbox" 
                          checked={amenities[key]}
                          onChange={e => setAmenities({...amenities, [key]: e.target.checked})}
                          className="rounded text-[#5E6623] focus:ring-[#5E6623] w-4 h-4 border-gray-300" 
                        />
                        <span>{label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ROW 7: Additional Notes (Optional) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Additional Notes (Optional)</label>
              <textarea 
                placeholder="Any additional information about the property..." 
                value={additionalNotes}
                onChange={e => setAdditionalNotes(e.target.value)}
                className="w-full h-24 bg-gray-50/30 border border-gray-250 p-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5E6623] transition text-gray-800"
              />
            </div>

            {/* ROW 8: Website Display Sections */}
            <div className="border-t border-gray-100 pt-6 space-y-3">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Website Display Sections</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.keys(displaySections).map(key => {
                  const label = key === "isFeatured" ? "Featured Collections"
                              : key === "isFinest" ? "Finest Residences"
                              : key === "isProjectOfTheWeek" ? "Project Of the Week"
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

            {/* ROW 9: Publish Listing Button */}
            <button 
              type="submit" 
              className="w-full bg-[#5E6623] text-white py-3 rounded-lg font-bold hover:bg-[#4E541E] transition shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">send</span>
              <span>{editId ? "Update Resale Listing" : "Publish Resale Listing"}</span>
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

export default function AddSoloProperty() {
  return (
    <Suspense fallback={<div className="text-center py-20 bg-[#FAF8F2] min-h-screen">Loading form...</div>}>
      <AddSoloPropertyForm />
    </Suspense>
  );
}

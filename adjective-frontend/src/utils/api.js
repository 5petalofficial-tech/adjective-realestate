const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_URL = rawApiUrl.endsWith("/api") || rawApiUrl.endsWith("/api/")
  ? rawApiUrl
  : `${rawApiUrl.endsWith("/") ? rawApiUrl.slice(0, -1) : rawApiUrl}/api`;

  //apirequest starts here

export async function apiRequest(endpoint, options = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  try {
    const baseUrl = API_URL.endsWith("/")
      ? API_URL.slice(0, -1)
      : API_URL;

    const cleanEndpoint = endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`;

    const response = await fetch(`${baseUrl}${cleanEndpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (err) {
    if (err.name === "TypeError" && err.message === "Failed to fetch") {
      console.warn(
        `[API Server Offline] Backend is unreachable at ${API_URL}${endpoint}`
      );
    } else {
      console.warn(`[API Request Error] ${endpoint}:`, err.message);
    }

    throw err;
  }
}

//apirequest ends here


export function getImageUrl(img) {
  if (!img) return "https://placehold.co/800x500/5E6623/white?text=No+Image";

  let pathStr = "";

  if (typeof img === "string") {
    pathStr = img;
  } else if (typeof img === "object" && img !== null) {
    pathStr = img.url || img.path || img.filename || "";
  }

  if (!pathStr || typeof pathStr !== "string") {
    return "https://placehold.co/800x500/5E6623/white?text=No+Image";
  }

  const cleanPath = pathStr.replace(/\\/g, "/").trim();

  if (
    cleanPath.startsWith("http://") ||
    cleanPath.startsWith("https://")
  ) {
    return cleanPath;
  }

  const uploadsIdx = cleanPath.toLowerCase().indexOf("uploads/");

  if (uploadsIdx !== -1) {
    const relativeUpload = cleanPath.slice(uploadsIdx);
    const backendHost =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const baseHost = backendHost.replace(/\/api\/?$/, "").replace(/\/$/, "");
    return `${baseHost}/${relativeUpload}`;
  }

  // Local frontend static assets (e.g. "/Projects/One10.webp")
  return cleanPath.startsWith("/") ? cleanPath : "/" + cleanPath;
}

const formatPrice = (num) => {
  const price = Number(num);

  if (!price || Number.isNaN(price)) {
    return "Price on Request";
  }

  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)}Cr`;
  }

  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)}Lacs`;
  }

  return `₹${price}`;
};

const normalizeCoordinate = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const coordinate = Number(value);

  return Number.isFinite(coordinate) ? coordinate : null;
};

const buildAddress = (...parts) => {
  return parts
    .filter(
      (part) =>
        part !== undefined &&
        part !== null &&
        String(part).trim() !== ""
    )
    .map((part) => String(part).trim())
    .join(", ");
};


//start is here

export async function fetchAndNormalizeProperties() {
  try {
    const [soloRes, dealerRes] = await Promise.all([
      apiRequest("/solo/all").catch(() => ({
        properties: [],
      })),

      apiRequest("/dealer/all").catch(() => ({
        data: [],
      })),
    ]);

    const solos = (soloRes.properties || []).filter(
      (property) =>
        property.isActive !== false &&
        (property.status === "Available" ||
          property.isVerifiedByAdmin === true ||
          (property.status !== "On Hold" &&
            property.isVerifiedByAdmin !== false))
    );

    const dealers = (dealerRes.data || []).filter(
      (property) => property.isActive !== false
    );
    console.log("Dealer API Response:", dealerRes);
    console.log("Dealer Properties:", dealers);

    const normalizedSolos = solos.map((property) => {
      const mainImg =
        property.images && property.images.length > 0
          ? property.images[0]
          : property.image;

      const latitude = normalizeCoordinate(property.latitude);
      const longitude = normalizeCoordinate(property.longitude);

      return {
        id: property._id,
        isSolo: true,

        name: property.name,

        location:
          property.area ||
          property.address ||
          "Kolkata",

        fullAddress:
          property.address ||
          buildAddress(
            property.area,
            property.city,
            property.state,
            property.pincode
          ),

        latitude,
        longitude,
        locationArea: property.locationArea || "",

        hasMapLocation:
          latitude !== null &&
          longitude !== null,

        image: getImageUrl(mainImg),

        images:
          property.images && property.images.length > 0
            ? property.images.map(getImageUrl)
            : [getImageUrl(mainImg)],

        price: formatPrice(property.price),
        rawPrice: property.price,

        beds: property.noOfBedrooms || 2,
        baths: property.noOfToilets || 2,

        sqft: `${property.superBuiltUpAreaSize || 1200
          } sqft`,

        reraId: property.isRERAApproved
          ? "Verified Resale"
          : "",

        highlights: [
          `Vastu: ${property.vastu || "Standard"}`,
          `Facing: ${property.facing || "East"}`,
          `Age: ${property.ageOfProperty || 0
          } years old`,
          `Furnishing: ${property.furnishingStatus || "Unfurnished"
          }`,
          `Parking: ${property.parkingType || "Available"
          }`,
        ],

        isFeatured: property.isFeatured,
        isFinest: property.isFinest,
        isProjectOfTheMonth:
          property.isProjectOfTheMonth,

        isVastuCompliant:
          property.vastu === "Vastu Compliant" ||
          property.isVastuCompliant,

        isRERAApproved:
          property.isRERAApproved,

        isPMAYApproved:
          property.isPMAYApproved,

        description:
          property.overview ||
          property.description,
      };
    });

    const normalizedDealers = dealers.map((property) => {
      const mainImg =
        property.media?.bannerImage ||
        property.bannerImage ||
        (
          property.media?.projectGallery &&
          property.media.projectGallery[0]
        ) ||
        property.image;

      const galleryImgs =
        property.media?.projectGallery &&
          property.media.projectGallery.length > 0
          ? property.media.projectGallery.map(getImageUrl)
          : property.images &&
            property.images.length > 0
            ? property.images.map(getImageUrl)
            : [getImageUrl(mainImg)];

      const latitude = normalizeCoordinate(
        property.location?.latitude
      );

      const longitude = normalizeCoordinate(
        property.location?.longitude
      );

      return {
        id: property._id,
        isSolo: false,

        name: property.projectName,

        location:
          property.location?.locality ||
          property.location?.city ||
          property.Area ||
          "Kolkata",

        fullAddress: buildAddress(
          property.location?.addressLine,
          property.location?.locality,
          property.location?.city,
          property.location?.state,
          property.location?.pincode
        ),

        latitude,
        longitude,
        locationArea: property.locationArea || "",

        hasMapLocation:
          latitude !== null &&
          longitude !== null,

        image: getImageUrl(mainImg),
        images: galleryImgs,

        price: property.priceRange?.minPrice
          ? property.priceRange?.maxPrice
            ? `${formatPrice(
              property.priceRange.minPrice
            )} - ${formatPrice(
              property.priceRange.maxPrice
            )}`
            : formatPrice(
              property.priceRange.minPrice
            )
          : "Price on Request",

        rawPrice:
          property.priceRange?.minPrice || 0,

        beds:
          property.configurations?.[0]?.bhkType ||
          "2BHK",

        baths:
          property.configurations?.[0]
            ?.noOfBathrooms ||
          property.configurations?.[0]?.bathrooms ||
          2,

        sqft:
          property.configurations?.[0]
            ?.superBuiltUpAreaSize
            ? `${property.configurations[0].superBuiltUpAreaSize} sqft`
            : `${property.Area || 1200} sqft`,

        reraId: property.reraNumber,
        reraNumber: property.reraNumber,

        highlights:
          property.amenities &&
            property.amenities.length > 0
            ? property.amenities.slice(0, 4)
            : [
              "24x7 Security",
              "Gated Community",
              "Power Backup",
            ],

        isFeatured: property.isFeatured,
        isFinest: property.isFinest,
        isProjectOfTheMonth:
          property.isProjectOfTheMonth,

        isVastuCompliant:
          property.isVastuCompliant,

        isRERAApproved:
          property.isRERAApproved ||
          Boolean(property.reraNumber),

        isPMAYApproved:
          property.PMAY_Approved ||
          property.isPMAYApproved,

        description: property.description,
        brochureUrl: property.media?.brochureUrl ? getImageUrl(property.media.brochureUrl): null,
      };
    });

    return [
      ...normalizedSolos,
      ...normalizedDealers,
    ];
  } catch (err) {
    console.error(
      "Error fetching/normalizing properties:",
      err
    );

    return [];
  }
}

//break is here


export async function fetchPropertyById(id) {
  if (!id) return null;

  try {
    // Hit both endpoints in parallel — whichever owns this _id will return data
    const [soloResult, dealerResult] = await Promise.allSettled([
      apiRequest(`/solo/${id}`),
      apiRequest(`/dealer/${id}`),
    ]);

    // --- Try Solo ---
    console.log("DEBUG: fetchPropertyById API results:", { soloResult, dealerResult });
    if (soloResult.status === "fulfilled") {
      const property = soloResult.value?.property;
      if (property) {
        const mainImg =
          property.images && property.images.length > 0
            ? property.images[0]
            : property.image;
        const latitude = normalizeCoordinate(property.latitude);
        const longitude = normalizeCoordinate(property.longitude);
        return {
          id: property._id,
          isSolo: true,
          name: property.name,
          location: property.area || property.address || "Kolkata",
          fullAddress:
            property.address ||
            buildAddress(property.area, property.city, property.state, property.pincode),
          latitude,
          longitude,
          hasMapLocation: latitude !== null && longitude !== null,
          image: getImageUrl(mainImg),
          images:
            property.images && property.images.length > 0
              ? property.images.map(getImageUrl)
              : [getImageUrl(mainImg)],
          price: formatPrice(property.price),
          rawPrice: property.price,
          beds: property.noOfBedrooms || 2,
          baths: property.noOfToilets || 2,
          sqft: `${property.superBuiltUpAreaSize || 1200} sqft`,
          reraId: property.isRERAApproved ? "Verified Resale" : "",
          highlights: [
            `Vastu: ${property.vastu || "Standard"}`,
            `Facing: ${property.facing || "East"}`,
            `Age: ${property.ageOfProperty || 0} years old`,
            `Furnishing: ${property.furnishingStatus || "Unfurnished"}`,
            `Parking: ${property.parkingType || "Available"}`,
          ],
          isFeatured: property.isFeatured,
          isFinest: property.isFinest,
          isProjectOfTheMonth: property.isProjectOfTheMonth,
          isVastuCompliant:
            property.vastu === "Vastu Compliant" || property.isVastuCompliant,
          isRERAApproved: property.isRERAApproved,
          isPMAYApproved: property.isPMAYApproved,
          description: property.overview || property.description,

          // ── New Resale Fields ──
          propertyType: property.propertyType,
          floor: property.floor,
          balconiesDetails: property.balconiesDetails,
          buildingConfiguration: property.buildingConfiguration,
          carParkingDetails: property.carParkingDetails,
          handoverDate: property.handoverDate,
          loanPossible: property.loanPossible,
          numberOfTowers: property.numberOfTowers,
          roadWidth: property.roadWidth,
          propertyTitle: property.propertyTitle,
          liabilities: property.liabilities,
          taxMutation: property.taxMutation,
          leaseOrFreehold: property.leaseOrFreehold,
          sitePlanUrl: property.sitePlanUrl ? getImageUrl(property.sitePlanUrl) : null,
          completionCertificateUrl: property.completionCertificateUrl ? getImageUrl(property.completionCertificateUrl) : null,
          buildingPlanUrl: property.buildingPlanUrl ? getImageUrl(property.buildingPlanUrl) : null,
          isNegotiable: property.isNegotiable,
          landArea: property.landArea,
          superBuiltUpAreaSize: property.superBuiltUpAreaSize,
          builtUpAreaSize: property.builtUpAreaSize,
          carpetAreaSize: property.carpetAreaSize,
          noOfBalconies: property.noOfBalconies,
          furnishingStatus: property.furnishingStatus,
          parkingType: property.parkingType,
          facing: property.facing,
          ageOfProperty: property.ageOfProperty,
          // Additional Detail Fields
          projectHeight: property.projectHeight,
          liftDetails: property.liftDetails,
          servantQuarter: property.servantQuarter,
          constructionDetails: property.constructionDetails,
          pmayCategory: property.pmayCategory,
        };
      }
    }

    // --- Try Dealer ---
    if (dealerResult.status === "fulfilled") {
      const property = dealerResult.value?.data;
      if (property) {
        const mainImg =
          property.media?.bannerImage ||
          property.bannerImage ||
          (property.media?.projectGallery && property.media.projectGallery[0]) ||
          property.image;
        const galleryImgs =
          property.media?.projectGallery && property.media.projectGallery.length > 0
            ? property.media.projectGallery.map(getImageUrl)
            : property.images && property.images.length > 0
              ? property.images.map(getImageUrl)
              : [getImageUrl(mainImg)];
        const latitude = normalizeCoordinate(property.location?.latitude);
        const longitude = normalizeCoordinate(property.location?.longitude);
        return {
          id: property._id,
          isSolo: false,
          name: property.projectName,
          location:
            property.location?.locality ||
            property.location?.city ||
            property.Area ||
            "Kolkata",
          fullAddress: buildAddress(
            property.location?.addressLine,
            property.location?.locality,
            property.location?.city,
            property.location?.state,
            property.location?.pincode
          ),
          latitude,
          longitude,
          hasMapLocation: latitude !== null && longitude !== null,
          image: getImageUrl(mainImg),
          images: galleryImgs,
          price: property.priceRange?.minPrice
            ? property.priceRange?.maxPrice
              ? `${formatPrice(property.priceRange.minPrice)} - ${formatPrice(property.priceRange.maxPrice)}`
              : formatPrice(property.priceRange.minPrice)
            : "Price on Request",
          rawPrice: property.priceRange?.minPrice || 0,
          beds: property.configurations?.[0]?.bhkType || "2BHK",
          baths:
            property.configurations?.[0]?.noOfBathrooms ||
            property.configurations?.[0]?.bathrooms ||
            2,
          sqft: property.configurations?.[0]?.superBuiltUpAreaSize
            ? `${property.configurations[0].superBuiltUpAreaSize} sqft`
            : `${property.Area || 1200} sqft`,
          reraId: property.reraNumber,
          highlights:
            property.amenities && property.amenities.length > 0
              ? property.amenities.slice(0, 4)
              : ["24x7 Security", "Gated Community", "Power Backup"],
          isFeatured: property.isFeatured,
          isFinest: property.isFinest,
          isProjectOfTheMonth: property.isProjectOfTheMonth,
          isVastuCompliant: property.isVastuCompliant,
          isRERAApproved: property.isRERAApproved || Boolean(property.reraNumber),
          isPMAYApproved: property.PMAY_Approved || property.isPMAYApproved,
          description: property.description,

          // ── New Dealer Project Fields ──
          possessionTime: property.possessionTime,
          startingTiming: property.startingTiming,
          specifications: property.specifications,
          unitPlans: property.unitPlans,
          neighborhoodSurroundings: property.neighborhoodSurroundings,
          customerReviews: property.customerReviews,
          faq: property.faq,
          walkthroughUrl: property.walkthroughUrl,
          paymentSchedule: property.paymentSchedule,
          homeLoanOffers: property.homeLoanOffers,
          growthInsights: property.growthInsights,
          floorPlanUrl: property.media?.floorPlanUrl ? getImageUrl(property.media.floorPlanUrl) : null,
          brochureUrl: property.media?.brochureUrl ? getImageUrl(property.media.brochureUrl) : null,
          constructionStatus: property.constructionStatus,
          configurations: property.configurations,
          towers: property.towers,
          // Additional Detail Fields
          projectHeight: property.projectHeight,
          liftDetails: property.liftDetails,
          servantQuarter: property.servantQuarter,
          constructionDetails: property.constructionDetails,
          pmayCategory: property.pmayCategory,
        };
      }
    }

    console.warn(`[fetchPropertyById] No property found for id: ${id}`);
    return null;
  } catch (err) {
    console.error("Error fetching property by ID:", err);
    return null;
  }
}

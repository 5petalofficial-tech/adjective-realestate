// // "use client";

// // import { useState, useEffect } from "react";
// // import dynamic from "next/dynamic";
// // import AreaFilter from "@/components/map/AreaFilter";
// // import { fetchAndNormalizeProperties } from "@/utils/api";

// // const ExploreMap = dynamic(() => import("@/components/map/ExploreMap"), {
// //   ssr: false,
// // });

// // export default function ExploreLocation() {
// //   const [selectedArea, setSelectedArea] = useState("Action Area I");
// //   const [properties, setProperties] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     async function loadProperties() {
// //       try {
// //         const allProperties = await fetchAndNormalizeProperties();
// //         // Skip properties with invalid or missing coordinates
// //         const validProperties = allProperties.filter(
// //           (p) =>
// //             p.latitude !== null &&
// //             p.longitude !== null &&
// //             Number.isFinite(p.latitude) &&
// //             Number.isFinite(p.longitude)
// //         );
// //         setProperties(validProperties);
// //       } catch (err) {
// //         console.error("Error fetching properties for map explore:", err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     }

// //     loadProperties();
// //   }, []);

// //   return (
// //     <section className="py-20 bg-[#FAF8F4]">
// //       <div className="max-w-7xl mx-auto px-4">
// //         <h2 className="text-4xl font-bold text-center text-[#1B1B1D]">
// //           Know the Area. Choose with Confidence.
// //         </h2>

// //         <p className="text-center text-gray-500 mt-3 mb-10 max-w-2xl mx-auto">
// //           Explore properties across New Town & Rajarhat and understand different locations before making your property decision.
// //         </p>

// //         <AreaFilter
// //           selectedArea={selectedArea}
// //           setSelectedArea={setSelectedArea}
// //         />

// //         <div className="mt-8">
// //           {loading ? (
// //             <div className="h-[600px] w-full bg-white rounded-3xl border border-gray-150 flex flex-col items-center justify-center space-y-4 shadow-[0_10px_35px_rgba(0,0,0,0.02)]">
// //               <div className="relative w-12 h-12">
// //                 <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
// //                 <div className="absolute inset-0 rounded-full border-4 border-[#5E6623] border-t-transparent animate-spin"></div>
// //               </div>
// //               <p className="text-sm font-semibold text-gray-500 animate-pulse">
// //                 Loading live properties and interactive map...
// //               </p>
// //             </div>
// //           ) : (
// //             <ExploreMap selectedArea={selectedArea} properties={properties} />
// //           )}
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }

// // "use client";

// // import { useState, useEffect, useMemo } from "react";
// // import dynamic from "next/dynamic";
// // import AreaFilter from "@/components/map/AreaFilter";
// // import { fetchAndNormalizeProperties } from "@/utils/api";

// // const ExploreMap = dynamic(
// //   () => import("@/components/map/ExploreMap"),
// //   {
// //     ssr: false,
// //     loading: () => (
// //       <div className="w-full h-[600px] rounded-3xl bg-white border border-gray-200 flex items-center justify-center">
// //         <p className="text-sm text-gray-500">
// //           Loading interactive map...
// //         </p>
// //       </div>
// //     ),
// //   }
// // );

// // export default function ExploreLocation() {
// //   const [selectedArea, setSelectedArea] = useState("Action Area I");
// //   const [properties, setProperties] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");

// //   useEffect(() => {
// //     async function loadProperties() {
// //       try {
// //         setLoading(true);
// //         setError("");

// //         const allProperties = await fetchAndNormalizeProperties();

// //         console.log("All properties from API:", allProperties);

// //         const validProperties = allProperties
// //           .map((property) => ({
// //             ...property,

// //             // Convert string coordinates into numbers
// //             latitude: Number(property.latitude),
// //             longitude: Number(property.longitude),
// //           }))
// //           .filter((property) => {
// //             const validLatitude =
// //               Number.isFinite(property.latitude) &&
// //               property.latitude >= -90 &&
// //               property.latitude <= 90;

// //             const validLongitude =
// //               Number.isFinite(property.longitude) &&
// //               property.longitude >= -180 &&
// //               property.longitude <= 180;

// //             return validLatitude && validLongitude;
// //           });

// //         console.log("Valid properties for map:", validProperties);

// //         setProperties(validProperties);
// //       } catch (err) {
// //         console.error(
// //           "Error fetching properties for map explore:",
// //           err
// //         );

// //         setError(
// //           "Unable to load properties. Please try again later."
// //         );
// //       } finally {
// //         setLoading(false);
// //       }
// //     }

// //     loadProperties();
// //   }, []);

// //   /*
// //     Filter properties according to selected area.

// //     This assumes your property object contains:
// //     property.location

// //     If your API uses another field such as:
// //     property.area
// //     property.city
// //     property.address

// //     update the matching logic here.
// //   */
// //   const filteredProperties = useMemo(() => {
// //     if (!selectedArea) {
// //       return properties;
// //     }

// //     const areaName = selectedArea.trim().toLowerCase();

// //     return properties.filter((property) => {
// //     const possibleAreas = [
// //       property.locationArea,
// //       property.area,
// //       property.location,
// //       property.address,
// //       property.city,
// //     ]
// //       .filter(Boolean)
// //       .map((value) => String(value).trim().toLowerCase());

// //     return possibleAreas.some((value) =>
// //       value.includes(areaName)
// //     );
// //   });
// // }, [properties, selectedArea]);


// //   //   const filtered = properties.filter((property) => {
// //   //     const propertyLocation = String(
// //   //       property.location || ""
// //   //     ).toLowerCase();

// //   //     const areaName = String(
// //   //       selectedArea || ""
// //   //     ).toLowerCase();

// //   //     return propertyLocation.includes(areaName);
// //   //   });

// //   //   console.log(
// //   //     `Properties for ${selectedArea}:`,
// //   //     filtered
// //   //   );

// //   //   return filtered;
// //   // }, [properties, selectedArea]);

// //   return (
// //     <section className="w-full bg-[#FAF8F4] py-16 sm:py-20">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// //         {/* Heading */}
// //         <div className="text-center mb-8 sm:mb-10">
// //           <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1B1B1D]">
// //             Know the Area. Choose with Confidence.
// //           </h2>

// //           <p className="text-center text-gray-500 mt-4 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
// //             Explore properties across New Town & Rajarhat and
// //             understand different locations before making your
// //             property decision.
// //           </p>
// //         </div>

// //         {/* Area Buttons */}
// //         <AreaFilter
// //           selectedArea={selectedArea}
// //           setSelectedArea={setSelectedArea}
// //         />

// //         {/* Map Area */}
// //         <div className="mt-8 w-full">

// //           {loading && (
// //             <div className="h-[420px] sm:h-[520px] lg:h-[600px] w-full bg-white rounded-3xl border border-gray-200 flex flex-col items-center justify-center gap-4 shadow-[0_10px_35px_rgba(0,0,0,0.03)]">

// //               <div className="relative w-12 h-12">
// //                 <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>

// //                 <div className="absolute inset-0 rounded-full border-4 border-[#5E6623] border-t-transparent animate-spin"></div>
// //               </div>

// //               <p className="text-sm font-semibold text-gray-500 animate-pulse text-center px-4">
// //                 Loading live properties and interactive map...
// //               </p>

// //             </div>
// //           )}

// //           {!loading && error && (
// //             <div className="h-[420px] sm:h-[520px] lg:h-[600px] w-full bg-white rounded-3xl border border-red-100 flex items-center justify-center px-6 text-center">
// //               <div>
// //                 <p className="text-base font-semibold text-red-600">
// //                   {error}
// //                 </p>

// //                 <p className="text-sm text-gray-500 mt-2">
// //                   Check your backend connection and try again.
// //                 </p>
// //               </div>
// //             </div>
// //           )}

// //           {!loading && !error && (
// //             <ExploreMap
// //               selectedArea={selectedArea}
// //               properties={filteredProperties}
// //             />
// //           )}

// //         </div>
// //       </div>
// //     </section>
// //   );
// // }
// "use client";

// import { useState, useEffect, useMemo } from "react";
// import dynamic from "next/dynamic";
// import AreaFilter from "@/components/map/AreaFilter";
// import { fetchAndNormalizeProperties } from "@/utils/api";
// import { AREAS } from "@/components/map/areaConfig";

// const ExploreMap = dynamic(
//   () => import("@/components/map/ExploreMap"),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="h-[600px] w-full rounded-3xl bg-white border border-gray-200 flex items-center justify-center">
//         <p className="text-sm text-gray-500">
//           Loading interactive map...
//         </p>
//       </div>
//     ),
//   }
// );

// /* =====================================================
//    CHECK WHETHER A COORDINATE IS INSIDE A POLYGON
// ===================================================== */

// function isPointInsidePolygon(latitude, longitude, polygon = []) {
//   if (!polygon || polygon.length < 3) {
//     return false;
//   }

//   let inside = false;

//   for (
//     let i = 0, j = polygon.length - 1;
//     i < polygon.length;
//     j = i++
//   ) {
//     const latitudeA = polygon[i][0];
//     const longitudeA = polygon[i][1];

//     const latitudeB = polygon[j][0];
//     const longitudeB = polygon[j][1];

//     const intersects =
//       longitudeA > longitude !== longitudeB > longitude &&
//       latitude <
//         ((latitudeB - latitudeA) *
//           (longitude - longitudeA)) /
//           (longitudeB - longitudeA) +
//           latitudeA;

//     if (intersects) {
//       inside = !inside;
//     }
//   }

//   return inside;
// }

// /* =====================================================
//    MAIN COMPONENT
// ===================================================== */

// export default function ExploreLocation() {
//   const [selectedArea, setSelectedArea] = useState("Action Area I");
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     async function loadProperties() {
//       try {
//         setLoading(true);
//         setError("");

//         const allProperties = await fetchAndNormalizeProperties();

//         console.log("All properties from API:", allProperties);

//         const validProperties = allProperties
//           .map((property) => ({
//             ...property,

//             latitude: Number(
//               property.latitude ??
//                 property.lat ??
//                 property.locationLatitude
//             ),

//             longitude: Number(
//               property.longitude ??
//                 property.lng ??
//                 property.lon ??
//                 property.locationLongitude
//             ),
//           }))
//           .filter((property) => {
//             return (
//               Number.isFinite(property.latitude) &&
//               Number.isFinite(property.longitude) &&
//               property.latitude >= -90 &&
//               property.latitude <= 90 &&
//               property.longitude >= -180 &&
//               property.longitude <= 180
//             );
//           });

//         console.log(
//           "Valid properties with coordinates:",
//           validProperties
//         );

//         setProperties(validProperties);
//       } catch (err) {
//         console.error("Error loading map properties:", err);
//         setError("Unable to load properties.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadProperties();
//   }, []);

//   /* =====================================================
//      FILTER BY AREA NAME OR POLYGON
//   ===================================================== */

//   const filteredProperties = useMemo(() => {
//     const selectedAreaConfig = AREAS[selectedArea];

//     if (!selectedAreaConfig) {
//       return properties;
//     }

//     const areaName = selectedArea.trim().toLowerCase();

//     const filtered = properties.filter((property) => {
//       const textValues = [
//         property.locationArea,
//         property.area,
//         property.location,
//         property.address,
//         property.city,
//         property.projectLocation,
//         property.propertyLocation,
//       ]
//         .filter(Boolean)
//         .map((value) => String(value).toLowerCase());

//       const matchesAreaName = textValues.some((value) =>
//         value.includes(areaName)
//       );

//       const matchesPolygon = isPointInsidePolygon(
//         property.latitude,
//         property.longitude,
//         selectedAreaConfig.polygon
//       );

//       return matchesAreaName || matchesPolygon;
//     });

//     console.log(
//       `Selected area: ${selectedArea}`,
//       filtered
//     );

//     return filtered;
//   }, [properties, selectedArea]);

//   return (
//     <section className="w-full bg-[#FAF8F4] py-16 sm:py-20">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

//         {/* Heading */}
//         <div className="text-center mb-8 sm:mb-10">
//           <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1B1B1D]">
//             Know the Area. Choose with Confidence.
//           </h2>

//           <p className="text-center text-gray-500 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
//             Explore properties across New Town & Rajarhat and
//             understand different locations before making your
//             property decision.
//           </p>
//         </div>

//         {/* Area Filter */}
//         <AreaFilter
//           selectedArea={selectedArea}
//           setSelectedArea={setSelectedArea}
//         />

//         {/* Map */}
//         <div className="mt-8">
//           {loading && (
//             <div className="h-[420px] sm:h-[520px] lg:h-[600px] w-full bg-white rounded-3xl border border-gray-200 flex flex-col items-center justify-center gap-4">
//               <div className="relative w-12 h-12">
//                 <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>

//                 <div className="absolute inset-0 rounded-full border-4 border-[#5E6623] border-t-transparent animate-spin"></div>
//               </div>

//               <p className="text-sm font-semibold text-gray-500">
//                 Loading live properties and interactive map...
//               </p>
//             </div>
//           )}

//           {!loading && error && (
//             <div className="h-[420px] sm:h-[520px] lg:h-[600px] w-full bg-white rounded-3xl flex items-center justify-center">
//               <p className="text-sm text-red-600">
//                 {error}
//               </p>
//             </div>
//           )}

//           {!loading && !error && (
//             <ExploreMap
//               selectedArea={selectedArea}
//               properties={filteredProperties}
//             />
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import AreaFilter from "@/components/map/AreaFilter";
import { fetchAndNormalizeProperties } from "@/utils/api";
import { Italianno } from "next/font/google";
import { Lora } from "next/font/google";

const lora = Lora({
  weight: ["400", "500"],
  subsets: ["latin"],
});

const italianno = Italianno({
  weight: "400",
  subsets: ["latin"],
});

const ExploreMap = dynamic(
  () => import("@/components/map/ExploreMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] w-full rounded-3xl bg-white border border-gray-200 flex items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading interactive map...
        </p>
      </div>
    ),
  }
);

/* =====================================================
   AREA ALIASES
===================================================== */

const AREA_ALIASES = {
  "Action Area I": [
    "action area i",
    "action area 1",
    "aa1",
    "new town action area i",
    "newtown action area i",
  ],

  "Action Area II": [
    "action area ii",
    "action area 2",
    "aa2",
    "new town action area ii",
    "newtown action area ii",
  ],

  "Action Area III": [
    "action area iii",
    "action area 3",
    "aa3",
    "new town action area iii",
    "newtown action area iii",
  ],

  Rajarhat: [
    "rajarhat",
    "rajarhat new town",
    "rajarhat, kolkata",
    "new town rajarhat",
  ],
};

/* =====================================================
   NORMALIZE TEXT
===================================================== */

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[,&.-]/g, " ")
    .replace(/\s+/g, " ");
}

/* =====================================================
   NORMALIZE COORDINATES
===================================================== */

function normalizeProperty(property) {
  return {
    ...property,

    id: property.id || property._id,

    latitude: Number(
      property.latitude ??
        property.lat ??
        property.locationLatitude
    ),

    longitude: Number(
      property.longitude ??
        property.lng ??
        property.lon ??
        property.locationLongitude
    ),
  };
}

/* =====================================================
   CHECK VALID COORDINATES
===================================================== */

function hasValidCoordinates(property) {
  return (
    Number.isFinite(property.latitude) &&
    Number.isFinite(property.longitude) &&
    property.latitude >= -90 &&
    property.latitude <= 90 &&
    property.longitude >= -180 &&
    property.longitude <= 180
  );
}

/* =====================================================
   CHECK SELECTED AREA
===================================================== */

function propertyBelongsToArea(property, selectedArea) {
  const aliases =
    AREA_ALIASES[selectedArea] || [
      normalizeText(selectedArea),
    ];

  const propertyValues = [
    property.locationArea,
    property.area,
    property.location,
    property.address,
    property.city,
    property.projectLocation,
    property.propertyLocation,
  ]
    .filter(Boolean)
    .map(normalizeText);

  return aliases.some((alias) => {
    const normalizedAlias = normalizeText(alias);

    return propertyValues.some((propertyValue) =>
      propertyValue.includes(normalizedAlias)
    );
  });
}

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function ExploreLocation() {
  const [selectedArea, setSelectedArea] = useState("Action Area I");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProperties() {
      try {
        setLoading(true);
        setError("");

        const allProperties =
          await fetchAndNormalizeProperties();

        console.log(
          "All properties received from API:",
          allProperties
        );

        const normalizedProperties = allProperties
          .map(normalizeProperty)
          .filter(hasValidCoordinates);

        console.log(
          "Properties with valid coordinates:",
          normalizedProperties
        );

        setProperties(normalizedProperties);
      } catch (err) {
        console.error(
          "Error fetching properties for map:",
          err
        );

        setError(
          "Unable to load properties. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProperties();
  }, []);

  /* =====================================================
     FILTER PROPERTIES BY SELECTED AREA
  ===================================================== */

  const filteredProperties = useMemo(() => {
    const result = properties.filter((property) =>
      propertyBelongsToArea(property, selectedArea)
    );

    console.log(
      `Properties found for ${selectedArea}:`,
      result
    );

    return result;
  }, [properties, selectedArea]);

  return (
<section className="w-full bg-[#FAF8F4] py-16 sm:py-20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    {/* Heading */}
    <div className="text-center mb-8 sm:mb-10">
      <h2
        className={`${italianno.className} text-center text-4xl sm:text-5xl lg:text-6xl tracking-wide text-[#2F7D32] [text-shadow:1px_0_0_#2F7D32,-1px_0_0_#2F7D32,0_1px_0_#2F7D32]`}
      >
        Know the Area. Choose with Confidence.
      </h2>

      <p
        className={`${lora.className} text-center text-[#5E6623] text-lg mt-4 max-w-2xl mx-auto leading-relaxed`}
      >
        Explore properties across New Town & Rajarhat and
        understand different locations before making your
        property decision.
      </p>
    </div>
        {/* Area Buttons */}
        <AreaFilter
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
        />

        {/* Debug information - remove later */}
        <div className="mt-5 text-center text-xs text-gray-500">
          Showing{" "}
          <span className="font-bold text-[#5E6623]">
            {filteredProperties.length}
          </span>{" "}
          properties in{" "}
          <span className="font-semibold">
            {selectedArea}
          </span>
        </div>

        {/* Map */}
        <div className="mt-6">
          {loading && (
            <div className="h-[420px] sm:h-[520px] lg:h-[600px] w-full rounded-3xl bg-white border border-gray-200 flex flex-col items-center justify-center gap-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100" />

                <div className="absolute inset-0 rounded-full border-4 border-[#5E6623] border-t-transparent animate-spin" />
              </div>

              <p className="text-sm font-semibold text-gray-500 text-center px-4">
                Loading live properties and interactive map...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="h-[420px] sm:h-[520px] lg:h-[600px] w-full rounded-3xl bg-white border border-red-100 flex items-center justify-center">
              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          )}

          {!loading && !error && (
            <ExploreMap
              selectedArea={selectedArea}
              properties={filteredProperties}
            />
          )}
        </div>
      </div>
    </section>
  );
}
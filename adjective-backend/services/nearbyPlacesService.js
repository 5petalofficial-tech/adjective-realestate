const axios = require("axios");
const { getRoute } = require("./routingService");

const OVERPASS_ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter"
];

const OVERPASS_HEADERS = {
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "AdjectiveRealEstate/1.0 (https://adjectiverealty.com)",
    "Accept": "application/json"
};

// One combined query fetches all categories in a single HTTP round-trip.
// This avoids the 6x parallel requests that trigger Overpass rate-limiting (429)
// and removes the cascading timeout problem.
function buildCombinedQuery(lat, lng, radius = 2500) {
    return `
        [out:json][timeout:20];
        (
            node(around:${radius},${lat},${lng})["amenity"="hospital"];
            way(around:${radius},${lat},${lng})["amenity"="hospital"];
            node(around:${radius},${lat},${lng})["highway"="bus_stop"];
            node(around:${radius},${lat},${lng})["amenity"="bus_station"];
            node(around:${radius},${lat},${lng})["amenity"="school"];
            node(around:${radius},${lat},${lng})["amenity"="bank"];
            node(around:${radius},${lat},${lng})["amenity"="restaurant"];
            node(around:${radius},${lat},${lng})["amenity"="fuel"];
        );
        out center;
    `;
}

async function postToOverpass(query) {
    let lastError = null;
    for (const endpoint of OVERPASS_ENDPOINTS) {
        try {
            const response = await axios.post(
                endpoint,
                new URLSearchParams({ data: query }).toString(),
                {
                    headers: OVERPASS_HEADERS,
                    timeout: 22000
                }
            );
            return response;
        } catch (err) {
            lastError = err;
        }
    }
    throw lastError || new Error("All Overpass endpoints failed");
}

// Categories to extract from the combined result set.
// The `match` function is applied to each OSM element's tags.
const CATEGORY_MAP = [
    {
        key: "hospital",
        label: "Hospital",
        match: (t) => t.amenity === "hospital"
    },
    {
        key: "bus_station",
        label: "Bus Stand",
        match: (t) => t.highway === "bus_stop" || t.amenity === "bus_station"
    },
    {
        key: "school",
        label: "School",
        match: (t) => t.amenity === "school"
    },
    {
        key: "bank",
        label: "Bank",
        match: (t) => t.amenity === "bank"
    },
    {
        key: "restaurant",
        label: "Restaurant",
        match: (t) => t.amenity === "restaurant"
    },
    {
        key: "petrol_pump",
        label: "Petrol Pump",
        match: (t) => t.amenity === "fuel"
    }
];

async function getNearbyPlaces(latitude, longitude) {
    try {
        const query = buildCombinedQuery(latitude, longitude);
        const response = await postToOverpass(query);
        const elements = response.data.elements || [];

        if (elements.length === 0) {
            return [];
        }

        // For each category, find the first matching OSM element,
        // then run OSRM routing calls in parallel (different service, no rate limit).
        const routingPromises = CATEGORY_MAP.map(async (cat) => {
            const match = elements.find(
                (el) => el.tags && cat.match(el.tags)
            );

            if (!match) return null;

            const placeLat = match.lat || match.center?.lat;
            const placeLng = match.lon || match.center?.lon;

            if (!placeLat || !placeLng) return null;

            const route = await getRoute(latitude, longitude, placeLat, placeLng);

            return {
                category: cat.key,
                label: cat.label,
                name: match.tags?.name || `Nearest ${cat.label}`,
                latitude: placeLat,
                longitude: placeLng,
                distance: route?.distance || null,
                duration: route?.duration || null,
                distanceMeters: route?.distanceMeters || null,
                durationSeconds: route?.durationSeconds || null
            };
        });

        const results = await Promise.all(routingPromises);
        return results.filter(Boolean);

    } catch (err) {
        console.error("Nearby places fetch failed:", err.message);
        return [];
    }
}

module.exports = {
    getNearbyPlaces
};

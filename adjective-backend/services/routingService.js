const axios = require("axios");

const OSRM_URL = "https://router.project-osrm.org/route/v1/driving";

function formatDistance(meters) {
    if (meters < 1000) {
        return `${Math.round(meters)} m`;
    }

    return `${(meters / 1000).toFixed(1)} km`;
}

function formatDuration(seconds) {

    const mins = Math.round(seconds / 60);

    if (mins < 60) {
        return `${mins} mins`;
    }

    const hrs = Math.floor(mins / 60);
    const remaining = mins % 60;

    return `${hrs} hr ${remaining} mins`;
}

async function getRoute(originLat, originLng, destLat, destLng) {

    try {

        const url =
            `${OSRM_URL}/${originLng},${originLat};${destLng},${destLat}?overview=false`;

        const response = await axios.get(url, {
            headers: {
                "User-Agent": "AdjectiveRealEstate/1.0 (https://adjectiverealty.com)",
                "Accept": "application/json, text/plain, */*"
            },
            timeout: 10000
        });

        const route = response.data.routes?.[0];

        if (!route) {
            return null;
        }

        return {

            distanceMeters: route.distance,

            durationSeconds: route.duration,

            distance: formatDistance(route.distance),

            duration: formatDuration(route.duration)
        };

    } catch (err) {

        console.error("OSRM Error:", err.message);

        return null;
    }

}

module.exports = {
    getRoute
};
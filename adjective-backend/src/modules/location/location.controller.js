const { getNearbyPlaces } = require("../../../services/nearbyPlacesService");

const getNearbyLocations = async (req, res) => {
    try {

        const { lat, lng } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                message: "Latitude and Longitude are required."
            });
        }

        const places = await getNearbyPlaces(
            Number(lat),
            Number(lng)
        );

        return res.status(200).json({
            success: true,
            count: places.length,
            data: places
        });

    } catch (err) {

        console.error("Nearby Location Error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch nearby locations."
        });
    }
};

module.exports = {
    getNearbyLocations
};
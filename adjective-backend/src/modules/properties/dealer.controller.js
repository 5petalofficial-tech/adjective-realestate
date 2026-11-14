const fs     = require('fs');
const Dealer = require('./dealer.model');
const { toRelativePath, toAbsolutePath } = require('../../utils/uploadPaths');

/**
 * Safely delete a single upload file from disk.
 * Resolves the stored relative path against the canonical UPLOADS_ROOT
 * (adjective-backend/uploads/) so deletion is stable regardless of CWD.
 * Silently skips missing files — never throws.
 */
const deleteFile = (filePath) => {
    if (!filePath) return;
    const fullPath = toAbsolutePath(filePath);
    if (fullPath && fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
    }
};

/**
 * Parse a list of JSON string fields on req.body in-place.
 * Fields that are already non-strings are left untouched.
 * Parse failures are silently ignored so a bad payload does not crash the server.
 */
const parseJsonFields = (body, fields) => {
    for (const field of fields) {
        if (body[field] && typeof body[field] === 'string') {
            try { body[field] = JSON.parse(body[field]); } catch (_) { /* ignore */ }
        }
    }
};

// All fields that may arrive as JSON strings in multipart/form-data
const DEALER_JSON_FIELDS = [
    'specifications', 'unitPlans', 'neighborhoodSurroundings',
    'customerReviews', 'faq', 'homeLoanOffers',
    'towers', 'configurations',
    'liftDetails', 'servantQuarter'
];

/**
 * Build a parsed location object from multipart bracket notation or nested body.
 * Returns the merged location, falling back to `existing` values on update.
 */
const parseLocation = (reqBody, existing = {}) => ({
    addressLine: reqBody.location?.addressLine || reqBody["location[addressLine]"] || existing.addressLine,
    locality:    reqBody.location?.locality    || reqBody["location[locality]"]    || existing.locality,
    city:        reqBody.location?.city        || reqBody["location[city]"]        || existing.city,
    state:       reqBody.location?.state       || reqBody["location[state]"]       || existing.state,
    pincode:     reqBody.location?.pincode     || reqBody["location[pincode]"]     || existing.pincode,
    latitude:  Number(reqBody.location?.latitude  || reqBody["location[latitude]"]  || existing.latitude  || 0),
    longitude: Number(reqBody.location?.longitude || reqBody["location[longitude]"] || existing.longitude || 0)
});

// ---------------------------------------------------------------------------
// CREATE
// ---------------------------------------------------------------------------

const createDealerProperty = async (req, res) => {
    try {
        const body = req.body;

        // Treat empty string as null so the locationArea enum does not reject it
        if (body.locationArea === "") {
            body.locationArea = null;
        }

        // Parse location from multipart bracket notation or nested object
        body.location = parseLocation(body);

        // Extract and normalise file paths
        const bannerImagePath = toRelativePath(req.files?.bannerImage?.[0]?.path);
        const brochurePath    = toRelativePath(req.files?.brochureUrl?.[0]?.path);
        const floorPlanPath   = toRelativePath(req.files?.floorPlanUrl?.[0]?.path);

        const galleryPaths = req.files?.projectGallery
            ? req.files.projectGallery.map(file => toRelativePath(file.path))
            : [];

        body.media = {
            bannerImage:    bannerImagePath,
            projectGallery: galleryPaths,
            brochureUrl:    brochurePath
        };

        // floorPlanUrl is a top-level field (not nested under media)
        if (floorPlanPath) {
            body.floorPlanUrl = floorPlanPath;
        }

        // Parse all complex JSON fields sent as strings in multipart form-data
        parseJsonFields(body, DEALER_JSON_FIELDS);

        const newDealerProperty = new Dealer(body);
        await newDealerProperty.save();

        return res.status(201).json({
            success: true,
            message: "Dealer property created successfully",
            data: newDealerProperty
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }

        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "A property with this RERA number already exists." });
        }

        console.error("Dealer create error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// ---------------------------------------------------------------------------
// READ ALL
// ---------------------------------------------------------------------------

const getAllDealerProperties = async (req, res) => {
    try {
        const properties = await Dealer.find()
            .populate('builderId', 'First_name Last_name email phone')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: properties.length,
            data: properties
        });

    } catch (error) {
        console.error("Error fetching dealer properties:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error while fetching properties." });
    }
};

// ---------------------------------------------------------------------------
// READ ONE
// ---------------------------------------------------------------------------

const getDealerPropertyById = async (req, res) => {
    try {
        const property = await Dealer.findById(req.params.id)
            .populate('builderId', 'First_name Last_name email phone');

        if (!property) {
            return res.status(404).json({ success: false, message: "Dealer property not found." });
        }

        return res.status(200).json({ success: true, data: property });

    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ success: false, message: "Invalid property ID format." });
        }

        console.error("Error fetching dealer property:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error while fetching property." });
    }
};

// ---------------------------------------------------------------------------
// UPDATE
// ---------------------------------------------------------------------------

const updateDealerProperty = async (req, res) => {
    try {
        const property = await Dealer.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ success: false, message: "Dealer property not found." });
        }

        const body = req.body;

        if (body.locationArea === "") {
            body.locationArea = null;
        }

        // Merge location — fall back to existing DB values for any omitted fields
        body.location = parseLocation(body, property.location);

        // ---------------------------------------------------------------
        // Media merge strategy:
        //   • existingBanner / existingBrochure / existingFloorPlan  → keep old path if no new file uploaded
        //   • New file uploaded                                       → use new path
        //   • existingGallery                                         → client sends which old paths to keep;
        //     new uploads are appended on top
        // ---------------------------------------------------------------

        // Determine which existing gallery paths the client wants to retain
        let baseGallery;
        if (req.body.existingGallery !== undefined) {
            if (Array.isArray(req.body.existingGallery)) {
                baseGallery = [...req.body.existingGallery];
            } else if (req.body.existingGallery === "") {
                baseGallery = [];
            } else {
                baseGallery = [req.body.existingGallery];
            }
        } else {
            // Client sent nothing — preserve everything currently in DB
            baseGallery = [...property.media.projectGallery];
        }

        let updatedMedia = {
            bannerImage:    req.body.existingBanner   !== undefined ? req.body.existingBanner   : property.media.bannerImage,
            projectGallery: baseGallery,
            brochureUrl:    req.body.existingBrochure !== undefined ? req.body.existingBrochure : property.media.brochureUrl
        };

        if (req.files?.bannerImage) {
            updatedMedia.bannerImage = toRelativePath(req.files.bannerImage[0].path);
        }

        if (req.files?.brochureUrl) {
            updatedMedia.brochureUrl = toRelativePath(req.files.brochureUrl[0].path);
        }

        if (req.files?.projectGallery) {
            const newGalleryPaths = req.files.projectGallery.map(file => toRelativePath(file.path));
            updatedMedia.projectGallery = [...baseGallery, ...newGalleryPaths];
        }

        body.media = updatedMedia;

        // floorPlanUrl — new upload takes priority; else honour existingFloorPlan; else retain DB value
        if (req.files?.floorPlanUrl) {
            body.floorPlanUrl = toRelativePath(req.files.floorPlanUrl[0].path);
        } else if (req.body.existingFloorPlan !== undefined) {
            body.floorPlanUrl = req.body.existingFloorPlan;
        }
        // ---- Collect files that are being replaced or removed to prevent orphans ----
        const filesToDelete = [];

        if (property.media.bannerImage && property.media.bannerImage !== updatedMedia.bannerImage) {
            filesToDelete.push(property.media.bannerImage);
        }

        if (property.media.brochureUrl && property.media.brochureUrl !== updatedMedia.brochureUrl) {
            filesToDelete.push(property.media.brochureUrl);
        }

        const finalFloorPlanUrl = body.floorPlanUrl !== undefined ? body.floorPlanUrl : property.floorPlanUrl;
        if (property.floorPlanUrl && property.floorPlanUrl !== finalFloorPlanUrl) {
            filesToDelete.push(property.floorPlanUrl);
        }

        if (property.media.projectGallery && Array.isArray(property.media.projectGallery)) {
            property.media.projectGallery.forEach(oldImg => {
                if (oldImg && !updatedMedia.projectGallery.includes(oldImg)) {
                    filesToDelete.push(oldImg);
                }
            });
        }

        // Parse all complex JSON fields sent as strings in multipart form-data
        parseJsonFields(body, DEALER_JSON_FIELDS);

        const updatedProperty = await Dealer.findByIdAndUpdate(
            req.params.id,
            body,
            { new: true, runValidators: true }
        );

        // Delete replaced/removed files only after database update succeeds
        filesToDelete.forEach(filePath => {
            // Defensive check: never delete default assets or external links
            if (filePath && !filePath.startsWith('/Projects/')) {
                deleteFile(filePath);
            }
        });

        return res.status(200).json({
            success: true,
            message: "Property updated successfully",
            data: updatedProperty
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }

        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "A property with this RERA number already exists." });
        }

        console.error("Dealer update error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error during update." });
    }
};

// ---------------------------------------------------------------------------
// DELETE
// ---------------------------------------------------------------------------

const deleteDealerProperty = async (req, res) => {
    try {
        const property = await Dealer.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ success: false, message: "Dealer property not found." });
        }

        // Remove all associated media files from disk before deleting the DB record
        deleteFile(property.media.bannerImage);
        deleteFile(property.media.brochureUrl);
        deleteFile(property.floorPlanUrl);

        if (property.media.projectGallery?.length > 0) {
            property.media.projectGallery.forEach(deleteFile);
        }

        await property.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Property and all associated files deleted successfully."
        });

    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ success: false, message: "Invalid property ID format." });
        }

        console.error("Dealer delete error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error while deleting." });
    }
};

module.exports = {
    createDealerProperty,
    getAllDealerProperties,
    getDealerPropertyById,
    updateDealerProperty,
    deleteDealerProperty
};

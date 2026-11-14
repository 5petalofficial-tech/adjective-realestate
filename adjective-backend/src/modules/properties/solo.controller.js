const mongoose = require('mongoose');
const fs   = require('fs');
const Solo = require('./solo.model');
const { toRelativePath, toAbsolutePath } = require('../../utils/uploadPaths');

/**
 * Safely delete a single upload file from disk.
 * Resolves the stored relative path against the canonical UPLOADS_ROOT
 * (adjective-backend/uploads/) so deletion is stable regardless of CWD.
 * Silently skips files that do not exist — never throws.
 */
const deleteFile = (filePath) => {
    if (!filePath) return;
    const fullPath = toAbsolutePath(filePath);
    if (fullPath && fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
    }
};

/**
 * Coerce a multipart string boolean value ("true"/"false") to an actual Boolean.
 * Returns the original value unchanged if it is already a Boolean.
 */
const parseBool = (val) => {
    if (typeof val === 'boolean') return val;
    return val === 'true';
};

/**
 * Safely JSON-parse a single field on `obj` in-place.
 * Leaves the value unchanged if it is not a string or if parsing fails.
 */
const safeJsonParse = (obj, field) => {
    if (obj[field] && typeof obj[field] === 'string') {
        try { obj[field] = JSON.parse(obj[field]); } catch (_) { /* ignore */ }
    }
};

// ---------------------------------------------------------------------------
// CREATE
// ---------------------------------------------------------------------------

// @desc    Create a new solo resale property listing
// @route   POST /api/solo/add  OR  POST /api/solo/create
// @access  Public / Private
const createSoloProperty = async (req, res) => {
    try {
        // ---- Extract images (named field) ----
        const imagePaths = req.files && req.files['images']
            ? req.files['images'].map(file => toRelativePath(file.path))
            : [];

        // ---- Extract document file paths ----
        const sitePlanUrl              = req.files?.sitePlanUrl?.[0]?.path              ? toRelativePath(req.files.sitePlanUrl[0].path)              : undefined;
        const completionCertificateUrl = req.files?.completionCertificateUrl?.[0]?.path ? toRelativePath(req.files.completionCertificateUrl[0].path) : undefined;
        const buildingPlanUrl          = req.files?.buildingPlanUrl?.[0]?.path          ? toRelativePath(req.files.buildingPlanUrl[0].path)          : undefined;

        // ---- Validate / default listedBy ----
        let listedBy = req.body.listedBy;
        if (!listedBy || !mongoose.Types.ObjectId.isValid(listedBy)) {
            listedBy = new mongoose.Types.ObjectId("650000000000000000000000");
        }

        // ---- Destructure all text fields ----
        const {
            name,
            overview,
            address,
            area,
            locationArea,
            latitude,
            longitude,
            price,
            vastu,
            facing,
            ageOfProperty,
            superBuiltUpAreaSize,
            builtUpAreaSize,
            carpetAreaSize,
            noOfBedrooms,
            noOfToilets,
            noOfBalconies,
            furnishingStatus,
            parkingType,
            status,
            isVerifiedByAdmin,
            isFeatured,
            isFinest,
            isProjectOfTheMonth,
            isVastuCompliant,
            isRERAApproved,
            isPMAYApproved,
            contactName,
            contactPhone,
            contactEmail,
            // Resale-specific fields
            propertyType,
            floor,
            balconiesDetails,
            buildingConfiguration,
            carParkingDetails,
            handoverDate,
            loanPossible,
            numberOfTowers,
            roadWidth,
            propertyTitle,
            liabilities,
            taxMutation,
            leaseOrFreehold,
            isNegotiable,
            landArea,
            // Additional detail fields
            projectHeight,
            liftDetails,
            servantQuarter,
            constructionDetails,
            pmayCategory
        } = req.body;

        // ---- Parse JSON-string fields from multipart ----
        let parsedBalconiesDetails, parsedCarParkingDetails, parsedLiftDetails, parsedServantQuarter;
        try { parsedBalconiesDetails  = balconiesDetails  ? JSON.parse(balconiesDetails)  : []; } catch (_) { parsedBalconiesDetails  = []; }
        try { parsedCarParkingDetails = carParkingDetails ? JSON.parse(carParkingDetails) : {}; } catch (_) { parsedCarParkingDetails = {}; }
        try { parsedLiftDetails       = liftDetails       ? JSON.parse(liftDetails)       : {}; } catch (_) { parsedLiftDetails       = {}; }
        try { parsedServantQuarter    = servantQuarter     ? JSON.parse(servantQuarter)    : {}; } catch (_) { parsedServantQuarter    = {}; }

        // ---- Compose the overview string (optionally appends owner contact) ----
        const descriptionWithOwnerInfo = overview
            ? `${overview}${contactName || contactPhone ? `\n\n[Owner Contact: ${contactName || 'N/A'}, Phone: ${contactPhone || 'N/A'}, Email: ${contactEmail || 'N/A'}]` : ''}`
            : `Submitted by ${contactName || 'User'} (${contactPhone || 'No Phone'}, ${contactEmail || 'No Email'})`;

        const newProperty = await Solo.create({
            listedBy,
            name:     name    || "Resale Property",
            overview: descriptionWithOwnerInfo,
            address:  address || area    || "Kolkata",
            area:     area    || address || "Kolkata",
            locationArea: locationArea || null,
            latitude:  latitude  !== undefined && latitude  !== "" ? Number(latitude)  : undefined,
            longitude: longitude !== undefined && longitude !== "" ? Number(longitude) : undefined,
            price:    Number(price) || 0,
            vastu:    vastu    || "Vastu Compliant",
            facing:   facing   || "East",
            ageOfProperty:       Number(ageOfProperty)       || 1,
            superBuiltUpAreaSize: Number(superBuiltUpAreaSize) || 1000,
            builtUpAreaSize:      Number(builtUpAreaSize) || Number(superBuiltUpAreaSize) || 1000,
            carpetAreaSize:       Number(carpetAreaSize)  || Number(superBuiltUpAreaSize) || 800,
            noOfBedrooms:  Number(noOfBedrooms)  || 3,
            noOfToilets:   Number(noOfToilets)   || 2,
            noOfBalconies: Number(noOfBalconies) || 1,
            furnishingStatus: furnishingStatus || "Semi-Furnished",
            parkingType:      parkingType      || "Covered",
            status:           status           || 'On Hold',
            isVerifiedByAdmin: parseBool(isVerifiedByAdmin) || false,
            isFeatured:        parseBool(isFeatured),
            isFinest:          parseBool(isFinest),
            isProjectOfTheMonth: parseBool(isProjectOfTheMonth),
            isVastuCompliant:  parseBool(isVastuCompliant),
            isRERAApproved:    parseBool(isRERAApproved),
            isPMAYApproved:    parseBool(isPMAYApproved),
            // Resale fields
            propertyType:         propertyType || 'Flat',
            floor,
            balconiesDetails:     parsedBalconiesDetails,
            buildingConfiguration,
            carParkingDetails:    parsedCarParkingDetails,
            handoverDate,
            loanPossible:         parseBool(loanPossible),
            numberOfTowers:       Number(numberOfTowers) || 1,
            roadWidth,
            propertyTitle,
            liabilities,
            taxMutation:          parseBool(taxMutation),
            leaseOrFreehold,
            isNegotiable:         parseBool(isNegotiable),
            landArea,
            // Document uploads
            sitePlanUrl,
            completionCertificateUrl,
            buildingPlanUrl,
            // Additional detail fields
            projectHeight,
            liftDetails:        parsedLiftDetails,
            servantQuarter:     parsedServantQuarter,
            constructionDetails,
            pmayCategory,
            // Images
            images: imagePaths.length > 0 ? imagePaths : ["https://placehold.co/800x500/5E6623/white?text=No+Image"]
        });

        return res.status(201).json({
            success: true,
            message: "Property submitted successfully for admin approval!",
            property: newProperty
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }

        console.error("Error creating solo property:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while listing property."
        });
    }
};

// ---------------------------------------------------------------------------
// READ ALL
// ---------------------------------------------------------------------------

const getAllSoloProperties = async (req, res) => {
    try {
        const properties = await Solo.find().populate('listedBy', 'First_name Last_name');
        return res.status(200).json({ success: true, properties });
    } catch (error) {
        console.error("Error fetching solo properties:", error);
        return res.status(500).json({ success: false, message: "Internal server error while fetching properties." });
    }
};

// ---------------------------------------------------------------------------
// READ ONE
// ---------------------------------------------------------------------------

const getSoloPropertyById = async (req, res) => {
    try {
        const property = await Solo.findById(req.params.id).populate('listedBy', 'First_name Last_name');
        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found." });
        }
        return res.status(200).json({ success: true, property });
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ success: false, message: "Invalid property ID format." });
        }
        console.error("Error fetching solo property:", error);
        return res.status(500).json({ success: false, message: "Internal server error while fetching property." });
    }
};

// ---------------------------------------------------------------------------
// UPDATE
// ---------------------------------------------------------------------------

// @desc    Update a solo property (admin approve/publish, field edits)
// @route   PUT /api/solo/:id
// @access  Private
const updateSoloProperty = async (req, res) => {
    try {
        const property = await Solo.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found." });
        }

        // ---- Image uploads (named field) ----
        const imagePaths = req.files && req.files['images']
            ? req.files['images'].map(file => toRelativePath(file.path))
            : [];

        if (imagePaths.length > 0) {
            req.body.images = imagePaths;
        }

        // ---- Document uploads ----
        if (req.files?.sitePlanUrl?.[0])              req.body.sitePlanUrl              = toRelativePath(req.files.sitePlanUrl[0].path);
        if (req.files?.completionCertificateUrl?.[0]) req.body.completionCertificateUrl = toRelativePath(req.files.completionCertificateUrl[0].path);
        if (req.files?.buildingPlanUrl?.[0])          req.body.buildingPlanUrl          = toRelativePath(req.files.buildingPlanUrl[0].path);

        // ---- Geo coordinate coercion ----
        if (req.body.latitude  !== undefined && req.body.latitude  !== "") req.body.latitude  = Number(req.body.latitude);
        if (req.body.longitude !== undefined && req.body.longitude !== "") req.body.longitude = Number(req.body.longitude);

        // ---- JSON field parsing (multipart sends everything as strings) ----
        safeJsonParse(req.body, 'balconiesDetails');
        safeJsonParse(req.body, 'carParkingDetails');
        safeJsonParse(req.body, 'liftDetails');
        safeJsonParse(req.body, 'servantQuarter');

        // ---- Boolean coercion for string booleans from multipart ----
        if (req.body.loanPossible  !== undefined) req.body.loanPossible  = parseBool(req.body.loanPossible);
        if (req.body.taxMutation   !== undefined) req.body.taxMutation   = parseBool(req.body.taxMutation);
        if (req.body.isNegotiable  !== undefined) req.body.isNegotiable  = parseBool(req.body.isNegotiable);

        // ---- Collect files that are being replaced or removed to prevent orphans ----
        const filesToDelete = [];

        if (property.sitePlanUrl && req.body.sitePlanUrl !== undefined && property.sitePlanUrl !== req.body.sitePlanUrl) {
            filesToDelete.push(property.sitePlanUrl);
        }

        if (property.completionCertificateUrl && req.body.completionCertificateUrl !== undefined && property.completionCertificateUrl !== req.body.completionCertificateUrl) {
            filesToDelete.push(property.completionCertificateUrl);
        }

        if (property.buildingPlanUrl && req.body.buildingPlanUrl !== undefined && property.buildingPlanUrl !== req.body.buildingPlanUrl) {
            filesToDelete.push(property.buildingPlanUrl);
        }

        if (property.images && Array.isArray(property.images)) {
            const newImages = req.body.images !== undefined
                ? (Array.isArray(req.body.images) ? req.body.images : [req.body.images])
                : property.images;

            property.images.forEach(oldImg => {
                if (oldImg && !newImages.includes(oldImg)) {
                    filesToDelete.push(oldImg);
                }
            });
        }

        const updatedProperty = await Solo.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        // Delete replaced/removed files only after database update succeeds
        filesToDelete.forEach(filePath => {
            // Defensive check: never delete default assets or external links
            if (filePath && !filePath.startsWith('/Projects/')) {
                deleteFile(filePath);
            }
        });

        return res.status(200).json({ success: true, property: updatedProperty });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        console.error("Error updating solo property:", error);
        return res.status(500).json({ success: false, message: "Server error while updating." });
    }
};

// ---------------------------------------------------------------------------
// DELETE
// ---------------------------------------------------------------------------

// @desc    Delete a solo property
// @route   DELETE /api/solo/:id
// @access  Private
const deleteSoloProperty = async (req, res) => {
    try {
        const property = await Solo.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found." });
        }

        // Clean up uploaded images from disk
        if (property.images?.length > 0) {
            property.images.forEach(deleteFile);
        }

        // Clean up document files
        deleteFile(property.sitePlanUrl);
        deleteFile(property.completionCertificateUrl);
        deleteFile(property.buildingPlanUrl);

        await property.deleteOne();

        return res.status(200).json({ success: true, message: "Property deleted successfully." });

    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ success: false, message: "Invalid property ID format." });
        }
        console.error("Error deleting solo property:", error);
        return res.status(500).json({ success: false, message: "Server error while deleting." });
    }
};

module.exports = {
    createSoloProperty,
    getAllSoloProperties,
    getSoloPropertyById,
    updateSoloProperty,
    deleteSoloProperty
};

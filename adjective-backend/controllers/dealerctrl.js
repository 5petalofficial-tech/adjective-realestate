const path = require('path');
const fs = require('fs');
const dealer = require('../schema/dealer');

const formatRelativePath = (p) => {
    if (!p) return "";
    let clean = p.replace(/\\/g, "/");
    const idx = clean.toLowerCase().indexOf("uploads/");
    if (idx !== -1) {
        return clean.slice(idx);
    }
    return clean;
};

const createDealerProperty = async (req, res) => {
    try {
        // 1. Grab all the text data
        const body = req.body;

        if (body.locationArea === "") {
            body.locationArea = null;
        }

        // 2. Safely extract file paths from Multer (if they exist)
        const bannerImagePath = formatRelativePath(req.files?.bannerImage?.[0]?.path);
        const brochurePath = formatRelativePath(req.files?.brochureUrl?.[0]?.path);
        const floorPlanPath = formatRelativePath(req.files?.floorPlanUrl?.[0]?.path);
        
        // Map the array of gallery images
        const galleryPaths = req.files?.projectGallery 
            ? req.files.projectGallery.map(file => formatRelativePath(file.path)) 
            : [];

        // 3. Attach the files to the body in the exact structure your schema expects
        body.media = {
            bannerImage: bannerImagePath,
            projectGallery: galleryPaths,
            brochureUrl: brochurePath
        };
        
        if (floorPlanPath) {
            body.floorPlanUrl = floorPlanPath;
        }

        const { pmayCategory, projectHeight, liftDetails, servantQuarter, constructionDetails } = body;
        let parsedLiftDetails, parsedServantQuarter;
        try { parsedLiftDetails = liftDetails ? (typeof liftDetails === 'string' ? JSON.parse(liftDetails) : liftDetails) : {}; } catch(e) { parsedLiftDetails = {}; }
        try { parsedServantQuarter = servantQuarter ? (typeof servantQuarter === 'string' ? JSON.parse(servantQuarter) : servantQuarter) : {}; } catch(e) { parsedServantQuarter = {}; }

        if (liftDetails !== undefined) body.liftDetails = parsedLiftDetails;
        if (servantQuarter !== undefined) body.servantQuarter = parsedServantQuarter;

        // Parse JSON fields from multipart/form-data
        const jsonFields = ['specifications', 'unitPlans', 'neighborhoodSurroundings', 'customerReviews', 'faq', 'homeLoanOffers', 'towers', 'configurations', 'liftDetails', 'servantQuarter'];
        for (const field of jsonFields) {
            if (body[field] && typeof body[field] === 'string') {
                try { body[field] = JSON.parse(body[field]); } catch(e) {}
            }
        }

        // 4. Save to database
        const newDealerProperty = new dealer(body);
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
        
        console.error("Dealer upload error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
const getAllDealerProperties = async (req, res) => {
    try {
        // .populate() reaches into your User collection and grabs the builder's details 
        // so you don't just send back a random string of numbers for the builderId.
        const properties = await dealer.find()
            .populate('builderId', 'First_name Last_name email phone') // Adjust these fields based on your actual User schema
            .sort({ createdAt: -1 }); // Sorts by newest first

        return res.status(200).json({
            success: true,
            count: properties.length,
            data: properties
        });

    } catch (error) {
        console.error("Error fetching properties:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error while fetching properties." });
    }
};
const getDealerPropertyById = async (req, res) => {
    try {
        // req.params.id grabs the ID right out of the URL (e.g., /api/dealer/64b5f9...)
        const property = await dealer.findById(req.params.id)
            .populate('builderId', 'First_name Last_name email phone');

        // If the ID is valid but doesn't exist in the database
        if (!property) {
            return res.status(404).json({ success: false, message: "Dealer property not found." });
        }

        return res.status(200).json({
            success: true,
            data: property
        });

    } catch (error) {
        // A common Mongoose error: If someone types a bad ID format in the URL (like "123")
        // Mongoose will crash trying to cast it to an ObjectId. This catches that safely.
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ success: false, message: "Invalid property ID format." });
        }

        console.error("Error fetching single property:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error while fetching property." });
    }
};
const updateDealerProperty = async (req, res) => {
    try {
        // 1. Find the existing property first
        let property = await dealer.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ success: false, message: "Dealer property not found." });
        }

        // 2. Grab the incoming text data
        const body = req.body;

        if (body.locationArea === "") {
            body.locationArea = null;
        }

        // 3. THE SAFETY MERGE: Copy the existing media so we don't accidentally delete it!
        // We take the photos already saved in the database as our starting point.
        let baseGallery = [...property.media.projectGallery];
        if (req.body.existingGallery) {
            if (Array.isArray(req.body.existingGallery)) {
                baseGallery = [...req.body.existingGallery];
            } else {
                baseGallery = [req.body.existingGallery];
            }
        } else if (req.body.existingGallery === "") {
            baseGallery = [];
        }

        let updatedMedia = { 
            bannerImage: req.body.existingBanner !== undefined ? req.body.existingBanner : property.media.bannerImage,
            projectGallery: baseGallery,
            brochureUrl: req.body.existingBrochure !== undefined ? req.body.existingBrochure : property.media.brochureUrl
        };

        // 4. Overwrite ONLY the files the user actually uploaded this time
        if (req.files?.bannerImage) {
            updatedMedia.bannerImage = formatRelativePath(req.files.bannerImage[0].path);
        }
        
        if (req.files?.brochureUrl) {
            updatedMedia.brochureUrl = formatRelativePath(req.files.brochureUrl[0].path);
        }
        
        if (req.files?.projectGallery) {
            const newGalleryPaths = req.files.projectGallery.map(file => formatRelativePath(file.path));
            updatedMedia.projectGallery = [...baseGallery, ...newGalleryPaths];
        }

        // 5. Attach the safely merged media object back to the body
        body.media = updatedMedia;

        if (req.files?.floorPlanUrl) {
            body.floorPlanUrl = formatRelativePath(req.files.floorPlanUrl[0].path);
        } else if (req.body.existingFloorPlan !== undefined) {
            body.floorPlanUrl = req.body.existingFloorPlan;
        }

        if (body.liftDetails && typeof body.liftDetails === 'string') {
            try { body.liftDetails = JSON.parse(body.liftDetails); } catch(e) {}
        }
        if (body.servantQuarter && typeof body.servantQuarter === 'string') {
            try { body.servantQuarter = JSON.parse(body.servantQuarter); } catch(e) {}
        }

        const jsonFields = ['specifications', 'unitPlans', 'neighborhoodSurroundings', 'customerReviews', 'faq', 'homeLoanOffers', 'towers', 'configurations', 'liftDetails', 'servantQuarter'];
        for (const field of jsonFields) {
            if (body[field] && typeof body[field] === 'string') {
                try { body[field] = JSON.parse(body[field]); } catch(e) {}
            }
        }

        // 6. Update the document in the database
        const updatedProperty = await dealer.findByIdAndUpdate(
            req.params.id, 
            body, 
            {
                new: true, // Returns the fresh updated document
                runValidators: true // Ensures they don't break your Enums
            }
        );

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
        
        console.error("Dealer update error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error during update." });
    }
};
const deleteDealerProperty = async (req, res) => {
    try {
        // 1. Find the property first (so we know what files to delete)
        const property = await dealer.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ success: false, message: "Dealer property not found." });
        }

        // 2. Safely delete the files from the server hard drive
        const deleteFile = (filePath) => {
            if (filePath) {
                // path.resolve ensures the path is correct no matter where you run the server
                const fullPath = path.resolve(filePath);
                // fs.existsSync checks if the file is actually there before trying to delete it
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath); // Physically deletes the file!
                }
            }
        };

        // Delete Banner
        deleteFile(property.media.bannerImage);
        
        // Delete Brochure
        deleteFile(property.media.brochureUrl);
        
        // Delete all Gallery Images
        if (property.media.projectGallery && property.media.projectGallery.length > 0) {
            property.media.projectGallery.forEach(imagePath => {
                deleteFile(imagePath);
            });
        }

        // 3. Delete the document from the MongoDB database
        await property.deleteOne();

        return res.status(200).json({ 
            success: true, 
            message: "Property and all associated files deleted successfully." 
        });

    } catch (error) {
        // Mongoose format error catch
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ success: false, message: "Invalid property ID format." });
        }

        console.error("Dealer delete error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error while deleting." });
    }
};
module.exports = { createDealerProperty, getAllDealerProperties, getDealerPropertyById, updateDealerProperty, deleteDealerProperty };
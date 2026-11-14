const mongoose = require('mongoose');

// Sub-schema: Available room/unit configurations
const configurationSchema = new mongoose.Schema({
    bhkType: {
        type: String,
        enum: ['1BHK', '2BHK', '3BHK', '4BHK', 'Penthouse', 'Studio', 'Commercial Space'],
        required: [true, "BHK configuration type is required"]
    },
    superBuiltUpAreaSize: {
        type: Number,
        required: [true, "Super built-up area size is required"]
    },
    builtUpAreaSize: {
        type: Number,
        required: [true, "Built-up area size is required"]
    },
    carpetAreaSize: {
        type: Number,
        required: [true, "Carpet area size is required"]
    },
    basePrice: {
        type: Number,
        required: [true, "Base price for configuration is required"]
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
});

// Sub-schema: Physical towers or building blocks
const towerSchema = new mongoose.Schema({
    towerName: {
        type: String,
        required: [true, "Tower or Block name is required"],
        trim: true
    },
    totalFloors: {
        type: Number,
        required: [true, "Total floors in this tower is required"]
    },
    totalUnitsCount: {
        type: Number,
        required: [true, "Total number of units in this tower is required"]
    }
});

// Master builder project schema
const builderProjectSchema = new mongoose.Schema({

    // Account association
    builderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    // Project meta
    projectName: {
        type: String,
        required: [true, "Project name is required"],
        trim: true
    },
    reraNumber: {
        type: String,
        required: [true, "RERA registration number is mandatory for builder projects"],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, "Project overview/description is required"]
    },
    constructionStatus: {
        type: String,
        enum: ['New Launch', 'Under Construction', 'Ready to Move'],
        required: [true, "Construction status is required"]
    },

    // Price range for the whole project
    priceRange: {
        minPrice: { type: Number, required: true },
        maxPrice: { type: Number, required: true }
    },

    // Structural breakdown
    towers: [towerSchema],
    configurations: [configurationSchema],

    // Parking — merged enum covers both modular (6) and legacy (9) values
    parkingDetails: {
        parkingAvailable: { type: Boolean, default: true },
        availableTypes: [{
            type: String,
            enum: [
                'Open', 'Stilt', 'Basement', 'Stack', 'Puzzle', 'Tower',
                'Podium', 'Mechanical/Automated', 'Multi-Level'
            ]
        }],
        isParkingChargesIncluded: { type: Boolean, default: false },
        parkingCharges: { type: Number }
    },

    // Location — modular added latitude/longitude; legacy had only text fields
    location: {
        addressLine: { type: String, required: true },
        locality:    { type: String, required: true },
        city:        { type: String, required: true },
        state:       { type: String, required: true },
        pincode:     { type: String, required: true },
        // Modular-only: geo coordinates
        latitude:    { type: Number, required: true },
        longitude:   { type: Number, required: true }
    },

    Area: {
        type: String,
        required: true
    },

    // Modular-only: micro-location zone filter
    locationArea: {
        type: String,
        enum: [
            "Action Area I",
            "Action Area II",
            "Action Area III",
            "Rajarhat"
        ],
        required: false,
        default: null,
        index: true
    },

    // Media
    media: {
        bannerImage:    { type: String, required: [true, "Main project banner image is required"] },
        projectGallery: [{ type: String }],
        brochureUrl:    { type: String }
    },

    // Amenities
    amenities: [{
        type: String,
        enum: [
            'Swimming Pool', 'Gym', 'Clubhouse', 'Power Backup',
            '24x7 Security', 'Gated Community', 'EV Charging Station',
            'Intercom', 'Lift', 'Kids Play Area', 'Jogging Track'
        ]
    }],

    // --- Legacy-only extended project detail fields ---
    possessionTime: { type: Date },
    startingTiming:  { type: Date },

    specifications: [{ type: String }],

    unitPlans: [{
        unitType:       String,
        area:           String,
        balconyArea:    String,
        orientationUrl: String
    }],

    // Floor plan document (separate from gallery)
    floorPlanUrl: { type: String },

    neighborhoodSurroundings: [{
        name:     String,
        distance: String
    }],

    customerReviews: [{
        text:   String,
        author: String
    }],

    faq: [{
        question: String,
        answer:   String
    }],

    walkthroughUrl:  { type: String },
    paymentSchedule: { type: String },
    homeLoanOffers:  [{ type: String }],
    growthInsights:  { type: String },

    pmayCategory: {
        type: String,
        enum: ['EWS', 'LIG', 'MIG-I', 'MIG-II', 'Not Applicable']
    },

    projectHeight: { type: String },

    liftDetails: {
        numberOfLifts:        { type: Number, default: 0 },
        liftSize:             { type: String },
        liftCompany:          { type: String },
        serviceLiftAvailable: { type: Boolean, default: false }
    },

    servantQuarter: {
        available: { type: Boolean, default: false },
        location:  { type: String }
    },

    constructionDetails: { type: String },
    // --- End of extended fields ---

    // Internal verification flags
    isVerifiedByAdmin:    { type: Boolean, default: false },
    isActive:             { type: Boolean, default: true },
    PMAY_Approved:        { type: Boolean, default: false },
    isFeatured:           { type: Boolean, default: false },
    isFinest:             { type: Boolean, default: false },
    isProjectOfTheMonth:  { type: Boolean, default: false },
    isVastuCompliant:     { type: Boolean, default: false },
    isRERAApproved:       { type: Boolean, default: false },
    isPMAYApproved:       { type: Boolean, default: false }

}, {
    timestamps: true
});

// Model name 'BuilderProject' is unchanged — preserves existing MongoDB collection
module.exports = mongoose.model('BuilderProject', builderProjectSchema);

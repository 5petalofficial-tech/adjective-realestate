const mongoose = require('mongoose');

// 1. Subdocument for Available Room/Unit Configurations
// This defines the types of flats available in the complex (e.g., a typical 2BHK footprint)
const configurationSchema = new mongoose.Schema({
    bhkType: {
        type: String,
        enum: ['1BHK', '2BHK', '3BHK', '4BHK', 'Penthouse', 'Studio', 'Commercial Space'],
        required: [true, "BHK configuration type is required"]
    },
    superBuiltUpAreaSize: {
        type: Number, // in sq.ft. (using Number for filtering)
        required: [true, "Super built-up area size is required"]
    },
    builtUpAreaSize: {
        type: Number, // in sq.ft.
        required: [true, "Built-up area size is required"]
    },
    carpetAreaSize: {
        type: Number, // in sq.ft.
        required: [true, "Carpet area size is required"]
    },
    basePrice: {
        type: Number, // Starting price for this configuration type
        required: [true, "Base price for configuration is required"]
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
});

// 2. Subdocument for Physical Towers or Building Blocks
const towerSchema = new mongoose.Schema({
    towerName: {
        type: String, // e.g., "Tower A", "Block 1", "Phase I"
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

// 3. The Master Builder Project Schema
const builderProjectSchema = new mongoose.Schema({
    // Account association
    builderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References your User collection where role = 'builder' or 'promoter'
        required: true,
        index: true
    },

    // Project Meta Data
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

    // Total Price Scale for the entire project overview
    priceRange: {
        minPrice: { type: Number, required: true },
        maxPrice: { type: Number, required: true }
    },

    // Nested Structural Breakdowns (Using the subdocuments defined above)
    towers: [towerSchema],
    configurations: [configurationSchema],

    // Parking Infrastructure Assets
    parkingDetails: {
        parkingAvailable: { type: Boolean, default: true },
        availableTypes: [{
            type: String,
            enum: ['Open', 'Stilt', 'Basement', 'Stack', 'Puzzle', 'Tower', 'Podium', 'Mechanical/Automated', 'Multi-Level']
        }],
        isParkingChargesIncluded: { type: Boolean, default: false },
        parkingCharges: { type: Number } // If parking charges are separate, specify the amount
    },

    // Location Geometry
    location: {
        addressLine: { type: String, required: true },
        locality: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true }
    },
    Area:{
        type: String,
        required: true
        },

    // Media Links
    media: {
        bannerImage: { type: String, required: [true, "Main project banner image is required"] },
        projectGallery: [{ type: String }], // Array of image URLs for the site layout/walkthroughs
        brochureUrl: { type: String } // PDF URL for downloading the builder's documentation
    },

    // Project Amenities
    amenities: [{
        type: String,
        enum: [
            'Swimming Pool', 'Gym', 'Clubhouse', 'Power Backup', 
            '24x7 Security', 'Gated Community', 'EV Charging Station', 
            'Intercom', 'Lift', 'Kids Play Area', 'Jogging Track'
        ]
    }],
    
    // --- New Builder Project Fields ---
    possessionTime: { type: Date },
    startingTiming: { type: Date },
    specifications: [{ type: String }],
    unitPlans: [{
        unitType: String,
        area: String,
        balconyArea: String,
        orientationUrl: String // Image or document for orientation
    }],
    floorPlanUrl: { type: String },
    neighborhoodSurroundings: [{
        name: String,
        distance: String
    }],
    customerReviews: [{
        text: String,
        author: String
    }],
    faq: [{
        question: String,
        answer: String
    }],
    walkthroughUrl: { type: String },
    paymentSchedule: { type: String },
    homeLoanOffers: [{ type: String }],
    growthInsights: { type: String },
    pmayCategory: {
        type: String,
        enum: ['EWS', 'LIG', 'MIG-I', 'MIG-II', 'Not Applicable']
    },
    projectHeight: {
        type: String
    },
    liftDetails: {
        numberOfLifts: { type: Number, default: 0 },
        liftSize: { type: String },
        liftCompany: { type: String },
        serviceLiftAvailable: { type: Boolean, default: false }
    },
    servantQuarter: {
        available: { type: Boolean, default: false },
        location: { type: String }
    },
    constructionDetails: {
        type: String
    },
    // ----------------------------------

    // Internal Verification Guards
    isVerifiedByAdmin: {
        type: Boolean,
        default: false // Set to true manually once you verify their RERA registration certificate
    },
    isActive: {
        type: Boolean,
        default: true
    },
    PMAY_Approved: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isFinest: {
        type: Boolean,
        default: false
    },
    isProjectOfTheMonth: {
        type: Boolean,
        default: false
    },
    isVastuCompliant: {
        type: Boolean,
        default: false
    },
    isRERAApproved: {
        type: Boolean,
        default: false
    },
    isPMAYApproved: {
        type: Boolean,
        default: false
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('BuilderProject', builderProjectSchema);
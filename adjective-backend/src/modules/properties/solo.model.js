const mongoose = require('mongoose');

const soloSchema = new mongoose.Schema({

    // 1. Ownership
    listedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    // 2. Core text details
    name: {
        type: String,
        required: [true, "Listing title name is required"],
        trim: true
    },
    overview: {
        type: String,
        required: [true, "Property description overview is required"]
    },
    address: {
        type: String,
        required: [true, "Exact address is required"]
    },
    area: {
        type: String,
        required: true
    },

    // 3. Geo coordinates — modular-only; legacy schema did not have these
    latitude: {
        type: Number,
        min: -90,
        max: 90
    },
    longitude: {
        type: Number,
        min: -180,
        max: 180
    },

    // 4. Micro-location zone filter — modular-only
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

    // 5. Pricing
    price: {
        type: Number,
        required: [true, "Price is required"]
    },

    // 6. Orientation & culture
    vastu: {
        type: String,
        enum: ['Vastu Compliant', 'Non-Compliant', 'Unknown'],
        trim: true,
        required: true
    },
    facing: {
        type: String,
        enum: ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'],
        required: true
    },
    ageOfProperty: {
        type: Number,
        required: true
    },

    // 7. Area sizes
    superBuiltUpAreaSize: {
        type: Number,
        required: true
    },
    builtUpAreaSize: {
        type: Number,
        required: true
    },
    carpetAreaSize: {
        type: Number,
        required: true
    },

    // 8. Unit configuration
    noOfBedrooms: {
        type: Number,
        required: true
    },
    noOfToilets: {
        type: Number,
        required: true
    },
    noOfBalconies: {
        type: Number,
        required: true
    },

    // 9. Status & meta
    furnishingStatus: {
        type: String,
        enum: ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'],
        required: true
    },

    // Merged enum — modular (5 values) + legacy additions (Podium, Mechanical/Automated, Multi-Level)
    parkingType: {
        type: String,
        enum: ['None', 'Open', 'Covered', 'Stilt', 'Basement', 'Podium', 'Mechanical/Automated', 'Multi-Level'],
        required: true
    },

    // --- Legacy-only: Resale-specific fields ---

    propertyType: {
        type: String,
        enum: ['Flat', 'Individual House', 'Land with Building'],
        default: 'Flat'
    },
    floor: {
        type: String
    },
    balconiesDetails: [{
        count:  Number,
        size:   String,
        facing: String
    }],
    buildingConfiguration: {
        type: String
    },
    carParkingDetails: {
        available:   { type: Boolean, default: false },
        parkingType: { type: String },
        area:        { type: String },
        count:       { type: Number, default: 0 }
    },
    handoverDate: {
        type: Date
    },
    loanPossible: {
        type: Boolean,
        default: false
    },
    numberOfTowers: {
        type: Number,
        default: 1
    },
    roadWidth: {
        type: String
    },
    propertyTitle: {
        type: String,
        enum: ['Registered', 'Unregistered']
    },
    liabilities: {
        type: String
    },
    taxMutation: {
        type: Boolean,
        default: false
    },
    leaseOrFreehold: {
        type: String,
        enum: ['Lease', 'Freehold']
    },
    isNegotiable: {
        type: Boolean,
        default: false
    },
    landArea: {
        type: String
    },

    // --- Legacy-only: Legal / document upload fields ---
    sitePlanUrl:               { type: String },
    completionCertificateUrl:  { type: String },
    buildingPlanUrl:           { type: String },

    // --- Legacy-only: Additional detail fields ---
    projectHeight: {
        type: String
    },
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
    constructionDetails: {
        type: String
    },
    pmayCategory: {
        type: String,
        enum: ['EWS', 'LIG', 'MIG-I', 'MIG-II', 'Not Applicable']
    },

    // Images array
    images: {
        type: [String]
    },

    // Listing status
    status: {
        type: String,
        enum: ['Available', 'On Hold', 'Sold'],
        default: 'Available',
        index: true
    },

    // Admin / feature flags
    isVerifiedByAdmin:   { type: Boolean, default: false },
    isActive:            { type: Boolean, default: true  },
    isFeatured:          { type: Boolean, default: false },
    isFinest:            { type: Boolean, default: false },
    isProjectOfTheMonth: { type: Boolean, default: false },
    isVastuCompliant:    { type: Boolean, default: false },
    isRERAApproved:      { type: Boolean, default: false },
    isPMAYApproved:      { type: Boolean, default: false }

}, {
    timestamps: true
});

// Model name 'Solo' is unchanged — preserves existing MongoDB collection
module.exports = mongoose.model('Solo', soloSchema);

const mongoose = require('mongoose');

const soloSchema = new mongoose.Schema({
    // 1. Ownership Link (Crucial for knowing who gets the buyer inquiries)
    listedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References your user collection
        required: true,
        index: true
    },

    // 2. Core Text Details
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
    area:{
        type: String,
        required: true
    },
    // 3. Pricing (Using numbers for price sorting: Low to High)
    price: {
        type: Number,
        required: [true, "Price is required"]
    },

    // 4. Cultural & Architectural Orientations
    vastu: {
        type: String,
        enum: ['Vastu Compliant', 'Non-Compliant', 'Unknown'], // Enums prevent random text strings
        trim: true,
        required: true
    },
    facing: {
        type: String,
        enum: ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'],
        required: true
    },
    ageOfProperty: {
        type: Number, // Storing as a number (e.g., 5 for 5 years old) allows "Max 10 years old" filters
        required: true
    },

    // 5. Accurate Sizing (Changed from String to Number for filter math)
    superBuiltUpAreaSize: {
        type: Number, // in sq.ft
        required: true
    },
    builtUpAreaSize: {
        type: Number, // in sq.ft
        required: true
    },
    carpetAreaSize: {
        type: Number, // in sq.ft
        required: true
    },

    // 6. Unit Configuration Layout (Changed to Numbers)
    noOfBedrooms: {
        type: Number, // e.g., 2 or 3 (corresponds to 2BHK/3BHK)
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

    // 7. Status & Meta Information
    furnishingStatus: {
        type: String,
        enum: ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'],
        required: true
    },
    parkingType: {
        type: String,
        enum: ['None', 'Open', 'Covered', 'Stilt', 'Basement', 'Podium', 'Mechanical/Automated', 'Multi-Level'],
        required: true
    },
    // --- New Resale Fields ---
    propertyType: {
        type: String,
        enum: ['Flat', 'Individual House', 'Land with Building'],
        default: 'Flat'
    },
    floor: {
        type: String
    },
    balconiesDetails: [{
        count: Number,
        size: String,
        facing: String
    }],
    buildingConfiguration: {
        type: String
    },
    carParkingDetails: {
        available: { type: Boolean, default: false },
        parkingType: { type: String }, // e.g., 'Open', 'Covered'
        area: { type: String },
        count: { type: Number, default: 0 }
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
        type: Boolean, // true if done
        default: false
    },
    leaseOrFreehold: {
        type: String,
        enum: ['Lease', 'Freehold']
    },
    sitePlanUrl: {
        type: String
    },
    completionCertificateUrl: {
        type: String
    },
    buildingPlanUrl: {
        type: String
    },
    isNegotiable: {
        type: Boolean,
        default: false
    },
    landArea: {
        type: String
    },
    // --- Additional Detailed Fields ---
    projectHeight: {
        type: String // e.g. 'G+4', '12 Floors'
    },
    liftDetails: {
        numberOfLifts: { type: Number, default: 0 },
        liftSize: { type: String },
        liftCompany: { type: String },
        serviceLiftAvailable: { type: Boolean, default: false }
    },
    servantQuarter: {
        available: { type: Boolean, default: false },
        location: { type: String } // e.g. 'Ground Floor', 'Terrace'
    },
    constructionDetails: {
        type: String // e.g. 'Bricks', 'Ash Bricks', 'Blocks', 'RCC'
    },
    pmayCategory: {
        type: String,
        enum: ['EWS', 'LIG', 'MIG-I', 'MIG-II', 'Not Applicable']
    },
    // -------------------------
    images: {
        type: [String] // Array of image URLs from Cloudinary/S3
    },
    status: {
        type: String,
        enum: ['Available', 'On Hold', 'Sold'],
        default: 'Available',
        index: true
    },
    isVerifiedByAdmin: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
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
    timestamps: true // Automatically gives you 'createdAt' and 'updatedAt' strings
});

module.exports = mongoose.model('Solo', soloSchema);
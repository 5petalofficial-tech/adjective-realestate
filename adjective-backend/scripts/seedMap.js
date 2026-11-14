/**
 * seedMap.js
 * ──────────
 * Run this ONCE to insert sample properties into MongoDB so the map shows pins.
 *
 * Usage (from the adjective-backend folder):
 *   node scripts/seedMap.js
 *
 * It reads your MONGODB_URI from the .env file automatically.
 * Safe to run multiple times — it checks before inserting to avoid duplicates.
 */

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const Dealer   = require("../src/modules/properties/dealer.model");

// ─── Sample properties — one per map area ───────────────────────────────────
const SAMPLE_PROPERTIES = [
  {
    legacyProjectName:  "Greenview Heights",
    projectName:        "PS One10",
    reraNumber:         "HIRA/P/NOR/2018/000136",
    description:        "WB RERA/HIRA registered residential project in Action Area I, New Town.",
    constructionStatus: "Ready to Move",
    locationArea:       "Action Area I",
    Area:               "Action Area I",
    location: {
      addressLine: "Plot 12, Action Area I",
      locality:    "New Town",
      city:        "Kolkata",
      state:       "West Bengal",
      pincode:     "700156",
      latitude:    22.5746,
      longitude:   88.4829,
    },
    priceRange:   { minPrice: 4500000, maxPrice: 8500000 },
    configurations: [{
      bhkType:             "2BHK",
      superBuiltUpAreaSize: 1050,
      builtUpAreaSize:      980,
      carpetAreaSize:       820,
      basePrice:            4500000,
    }],
    towers: [{ towerName: "Tower A", totalFloors: 12, totalUnitsCount: 48 }],
    media: { bannerImage: "https://placehold.co/800x500/5E6623/white?text=Greenview+Heights", projectGallery: [] },
    amenities:          ["Swimming Pool", "Gym", "24x7 Security", "Lift"],
    isActive:           true,
    isVerifiedByAdmin:  true,
    isFeatured:         true,
    builderId:          new mongoose.Types.ObjectId("000000000000000000000001"),
  },
  {
    legacyProjectName:  "Skyline Residency",
    projectName:        "Avenida",
    reraNumber:         "HIRA/P/NOR/2018/000102",
    description:        "WB RERA/HIRA registered project at Plot IIG/7, Action Area II, New Town.",
    constructionStatus: "Under Construction",
    locationArea:       "Action Area II",
    Area:               "Action Area II",
    location: {
      addressLine: "Block C, Action Area II",
      locality:    "New Town",
      city:        "Kolkata",
      state:       "West Bengal",
      pincode:     "700156",
      latitude:    22.6037,
      longitude:   88.4719,
    },
    priceRange:   { minPrice: 5500000, maxPrice: 11000000 },
    configurations: [{
      bhkType:             "3BHK",
      superBuiltUpAreaSize: 1450,
      builtUpAreaSize:      1320,
      carpetAreaSize:       1100,
      basePrice:            5500000,
    }],
    towers: [{ towerName: "Tower B", totalFloors: 18, totalUnitsCount: 72 }],
    media: { bannerImage: "https://placehold.co/800x500/3B5998/white?text=Skyline+Residency", projectGallery: [] },
    amenities:          ["Clubhouse", "Power Backup", "Gated Community", "Kids Play Area"],
    isActive:           true,
    isVerifiedByAdmin:  true,
    isFeatured:         false,
    builderId:          new mongoose.Types.ObjectId("000000000000000000000001"),
  },
  {
    legacyProjectName:  "Emerald Enclave",
    projectName:        "NBCC Square",
    reraNumber:         "HIRA/P/NOR/2020/000769",
    description:        "WB RERA/HIRA registered mixed-use project in Action Area III, New Town. The authority record flags an overdue quarterly status update.",
    constructionStatus: "New Launch",
    locationArea:       "Action Area III",
    Area:               "Action Area III",
    location: {
      addressLine: "New Town Road, Action Area III",
      locality:    "New Town",
      city:        "Kolkata",
      state:       "West Bengal",
      pincode:     "700157",
      latitude:    22.5600,
      longitude:   88.5000,
    },
    priceRange:   { minPrice: 7000000, maxPrice: 15000000 },
    configurations: [{
      bhkType:             "3BHK",
      superBuiltUpAreaSize: 1680,
      builtUpAreaSize:      1550,
      carpetAreaSize:       1280,
      basePrice:            7000000,
    }],
    towers: [{ towerName: "Tower C", totalFloors: 22, totalUnitsCount: 88 }],
    media: { bannerImage: "https://placehold.co/800x500/2E7D32/white?text=Emerald+Enclave", projectGallery: [] },
    amenities:          ["Swimming Pool", "Gym", "Jogging Track", "EV Charging Station"],
    isActive:           true,
    isVerifiedByAdmin:  true,
    isFeatured:         true,
    builderId:          new mongoose.Types.ObjectId("000000000000000000000001"),
  },
  {
    legacyProjectName:  "Royal Palm Township",
    projectName:        "Rishi Pranaya (Phase I)",
    reraNumber:         "HIRA/P/NOR/2019/000465",
    description:        "WB RERA/HIRA registered residential project in Rajarhat.",
    constructionStatus: "Ready to Move",
    locationArea:       "Rajarhat",
    Area:               "Rajarhat",
    location: {
      addressLine: "NH-12, Rajarhat",
      locality:    "Rajarhat",
      city:        "Kolkata",
      state:       "West Bengal",
      pincode:     "700135",
      latitude:    22.6286,
      longitude:   88.4406,
    },
    priceRange:   { minPrice: 3200000, maxPrice: 6500000 },
    configurations: [{
      bhkType:             "2BHK",
      superBuiltUpAreaSize: 900,
      builtUpAreaSize:      840,
      carpetAreaSize:       700,
      basePrice:            3200000,
    }],
    towers: [{ towerName: "Block A", totalFloors: 10, totalUnitsCount: 60 }],
    media: { bannerImage: "https://placehold.co/800x500/BF360C/white?text=Royal+Palm+Township", projectGallery: [] },
    amenities:          ["24x7 Security", "Gated Community", "Power Backup", "Lift"],
    isActive:           true,
    isVerifiedByAdmin:  true,
    isFeatured:         false,
    builderId:          new mongoose.Types.ObjectId("000000000000000000000001"),
  },
];

// ─── Main ────────────────────────────────────────────────────────────────────
async function seed() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌  MONGODB_URI not found in .env  — did you fill in your .env file?");
    process.exit(1);
  }

  console.log("🔗  Connecting to MongoDB...");
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB_NAME || "adjective" });
  console.log("✅  Connected!\n");

  let inserted = 0;
  let updated  = 0;
  let skipped  = 0;

  for (const prop of SAMPLE_PROPERTIES) {
    const exists = await Dealer.findOne({
      $or: [
        { reraNumber: prop.reraNumber },
        ...(prop.legacyProjectName
          ? [{ projectName: prop.legacyProjectName }]
          : []),
      ],
    });

    if (exists) {
      await Dealer.updateOne(
        { _id: exists._id },
        {
          $set: {
            projectName: prop.projectName,
            reraNumber: prop.reraNumber,
            description: prop.description,
            locationArea: prop.locationArea,
            Area: prop.Area,
            location: prop.location,
            isRERAApproved: true,
          },
        }
      );
      console.log(`🗺️   Updated map location for "${prop.projectName}"`);
      updated++;
      continue;
    }

    await Dealer.create(prop);
    console.log(`📍  Inserted "${prop.projectName}" in ${prop.locationArea}`);
    inserted++;
  }

  console.log(`\n✅  Done! Inserted: ${inserted}, Updated: ${updated}, Skipped: ${skipped}`);
  console.log("🗺️   Refresh your browser — red pins should now appear on the map!\n");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err.message);
  process.exit(1);
});

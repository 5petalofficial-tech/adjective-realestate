const mongoose = require('mongoose');

const Solo = require('../schema/solo');

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_APP_PASSWORD,
  },
});

const formatRelativePath = (p) => {
    if (!p) return "";
    let clean = p.replace(/\\/g, "/");
    const idx = clean.toLowerCase().indexOf("uploads/");
    if (idx !== -1) {
        return clean.slice(idx);
    }
    return clean;
};

// @desc    Create a new solo resale property listing
// @route   POST /api/solo/add or /api/solo/create
// @access  Public / Private
const createSoloProperty = async (req, res) => {
    try {
        const imagePaths = req.files && req.files['images'] ? req.files['images'].map(file => formatRelativePath(file.path)) : [];
        const sitePlanUrl = req.files && req.files['sitePlanUrl'] ? formatRelativePath(req.files['sitePlanUrl'][0].path) : undefined;
        const completionCertificateUrl = req.files && req.files['completionCertificateUrl'] ? formatRelativePath(req.files['completionCertificateUrl'][0].path) : undefined;
        const buildingPlanUrl = req.files && req.files['buildingPlanUrl'] ? formatRelativePath(req.files['buildingPlanUrl'][0].path) : undefined;

        let listedBy = req.body.listedBy;
        if (!listedBy || !mongoose.Types.ObjectId.isValid(listedBy)) {
            listedBy = new mongoose.Types.ObjectId("650000000000000000000000");
        }
;
        const {
            name, 
            overview, 
            address, 
            area,
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
            // New Resale Fields
            propertyType, floor, balconiesDetails, buildingConfiguration, carParkingDetails,
            handoverDate, loanPossible, numberOfTowers, roadWidth, propertyTitle,
            liabilities, taxMutation, leaseOrFreehold, isNegotiable, landArea,
            // Additional Detail Fields
            projectHeight, liftDetails, servantQuarter, constructionDetails
        } = req.body;
        
        let parsedBalconiesDetails, parsedCarParkingDetails, parsedLiftDetails, parsedServantQuarter;
        try { parsedBalconiesDetails = balconiesDetails ? JSON.parse(balconiesDetails) : []; } catch (e) { parsedBalconiesDetails = []; }
        try { parsedCarParkingDetails = carParkingDetails ? JSON.parse(carParkingDetails) : {}; } catch (e) { parsedCarParkingDetails = {}; }
        try { parsedLiftDetails = liftDetails ? JSON.parse(liftDetails) : {}; } catch (e) { parsedLiftDetails = {}; }
        try { parsedServantQuarter = servantQuarter ? JSON.parse(servantQuarter) : {}; } catch (e) { parsedServantQuarter = {}; }

        const descriptionWithOwnerInfo = overview 
            ? `${overview}${contactName || contactPhone ? `\n\n[Owner Contact: ${contactName || 'N/A'}, Phone: ${contactPhone || 'N/A'}, Email: ${contactEmail || 'N/A'}]` : ''}`
            : `Submitted by ${contactName || 'User'} (${contactPhone || 'No Phone'}, ${contactEmail || 'No Email'})`;

        const newProperty = await Solo.create({
            listedBy,
            name: name || "Resale Property",
            overview: descriptionWithOwnerInfo,
            address: address || area || "Kolkata",
            area: area || address || "Kolkata",
            price: Number(price) || 0,
            vastu: vastu || "Vastu Compliant",
            facing: facing || "East",
            ageOfProperty: Number(ageOfProperty) || 1,
            superBuiltUpAreaSize: Number(superBuiltUpAreaSize) || 1000,
            builtUpAreaSize: Number(builtUpAreaSize) || Number(superBuiltUpAreaSize) || 1000,
            carpetAreaSize: Number(carpetAreaSize) || Number(superBuiltUpAreaSize) || 800,
            noOfBedrooms: Number(noOfBedrooms) || 3,
            noOfToilets: Number(noOfToilets) || 2,
            noOfBalconies: Number(noOfBalconies) || 1,
            furnishingStatus: furnishingStatus || "Semi-Furnished",
            parkingType: parkingType || "Covered",
            // If submitted from public sell form without explicit status, default to 'On Hold' (Pending Approval)
            status: status || 'On Hold',
            isVerifiedByAdmin: isVerifiedByAdmin === 'true' || isVerifiedByAdmin === true || false,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            isFinest: isFinest === 'true' || isFinest === true,
            isProjectOfTheMonth: isProjectOfTheMonth === 'true' || isProjectOfTheMonth === true,
            isVastuCompliant: isVastuCompliant === 'true' || isVastuCompliant === true,
            isRERAApproved: isRERAApproved === 'true' || isRERAApproved === true,
            isPMAYApproved: isPMAYApproved === 'true' || isPMAYApproved === true,
            // New Fields
            propertyType: propertyType || 'Flat',
            floor,
            balconiesDetails: parsedBalconiesDetails,
            buildingConfiguration,
            carParkingDetails: parsedCarParkingDetails,
            handoverDate,
            loanPossible: loanPossible === 'true' || loanPossible === true,
            numberOfTowers: Number(numberOfTowers) || 1,
            roadWidth,
            propertyTitle,
            liabilities,
            taxMutation: taxMutation === 'true' || taxMutation === true,
            leaseOrFreehold,
            sitePlanUrl,
            completionCertificateUrl,
            buildingPlanUrl,
            isNegotiable: isNegotiable === 'true' || isNegotiable === true,
            landArea,
            // Additional Detail Fields
            projectHeight,
            liftDetails: parsedLiftDetails,
            servantQuarter: parsedServantQuarter,
            constructionDetails,
            images: imagePaths.length > 0 ? imagePaths : ["/Projects/One10.webp"]
        });
         const emailFields = {
    "Property Name": name,
    "Property Title": propertyTitle,
    "Property Type": propertyType,
    "Overview": descriptionWithOwnerInfo,
    "Address": address,
    "Area": area,
    "Price": price,
    "Vastu": vastu,
    "Facing": facing,
    "Age Of Property": ageOfProperty,
    "Super Built Up Area": superBuiltUpAreaSize,
    "Built Up Area": builtUpAreaSize,
    "Carpet Area": carpetAreaSize,
    "Bedrooms": noOfBedrooms,
    "Toilets": noOfToilets,
    "Balconies": noOfBalconies,
    "Furnishing Status": furnishingStatus,
    "Parking Type": parkingType,

    "Floor": floor,
    "Building Configuration": buildingConfiguration,
    "Car Parking Details": JSON.stringify(parsedCarParkingDetails),
    "Balconies Details": JSON.stringify(parsedBalconiesDetails),
    "Handover Date": handoverDate,
    "Loan Possible": loanPossible,
    "Number Of Towers": numberOfTowers,
    "Road Width": roadWidth,
    "Liabilities": liabilities,
    "Tax Mutation": taxMutation,
    "Lease / Freehold": leaseOrFreehold,
    "Negotiable": isNegotiable,
    "Land Area": landArea,

    "Project Height": projectHeight,
    "Lift Details": JSON.stringify(parsedLiftDetails),
    "Servant Quarter": JSON.stringify(parsedServantQuarter),
    "Construction Details": constructionDetails,

    "Owner Name": contactName,
    "Owner Phone": contactPhone,
    "Owner Email": contactEmail,

    "Status": status || "On Hold",
    "RERA Approved": isRERAApproved,
    "PMAY Approved": isPMAYApproved,
    "Vastu Compliant": isVastuCompliant
};
const emailHtml = `
  <h2>New Property Submission</h2>

  <p>A new property has been submitted from the Sell Property form.</p>

  <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
    ${Object.entries(emailFields)
      .map(
        ([key, value]) => `
          <tr>
            <td style="font-weight: bold;">${key}</td>
            <td>${value ?? "N/A"}</td>
          </tr>
        `
      )
      .join("")}
  </table>

  <br/>

  <p><strong>MongoDB Property ID:</strong> ${newProperty._id}</p>
`;

try {
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: "adjectiverealestate@gmail.com",
    subject: `New Property Submission - ${contactName || "Unknown Owner"}`,
    html: emailHtml,
  });

  console.log("Property email sent successfully");
} catch (emailError) {
  console.error("Property email sending failed:", emailError);
};
// const emailHtml = Object.entries(emailFields)
//     .map(([label, value]) => `
//         <tr>
//             <td style="padding:8px;border:1px solid #ddd;font-weight:bold;">
//                 ${label}
//             </td>
//             <td style="padding:8px;border:1px solid #ddd;">
//                 ${value !== undefined && value !== null && value !== "" ? value : "N/A"}
//             </td>
//         </tr>
//     `)
//     .join("");

// try {
//     await transporter.sendMail({
//         from: process.env.MAIL_USER,
//         to: "adjectiverealestate@gmail.com",
//         replyTo: contactEmail || undefined,
//         subject: `New Property Submission - ${propertyTitle || name || "Resale Property"}`,
//         html: `
//             <div style="font-family:Arial,sans-serif;">
//                 <h2>New Property Submission</h2>

//                 <p>
//                     A new property has been submitted from the Sell Property form.
//                 </p>

//                 <table style="border-collapse:collapse;width:100%;max-width:800px;">
//                     ${emailHtml}
//                 </table>

//                 <p style="margin-top:20px;">
//                     <strong>MongoDB Property ID:</strong>
//                     ${newProperty._id}
//                 </p>
//             </div>
//         `
//     });

//     console.log("Property submission email sent successfully.");
// } catch (emailError) {
//     console.error("Property saved, but email sending failed:", emailError);
// }
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

const getAllSoloProperties = async (req, res) => {
    try {
        const properties = await Solo.find().populate('listedBy', 'First_name Last_name');
        return res.status(200).json({ success: true, properties });
    } catch (error) {
        console.error("Error fetching solo properties:", error);
        return res.status(500).json({ success: false, message: "Internal server error while fetching properties." });
    }
};

const getSoloPropertyById = async (req, res) => {
    try {
        const property = await Solo.findById(req.params.id).populate('listedBy', 'First_name Last_name');
        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found." });
        }
        return res.status(200).json({ success: true, property });
    } catch (error) {
        console.error("Error fetching solo property:", error);
        return res.status(500).json({ success: false, message: "Internal server error while fetching property." });
    }
};

// @desc    Update a solo property (e.g. approve/publish, status, fields)
// @route   PUT /api/solo/:id
// @access  Private
const updateSoloProperty = async (req, res) => {
    try {
        let property = await Solo.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found." });
        }

        // Merge uploaded images if provided
        const imagePaths = req.files && req.files['images'] ? req.files['images'].map(file => formatRelativePath(file.path)) : [];
        if (imagePaths.length > 0) {
            req.body.images = imagePaths;
        }

        if (req.files && req.files['sitePlanUrl']) req.body.sitePlanUrl = formatRelativePath(req.files['sitePlanUrl'][0].path);
        if (req.files && req.files['completionCertificateUrl']) req.body.completionCertificateUrl = formatRelativePath(req.files['completionCertificateUrl'][0].path);
        if (req.files && req.files['buildingPlanUrl']) req.body.buildingPlanUrl = formatRelativePath(req.files['buildingPlanUrl'][0].path);

        if (req.body.balconiesDetails && typeof req.body.balconiesDetails === 'string') {
            try { req.body.balconiesDetails = JSON.parse(req.body.balconiesDetails); } catch(e){}
        }
        if (req.body.carParkingDetails && typeof req.body.carParkingDetails === 'string') {
            try { req.body.carParkingDetails = JSON.parse(req.body.carParkingDetails); } catch(e){}
        }
        if (req.body.liftDetails && typeof req.body.liftDetails === 'string') {
            try { req.body.liftDetails = JSON.parse(req.body.liftDetails); } catch(e){}
        }
        if (req.body.servantQuarter && typeof req.body.servantQuarter === 'string') {
            try { req.body.servantQuarter = JSON.parse(req.body.servantQuarter); } catch(e){}
        }

        if (req.body.loanPossible !== undefined) req.body.loanPossible = req.body.loanPossible === 'true' || req.body.loanPossible === true;
        if (req.body.taxMutation !== undefined) req.body.taxMutation = req.body.taxMutation === 'true' || req.body.taxMutation === true;
        if (req.body.isNegotiable !== undefined) req.body.isNegotiable = req.body.isNegotiable === 'true' || req.body.isNegotiable === true;

        // Update the document
        property = await Solo.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        return res.status(200).json({ success: true, property });
    } catch (error) {
        console.error("Error updating property:", error);
        return res.status(500).json({ success: false, message: "Server error while updating." });
    }
};

// @desc    Delete a solo property
// @route   DELETE /api/solo/:id
// @access  Private
const deleteSoloProperty = async (req, res) => {
    try {
        const property = await Solo.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found." });
        }

        await property.deleteOne();

        return res.status(200).json({ success: true, message: "Property deleted successfully." });
    } catch (error) {
        console.error("Error deleting property:", error);
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
const router = require('express').Router();
const {
    createSoloProperty,
    getAllSoloProperties,
    getSoloPropertyById,
    updateSoloProperty,
    deleteSoloProperty
} = require('./solo.controller');
const upload = require('../../utils/uploadSolo');

// Multer field configuration.
// Switched from upload.array() to upload.fields() to support both image arrays
// and named single-file document fields (sitePlanUrl, completionCertificateUrl,
// buildingPlanUrl) that the merged controller now expects in req.files.
const soloUploads = upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'sitePlanUrl', maxCount: 1 },
    { name: 'completionCertificateUrl', maxCount: 1 },
    { name: 'buildingPlanUrl', maxCount: 1 }
]);

// Health check
router.get('/test', (req, res) => {
    res.status(200).json({ message: "Solo Route Active" });
});

// CRUD — both /create and /add preserved for backward compatibility
router.post('/create', soloUploads, createSoloProperty);
router.post('/add', soloUploads, createSoloProperty);
router.get('/all', getAllSoloProperties);
router.get('/:id', getSoloPropertyById);
router.put('/:id', soloUploads, updateSoloProperty);
router.delete('/:id', upload.none(), deleteSoloProperty);

module.exports = router;

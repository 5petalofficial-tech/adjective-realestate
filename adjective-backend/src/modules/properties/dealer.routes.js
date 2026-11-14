const router = require('express').Router();
const dealerCtrl = require('./dealer.controller');
const upload = require('../../utils/uploadDealer');

// Multer field configuration — must match every field the controller reads from req.files
// Legacy added floorPlanUrl; modular was missing it. Both are now included.
const multipleUploads = upload.fields([
    { name: 'bannerImage', maxCount: 1 },
    { name: 'projectGallery', maxCount: 15 },
    { name: 'brochureUrl', maxCount: 1 },
    { name: 'floorPlanUrl', maxCount: 1 }
]);

// Health check
router.get('/test', (req, res) => {
    res.status(200).json({ message: "Dealer Route Active" });
});

// CRUD
router.post('/add', multipleUploads, dealerCtrl.createDealerProperty);
router.get('/all', dealerCtrl.getAllDealerProperties);
router.get('/:id', dealerCtrl.getDealerPropertyById);
router.patch('/:id', multipleUploads, dealerCtrl.updateDealerProperty);
router.delete('/:id', dealerCtrl.deleteDealerProperty);

module.exports = router;

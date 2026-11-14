const srouter = require('express').Router();
const { createSoloProperty, getAllSoloProperties, getSoloPropertyById, updateSoloProperty, deleteSoloProperty } = require('../controllers/soloctrl');
const solo = require('../schema/solo');
const upload = require('../utils/uploadSolo');

srouter.get('/', (req, res) => {
    res.status(200).json({ "message": "Solo Route" })
})

srouter.post('/create', upload.fields([{ name: 'images', maxCount: 5 }, { name: 'sitePlanUrl', maxCount: 1 }, { name: 'completionCertificateUrl', maxCount: 1 }, { name: 'buildingPlanUrl', maxCount: 1 }]), createSoloProperty);


srouter.post('/add', upload.fields([{ name: 'images', maxCount: 5 }, { name: 'sitePlanUrl', maxCount: 1 }, { name: 'completionCertificateUrl', maxCount: 1 }, { name: 'buildingPlanUrl', maxCount: 1 }]), createSoloProperty);


srouter.get('/all', getAllSoloProperties);


srouter.get('/:id', getSoloPropertyById);


srouter.put('/:id', upload.fields([{ name: 'images', maxCount: 5 }, { name: 'sitePlanUrl', maxCount: 1 }, { name: 'completionCertificateUrl', maxCount: 1 }, { name: 'buildingPlanUrl', maxCount: 1 }]), updateSoloProperty);


srouter.delete('/:id', upload.none(), deleteSoloProperty);





module.exports = srouter;
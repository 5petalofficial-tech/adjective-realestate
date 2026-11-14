const drouter = require('express').Router();
const dealerCtrl = require('../controllers/dealerctrl');
const upload = require('../utils/uploadDealer');

const multipleUploads = upload.fields([
    { name: 'bannerImage', maxCount: 1 },
    { name: 'projectGallery', maxCount: 15 },
    { name: 'brochureUrl', maxCount: 1 },
    { name: 'floorPlanUrl', maxCount: 1 }
]);
drouter.get('/',(req,res)=>{
    res.status(200).json({"message":"Dealer Route"})
})
drouter.post('/add', multipleUploads, dealerCtrl.createDealerProperty);
drouter.get('/all', dealerCtrl.getAllDealerProperties);
drouter.get('/:id', dealerCtrl.getDealerPropertyById);
drouter.patch('/:id', multipleUploads, dealerCtrl.updateDealerProperty);
drouter.delete('/:id', dealerCtrl.deleteDealerProperty);


module.exports = drouter;
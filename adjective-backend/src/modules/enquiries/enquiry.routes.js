const router = require('express').Router();
const { createEnquiry, getEnquiries, updateEnquiryStatus, deleteEnquiry } = require('./enquiry.controller');

router.post('/', createEnquiry);
router.get('/', getEnquiries);
router.put('/:id', updateEnquiryStatus);
router.delete('/:id', deleteEnquiry);

module.exports = router;

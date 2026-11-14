const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    required: true
  },
  enquiryType: {
    type: String,
    default: 'Book Visit'
  },
  propertyName: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'Contacted', 'Resolved'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Enquiry = mongoose.model('Enquiry', enquirySchema);
module.exports = Enquiry;

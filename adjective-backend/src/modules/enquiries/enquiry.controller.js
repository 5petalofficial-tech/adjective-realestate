const Enquiry = require('./enquiry.model');

const createEnquiry = async (req, res) => {
  const { name, email, phone, enquiryType, propertyName, message } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ message: "Name, email, and phone are required" });
  }

  try {
    const newEnquiry = new Enquiry({
      name,
      email,
      phone,
      enquiryType: enquiryType || 'Book Visit',
      propertyName: propertyName || '',
      message: message || ''
    });
    await newEnquiry.save();
    return res.status(201).json({ message: "Enquiry submitted successfully", enquiry: newEnquiry });
  } catch (error) {
    console.error("Error creating enquiry:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    return res.status(200).json(enquiries);
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateEnquiryStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['Pending', 'Contacted', 'Resolved'].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const enquiry = await Enquiry.findByIdAndUpdate(id, { status }, { new: true });
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    return res.status(200).json({ message: "Enquiry status updated successfully", enquiry });
  } catch (error) {
    console.error("Error updating enquiry:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteEnquiry = async (req, res) => {
  const { id } = req.params;
  try {
    const enquiry = await Enquiry.findByIdAndDelete(id);
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    return res.status(200).json({ message: "Enquiry deleted successfully" });
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry
};

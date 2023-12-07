const asyncHandler = require("express-async-handler");
const Patient = require("../model/Patient");

// @desc    Get patient data
// @route   GET /api/patient/patientInfo
// @access  Private
const patientInfo = asyncHandler(async (req, res) => {
    console.log(req.body.email); // Access the email from the request body
    const foundPatient = await Patient.findOne({ email: req.body.email }).select('-password');
  
    if (foundPatient) {
      console.log(foundPatient);
      res.status(200).json(foundPatient);
    } else {
      // Patient not found, send a 404 Not Found response
      res.status(404).json({ error: 'Patient not found' });
    }
  });
  
  
  
module.exports = patientInfo;

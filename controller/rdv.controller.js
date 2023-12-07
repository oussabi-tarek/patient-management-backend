const Rdv = require('../model/Rdv');
const Patient = require('../model/Patient');
const Medecin = require('../model/Medecin');
const jwt = require('jsonwebtoken');

exports.getAppointmentsForPatient = async (req, res) => {
  // Extract the JWT token from the request headers
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token not provided' });
  }

  try {
    // Verify the JWT token and extract the patient ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const patientId = decoded.patientId;

    // Now we can use the patientId to fetch appointments
    const appointments = await Rdv.find({ patient: patientId });
    res.json(appointments);
  } catch (error) {
    // Handle token verification or database errors
    res.status(500).json({ error: error.message });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const { date, cause, documents, consultation } = req.body;

    // Extract the patient ID from the JWT token
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token not provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    const patientId = decoded.patientId;

    // Fetch patient information using the obtained patientId
    const patient = await Patient.findById(patientId);

    // Fetch medecin information from the patient model
    const medecinId = patient.medecin;
    const medecin = await Medecin.findById(medecinId);

    // Check if an appointment already exists for the specified date and medecin
    const existingAppointment = await Rdv.findOne({ date: date, medecin: medecinId });
    if (existingAppointment) {
      return res.status(400).json({ error: 'An appointment already exists for the specified date and medecin.' });
    }

    // Create a new appointment with the obtained information
    const newAppointment = new Rdv({
      date,
      cause,
      etat: 'réel', // Set etat to 'réel'
      documents,
      patient: patient._id, // Use the obtained patient ID
      medecin: medecin._id, // Use the obtained medecin ID
      consultation,
    });

    // Save the new appointment
    const savedAppointment = await newAppointment.save();
    res.json(savedAppointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { date, cause, documents, consultation } = req.body;

    // Extract the patient ID from the JWT token
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token not provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const patientId = decoded.patientId;

    // Fetch the existing appointment
    const existingAppointment = await Rdv.findById(appointmentId);
    if (!existingAppointment) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }

    // Check if the patient updating the appointment matches the patient associated with the appointment
    if (existingAppointment.patient.toString() !== patientId) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to update this appointment.' });
    }

    // Update the appointment fields
    existingAppointment.date = date;
    existingAppointment.cause = cause;
    existingAppointment.documents = documents;
    existingAppointment.consultation = consultation;

    // Save the updated appointment
    const updatedAppointment = await existingAppointment.save();
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;

     // Extract the patient ID from the JWT token
     const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
     if (!token) {
       return res.status(401).json({ error: 'Unauthorized: Token not provided' });
     }
 
     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your actual secret key
     const patientId = decoded.patientId;

    // Find the appointment
    const existingAppointment = await Rdv.findById(appointmentId);
    if (!existingAppointment) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }

    // Check if the patient deleting the appointment matches the patient associated with the appointment
    if (existingAppointment.patient.toString() !== patientId) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to delete this appointment.' });
    }

    // Delete the appointment
    const deletedAppointment = await Rdv.findByIdAndDelete(appointmentId);
    if (!deletedAppointment) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }

    res.json({ message: 'Appointment deleted successfully.' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


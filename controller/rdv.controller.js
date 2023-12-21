const Rdv = require('../model/Rdv');
const Patient = require('../model/Patient');
const Medecin = require('../model/Medecin');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = multer().single('documents');
const moment = require('moment');

exports.getAppointmentsForPatient = async (req, res) => {
  // Extract the JWT token from the request headers
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token not provided' });
  }

  try {
    // Verify the JWT token and extract the patient ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const patientId = decoded.id;
    console.log("patientId:"+decoded.id);

    // Now we can use the patientId to fetch appointments
    const appointments = await Rdv.find({ patient: patientId });
    res.json(appointments);
  } catch (error) {
    // Handle token verification or database errors
    res.status(500).json({ error: error.message });
  }
};

exports.getAppointmentsForDoctor=async(req,res)=>{
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  const dateday = req.params.date;
  const isitToday = new Date(dateday).getDay===new Date().getDay && new Date(dateday).getMonth===new Date().getMonth && new Date(dateday).getFullYear===new Date().getFullYear;
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token not provided' });
  }
  try {
    // Verify the JWT token and extract the patient ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const doctorId = decoded.id;

    // Now we can use the patientId to fetch appointments
      const appointments = await Rdv.find({ medecin: doctorId,
      date:{
        $gte: isitToday ? new Date(dateday):new Date(dateday).setHours(0,0,0,0),
        $lt:  new Date(dateday).setHours(23,59,59,999)
      } }).populate({
        path: 'patient',
        select:'-__v -password -medecins'
      }).exec();

    res.json(appointments);
  } catch (error) {
    // Handle token verification or database errors
    res.status(500).json({ error: error.message });
  }
}

exports.getCurrentAppointmentForDoctor=async(req,res)=>{
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  const dateday = new Date();
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token not provided' });
  }
  try {
    // Verify the JWT token and extract the patient ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const doctorId = decoded.id;
    console.log("date:"+dateday);
    console.log("dat2:"+new Date(dateday.getTime() + 60 * 60 * 1000));
    // Now we can use the patientId to fetch appointments
      const appointments = await Rdv.find({ medecin: doctorId,
      date:{
        $gte: dateday,
        $lt: new Date(dateday.getTime() + 60 * 60 * 1000)
      } }).populate({
        path: 'patient',
        select:'-__v -password -medecins'
      }).exec();
    console.log(appointments);
    res.json(appointments);
  } catch (error) {
    // Handle token verification or database errors
    res.status(500).json({ error: error.message });
  }
}

exports.getAppointmentsForDoctorAndPatient=async(req,res)=>{
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  const patientId = req.params.patientId;
  const doctorId = req.params.doctorId;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token not provided' });
  }
  try {
    // Verify the JWT token and extract the patient ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Now we can use the patientId to fetch appointments
      const appointments = await Rdv.find({ medecin: doctorId,patient:patientId}).populate({
        path: 'patient',
        select:'-__v -password'
      }).exec();
    res.json(appointments);
  } catch (error) {
    // Handle token verification or database errors
    res.status(500).json({ error: error.message });
  }
}

exports.createAppointment = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'File upload failed.' });
      }

      const { date, cause, type, medecinId } = req.body;

      // Extract the patient ID from the JWT token
      const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Token not provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const patientId = decoded.id;

      // Fetch patient information using the obtained patientId
      const patient = await Patient.findById(patientId);
      console.log("patient:"+patient);

      // Check if the medecin has an appointment on the same date
      const medecinExistingAppointment = await Rdv.findOne({ date, medecin: medecinId });

      // Create a new appointment with the obtained information
      const newAppointment = new Rdv({
        date,
        cause,
        type,
        etat:'',
        documents: req.file!==undefined ? req.file.buffer:[],
        patient: patient._id,
        medecin: medecinId,
      });

      // Set etat based on medecin's existing appointment and patient's medecin list
      if (medecinExistingAppointment) {
        return res.status(400).json({ error: 'Selected medecin already has an appointment on the specified date.' });
      } else if (patient.medecins.includes(medecinId)) {
        newAppointment.etat = 'réel'; // Set etat to 'réel' if the patient has the selected medecin in their list
      } else {
        newAppointment.etat = 'en attente'; // Set etat to 'en attente' if the patient does not have the selected medecin in their list
      }

      // Save the new appointment
      const savedAppointment = await newAppointment.save();
      res.json(savedAppointment);
    });
  } catch (error) {
    console.error('Error creating appointment:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'File upload failed.' });
      }
      const appointmentId = req.params.id;
      const { date, cause, type } = req.body;

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

      // If the date is being modified, check if the medecin has an appointment on the chosen date
      if (date && date !== moment(existingAppointment.date).format('YYYY-MM-DD')) {
        const medecinExistingAppointment = await Rdv.findOne({ date, medecin: existingAppointment.medecin });
        if (medecinExistingAppointment) {
          return res.status(400).json({ error: 'Selected medecin already has an appointment on the specified date.' });
        }
      }

      // Update the appointment fields
      existingAppointment.date = date || existingAppointment.date;
      existingAppointment.cause = cause || existingAppointment.cause;
      existingAppointment.type = type || existingAppointment.type;
      existingAppointment.documents = req.file?.buffer || existingAppointment.documents;

      // Save the updated appointment
      const updatedAppointment = await existingAppointment.save();
      res.json(updatedAppointment);
    });
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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


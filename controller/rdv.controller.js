const Rdv = require('../model/Rdv');
const Patient = require('../model/Patient');
const Medecin = require('../model/Medecin');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const storage = multer.memoryStorage(); // Store files in memory as buffers
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Adjust the file size limit as needed
}).array('documents', 5); // 'documents' is the field name for the files, and 5 is the maximum number of files
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
    const patientId = decoded.userId;
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
      }).populate({
        path: 'medecin',
        select:'-__v -password',
        populate:{
          path:'service',
          select:'libelle'
        }
      }).populate({
        path: 'consultation',
        select:'-__v',
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

      const { date, time, cause, type, medecinId } = req.body;
      const documents = req.files.map(file => ({
        name: file.originalname,
        type: file.mimetype,
        data: file.buffer,
      }));

      // Extract the patient ID from the JWT token
      const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Token not provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const patientId = decoded.userId;

      // Fetch patient information using the obtained patientId
      const patient = await Patient.findById(patientId);
      console.log("patient:", patient);

      // Combine date and time into a single string representing datetime
      const datetimeString = `${date}T${time.padStart(5, '0')}:00.000+00:00`;
      console.log('datetimeString:', datetimeString);

      const datetime = new Date(datetimeString);
      console.log('datetime:', datetime);

      // Check if the medecin has an appointment on the same date
      const medecinExistingAppointment = await Rdv.findOne({ date: datetime, medecin: medecinId });

      // Create a new appointment with the obtained information
      const newAppointment = new Rdv({
        date: datetime,
        cause,
        type,
        etat: '',
        documents: documents,
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
      const { date, time, cause, type } = req.body;

      // Extract the patient ID from the JWT token
      const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Token not provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const patientId = decoded.userId;

      // Fetch the existing appointment
      const existingAppointment = await Rdv.findById(appointmentId);
      if (!existingAppointment) {
        return res.status(404).json({ error: 'Appointment not found.' });
      }

      // Check if the patient updating the appointment matches the patient associated with the appointment
      if (existingAppointment.patient.toString() !== patientId) {
        return res.status(403).json({ error: 'Forbidden: You do not have permission to update this appointment.' });
      }

      // Combine date and time into a single string representing datetime
      const datetimeString = time ? `${date}T${time.padStart(5, '0')}:00.000+00:00` : existingAppointment.date;
      const datetime = new Date(datetimeString);

      // If documents are provided and the array is valid, update them
      if (req.body.documents && Array.isArray(req.body.documents)) {
        // Filter out existing documents with the same name
        const newDocuments = req.body.documents.filter(newDoc => {
          return !existingAppointment.documents.some(existingDoc => existingDoc.name === newDoc.name);
        });

        // If documents are provided and the array is valid, update them
        if (req.body.documents && Array.isArray(req.body.documents)) {
          // Filter out existing documents with the same name
          const newDocuments = req.body.documents.filter(newDoc => {
            return !existingAppointment.documents.some(existingDoc => existingDoc.name === newDoc.name);
          });

          // Append new documents to the existing ones
          existingAppointment.documents = [
            ...existingAppointment.documents,
            ...newDocuments.map(doc => ({
              name: doc.name,
              type: doc.type,
              data: doc.data ? Buffer.from(doc.data, 'base64') : undefined,
            })),
          ];
        }
      }

      // Update the appointment fields
      existingAppointment.date = time ? datetime : existingAppointment.date;
      existingAppointment.cause = cause || existingAppointment.cause;
      existingAppointment.type = type || existingAppointment.type;

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
    const patientId = decoded.userId;

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

exports.downloadDocument = async (req, res) => {
  try {
    const { rdvId, index } = req.params;
    const appointment = await Rdv.findById(rdvId);

    if (!appointment || !appointment.documents[index]) {
      return res.status(404).send('File not found');
    }

    const document = appointment.documents[index];

    res.set({
      'Content-Type': document.type,
      'Content-Disposition': `attachment; filename="${document.name}"`,
    });

    res.send(document.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.checkAvailability = async (req, res) => {
  try {
    const { doctorId, date } = req.body;

    // Set the start and end of the requested date
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1); // Set it to the next day

    // Check if any appointments exist for the requested date
    const existingAppointments = await Rdv.find({
      medecin: doctorId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
      etat: { $ne: 'annulé' },
    });

    console.log(existingAppointments);

    res.json({ existingAppointments });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { appointmentId, documentIndex } = req.params;

    // Fetch the appointment by ID
    const appointment = await Rdv.findById(appointmentId);

    // Check if the documentIndex is valid
    if (documentIndex < 0 || documentIndex >= appointment.documents.length) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Remove the document from the appointment's documents array
    appointment.documents.splice(documentIndex, 1);

    // Save the updated appointment
    await appointment.save();

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
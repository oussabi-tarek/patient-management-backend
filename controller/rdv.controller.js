const Rdv = require('../model/Rdv');
const Patient = require('../model/Patient');
const Medecin = require('../model/Medecin');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = multer().single('documents');
const moment = require('moment');
const Assisstant = require('../model/Assistant');

exports.getAppointmentsForPatient = async (req, res) => {
  // Extract the JWT token from the request headers
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token not provided' });
  }

  try {
    // Verify the JWT token and extract the patient ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //const patientId = decoded.userId;
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
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token not provided' });
  }
  try {
    // Verify the JWT token and extract the patient ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const doctorId = decoded.id;

    // Now we can use the patientId to fetch appointments
    const appointments = await Rdv.find({ medecin: doctorId });
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
      const patientId = decoded.userId;

      // Fetch patient information using the obtained patientId
      const patient = await Patient.findById(patientId);

      // Check if the medecin has an appointment on the same date
      const medecinExistingAppointment = await Rdv.findOne({ date, medecin: medecinId });

      // Create a new appointment with the obtained information
      const newAppointment = new Rdv({
        date,
        cause,
        type,
        etat:'',
        documents: [
          {
            name: req.file.originalname,
            type: req.file.mimetype,
            data: req.file.buffer,
          },
        ],
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

// exports.updateAppointment = async (req, res) => {
//   try {
//     upload(req, res, async (err) => {
//       if (err) {
//         return res.status(400).json({ error: 'File upload failed.' });
//       }
//       const appointmentId = req.params.id;
//       const { date, cause, type } = req.body;

//       // Extract the patient ID from the JWT token
//       const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
//       if (!token) {
//         return res.status(401).json({ error: 'Unauthorized: Token not provided' });
//       }
      
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const patientId = decoded.userId;

//       // Fetch the existing appointment
//       const existingAppointment = await Rdv.findById(appointmentId);
//       if (!existingAppointment) {
//         return res.status(404).json({ error: 'Appointment not found.' });
//       }

//       // Check if the patient updating the appointment matches the patient associated with the appointment
//       if (existingAppointment.patient.toString() !== patientId) {
//         return res.status(403).json({ error: 'Forbidden: You do not have permission to update this appointment.' });
//       }

//       // If the date is being modified, check if the medecin has an appointment on the chosen date
//       if (date && date !== moment(existingAppointment.date).format('YYYY-MM-DD')) {
//         const medecinExistingAppointment = await Rdv.findOne({ date, medecin: existingAppointment.medecin });
//         if (medecinExistingAppointment) {
//           return res.status(400).json({ error: 'Selected medecin already has an appointment on the specified date.' });
//         }
//       }

//       // Update the appointment fields
//       existingAppointment.date = date || existingAppointment.date;
//       existingAppointment.cause = cause || existingAppointment.cause;
//       existingAppointment.type = type || existingAppointment.type;
//       if (req.body.documents && req.body.documents.data) {
//         existingAppointment.documents = [{
//           name: req.body.documents.name,
//           type: req.body.documents.type,
//           data: Buffer.from(req.body.documents.data, 'base64'),
//         }];
//       }
//       // Save the updated appointment
//       const updatedAppointment = await existingAppointment.save();
//       res.json(updatedAppointment);
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.updateAppointment = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'File upload failed.' });
      }

      const appointmentId = req.params.id;
      const { date, cause, type } = req.body;

      // Extract the JWT token from the request headers
      const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

      if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Token not provided' });
      }

      // Extract the user ID from the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      // Fetch the existing appointment
      const existingAppointment = await Rdv.findById(appointmentId);
      if (!existingAppointment) {
        return res.status(404).json({ error: 'Appointment not found.' });
      }

      // Check if the user updating the appointment is the owner (patient)
      if (existingAppointment.patient.toString() === userId) {
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

        if (req.body.documents && req.body.documents.data) {
          existingAppointment.documents = [{
            name: req.body.documents.name,
            type: req.body.documents.type,
            data: Buffer.from(req.body.documents.data, 'base64'),
          }];
        }

        // Save the updated appointment
        const updatedAppointment = await existingAppointment.save();
        return res.json(updatedAppointment);
      } else {
        // The user is not the owner (patient), check if the user is the assistant of the medecin
        const medecin = await Medecin.findOne({ _id: existingAppointment.medecin, assisstant: userId });
        if (medecin) {
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

          if (req.body.documents && req.body.documents.data) {
            existingAppointment.documents = [{
              name: req.body.documents.name,
              type: req.body.documents.type,
              data: Buffer.from(req.body.documents.data, 'base64'),
            }];
          }

          // Save the updated appointment
          const updatedAppointment = await existingAppointment.save();
          return res.json(updatedAppointment);
        } else {
          // The user is neither the owner (patient) nor the assistant, forbidden
          return res.status(403).json({ error: 'Forbidden: You do not have permission to update this appointment.' });
        }
      }
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





////////////Assistant usage APIs/////////////////////////////

exports.getPendingAppointmentsForAssistant = async (req, res) => {
  try {
    // Extract the JWT token from the request headers
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token not provided ' });
    }

    // Decode the token to get the assistant ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const assistantId = decoded.id;

    // Retrieve the assistant to get the associated medecin
    const assistant = await Assisstant.findById(assistantId);
    if (!assistant) {
      return res.status(404).json({ error: 'Assistant not found' });
    }

    // Retrieve the medecin associated with the assistant
    const medecin = await Medecin.findOne({ assisstant: assistantId });
    if (!medecin) {
      return res.status(404).json({ error: 'Medecin not found for the assistant' });
    }

    // Retrieve the pending appointments for the medecin
    const pendingAppointments = await Rdv.find({ medecin: medecin._id, etat: 'en attente' });

    res.json(pendingAppointments);
  } catch (error) {
    // Handle token verification or database errors
    res.status(500).json({ error: error.message });
  }
};
// Fonction pour lister les rendez-vous en attente de validation et validés sans consultation
exports.getAppointmentsForAssistant = async (req, res) => {
  try {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token not provided' });
    }

    // Decode the token to get the assistant ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const assistantId = decoded.id;

    // Trouver l'assistant
    const assistant = await Assisstant.findById(assistantId);

    if (!assistant) {
      return res.status(404).json({ error: 'Assistant not found.' });
    }
      // Retrieve the medecin associated with the assistant
      const medecin = await Medecin.findOne({ assisstant: assistantId });
      if (!medecin) {
        return res.status(404).json({ error: 'Medecin not found for the assistant' });
      }
    // Liste des rendez-vous en attente de validation
    const pendingAppointments = await Rdv.find({ medecin: medecin._id, etat: 'en attente' });

    // Liste des rendez-vous validés mais sans consultation
    const validatedAppointmentsWithoutConsultation = await Rdv.find({
      medecin: medecin._id,
      etat: 'réel',
      consultation: null,
    });

    // Combinez les deux listes
    const allAppointments = [...pendingAppointments, ...validatedAppointmentsWithoutConsultation];

    res.json(allAppointments);
  } catch (error) {
    console.error('Error getting appointments for assistant:', error.message);
    res.status(500).json({ error: error.message });
  }
};


exports.validateAppointment = async (req, res) => {
  try {
      const appointmentId = req.params.id;
      const updatedAppointment = await Rdv.findByIdAndUpdate(
          appointmentId,
          { etat: 'réel' },
          { new: true }
      );
      res.json(updatedAppointment);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


exports.cancelAppointment = async (req, res) => {
  try {
      const appointmentId = req.params.id;
      const updatedAppointment = await Rdv.findByIdAndUpdate(
          appointmentId,
          { etat: 'annulé' },
          { new: true }
      );
      res.json(updatedAppointment);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
const Consultation = require("../model/Consultation");
const multer = require('multer');
const Rdv = require("../model/Rdv");
const upload = multer().single('documents');

exports.createConsultation=async (req, res) => {
    try {
        const {idRendezVous}=req.params;
        upload(req, res, async (err) => {
          if (err) {
            return res.status(400).json({ error: 'File upload failed.' });
          }
    
          const { description, etat } = req.body;
          const date=new Date();
          
          // Extract the patient ID from the JWT token
        //   const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        //   if (!token) {
        //     return res.status(401).json({ error: 'Unauthorized: Token not provided' });
        //   }
    
          //const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const pdfDataUri = req.body.ordonnance;
          const pdfBuffer = Buffer.from(pdfDataUri.split('base64,')[1], 'base64');

        //   const patientId = decoded.id;
    
          // Fetch patient information using the obtained patientId
        //   const patient = await Patient.findById(patientId);
        //   console.log("patient:"+patient);
    
          // Check if the medecin has an appointment on the same date
          //const medecinExistingAppointment = await Rdv.findOne({ date, medecin: medecinId });
    
          // Create a new appointment with the obtained information
          const newConsultation = new Consultation({
            date,
            description,
            etat,
            ordonnance: pdfBuffer,
          });
    
          // Set etat based on medecin's existing appointment and patient's medecin list
        //   if (medecinExistingAppointment) {
        //     return res.status(400).json({ error: 'Selected medecin already has an appointment on the specified date.' });
        //   } else if (patient.medecins.includes(medecinId)) {
        //     newAppointment.etat = 'réel'; // Set etat to 'réel' if the patient has the selected medecin in their list
        //   } else {
        //     newAppointment.etat = 'en attente'; // Set etat to 'en attente' if the patient does not have the selected medecin in their list
        //   }
    
          // Save the new appointment
          const savedConsultation = await newConsultation.save();
          const appointment= await Rdv.findOne({ _id:idRendezVous });
          appointment.consultation=savedConsultation;
          await appointment.save();
          res.json(savedConsultation);
        });
      } catch (error) {
        console.error('Error creating appointment:', error.message);
        res.status(500).json({ error: error.message });
      }
  };
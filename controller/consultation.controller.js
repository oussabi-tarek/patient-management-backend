// consultationController.js

const Consultation = require('../model/Consultation');
const Rdv = require('../model/Rdv');
const Facture = require('../model/Facture');
const Assisstant = require('../model/Assistant');
const Medecin = require('../model/Medecin');
const Patient = require('../model/Patient');
const jwt = require('jsonwebtoken');

exports.getUnbilledConsultations = async (req, res) => {
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

    // Récupérez les rendez-vous associés au médecin avec un état "réel"
    const rdvs = await Rdv.find({
      medecin: medecin._id,
      etat: 'réel',
    }).populate('patient');

    // Obtenez les ID de consultation à partir des rendez-vous
    const consultationIds = rdvs
      .filter((rdv) => rdv.consultation)  // Exclure les rendez-vous sans consultation
      .map((rdv) => rdv.consultation);
    // Récupérez les consultations avec un état "close" et qui ne sont pas facturées
    const consultations = await Consultation.find({
      _id: { $in: consultationIds },
      // etat: 'close',
    });

    // Récupérez les factures associées à ces consultations
    const billedConsultations = await Facture.distinct('consultation', {
      consultation: { $in: consultations.map((consultation) => consultation._id) },
    });

    // Filtrer les consultations non facturées
    const unbilledConsultations = consultations.filter(
      (consultation) => !billedConsultations.includes(consultation._id)
    );

    // Formattez les données pour inclure le nom du patient
    const formattedConsultations = unbilledConsultations.map((consultation) => ({
      ...consultation.toObject(),
      patient: rdvs.find((rdv) => rdv.consultation.equals(consultation._id)).patient,
    }));
    res.json(formattedConsultations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

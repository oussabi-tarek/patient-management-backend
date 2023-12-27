const Consultation = require("../model/Consultation");
const Service = require("../model//Service");
const Rdv = require("../model/Rdv");
const Assistant = require("../model/Assistant");

// Function to get all the information for the facture
async function getFactureInformation(consultationId) {
  try {
    const consultation = await Consultation.findOne(consultationId);
    if (!consultation) {
      throw new Error("Consultation not found");
    }
    const rdv = await Rdv.findOne(consultationId).populate("medecin patient");
    const patient = rdv.patient;
    const medecin = rdv.medecin;
    const assistant = await Assistant.findOne(medecin.assistant);
    const service = await Service.findOne(rdv.service);
    console.log(assistant);

    const montant = 300;
    const factureInformation = {
      date: new Date(),
      montant,
      consultation: consultationId,
      dateConsultation: consultation.date,
      etatConsultation: consultation.etat,
      doctorName: `${medecin.nom} ${medecin.prenom}`,
      assistantName: `${assistant.nom} ${assistant.prenom}`,
      serviceName: service.libelle,
      consultationDate: consultation.date,
      patientName: `${patient.nom} ${patient.prenom}`,
      patientEmail: patient.email,
      patientAddress: patient.adresse,
      patientTelephone: patient.telephone,
      patientDateOfBirth: patient.date_naissance,
      patientGender: patient.sexe,
      factureDescription: "Description of services provided",
      paymentDueDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      paymentStatus: "Pending",
    };

    return factureInformation;
  } catch (error) {
    console.error("Error getting information for facture:", error);
    throw error;
  }
}

const generateFacture = async (req, res) => {
  try {
    const { consultationId } = req.body;

    // Use the function to get all the information needed for the facture
    const factureInformation = await getFactureInformation(consultationId);

    // If consultationId is not found, return an error response
    if (!factureInformation) {
      return res.status(404).json({ error: "Consultation not found" });
    }
    res.status(200).json(factureInformation);
  } catch (error) {
    console.error("Error generating facture:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

module.exports = generateFacture;
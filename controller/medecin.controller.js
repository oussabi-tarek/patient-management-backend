const Medecin = require('../model/Medecin');
const Service = require('../model/Service');

exports.getMedecinsByService = async (req, res) => {
  const { serviceName } = req.params;

  try {
    // Find the service by name to get the serviceId
    const service = await Service.findOne({ libelle: serviceName });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Now that we have the serviceId, query for medecins
    const medecins = await Medecin.find({ service: service._id });
    res.json(medecins);
  } catch (error) {
    console.error('Error fetching medecins:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
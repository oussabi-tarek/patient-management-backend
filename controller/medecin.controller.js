const Medecin = require('../model/Medecin');

exports.getMedecinsByService = async (req, res) => {
  const { serviceId } = req.params;

  try {
    const medecins = await Medecin.find({ service: serviceId });
    res.json(medecins);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medecins' });
  }
};
const Assisstant = require("../model/Assistant");

exports.getAllAssistants=async (req, res) => {
    try {
        const assistants = await Assisstant.find();
      res.json(assistants);
    } catch (error) {
      console.error('Error fetching medecins:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
}
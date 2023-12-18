  const asyncHandler = require('express-async-handler');
  const mongoose = require('mongoose');
  const jwt = require('jsonwebtoken');
  const bcrypt = require('bcryptjs');
  const Patient = require('../model/Patient');

  const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
  };

  const registerPatient = asyncHandler(async (req, res) => {
    let {
      nom,
      prenom,
      email,
      password,
      adresse,
      telephone,
      date_naissance,
      sexe,
      numero_cnss,
    } = req.body;

    const existingPatient = await Patient.findOne({ email });

    if (existingPatient) {
      res.status(400).json({ error: 'Email is already registered' });
    } else {
      date_naissance = Date.parse(date_naissance);
      const newPatient = new Patient({
        nom,
        prenom,
        email,
        password,
        adresse,
        telephone,
        date_naissance,
        sexe,
        numero_cnss,
      });

      // Hacher le mot de passe avant de l'enregistrer dans la base de données
      const salt = await bcrypt.genSalt(10);
      newPatient.password = await bcrypt.hash(newPatient.password, salt);

      await newPatient.save();

      const token = generateToken(newPatient._id);

      // Retourner le token et les informations de l'utilisateur après l'inscription
      res.status(201).json({
        token,
        user: {
          id: newPatient._id,
          nom: newPatient.nom,
          prenom: newPatient.prenom,
          email: newPatient.email,
          adresse: newPatient.adresse,
          telephone: newPatient.telephone,
          date_naissance: newPatient.date_naissance,
          sexe: newPatient.sexe,
          numero_cnss: newPatient.numero_cnss,
        },
      });
    }
  });

  const loginPatient = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const patient = await Patient.findOne({ email });

    if (patient && (await patient.comparePassword(password))) {
      const token = generateToken(patient._id);
      // Retourner le token et les informations de l'utilisateur après la connexion
      res.status(200).json({
        token,
        user: {
          id: patient._id,
          nom: patient.nom,
          prenom: patient.prenom,
          email: patient.email,
          adresse: patient.adresse,
          telephone: patient.telephone,
          date_naissance: patient.date_naissance.toLocaleDateString('en-CA'),
          sexe: patient.sexe,
          numero_cnss: patient.numero_cnss ,
        },
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  });





  // @desc    Get patient data
  // @route   GET /api/patients/info
  // @access  Private
  const getPatientInfo = asyncHandler(async (req, res) => {
    const foundPatient = await Patient.findOne({ email: req.body.email }).select('-password');

    if (foundPatient) {
      res.status(200).json(foundPatient);
    } else {
      res.status(404).json({ error: 'Patient not found' });
    }
  });

  // @desc    Update patient information
// @route   PUT /api/updateInfo
// @access  Private
const updatePatient = asyncHandler(async (req, res) => {
  const { _id, nom, prenom, email,adresse, telephone, date_naissance, sexe, numero_cnss } = req.body;
  console.log(nom)
  console.log(await Patient.findOne({_id}))
  try {
  //   // Check if _id is valid
    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ error: 'Invalid patient ID' });
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      _id,
      {
        $set: {
          nom,
          prenom,
          email,
          adresse,
          telephone,
          date_naissance,
          sexe,
          numero_cnss,
        },
      },
      { new: true }
    );

    if (updatedPatient) {
      return res.status(200).json({
        id: updatedPatient._id,
        nom: updatedPatient.nom,
        prenom: updatedPatient.prenom,
        email:updatedPatient.email, 

        adresse: updatedPatient.adresse,
        telephone: updatedPatient.telephone,
        date_naissance: updatedPatient.date_naissance,
        sexe: updatedPatient.sexe,
        numero_cnss: updatedPatient.numero_cnss,
      });
    } else {
      return res.status(404).json({ error: 'Patient not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = {
  registerPatient,
  loginPatient,
  getPatientInfo,
  updatePatient,
};



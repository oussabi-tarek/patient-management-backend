const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Patient = require('../model/Patient');
const generateToken = require('../middleware/generateToken.middleware');

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
        date_naissance: patient.date_naissance,
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

module.exports = {
  registerPatient,
  loginPatient,
  getPatientInfo,
};
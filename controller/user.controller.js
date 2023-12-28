const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Patient = require('../model/Patient');
const Medecin = require('../model/Medecin');
const Service =require('../model/Service');
const Assistant = require('../model/Assistant');
const generateToken = require('../middleware/generateToken.middleware');

// @desc    Add user data
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { type } = req.body;

  switch (type) {
    case 'patient':
      return register(req, res, Patient);
    case 'medecin':
      return register(req, res, Medecin);
    case 'assistant':
      return register(req, res, Assistant);
    default:
      res.status(400).json({ error: 'Invalid user type' });
  }
});
// @desc    Get user data
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const patient = await Patient.findOne({ email });
  const medecin = await Medecin.findOne({ email });
  const assistant = await Assistant.findOne({ email });

  // Vérifier le mot de passe pour chaque type d'utilisateur
  if (patient && (await patient.comparePassword(password))) {
    const token = generateToken(patient._id);
    return res.status(200).json({
      token,
      user: {
        id: patient._id,
        ...getUserInfo(patient),
        role: 'patient',
      },
    });
  } else if (medecin && (await medecin.comparePassword(password))) {
    const token = generateToken(medecin._id);
    return res.status(200).json({
      token,
      user: {
        id: medecin._id,
        ...getUserInfo(medecin),
        role: 'medecin',
      },
    });
  } else if (assistant && (await assistant.comparePassword(password))) {
    const token = generateToken(assistant._id);
    return res.status(200).json({
      token,
      user: {
        id: assistant._id,
        ...getUserInfo(assistant),
        role: 'assistant',
      },
    });
  } else {
    res.status(401).json({ error: 'Invalid email or password' });
  }
});

const register = async (req, res, Model) => {
  let userData = req.body;
  const { type } = req.body;
  console.log("type"+type);

  const existingUser = await Model.findOne({ email: userData.email });

  if (existingUser) {
    res.status(400).json({ error: 'Email is already registered' });
  } else {
    userData.date_naissance = Date.parse(userData.date_naissance);
    const newUser = new Model(userData);

    if(type==="medecin"){
      const oldAssistant=await Assistant.findOne({ _id:userData.assistant });
      const service=await Service.findOne({ _id:userData.service });
      newUser.service=service;
      newUser.assisstant=oldAssistant;
    }

    // Hasher le mot de passe avant de l'enregistrer dans la base de données
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    console.log(":"+newUser);

    await newUser.save();

    // Return user informations
    res.status(201).json({
      user: {
        id: newUser._id,
        ...getUserInfo(newUser),
      },
    });
  }
};
///Must return all information about user
const getUserInfo = (user) => {
    // Retourner toutes les informations de l'utilisateur sans les propriétés spécifiées
    const { _id, __v,password, ...userInfo } = user._doc;
    return { ...userInfo, id: user._id };
  };
  
module.exports = {
  registerUser,
  loginUser,
};
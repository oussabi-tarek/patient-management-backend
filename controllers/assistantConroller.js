const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const Assistant = require("../model/Assisstant");

// @desc    Register new Assistant
// @route   POST /api/assistants
// @access  Public
const registerAssistant = asyncHandler(async (req, res) => {
  console.log(req.body)
  const {
    nom,
    prenom,
    email,
    password,
    adresse,
    telephone,
    sexe,
  } = req.body;

  if (
    !nom ||
    !prenom ||
    !password ||
    !adresse ||
    !telephone ||
    !sexe
  ) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check if assistant exists
  const assistantExist = await Assistant.findOne({ email });

  if (assistantExist) {
    res.status(400);
    throw new Error("Assistant already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create assistant
  const assistant = await Assistant.create({
    nom,
    prenom,
    email,
    password: hashedPassword,
    adresse,
    telephone,
    sexe,
  });

  if (assistant) {
    res.status(201).json({
      _id: assistant.id,
      name: assistant.name,
      email: assistant.email,
      token: generateToken(assistant._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate a assistant
// @route   POST /api/assistants/login
// @access  Public
const loginAssistant = asyncHandler(async (req, res) => {
  console.log(req.body)
  const { email, password } = req.body;
  console.log(email,password)

  // Check for user email
  const assistant = await Assistant.findOne({ email });
  console.log(assistant)

  if (assistant && (await bcrypt.compare(password, assistant.password))) {
    res.json({
      _id: assistant.id,
      nom: assistant.nom,
      prenom: assistant.prenom,
      email: assistant.email,
      adresse: assistant.adresse,
      telephone: assistant.telephone,
      sexe: assistant.sexe,
      token: generateToken(assistant._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// @desc    Get assistant data
// @route   GET /api/assistants/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  console.log(req.assisstant)
  res.status(200).json(req.assisstant);
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerAssistant,
  loginAssistant,
  getMe,
};

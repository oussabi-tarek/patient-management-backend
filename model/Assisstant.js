const mongoose = require("mongoose");

const AssissstantSchema = mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  adresse: {
    type: String,
    required: true,
  },
  telephone: {
    type: String,
    required: true,
  },
  sexe: {
    type: String,
    required: true,
  },
});

const Assisstant = mongoose.model(
  "Assisstant",
  AssissstantSchema,
  "assisstant"
);

module.exports = Assisstant;

const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const AssistantSchema = mongoose.Schema({
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

// Méthode pour comparer les mots de passe hachés
AssistantSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


const Assistant = mongoose.model(
  "Assistant",
  AssistantSchema,
  "assistant"
);

module.exports = Assistant;

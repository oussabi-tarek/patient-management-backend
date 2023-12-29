const mongoose = require("mongoose");

const FactureSchema = mongoose.Schema({
  consultation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Consultation",
  },
  document: {
    name: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    data: {
      type: Buffer,
      required: false,
    },
  },
});

const Facture = mongoose.model("Facture", FactureSchema,"facture");

module.exports = Facture;
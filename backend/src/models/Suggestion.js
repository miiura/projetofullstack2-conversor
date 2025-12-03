const mongoose = require("mongoose");

const SuggestionSchema = new mongoose.Schema({
  moeda: {
    type: String,
    required: true
  },
  pais: {
    type: String,
    required: true
  },
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",   // supondo que o nome do model de usuário seja User
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Suggestion", SuggestionSchema);

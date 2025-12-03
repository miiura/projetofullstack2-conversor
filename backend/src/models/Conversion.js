const mongoose = require('mongoose');

const ConversionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    amount: { type: Number, required: true },
    rate: { type: Number, required: true },
    converted: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Conversion', ConversionSchema);

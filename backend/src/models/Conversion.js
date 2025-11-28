const mongoose = require('mongoose');

const conversionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'ID do usuário é obrigatório']
  },
  fromCurrency: {
    type: String,
    required: [true, 'Moeda de origem é obrigatória'],
    trim: true,
    uppercase: true
  },
  toCurrency: {
    type: String,
    required: [true, 'Moeda para conversão é obrigatória'],
    trim: true,
    uppercase: true
  },
  amount: {
    type: Number,
    required: [true, 'A quantidade é obrigatória'],
    min: [0.01, 'A quantidade deve ser maior que 0']
  },
  convertedAmount: {
    type: Number,
    required: [true, 'Quantidade convertida é obrigatória']
  },
  rate: {
    type: Number,
    required: [true, 'Taxa de câmbio é obrigatória']
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indices para consultas mais rápidas
conversionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Conversion', conversionSchema);
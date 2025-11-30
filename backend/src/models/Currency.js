const mongoose = require('mongoose');


const CurrencySchema = new mongoose.Schema({
code: { type: String, required: true, uppercase: true, trim: true },
name: { type: String, required: true, trim: true },
description: { type: String, default: '' },
createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
createdAt: { type: Date, default: Date.now }
});


CurrencySchema.index({ code: 1 });
CurrencySchema.index({ name: 'text' });


module.exports = mongoose.model('Currency', CurrencySchema);
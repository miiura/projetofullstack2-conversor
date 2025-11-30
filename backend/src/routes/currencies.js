const express = require('express');
const router = express.Router();
const Currency = require('../models/Currency');
const auth = require('../config/middlewares/auth');
const cache = require('../config/cache');
const { currencyCreateValidator, currencySearchValidator } = require('../config/middlewares/validators');


// Create currency (protected)
router.post('/', auth, currencyCreateValidator, async (req, res) => {
try {
const { code, name, description } = req.body;
// prevent duplicate for same code & user
const exists = await Currency.findOne({ code: code.toUpperCase(), createdBy: req.user.id });
if (exists) return res.status(409).json({ error: 'Currency already registered by you' });


const currency = new Currency({ code: code.toUpperCase(), name, description: description || '', createdBy: req.user.id });
await currency.save();
// invalidate cache
cache.del('currencies:list');
console.log(`User ${req.user.username} created currency ${code}`);
res.status(201).json({ message: 'Currency created', currency });
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Server error' });
}
});


// Search currencies (protected)
router.get('/', auth, currencySearchValidator, async (req, res) => {
try {
const { search } = req.query;
const cacheKey = `currencies:list:${req.user.id}:${search || ''}`;
const cached = cache.get(cacheKey);
if (cached) return res.json({ fromCache: true, data: cached });


const filter = { createdBy: req.user.id };
if (search) {
const s = search.trim();
// search by code exact or name text
filter.$or = [ { code: s.toUpperCase() }, { $text: { $search: s } } ];
}


const results = await Currency.find(filter).sort({ createdAt: -1 }).lean();
cache.set(cacheKey, results);
console.log(`User ${req.user.username} searched currencies: "${search || ''}"`);
res.json({ fromCache: false, data: results });
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Server error' });
}
});


module.exports = router;
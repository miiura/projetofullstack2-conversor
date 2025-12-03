const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { loginValidator } = require('../config/middlewares/validators');
require('dotenv').config();


const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '1d';



router.post('/login', loginValidator, async (req, res) => {
const { username, password } = req.body;
try {
const user = await User.findOne({ username });
if (!user) return res.status(401).json({ error: 'Invalid credentials' });


const match = await bcrypt.compare(password, user.password);
if (!match) return res.status(401).json({ error: 'Invalid credentials' });


const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
// log login success
console.log(`User ${username} logged in`);
res.json({ token, user: { _id: user._id, username: user.username } });
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Server error' });
}
});


module.exports = router;
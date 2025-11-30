const jwt = require('jsonwebtoken');
require('dotenv').config();


const JWT_SECRET = process.env.JWT_SECRET || 'secret';


function authMiddleware(req, res, next) {
const header = req.headers.authorization;
if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
const token = header.split(' ')[1];
try {
const payload = jwt.verify(token, JWT_SECRET);
req.user = { id: payload.id, username: payload.username };
next();
} catch (err) {
return res.status(401).json({ error: 'Invalid token' });
}
}


module.exports = authMiddleware;
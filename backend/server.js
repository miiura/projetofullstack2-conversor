const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('mongo-sanitize');
const { connectDB } = require('./src/config/db');
const currenciesRouter = require('./src/routes/currencies');
const authRouter = require('./src/routes/auth');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 4000;


// Connect DB
connectDB();


// Middlewares
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));


// Rate limiter (applied globally with relaxed limits; you may customize per-route)
const limiter = rateLimit({
windowMs: 15 * 60 * 1000, // 15 minutes
max: 200, // limit each IP to 200 requests per windowMs
standardHeaders: true,
legacyHeaders: false,
});
app.use(limiter);


// Basic sanitizer for request body/query
app.use((req, res, next) => {
if (req.body) req.body = JSON.parse(JSON.stringify(mongoSanitize(req.body)));
if (req.query) req.query = JSON.parse(JSON.stringify(mongoSanitize(req.query)));
next();
});


// Routes
app.use('/api/auth', authRouter);
app.use('/api/currencies', currenciesRouter);


app.get('/', (req, res) => res.json({ ok: true, message: 'API running' }));


app.use((err, req, res, next) => {
console.error(err);
res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
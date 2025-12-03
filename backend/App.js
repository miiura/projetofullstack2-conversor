const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const winston = require('winston');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const bodyParser = require('express').json;

// Logger básico (Winston)
winston.configure({
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

const createApp = async ({
  cache,
  jwtSecret,
  jwtExpiresIn,
  rateLimitWindowMs = 60000,
  rateLimitMax = 10
}) => {
  const app = express();

  // Middleware de autenticação
  const authMiddlewareFactory = require('./src/routes/auth.middleware');
  const authMiddleware = authMiddlewareFactory(cache, jwtSecret);

  // Middlewares globais
  app.use(helmet());
  app.use(compression());
  app.use(cors({ origin: true }));
  app.use(bodyParser({ limit: '10kb' }));
  app.use(mongoSanitize());
  app.use(xss());

  // Logger de requisições HTTP
  app.use(
    morgan('combined', {
      stream: { write: (msg) => winston.info(msg.trim()) }
    })
  );

  // Rate-limiting
  const limiter = rateLimit({
    windowMs: +rateLimitWindowMs,
    max: +rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Muitas requisições. Tente novamente mais tarde.' }
  });
  app.use('/api/', limiter);

  // Rotas
  const authRoutesFactory = require('./src/routes/auth.routes');
  app.use('/api/auth', authRoutesFactory(cache, jwtSecret, jwtExpiresIn));

  const currencyRoutesFactory = require('./src/routes/currency.routes');
  app.use('/api/currency', currencyRoutesFactory(cache, authMiddleware));

  const suggestionsRoutesFactory = require('./src/routes/suggestions');
  app.use('/api/suggestions', suggestionsRoutesFactory(authMiddleware));

  
  // Healthcheck
  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  // Fallback de erro
  app.use((err, req, res, next) => {
    winston.error(err);
    res.status(500).json({ message: 'Erro interno' });
  });

  return app;
};

module.exports = createApp;

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const securityMiddleware = (app) => {
  // Cabeçalhos de segurança
  app.use(helmet());
  
  // Limitação de taxa de requisições
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // limitar cada IP a 100 requisições por windowMs
    message: 'Muitas requisições deste IP, por favor tente novamente mais tarde.'
  });
  app.use('/api/', limiter);
  
  // Sanitização de dados contra injeção NoSQL
  app.use(mongoSanitize());
  
  // Sanitização de dados contra XSS
  app.use(xss());
  
  // Prevenção de poluição de parâmetros
  app.use(hpp());
};

module.exports = securityMiddleware;
const jwt = require('jsonwebtoken');
const winston = require('winston');

/**
 * Factory que retorna o middleware, pois precisamos do cache e secret
 */
module.exports = (cache, jwtSecret) => {
  return async function authMiddleware(req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        winston.warn(`Acesso negado: token ausente - IP=${req.ip}`);
        return res.status(401).json({ message: 'Token não fornecido' });
      }

      const token = authHeader.split(' ')[1];

      // Verifica blacklist (logout)
      if (cache && cache.get) {
        const blacklisted = await cache.get(`auth:blacklist:${token}`);
        if (blacklisted) {
          winston.warn(`Token inválido (blacklist) - IP=${req.ip}`);
          return res.status(401).json({ message: 'Token inválido' });
        }
      }

      // Verifica validade do token
      let decoded;
      try {
        decoded = jwt.verify(token, jwtSecret);
      } catch (err) {
        winston.warn(`Token inválido - ${err.message} - IP=${req.ip}`);
        return res.status(401).json({ message: 'Token inválido ou expirado' });
      }

      // O token é válido: insere dados do usuário no req
      req.user = {
        id: decoded.sub,
        username: decoded.username,
        role: decoded.role
      };

      return next();
    } catch (err) {
      winston.error(`Erro no middleware de autenticação`, err);
      return res.status(500).json({ message: 'Erro interno de autenticação' });
    }
  };
};

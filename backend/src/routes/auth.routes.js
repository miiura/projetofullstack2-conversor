const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const winston = require('winston');

module.exports = (cache, jwtSecret, jwtExpiresIn) => {
  // rate limiter e outras proteções são aplicadas em app.js; aqui só definimos rotas e controladores.

  router.post('/login', [
    // validação
    body('usernameOrEmail').trim().notEmpty().withMessage('usernameOrEmail é obrigatório'),
    body('password').notEmpty().withMessage('password é obrigatório')
  ], async (req, res) => {
    // validação do servidor
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(e => e.msg) });
    }

    const { usernameOrEmail, password } = req.body;

    try {
      // buscar usuário por username ou email (sanitização já feita por middleware)
      const user = await User.findOne({
        $or: [
          { username: usernameOrEmail },
          { email: usernameOrEmail.toLowerCase() }
        ]
      }).lean();

      if (!user) {
        winston.warn(`Login falhou: usuário não encontrado [${usernameOrEmail}] IP=${req.ip}`);
        // não revelar qual dos dois
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) {
        winston.warn(`Login falhou: senha inválida para usuário ${user.username} IP=${req.ip}`);
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      // criar token JWT
      const payload = { sub: user._id, username: user.username, role: user.role };
      const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });

      // armazenar token em cache para permitir blacklist/invalidacao (ex: logout)
      if (cache && cache.set) {
        try {
          // armazenar um registro simples indicando token válido
          await cache.set(`auth:token:${token}`, JSON.stringify({ userId: user._id }), { EX: 60 * 60 }); // usa mesmo tempo do JWT
        } catch (err) {
          winston.error('Erro ao gravar token no cache', err);
        }
      }

      // responder com token e dados mínimos do usuário
      res.json({
        message: 'Autenticado com sucesso',
        token,
        user: { id: user._id, username: user.username, email: user.email, role: user.role }
      });
    } catch (err) {
      winston.error('Erro em /api/auth/login', err);
      res.status(500).json({ message: 'Erro interno' });
    }
  });

  router.post('/logout', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Token não fornecido' });
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token inválido' });

    try {
      // adicionar token a blacklist: set key token:blacklist:<token> = 1 com TTL igual ao restante do token
      if (cache && cache.set && cache.client) {

      }
      // Para simplicidade, adicionamos token como chave com TTL 1h (ou equivalente)
      await cache.set(`auth:blacklist:${token}`, '1', { EX: 60 * 60 });
      winston.info(`Token invalidado (logout) IP=${req.ip}`);
      return res.json({ message: 'Logout realizado' });
    } catch (err) {
      winston.error('Erro em logout', err);
      return res.status(500).json({ message: 'Erro interno' });
    }
  });

  return router;
};

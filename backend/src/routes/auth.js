const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../config/logger');

const router = express.Router();

// Gera token JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
};

// Rota de login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validação
    if (!email || !password) {
      logger.warn('Login attempt with missing credentials', { email });
      return res.status(400).json({
        status: 'error',
        message: 'Por favor, forneça email e senha'
      });
    }

    // Verifica se o usuário existe e a senha está correta
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.correctPassword(password, user.password))) {
      logger.warn('Failed login attempt', { email });
      return res.status(401).json({
        status: 'error',
        message: 'Email ou senha incorretos'
      });
    }

    // Remove senha da resposta
    user.password = undefined;

    // Cria token
    const token = signToken(user._id);

    logger.info('Successful login', { userId: user._id, email });

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  } catch (error) {
    logger.error('Login error', { error: error.message, email: req.body.email });
    res.status(500).json({
      status: 'error',
      message: 'Erro interno do servidor'
    });
  }
});

// Middleware de verificação de token (será utilizado em outras rotas)
const authMiddleware = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Você não está conectado. Por favor, faça login para obter acesso.'
      });
    }

    // Verifica token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Verifica se o usuário ainda existe
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        message: 'O usuário vinculado a este token não existe mais.'
      });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    logger.error('Authentication error', { error: error.message });
    return res.status(401).json({
      status: 'error',
      message: 'Token inválido. Por favor, faça login novamente.'
    });
  }
};

module.exports = { router, authMiddleware };
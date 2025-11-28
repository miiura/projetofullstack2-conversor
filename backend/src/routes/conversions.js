const express = require('express');
const Conversion = require('../models/Conversion');
const logger = require('../config/logger');
const NodeCache = require('node-cache');

const router = express.Router();
const cache = new NodeCache({ stdTTL: 300 }); // Cache por 5 minutos

// Obtem histórico de conversões (Funcionalidade de busca)
router.get('/history', async (req, res) => {
  try {
    const { page = 1, limit = 10, fromCurrency, toCurrency } = req.query;
    const userId = req.user._id;

    // Constroi query
    let query = { user: userId };
    if (fromCurrency) query.fromCurrency = fromCurrency.toUpperCase();
    if (toCurrency) query.toCurrency = toCurrency.toUpperCase();

    // Cria chave de cache
    const cacheKey = `history_${userId}_${page}_${limit}_${fromCurrency}_${toCurrency}`;
    
    // Verifica cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      logger.info('Cache hit para histórico de conversões', { userId });
      return res.json(cachedData);
    }

    // Executa query
    const conversions = await Conversion.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Conversion.countDocuments(query);

    const response = {
      status: 'success',
      results: conversions.length,
      data: {
        conversions,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    };

    // Armazena resposta em cache
    cache.set(cacheKey, response);

    logger.info('Histórico de conversões recuperado', { userId, count: conversions.length });

    res.json(response);
  } catch (error) {
    logger.error('Erro ao recuperar histórico de conversões', { 
      error: error.message, 
      userId: req.user._id 
    });
    res.status(500).json({
      status: 'error',
      message: 'Erro ao recuperar histórico de conversões'
    });
  }
});

// Cria nova conversão (Funcionalidade de inserção)
router.post('/', async (req, res) => {
  try {
    const { fromCurrency, toCurrency, amount, convertedAmount, rate } = req.body;

    // Validação
    if (!fromCurrency || !toCurrency || !amount || !convertedAmount || !rate) {
      return res.status(400).json({
        status: 'error',
        message: 'Todos os campos são obrigatórios'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'O valor deve ser maior que 0'
      });
    }

    // Cria conversão
    const conversion = await Conversion.create({
      user: req.user._id,
      fromCurrency: fromCurrency.toUpperCase(),
      toCurrency: toCurrency.toUpperCase(),
      amount,
      convertedAmount,
      rate,
      date: new Date()
    });

    // Limpa cache relevante
    cache.keys().forEach(key => {
      if (key.startsWith(`history_${req.user._id}`)) {
        cache.del(key);
      }
    });

    logger.info('Nova conversão salva', { 
      userId: req.user._id, 
      conversionId: conversion._id 
    });

    res.status(201).json({
      status: 'success',
      data: {
        conversion
      }
    });
  } catch (error) {
    logger.error('Erro ao criar conversão', { 
      error: error.message, 
      userId: req.user._id 
    });
    res.status(500).json({
      status: 'error',
      message: 'Erro ao salvar conversão'
    });
  }
});

// Obte estatísticas de conversão
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user._id;
    
    const stats = await Conversion.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalConversions: { $sum: 1 },
          mostConvertedFrom: { $addToSet: '$fromCurrency' },
          mostConvertedTo: { $addToSet: '$toCurrency' },
          totalAmountConverted: { $sum: '$amount' }
        }
      }
    ]);

    res.json({
      status: 'success',
      data: {
        stats: stats[0] || {}
      }
    });
  } catch (error) {
    logger.error('Erro ao recuperar estatísticas de conversão', { 
      error: error.message, 
      userId: req.user._id 
    });
    res.status(500).json({
      status: 'error',
      message: 'Erro ao recuperar estatísticas'
    });
  }
});

module.exports = router;
const express = require('express');
const axios = require('axios');
const winston = require('winston');

module.exports = (cache, authMiddleware) => {
  const router = express.Router();

  // ROTA PROTEGIDA - BUSCA DE CONVERSÃO
  router.get('/convert', authMiddleware, async (req, res) => {
    try {
      const { from, to, amount } = req.query;

      if (!from || !to || !amount) {
        return res.status(400).json({ message: 'Parâmetros incompletos' });
      }

      const cacheKey = `${from}-${to}`;
      const cachedRate = await cache.get(cacheKey);

      let rate;

      if (cachedRate) {
        winston.info(`[CACHE HIT] ${cacheKey}`);
        rate = parseFloat(cachedRate);
      } else {
        winston.info(`[API REQUEST] Buscando taxa para ${cacheKey}`);

        const apiUrl = `https://api.exchangerate-api.com/v4/latest/${from}`;
        const response = await axios.get(apiUrl);

        rate = response.data.rates[to];

        if (!rate) {
          return res.status(400).json({ message: 'Par de moedas inválido' });
        }

        await cache.set(cacheKey, rate, { EX: 60 });
      }

      const converted = rate * parseFloat(amount);

      return res.json({
        from,
        to,
        amount: Number(amount),
        rate,
        converted,
      });

    } catch (err) {
      winston.error('Erro na conversão', err);
      return res.status(500).json({ message: 'Erro interno' });
    }
  });

  // ROTA PROTEGIDA - INSERÇÃO
  router.post('/save', authMiddleware, async (req, res) => {
    try {
      const { from, to, amount, rate, converted } = req.body;
      const userId = req.user.id;

      winston.info(`[CONVERSÃO] POST - Usuário: ${userId}, ${from} → ${to}, Valor: ${amount}`);

      if (!from || !to || !amount || !rate || !converted) {
        return res.status(400).json({ message: 'Dados incompletos' });
      }

      const Conversion = require('../models/Conversion');

      const saved = await Conversion.create({
        userId,
        from,
        to,
        amount,
        rate,
        converted
      });

      winston.info(`[CONVERSÃO] ✅ Salva com sucesso - ID: ${saved._id}`);
      return res.status(201).json(saved);

    } catch (err) {
      winston.error(`[CONVERSÃO] ❌ Erro ao salvar: ${err.message}`, err);
      return res.status(500).json({ message: 'Erro interno' });
    }
  });

    // ROTA PROTEGIDA - HISTÓRICO DO USUÁRIO
  router.get('/history', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.id;
      winston.info(`[CONVERSÃO] GET /history - Usuário: ${userId}`);

      const Conversion = require('../models/Conversion');

      const history = await Conversion.find({ userId })
        .sort({ createdAt: -1 }); // mais recentes primeiro

      winston.info(`[CONVERSÃO] ✅ ${history.length} conversões no histórico`);
      return res.json(history);

    } catch (err) {
      winston.error(`[CONVERSÃO] ❌ Erro ao buscar histórico: ${err.message}`, err);
      return res.status(500).json({ message: 'Erro interno' });
    }
  });


  return router;
};

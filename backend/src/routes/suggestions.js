const express = require("express");
const router = express.Router();
const Suggestion = require("../models/Suggestion");
const winston = require("winston");

// Factory que retorna router com middleware injetado
module.exports = (authMiddleware) => {
  // Middleware para exigir autenticação
  const ensureAuth = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "É necessário estar autenticado." });
    }
    next();
  };

  // Criar sugestão (requer autenticação)
  router.post("/", authMiddleware, ensureAuth, async (req, res) => {
    try {
      const { moeda, pais } = req.body;
      const userId = req.user.id;

      winston.info(`[SUGESTÃO] POST - Usuário: ${userId}, Moeda: ${moeda}, País: ${pais}`);

      if (!moeda || !pais) {
        return res.status(400).json({ error: "Moeda e país são obrigatórios." });
      }

      const nova = new Suggestion({
        moeda,
        pais,
        autor: userId
      });

      await nova.save();

      winston.info(`[SUGESTÃO] ✅ Salva com sucesso - ID: ${nova._id}`);
      res.json({ message: "Sugestão salva!", sugestao: nova });

    } catch (e) {
      winston.error(`[SUGESTÃO] ❌ Erro ao salvar: ${e.message}`, e);
      res.status(500).json({ error: "Erro ao salvar sugestão" });
    }
  });

  // Listar e buscar sugestões (público)
  router.get("/", async (req, res) => {
    try {
      const { q } = req.query;

      let filtro = {};

      if (q) {
        filtro = {
          $or: [
            { moeda: { $regex: q, $options: "i" } },
            { pais: { $regex: q, $options: "i" } }
          ]
        };
        winston.info(`[SUGESTÃO] GET - Busca por: "${q}"`);
      } else {
        winston.info(`[SUGESTÃO] GET - Listando todas`);
      }

      const resultados = await Suggestion.find(filtro).populate("autor", "email");

      winston.info(`[SUGESTÃO] ✅ ${resultados.length} sugestões encontradas`);
      res.json(resultados);

    } catch (e) {
      winston.error(`[SUGESTÃO] ❌ Erro ao buscar: ${e.message}`, e);
      res.status(500).json({ error: "Erro ao buscar sugestões" });
    }
  });

  return router;
};

require('dotenv').config();
const createApp = require('./App');
const connectDB = require('./src/config/db');
const initCache = require('./src/config/cache');
const winston = require('winston');

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    // iniciar cache (Redis) — limpa se não disponível
    const cache = await initCache(process.env.REDIS_URL);

    // conectar MongoDB
    await connectDB(process.env.MONGO_URI);

    // criar app express
    const app = await createApp({
      cache,
      jwtSecret: process.env.JWT_SECRET,
      jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
      rateLimitWindowMs: process.env.RATE_LIMIT_WINDOW_MS || 60000,
      rateLimitMax: process.env.RATE_LIMIT_MAX || 10
    });

    const server = app.listen(PORT, () => {
      winston.info(`Servidor rodando na porta ${PORT}`);
      console.log(`Servidor rodando na porta ${PORT}`);
    });

    // Tratamento básico de sinais
    process.on('SIGINT', () => {
      server.close(() => {
        winston.info('Servidor finalizado (SIGINT)');
        process.exit(0);
      });
    });

  } catch (err) {
    winston.error('Falha ao iniciar o servidor', err);
    process.exit(1);
  }
})();

require('dotenv').config();
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const connectDB = require('./src/config/database');
const securityMiddleware = require('./src/config/security');
const logger = require('./src/config/logger');

// Importa rotas
const { router: authRoutes, authMiddleware } = require('./src/routes/auth');
const conversionRoutes = require('./src/routes/conversions');

const app = express();

// Conecta ao banco de dados
connectDB();

// Middleware de segurança
securityMiddleware(app);

// Middleware de análise de corpo
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Middleware de compressão
app.use(compression());

// Middleware CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/conversions', authMiddleware, conversionRoutes);

// Verificação de saúde
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Servidor está em execução'
  });
});

// Manipula rotas indefinidas
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Não foi possível encontrar ${req.originalUrl} neste servidor!`
  });
});

// Middleware de tratamento de erro
app.use((err, req, res, next) => {
  logger.error('Erro não tratado', { error: err.message, stack: err.stack });
  res.status(500).json({
    status: 'error',
    message: 'Algo deu errado!'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
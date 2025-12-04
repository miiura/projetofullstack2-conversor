const mongoose = require('mongoose');
const winston = require('winston');

const connectDB = async (mongoUri) => {
  try {
    await mongoose.connect(mongoUri, {
      // opções de pool e reconexão
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // poolSize substituído por maxPoolSize:
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 5000
    });
    winston.info('MongoDB conectado');
  } catch (err) {
    winston.error('Erro ao conectar no MongoDB', err);
    throw err;
  }
};

module.exports = connectDB;

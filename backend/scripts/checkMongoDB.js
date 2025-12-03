#!/usr/bin/env node

/**
 * Script para verificar dados no MongoDB sem mongosh
 * Use: node scripts/checkMongoDB.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

async function checkDatabase() {
  try {
    console.log('🔌 Conectando ao MongoDB...\n');
    
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/currency_converter');
    
    console.log('✅ Conectado com sucesso!\n');

    // Verificar coleções
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('📦 Coleções encontradas:');
    collections.forEach(col => console.log(`   - ${col.name}`));
    console.log();

    // Contar documentos
    const suggestionsCount = await db.collection('suggestions').countDocuments();
    const conversionsCount = await db.collection('conversions').countDocuments();
    const usersCount = await db.collection('users').countDocuments();

    console.log('📊 Documentos por coleção:');
    console.log(`   Sugestões: ${suggestionsCount}`);
    console.log(`   Conversões: ${conversionsCount}`);
    console.log(`   Usuários: ${usersCount}`);
    console.log();

    // Ver últimas sugestões
    if (suggestionsCount > 0) {
      console.log('📝 Últimas 3 sugestões:');
      const suggestions = await db.collection('suggestions')
        .find()
        .sort({ createdAt: -1 })
        .limit(3)
        .toArray();
      
      suggestions.forEach((s, i) => {
        console.log(`   ${i + 1}. ${s.moeda} (${s.pais}) - ${s.createdAt?.toLocaleString()}`);
      });
      console.log();
    }

    // Ver últimas conversões
    if (conversionsCount > 0) {
      console.log('💱 Últimas 3 conversões:');
      const conversions = await db.collection('conversions')
        .find()
        .sort({ createdAt: -1 })
        .limit(3)
        .toArray();
      
      conversions.forEach((c, i) => {
        console.log(`   ${i + 1}. ${c.from} → ${c.to} | ${c.amount} = ${c.converted} - ${c.createdAt?.toLocaleString()}`);
      });
      console.log();
    }

    // Ver usuários
    if (usersCount > 0) {
      console.log('👥 Usuários cadastrados:');
      const users = await db.collection('users')
        .find()
        .toArray();
      
      users.forEach((u, i) => {
        console.log(`   ${i + 1}. ${u.email} (${u.username})`);
      });
      console.log();
    }

    console.log('✅ Verificação concluída!');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n⚠️  MongoDB não está rodando!');
      console.error('   Execute: mongod');
    }
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

checkDatabase();

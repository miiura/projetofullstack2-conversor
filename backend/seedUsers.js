require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../src/models/User');
const connectDB = require('../src/config/db');

const run = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    const users = [
      { username: 'fabricio', email: 'fabricio@example.com', password: 'SenhaSegura1' },
      { username: 'leda', email: 'leda@example.com', password: 'SenhaSegura2' }
    ];

    for (const u of users) {
      const exists = await User.findOne({ $or: [{ username: u.username }, { email: u.email }] });
      if (exists) {
        console.log(`Usuário ${u.username} já existe — pulando.`);
        continue;
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(u.password, salt);
      const newUser = new User({ username: u.username, email: u.email, passwordHash: hash });
      await newUser.save();
      console.log(`Criado usuário ${u.username}`);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
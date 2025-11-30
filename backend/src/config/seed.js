import mongoose from "mongoose";
import bcrypt from "bcrypt";
import "./db.js"; // importa a conexão
import User from "../models/User.js";

async function seed() {
  try {
    const email = "admin@teste.com";
    const password = "123456";
    const hashedPassword = await bcrypt.hash(password, 10);

    const exists = await User.findOne({ email });
    if (exists) {
      console.log("Usuário já existe. Nada a fazer.");
      process.exit(0);
    }

    await User.create({
      email,
      password: hashedPassword,
      name: "Administrador Teste"
    });

    console.log("Usuário seed criado com sucesso:");
    console.log("Login:", email);
    console.log("Senha:", password);

    process.exit(0);
  } catch (err) {
    console.error("Erro ao criar seed:", err);
    process.exit(1);
  }
}

seed();

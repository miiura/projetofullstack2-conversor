import React, { useState } from "react";
import { insertCurrency } from "../services/api";

export default function InsertCurrency() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [value, setValue] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await insertCurrency(token, {
      name,
      code,
      value: parseFloat(value)
    });

    setMsg(res.message || res.error);
  }

  return (
    <div>
      <h3>Inserir Nova Moeda</h3>

      {msg && <div className="alert alert-info">{msg}</div>}

      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" placeholder="Nome" onChange={(e) => setName(e.target.value)} />
        <input className="form-control mb-2" placeholder="Código (ex: USD)" onChange={(e) => setCode(e.target.value)} />
        <input className="form-control mb-2" type="number" placeholder="Valor" onChange={(e) => setValue(e.target.value)} />

        <button className="btn btn-dark">Salvar</button>
      </form>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { listCurrencies } from "../services/api";

export default function SearchCurrency() {
  const [currencies, setCurrencies] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("token");
      const res = await listCurrencies(token);

      if (res.error) setError(res.error);
      else setCurrencies(res);
    }

    load();
  }, []);

  return (
    <div>
      <h3>Moedas Cadastradas</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <ul className="list-group mt-3">
        {currencies.map((item) => (
          <li key={item._id} className="list-group-item">
            <strong>{item.name}</strong> ({item.code}) — Valor: {item.value}
          </li>
        ))}
      </ul>
    </div>
  );
}

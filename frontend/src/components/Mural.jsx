import { useState, useEffect, useCallback } from "react";
import { api } from "../contexts/api";

export default function Mural() {
  const [lista, setLista] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const buscar = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/suggestions", { params: { q } });
      setLista(response.data);
    } catch (error) {
      console.error("Erro ao buscar sugestões:", error);
      setLista([]);
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    buscar();
  }, [buscar]);

  return (
    <div>
      <h2>Mural de Sugestões</h2>

      <input 
        placeholder="Buscar moeda ou país" 
        value={q} 
        onChange={e => setQ(e.target.value)} 
      />

      <button onClick={buscar} className="btn btn-primary btn-lg">Buscar</button>

      <ul>
        {lista.map(s => (
          <li key={s._id}>
            <strong>{s.moeda}</strong> — {s.pais}
          </li>
        ))}
      </ul>
    </div>
  );
}

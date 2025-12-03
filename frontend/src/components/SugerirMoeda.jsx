import { useState } from "react";
import { api } from "../contexts/api";

export default function SugerirMoeda() {
  const [moeda, setMoeda] = useState("");
  const [pais, setPais] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function enviar() {
    if (!moeda || !pais) {
      setMsg("Preencha todos os campos!");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/suggestions", { moeda, pais });
      setMsg(response.data.message || "Sugestão enviada com sucesso!");
      setMoeda("");
      setPais("");
    } catch (error) {
      setMsg(error.response?.data?.error || "Erro ao enviar sugestão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Sugerir nova moeda</h2>

      <input 
        placeholder="Nome da moeda" 
        value={moeda} 
        onChange={e => setMoeda(e.target.value)} 
      />

      <input 
        placeholder="País" 
        value={pais} 
        onChange={e => setPais(e.target.value)} 
      />

      <button onClick={enviar} class="btn btn-primary btn-lg">Enviar sugestão</button>

      <p>{msg}</p>
    </div>
  );
}
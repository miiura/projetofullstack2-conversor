import { useState } from "react";
import { loginUser } from "../contexts/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser(email, password);
      const token = response.data.token;
      
      // Usar o contexto de autenticação
      login(token);
      
      // Navegar para o dashboard
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setError(error.response?.data?.message || "Erro ao fazer login. Verifique suas credenciais.");
      console.error("Erro de login:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">💱 Conversor de Moedas</h1>
        <p className="login-subtitle">Acesse sua conta</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <label>Senha</label>
          <input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="login-footer">
          Não tem conta? <span className="text-primary">Entre em contato</span>
        </p>
      </div>
    </div>
  );
}

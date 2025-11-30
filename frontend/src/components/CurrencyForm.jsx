import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function CurrencyForm() {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post('/currencies', {
        code: code.trim(),
        name: name.trim(),
        description: description.trim(),
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card mx-auto" style={{ maxWidth: 720 }}>
      <div className="card-header">
        <h5 className="mb-0">Cadastrar nova moeda</h5>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Código</label>
              <input
                className="form-control"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="ex: USD"
                required
                maxLength={5}
              />
            </div>

            <div className="col-md-9">
              <label className="form-label">Nome</label>
              <input
                className="form-control"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="ex: Dólar Americano"
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label">Descrição (opcional)</label>
              <textarea
                className="form-control"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows="3"
                placeholder="Descrição da moeda"
              />
            </div>

            <div className="col-12 d-flex justify-content-end">
              <button className="btn btn-secondary me-2" type="button" onClick={() => navigate(-1)}>
                Cancelar
              </button>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

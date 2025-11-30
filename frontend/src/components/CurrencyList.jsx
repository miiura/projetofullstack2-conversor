import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { logout } from '../utils/auth';

export default function CurrencyList() {
  const [term, setTerm] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fromCache, setFromCache] = useState(false);

  async function fetchList(search = '') {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/currencies', { params: { search } });
      setFromCache(!!res.data.fromCache);
      setItems(res.data.data || []);
    } catch (err) {
      if (err.response?.status === 401) return logout();
      setError(err.response?.data?.error || 'Erro ao buscar');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    fetchList(term);
  }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-0">Minhas moedas</h5>
          {fromCache && <small className="text-muted">Resultados em cache</small>}
        </div>

        <div>
          <Link className="btn btn-sm btn-outline-primary me-2" to="/new">
            Cadastrar nova
          </Link>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}>
            Sair
          </button>
        </div>
      </div>

      <div className="card-body">
        <form className="row g-2 mb-3" onSubmit={handleSearch}>
          <div className="col-auto" style={{ flex: 1 }}>
            <input
              className="form-control"
              placeholder="Buscar por código ou nome"
              value={term}
              onChange={e => setTerm(e.target.value)}
            />
          </div>
          <div className="col-auto">
            <button className="btn btn-primary me-2" type="submit">Buscar</button>
            <button className="btn btn-outline-secondary" type="button" onClick={() => { setTerm(''); fetchList(); }}>Limpar</button>
          </div>
        </form>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border" role="status" aria-hidden="true"></div>
            <div className="mt-2">Carregando...</div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-center text-muted py-4">Nenhuma moeda cadastrada ainda.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Código</th>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {items.map(it => (
                  <tr key={it._id}>
                    <td><strong>{it.code}</strong></td>
                    <td>{it.name}</td>
                    <td>{it.description || '—'}</td>
                    <td>{new Date(it.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

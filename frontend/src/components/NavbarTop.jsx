import React from "react";

export default function NavbarTop({ setPage, logout }) {
  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <span className="navbar-brand">Conversor de Moedas</span>

      <div>
        <button className="btn btn-light mx-1" onClick={() => setPage("home")}>
          Home
        </button>
        <button className="btn btn-light mx-1" onClick={() => setPage("insert")}>
          Inserir Moeda
        </button>
        <button className="btn btn-light mx-1" onClick={() => setPage("search")}>
          Buscar Moedas
        </button>
        <button className="btn btn-danger mx-1" onClick={logout}>
          Sair
        </button>
      </div>
    </nav>
  );
}

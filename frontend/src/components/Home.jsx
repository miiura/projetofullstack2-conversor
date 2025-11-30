import React from "react";
import InsertCurrency from "./InsertCurrency";
import SearchCurrency from "./SearchCurrency";

export default function Home({ setPage, mode }) {
  return (
    <div className="container mt-4">
      {!mode && (
        <div className="text-center">
          <h3>Bem-vindo ao Conversor de Moedas</h3>
          <p>Escolha uma opção no menu acima.</p>
        </div>
      )}

      {mode === "insert" && <InsertCurrency />}
      {mode === "search" && <SearchCurrency />}
    </div>
  );
}

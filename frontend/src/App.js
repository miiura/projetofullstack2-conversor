import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Home from "./components/Home";
import NavbarTop from "./components/NavbarTop";

function App() {
  const [page, setPage] = useState("login"); // "login", "home", "insert", "search"
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLogged(true);
      setPage("home");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogged(false);
    setPage("login");
  };

  return (
    <div>
      {isLogged && <NavbarTop setPage={setPage} logout={handleLogout} />}

      {!isLogged && <Login onLogin={() => {
          setIsLogged(true);
          setPage("home");
      }} />}

      {isLogged && page === "home" && <Home setPage={setPage} />}
      {isLogged && page === "insert" && <Home setPage={setPage} mode="insert" />}
      {isLogged && page === "search" && <Home setPage={setPage} mode="search" />}
    </div>
  );
}

export default App;

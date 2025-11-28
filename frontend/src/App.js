import React, { useState, useEffect } from 'react';
import CurrencyConverter from './components/CurrencyConverter';
import ConversionHistory from './components/ConversionHistory';
import Login from './components/Login';
import Header from './components/Header';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('converter');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setActiveTab('converter');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <Header user={user} onLogout={handleLogout} />
      
      <nav className="app-nav">
        <button 
          className={activeTab === 'converter' ? 'active' : ''}
          onClick={() => setActiveTab('converter')}
        >
          Currency Converter
        </button>
        <button 
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          Conversion History
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'converter' && (
          <CurrencyConverter user={user} />
        )}
        {activeTab === 'history' && (
          <ConversionHistory />
        )}
      </main>
    </div>
  );
}

export default App;
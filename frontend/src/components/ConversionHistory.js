import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ConversionHistory.css';

const ConversionHistory = () => {
  const [conversions, setConversions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    fromCurrency: '',
    toCurrency: ''
  });
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, []);

  const fetchHistory = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...filters
      });

      const response = await axios.get(
        `http://localhost:5000/api/conversions/history?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setConversions(response.data.data.conversions);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/conversions/stats',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setStats(response.data.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value.toUpperCase()
    });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchHistory(1);
  };

  return (
    <div className="history-container">
      <h2>Conversion History</h2>
      
      {/* Statistics */}
      <div className="stats-section">
        <h3>Your Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">{stats.totalConversions || 0}</span>
            <span className="stat-label">Total Conversions</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              ${(stats.totalAmountConverted || 0).toFixed(2)}
            </span>
            <span className="stat-label">Total Amount Converted</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <form className="filters-form" onSubmit={handleFilterSubmit}>
        <input
          type="text"
          name="fromCurrency"
          placeholder="From Currency (e.g., USD)"
          value={filters.fromCurrency}
          onChange={handleFilterChange}
          maxLength={3}
        />
        <input
          type="text"
          name="toCurrency"
          placeholder="To Currency (e.g., EUR)"
          value={filters.toCurrency}
          onChange={handleFilterChange}
          maxLength={3}
        />
        <button type="submit">Filter</button>
      </form>

      {/* Conversion List */}
      <div className="conversions-list">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : conversions.length === 0 ? (
          <div className="no-data">No conversions found</div>
        ) : (
          conversions.map((conversion) => (
            <div key={conversion._id} className="conversion-item">
              <div className="conversion-main">
                <span className="amount">
                  {conversion.amount} {conversion.fromCurrency}
                </span>
                <span className="arrow">→</span>
                <span className="amount">
                  {conversion.convertedAmount.toFixed(2)} {conversion.toCurrency}
                </span>
              </div>
              <div className="conversion-details">
                <span>Rate: 1 {conversion.fromCurrency} = {conversion.rate} {conversion.toCurrency}</span>
                <span className="date">
                  {new Date(conversion.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversionHistory;
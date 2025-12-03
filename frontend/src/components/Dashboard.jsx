import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { useState } from 'react';
import CurrencyConverter from './CurrencyConverter';
import CurrencyInfo from './CurrencyInfo';
import SugerirMoeda from './SugerirMoeda';
import Mural from './Mural';
import LogoutButton from './LogoutButton';
import './Dashboard.css';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('converter');

  return (
    <Container fluid className="dashboard-container py-4">
      {/* Header com logout */}
      <Row className="mb-4 align-items-center">
        <Col md={8}>
          <h1 className="text-center mb-0">💱 Conversor de Moedas</h1>
        </Col>
        <Col md={4} className="text-end">
          <LogoutButton />
        </Col>
      </Row>

      {/* Abas de navegação */}
      <Row className="mb-4">
        <Col md={12}>
          <Nav className="nav-tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            <Nav.Item>
              <Nav.Link eventKey="converter" className="nav-link-custom">
                Conversor
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="sugerir" className="nav-link-custom">
                Sugerir Moeda
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="mural" className="nav-link-custom">
                Mural de Sugestões
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>

      {/* Conteúdo das abas */}
      <Row className="justify-content-center">
        <Col md={8}>
          {/* Tab: Conversor */}
          {activeTab === 'converter' && (
            <div className="tab-content">
              <p className="text-center text-muted mb-5">
                Converta moedas usando React useReducer + Context API
              </p>
              <CurrencyConverter />
              <CurrencyInfo />
            </div>
          )}

          {/* Tab: Sugerir Moeda */}
          {activeTab === 'sugerir' && (
            <div className="tab-content">
              <SugerirMoeda />
            </div>
          )}

          {/* Tab: Mural */}
          {activeTab === 'mural' && (
            <div className="tab-content">
              <Mural />
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

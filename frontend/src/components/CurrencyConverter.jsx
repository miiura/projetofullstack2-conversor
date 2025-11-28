import React, { useState } from 'react';
import { Form, Button, Row, Col, InputGroup, Card, Alert } from 'react-bootstrap';
import { useCurrency } from '../contexts/CurrencyContext';

const CurrencyConverter = () => {
  const { state, actions } = useCurrency();
  const [localErrors, setLocalErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!state.amount || state.amount.trim() === '') {
      errors.amount = 'Campo obrigatório';
    } else if (isNaN(state.amount) || parseFloat(state.amount) <= 0) {
      errors.amount = 'Valor deve ser um número maior que 0';
    }
    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      actions.performConversion();
    }
  };

  const popularMoedas = [
    { code: 'USD', name: 'Dólar Americano', flag: '🇺🇸' },
    { code: 'BRL', name: 'Real Brasileiro', flag: '🇧🇷' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'Libra Esterlina', flag: '🇬🇧' },
    { code: 'JPY', name: 'Iene Japonês', flag: '🇯🇵' }
  ];

  return (
    <>
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title className="text-center mb-4">
            Conversor de Moedas
          </Card.Title>
          
          {state.error && (
            <Alert variant="danger" dismissible onClose={actions.resetError}>
              ⚠️ {state.error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* Campo Valor */}
            <Form.Group className="mb-4">
              <Form.Label>Valor a converter:</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="number"
                  step="0.01"
                  placeholder="Ex: 100.00"
                  value={state.amount}
                  onChange={(e) => actions.setAmount(e.target.value)}
                  isInvalid={!!localErrors.amount}
                  disabled={state.loading}
                />
                <Form.Control.Feedback type="invalid">
                  {localErrors.amount}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Row className="mb-4">
              {/* Moeda de Origem */}
              <Col md={5}>
                <Form.Group>
                  <Form.Label>De:</Form.Label>
                  <Form.Select
                    value={state.fromCurrency}
                    onChange={(e) => actions.setFromCurrency(e.target.value)}
                    disabled={state.loading}
                  >
                    {popularMoedas.map(moeda => (
                      <option key={moeda.code} value={moeda.code}>
                        {moeda.flag} {moeda.name} ({moeda.code})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Botão de Trocar */}
              <Col md={2} className="d-flex align-items-end justify-content-center">
                <Button 
                  variant="outline-secondary" 
                  onClick={actions.swapCurrencies}
                  disabled={state.loading}
                >
                  ⇄
                </Button>
              </Col>

              {/* Moeda de Destino */}
              <Col md={5}>
                <Form.Group>
                  <Form.Label>Para:</Form.Label>
                  <Form.Select
                    value={state.toCurrency}
                    onChange={(e) => actions.setToCurrency(e.target.value)}
                    disabled={state.loading}
                  >
                    {popularMoedas.map(moeda => (
                      <option key={moeda.code} value={moeda.code}>
                        {moeda.flag} {moeda.name} ({moeda.code})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Botão Converter */}
            <div className="d-grid">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={state.loading}
                size="lg"
              >
                {state.loading ? '🔄 Convertendo...' : 'Converter'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Resultado */}
      {state.result && (
        <Card className="border-success">
          <Card.Body className="text-center">
            <h4>✅ Conversão Realizada!</h4>
            <p className="h5 text-success">
              {state.amount} {state.fromCurrency} = {state.result} {state.toCurrency}
            </p>
            {state.lastUpdate && (
              <small className="text-muted">Atualizado: {state.lastUpdate}</small>
            )}
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default CurrencyConverter;
